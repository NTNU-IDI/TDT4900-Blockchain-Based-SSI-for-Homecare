// import React, { useState } from "react";
// import { View, Button, Text } from "react-native";
// import { ethers } from "ethers";
// //import BlockchainService from "../services/BlockchainService";
// import PinataService from "../services/PinataService";
// import contractABI from "../abi/HealthInfoABI.json"; // Ensure ABI is correctly imported

// const rpcUrl = "http://127.0.0.1:8545";
// const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address
// const blockchainService = new BlockchainService(rpcUrl, contractAddress, contractABI);


// const Homepage = () => {
//   const [data, setData] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const ipfsHash = "qqq"; // Replace with your actual IPFS hash

  

//   const fetchData = async () => {
//     setMessage("Checking access...");
//     try {
//       //const r = await blockchainService.grantAccess("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");

//       setMessage("Fetching health record...");
//       const ipfsHash = await blockchainService.getHealthRecord("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
  
//       if (ipfsHash) {
//         setData(ipfsHash);
//         setMessage("IPFS hash fetched successfully!");
//       } else {
//         setMessage("No health record found.");
//       }
//     } catch (error) {
//       setMessage("Failed to fetch health record.");
//       console.error(error);
//     }
//   };
  
  

//   // Fetch IPFS data
//   const handleFetchData = async () => {
//     setMessage("Fetching health data from IPFS...");
//     setLoading(true);
//     try {
//       const healthData = await PinataService.fetchHealthInfo(ipfsHash);
//       setData(JSON.stringify(healthData, null, 2));
//       setMessage("Data fetched successfully!");
//     } catch (error) {
//       setMessage("Failed to fetch data.");
//       setData("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View>
//       <Button title="Fetch Blockchain Data" onPress={fetchData} />
//       <Button title="Fetch IPFS Data" onPress={handleFetchData} />
//       {loading && <Text>Loading...</Text>}
//       {message && <Text>{message}</Text>}
//       {data && <Text>{JSON.stringify(data, null, 2)}</Text>}
//     </View>
//   );
// };

// export default Homepage;

 


import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Navigation from "../components/Navigation";

const Homepage = () => {
  return (
    <View style={styles.screen}>

      <View style={styles.circleContainer}>
        <View style={[styles.firstCircle]} />
        <View style={[styles.secondCircle]} />
      </View>

      <Text style={styles.circleText}>Velkommen Frida!</Text>
      <Text style={styles.italicText}>Hva kan vi hjelpe deg med?</Text>

      <Navigation />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",

  },
  circleContainer: {
    width: "100%",
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 0,
  },

  firstCircle: {
    width: 320,
    height: 320,
    borderRadius: 180,
    backgroundColor: "#FFF6E9",
    zIndex: 0,
    left: "30%",
    top: 60,
  },
  secondCircle: {
    width: 320,
    height: 320,
    borderRadius: 180,
    backgroundColor: "#BBE2EC",
    zIndex: 1,
    right: "25%",
    top: -190,
  },
  circleText: {
    position: "absolute",
    zIndex: 1,
    fontSize: 24,
    color: "#000",
    textAlign: "center",
    top: 50,
    left: 30,
    marginTop: 40,
  },

  italicText: {
    position: "absolute",
    zIndex: 1,
    fontSize: 16,
    fontStyle: "italic",
    color: "#555",
    textAlign: "center",
    top: 80,
    left: 30,
    marginTop: 50,
  },
});

export default Homepage;
