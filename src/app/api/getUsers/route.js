import clientPromise from "@/lib/mongodb";

export async function GET(req) {
    try {
        const client = await clientPromise;
        const db = client.db("hojayega");
        const collection = db.collection('users');
        const users = await collection.find({}).sort({createdAt:-1}).toArray();
        await collection.deleteMany({name:"B"})
        return new Response(JSON.stringify(users), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        })

    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
            status: 500,
        });
    }
}