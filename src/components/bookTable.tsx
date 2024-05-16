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
            <div>Count</div>
            <div>Amount</div>
            <div>Total</div>
            <div>Price</div>
          </Row>
        ) : (
          <Row $header>
            <div>Price</div>
            <div>Total</div>
            <div>Amount</div>
            <div>Count</div>
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
                transform={`scale(${culm / totalVolume} 1)`}
                height="80%"
                fillOpacity="0.2"
              ></rect>
            </svg>
            {props.type === EBidType.Ask ? (
              <Row>
                <div>{order.count}</div>
                <div>{order.amount.toFixed(4)}</div>
                <div>{(order.amount * order.count).toFixed(4)}</div>
                <div>{order.price}</div>
              </Row>
            ) : (
              <Row>
                <div>{order.price}</div>
                <div>{(order.amount * order.count).toFixed(4)}</div>
                <div>{order.amount.toFixed(4)}</div>
                <div>{order.count}</div>
              </Row>
            )}
          </RowOuter>
        );
      })}
    </Table>
  );
};

export default BookTable;
