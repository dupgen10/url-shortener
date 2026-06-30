import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../src/app';
import Url from '../src/models/Url';
import Click from '../src/models/Click';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await Url.deleteMany({});
  await Click.deleteMany({});
});

describe('GET /:shortCode (redirect)', () => {
  it('should redirect to the original URL with 302', async () => {
    // Create a short URL first
    const createRes = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://www.example.com' });

    const { shortCode } = createRes.body;

    const res = await request(app).get(`/${shortCode}`);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('https://www.example.com');
  });

  it('should increment access count on redirect', async () => {
    const createRes = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://www.example.com' });

    const { shortCode } = createRes.body;

    // Redirect once
    await request(app).get(`/${shortCode}`);

    // Check the access count
    const detailRes = await request(app).get(`/api/shorten/${shortCode}`);
    expect(detailRes.body.accessCount).toBe(1);
  });

  it('should return 404 for non-existent short code', async () => {
    const res = await request(app).get('/nope123');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should record click analytics on redirect', async () => {
    const createRes = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://www.example.com' });

    const { shortCode } = createRes.body;

    await request(app)
      .get(`/${shortCode}`)
      .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');

    // Give the fire-and-forget analytics a moment to complete
    await new Promise((resolve) => setTimeout(resolve, 200));

    const clicks = await Click.find({ shortCode });
    expect(clicks.length).toBe(1);
    expect(clicks[0].shortCode).toBe(shortCode);
    expect(clicks[0]).toHaveProperty('browser');
    expect(clicks[0]).toHaveProperty('device');
  });
});
