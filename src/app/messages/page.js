'use client';

import { useEffect, useState } from "react";

const MessagesPage = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
                console.error("Error fetching Messages:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Messages</h1>
            {loading ? (
                <p>Loading...</p>
            ) : messages.length > 0 ? (
                <table className="table-auto w-full text-left border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Message</th>
                            <th className="border border-gray-300 px-4 py-2">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.map((message, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 px-4 py-2">{message.message}</td>
                                <td className="border border-gray-300 px-4 py-2">{message.createdAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No messages found.</p>
            )}
        </div>
    );
};

export default MessagesPage;
