const supertest = require('supertest');
const { server } = require('../src/server');
const { describe } = require('yargs');
const { test } = require('node:test');
const mockRequest = supertest(server);

describe('basic auth', () => {
  test('should return an error for invalid user', async () => {
    // Mock Users.findOne to return null (user not found)
    const { Users } = require('../src/auth/models');
    Users.findOne.mockResolvedValue(null);

    // Set up the request with invalid credentials
    const invalidCredentials = 'Basic invalidcredentials';
    const response = await mockRequest
      .get('/some-protected-route')
      .set('Authorization', invalidCredentials);

    // Expect that the middleware responds with a 403 status code and 'Invalid Login' message
    expect(response.status).toBe(403);
    expect(response.text).toBe('Invalid Login');
  });
});
