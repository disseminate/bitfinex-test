import * as React from "react";
import BitfinexSocket, { TBitfinexBookEntry } from "../api/socket";
import {
  EBidType,
  IBookEntry,
  setSubscribed,
  update,
} from "../store/reducers/book";
import { useAppDispatch, useAppSelector } from "../store/store";
import styled from "styled-components";
import Controls from "./controls";
import BookTable from "./bookTable";

const Page = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 50px;
  box-sizing: border-box;
`;

const Container = styled.div`
  display: flex;
  justify-content: stretch;
  align-items: start;
  flex-wrap: nowrap;
`;

const Book = () => {
  const [socket, setSocket] = React.useState<BitfinexSocket>();
  React.useEffect(() => {
    setSocket(new BitfinexSocket());
  }, []);

  const connected = useAppSelector((state) => state.book.connected);
  React.useEffect(() => {
    if (socket) {
      if (connected) {
        socket.connect();
      } else {
        socket.disconnect();
      }
    }
  }, [socket, connected]);

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

  const onSubscriptionChanged = React.useCallback((subscribed: boolean) => {
    dispatch(setSubscribed(subscribed));
  }, []);

  React.useEffect(() => {
    if (socket) {
      socket.onBookData(onBookData);
      socket.onSubscriptionChanged(onSubscriptionChanged);
    }
  }, [socket]);

  const precision = useAppSelector((state) => state.book.pricePrecision);
  React.useEffect(() => {
    if (socket) {
      socket.setPricePrecision(precision);
    }
  }, [socket, precision]);

  const entries = useAppSelector((state) => state.book.entries);

  const bidOrders: IBookEntry[] = Object.keys(entries)
    .filter((k) => entries[k].type === EBidType.Bid)
    .map((k) => entries[k])
    .sort((a, b) => a.price - b.price);
  const askOrders: IBookEntry[] = Object.keys(entries)
    .filter((k) => entries[k].type === EBidType.Ask)
    .map((k) => entries[k])
    .sort((a, b) => b.price - a.price);

  return (
    <Page>
      <Controls />
      <Container>
        <BookTable type={EBidType.Ask} orders={askOrders} />
        <BookTable type={EBidType.Bid} orders={bidOrders} />
      </Container>
    </Page>
  );
};

export default Book;
