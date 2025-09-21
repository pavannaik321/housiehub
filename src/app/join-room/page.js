"use client";
import { useDispatch, useSelector } from "react-redux";
import { toggleNumber, generateTicket, reset } from "../../store/ticketSlice";
import Link from "next/link";

export default function JoinRoom() {
  const dispatch = useDispatch();
  const { selected, ticket, error } = useSelector(state => state.ticket);
  const numbers = Array.from({ length: 90 }, (_, i) => i + 1);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Pick Your 15 Numbers</h2>

      <div className="grid grid-cols-10 gap-2 mb-4">
        {numbers.map(num => (
          <button
            key={num}
            onClick={() => dispatch(toggleNumber(num))}
            className={`p-2 rounded border text-center 
              ${selected.includes(num) ? "bg-blue-500 text-white" : "bg-gray-100"}
            `}
          >
            {num}
          </button>
        ))}
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => dispatch(generateTicket())}
          disabled={selected.length !== 15}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400"
        >
          Generate Ticket
        </button>
        <button
          onClick={() => dispatch(reset())}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Reset
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {ticket && (
        <div>
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
          <Link
            href="/play"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Play Now
          </Link>
        </div>
      )}
    </div>
  );
}
