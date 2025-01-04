import { useState } from "react";
import "./App.css";
const apiUrl = import.meta.env.VITE_backend_url;

function App() {
  const coins = [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 50, 100, 1000];

  const [amount, setAmount] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null); 

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const [selectedCoins, setSelectedCoins] = useState([]);

  const calculateChange = async (amount, coins) => {
    coins.sort((a, b) => b - a).reverse();

    const data = {
      coins: coins.map((coin) => parseFloat(coin)),
      amount: parseFloat(amount)
    };

    console.log("Data to send:", data);

    try {
      // console.log(apiUrl)
      const response = await fetch(`${apiUrl}/coin-change`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
      const errorMessage = await response.text(); 
      throw new Error(errorMessage);
      }

      const resultData = await response.json();
      console.log("response :", resultData);
      setResult(resultData.combination);
      setError(null); 
    } catch (error) {
      console.error("error:", error);
      setError(`Failed to send request: ${error.message}`);
      setResult(null);
    }
  
  }

  return (
    <>
      <div>
        <h1>Welcome to coin change!</h1>
        <p>Click the following coins you wish to use</p>
        <div className="coin-buttons">
          {coins.map((coin, index) => (
            <button
      
              className={selectedCoins.includes(coin) ? "selected" : ""}
              key={index}
              onClick={() => {
                if (selectedCoins.includes(coin)) {
                  setSelectedCoins(
                    selectedCoins.filter(
                      (selectedCoin) => selectedCoin !== coin
                    )
                  );
                } else {
                  setSelectedCoins([...selectedCoins, coin]);
                }
                // console.log(selectedCoins);
              }}
            >
              {coin}
            </button>
          ))}
        </div>
        <p>Enter an amount </p>
        <label htmlFor="amount">Enter Amount:</label>
        <input
          id="amount"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter amount"
        />
      </div>

      <div>
        <button
          onClick={() => {
            calculateChange(amount, selectedCoins);
          }
          }
        >Submit your test!</button>
      </div>


      <div className="result-container">
        {error && <p className="error-message">{error}</p>}
        {result && (
          <>
            <h2>Calculation Result:</h2>
            <p>{result.join(", ")}</p> 
          </>
        )}
      </div>
    </>
  );
}

export default App;
