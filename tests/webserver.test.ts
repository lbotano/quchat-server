import request from 'supertest';
import { app, server } from '../src/index';

describe('Web server', () => {
  test('GET /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  afterAll(() => {
    server.close();
  });
});
