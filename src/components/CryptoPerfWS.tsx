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
  icon: string;
}
const iconUrls: { [key: string]: string } = {
  btc: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  eth: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  trx: "https://cryptologos.cc/logos/tron-trx-logo.png",
  ada: "https://cryptologos.cc/logos/cardano-ada-logo.png",
  dot: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png?v=034",
  ltc: "https://cryptologos.cc/logos/litecoin-ltc-logo.png",
  xrp: "https://cryptologos.cc/logos/xrp-xrp-logo.png?v=034",
  link: "https://cryptologos.cc/logos/chainlink-link-logo.png",
  xlm: "https://cryptologos.cc/logos/stellar-xlm-logo.png",
  bch: "https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png",
  doge: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
  uni: "https://cryptologos.cc/logos/uniswap-uni-logo.png",
  usdt: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  sol: "https://cryptologos.cc/logos/solana-sol-logo.png",
  matic: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  etc: "https://cryptologos.cc/logos/ethereum-classic-etc-logo.png",
  vet: "https://cryptologos.cc/logos/vechain-vet-logo.png",
  zrx: "https://cryptologos.cc/logos/0x-zrx-logo.png",
  bnb: "https://cryptologos.cc/logos/bnb-bnb-logo.png?v=034",
  yfi: "https://cryptologos.cc/logos/yearn-finance-yfi-logo.png",
  snx: "https://cryptologos.cc/logos/synthetix-snx-logo.png",
  ldo: "https://cryptologos.cc/logos/lido-dao-ldo-logo.png?v=034",
  fil: "https://cryptologos.cc/logos/filecoin-fil-logo.png",
  aave: "https://cryptologos.cc/logos/aave-aave-logo.png",
  ftm: "https://cryptologos.cc/logos/fantom-ftm-logo.png",
  ren: "https://cryptologos.cc/logos/ren-ren-logo.png",
  cel: "https://cryptologos.cc/logos/celestia-tia-logo.png?v=034",
  bal: "https://cryptologos.cc/logos/balancer-bal-logo.png",
  chz: "https://cryptologos.cc/logos/chiliz-chz-logo.png",
  crv: "https://cryptologos.cc/logos/curve-dao-token-crv-logo.png",
  dydx: "https://cryptologos.cc/logos/dydx-dydx-logo.png",
  icp: "https://cryptologos.cc/logos/internet-computer-icp-logo.png",
  sand: "https://cryptologos.cc/logos/the-sandbox-sand-logo.png",
  xmr: "https://cryptologos.cc/logos/monero-xmr-logo.png",
  xec: "https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png?v=034",
  ftt: "https://cryptologos.cc/logos/ftx-token-ftt-logo.png",
  one: "https://cryptologos.cc/logos/harmony-one-logo.png",
  apec: "https://cryptologos.cc/logos/apecoin-ape-ape-logo.png?v=034",
  knc: "https://cryptologos.cc/logos/kyber-network-knc-logo.png",
  nuls: "https://cryptologos.cc/logos/nuls-nuls-logo.png",
  usdc: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=034",
  troy: "https://cryptologos.cc/logos/strong-strong-logo.png?v=034",
  eur: "https://cryptologos.cc/logos/stasis-euro-eurs-logo.png?v=034",
  celr: "https://cryptologos.cc/logos/celsius-cel-logo.png?v=034",
  ankr: "https://cryptologos.cc/logos/ankr-ankr-logo.png?v=034",
  stx: "https://cryptologos.cc/logos/stacks-stx-logo.png",
  atom: "https://cryptologos.cc/logos/cosmos-atom-logo.png",
  vite: "https://cryptologos.cc/logos/vite-vite-logo.png",
  neo: "https://cryptologos.cc/logos/neo-neo-logo.png",
  hbar: "https://cryptologos.cc/logos/hedera-hbar-logo.png",
  rlc: "https://cryptologos.cc/logos/rlc-rlc-logo.png?v=034",
  fet: "https://cryptologos.cc/logos/artificial-superintelligence-alliance-fet-logo.png?v=034",
  ogn: "https://cryptologos.cc/logos/origin-protocol-ogn-logo.png?v=034",
  iost: "https://cryptologos.cc/logos/iostoken-iost-logo.png?v=034",
  algo: "https://cryptologos.cc/logos/algorand-algo-logo.png",
  theta: "https://cryptologos.cc/logos/theta-theta-logo.png",
  tusd: "https://cryptologos.cc/logos/trueusd-tusd-logo.png?v=034",
  bat: "https://cryptologos.cc/logos/basic-attention-token-bat-logo.png",
  wan: "https://cryptologos.cc/logos/wanchain-wan-logo.png",
  rvn: "https://cryptologos.cc/logos/ravencoin-rvn-logo.png",
  hot: "https://cryptologos.cc/logos/holo-hot-logo.png",
  arpa: "https://cryptologos.cc/logos/arpa-chain-arpa-logo.png",
  band: "https://cryptologos.cc/logos/band-protocol-band-logo.png",
  iotx: "https://cryptologos.cc/logos/iotex-iotx-logo.png",
  xtz: "https://cryptologos.cc/logos/tezos-xtz-logo.png",
  nkn: "https://cryptologos.cc/logos/nkn-nkn-logo.png",
  zil: "https://cryptologos.cc/logos/zilliqa-zil-logo.png",
  mtl: "https://cryptologos.cc/logos/metal-mtl-logo.png?v=034",
  icx: "https://cryptologos.cc/logos/icon-icx-logo.png",
  ong: "https://cryptologos.cc/logos/strong-strong-logo.png?v=034",
  eos: "https://cryptologos.cc/logos/eos-eos-logo.png?v=034",
  ont: "https://cryptologos.cc/logos/ontology-ont-logo.png?v=034",
  enj: "https://cryptologos.cc/logos/enjin-coin-enj-logo.png",
  fun: "https://cryptologos.cc/logos/funfair-fun-logo.png",
  kav: "https://cryptologos.cc/logos/kava-kava-logo.png",
  tfuel: "https://cryptologos.cc/logos/theta-fuel-tfuel-logo.png?v=034",
  key: "https://cryptologos.cc/logos/kucoin-token-kcs-logo.png?v=034",
  ces: "https://cryptologos.cc/logos/celestia-tia-logo.png?v=034",
  zoc: "https://cryptologos.cc/logos/trezarcoin-tzc-logo.png?v=034",
  iota: "https://cryptologos.cc/logos/iota-iota-logo.png",
  qtum: "https://cryptologos.cc/logos/qtum-qtum-logo.png?v=034",
  cos: "https://cryptologos.cc/logos/cosmos-atom-logo.png?v=034",
  dusk: "https://cryptologos.cc/logos/davos-protocol-dusd-logo.png?v=034",
  ctx: "https://cryptologos.cc/logos/cortex-ctxc-logo.png?v=034",
  win: "https://cryptologos.cc/logos/wing-wing-logo.png?v=034",
  cvc: "https://cryptologos.cc/logos/civic-cvc-logo.png?v=034"
};

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
        const symbolKey = tradeData.s.toLowerCase();
        const convertedPrice =
          currency === "usd"
            ? price
            : price * (exchangeRates[currency.toUpperCase()] || 1);

        const newCryptoData: CryptoData = {
          key: tradeData.t,
          symbol: tradeData.s,
          price: convertedPrice,
          icon: iconUrls[symbolKey.slice(0, -4)] || "ada"
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
      key: "symbol",
      render: (text: string, record: CryptoData) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={record.icon}
              alt={text}
              style={{ width: 24, height: 24, marginRight: 8 }}
            />
            {text.toUpperCase()}
          </div>
        );
      }
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
