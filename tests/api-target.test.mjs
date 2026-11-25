import assert from "node:assert/strict";
import test from "node:test";
import { apiTarget } from "../src/lib/api-target.ts";

test("production requires an explicit API target, while development can use loopback", () => {
  assert.throws(() => apiTarget(undefined, undefined, true), /required for a production build/);
  assert.equal(apiTarget(undefined, undefined, false), "http://127.0.0.1:5000/api");
  assert.equal(apiTarget(undefined, "https://legacy.example.com/api/", true), "https://legacy.example.com/api");
  assert.equal(apiTarget(" https://server.example.com/api/ ", "https://legacy.example.com/api", true), "https://server.example.com/api");
});

test("rejects invalid, private or credentialed production routes without echoing inputs", () => {
  for (const address of [
    "secret-invalid-value", "http://public.example.com/api", "https://127.0.0.1/api",
    "https://10.0.0.1/api", "https://192.168.1.1/api", "https://172.19.0.1/api",
    "https://salonbook.local/api", "https://[::1]/api", "https://user:test-secret@host.example.com/api",
    "https://host.example.com/api?token=test-secret", "https://host.example.com/api#test-secret",
    "https://host.example.com/api/extra",
  ]) {
    assert.throws(() => apiTarget(address, undefined, true), (error) =>
      error instanceof Error && error.message.includes("SALONBOOK_API_URL") && !error.message.includes(address));
  }
});
