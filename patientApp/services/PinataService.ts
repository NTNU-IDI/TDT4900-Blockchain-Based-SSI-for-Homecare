import axios from "axios";

const fetchIPFSData = async (ipfsHash: string): Promise<any> => {
    try {
        const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching data from IPFS:", error);
        throw error;
    }
};

export default fetchIPFSData;
