const s3Client = require("../config/aws-config");
// const { fromNodeStream } = require('@aws-sdk/stream-transform-node');
// const { Upload } = require('@aws-sdk/lib-storage');
exports.uploadFileToS3 = async (file, bucketName, key) => {
    const uploadParams = {
        Bucket: bucketName,
        Key: key,
        Body: file.stream
    };
    s3Client.upload(
        uploadParams,(err, data) =>{
            if (err) {
                return console.error("Error uploading file:", err);
              }
              console.log(`File uploaded successfully. ${data.Location}`);

        }
    )
    const params = {
        Bucket: bucketName,
        Key: key,
        Expires: 60 // URL expires in 60 seconds
      };
      
      const url = s3Client.getSignedUrl('getObject', params);
      return  url;
    //   console.log("url", url);
    // const upload = new Upload({
    //     client: s3Client,
    //     params: uploadParams
    // });
}