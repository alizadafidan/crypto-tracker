/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Fragment, useEffect, useState } from "react";
import { Table, message, Select } from "antd";
import { ColumnsType } from "antd/es/table";
import axios from "axios";

const { Option } = Select;

interface CryptoData {
  key: string;
  symbol: string;
  price: number;
}

const BinanceWebSocketTable: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [symbols, setSymbols] = useState<string[]>([]);
  const [currency, setCurrency] = useState<string>("usd");
  const [currencies, setCurrencies] = useState<string[]>([]);

  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>(
    {}
  );
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get<string[]>(
          "https://api.coingecko.com/api/v3/simple/supported_vs_currencies"
        );
        setCurrencies(response.data);
      } catch (err) {
        message.error("Failed to fetch currencies for Trading Table (429)");
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const response = await axios.get(
          "https://api.binance.com/api/v3/exchangeInfo"
        );
        const allSymbols = response.data.symbols
          .filter((symbol: any) => symbol.quoteAsset === "USDT")
          .map((symbol: any) => symbol.symbol.toLowerCase());
        const limitedSymbols = allSymbols.slice(0, 100);
        setSymbols(limitedSymbols);
      } catch (error) {
        message.error("Failed to fetch symbols");
        console.error("Failed to fetch symbols:", error);
      }
    };

    fetchSymbols();
  }, []);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        setExchangeRates(response.data.rates);
      } catch (error) {
        message.error("Failed to fetch exchange rates");
        console.error("Failed to fetch exchange rates:", error);
      }
    };

    fetchExchangeRates();
  }, []);

  useEffect(() => {
    if (symbols.length === 0) return;

    const createWebSocketConnection = (symbolsSubset: string[]) => {
      const wsUrl = `wss://stream.binance.com:9443/stream?streams=${symbolsSubset
        .map((symbol) => `${symbol}@trade`)
        .join("/")}`;

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connection opened");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const tradeData = data.data;
        const price = parseFloat(tradeData.p);

        const convertedPrice =
          currency === "usd"
            ? price
            : price * (exchangeRates[currency.toUpperCase()] || 1);

        const newCryptoData: CryptoData = {
          key: tradeData.t,
          symbol: tradeData.s,
          price: convertedPrice
        };

        setCryptoData((prevData) => {
          const existingIndex = prevData.findIndex(
            (item) => item.symbol === newCryptoData.symbol
          );
          if (existingIndex >= 0) {
            const updatedData = [...prevData];
            updatedData[existingIndex] = newCryptoData;
            return updatedData;
          } else {
            return [...prevData, newCryptoData].slice(-100);
          }
        });
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };

      return () => {
        ws.close();
      };
    };

    // ! The connection was slow. So I, split symbols into batches for multiple WebSocket connections
    const batchSize = 20;
    const symbolBatches = [];
    for (let i = 0; i < symbols.length; i += batchSize) {
      symbolBatches.push(symbols.slice(i, i + batchSize));
    }

    const cleanups = symbolBatches.map(createWebSocketConnection);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [symbols, currency, exchangeRates]);

  const columns: ColumnsType<CryptoData> = [
    {
      title: "Crypto Currency",
      dataIndex: "symbol",
      key: "symbol"
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${currency.toUpperCase()} ${price.toFixed(2)}`
    }
  ];

  return (
    <div className="container">
      <div className="performance-container">
        <h1 className="heading-title">Performance</h1>
        <div>
          {currencies.length > 0 && (
            <Fragment>
              <Select
                defaultValue={currency}
                style={{ width: 120 }}
                onChange={(value) => setCurrency(value)}
                disabled={currencies.length === 0}
              >
                {currencies.map((cur) => (
                  <Option key={cur} value={cur}>
                    {cur.toUpperCase()}
                  </Option>
                ))}
              </Select>
            </Fragment>
          )}
          <div>
            {currencies.length === 0 &&
              "Please wait for a minute and try again to get currencies for filtering table. Meanwhile you can analyze the real-time data below."}
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={cryptoData}
        pagination={{ pageSize: 10 }}
        rowKey="key"
      />
    </div>
  );
};

export default BinanceWebSocketTable;
