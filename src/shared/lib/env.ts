function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable: ${name}`)
  return value
}

// IANA zone notification/meeting times are formatted in, independent of the
// deployment server's local timezone. Elevique operates out of India.
export const PRODUCT_TIMEZONE = 'Asia/Kolkata'

export const env = {
  get supabaseUrl() { return requireEnv('NEXT_PUBLIC_SUPABASE_URL') },
  get supabaseAnonKey() { return requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') },
  get supabaseServiceRoleKey() { return requireEnv('SUPABASE_SERVICE_ROLE_KEY') },
  get upstashRedisUrl() { return requireEnv('UPSTASH_REDIS_REST_URL') },
  get upstashRedisToken() { return requireEnv('UPSTASH_REDIS_REST_TOKEN') },
  get resendApiKey() { return requireEnv('RESEND_API_KEY') },
  get vapidPrivateKey() { return requireEnv('VAPID_PRIVATE_KEY') },
  get vapidSubject() { return requireEnv('VAPID_SUBJECT') },
}