import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { hot } from "react-hot-loader/root";

function App() {
  const [count, setCount] = useState<number>(0);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        count : {count}
        <button
          onClick={() => {
            setCount((c) => c + 1);
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            setCount((c) => c - 1);
          }}
        >
          -
        </button>
        <p>
          pEdit <code>src/renderer/App.tsx</code> and save to reload asd .
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          &nbsp;|&nbsp;
          <a
            className="App-link"
            href="https://webpack.electron.build"
            target="_blank"
            rel="noopener noreferrer"
          >
            electron-webpack
          </a>
          &nbsp;|&nbsp;
          <a
            className="App-link"
            href="http://typescriptlang.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Typescript
          </a>
        </p>
      </header>
    </div>
  );
}

export default hot(App);
