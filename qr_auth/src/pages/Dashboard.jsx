import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ethers } from "ethers";
import { QRCodeSVG } from "qrcode.react";

const Dashboard = ({ account, onLogout }) => {
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchWalletDetails = async () => {
      if (!window.ethereum) return;

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balanceWei = await provider.getBalance(account);
        const balanceEth = ethers.formatEther(balanceWei);
        setBalance(balanceEth);

        const networkDetails = await provider.getNetwork();
        setNetwork(networkDetails.name || "Unknown");
      } catch (error) {
        console.error("Error fetching wallet details:", error);
      }
    };

    const fetchTransactions = async () => {
      const API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;
      if (!API_KEY) {
        console.error("Missing Etherscan API Key in .env file");
        return;
      }

      try {
        const response = await fetch(
          `https://api.etherscan.io/api?module=account&action=txlist&address=${account}&startblock=0&endblock=99999999&sort=desc&apikey=${API_KEY}`
        );
        const data = await response.json();

        if (data.status === "1" && data.result.length > 0) {
          setTransactions(data.result.slice(0, 5)); // Show last 5 transactions
        } else {
          setTransactions([]);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchWalletDetails();
    fetchTransactions();
  }, [account]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Vendor Dashboard</h1>

      <p className="text-lg">Wallet: {account}</p>
      {balance !== null && (
        <p className="text-lg mt-2">Balance: {balance} ETH</p>
      )}
      {network && <p className="text-lg mt-2">Network: {network}</p>}

      {/* QR Code for Wallet Address */}
      <div className="mt-4 bg-white p-2 rounded">
        <QRCodeSVG value={account} size={120} />
      </div>

      {/* Transaction History */}
      <h2 className="text-2xl font-bold mt-6">Recent Transactions</h2>
      <div className="mt-2 w-full max-w-2xl">
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-700">
              <th className="border border-gray-500 p-2">Hash</th>
              <th className="border border-gray-500 p-2">Amount (ETH)</th>
              <th className="border border-gray-500 p-2">To</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx.hash} className="bg-gray-800 hover:bg-gray-700">
                  <td className="border border-gray-500 p-2">
                    <a
                      href={`https://etherscan.io/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      {tx.hash.slice(0, 10)}...
                    </a>
                  </td>
                  <td className="border border-gray-500 p-2">
                    {ethers.formatEther(tx.value)}
                  </td>
                  <td className="border border-gray-500 p-2">{tx.to}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center">
                  No recent transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={onLogout}
        className="px-6 py-2 mt-4 bg-red-500 hover:bg-red-600 rounded-lg text-white"
      >
        Logout
      </button>
    </div>
  );
};

// Props validation
Dashboard.propTypes = {
  account: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Dashboard;
