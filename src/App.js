import React, { useEffect, useState } from "react";
import "./index.css";
import { ethers } from "ethers";
import Capsule, {
  Environment,
  CapsuleEthersSigner,
  createCapsuleViemClient,
} from "@usecapsule/web-sdk";
import {
  CapsuleButton,
  CapsuleModal,
} from "@usecapsule/web-sdk/dist/modal/CapsuleModal";

const CHAIN_PROVIDER = 'https://eth-sepolia.g.alchemy.com/v2/KfxK8ZFXw9mTUuJ7jt751xGJCa3r8noZ';
const CHAIN = "sepolia";

const CAPSULE_API_KEY = undefined
const capsule = new Capsule(Environment.BETA, CAPSULE_API_KEY);

const styles = {
  baseContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    flexDirection: "column",
    overflowWrap: "anywhere",
  },
};

function App() {
  const [signer, setSigner] = useState(null);
  const [currentWalletAddress, setCurrentWalletAddress] = useState(null);
  const [signedMessage, setSignedMessage] = useState(null);

  const logout = async () => {
    await capsule.logout();
    setSigner(null);
  };

  const signTestMessage = async () =>{
    const signedMessage = await signer.signMessage("hello capsule!")
    setSignedMessage(signedMessage)
  }

  useEffect(() => {
    const updateLoginStatus = async () => {
      const isLoggedIn = await capsule.isSessionActive();
      const currentWalletAddress = Object.values(capsule.getWallets())?.[0]?.address;
      setCurrentWalletAddress(currentWalletAddress)
      if (isLoggedIn) {
        const provider = new ethers.providers.JsonRpcProvider(
          CHAIN_PROVIDER,
          CHAIN
        );
        // Instantiate Ethers Signer
        let signer = new CapsuleEthersSigner(capsule, provider);
        // Uncomment the below to use a Viem client instead
        // let signer = createCapsuleViemClient(capsule, {
        //   chain: CHAIN,
        //   transport: http(CHAIN_PROVIDER),
        // });
        setSigner(signer);
      }
    };
    updateLoginStatus();

    const intervalId = setInterval(updateLoginStatus, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="App">
      <div style={styles.baseContainer}>
        <h1>Welcome to the Capsule PWA Example!</h1>
        <p>This example walks through creating a wallet and signing a message from an address, as well as creating ethers and viem signers for the account</p>
        {!signer && (
          <div>
            <CapsuleButton
              capsule={capsule}
              appName={"Capsule PWA Example"}
            />
          </div>
        )}
        {signer && (
          <div>
            <div>
              <p>{`Current Address: ${currentWalletAddress}`}</p>
            </div>
            <div>
              <button onClick={signTestMessage}>{signedMessage ? "Success!" : "Sign Message from Address"}</button>
            </div>
            <div>
              <p>{signedMessage && `Signed Message: ${signedMessage}`}</p>
            </div>
            <div>
              <button onClick={logout}>Logout</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
