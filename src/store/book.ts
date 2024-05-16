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
        state.entries[entry.price] = entry;

        // I noticed that the maximum returned entries from the order book total 50.
        // To avoid layout jitter, I will only delete zeroed entries when we need the space.
        // I think this can be done smarter but this is a timed programming test.
        while (
          Object.keys(state.entries).filter(
            (k) => state.entries[k].type === EBidType.Ask
          ).length > 25
        ) {
          let keys = Object.keys(state.entries);
          for (let i = keys.length - 1; i >= 0; i--) {
            if (
              state.entries[keys[i]].type === EBidType.Ask &&
              state.entries[keys[i]].count === 0
            ) {
              delete state.entries[keys[i]];
              break;
            }
          }
        }

        while (
          Object.keys(state.entries).filter(
            (k) => state.entries[k].type === EBidType.Bid
          ).length > 25
        ) {
          let keys = Object.keys(state.entries);
          for (let i = keys.length - 1; i >= 0; i--) {
            if (
              state.entries[keys[i]].type === EBidType.Bid &&
              state.entries[keys[i]].count === 0
            ) {
              delete state.entries[keys[i]];
              break;
            }
          }
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
