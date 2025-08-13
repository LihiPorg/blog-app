import request from 'supertest';
import { connectToDB, disconnectFromDB } from '../config/db';
import app from '../expressApp';

import User from '../models/userModel';
import Note from '../models/noteModel';

describe('CRUD /notes', () => {
  let token: string;
  let createdId: string;

  beforeAll(async () => {
    await connectToDB();

    await User.deleteMany({ username: 'testuser' });
    //await Note.deleteMany({});

    await request(app).post('/users').send({
      name: 'Test User',
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
    });

    const res = await request(app).post('/login').send({
      username: 'testuser',
      password: 'password123',
    });

    token = res.body.token;
  });

  afterAll(async () => {
    await disconnectFromDB?.();
  });

  it('CREATE → POST /notes', async () => {
    const res = await request(app)
      .post('/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Note', content: 'This is a test.' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    createdId = res.body._id;
  });

  it('READ → GET /notes', async () => {
    const res = await request(app).get('/notes');
    expect(res.statusCode).toBe(200);
    expect(res.body.some((n: any) => n._id === createdId)).toBe(true);
  });

  it('UPDATE → PUT /notes/:id', async () => {
    const res = await request(app)
      .put(`/notes/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated', content: 'Updated content.' });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated');
  });

  it('DELETE → DELETE /notes/:id', async () => {
    const res = await request(app)
      .delete(`/notes/${createdId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });
});
