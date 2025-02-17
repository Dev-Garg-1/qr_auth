import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const NFTDetails = ({ account, onBack }) => {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    // TODO: Replace this with actual backend fetch (once API is ready)
    const dummyNFTs = [
      { tokenId: 1, cid: "QmExampleCID1" },
      { tokenId: 2, cid: "QmExampleCID2" },
    ];
    setNfts(dummyNFTs);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Your Minted NFTs</h1>

      {nfts.length === 0 ? (
        <p>No NFTs found for this account.</p>
      ) : (
        <div className="w-full max-w-2xl">
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-700">
                <th className="border border-gray-500 p-2">Token ID</th>
                <th className="border border-gray-500 p-2">IPFS CID</th>
                <th className="border border-gray-500 p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {nfts.map((nft) => (
                <tr key={nft.tokenId} className="bg-gray-800 hover:bg-gray-700">
                  <td className="border border-gray-500 p-2">{nft.tokenId}</td>
                  <td className="border border-gray-500 p-2">{nft.cid}</td>
                  <td className="border border-gray-500 p-2">
                    <a
                      href={`https://ipfs.io/ipfs/${nft.cid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                    >
                      View NFT
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={onBack}
        className="px-6 py-2 mt-4 bg-red-500 hover:bg-red-600 rounded-lg text-white"
      >
        Go Back
      </button>
    </div>
  );
};

NFTDetails.propTypes = {
  account: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default NFTDetails;
