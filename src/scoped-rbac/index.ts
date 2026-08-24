export type Role = "coach" | "frontdesk" | "boss"

export type Actor = {
  role: Role
  storeId: string
}

export type Resource = {
  storeId: string
  action: "view_profile" | "confirm_profile" | "create_insurance" | "view_dashboard"
}

export function canAccess(actor: Actor, resource: Resource): boolean {
  if (actor.role === "boss") return true
  if (actor.storeId !== resource.storeId) return false
  if (actor.role === "frontdesk") return resource.action !== "create_insurance"
  if (actor.role === "coach") return resource.action === "view_profile" || resource.action === "create_insurance"
  return false
}

