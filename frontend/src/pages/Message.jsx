import { useState } from "react";
import eyeplumService from "../services/eyeplumService";
import { toast } from "react-hot-toast";
import { sendSMS, makeCall  } from "../actions/MessageAction";
const Message = () => {
  const [messageType, setMessageType] = useState("sms"); // "sms" or "call"
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (messageType === "sms") {
        await sendSMS(phoneNumber, message);
        toast.success("SMS sent successfully!");
        setMessage("");
      } else {
        await makeCall(phoneNumber);
        toast.success("Call initiated successfully!");
      }
      setPhoneNumber("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Send Message or Make Call</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md ${
              messageType === "sms"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setMessageType("sms")}
          >
            Send SMS
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              messageType === "call"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setMessageType("call")}
          >
            Make Call
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
              required
            />
          </div>

          {messageType === "sms" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Enter your message"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <span>Processing...</span>
            ) : messageType === "sms" ? (
              "Send SMS"
            ) : (
              "Make Call"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Message;
