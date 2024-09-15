import React from "react";
import CryptoTracker from "./components/CryptoTracker";
import BinanceWebSocketTable from "./components/CryptoPerfWS";

const App = () => {
  return (
    <div>
      <CryptoTracker />
      <BinanceWebSocketTable />
    </div>
  );
};

export default App;
