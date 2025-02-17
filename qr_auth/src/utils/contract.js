// import pinataSDK from "@pinata/sdk";

// const pinata = new pinataSDK(
//   process.env.PINATA_API_KEY,
//   process.env.PINATA_SECRET_API_KEY
// );

// export const uploadJSONToIPFS = async (serialNumber, date, phoneName) => {
//   const metadata = {
//     serialNumber,
//     date,
//     phoneName,
//   };

//   try {
//     const result = await pinata.pinJSONToIPFS(metadata);
//     return result.IpfsHash;
//   } catch (error) {
//     console.error("Error uploading to IPFS:", error);
//     return null;
//   }
// };
