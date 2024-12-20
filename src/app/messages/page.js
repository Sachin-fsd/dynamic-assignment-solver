"use client";

import { useEffect, useState } from "react";

const MessagesPage = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            const fetchMessages = async () => {
                try {
                    const response = await fetch("/api/getMessages");
                    if (response.ok) {
                        const data = await response.json();
                        setMessages(data);
                    } else {
                        console.error("Failed to fetch messages");
                    }
                } catch (error) {
                    console.error("Error fetching messages:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchMessages();
        }
    }, [isAuthenticated]);

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password === "abcdx") {
            setIsAuthenticated(true);
        } else {
            alert("Incorrect password");
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/deleteMessage`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                setMessages((prevMessages) => prevMessages.filter((message) => message._id !== id));
            } else {
                const errorData = await response.json();
                console.error("Failed to delete message:", errorData.message);
                alert("Failed to delete message");
            }
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            {!isAuthenticated ? (
                <form onSubmit={handlePasswordSubmit} className="flex flex-col items-center">
                    <label className="mb-2">
                        Enter Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-300 px-4 py-2 mt-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Submit
                    </button>
                </form>
            ) : (
                <>
                    <h1 className="text-2xl font-bold mb-4">Messages</h1>
                    {loading ? (
                        <p>Loading...</p>
                    ) : messages.length > 0 ? (
                        <table className="table-auto w-full text-left border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Message</th>
                                    <th className="border border-gray-300 px-4 py-2">Name</th>
                                    <th className="border border-gray-300 px-4 py-2">Roll Number</th>
                                    <th className="border border-gray-300 px-4 py-2">Course</th>
                                    <th className="border border-gray-300 px-4 py-2">Time</th>
                                    <th className="border border-gray-300 px-4 py-2">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {messages.map((message) => (
                                    <tr key={message._id}>
                                        <td className="border border-gray-300 px-4 py-2">{message.message}</td>
                                        <td className="border border-gray-300 px-4 py-2">{message.name}</td>
                                        <td className="border border-gray-300 px-4 py-2">{message.rollNumber}</td>
                                        <td className="border border-gray-300 px-4 py-2">{message.course}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {new Intl.DateTimeFormat("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                                timeZoneName: "short",
                                            }).format(new Date(message.createdAt))}
                                        </td>
                                        <td
                                            onClick={() => handleDelete(message._id)}
                                            className="border border-gray-300 px-4 py-2 text-red-600 cursor-pointer"
                                        >
                                            Delete
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No messages found.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default MessagesPage;
