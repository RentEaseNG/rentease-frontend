import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Messages = () => {
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all messages and group by conversation
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/messages", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const allMessages = Array.isArray(res.data.data)
          ? res.data.data
          : [];

        // Filter messages that belong to the logged-in user
        const userMessages = allMessages.filter(
          (msg) =>
            msg.sender._id === user._id || msg.receiver._id === user._id
        );

        // Group by the "other user"
        const grouped = {};
        userMessages.forEach((msg) => {
          const otherUser =
            msg.sender._id === user._id ? msg.receiver : msg.sender;

          if (!grouped[otherUser._id]) {
            grouped[otherUser._id] = {
              userId: otherUser._id,
              name: otherUser.name,
              messages: [],
            };
          }

          grouped[otherUser._id].messages.push(msg);
        });

        // Sort each conversation and get latest message
        const conversationsArray = Object.values(grouped).map((conv) => {
          const sortedMsgs = conv.messages.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          return {
            ...conv,
            lastMessage: sortedMsgs[sortedMsgs.length - 1],
          };
        });

        // Sort conversations by most recent activity
        conversationsArray.sort(
          (a, b) =>
            new Date(b.lastMessage.createdAt) -
            new Date(a.lastMessage.createdAt)
        );

        setConversations(conversationsArray);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user, token, messages]);

  // ✅ When a conversation is selected
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessages(conversation.messages);
  };

  // ✅ Send a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    // Try to get propertyId from lastMessage property object or from the last message in messages array
    const propertyId =
      selectedConversation?.lastMessage?.property?._id ??
      selectedConversation?.messages?.at(-1)?.property?._id ??
      null;

    const messagePayload = {
      ...(propertyId ? { propertyId } : {}),
      receiverId: selectedConversation.userId,
      content: newMessage,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/messages",
        messagePayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Backend may return different shapes; normalize it
      const returned = res?.data?.data ?? res?.data ?? {};

      // Make sure we use the right logged-in id key (support both _id and id)
      const loggedInId = user?._id ?? user?.id;

      // Build a normalized message object with sender._id set to loggedInId
      const newMsg = {
        // include whatever the backend returned (content, createdAt, _id if available)
        ...returned,
        // force sender to be an object whose _id is the logged-in user's id
        sender: {
          // if backend returned sender object, keep its fields but ensure _id matches
          ...(typeof returned.sender === "object" ? returned.sender : {}),
          _id: loggedInId,
        },
        // ensure receiver is an object with _id (we know who it is)
        receiver: {
          _id: selectedConversation.userId,
          ...(selectedConversation.name ? { name: selectedConversation.name } : {}),
        },
        // ensure createdAt exists for immediate UI rendering
        createdAt: returned.createdAt ?? new Date().toISOString(),
        // ensure a stable id for React keys (if backend didn't return _id)
        _id: returned._id ?? `local-${Date.now()}`,
      };

      // Append to messages shown in the chat window
      setMessages((prev) => [...prev, newMsg]);

      // Update conversations array so preview & sorting reflect the new message
      setConversations((prevConvs) =>
        prevConvs.map((conv) => {
          if (conv.userId === selectedConversation.userId) {
            const updatedMessages = [...conv.messages, newMsg];
            return {
              ...conv,
              messages: updatedMessages,
              lastMessage: newMsg,
            };
          }
          return conv;
        })
      );

      // Also update selectedConversation reference so UI stays consistent
      setSelectedConversation((prev) =>
        prev
          ? { ...prev, messages: [...prev.messages, newMsg], lastMessage: newMsg }
          : prev
      );

      // Clear input
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // ✅ Format message date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">
            Please log in to view your messages
          </h2>
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
            {/* ✅ Conversations List */}
            <div className="md:w-1/3 border rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-3 border-b">
                <h2 className="font-semibold">Conversations</h2>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: "500px" }}>
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  <ul>
                    {conversations.map((conv) => (
                      <li
                        key={conv.userId}
                        className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${selectedConversation?.userId === conv.userId
                            ? "bg-green-50"
                            : ""
                          }`}
                        onClick={() => handleSelectConversation(conv)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{conv.name}</p>
                            <p className="text-sm text-gray-500 truncate">
                              {conv.lastMessage?.content || "No messages yet"}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* ✅ Message Area */}
            <div className="md:w-2/3 border rounded-lg flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="bg-gray-100 p-3 border-b">
                    <h2 className="font-semibold">
                      Chat with {selectedConversation.name}
                    </h2>
                  </div>

                  <div
                    className="flex-1 p-4 overflow-y-auto bg-gray-50"
                    style={{ height: "400px" }}
                  >
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-4">
                        <p>No messages yet. Start a conversation!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((msg) => (
                          <div
                            key={msg._id}
                            className={`p-3 rounded-lg max-w-[80%] ${msg.sender._id === user._id
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
