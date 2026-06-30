import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../src/app';
import Url from '../src/models/Url';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 30000);

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await Url.deleteMany({});
});

describe('POST /api/shorten', () => {
  it('should create a short URL and return 201', async () => {
    const res = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://www.example.com' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('shortCode');
    expect(res.body.shortCode).toHaveLength(7);
    expect(res.body.url).toBe('https://www.example.com');
    expect(res.body.accessCount).toBe(0);
    expect(res.body).toHaveProperty('createdAt');
    expect(res.body).toHaveProperty('updatedAt');
  });

  it('should return 400 for invalid URL', async () => {
    const res = await request(app)
      .post('/api/shorten')
      .send({ url: 'not-a-valid-url' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Validation failed');
    expect(res.body).toHaveProperty('details');
  });

  it('should return 400 for missing URL', async () => {
    const res = await request(app)
      .post('/api/shorten')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Validation failed');
  });
});

describe('GET /api/shorten/:shortCode', () => {
  it('should return URL details for a valid short code', async () => {
    // Create a URL first
    const createRes = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://www.example.com' });

    const { shortCode } = createRes.body;

    const res = await request(app).get(`/api/shorten/${shortCode}`);

    expect(res.status).toBe(200);
    expect(res.body.shortCode).toBe(shortCode);
    expect(res.body.url).toBe('https://www.example.com');
  });

  it('should return 404 for non-existent short code', async () => {
    const res = await request(app).get('/api/shorten/nope123');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('PUT /api/shorten/:shortCode', () => {
  it('should update the destination URL', async () => {
    const createRes = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://www.example.com' });

    const { shortCode } = createRes.body;

    const res = await request(app)
      .put(`/api/shorten/${shortCode}`)
      .send({ url: 'https://www.updated-example.com' });

    expect(res.status).toBe(200);
    expect(res.body.url).toBe('https://www.updated-example.com');
    expect(res.body.shortCode).toBe(shortCode);
  });

  it('should return 400 for invalid URL on update', async () => {
    const createRes = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://www.example.com' });

    const { shortCode } = createRes.body;

    const res = await request(app)
      .put(`/api/shorten/${shortCode}`)
      .send({ url: 'invalid-url' });

    expect(res.status).toBe(400);
  });

  it('should return 404 for non-existent short code', async () => {
    const res = await request(app)
      .put('/api/shorten/nope123')
      .send({ url: 'https://www.example.com' });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/shorten/:shortCode', () => {
  it('should delete a short URL and return 204', async () => {
    const createRes = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://www.example.com' });

    const { shortCode } = createRes.body;

    const res = await request(app).delete(`/api/shorten/${shortCode}`);
    expect(res.status).toBe(204);

    // Verify it's gone
    const getRes = await request(app).get(`/api/shorten/${shortCode}`);
    expect(getRes.status).toBe(404);
  });

  it('should return 404 for non-existent short code', async () => {
    const res = await request(app).delete('/api/shorten/nope123');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/shorten/:shortCode/stats', () => {
  it('should return stats for a valid short code', async () => {
    const createRes = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://www.example.com' });

    const { shortCode } = createRes.body;

    const res = await request(app).get(`/api/shorten/${shortCode}/stats`);

    expect(res.status).toBe(200);
    expect(res.body.shortCode).toBe(shortCode);
    expect(res.body.url).toBe('https://www.example.com');
    expect(res.body.accessCount).toBe(0);
    expect(res.body).toHaveProperty('clicks');
    expect(Array.isArray(res.body.clicks)).toBe(true);
  });

  it('should return 404 for non-existent short code', async () => {
    const res = await request(app).get('/api/shorten/nope123/stats');
    expect(res.status).toBe(404);
  });
});
