export const ROLE_ROUTES = {
  admin: {
    home: '/admin/dashboard',
    login: '/admin/login',
    prefix: '/admin',
  },
  team_member: {
    home: '/team/dashboard',
    login: '/team/login',
    prefix: '/team',
  },
  client: {
    home: '/portal/dashboard',
    login: '/portal/login',
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
