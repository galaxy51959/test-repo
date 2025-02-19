export const getStudents = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/students`
    );
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error fetching Students:", error);
  }
};

export const addStudent = async (studentData) => {
  try {
    const student = {
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      gender: studentData.gender,
      dateOfBirth: studentData.dateOfBirth,
      grade: studentData.grade,
      school: studentData.school,
      language: studentData.language,
      parent: {
        name: studentData.parentName,
        phone: studentData.parentPhone,
        email: studentData.parentEmail,
      },
      teacher: {
        name: studentData.teacherName,
        phone: studentData.teacherPhone,
        email: studentData.teacherEmail,
      },
    };
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/students`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      }
    );
    const result = await response.json();
    return {
      _id: result._id,
      firstName: result.firstName,
      lastName: result.lastName,
      gender: result.gender,
      dateOfBirth: result.dateOfBirth,
      grade: result.grade,
      school: result.school,
      language: result.language,
      parentName: result.parent?.name,
      parentPhone: result.parent?.phone,
      parentEmail: result.parent?.email,
      teacherName: result.teacher?.name,
      teacherPhone: result.teacher?.phone,
      teacherEmail: result.teacher?.email,
    };
  } catch (error) {
    console.error("Error adding Students:", error);
  }
};

export const getStudentById = async (studentID) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/students/${studentID}`
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};
export const updateStudent = async (studentId, studentData) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/students/${studentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating Students:", error);
  }
};

export const deleteStudent = async (studentId) => {
  try {
    await fetch(`${import.meta.env.VITE_APP_API_URL}/students/${studentId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting Students:", error);
  }
};

export const assignLink = async (studentId, linkInfo) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/students/${studentId}/assign`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(linkInfo),
      }
    );
    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Error Creating Students:", error);
  }
};

export const uploadFile = async (formData, id) => {
  console.log(id);
  try {
    await fetch(`${import.meta.env.VITE_APP_API_URL}/students/${id}/upload`, {
      method: "POST",
      body: formData,
    });
  } catch (error) {
    console.error("Error File Upload: ", error);
  }
};

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
