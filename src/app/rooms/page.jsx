"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { socket } from "../../../lib/socket";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch room list from backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/rooms"); // backend API
        const data = await res.json();
        setRooms(data);
      } catch (e) {
        console.log("Error fetching rooms:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();

    // Live updates when room status changes
    socket.on("roomUpdate", (updatedRoom) => {
      setRooms((prev) =>
        prev.map((r) => (r.id === updatedRoom.id ? updatedRoom : r))
      );
    });

    return () => socket.off("roomUpdate");
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-medium">
        Loading rooms...
      </div>
    );
  }

  // Group rooms by status
  const upcoming = rooms.filter((r) => r.status === "waiting");
  const active = rooms.filter((r) => r.status === "running");
  const finished = rooms.filter((r) => r.status === "finished");

  const Section = ({ title, items, color }) => (
    <div className="mb-10">
      <h2 className={`text-2xl font-bold mb-4 text-${color}-600`}>{title}</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">No rooms available</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((room) => (
            <div
              key={room.id}
              className="border rounded-xl p-4 bg-white shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold mb-2">{room.id}</h3>
              <p className="text-sm text-gray-600">
                Entry Fee: ₹{room.entryFee} | Players: {room.players.length}
              </p>
              <p className="text-sm text-gray-600">
                Starts at: {new Date(room.startTime).toLocaleTimeString()}
              </p>

              {room.status === "waiting" ? (
                <Link
                  href={`/test-room/${room.id}`}
                  className="block mt-4 text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Join Room
                </Link>
              ) : room.status === "running" ? (
                <Link
                  href={`/rooms/${room.id}/play`}
                  className="block mt-4 text-center py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Watch / Play
                </Link>
              ) : (
                <Link
                  href={`/rooms/${room.id}/results`}
                  className="block mt-4 text-center py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  View Results
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">🎮 Game Rooms</h1>
      <Section title="🕓 Upcoming Rooms" items={upcoming} color="blue" />
      <Section title="🟢 Active Rooms" items={active} color="green" />
      <Section title="⚫ Completed Rooms" items={finished} color="gray" />
    </div>
  );
}
