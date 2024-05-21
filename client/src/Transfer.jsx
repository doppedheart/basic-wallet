import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    if (!privateKey) {
      alert("missing wallet");
      return;
    }
    if (confirm("sign message")) {
      const body = {
        amount: parseInt(sendAmount),
        recipient,
      };
      const msgHash = hashMessage(body);
      const signature = secp256k1.sign(msgHash, privateKey);
      console.log(signature);
      const publicKey = signature.recoverPublicKey(msgHash).toHex();
      console.log(publicKey);
      try {
        const {
          data: { balance },
        } = await server.post(`send`, {
          ...body,
          signature: JSON.parse(
            JSON.stringify(signature, (key, value) =>
              typeof value === "bigint" ? value.toString() : value
            )
          ),
          msgHash,
          publicKey,
        });
        setBalance(balance);
      } catch (ex) {
        alert(ex.response.data.message);
      }
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>Send Amount</label>
      <input
        placeholder="1, 2, 3..."
        value={sendAmount}
        onChange={setValue(setSendAmount)}
      ></input>
      <label>Recipient</label>
      <input
        placeholder="Type an address, for example: 0x2"
        value={recipient}
        onChange={setValue(setRecipient)}
      ></input>
      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}
function hashMessage(msg) {
  const hash = keccak256(utf8ToBytes(JSON.stringify(msg)));
  return toHex(hash);
}
export default Transfer;
