const fs = require('fs');
const pdfParse = require('pdf-parse');
const docxParser = require('docx-parser');

exports.parsePdf = async (filePath) => {
    const pdfBuffer = fs.readFileSync(`./public/tests/${filePath}`);
    const data = await pdfParse(pdfBuffer);
    return data.text
}

exports.parseDocx = (filePath) => {
  return new Promise((resolve, reject) => {
    docxParser.parseDocx(`./public/tests/${filePath}`, function(data) {
      console.log("Parsed DOCX Content:", data);
      resolve(data);
    });
  });
}

exports.getFullName = x => `${x.firstName} ${x.middleName ? x.middleName : ""} ${x.lastName}`;

exports.calculateAge = dateOfBirth => {
    if (!dateOfBirth) return '';

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
        months: months
    }
}