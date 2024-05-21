import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  return (
    <>
      <div className="heading">Simple Cryptography wallet</div>
      <div className="app">
        <Wallet
          balance={balance}
          setBalance={setBalance}
          address={address}
          setAddress={setAddress}
          privateKey={privateKey}
          setPrivateKey={setPrivateKey}
        />
        <Transfer
          setBalance={setBalance}
          address={address}
          privateKey={privateKey}
        />
      </div>
      <div className="instructions">
        <h3>instructions</h3>
        <ul>
          <li>Step 1. enter any amount you want to add to wallet</li>
          <li>Step 2. click on generate wallet, It will give you your public key and private key wallet</li>
          <li>Step 3. store the private key anywhere because it is non recoverable </li>
          <li>Step 4. enter the public address of others in transaction section and amount</li>
          <li>Step 5. Click on Transfer and sign the message which will show as alert</li>
        </ul>
      </div>
    </>
  );
}

export default App;
