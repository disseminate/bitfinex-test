import * as React from "react";
import { Provider } from "react-redux";
import Store from "./store/store";
import Book from "./components/book";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
* {
  font-family: Roboto, sans-serif;
  font-size: 11px;
  color: white;
}

html,
body {
  padding: 0;
  margin: 0;
  background-color: rgb(23, 45, 62);
}
`;

const App = () => {
  return (
    <Provider store={Store}>
      <GlobalStyle />
      <Book />
    </Provider>
  );
};

export default App;
