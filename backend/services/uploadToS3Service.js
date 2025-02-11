const s3Client = require("../config/aws-config");

exports.uploadFileToS3 = async (file, bucketName, key) => {
    const uploadParams = {
        Bucket: bucketName,
        Key: key,
        Body: fromNodeStream(file.stream)
    };

    const upload = new Upload({
        client: s3Client,
        params: uploadParams
    });

    await upload.send();
}