export const sendSMS = async (phoneNumber, message) => {
    try {
        const data = {
            phoneNumber: phoneNumber,
            message: message,
        }
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/calls/SendSMS`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
      } catch (error) {
        throw new Error('Failed to send SMS: ' + error.message);
      }
}

export const makeCall = async (phoneNumber) =>{
    try {
        const data = {
            phoneNumber: phoneNumber
        }
        const response = await fetch(`${import.meta.VITE_APP_API_URL}/calls/MakeCALL`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
    } catch (error) {
      throw new Error('Failed to initiate call: ' + error.message);
    }
}

