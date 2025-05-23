const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

// Testing gitignore
async function main() {
  console.log("Printing all collections in CMUResearchDatabase:");
  const Db = process.env.ATLAS_URI;
  const client = new MongoClient(Db);

  try {
    await client.connect();
    const collections = await client.db("CMUResearchDatabase").collections();
    collections.forEach((collection) => console.log(collection.collectionName));
  } catch (e) {
    console.log("rip database");
    console.log(e);
  } finally {
    await client.close();
  }
}

main();
