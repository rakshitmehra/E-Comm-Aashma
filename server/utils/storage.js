// const AWS = require('aws-sdk');

// const keys = require('../config/keys');

// exports.s3Upload = async image => {
//   try {
//     let imageUrl = '';
//     let imageKey = '';

//     if (!keys.aws.accessKeyId) {
//       console.warn('Missing aws keys');
//     }

//     if (image) {
//       const s3bucket = new AWS.S3({
//         accessKeyId: keys.aws.accessKeyId,
//         secretAccessKey: keys.aws.secretAccessKey,
//         region: keys.aws.region
//       });

//       const params = {
//         Bucket: keys.aws.bucketName,
//         Key: image.originalname,
//         Body: image.buffer,
//         ContentType: image.mimetype
//       };

//       const s3Upload = await s3bucket.upload(params).promise();

//       imageUrl = s3Upload.Location;
//       imageKey = s3Upload.key;
//     }

//     return { imageUrl, imageKey };
//   } catch (error) {
//     return { imageUrl: '', imageKey: '' };
//   }
// };

const cloudinary = require('cloudinary').v2;
const keys = require('../config/keys');

cloudinary.config({
  cloud_name: keys.cloudinary.cloud_name,
  api_key: keys.cloudinary.api_key,
  api_secret: keys.cloudinary.api_secret
});

// Upload (previously s3Upload)
exports.s3Upload = async image => {
  try {
    if (!image) return { imageUrl: '', imageKey: '' };

    const base64Image = `data:${image.mimetype};base64,${image.buffer.toString('base64')}`;

    const upload = await cloudinary.uploader.upload(base64Image, {
      folder: 'products'
    });

    return {
      imageUrl: upload.secure_url,
      imageKey: upload.public_id
    };
  } catch (err) {
    console.log('Upload err:', err);
    return { imageUrl: '', imageKey: '' };
  }
};

// Delete image from Cloudinary
exports.deleteImage = async publicId => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.log('Cloudinary delete error:', err);
  }
};
