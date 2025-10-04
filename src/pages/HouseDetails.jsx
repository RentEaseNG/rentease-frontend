import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import houses from "../data/houses.json";
import axios from "axios";
import PropertyReview from "../components/PropertyReview";
import BookApartment from "../components/BookApartment";
import { MessagesSquare, X } from "lucide-react";

function HouseDetails() {
  const [house, setHouse] = useState();
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const { id } = useParams();
  const { user, loading, token } = useAuth();

  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/properties/${id}`);
        const res = response.data.data
        setHouse(res)
      } catch (error) {
        console.error("Error fetching house details:", error);
      }
    };
    fetchHouseDetails();
  }, [id]);

  useEffect(() => {
    if (currentIndex === null) return; // lightbox closed → skip

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape") {
        setCurrentIndex(null); // close lightbox
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]); // re-run only when modal opens/closes

  // 🚨 Prevent redirect until auth check is done
  if (loading) {
    return (
      <div className="p-6">
        <p>Checking authentication...</p>
      </div>
    );
  }
  // 🔒 Block guests
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!house) {
    return (
      <div className="p-6">
        <p>House not found.</p>
        <Link to="/" className="text-green-900 underline p-2 rounded-lg">
          Back to listings
        </Link>
      </div>
    );
  }

  // all images (main + extras)
  const allImages = house.images || [];

  // navigation
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Create the new message object
    const newMessage = {
      id: Date.now(),
      sender: user?.name || user?.email,
      text: message,
      timestamp: new Date(),
      isUser: true
    };

    // Add message to UI
    setChatMessages([...chatMessages, newMessage]);

    // Prepare API payload
    const messagePayload = {
      propertyId: id,
      receiverId: house?.landlord?._id,
      content: message
    };

    if (!messagePayload.receiverId || !messagePayload.content) {
      console.error("Receiver ID or message content is missing.");
      return;
    }

    axios.post('http://localhost:5000/api/messages', messagePayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setMessage(""); // clear only after success
      })
      .catch(error => {
        console.error('Error sending message:', error.response?.data || error.message);
      });


    // Simulate landlord response after a short delay (for demo purposes)
    setTimeout(() => {
      const landlordResponse = {
        id: Date.now() + 1,
        sender: house?.landlord?.name || "Landlord",
        text: "Thank you for your interest. How can I help you with this property?",
        timestamp: new Date(),
        isUser: false
      };
      setChatMessages(prevMessages => [...prevMessages, landlordResponse]);
    }, 1000);
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Link to="/dashboard" className="text-blue-600 underline">
        ← Back to listings
      </Link>

      <div className="md:flex gap-6 mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="md:w-1/2">
          {/* Main Image */}
          <div className="mb-4">
            <img
              src={allImages[0]}
              alt={`${house.title} main`}
              onClick={() => setCurrentIndex(0)}
              className="w-full h-80 object-cover rounded-lg cursor-pointer hover:opacity-90"
            />
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] md:grid-cols-4 gap-4">
            {allImages.slice(1).map((img, index) => (
              <img
                key={index + 1}
                src={img}
                alt={`${house.title} ${index + 1}`}
                onClick={() => setCurrentIndex(index + 1)}
                className="h-32 w-32 object-cover rounded-md cursor-pointer hover:opacity-90"
              />
            ))}
          </div>
        </div>

        {/* Image Modal */}
        {currentIndex !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <button
              onClick={() => setCurrentIndex(null)}
              className="absolute top-5 right-5 text-white text-3xl font-bold cursor-pointer"
            >
              ✕
            </button>

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-5 text-white text-4xl font-bold px-3 py-1 bg-black bg-opacity-40 rounded-full hover:bg-opacity-70 cursor-pointer"
            >
              ‹
            </button>

            <img
              src={allImages[currentIndex]}
              alt="Selected"
              className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg"
            />

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-5 text-white text-4xl font-bold px-3 py-1 bg-black bg-opacity-40 rounded-full hover:bg-opacity-70 cursor-pointer"
            >
              ›
            </button>
          </div>
        )}

        {/* Details */}
        <div className="md:w-1/2">
          <h1 className="text-2xl font-bold">{house.title}</h1>
          <p className="text-green-600 font-bold text-lg">₦{house.price?.toLocaleString()}</p>
          <p className="text-gray-700 mt-2">{house.location}</p>
          <p className="text-gray-600 mt-1">
            <strong>Type:</strong> {house.apartmentType?.name || "N/A"}
          </p>

          <div className="mt-4 space-y-2">
            <p>
              <strong>Landlord:</strong> {house.landlord?.name || "N/A"}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {house?.fullAddress || "No full address yet"}
            </p>
            <p>
              <strong>Details:</strong>{" "}
              {house.description || "No extra details available"}
            </p>
            <p>
              <strong>Contact:</strong>{" "}
              {house.landlord?.email || "No contact available"}
            </p>
          </div>
          <div className="cta mt-6 bg-green-100 max-w-fit p-4 rounded">
            <span
              className="cursor-pointer flex items-center gap-2 text-green-700 hover:text-green-900"
              onClick={toggleChat}
            >
              <MessagesSquare size={20} />
              <span>Chat with Landlord</span>
            </span>
          </div>

          <div className="mt-6">
            <BookApartment />
          </div>
        </div>
      </div>

      {/* Chat Popup */}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 w-80 md:w-96 bg-white rounded-lg shadow-xl z-40 flex flex-col" style={{ height: "500px" }}>
          <div className="bg-green-700 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Chat with {house.landlord?.name || "Landlord"}</h3>
            <button onClick={toggleChat} className="text-white hover:text-gray-200 cursor-pointer">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 mt-4">
                <p>Start a conversation with the landlord</p>
              </div>
            ) : (
              <div className="space-y-3">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg max-w-[80%] ${msg.isUser
                        ? "bg-green-100 ml-auto"
                        : "bg-gray-200 mr-auto"
                      }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 cursor-pointer"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      <PropertyReview />
    </div>
  );
}

export default HouseDetails;
