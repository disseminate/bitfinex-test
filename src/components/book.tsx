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

const Table = styled.div`
  width: 50%;
`;

interface IRowProps {
  $header?: boolean;
}

const Row = styled.div<IRowProps>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  text-transform: ${(props) => (props.$header ? "uppercase" : "initial")};
  opacity: ${(props) => (props.$header ? 0.6 : 1)};
`;

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
        <Table>
          <Row $header>
            <div>Count</div>
            <div>Amount</div>
            <div>Total</div>
            <div>Price</div>
          </Row>
          {askOrders.map((order) => (
            <Row key={order.price}>
              <div key={order.price + "-1"}>{order.count}</div>
              <div key={order.price + "-2"}>{order.amount.toFixed(4)}</div>
              <div key={order.price + "-3"}>
                {(order.amount * order.count).toFixed(4)}
              </div>
              <div key={order.price + "-4"}>{order.price}</div>
            </Row>
          ))}
        </Table>
        <Table>
          <Row $header>
            <div>Price</div>
            <div>Total</div>
            <div>Amount</div>
            <div>Count</div>
          </Row>
          {bidOrders.map((order) => (
            <Row key={order.price}>
              <div key={order.price + "-1"}>{order.price}</div>
              <div key={order.price + "-2"}>
                {(order.amount * order.count).toFixed(4)}
              </div>
              <div key={order.price + "-3"}>{order.amount.toFixed(4)}</div>
              <div key={order.price + "-4"}>{order.count}</div>
            </Row>
          ))}
        </Table>
      </Container>
    </Page>
  );
};

export default Book;
