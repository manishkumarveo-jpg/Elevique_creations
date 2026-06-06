import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-gray-500">
          You don&apos;t have permission to view this page.
        </p>
        <Link
          href="/login"
          className="px-4 py-2 bg-[#6C47FF] text-white rounded-lg text-sm hover:bg-[#5835ee]"
        >
          Back to Login
        </Link>
      </div>
    </div>
  )
}
