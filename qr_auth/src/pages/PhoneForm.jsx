import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const PhoneForm = ({ onUpload, onBack }) => {
  const [serialNumber, setSerialNumber] = useState("");
  const [hashedSerial, setHashedSerial] = useState("");
  // const [date, setDate] = useState("");
  const [phoneName, setPhoneName] = useState("");
  const [txHash, setTxHash] = useState("");
  const [success, setSuccess] = useState();
  const [url, setUrl] = useState("");
  const [newurl, setnewUrl] = useState("");
  const [to, setTo] = useState("");

  const uploadJSONToIPFS = async (serialNumber, phoneName) => {
    setSuccess(false);

    try {
      const response = await axios.post("http://localhost:3500/api/mint", {
        serialNumber: hashedSerial,
        tokenURI: phoneName,
      });

      console.log(response.data);
      setSuccess(true);
      setUrl(response.data.transactionHash);

      // const data = await response.json();
      // return data.IpfsHash;
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      return null;
    }
  };

  const mintNFT = async (serialNumber, tokenURI) => {
    try {
      const response = await fetch("http://localhost:5000/api/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serialNumber, tokenURI }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      return data.transactionHash;
    } catch (error) {
      console.error("Minting error:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    const uploadedCid = await uploadJSONToIPFS(serialNumber, phoneName);
    if (!uploadedCid) {
      alert("Successfully uploaded");
      return;
    }

    const uri = `ipfs://${uploadedCid}`;
    const hash = await mintNFT(serialNumber, uri);

    if (hash) {
      setTxHash(hash);
      onUpload({ serialNumber, phoneName, cid: uploadedCid });
    } else {
      alert("Failed to mint NFT");
    }
  };

  async function handleTransaction() {
    const response = await axios.post("http://localhost:3500/api/transfer", {
      to,
      serialNumber: hashedSerial,
    });

    console.log(response.data);
    setnewUrl(response.data.transactionHash);
  }

  function textToAscii(text) {
    const val = text
      .split("")
      .map((char) => char.charCodeAt(0))
      .join("");
    setHashedSerial(val);
    console.log(val);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">
          Add Phone Details
        </h1>

        <input
          type="text"
          placeholder="Serial Number"
          value={serialNumber}
          onChange={(e) => {
            setSerialNumber(e.target.value);
            textToAscii(e.target.value);
          }}
          className="mb-3 w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Phone Name"
          value={phoneName}
          onChange={(e) => setPhoneName(e.target.value)}
          className="mb-3 w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSubmit}
          className="w-full px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-medium mt-2"
        >
          Mint NFT
        </button>

        {txHash && (
          <p className="mt-3 text-center">
            Transaction Hash:{" "}
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {txHash}
            </a>
          </p>
        )}

        <button
          onClick={onBack}
          className="w-full px-6 py-2 mt-4 bg-red-500 hover:bg-red-600 rounded-md text-white font-medium"
        >
          Go Back
        </button>

        {success ? "success wala" : null}

        {url ? (
          <div>
            <div>
              <a
                className="text-purple-900"
                href={`https://sepolia.etherscan.io/tx/${url}`}
                target="_blank"
              >
                Click on this to get redirected
              </a>
            </div>
            <div className="text-black">Serial number : {serialNumber}</div>
            <div>
              <div>
                <div>
                  <input
                    type="text"
                    placeholder="Serial Number"
                    value={serialNumber}
                    disabled
                    className="mb-3 w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="To:"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="mb-3 w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleTransaction}
                  className="w-full px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-medium mt-2"
                >
                  Transact
                </button>

                {newurl ? (
                  <div>
                    <div>
                      <a
                        className="text-purple-900"
                        href={`https://sepolia.etherscan.io/tx/${newurl}`}
                        target="_blank"
                      >
                        Click on this to get redirected
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          "NOt found"
        )}
      </div>
    </div>
  );
};

PhoneForm.propTypes = {
  onUpload: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default PhoneForm;
