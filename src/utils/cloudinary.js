import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

//configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "vidtube"
    });
    console.log("File uploaded on cloudinary. File src: " + response.url);
    //once file is uploaded we want to delete it from our server
    fs.unlinkSync(localFilePath);
    return {
      url: response.secure_url,
      public_id: response.public_id
    };
  } catch (error) {
    console.log("Error on cloudinry ", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

// const getPublicIdFromUrl = (url) => {
//   if (!url) return null;
//   const parts = url.split("/"); // Split the URL by "/"
//   const fileName = parts[parts.length - 1]; // Get the last part: "rkgpvvtzlqr64lpmpcqb.mp4"
//   const publicId = fileName.split(".")[0]; // Remove extension
//   return publicId;
// };

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = cloudinary.uploader.destroy(publicId);
    console.log("Deleted from cloudinary!", publicId);
  } catch (error) {
    console.log("Error deleting from cloudinary!", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
