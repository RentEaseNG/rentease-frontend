import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Messages = () => {
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch all conversations for the current user
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/messages',
          {
            headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // ✅ use auth token from context
                    },
          }
        );
        // Ensure conversations is always an array
        setConversations(Array.isArray(response.data.data) ? response.data.data : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setLoading(false);
        // Set empty array on error
        setConversations([]);
      }
    };

    fetchConversations();
  }, [user]);

  // Fetch messages for selected conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;
      
      try {
        const response = await axios.get(`/api/messages/${selectedConversation.id}`);
        setMessages(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const messagePayload = {
      recipientId: selectedConversation.userId,
      content: newMessage
    };

    try {
      // Send the message
      const response = await axios.post('/api/messages', messagePayload);
      
      // Add the new message to the UI
      setMessages([...messages, response.data]);
      
      // Clear the input field
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Please log in to view your messages</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-6">Messages</h1>
        
        {loading ? (
          <div className="text-center py-10">
            <p>Loading conversations...</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Conversations List */}
            <div className="md:w-1/3 border rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-3 border-b">
                <h2 className="font-semibold">Conversations</h2>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
                {!Array.isArray(conversations) || conversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  <ul>
                    {conversations.map((conversation) => (
                      <li 
                        key={conversation.id}
                        className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                          selectedConversation?.id === conversation.id ? 'bg-green-50' : ''
                        }`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{conversation?.sender?.name || 'User'}</p>
                            <p className="text-sm text-gray-500 truncate">
                              {conversation.content || 'No messages yet'}
                            </p>
                          </div>
                          {conversation.unread > 0 && (
                            <span className="bg-green-600 text-white text-xs rounded-full px-2 py-1">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            {/* Message Area */}
            <div className="md:w-2/3 border rounded-lg flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="bg-gray-100 p-3 border-b">
                    <h2 className="font-semibold">{selectedConversation?.sender?.name || 'User'}</h2>
                  </div>
                  
                  <div className="flex-1 p-4 overflow-y-auto bg-gray-50" style={{ height: '400px' }}>
                    {!Array.isArray(messages) || messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-4">
                        <p>No messages yet. Start a conversation!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((msg) => (
                          <div 
                            key={msg.id} 
                            className={`p-3 rounded-lg max-w-[80%] ${
                              msg.senderId === user.id 
                                ? "bg-green-100 ml-auto" 
                                : "bg-gray-200 mr-auto"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(msg.createdAt)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <form onSubmit={handleSendMessage} className="p-3 border-t">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button 
                        type="submit" 
                        className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <p>Select a conversation to view messages</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;