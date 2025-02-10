export const getTemplate = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/reports/template`
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Fetch Template Error: ", error);
    throw error;
  }
};

export const generateReport = async (formData, id) => {
  try {
    console.log(id);
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/reports/${id}/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
    const result = await response.json();
    console.log("Generate Result: ", result);
    return result;
  } catch (error) {
    console.error("Generate Report Error: ", error);
    throw error;
  }
};

export const uploadFile = async (formData) => {
  try {
    await fetch(`${import.meta.env.VITE_APP_API_URL}/reports/upload`, {
      method: "POST",
      body: formData,
    });
  } catch (error) {
    console.error("Error File Upload: ", error);
  }
};

export const getReports = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/reports`);
    const result = await response.json();
    console.log("Fetching Reports: ", result);
    return result;
  } catch (error) {
    console.error("Fetching Reports Error: ", error);
  }
};

export const extractStudentInfo = async (formData) => {
  try {
    // const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/reports/upload`, {
    //   method: "POST",
    //   body: formData,
    // });
    // const result = await response.json();
    // return result.student;
    const result = {
      student: {
        name: "Joshua Ruiz Perez",
        student_id: "203102",
        state_student_id: "3510587676",
        status: "Active",
        student_number: "6856",
        grade: 11,
        age: 16,
        gender: "Male",
        birthdate: "2006-03-08",
        counselor: "Cardona, F.",
        language_fluency: "Redesignated Fluent English Proficient (RFEP)",
        reporting_language: "Spanish",
        interdistrict_status: null,
        access_codes: ["dq53ddy", "qlgdwck", "j6qjed5"],
        school: "Adelanto High School",
        attendance: {
          absences: {
            total: 10,
            this_month: 0,
            this_week: 0,
          },
          tardies: {
            total: 11,
            this_month: 2,
            this_week: 0,
            unexcused: 6,
          },
          days_present: 101,
          attendance_percentage: "90%",
        },
        class_summary: [
          {
            course_id: "12173",
            course_name: "English 11",
            teacher: "Emerick, HD",
            room: "107",
            grade: "F",
            percentage: "13.5%",
            last_updated: "Feb 13",
          },
          {
            course_id: "29324",
            course_name: "Auto I",
            teacher: "Mendoza, D.",
            room: "C114",
            grade: "D",
            percentage: "63.0%",
            last_updated: "Feb 09",
          },
          {
            course_id: "33552B",
            course_name: "IntegMath1B",
            teacher: "Black, JE",
            room: "208",
            grade: "F",
            percentage: "37.5%",
            last_updated: "Jan 30",
          },
          {
            course_id: "0090X",
            course_name: "GrdIntv CR Sped",
            teacher: "Stewart, S.",
            room: "D128",
            grade: "A",
            percentage: null,
            last_updated: null,
          },
          {
            course_id: "56050",
            course_name: "Advanced PE",
            teacher: "Gormley, K",
            room: "GYM",
            grade: "F",
            percentage: "12.9%",
            last_updated: "Feb 10",
          },
          {
            course_id: "65344",
            course_name: "US History XP",
            teacher: "Yancy, JE",
            room: "110",
            grade: "F",
            percentage: "20.0%",
            last_updated: "Feb 07",
          },
        ],
        credits: {
          completed: 105,
          enrolled: 25,
          needed: 90,
        },
        graduation_status: {
          algebra_1: "Requirement Met",
          physical_fitness: "Not Tested/Undetermined",
        },
        parent_contacts: [
          {
            email: "silverrome2@yahoo.com",
            last_accessed: "04/13/2021",
          },
          {
            email: "juanaperez1774@gmail.com",
            last_accessed: null,
          },
        ],
        student_email: "RuizPerezJ10206@vvstu.org",
        student_last_accessed: "12/15/2022",
      },
    };
    return result.student;
  } catch (error) {
    console.log("Extracting SEIS Error: ", error);
  }
};
