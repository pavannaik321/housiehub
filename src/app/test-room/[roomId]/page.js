"use client";
import { useEffect, useState } from "react";
import { socket } from "../../../../lib/socket";
import Link from "next/link";
import { useParams } from "next/navigation";
export default function JoinRoom() {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState([]);
  const [ticket, setTicket] = useState(null);
  const [players, setPlayers] = useState([]);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");

  const { roomId } = useParams(); 
  const numbers = Array.from({ length: 90 }, (_, i) => i + 1);

  // Restore user info from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("playerData"));
    if (saved && saved.roomId === roomId) {
      setName(saved.name);
      setTicket(saved.ticket);
      setJoined(true);
      socket.emit("joinRoom", saved);
    }
  }, [roomId]);

  // Listen for player updates
  useEffect(() => {
    socket.on("playerListUpdate", (list) => setPlayers(list));
    return () => socket.off("playerListUpdate");
  }, []);

  // Handle number selection
  const toggleNumber = (num) => {
    if (selected.includes(num)) {
      setSelected(selected.filter((n) => n !== num));
    } else if (selected.length < 15) {
      setSelected([...selected, num]);
    } else {
      setError("You can only select 15 numbers.");
      setTimeout(() => setError(""), 1500);
    }
  };

  // Generate ticket layout (3x9)
  const generateTicket = () => {
    const sorted = [...selected].sort((a, b) => a - b);
    const ticketLayout = [[], [], []];
    let index = 0;
    for (let row = 0; row < 3; row++) {
      ticketLayout[row] = Array(9).fill("");
      for (let i = 0; i < 5; i++) {
        if (sorted[index]) ticketLayout[row][i] = sorted[index++];
      }
    }
    setTicket(ticketLayout);
  };

  // Join room and store data locally
  const joinRoom = () => {
    if (!name || !ticket) {
      setError("Enter your name and generate a ticket first.");
      return;
    }
    const playerData = {
      roomId,
      userId: Date.now().toString(),
      name,
      ticket,
    };
    localStorage.setItem("playerData", JSON.stringify(playerData));
    socket.emit("joinRoom", playerData);
    setJoined(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      {!joined ? (
        <div className="bg-white p-6 rounded shadow max-w-3xl w-full">
          <h1 className="text-2xl font-bold mb-4 text-center">Join Room</h1>

          <input
            className="border p-2 w-full rounded mb-4"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <h2 className="text-xl font-semibold mb-4 text-center">
            Pick 15 Numbers
          </h2>
          <div className="grid grid-cols-10 gap-2 mb-4">
            {numbers.map((num) => (
              <button
                key={num}
                onClick={() => toggleNumber(num)}
                className={`p-2 rounded border text-center ${
                  selected.includes(num)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="flex gap-4 justify-center mb-4">
            <button
              onClick={generateTicket}
              disabled={selected.length !== 15}
              className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400"
            >
              Generate Ticket
            </button>
            <button
              onClick={() => {
                setSelected([]);
                setTicket(null);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Reset
            </button>
          </div>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          {ticket && (
            <div className="mt-4">
              <div className="grid grid-rows-3 gap-2 border border-black p-2 mb-4">
                {ticket.map((row, rowIdx) => (
                  <div key={rowIdx} className="grid grid-cols-9 gap-1">
                    {row.map((num, colIdx) => (
                      <div
                        key={colIdx}
                        className="h-10 flex items-center justify-center border"
                      >
                        {num || ""}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <button
                onClick={joinRoom}
                className="w-full py-3 bg-blue-600 text-white rounded-lg"
              >
                Join Game Room
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow max-w-lg w-full">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Players Joined
          </h2>
          <ul className="divide-y">
            {players.map((p, i) => (
              <li key={i} className="p-2 text-center">
                {p.name}
              </li>
            ))}
          </ul>

          <Link
            href="/test-play"
            className="block mt-6 text-center px-6 py-3 bg-green-600 text-white rounded-lg"
          >
            Go to Play
          </Link>
        </div>
      )}
    </div>
  );
}
