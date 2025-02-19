import {
  PINATA_API_KEY,
  PINATA_GATEWAY,
  PINATA_JWT,
  PINATA_SECRET_API_KEY
} from '@env';

import axios from 'axios';

const PINATA_PIN_URL = 'https://api.pinata.cloud/pinning';

export const fetchIPFSData = async (ipfsHash: string): Promise<any> => {
  try {
    const response = await axios.get(`${PINATA_GATEWAY}${ipfsHash}`);
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

export const uploadToIPFS = async (
  data: Record<string, unknown>,
  filename: string
): Promise<string> => {
  try {
    const response = await axios.post<PinataResponse>(
      `${PINATA_PIN_URL}/pinJSONToIPFS`,
      {
        pinataContent: data,
        pinataMetadata: {
          name: filename
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY
        }
      }
    );

    console.log('Successfully uploaded to IPFS:', response.data.IpfsHash);
    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading data to IPFS:', error);
    throw error;
  }
};

export const unpinFromIPFS = async (ipfsHash: string) => {
  try {
    const response = await fetch(`${PINATA_PIN_URL}/unpin/${ipfsHash}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`
      }
    });

    console.log(`Successfully unpinned IPFS file: ${ipfsHash}`);
  } catch (error: any) {
    console.error(
      `Failed to unpin IPFS file: ${ipfsHash}`,
      error.response?.data || error.message
    );
    throw error;
  }
};
