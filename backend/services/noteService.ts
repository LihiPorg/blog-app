import Note from '../models/noteModel';

export const getNotesService = async (skip: number, perPage: number) => {
  const notes = await Note.find()
    .sort({ _id: -1 })
    .skip(skip)
    .limit(perPage);
  const total = await Note.countDocuments();
  console.log('Total notes:', total);
  return { notes, total };
};

export const getNoteByIdService = async (noteID: string) => {
  const note = await Note.findById(noteID);
  return note;
};
export const createNoteService = async (
  title: string,
  content: string,
  author: any,
  user: any
) => {
  const newNote = await Note.create({
    title,
    content,
    author: author ,
    user: user
  });
  return newNote;
};


export const updateNoteService = async (
  noteID: string,
  { title, content, author }: { title: string; content: string; author?: { name?: string | null; email?: string | null } | null }
) => {
  const updatedNote = await Note.findByIdAndUpdate(
    noteID,
    { title, content, author: author ?? null },
    { new: true, runValidators: true }
  );
  

  return updatedNote;
};

export const getNoteByIndexService = async (index: number) => {
  const note = await Note.find()
    .sort({ _id: -1 })
    .skip(index)
    .limit(1);

  return note[0] || null;
};

export const deleteNoteService = async (noteID: string) => {
  const deleted = await Note.findByIdAndDelete(noteID);
  return deleted;
};

