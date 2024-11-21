'use server';

import clientPromise from "@/lib/mongodb";

export async function SaveUserData({ name, rollNumber, course, subject }) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const collection = db.collection('users');
        const result = await collection.insertOne({ name, rollNumber, course, subject, createdAt: new Date() })
        return true;
    } catch (error) {
        console.error('Error in saving data:', error);
        return false;
    }
}

export async function SendMessage({ message, name, rollNumber, course }) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const collection = db.collection('messages');
        const result = await collection.insertOne({ message, createdAt: new Date(), name, rollNumber, course })
        return true;
    } catch (error) {
        console.error('Error in saving data:', error);
        return false;
    }
}
