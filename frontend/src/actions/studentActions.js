const SERVER_URL = `http://localhost:5000/api/students`;

export const getStudents = async () => {
    try {
        const response = await fetch(`${SERVER_URL}`);
        const result = await response.json();

        return result;
    } catch (error) {
        console.error('Error fetching Students:', error);
    }
}

export const getStudentById = async studentId => {
    try {
        const response = await fetch(`${SERVER_URL}/${studentId}`);
        const result = await response.json();

        return result;
    } catch (error) {
        console.error('Error fetching Students:', error);
    }
}

export const createStudent = async studentData => {
    try {
        const response = await fetch(`${SERVER_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });
        const result = await response.json();

        return result;
    } catch (error) {
        console.error('Error Creating Students:', error);
    }
}