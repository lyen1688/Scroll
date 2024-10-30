const express = require("express");
const bodyParser = require("body-parser");
const axios = require('axios');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/getWalletInfo", async (req, res) => {
  const requestId = req.headers["x-fc-request-id"];
  console.log("FC Invoke Start RequestId: " + requestId);

  const walletAddresses = req.body.wallet_addresses;

  if (!Array.isArray(walletAddresses) || walletAddresses.some(address => !address.startsWith("0x"))) {
    res.status(400).send({
      msg: "Invalid wallet_addresses",
    });
    return;
  }

  const results = await Promise.all(walletAddresses.map(async (address) => {
    const result = { wallet_address: address };

    try {
      const pointsResponse = await axios.get(`https://www.data-openblocklabs.com/scroll/wallet-points?walletAddress=${address}`);
      result.points = pointsResponse.data[0].points;
      result.timestamp = pointsResponse.data[0].timestamp;
    } catch (error) {
      result.points = 0;
      result.timestamp = 0;
    }

    return result;
  }));

  res.send(results);

  console.log("FC Invoke End RequestId: " + requestId);
});

app.post("/getWalletInfo2", async (req, res) => {
  const requestId = req.headers["x-fc-request-id"];
  console.log("FC Invoke Start RequestId: " + requestId);

  const walletAddresses = req.body.wallet_addresses;

  if (!Array.isArray(walletAddresses) || walletAddresses.some(address => !address.startsWith("0x"))) {
    res.status(400).send({
      msg: "Invalid wallet_addresses",
    });
    return;
  }

  const results = await Promise.all(walletAddresses.map(async (address) => {
    const result = { wallet_address: address };

    try {
      const pointsResponse = await axios.get(`https://www.data-openblocklabs.com/scroll/wallet-points-s2?walletAddress=${address}`);
      result.points = pointsResponse.data[0].points;
      result.timestamp = pointsResponse.data[0].timestamp;
    } catch (error) {
      result.points = 0;
      result.timestamp = 0;
    }

    return result;
  }));

  res.send(results);

  console.log("FC Invoke End RequestId: " + requestId);
});

const port = 9000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
