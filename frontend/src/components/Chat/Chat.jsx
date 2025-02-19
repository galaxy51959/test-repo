import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { sendSMS, makeCall } from "../../actions/MessageAction";
import {
  PaperAirplaneIcon,
  PhoneIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/outline";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "John Doe",
      phoneNumber: "+1234567890",
      status: "online",
      lastSeen: new Date(),
      avatar: "JD",
    },
    {
      id: 2,
      name: "Alice Smith",
      phoneNumber: "+1987654321",
      status: "offline",
      lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
      avatar: "AS",
    },
    {
      id: 3,
      name: "Test User",
      phoneNumber: import.meta.env.TWILIO_PHONE_NUMBER || "+15622213408", // Your Twilio number
      status: "online",
      lastSeen: new Date(),
      avatar: "TU",
    },
  ]);
  const messagesEndRef = useRef(null);
  const ws = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    ws.current = new WebSocket(`ws://${window.location.hostname}:8080`);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  const handleWebSocketMessage = (data) => {
    if (data.type === "newMessage") {
      setMessages((prev) => [...prev, data.message]);
    } else if (data.type === "newVoiceMessage") {
      setMessages((prev) => [
        ...prev,
        {
          ...data.message,
          type: "voice",
        },
      ]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    try {
      await sendSMS(selectedContact.phoneNumber, newMessage);
      setMessages((prev) => [
        ...prev,
        {
          body: newMessage,
          from: "me",
          timestamp: new Date(),
          type: "sms",
        },
      ]);
      setNewMessage("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCall = async () => {
    if (!selectedContact) return;

    try {
      await makeCall(selectedContact.phoneNumber);
      toast.success("Call initiated successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Contacts Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Contacts</h2>
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`p-3 cursor-pointer rounded-lg transition-colors duration-200 ${
                selectedContact?.id === contact.id
                  ? "bg-blue-50 border-l-4 border-blue-500"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                  {contact.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{contact.name}</div>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        contact.status === "online"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    {contact.phoneNumber}
                  </div>
                  <div className="text-xs text-gray-400">
                    {contact.status === "online"
                      ? "Online"
                      : `Last seen ${new Date(contact.lastSeen).toLocaleTimeString()}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white p-4 border-b flex justify-between items-center">
          <div>
            <h3 className="font-semibold">
              {selectedContact?.name || "Select a contact"}
            </h3>
            <p className="text-sm text-gray-500">
              {selectedContact?.phoneNumber}
            </p>
          </div>
          {selectedContact && (
            <button
              onClick={handleCall}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <PhoneIcon className="h-5 w-5 text-green-500" />
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.from === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.from === "me"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {message.type === "voice" ? (
                  <audio controls src={message.recordingUrl} />
                ) : (
                  <p>{message.body}</p>
                )}
                <div
                  className={`text-xs ${
                    message.from === "me" ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
