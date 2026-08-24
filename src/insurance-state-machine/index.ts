export type InsuranceStatus =
  | "pending_underwrite"
  | "insuring"
  | "insured"
  | "failed"
  | "duplicate"
  | "needs_manual"

const rank: Record<InsuranceStatus, number> = {
  pending_underwrite: 1,
  insuring: 2,
  insured: 3,
  failed: 4,
  duplicate: 4,
  needs_manual: 4,
}

export function canTransition(from: InsuranceStatus, to: InsuranceStatus): boolean {
  if (from === to) return true
  if (from === "insured") return false
  return rank[to] >= rank[from]
}

export function transition(from: InsuranceStatus, to: InsuranceStatus): InsuranceStatus {
  if (!canTransition(from, to)) return from
  return to
}

export function shouldEscalate(status: InsuranceStatus, updatedAt: Date, now = new Date()): boolean {
  const minutes = (now.getTime() - updatedAt.getTime()) / 60_000
  if (status === "pending_underwrite") return minutes > 10
  if (status === "insuring") return minutes > 30
  return status === "failed" || status === "needs_manual"
}

