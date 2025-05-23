import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../connect";
import Note from "../Note";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === "GET") {
    const notes = await Note.find();
    return res.status(200).json(notes);
  }

  if (req.method === "POST") {
    const newNote = new Note(req.body);
    await newNote.save();
    return res.status(201).json(newNote);
  }

  res.status(405).end(); // Method Not Allowed
}
