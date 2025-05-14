## Client app

This is the React Native application developed for the homecare service client. 

### Getting Started

**Configure Workers:** 
Create a `homecare_workers.json` file in the `assets` folder, listing workers along with their Ethereum addresses and work details. Follow the format provided in the example file. 

**Set Up Environment Variables:**
Create a `.env` file containing the variables specified in `.env.d.ts`.

### How to run 

Make sure you have the Expo Go application installed on your phone. Then run:

```shell
npm install
npx expo start
```

A QR code should be displayed in the terminal. Scan this with the camera on your phone and the app should open via Expo Go. 
