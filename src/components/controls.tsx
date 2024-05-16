import * as React from "react";
import { TPricePrecision, setPrecision } from "../store/reducers/book";
import { useAppDispatch, useAppSelector } from "../store/store";
import styled from "styled-components";

const ControlsContainer = styled.div`
  margin-bottom: 20px;
`;

const IconButton = styled.button`
  cursor: pointer;
  text-decoration: none;
  color: white;
  background: none;
  border: none;
  outline: none;
`;

const Controls = () => {
  const dispatch = useAppDispatch();
  const precision = useAppSelector((state) => state.book.pricePrecision);

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

  return (
    <ControlsContainer>
      <IconButton onClick={decrease} disabled={precision === 4}>
        Decrease Precision
      </IconButton>
      <IconButton onClick={increase} disabled={precision === 0}>
        Increase Precision
      </IconButton>
    </ControlsContainer>
  );
};

export default Controls;
