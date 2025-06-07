// utils/uploadToCloudinary.ts

export const uploadToCloudinary = async (imageUri: string): Promise<string> => {
  const formData = new FormData();

  formData.append("file", {
    uri: imageUri,
    type: "image/jpeg", // adjust this dynamically if needed
    name: "avatar.jpg",
  } as any);

  formData.append("upload_preset", "GrabYourShow"); // 👈 your preset name
  formData.append("cloud_name", "dcyah4eaw");

  try {
    const response = await fetch("https://api.cloudinary.com/v1_1/dcyah4eaw/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Upload failed:", data);
      throw new Error(data?.error?.message || "Upload failed");
    }

    return data.secure_url; // ✅ use this to update Firestore
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};
