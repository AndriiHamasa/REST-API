import { Schema, model } from "mongoose";
import { handleSaveError, handleUpdateValidate } from "./hooks.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.pre("findByIdAndUpdate", handleUpdateValidate);

contactSchema.post("save", handleSaveError);

contactSchema.post("findByIdAndUpdate", handleSaveError);

const Contact = model("contact", contactSchema);

export default Contact;
