const SERVER_URL = `http://localhost:5000/api/students`;

export const getStudents = async () => {
    try {
        const getResults = await fetch(`${SERVER_URL}`);
        const response = await getResults.json();

        return response;
    } catch (error) {
        console.error('Error fetching Students:', error);
    }
}