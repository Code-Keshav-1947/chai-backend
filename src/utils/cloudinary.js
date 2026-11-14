import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.log(
    "Cloudinary credentials are not defined in environment variables"
  );
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, resourceType = "auto") => {
  try {
    if (!localFilePath) {
      throw new Error("Local file path is not provided");
    }
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
    });
    // file has been uploaded successfull
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    console.error("Error while uploading file on cloudinary: ", error);

    return null;
  }
};

const deleteFromCloudinary = async (fileUrlOrPublicId) => {
  try {
    // Extract publicId from fileUrl if necessary
    const publicId = fileUrlOrPublicId.includes("cloudinary.com")
      ? fileUrlOrPublicId.split("/").pop().split(".")[0]
      : fileUrlOrPublicId;

    if (!publicId) return null;
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    return response;
  } catch (error) {
    console.error("Error while deleting file from cloudinary: ", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
