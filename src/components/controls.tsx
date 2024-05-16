import * as React from "react";
import {
  TPricePrecision,
  setConnected,
  setPrecision,
} from "../store/reducers/book";
import { useAppDispatch, useAppSelector } from "../store/store";
import styled from "styled-components";

const ControlsContainer = styled.div`
  margin-bottom: 20px;
`;

const ConnectionControls = styled.div`
  margin-bottom: 10px;
`;

const ConnectionInfo = styled.span`
  margin-right: 20px;
`;

const IconButton = styled.button`
  cursor: pointer;
  text-decoration: none;
  color: white;
  background: none;
  border: none;
  outline: none;
  padding: 0;
  margin-right: 20px;

  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
`;

const Controls = () => {
  const dispatch = useAppDispatch();
  const precision = useAppSelector((state) => state.book.pricePrecision);
  const subscribed = useAppSelector((state) => state.book.subscribed);
  const connected = useAppSelector((state) => state.book.connected);

  const decrease = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (precision < 4) {
        dispatch(setPrecision((precision + 1) as TPricePrecision));
      }
    },
    [precision]
  );

  const increase = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (precision > 0) {
        dispatch(setPrecision((precision - 1) as TPricePrecision));
      }
    },
    [precision]
  );

  const disconnect = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      dispatch(setConnected(false));
    },
    []
  );

  const connect = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      dispatch(setConnected(true));
    },
    []
  );
  return (
    <ControlsContainer>
      <ConnectionControls>
        <ConnectionInfo>
          {subscribed ? "Connected and subscribed" : "Disconnected"}
        </ConnectionInfo>
        <IconButton onClick={disconnect} disabled={!connected}>
          Disconnect
        </IconButton>
        <IconButton onClick={connect} disabled={connected}>
          Connect
        </IconButton>
      </ConnectionControls>
      <div>
        <IconButton onClick={decrease} disabled={precision === 4}>
          Decrease Precision
        </IconButton>
        <IconButton onClick={increase} disabled={precision === 0}>
          Increase Precision
        </IconButton>
      </div>
    </ControlsContainer>
  );
};

export default Controls;
