import * as React from "react";
import { TPricePrecision, setConnected, setPrecision } from "../store/book";
import { useAppDispatch, useAppSelector } from "../store/store";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownLong,
  faLink,
  faLinkSlash,
  faUpLong,
} from "@fortawesome/free-solid-svg-icons";

const ControlsContainer = styled.div`
  margin-bottom: 20px;
`;

const ConnectionControls = styled.div`
  margin-bottom: 10px;
`;

const ConnectionInfo = styled.div`
  margin-bottom: 10px;
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
      <ConnectionInfo>
        {subscribed ? "Connected and subscribed" : "Disconnected"}
      </ConnectionInfo>
      <ConnectionControls>
        <IconButton onClick={disconnect} disabled={!connected || !subscribed}>
          <FontAwesomeIcon icon={faLinkSlash} />
        </IconButton>
        <IconButton onClick={connect} disabled={connected || subscribed}>
          <FontAwesomeIcon icon={faLink} />
        </IconButton>
      </ConnectionControls>
      <div>
        <IconButton
          onClick={decrease}
          disabled={precision === 4 || !subscribed || !connected}
        >
          <FontAwesomeIcon icon={faDownLong} />
        </IconButton>
        <IconButton
          onClick={increase}
          disabled={precision === 0 || !subscribed || !connected}
        >
          <FontAwesomeIcon icon={faUpLong} />
        </IconButton>
      </div>
    </ControlsContainer>
  );
};

export default Controls;
