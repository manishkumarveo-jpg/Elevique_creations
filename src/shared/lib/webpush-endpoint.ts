// Restricts Web Push subscription endpoints to known browser push services,
// so an attacker (any authenticated team_member/admin — the only roles that
// can create a subscription) can't register an arbitrary internal/private
// URL as their "push endpoint" and have the server (webpush.sendNotification)
// make an outbound request to it. Checked both at subscribe time (schema)
// and at delivery time (defense in depth against any other insertion path).
//
// Residual risk: this validates the hostname string, not the IP it resolves
// to at delivery time — it does not protect against DNS rebinding (a domain
// that resolves to an allowed host now and an internal IP later). Closing
// that fully requires delivery-time DNS-pinning or network egress controls,
// which are out of scope here.
const ALLOWED_PUSH_HOSTS = [
  /^fcm\.googleapis\.com$/,
  /^android\.googleapis\.com$/,
  /^updates\.push\.services\.mozilla\.com$/,
  /^web\.push\.apple\.com$/,
  /\.notify\.windows\.com$/,
]

export function isAllowedPushEndpoint(rawUrl: string): boolean {
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    return false
  }
  if (url.protocol !== 'https:') return false
  return ALLOWED_PUSH_HOSTS.some(pattern => pattern.test(url.hostname))
}
