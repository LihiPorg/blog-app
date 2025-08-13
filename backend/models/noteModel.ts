import mongoose from 'mongoose';

// Define the author subdocument schema with _id disabled
const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }
}, { _id: false });

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: authorSchema,   // allow object
    required: false,
    default: null          // or null
  },
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { collection: 'notes' });


const Note = mongoose.model('Note', noteSchema);

export default Note;
