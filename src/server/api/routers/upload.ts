import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "~/server/utils/cloudinary";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { file } = req.body;

    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const uploadResponse = await cloudinary.uploader.upload(file, {
      upload_preset: "your_preset",
    });

    return res.status(200).json({ url: uploadResponse.secure_url });
  } catch (error) {
    return res.status(500).json({ error: "Upload failed", details: error });
  }
}