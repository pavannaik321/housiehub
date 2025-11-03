"use client";
import { useEffect, useState } from "react";
import { socket } from "../../../lib/socket";
import { useRouter } from "next/navigation";

export default function PlayPage() {
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [winner, setWinner] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch the current room data from backend when page loads or reloads
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("playerData"));
    if (!saved?.roomId || !saved?.userId) return;

    async function fetchRoom() {
      try {
        const res = await fetch(`https://housiehub-admin.onrender.com/api/rooms/${saved.roomId}`);
        const data = await res.json();
        setRoom(data);
        setCalledNumbers(data.calledNumbers || []);
        setWinner(data.winnerId || null);

        const player = data.players.find((p) => p.userId === saved.userId);
        setTicket(player?.ticket || saved.ticket || []);
        setLoading(false);
      } catch (err) {
        console.error("fetchRoom failed:", err);
        setLoading(false);
      }
    }

    fetchRoom();

    // 🔁 handle reconnect and rejoin
    function handleConnect() {
      console.log("✅ Socket reconnected:", socket.id);
      const saved = JSON.parse(localStorage.getItem("playerData"));
      if (!saved) return;
      socket.emit("joinRoom", {
        roomId: saved.roomId,
        userId: saved.userId,
        name: saved.name,
        ticket: saved.ticket,
      });
    }

    socket.on("connect", handleConnect);
    handleConnect(); // first join immediately

    socket.on("numberCalled", (num) =>
      setCalledNumbers((prev) => (prev.includes(num) ? prev : [...prev, num]))
    );

    socket.on("gameOver", ({ winnerId, name }) => {
      const saved = JSON.parse(localStorage.getItem("playerData"));
      if (winnerId === saved.userId) alert("🎉 You won!");
      else alert(`🏆 ${name || "Someone"} won.`);
      setWinner(winnerId);
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("numberCalled");
      socket.off("gameOver");
    };
  }, []);
  // Socket event listeners
  useEffect(() => {
    if (!room?.id) return;

    socket.emit("startGame", { roomId: room.id });

    socket.on("numberCalled", (num) =>
      setCalledNumbers((prev) => (prev.includes(num) ? prev : [...prev, num]))
    );

    // socket.on("gameOver", (data) => setWinner(data.winnerId));
    socket.on('gameOver', ({ winnerId, name }) => {
      if (winnerId === saved.userId) {
        alert(`🎉 You won the game!`);
      } else {
        alert(`🏆 ${name || 'Another player'} won the game.`);
      }
    });
    

    return () => {
      socket.off("numberCalled");
      socket.off("gameOver");
    };
  }, [room?.id]);

  const handleExitGame = () => {
    const saved = JSON.parse(localStorage.getItem("playerData"));
    if (saved?.roomId) {
      socket.emit("leaveRoom", { roomId: saved.roomId });
    }
    localStorage.removeItem("playerData");
    router.push("/rooms");
  };

  const isCalled = (num) => calledNumbers.includes(num);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading room data...
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
        Room not found or session expired.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Game Board</h1>

      {/* All numbers */}
      <div className="grid grid-cols-10 gap-2 mb-6">
        {Array.from({ length: 90 }, (_, i) => i + 1).map((num) => (
          <div
            key={num}
            className={`w-10 h-10 flex items-center justify-center rounded border text-sm font-medium ${
              isCalled(num) ? "bg-green-500 text-white" : "bg-white"
            }`}
          >
            {num}
          </div>
        ))}
      </div>

      {/* Player’s Ticket */}
      {ticket && (
        <div className="border rounded-lg p-4 shadow bg-white w-full max-w-md mb-6">
          <h2 className="text-xl font-semibold mb-3 text-center">
            🎟️ {room.players.find((p) => p.userId === JSON.parse(localStorage.getItem("playerData"))?.userId)?.name || "Your"} Ticket
          </h2>
          <div className="grid grid-rows-3 gap-2">
            {ticket.map((row, rowIdx) => (
              <div key={rowIdx} className="grid grid-cols-9 gap-1">
                {row.map((num, colIdx) => (
                  <div
                    key={colIdx}
                    className={`h-10 flex items-center justify-center border rounded ${
                      num && isCalled(num)
                        ? "bg-green-600 text-white line-through font-bold"
                        : num
                        ? "bg-yellow-50 text-gray-800"
                        : "bg-gray-100"
                    }`}
                  >
                    {num || ""}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Winner Display */}
      {winner ? (
     <div className="flex flex-col items-center gap-4">
     <div className="text-2xl text-green-600 font-bold animate-bounce">
       🎉 Winner: {winner}
     </div>
     <button
       onClick={handleExitGame}
       className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
     >
       Back to Rooms
     </button>
   </div>
      ) : (
        <p className="text-gray-600 text-lg">Game in progress...</p>
      )}
    </div>
  );
}
