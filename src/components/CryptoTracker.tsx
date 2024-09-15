/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Select, Spin, Button } from "antd";
import "antd/dist/reset.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const { Option } = Select;

const CryptoTracker: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<[number, number][]>([]);
  const [cryptos, setCryptos] = useState<{ id: string; name: string }[]>([]);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [timePeriod, setTimePeriod] = useState<string>("30");
  const [currency, setCurrency] = useState<string>("usd");
  const [crypto, setCrypto] = useState<string>("bitcoin");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(60);

  const timeOptions = [
    { label: "1 Day", value: "1" },
    { label: "1 Month", value: "30" },
    { label: "1 Year", value: "365" }
  ];

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const cryptoResponse = await axios.get(
          "https://api.coingecko.com/api/v3/coins/list"
        );
        setCryptos(cryptoResponse.data);

        const currencyResponse = await axios.get(
          "https://api.coingecko.com/api/v3/simple/supported_vs_currencies"
        );
        setCurrencies(currencyResponse.data);
      } catch (error) {
        setError("Error fetching options. Please try again later.");
        console.error("Error fetching options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCryptoData(crypto, currency, timePeriod);
        setCryptoData(data.prices);
        setError(null);
        resetCountdown();
      } catch (error) {
        setError("Error fetching crypto data. Please try again in 1 minute.");
        console.error("Error fetching crypto data:", error);
      }
    };

    if (crypto && currency) {
      fetchData();
    }
  }, [crypto, currency, timePeriod]);

  const fetchCryptoData = async (
    cryptoId: string,
    vsCurrency: string,
    days: string
  ): Promise<{ prices: [number, number][] }> => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart`,
        {
          params: {
            vs_currency: vsCurrency,
            days: days
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      throw error;
    }
  };

  const limitDataPoints = (
    data: [number, number][],
    maxPoints: number
  ): [number, number][] => {
    if (data.length <= maxPoints) return data;
    const interval = Math.ceil(data.length / maxPoints);
    return data.filter((_, index) => index % interval === 0);
  };

  const chartData = {
    labels: limitDataPoints(
      cryptoData.map(([timestamp]): any => new Date(timestamp * 1000)),
      100
    ),
    datasets: [
      {
        label: `${
          crypto.charAt(0).toUpperCase() + crypto.slice(1)
        } Price in ${currency.toUpperCase()}`,
        data: limitDataPoints(
          cryptoData.map(([, price]: any) => price),
          100
        ),
        borderColor: "#22CC62",
        fill: false
      }
    ]
  };

  const timestamps = cryptoData.map(
    ([timestamp]) => new Date(timestamp * 1000)
  );
  const minTimestamp = timestamps.length
    ? new Date(Math.min(...timestamps.map((date) => date.getTime())))
    : new Date();
  const maxTimestamp = timestamps.length
    ? new Date(Math.max(...timestamps.map((date) => date.getTime())))
    : new Date();

  const timeRange = maxTimestamp.getTime() - minTimestamp.getTime();
  const stepSize = Math.max(
    1,
    Math.floor(timeRange / (1000 * 60 * 60 * 24 * 7))
  );

  const options: any = {
    responsive: true,
    // maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "MMMM d",
          displayFormats: {
            day: "MMM d"
          }
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 7,
          min: minTimestamp,
          max: maxTimestamp,
          stepSize: stepSize
        },
        grid: {
          display: true,
          borderColor: "#e0e0e0"
        }
      },
      y: {
        ticks: {
          callback: (value: number) => `${value.toLocaleString()}`,
          beginAtZero: false,
          maxTicksLimit: 6
        },
        grid: {
          borderColor: "#e0e0e0"
        }
      }
    }
  };

  useEffect(() => {
    if (countdown === 0) {
      window.location.reload();
    }
    const intervalId = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [countdown]);

  const resetCountdown = () => {
    setCountdown(60);
  };

  const handleRefresh = () => {
    window.location.reload();
    resetCountdown();
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <p>
          {error} Refreshing in: {countdown} seconds
        </p>
        <Button
          onClick={handleRefresh}
          type="default"
          style={{ marginTop: "10px", marginBottom: "50px" }}
        >
          Refresh Now
        </Button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="heading-container">
        <div className="heading-left-container">
          <h1 className="heading-title">Overview</h1>
          <div className="heading-desc">
            Showcasing the {crypto.toUpperCase()} in {currency.toUpperCase()}{" "}
            this {timePeriod} days
          </div>
        </div>
        <div className="filters-container">
          <div>
            <Select
              value={timePeriod}
              onChange={(value) => setTimePeriod(value as string)}
              style={{ width: 200 }}
            >
              {timeOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <Select
              value={currency}
              onChange={(value) => setCurrency(value as string)}
              style={{ width: 200 }}
            >
              {currencies.map((currency) => (
                <Option key={currency} value={currency}>
                  {currency.toUpperCase()}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <Select
              value={crypto}
              onChange={(value) => setCrypto(value as string)}
              style={{ width: 200 }}
            >
              {cryptos.map(({ id, name }) => (
                <Option key={id} value={id}>
                  {name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      <div>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CryptoTracker;
