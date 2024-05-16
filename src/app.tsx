import * as React from "react";
import { Provider } from "react-redux";
import Store from "./store/store";
import Book from "./components/book";

const App = () => {
  return (
    <Provider store={Store}>
      <Book />
    </Provider>
  );
};

export default App;
