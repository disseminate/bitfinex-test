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

export type TPricePrecision = 0 | 1 | 2 | 3 | 4;

interface IBookState {
  entries: { [price: number]: IBookEntry };
  pricePrecision: TPricePrecision;
  subscribed: boolean;
  connected: boolean;
}

const initialState: IBookState = {
  entries: {},
  pricePrecision: 0,
  subscribed: false,
  connected: true,
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
    setPrecision: (state, action: PayloadAction<TPricePrecision>) => {
      state.pricePrecision = action.payload;
    },
    setSubscribed: (state, action: PayloadAction<boolean>) => {
      state.subscribed = action.payload;
      if (!action.payload) {
        state.entries = {};
      }
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
      state.subscribed = false;
      if (!action.payload) {
        state.entries = {};
      }
    },
  },
});

export const { update, setPrecision, setSubscribed, setConnected } =
  bookSlice.actions;

export default bookSlice.reducer;
