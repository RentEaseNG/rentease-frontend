import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AllMessages = () => {
    const { user, token } = useAuth();
    const [messages, setMessages] = useState([])

    useEffect(() => {
        const FetchMessages = async () => {
            if (!user) return;
            try {
                const res = await axios.get("http://localhost:5000/api/messages/conversations", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })
                setMessages(res.data.data)
            } catch (error) {
                console.error("Error:", error)
            }
        }
        FetchMessages();
    }, [])
    return (
        <div>
            {messages.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                    <p>No conversations yet</p>
                </div>) : (
                <ul>
                    {messages.map((message) => (
                        <li key={message?.conversationId} className='p-3 border-b cursor-pointer hover:bg-gray-50'>
                            <p>{message.otherUser.name}</p>
                            <p>{message.lastMessage.content}</p>
                        </li>
                    ))}
                </ul>)
            }
        </div>
    )
}

export default AllMessages