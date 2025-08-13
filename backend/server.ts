import { connectToDB } from './config/db';
import app from './expressApp';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;


connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
