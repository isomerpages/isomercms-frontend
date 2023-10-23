import { SiteMemberRole } from "types/collaborators"

export const isAdminUser = (role?: SiteMemberRole): boolean => {
  return role === "ADMIN" || role === "ISOMERADMIN"
}
