import mongoose, { Schema, model, models, Document } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
}

const NoteSchema = new Schema<INote>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Note = models.Note || model<INote>("Note", NoteSchema);
Note.find()
export default Note;
