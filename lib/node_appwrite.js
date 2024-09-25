const sdk = require("node-appwrite");

const client = new sdk.Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6648c699000032e4623c")
  .setKey("<YOUR_API_KEY>");

const users = new sdk.Users(client);
