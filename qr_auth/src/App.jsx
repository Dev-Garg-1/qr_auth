import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PhoneForm from "./pages/PhoneForm";
import NFTDetails from "./pages/NFTDetails"; // ✅ Import NFT Page

function App() {
  const [account, setAccount] = useState(null);
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [showNFTDetails, setShowNFTDetails] = useState(false);

  const handleLogout = () => {
    setAccount(null);
    setShowPhoneForm(false);
    setShowNFTDetails(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      {!account ? (
        <Login onLogin={setAccount} />
      ) : showPhoneForm ? (
        <PhoneForm
          onUpload={(data) => console.log("Upload this to IPFS:", data)}
          onBack={() => setShowPhoneForm(false)} // ✅ Go back to Dashboard
        />
      ) : showNFTDetails ? (
        <NFTDetails account={account} onBack={() => setShowNFTDetails(false)} /> // ✅ Go back to Dashboard
      ) : (
        <>
          <Dashboard account={account} onLogout={handleLogout} />
          
          {/* Action Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setShowPhoneForm(true)}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
            >
              Add Phone Details
            </button>

            <button
              onClick={() => setShowNFTDetails(true)}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white"
            >
              View My NFTs
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
