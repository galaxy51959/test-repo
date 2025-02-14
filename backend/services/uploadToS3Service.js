const s3 = require("../config/aws-s3");

exports.uploadFileToS3 = async (file, bucketName, key) => {
    const uploadParams = {
        Bucket: bucketName,
        Key: key,
        Body: file.stream
    };
   

    s3.upload(uploadParams, (err, data) => {
        if (err) {
          return console.error("Error uploading file:", err);
        }
        console.log(`File uploaded successfully. ${data.Location}`);
      });
      const params = {
        Bucket: process.env.bucketName, // Correct bucket name
        Key: key, // Exact object key (case-sensitive)
       Expires: 60 // URL expiration time (seconds)
      };
      
      // Generate the pre-signed URL
      const url = s3.getSignedUrl('getObject', params);

      console.log("url", url);
      return url;

    
}