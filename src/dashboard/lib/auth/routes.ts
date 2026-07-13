// admin/team_member/client all sign in through the one unified /login page,
// which looks up the account's role after auth and redirects to its
// dashboard — see src/app/(auth)/login/page.tsx.
export const ROLE_ROUTES = {
  admin: {
    home: '/admin/dashboard',
    login: '/login',
    prefix: '/admin',
  },
  team_member: {
    home: '/team/dashboard',
    login: '/login',
    prefix: '/team',
  },
  client: {
    home: '/portal/dashboard',
    login: '/login',
    prefix: '/portal',
  },
} as const

export type Role = keyof typeof ROLE_ROUTES

export function getLoginPath(role: Role) {
  return ROLE_ROUTES[role].login
}

export function getHomePath(role: Role) {
  return ROLE_ROUTES[role].home
}
