'use strict';

const authMiddleware = require('../middleware/auth.js');
const { users } = require('../models/index.js');

describe('Auth Middleware', () => {
  let req = {};
  let res = {};
  let next = jest.fn();

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer token123',
      },
    };
    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add user and token to request object if valid token is provided', async () => {
    const mockUser = {
      username: 'testuser',
      token: 'token123',
    };
    jest.spyOn(users, 'authenticateWithToken').mockResolvedValue(mockUser);

    await authMiddleware(req, res, next);

    expect(users.authenticateWithToken).toHaveBeenCalledWith('token123');
    expect(req.user).toEqual(mockUser);
    expect(req.token).toEqual('token123');
    expect(next).toHaveBeenCalledWith();
  });

  it('should return 403 error if no token is provided', async () => {
    req.headers.authorization = undefined;

    await authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith('Invalid Login');
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith('Invalid Login');
  });

  it('should return 403 error if invalid token is provided', async () => {
    jest
      .spyOn(users, 'authenticateWithToken')
      .mockRejectedValue(new Error('Invalid Token'));

    await authMiddleware(req, res, next);

    expect(users.authenticateWithToken).toHaveBeenCalledWith('token123');
    expect(next).toHaveBeenCalledWith('Invalid Login');
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith('Invalid Login');
  });
});
