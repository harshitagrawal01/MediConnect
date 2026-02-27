import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "appointment",
    },
    senderRole: {
      type: String,
      enum: ["patient", "doctor"],
      required: true,
    },
    delivered: {
      type: Boolean,
      default: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: "", // 
    },
    messageType: {
      type: String,
      enum: ["text", "file"],
      default: "text",
    },
    fileUrl: {
      type: String,
      default: null,
    },
    fileName: {
      type: String,
      default: null,
    },
    timestamp: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", chatMessageSchema);
