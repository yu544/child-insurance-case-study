import assert from "node:assert/strict"
import test from "node:test"

import { canTransition, shouldEscalate, transition } from "../src/insurance-state-machine/index.ts"

test("does not allow old callbacks to overwrite insured status", () => {
  assert.equal(canTransition("insured", "insuring"), false)
  assert.equal(transition("insured", "insuring"), "insured")
})

test("escalates stale pending and insuring orders", () => {
  const now = new Date("2026-08-24T10:30:00.000Z")
  assert.equal(shouldEscalate("pending_underwrite", new Date("2026-08-24T10:00:00.000Z"), now), true)
  assert.equal(shouldEscalate("insuring", new Date("2026-08-24T10:10:00.000Z"), now), false)
  assert.equal(shouldEscalate("insuring", new Date("2026-08-24T09:50:00.000Z"), now), true)
})

