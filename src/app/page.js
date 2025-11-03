"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h1 className="text-3xl font-bold mb-6">Welcome to HousieHub</h1>
      <Link
        href="/rooms"
        className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg"
      >
        View Room
      </Link>
      {/* <Link
        href="/join-room"
        className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg"
      >
        Join Room
      </Link> */}
    </div>
  );
}
