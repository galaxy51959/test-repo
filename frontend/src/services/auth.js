const API_URL = 'http://localhost:5000/api';

export const signIn = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });
    const result = await response.json();
    console.log(result);
    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
    }
    return result;
  } catch (error) {
    throw error.response?.data?.message || 'An error occurred';
  }
};

export const signOut = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  navigate('/signin');
};

export const getToken = () => localStorage.getItem('token');

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}; 