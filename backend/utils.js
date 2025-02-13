const fs = require('fs');
const pdfParse = require('pdf-parse');
const { DocxLoader } = require('@langchain/community/document_loaders/fs/docx');
// const docxParser = require('docx-parser');

exports.parsePdf = async (filePath) => {
    const pdfBuffer = fs.readFileSync(`./public/tests/${filePath}`);
    const data = await pdfParse(pdfBuffer);
    return data.text;
};

exports.parseDocx = async (filePath) => {
    // return new Promise((resolve, reject) => {
    //     docxParser.parseDocx(`./public/tests/${filePath}`, function (data) {
    //         resolve(data);
    //     });
    // });
    const loader = new DocxLoader(`./public/tests/${filePath}`);
    const docs = await loader.load();
    // console.log(docs[0].pageContent);
    return docs.map(doc => doc.pageContent).join('\n');
};

exports.parseFile = async (file) => {
    switch (file.mimetype) {
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return await this.parseDocx(file.name);
        case 'application/pdf':
            return await this.parsePdf(file.name);
    }
};

exports.getFullName = (x) =>
    `${x.firstName} ${x.middleName ? x.middleName : ''} ${x.lastName}`;

exports.calculateAge = (dateOfBirth) => {
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
        months: months,
    };
};
