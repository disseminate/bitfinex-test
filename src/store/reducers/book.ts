import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export enum EBidType {
  Bid,
  Ask,
}

export interface IBookEntry {
  price: number;
  count: number;
  amount: number;
  type: EBidType;
}

interface IBookState {
  entries: { [price: number]: IBookEntry };
}

const initialState: IBookState = {
  entries: {},
};

export const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    update: (state, action: PayloadAction<IBookEntry[]>) => {
      for (const entry of action.payload) {
        if (entry.count === 0) {
          delete state.entries[entry.price];
        } else {
          state.entries[entry.price] = entry;
        }
      }
    },
  },
});

export const { update } = bookSlice.actions;

export default bookSlice.reducer;
