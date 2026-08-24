import assert from "node:assert/strict"
import test from "node:test"

import { validateInsuredName } from "../src/insured-name-guard/index.ts"

test("accepts Chinese names and minority separator", () => {
  assert.deepEqual(validateInsuredName("张小明"), { ok: true })
  assert.deepEqual(validateInsuredName("阿布都·小明"), { ok: true })
})

test("rejects test words and non-Chinese characters", () => {
  assert.equal(validateInsuredName("测试小明").ok, false)
  assert.equal(validateInsuredName("Demo小明").ok, false)
  assert.equal(validateInsuredName("张小明1").ok, false)
})

