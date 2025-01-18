const SERVER_URL = `http://localhost:5000/api/reports`;

export const generateReport = async (studentId, templateType) => {
    try {
        const getResult = await fetch(`${SERVER_URL}/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ studentId, templateType })
        });
        const data = await getResult.json();
        console.log("Generate Result: ", data);
        return data;
    } catch (error) {
        console.error("Generate Report Error: ", error);
        throw error;
    }
}

export const getReports = async () => {
    try {
        const getResults = await fetch(`${SERVER_URL}`);
        const data = await getResults.json();
        console.log("Fetching Reports: ", data);
        return data;
    } catch (error) {
        console.error("Fetching Reports Error: ", error);
    }
}