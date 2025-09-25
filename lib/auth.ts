import type { User } from "./types"

export interface AuthSession {
  user: User
  token: string
  expiresAt: Date
}
