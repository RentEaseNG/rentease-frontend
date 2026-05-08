import React, { useState, useEffect, useRef, useCallback } from "react";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { MessageSquare, Send, Circle } from "lucide-react";

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmt = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return d.toLocaleDateString();
};

const timeStr = (dateStr) =>
  new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// ─── Conversation list item ───────────────────────────────────────────────────
const ConvItem = ({ conv, selected, onlineUsers, onClick }) => {
  const isOnline = onlineUsers.has(conv.otherUser._id?.toString());
  return (
    <li
      onClick={onClick}
      className={`px-4 py-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${selected ? "bg-green-50 border-l-4 border-l-green-700" : ""
        }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar with online dot */}
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
            {conv.otherUser.name?.charAt(0).toUpperCase()}
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <p className="font-semibold text-sm text-gray-800 truncate">{conv.otherUser.name}</p>
            <span className="text-xs text-gray-400 shrink-0 ml-2">{fmt(conv.lastActivity)}</span>
          </div>
          <p className="text-xs text-gray-400 truncate mt-0.5">{conv.property?.title}</p>
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {conv.lastMessage?.content || "No messages yet"}
          </p>
        </div>
        {conv.unreadCount > 0 && (
          <span className="shrink-0 bg-green-700 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
          </span>
        )}
      </div>
    </li>
  );
};

// ─── Message bubble ───────────────────────────────────────────────────────────
const Bubble = ({ msg, isMine, isDeleted }) => (
  <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-[72%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${isMine
        ? "bg-green-700 text-white rounded-br-sm"
        : "bg-white border border-gray-100 text-gray-800 shadow-sm rounded-bl-sm"
        } ${isDeleted ? "opacity-50 italic" : ""}`}
    >
      <p>{msg.content}</p>
      <p className={`text-[10px] mt-1 text-right ${isMine ? "text-green-200" : "text-gray-400"}`}>
        {timeStr(msg.createdAt)}
        {isMine && msg.read && <span className="ml-1">✓✓</span>}
        {isMine && !msg.read && <span className="ml-1">✓</span>}
      </p>
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const Messages = () => {
  const { user, token } = useAuth();
  const { socket } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [activeCon, setActiveCon] = useState(null);   // full conv object
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  const msgContainerRef = useRef(null);
  const typingTimer = useRef(null);
  const isTyping = useRef(false);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    if (msgContainerRef.current) {
      msgContainerRef.current.scrollTop = msgContainerRef.current.scrollHeight;
    }
  }, []);

  // ── Fetch conversation list ────────────────────────────────────────────────
  const fetchConversations = useCallback(async () => {
    if (!token) return;
    try {
      const res = await apiClient.get("/messages/conversations");
      setConversations(res.data.data ?? []);
    } catch (err) {
      console.error("fetchConversations:", err);
    } finally {
      setLoadingConvs(false);
    }
  }, [token]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  // ── Socket event listeners ─────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const onNewMessage = (msg) => {
      // Append to active conversation if matching
      setMessages((prev) => {
        const alreadyExists = prev.some((m) => m._id === msg._id);
        if (alreadyExists) return prev;
        return [...prev, msg];
      });
      // Refresh conversation list to update preview + unread count
      fetchConversations();
    };

    // Sender: replace optimistic message with confirmed one from server
    const onMessageSent = (msg) => {
      setMessages((prev) =>
        prev.map((m) => (m._id?.startsWith("opt-") && m.content === msg.content ? msg : m))
      );
    };

    const onMessageRead = ({ messageId, readAt }) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, read: true, readAt } : m))
      );
    };

    const onUserTyping = ({ senderId, senderName, propertyId }) => {
      if (activeCon && senderId === activeCon.otherUser._id?.toString()) {
        setTypingUser(senderName);
      }
    };

    const onUserStopTyping = ({ senderId }) => {
      if (activeCon && senderId === activeCon.otherUser._id?.toString()) {
        setTypingUser(null);
      }
    };

    const onStatusChanged = ({ userId, status }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (status === "online") next.add(userId);
        else next.delete(userId);
        return next;
      });
    };

    socket.on("new_message", onNewMessage);
    socket.on("message_sent", onMessageSent);
    socket.on("message_read", onMessageRead);
    socket.on("user_typing", onUserTyping);
    socket.on("user_stop_typing", onUserStopTyping);
    socket.on("user_status_changed", onStatusChanged);

    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("message_sent", onMessageSent);
      socket.off("message_read", onMessageRead);
      socket.off("user_typing", onUserTyping);
      socket.off("user_stop_typing", onUserStopTyping);
      socket.off("user_status_changed", onStatusChanged);
    };
  }, [socket, activeCon, fetchConversations]);

  // ── Scroll to bottom on new messages / typing ─────────────────────────────
  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUser, scrollToBottom]);

  // ── Select conversation → load history ────────────────────────────────────
  const handleSelectConversation = async (conv) => {
    setActiveCon(conv);
    setMessages([]);
    setTypingUser(null);
    setLoadingMsgs(true);
    try {
      const res = await apiClient.get(
        `/messages/conversation/${conv.otherUser._id}/${conv.property._id}`
      );
      setMessages(res.data.data?.messages ?? []);
      // Scroll instantly to bottom when switching conversations
      setTimeout(() => scrollToBottom("instant"), 0);
      // Update conversation list to clear unread badge
      setConversations((prev) =>
        prev.map((c) =>
          c.conversationId === conv.conversationId ? { ...c, unreadCount: 0 } : c
        )
      );
    } catch (err) {
      console.error("fetchMessages:", err);
    } finally {
      setLoadingMsgs(false);
    }
  };

  // ── Send message via socket ────────────────────────────────────────────────
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !activeCon || !socket) return;

    const optimistic = {
      _id: `opt-${Date.now()}`,
      sender: { _id: user._id },
      receiver: { _id: activeCon.otherUser._id },
      property: { _id: activeCon.property._id },
      content: input.trim(),
      read: false,
      createdAt: new Date().toISOString(),
    };

    // Show immediately (optimistic)
    setMessages((prev) => [...prev, optimistic]);
    setInput("");

    // Stop typing indicator
    if (isTyping.current) {
      socket.emit("typing_stop", {
        receiverId: activeCon.otherUser._id,
        propertyId: activeCon.property._id,
      });
      isTyping.current = false;
    }

    // Emit via socket
    socket.emit("send_message", {
      receiverId: activeCon.otherUser._id,
      propertyId: activeCon.property._id,
      content: optimistic.content,
    });
  };

  // ── Typing indicators ──────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!socket || !activeCon) return;

    if (!isTyping.current) {
      isTyping.current = true;
      socket.emit("typing_start", {
        receiverId: activeCon.otherUser._id,
        propertyId: activeCon.property._id,
      });
    }

    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      isTyping.current = false;
      socket.emit("typing_stop", {
        receiverId: activeCon.otherUser._id,
        propertyId: activeCon.property._id,
      });
    }, 1500);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Please log in to view your messages.</p>
      </div>
    );
  }

  // On mobile, show only one panel at a time
  const showList = !activeCon;
  const showChat = !!activeCon;

  return (
    <div className="bg-gray-50" style={{ height: 'calc(100vh - 64px)' }}>
      <div className="max-w-6xl mx-auto h-full md:p-6 flex flex-col md:block">
        <div className="flex h-full bg-white md:rounded-2xl md:shadow-md overflow-hidden md:border border-gray-100">

          {/* ── Left: Conversation list ──────────────────────────────── */}
          {/* On mobile: full-width, hidden when chat is open */}
          <div className={`
            flex flex-col border-r border-gray-100 shrink-0
            w-full md:w-80
            ${showChat ? 'hidden md:flex' : 'flex'}
          `}>
            <div className="px-4 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <MessageSquare size={18} className="text-green-700" />
              <h1 className="font-bold text-lg text-gray-800">Messages</h1>
            </div>

            {loadingConvs ? (
              <div className="flex-1 space-y-3 p-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2 px-4 text-center">
                <MessageSquare size={36} strokeWidth={1.2} />
                <p className="text-sm font-medium">No conversations yet</p>
                <p className="text-xs">Start messaging from a property page</p>
              </div>
            ) : (
              <ul className="flex-1 overflow-y-auto">
                {conversations.map((conv) => (
                  <ConvItem
                    key={conv.conversationId}
                    conv={conv}
                    selected={activeCon?.conversationId === conv.conversationId}
                    onlineUsers={onlineUsers}
                    onClick={() => handleSelectConversation(conv)}
                  />
                ))}
              </ul>
            )}
          </div>

          {/* ── Right: Chat window ───────────────────────────────────── */}
          {/* On mobile: full-width, hidden when no chat is open */}
          <div className={`
            flex-1 flex flex-col min-w-0
            ${showList ? 'hidden md:flex' : 'flex'}
          `}>
            {!activeCon ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3 p-6 text-center">
                <MessageSquare size={48} strokeWidth={1.2} />
                <p className="text-base font-medium">Select a conversation</p>
                <p className="text-sm">Choose someone to start chatting</p>
              </div>
            ) : (
              <>
                {/* Chat header — back button on mobile */}
                <div className="px-4 py-3.5 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
                  {/* Back arrow — mobile only */}
                  <button
                    className="md:hidden text-gray-500 hover:text-gray-800 mr-1 shrink-0"
                    onClick={() => setActiveCon(null)}
                    aria-label="Back to conversations"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                      {activeCon.otherUser.name?.charAt(0).toUpperCase()}
                    </div>
                    {onlineUsers.has(activeCon.otherUser._id?.toString()) && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-sm leading-tight truncate">{activeCon.otherUser.name}</p>
                    <p className="text-xs text-gray-400 truncate">{activeCon.property?.title}</p>
                  </div>

                  {onlineUsers.has(activeCon.otherUser._id?.toString()) && (
                    <span className="ml-auto flex items-center gap-1 text-xs text-green-600 font-medium shrink-0">
                      <Circle size={7} fill="currentColor" /> Online
                    </span>
                  )}
                </div>

                {/* Messages area */}
                <div
                  ref={msgContainerRef}
                  className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5 bg-gray-50"
                >
                  {loadingMsgs ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-700" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                      <p className="text-sm">No messages yet — say hello! 👋</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <Bubble
                        key={msg._id}
                        msg={msg}
                        isMine={(msg.sender?._id ?? msg.sender) === user._id}
                        isDeleted={msg.isDeleted}
                      />
                    ))
                  )}
                  {/* Typing indicator */}
                  {typingUser && (
                    <div className="flex items-center gap-2 text-gray-400 text-xs pl-1">
                      <span className="flex gap-0.5">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                      {typingUser} is typing…
                    </div>
                  )}
                </div>

                {/* Input bar */}
                <form onSubmit={handleSend} className="px-4 py-3 border-t border-gray-100 bg-white flex gap-2 items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type a message…"
                    className="flex-1 px-4 py-2.5 text-sm rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || !socket}
                    className="bg-green-700 text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-green-800 transition-colors disabled:opacity-40 shrink-0"
                  >
                    <Send size={15} />
                  </button>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Messages;
