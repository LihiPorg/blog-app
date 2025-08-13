import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: false },
    username: { type: String, required: true, unique: false },
    passwordHash: { type: String, required: true }
  },
  { collection: 'users' }
);

const User = mongoose.model('User', userSchema);

export default User;
