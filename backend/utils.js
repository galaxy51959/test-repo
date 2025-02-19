const path = require('path');
const fs = require('fs').promises;
const { fromPath } = require('pdf2pic');
const { createWorker } = require('tesseract.js');
const { DocxLoader } = require('@langchain/community/document_loaders/fs/docx');
const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf');

const TMP_IMAGES_PATH = path.resolve(__dirname, 'public/tmp_images');
const TESTS_PATH = path.resolve(__dirname, 'public/tests');

const PDF_OPTIONS = {
    density: 150,
    saveFilename: 'page',
    savePath: TMP_IMAGES_PATH,
    format: 'png',
    size: null,
};

exports.parsePdf = async (filePath) => {
    const pdfLoader = new PDFLoader(path.join(TESTS_PATH, filePath));
    const docs = await pdfLoader.load();
    return docs.map((doc) => doc.pageContent).join('\n');
};

exports.convertPdfToImage = async (pdfPath) => {
    try {
        const converter = fromPath(path.join(TESTS_PATH, pdfPath), PDF_OPTIONS);
        const result = await converter.bulk(-1, { responseType: 'image' });
        // console.log(result[0]);
        return result.map(page => page.path);
    } catch (error) {
        console.error('Error converting PDF to images:', error);
        throw error;
    }
};

exports.extractTextFromImages = async (imagePaths) => {
    const worker = await createWorker('eng');
    let fullText = '';
    try {
        for (const imgPath of imagePaths) {
            const { data: { text } } = await worker.recognize(imgPath);
            fullText += text + "\n";
            await fs.unlink(imgPath); // Clean up temporary image
        }
    } catch (error) {
        console.error('Error extracting text from images:', error);
        throw error;
    } finally {
        await worker.terminate();
    }
    return fullText;
};

exports.parseDocx = async (filePath) => {
    try {
        const loader = new DocxLoader(path.join(TESTS_PATH, filePath));
        const docs = await loader.load();
        return docs.map(doc => doc.pageContent).join('\n');
    } catch (error) {
        console.error('Error parsing DOCX file:', error);
        throw error;
    }
};

exports.parseFile = async (file) => {
    try {
        await fs.mkdir(TMP_IMAGES_PATH, { recursive: true });
        switch (file.mimetype) {
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return await this.parseDocx(file.name);
            case 'application/pdf':
                const imagePaths = await this.convertPdfToImage(file.name);
                return await this.extractTextFromImages(imagePaths);
            default:
                throw new Error('Unsupported file type');
        }
    } catch (error) {
        console.error('Error parsing file:', error);
        throw error;
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
