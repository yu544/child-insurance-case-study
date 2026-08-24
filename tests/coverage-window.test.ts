import assert from "node:assert/strict"
import test from "node:test"

import { buildCoverageDedupeKey, resolveCoverageWindow } from "../src/coverage-window/index.ts"

test("uses calendar day as insurance coverage key", () => {
  const mondayNight = new Date("2026-08-24T12:00:00.000Z")
  const window = resolveCoverageWindow(0, mondayNight)
  assert.equal(window.date, "2026-08-24")
  assert.equal(window.endAt, "2026-08-24 23:59:59")
  assert.equal(buildCoverageDedupeKey("child-1", window.date), "child-1:2026-08-24")
})

test("starts future-day coverage at midnight", () => {
  const now = new Date("2026-08-24T12:34:56.000Z")
  const window = resolveCoverageWindow(1, now)
  assert.equal(window.date, "2026-08-25")
  assert.equal(window.startAt, "2026-08-25 00:00:00")
  assert.equal(window.endAt, "2026-08-25 23:59:59")
})

