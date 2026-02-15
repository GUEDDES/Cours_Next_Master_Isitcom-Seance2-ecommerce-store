import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-4 text-6xl font-bold text-red-600">403</h1>
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        Access Denied
      </h2>
      <p className="mb-6 text-gray-600">
        You do not have permission to view this page.
      </p>
      <Link
        href="/"
        className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
}
