import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { receiveEmails } from "../actions/emailActions";
import { toast } from "react-hot-toast";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  console.log("<!-----------------SocketProvider Loading");

  useEffect(() => {
    console.log(user);

    if (user) {
      // Initialize socket connection
      const newSocket = io(`${import.meta.env.VITE_PUBLIC_URL}`);

      // Join user's room for notifications
      newSocket.emit("joinRoom", user.id);

      // Set up event listeners
      newSocket.on("connect", () => {
        console.log("<!-----------------Connected to socket server");
      });

      newSocket.on("reportUpdated", (data) => {
        console.log("Report updated:", data);
        // Handle report updates
      });

      newSocket.on("newAssessment", (data) => {
        console.log("New assessment:", data);
        // Handle new assessment notifications
      });

      newSocket.on("Message", (data) => {
      //  receiveEmails(data);
        toast.info("send from" + data.from);
      });
      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.close();
      };
    }

    return () => {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
};
