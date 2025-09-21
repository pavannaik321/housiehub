import {createSlice} from "@reduxjs/toolkit";
import {createTicketFromUserSelection} from "../utils/ticketLogic";
const initialState = {
  selected: [],
  ticket: null,
  error: null,
  calledNumbers: [],
  gameWon: false,
};

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    toggleNumber: (state, action) => {
        const num = action.payload;
        if (state.selected.includes(num)) {
          state.selected = state.selected.filter(n => n !== num);
        } else {
          if (state.selected.length >= 15) {
            state.error = "You can only select 15 numbers";
            return;
          }
          state.selected.push(num);
        }
        state.error = null;
      },
      generateTicket: (state) => {
        try {
          state.ticket = createTicketFromUserSelection(state.selected);
          state.error = null;
        } catch (err) {
          state.error = err.message;
          state.ticket = null;
        }
      },
    reset: (state) => { /* unchanged + reset calledNumbers + gameWon */ 
      state.selected = [];
      state.ticket = null;
      state.error = null;
      state.calledNumbers = [];
      state.gameWon = false;
    },
    callNextNumber: (state) => {
      if (state.calledNumbers.length >= 90 || !state.ticket) return;
      let n;
      do {
        n = Math.floor(Math.random() * 90) + 1;
      } while (state.calledNumbers.includes(n));
      state.calledNumbers.push(n);

      // check win condition
      const flatTicket = state.ticket.flat().filter(Boolean);
      const allCalled = flatTicket.every(num =>
        state.calledNumbers.includes(num)
      );
      if (allCalled) {
        state.gameWon = true;
      }
    }
  },
});

export const { toggleNumber, generateTicket, reset, callNextNumber } = ticketSlice.actions;
export default ticketSlice.reducer;
