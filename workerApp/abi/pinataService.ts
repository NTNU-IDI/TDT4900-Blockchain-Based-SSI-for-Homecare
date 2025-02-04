import { PINATA_API_KEY, PINATA_JWT, PINATA_SECRET_API_KEY } from '@env';

import axios from 'axios';

export const fetchIPFSData = async (ipfsHash: string): Promise<any> => {
  try {
    const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from IPFS:', error);
    throw error;
  }
};

interface PinataResponse {
    IpfsHash: string;
    PinSize: number;
    Timestamp: string;
  }
  
  /**
   * Uploads data to IPFS using Pinata and returns the new IPFS hash.
   * @param data - The JSON object to store on IPFS.
   * @returns {Promise<string>} - The IPFS hash of the uploaded data.
   */
  export const uploadToIPFS = async (data: Record<string, unknown>, filename: string): Promise<string> => {
    try {
      const response = await axios.post<PinataResponse>(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        { pinataContent: data,pinataMetadata: {
            name: filename,
          }, },
        {
          headers: {
            "Content-Type": "application/json",
            "pinata_api_key": PINATA_API_KEY,
            "pinata_secret_api_key": PINATA_SECRET_API_KEY,
          },
        }
      );
  
      console.log("Successfully uploaded to IPFS:", response.data.IpfsHash);
      return response.data.IpfsHash;
    } catch (error) {
      console.error("Error uploading data to IPFS:", error);
      throw error;
    }
  };

  export const unpinFromIPFS = async (ipfsHash: string) => {
    try {
        const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${ipfsHash}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${PINATA_JWT}`
            }
        });
  
      console.log(`Successfully unpinned IPFS file: ${ipfsHash}`);
    } catch (error: any) {
      console.error(`Failed to unpin IPFS file: ${ipfsHash}`, error.response?.data || error.message);
      throw error;
    }
  };