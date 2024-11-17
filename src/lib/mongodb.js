import { MongoClient } from "mongodb";


let client = new MongoClient(process.env.MONGODB_URI);
let clientPromise = client.connect();

export default clientPromise;