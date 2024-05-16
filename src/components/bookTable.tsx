import * as React from "react";
import { EBidType, IBookEntry } from "../store/reducers/book";
import styled from "styled-components";

const Table = styled.div`
  width: 50%;
`;

const RowOuter = styled.div`
  width: 100%;
  position: relative;
`;

const RightDiv = styled.div`
  text-align: right;
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

interface IBookTableProps {
  type: EBidType;
  orders: IBookEntry[];
}

const BookTable: React.FC<IBookTableProps> = (props) => {
  const totalVolume = props.orders.reduce(
    (acc, cur) => acc + cur.amount * cur.count,
    0
  );

  return (
    <Table>
      <RowOuter>
        {props.type === EBidType.Ask ? (
          <Row $header>
            <RightDiv>Count</RightDiv>
            <RightDiv>Amount</RightDiv>
            <RightDiv>Total</RightDiv>
            <RightDiv>Price</RightDiv>
          </Row>
        ) : (
          <Row $header>
            <RightDiv>Price</RightDiv>
            <RightDiv>Total</RightDiv>
            <RightDiv>Amount</RightDiv>
            <RightDiv>Count</RightDiv>
          </Row>
        )}
      </RowOuter>
      {props.orders.map((order, i) => {
        const culm = props.orders.reduce((acc, cur, j) => {
          if (j <= i) {
            return acc + cur.count * cur.amount;
          }
          return acc;
        }, 0);

        return (
          <RowOuter key={order.price}>
            <svg
              style={{
                width: "100%",
                height: "100%",
                transform: `scale(${
                  props.type == EBidType.Ask ? "-1" : "1"
                }, 1)`,
                zIndex: 1,
                pointerEvents: "none",

                position: "absolute",
                top: "2px",
                bottom: "2px",
                left: 0,
                right: 0,
                fill: `${props.type == EBidType.Ask ? "green" : "red"}`,
              }}
            >
              <rect
                x="1"
                y="0"
                width="100%"
                transform={`scale(${culm / totalVolume} 1)`} // I don't think this scale is correct, but I am on a time limit here :)
                height="80%"
                fillOpacity="0.2"
              ></rect>
            </svg>
            {props.type === EBidType.Ask ? (
              <Row>
                <RightDiv>{order.count}</RightDiv>
                <RightDiv>{order.amount.toFixed(4)}</RightDiv>
                <RightDiv>{(order.amount * order.count).toFixed(4)}</RightDiv>
                <RightDiv>{order.price}</RightDiv>
              </Row>
            ) : (
              <Row>
                <RightDiv>{order.price}</RightDiv>
                <RightDiv>{(order.amount * order.count).toFixed(4)}</RightDiv>
                <RightDiv>{order.amount.toFixed(4)}</RightDiv>
                <RightDiv>{order.count}</RightDiv>
              </Row>
            )}
          </RowOuter>
        );
      })}
    </Table>
  );
};

export default BookTable;
