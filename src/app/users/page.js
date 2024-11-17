'use client';

import { useEffect, useState } from "react";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/getUsers");
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    console.error("Failed to fetch users");
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            {loading ? (
                <p>Loading...</p>
            ) : users.length > 0 ? (
                <table className="table-auto w-full text-left border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2">Roll Number</th>
                            <th className="border border-gray-300 px-4 py-2">Course</th>
                            <th className="border border-gray-300 px-4 py-2">Subject</th>
                            <th className="border border-gray-300 px-4 py-2">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.rollNumber}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.course}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.subject}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.createdAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No users found.</p>
            )}
        </div>
    );
};

export default Users;