import { authService } from "@/api/AuthService";
import axios from "axios";

export const uploadImageCloudinary = async (file: File) => {
  try {
  
    const { data } = await authService.workerCloudinory();

    
    const formDataPayload = new FormData();
    formDataPayload.append("file", file);
    formDataPayload.append("api_key", data.apiKey);
    formDataPayload.append("timestamp", data.timestamp.toString());
    formDataPayload.append("signature", data.signature);
    formDataPayload.append("folder", data.folder);

    
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${data.cloudName}/auto/upload`;

   
    const uploadRes = await axios.post(cloudinaryUrl, formDataPayload, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    
    return uploadRes.data.secure_url;
  } catch (error: any) {
    console.error("Error uploading image to Cloudinary:", error.response?.data || error.message);
    throw error;
  }
};
