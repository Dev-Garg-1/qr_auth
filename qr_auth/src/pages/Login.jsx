import { useState, useEffect } from "react";
import { ethers } from "ethers"; // ✅ Correct import
import PropTypes from "prop-types";

const Login = ({ onLogin }) => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected. Please install MetaMask.");
      return;
    }

    try {
      console.log("Requesting account access...");

      const provider = new ethers.BrowserProvider(window.ethereum); // ✅ Fixed for Ethers v6
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const signer = await provider.getSigner(); // ✅ Awaiting getSigner() correctly
      const address = await signer.getAddress();

      console.log("Wallet connected:", address);
      setAccount(address);
      onLogin(address);
    } catch (error) {
      if (error.code === 4001) {
        alert("Connection request rejected by the user.");
      } else {
        alert("Failed to connect wallet. See console for details.");
        console.error("Wallet connection error:", error);
      }
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          onLogin(accounts[0]);
        } else {
          setAccount(null);
          onLogin(null);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, [onLogin]); // ✅ Include onLogin in dependency array

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">QR Auth - Vendor Login</h1>
      {account ? (
        <p className="text-lg">Connected: {account}</p>
      ) : (
        <button
          onClick={connectWallet}
          className="px-6 py-2 bg-blue-500 rounded-lg text-white"
        >
          Connect MetaMask
        </button>
      )}
    </div>
  );
};

// Add PropTypes validation
Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
