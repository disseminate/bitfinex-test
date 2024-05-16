import * as React from "react";
import BitfinexSocket, { TBitfinexBookEntry } from "../api/socket";
import { EBidType, IBookEntry, update } from "../store/reducers/book";
import { useAppDispatch, useAppSelector } from "../store/store";

const Book = () => {
  const [socket, setSocket] = React.useState<BitfinexSocket>();
  React.useEffect(() => {
    setSocket(new BitfinexSocket());
  }, []);

  const dispatch = useAppDispatch();

  const onBookData = React.useCallback((data: TBitfinexBookEntry[]) => {
    const processedData: IBookEntry[] = data.map((entry) => ({
      price: entry[0],
      count: entry[1],
      amount: Math.abs(entry[2]),
      type: entry[2] < 0 ? EBidType.Bid : EBidType.Ask,
    }));
    dispatch(update(processedData));
  }, []);

  React.useEffect(() => {
    if (socket) {
      socket.onBookData(onBookData);
    }
  }, [socket]);

  const state = useAppSelector((state) => state.book.entries);

  return <div>{JSON.stringify(state)}</div>;
};

export default Book;
