import request from 'supertest';
import { app } from '../server';

describe('HostelHub API Integration Tests', () => {
  it('GET /api/health should return 200 OK and operational status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
    expect(res.body.data.service).toBe('hostelhub-api');
  });

  it('POST /api/auth/login with valid demo credentials should succeed', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'student@hostelhub.demo',
      password: 'demo1234',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe('STUDENT');
  });

  it('POST /api/auth/login with invalid password should fail with 401', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'student@hostelhub.demo',
      password: 'wrong_password_123',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/complaints/classify without token should return 401 Unauthenticated', async () => {
    const res = await request(app).post('/api/complaints/classify').send({
      description: 'Tap is leaking in bathroom',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
