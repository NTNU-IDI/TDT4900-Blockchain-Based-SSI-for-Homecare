import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import Navigation from "../components/Navigation";
import { RootState, AppDispatch } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomepageData } from "../redux/homepageSlice";

const Homepage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.homepage,
  );

  useEffect(() => {
    if (!data.name) {
      dispatch(fetchHomepageData());
    }
  }, [dispatch, data.name]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.circleContainer}>
        <View style={[styles.firstCircle]} />
        <View style={[styles.secondCircle]} />
      </View>

      <Text style={styles.circleText}>Hei {data.name.split(" ")[0]}!</Text>
      <Text style={styles.italicText}>Hva kan vi hjelpe deg med?</Text>

      <Navigation
        data={{
          name: data.name,
          notes: data.notes,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
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
