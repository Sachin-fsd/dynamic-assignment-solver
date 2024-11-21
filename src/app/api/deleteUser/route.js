import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
// import { ObjectId } from "mongodb";

export async function DELETE(req) {
    try {
        const { id } = await req.json(); // Parse request body to get `id`
        const client = await clientPromise;
        const db = client.db("hojayega");
        const collection = db.collection("users");

        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        // const result = await collection.deleteOne({ _id: id });
        console.log(result, id)
        if (result.deletedCount === 1) {
            return new Response(JSON.stringify({ message: "Deleted successfully" }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } else {
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
    } catch (error) {
        console.error("Error deleting User:", error);
        return new Response(JSON.stringify({ error: "An error occurred" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
