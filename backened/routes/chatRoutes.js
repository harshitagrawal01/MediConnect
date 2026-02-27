import express from "express";
import ChatMessage from "../models/ChatMessage.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const router = express.Router();

// Memory storage — stream directly to Cloudinary, no local files
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG and PDF files are allowed"));
  },
});

// Get all messages for an appointment
router.get("/:appointmentId", async (req, res) => {
  try {
    const messages = await ChatMessage.find({
      appointmentId: req.params.appointmentId,
    }).sort({ createdAt: 1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// Mark messages as seen
router.post("/seen/:appointmentId/:role", async (req, res) => {
  const { appointmentId, role } = req.params;
  await ChatMessage.updateMany(
    { appointmentId, senderRole: { $ne: role }, seen: false },
    { seen: true }
  );
  req.io.to(appointmentId).emit("message_seen", { seenBy: role });
  res.json({ success: true });
});

// Upload file to Cloudinary
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file received" });
    }

    const isPdf = req.file.mimetype === "application/pdf";

    // Stream buffer to Cloudinary
    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "mediconnect/chat",
            resource_type: isPdf ? "raw" : "image",
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await streamUpload();

    res.json({
      success: true,
      fileUrl: result.secure_url,   // ✅ full Cloudinary URL, not a local path
      fileName: req.file.originalname,
      messageType: "file",
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
