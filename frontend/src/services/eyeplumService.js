import { EYEPLUM_CONFIG } from "../config/eyeplumConfig";

const eyeplumService = {
  // Send SMS
  sendSMS: async (phoneNumber, message) => {
    try {
      const response = await fetch(`${EYEPLUM_CONFIG.BASE_URL}/v2/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${EYEPLUM_CONFIG.API_KEY}`,
          'X-Secret-Key': EYEPLUM_CONFIG.SECRET_KEY,
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          to: phoneNumber,
          text: message,
          from: EYEPLUM_CONFIG.SENDER_ID,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send SMS');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to send SMS: ' + error.message);
    }
  },

  // Make a call
  makeCall: async (phoneNumber) => {
    try {
      const response = await fetch(`${EYEPLUM_CONFIG.BASE_URL}/v2/calls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${EYEPLUM_CONFIG.API_KEY}`,
          'X-Secret-Key': EYEPLUM_CONFIG.SECRET_KEY,
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          to: phoneNumber,
          from: EYEPLUM_CONFIG.CALLER_ID,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to initiate call');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to initiate call: ' + error.message);
    }
  }
};

export default eyeplumService;