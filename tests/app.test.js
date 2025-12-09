const request = require('supertest');
const app = require('../app');

describe('MEHAAL TECH AI Application', () => {
  it('serves the home page with static HTML', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('MEHAAL');
    expect(response.text).toContain('INTELLIGENCE BEYOND IMPOSSIBLE');
  });

  it('serves the users API endpoint', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(Array.isArray(response.body.users)).toBe(true);
    expect(response.body.users.length).toBeGreaterThan(0);
    expect(response.body.users[0]).toEqual(
      expect.objectContaining({ 
        name: expect.any(String), 
        role: expect.any(String) 
      })
    );
  });

  it('returns 404 for non-existent routes', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.status).toBe(404);
  });
});
