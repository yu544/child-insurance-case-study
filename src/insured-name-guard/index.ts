const bannedWords = ["测试", "演示", "示例", "test", "demo", "sample"]
const chineseNamePattern = /^[\u4e00-\u9fa5]+(?:·[\u4e00-\u9fa5]+)?$/

export function validateInsuredName(name: string): { ok: true } | { ok: false; reason: string } {
  const value = name.trim()
  if (!value) return { ok: false, reason: "姓名不能为空" }
  if (!chineseNamePattern.test(value)) return { ok: false, reason: "姓名只能包含中文，少数民族姓名可包含居中的间隔号" }
  const lowered = value.toLowerCase()
  const hit = bannedWords.find((word) => lowered.includes(word))
  if (hit) return { ok: false, reason: `姓名不能包含 ${hit} 等测试字样` }
  return { ok: true }
}

export function assertValidInsuredName(name: string): void {
  const result = validateInsuredName(name)
  if (!result.ok) throw new Error(result.reason)
}

