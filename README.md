# Blockchain-Based SSI System for Homecare Services
This repository contains a prototype developed as part of a Master's thesis in Computer Science at NTNU (Spring 2025) 👩🏼‍💻

## About the Project
The prototype demonstrates how the Self-Sovereign Identity (SSI) principles of **Access and Consent** can be applied to homecare services in Trondheim.

## System Overview
The system consists of a **blockchain-based backend**, IPFS storage using Pinata and two React Native applications, one for **homecare workers** and one for **homecare clients**. 

### Backend
The backend consists of a smart contract responsible for handling access management. It is written in Solidity and set up to be deployed on Sepolia Testnet using Hardhat Ignition.

### Client Application
The client app is designed for clients receiving help from homecare services. It is developed using React Native for iOS.

### Worker Application
The worker app is designed to support the daily operations of homecare workers. It is developed using React Native for iOS.

## How to Run 
### 1. Set Up the Backend
Deploy the smart contract and set up the IPFS storage. Detailed instructions are available in the **Backend README**.

### 2. Run the Applications
Instructions on how to run the **Client App** and **Worker App** are presented in their respective README files.