"use client";
import { useDispatch, useSelector } from "react-redux";
import { callNextNumber } from "../../store/ticketSlice";

export default function Play() {
  const dispatch = useDispatch();
  const { ticket, calledNumbers, gameWon } = useSelector(state => state.ticket);
  const numbers = Array.from({ length: 90 }, (_, i) => i + 1);

  if (!ticket) {
    return (
      <div className="text-center mt-20">
        <p>⚠️ No ticket found. Go to <a href="/join-room" className="text-blue-600 underline">Join Room</a> first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Game Board</h2>

      <div className="grid grid-cols-10 gap-2 mb-6">
        {numbers.map(num => (
          <div
            key={num}
            className={`p-2 text-center border rounded 
              ${calledNumbers.includes(num) ? "bg-green-500 text-white" : "bg-gray-100"}
            `}
          >
            {num}
          </div>
        ))}
      </div>

      <div className="mb-6">
        <button
          onClick={() => dispatch(callNextNumber())}
          disabled={gameWon || calledNumbers.length >= 90}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
        >
          Call Next Number
        </button>
      </div>

      <h3 className="text-lg font-bold mb-2">Your Ticket</h3>
      <div className="grid grid-rows-3 gap-2 border border-black p-2">
        {ticket.map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-9 gap-1">
            {row.map((num, colIdx) => (
              <div
                key={colIdx}
                className={`h-10 flex items-center justify-center border 
                  ${num && calledNumbers.includes(num) ? "bg-yellow-300" : ""}
                `}
              >
                {num || ""}
              </div>
            ))}
          </div>
        ))}
      </div>
     

      {gameWon && (
        <>
        <p className="mt-6 text-2xl font-bold text-green-600 text-center">
          🎉 Congratulations! You WON!
        </p>

        <div className="flex gap-4 mt-6 justify-center">
        <a
          href="/join-room"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg"
        >
          Go to Join Room
        </a>
      </div>
        </>
      )}
    </div>
  );
}
