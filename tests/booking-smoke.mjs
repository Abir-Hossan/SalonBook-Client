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

  const catalogueRequests = "**/catalogue-api/services?*";
  const categoryRequests = "**/catalogue-api/services/categories";
  await page.route(catalogueRequests, (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<html><title>Service warming up</title></html>" }));
  await page.route(categoryRequests, (route) => route.abort());
  await page.goto(origin + "/services");
  await page.getByRole("heading", { name: "Catalogue unavailable" }).waitFor();
  await page.unroute(catalogueRequests);
  await page.getByRole("button", { name: "Try again" }).click();
  await page.getByText("Service categories could not load.").waitFor();
  await page.unroute(categoryRequests);
  await page.getByRole("button", { name: "Retry categories", exact: true }).click();
  await page.getByRole("group", { name: "Filter by category" })
    .getByRole("button", { name: catalogue.data[0].category, exact: true }).waitFor();
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
  const details = appointment.getByRole("button", { name: "View details" });
  await details.click();
  const dialog = page.getByRole("dialog", { name: "Appointment details" });
  await dialog.waitFor();
  assert.equal(await dialog.evaluate((element) => element.contains(document.activeElement)), true);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  assert.equal(await dialog.evaluate((element) => element.contains(document.activeElement)), true);
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  assert.equal(await details.evaluate((element) => element === document.activeElement), true);

  await page.goto(origin + "/payment/success?appointment=" + id);
  await page.getByText("Payment confirmation is pending.", { exact: false }).waitFor();
  await page.goto(origin + "/payment/cancel");
  await page.getByText("Check your appointment status.", { exact: false }).waitFor();
  await page.goto(origin + "/customer/transactions");
  await page.getByText("No payments yet.").waitFor();

  const serviceId = catalogue.data[0].id;
  const options = await (await fetch(backend + "/appointments/availability?serviceId=" + serviceId)).json();
  const nextDate = new Date(options.data.earliestDate + "T00:00:00Z");
  nextDate.setUTCDate(nextDate.getUTCDate() + 1);
  await page.goto(origin + "/services/" + serviceId);
  await timeSelect.locator("option").nth(1).waitFor({ state: "attached" });
  await page.locator('.booking-panel input[type="date"]').fill(nextDate.toISOString().slice(0, 10));
  await timeSelect.locator("option").filter({ hasText: "09:30 AM" }).waitFor({ state: "attached" });
  await timeSelect.selectOption({ label: "09:30 AM" });
  await submit.click();
  await page.waitForURL("**/customer/appointments");
  const pending = page.locator(".appointment-card").filter({ has: page.getByText("Pending", { exact: true }) });
  const cancelledId = await pending.locator(".eyebrow").textContent();
  await pending.getByRole("button", { name: "Cancel appointment" }).click();
  await pending.getByRole("button", { name: "Confirm", exact: true }).click();
  await page.locator(".appointment-card").filter({ hasText: cancelledId }).getByText("Cancelled", { exact: true }).waitFor();

  await page.goto(origin + "/customer/profile");
  await page.getByLabel("Full name").fill("Updated CI Patron");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByText("Profile saved.", { exact: false }).waitFor();
  await page.reload();
  assert.equal(await page.getByLabel("Full name").inputValue(), "Updated CI Patron");
  await admin.goto(origin + "/admin/services");
  await admin.getByRole("link", { name: "New service" }).click();
  const newService = "CI release verification service";
  await admin.getByLabel("Service name").fill(newService);
  await admin.getByLabel("Category").fill("CI category");
  await admin.getByLabel("Description").fill("Service created during isolated release acceptance.");
  await admin.getByLabel("Price (USD)").fill("45");
  await admin.getByLabel("Duration (minutes)").fill("60");
  await admin.getByLabel("Image URL").fill("https://i.ibb.co/example/salon.png");
  await admin.getByRole("button", { name: "Save service" }).click();
  await admin.waitForURL("**/admin/services");
  await admin.getByPlaceholder("Search services").fill(newService);
  const newServiceRow = admin.getByRole("row").filter({ hasText: newService });
  await newServiceRow.getByRole("link", { name: "Edit" }).click();
  await admin.getByLabel("Price (USD)").fill("35");
  await admin.getByLabel("Status").selectOption("inactive");
  await admin.getByRole("button", { name: "Save service" }).click();
  await admin.waitForURL("**/admin/services");
  await admin.getByPlaceholder("Search services").fill(newService);
  await newServiceRow.getByText("Inactive", { exact: true }).waitFor();
  await newServiceRow.getByText("$35.00", { exact: true }).waitFor();
  await newServiceRow.getByRole("button", { name: "Delete" }).click();
  await newServiceRow.getByRole("button", { name: "Confirm", exact: true }).click();
  await newServiceRow.waitFor({ state: "hidden" });

  await admin.goto(origin + "/admin/users");
  await admin.getByPlaceholder("Search users").fill(email);
  const patronRow = admin.getByRole("row").filter({ hasText: email });
  await patronRow.getByRole("button", { name: "Block", exact: true }).click();
  await patronRow.getByRole("button", { name: "Confirm", exact: true }).click();
  await patronRow.getByText("Blocked", { exact: true }).waitFor();
  await page.goto(origin + "/customer");
  await page.waitForURL("**/sign-in");
  await patronRow.getByRole("button", { name: "Unblock", exact: true }).click();
  await patronRow.getByRole("button", { name: "Confirm", exact: true }).click();
  await patronRow.getByText("Active", { exact: true }).waitFor();

  await page.goto(origin + "/admin");
  await page.waitForURL("**/sign-in");

  await page.goto(origin + "/customer");
  await page.getByRole("button", { name: "Sign out" }).click();
  await page.waitForURL("**/sign-in");
  await page.goto(origin + "/customer");
  await page.waitForURL("**/sign-in");

  for (const width of [390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/services", "/sign-in", "/sign-up"]) {
      await page.goto(origin + route);
      await page.getByRole("heading", { level: 1 }).first().waitFor();
      const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
      assert.ok(dimensions.scroll <= dimensions.viewport + 2, route + " overflows at " + width);
    }
  }
  assert.deepEqual(errors, [], "Unhandled browser errors");
  console.log("Browser checks passed: six services, catalogue error and retry, search, registration, booking resume, confirmation, cancellation, payment history, profile persistence, admin catalogue CRUD, blocking and unblocking, role protection, sign-out, keyboard dialog behavior, and four responsive widths.");
} finally {
  await browser.close();
}
