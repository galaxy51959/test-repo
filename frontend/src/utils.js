export const getFullName = (x) =>
  `${x.firstName} ${x.middleName ? x.middleName : ""} ${x.lastName}`;

export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return "";

  const today = new Date();
  const birth = new Date(dateOfBirth);

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();

  if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
    years--;
    months += 12;
  }

  if (today.getDate() < birth.getDate()) {
    months--;
    if (months < 0) {
      months = 11;
      years--;
    }
  }

  return {
    years: years,
    months: months,
  };
};
