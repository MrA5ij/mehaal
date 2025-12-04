const request = require('supertest');
const app = require('../app');

describe('Express routes', () => {
  it('serves the home page', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('MEHAAL');
  });

  it('serves the users endpoint', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(Array.isArray(response.body.users)).toBe(true);
    expect(response.body.users.length).toBeGreaterThan(0);
    expect(response.body.users[0]).toEqual(
      expect.objectContaining({ name: expect.any(String), role: expect.any(String) })
    );
  });
});
