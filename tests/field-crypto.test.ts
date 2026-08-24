import assert from "node:assert/strict"
import test from "node:test"

import { createFieldProtector, maskCertificate, maskPhone, hashPasscode, verifyPasscode } from "../src/field-crypto/index.ts"

test("encrypts field without storing plaintext and can decrypt it", () => {
  const protector = createFieldProtector("secret")
  const encrypted = protector.encrypt("张小明")
  assert.equal(encrypted.includes("张小明"), false)
  assert.equal(protector.decrypt(encrypted), "张小明")
})

test("blind index is deterministic for lookup without exposing plaintext", () => {
  const protector = createFieldProtector("secret")
  assert.equal(protector.blindIndex("110101201601010000"), protector.blindIndex("110101201601010000"))
  assert.notEqual(protector.blindIndex("110101201601010000"), protector.blindIndex("110101201601010001"))
})

test("masks certificate and phone", () => {
  assert.equal(maskCertificate("110101201601010000"), "1101 **** **** 0000")
  assert.equal(maskPhone("13800001234"), "138****1234")
})

test("hashes employee passcode", () => {
  const stored = hashPasscode("12345678")
  assert.equal(verifyPasscode("12345678", stored), true)
  assert.equal(verifyPasscode("00000000", stored), false)
})

