import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { useState } from "react";



function Wallet({ address, setAddress, balance, setBalance , privateKey,setPrivateKey}) {

  const [amount, setAmount] = useState(0);
  const [wallet,setWallet]=useState("");

  function getEthAddress(publicKey) {
    const hash = keccak256(publicKey.slice(1, publicKey.length));
    return (toHex(hash.slice(-20)));
  }

  const handleGenerateWallet = async ()=>{
    const priv = secp256k1.utils.randomPrivateKey();
		const ethAddr = getEthAddress(secp256k1.getPublicKey(priv));
		setAddress(ethAddr);
		setPrivateKey(priv);
		const { data: { balance } } = await server.post(`generate`, { body: { amount: amount, ethAddr } });
		setBalance(balance);
  }


  async function onChange(evt) {
    const address = evt.target.value;
    setWallet(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
      setAddress(address)
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1 className="">Your Wallet</h1>

      <label>
        wallet Address
      </label>
      <input placeholder="Type an address, for example: 0x1" value={wallet} onChange={onChange}/>

      <div className="balance">Balance: {balance}</div>
      {!address && 
        <>
          <label>
            Amount
          </label> 
          <input type="number" placeholder="Type an amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
 
          <button onClick={handleGenerateWallet} className="button"> Generate Wallet</button>
        </>
      }
      {address && <>
        <div>Ethereum address:{address}</div>
        <div>Private key: {privateKey}</div>
      </>}
    </div>
  );
}

export default Wallet;
