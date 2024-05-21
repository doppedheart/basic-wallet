const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex, hexToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  try {
    const { recipient, amount, signature, publicKey, msgHash } = req.body;
    signature.r = BigInt(signature.r);
    signature.s = BigInt(signature.s);
    const isSigned = secp256k1.verify(signature, msgHash, publicKey);
    if (!isSigned) {
      res
        .status(400)
        .send({ message: "Invalid signature!", balance: balances[sender] });
      return;
    }
    const sender = getEthAddress(hexToBytes(publicKey));
    if (!balances[sender]) {
      return res.status(400).send({ message: "Invalid sender!" });
    }
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      return res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      return res.send({ balance: balances[sender] });
    }
  } catch (error) {
    res
      .status(400)
      .send({ message: "Invalid signature!", error: error.message });
  }
});

app.post("/generate", (req, res) => {
  const {
    body: { amount, ethAddr },
  } = req.body;
  balances[ethAddr] = +amount;
  console.log(balances);
  res.status(200).send({ amount: +amount });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function getEthAddress(publicKey) {
  const hash = keccak256(publicKey.slice(1, publicKey.length));
  return toHex(hash.slice(-20));
}
