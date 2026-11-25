import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const { chromium } = await import(pathToFileURL(join(process.env.RUNNER_TEMP, "salonbook-e2e/node_modules/playwright/index.mjs")).href);
const browser = await chromium.launch();
const origin = "http://127.0.0.1:3000";
const backend = "http://127.0.0.1:5000/api";
const password = "BrowserCi-" + randomUUID();
const email = randomUUID() + "@example.test";
const errors = [];

async function pageFor(context) {
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  return page;
}

try {
  const customer = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await pageFor(customer);
  await page.goto(origin);
  await page.getByRole("heading", { name: "Signature Offerings" }).waitFor();
  const catalogue = await (await fetch(backend + "/services?limit=6")).json();
  assert.equal(catalogue.data.length, 6);
  for (const service of catalogue.data) await page.getByRole("heading", { name: service.serviceName, exact: true }).waitFor();

  await page.goto(origin + "/services");
  const search = page.getByPlaceholder("Search by treatment name...");
  await search.fill(catalogue.data[0].serviceName);
  const serviceName = page.getByRole("heading", { name: catalogue.data[0].serviceName, exact: true });
  await serviceName.waitFor();
  await page.getByText("Showing 1 of 1 services").waitFor();
  await page.getByRole("link", { name: catalogue.data[0].serviceName, exact: true }).click();
  const timeSelect = page.locator(".booking-panel select");
  await timeSelect.locator("option").filter({ hasText: "09:30 AM" }).waitFor({ state: "attached" });
  await timeSelect.selectOption({ label: "09:30 AM" });
  await page.getByRole("button", { name: "Continue to sign in" }).click();
  await page.waitForURL(/\/sign-in\?booking=/);
  await page.getByRole("link", { name: "Create an Atelier Account" }).click();
  await page.getByLabel("Patron full name").fill("CI Patron");
  await page.getByLabel("Patron email address").fill(email);
  await page.getByLabel("Private security passphrase").fill(password);
  await page.locator('input[name="terms"]').check();
  await page.getByRole("button", { name: "Create Patron Account" }).click();
  await page.waitForURL(/\/services\/[^/]+\?booking=/);
  await page.reload();
  const submit = page.getByRole("button", { name: "Request appointment", exact: true });
  await submit.click();
  await page.waitForURL("**/customer/appointments");
  const appointment = page.locator(".appointment-card").filter({ hasText: catalogue.data[0].serviceName });
  await appointment.waitFor();
  await appointment.getByText("Pending", { exact: true }).waitFor();
  const id = await appointment.locator(".eyebrow").textContent();

  const adminContext = await browser.newContext();
  const admin = await pageFor(adminContext);
  await admin.goto(origin + "/sign-in");
  await admin.getByLabel("Patron email address").fill("admin@example.test");
  await admin.getByLabel("Private security passphrase").fill(process.env.SALONBOOK_CI_ADMIN_PASSWORD);
  await admin.getByRole("button", { name: "Sign In to Your Sanctuary" }).click();
  await admin.waitForURL("**/admin");
  await admin.goto(origin + "/admin/appointments");
  const managed = admin.getByRole("row").filter({ hasText: id });
  await managed.getByRole("button", { name: "Confirm", exact: true }).click();
  await managed.getByText("Confirmed", { exact: true }).waitFor();
  await page.reload();
  await appointment.getByText("Confirmed", { exact: true }).waitFor();
  await page.goto(origin + "/customer/transactions");
  await page.getByText("No payments yet.").waitFor();
  await page.goto(origin + "/admin");
  await page.waitForURL("**/sign-in");

  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/services", "/sign-in"]) {
      await page.goto(origin + route);
      await page.getByRole("heading", { level: 1 }).first().waitFor();
      const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
      assert.ok(dimensions.scroll <= dimensions.viewport + 2, route + " overflows at " + width);
    }
  }
  assert.deepEqual(errors, [], "Unhandled browser errors");
  console.log("Browser checks passed: six services, catalogue search, registration and booking resume, real appointment confirmation, role protection, payment history and mobile/tablet/desktop overflow.");
} finally {
  await browser.close();
}
