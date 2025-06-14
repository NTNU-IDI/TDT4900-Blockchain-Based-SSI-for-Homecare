import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getAccessList, revokeAccess } from "../services/BlockchainService";

import Card from "../components/Card";
import Header from "../components/Header";
import { Worker } from "../types/worker";
import workers from "../assets/homecare_workers.json";

const InsightPage = () => {
  const [accessList, setAccessList] = useState<string[]>([]);
  const [accessDetails, setAccessDetails] = useState<Worker[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAccessList = async () => {
    try {
      const list = await getAccessList();
      setAccessList(list);
      console.log("Access list:", list);

      const details = list.map((address) => {
        const detail = workers[address];
        return detail;
      });

      setAccessDetails(details);
    } catch (error) {
      console.error("Error fetching access list", error);
    }
  };

  useEffect(() => {
    fetchAccessList();
  }, []);

  const handlePress = (address: string) => {
    const worker = workers[address] || null;

    if (!worker) {
      console.error("Worker not found for address:", address);
      return;
    }
    setSelectedWorker(worker);
    setSelectedAddress(address);
    setIsPopupVisible(true);
  };

  const handleRemove = async () => {
    if (!selectedAddress) {
      console.error("No worker address selected.");
      return;
    }
    setIsLoading(true);

    try {
      await revokeAccess(selectedAddress);
      console.log("Success", "Access revoked successfully.");

      setAccessList((prevList) =>
        prevList.filter((addr) => addr !== selectedAddress),
      );

      setAccessDetails((prevDetails) => {
        const newAccessList = accessList.filter(
          (addr) => addr !== selectedAddress,
        );
        return newAccessList.map((addr) => workers[addr]);
      });
      console.log("List:", getAccessList());
    } catch (error) {
      console.error("Error revoking access:", error);
      console.log("Error", "Failed to revoke access.");
    } finally {
      setIsLoading(false);
      setIsPopupVisible(false);
    }
  };

  const handleDiscard = () => {
    console.log("Discarded", "Access has been discarded.");
    setIsPopupVisible(false);
  };

  return (
    <View style={styles.screen}>
      <Header header="Innsyn" />
      <View style={styles.cardContainer}>
        {accessDetails.map((worker, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(accessList[index])}
          >
            <Card
              title={worker.name}
              description={`${worker.job} - ${worker.workplace}`}
            />
          </TouchableOpacity>
        ))}
      </View>
      <Modal
        visible={isPopupVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setIsPopupVisible(false)}
      >
        <View style={styles.popupContainer}>
          <View style={styles.popupContent}>
            <Text style={styles.popupText}>
              Vil du fjerne innsynsrettigheter for {selectedWorker?.name}?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.approveButton,
                  isLoading && styles.disabledButton,
                ]}
                onPress={handleRemove}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? "Processing..." : "Ja"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.discardButton,
                  isLoading && styles.disabledButton,
                ]}
                onPress={handleDiscard}
              >
                <Text style={styles.buttonText}>Nei</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
  },
  cardContainer: {
    marginTop: 20,
    width: "90%",
  },
  popupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popupContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  popupText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  approveButton: {
    backgroundColor: "#0D9276",
  },
  discardButton: {
    backgroundColor: "#FF5733",
  },
  disabledButton: {
    backgroundColor: "#A9A9A9",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default InsightPage;
