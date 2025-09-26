"use client"

import { useSession, signIn, signOut } from "next-auth/react"

export default function Auth() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-md w-96 text-center">
          <img
            src={session.user?.image ?? "/default-avatar.png"}
            alt="profile"
            className="w-16 h-16 rounded-full mx-auto mb-3"
          />
          <h2 className="text-xl font-semibold mb-2">
            Welcome, {session.user?.name || session.user?.email}
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Signed in as {session.user?.email}
          </p>
          <button
            onClick={() => signOut()}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Sign out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">
          Sign in to your account
        </h2>

        <button
          onClick={() => signIn("github")}
          className="w-full flex items-center justify-center bg-gray-800 text-white py-2 rounded-lg mb-3 hover:bg-gray-900 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.8-.7 1.4-.9.1-.7.4-1.1.8-1.4-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.7 11.7 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.8 1.2 3.1 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
          </svg>
          Continue with GitHub
        </button>

        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 488 512"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
          >
            <path d="M488 261.8c0-17.8-1.6-35-4.6-51.8H249v98h135c-5.8 31.1-23.4 57.6-50 75.3v62h80.8c47.2-43.5 74.2-107.5 74.2-183.5z" />
            <path d="M249 492c67.2 0 123.6-22.4 164.8-60.7l-80.8-62c-22.4 15-51 24-84 24-64.5 0-119.2-43.4-138.8-101.9h-82v64.1C84.7 443.7 161.6 492 249 492z" />
            <path d="M110.2 291.4c-4.4-13.2-6.9-27.3-6.9-41.4s2.5-28.2 6.9-41.4v-64.1h-82C9.6 192.2 0 220.1 0 249.9s9.6 57.7 28.2 82.4l82-64.1z" />
            <path d="M249 97c35.9 0 68.3 12.4 93.6 36.9l70-70C372.6 24.5 316.2 0 249 0 161.6 0 84.7 56.3 28.2 138.2l82 64.1C129.8 140.4 184.5 97 249 97z" />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  )
}
