import { PINATA_GATEWAY } from "@env";
import axios from "axios";

export const fetchIPFSData = async (ipfsHash: string): Promise<any> => {
  try {
    console.log(PINATA_GATEWAY)
    const response = await axios.get(`${PINATA_GATEWAY}${ipfsHash}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data from IPFS:", error);
    throw error;
  }
};

export default fetchIPFSData;
