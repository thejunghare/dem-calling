import { Client, Databases, Account } from "react-native-appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6648c699000032e4623c");

export const account = new Account(client);
export const databases = new Databases(client);

// client.subscribe("documents");
