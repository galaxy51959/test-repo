const SERVER_URL = "http://localhost:5000/api/calendar";

export const getNotionData = async () => {
  const response = await fetch(`${SERVER_URL}`);
  const data = await response.json();
  return data;
};
