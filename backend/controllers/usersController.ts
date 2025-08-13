import { Request, Response,NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel'; 


export const createUser = async (req: Request, res: Response,next: NextFunction) => {
  try {
    const { name, email, username, password } = req.body;
    if (!username || !password){
       res.status(400).json({ error: 'Username and password are required' });
       return;
    }
    if (!name || !email){
       res.status(400).json({ error: 'name and email are required' });
       return;
    }
    const existing = await User.findOne({ username });
    if (existing){
       res.status(409).json({ error: 'Username already exists' });
       return;
    }
    
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        name,
        email,
        username,
        passwordHash,
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (err) {
     next(err)
     console.error('Error creating user:', err);
}

};



export const login = async (req: Request, res: Response,next: NextFunction) => {
  try{
  const { username, password } = req.body
  if (!username || !password){
       res.status(400).json({ error: 'Username and password are required' });
       return;
  }
  console.log('Login attempt:', { username, password });
  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    res.status(401).json({
      error: 'invalid username or password'
    })
    return;
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET || 'secret')

  res
    .status(200)
    .send({ token, username: user.username, email: user.email })
} catch (err) {
  next(err);
  console.error('Login error:', err);
}
};
