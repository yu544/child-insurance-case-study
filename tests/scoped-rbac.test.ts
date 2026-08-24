import assert from "node:assert/strict"
import test from "node:test"

import { canAccess } from "../src/scoped-rbac/index.ts"

test("frontdesk cannot access another store", () => {
  assert.equal(canAccess({ role: "frontdesk", storeId: "store-a" }, { storeId: "store-b", action: "confirm_profile" }), false)
})

test("coach can insure only within own store and cannot confirm profile", () => {
  assert.equal(canAccess({ role: "coach", storeId: "store-a" }, { storeId: "store-a", action: "create_insurance" }), true)
  assert.equal(canAccess({ role: "coach", storeId: "store-a" }, { storeId: "store-a", action: "confirm_profile" }), false)
})

test("boss is a superset role for small-store operations", () => {
  assert.equal(canAccess({ role: "boss", storeId: "hq" }, { storeId: "store-a", action: "confirm_profile" }), true)
  assert.equal(canAccess({ role: "boss", storeId: "hq" }, { storeId: "store-a", action: "create_insurance" }), true)
})

