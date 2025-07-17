const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const User = require('../models/User');
const authRoutes = require('../routes/auth');

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const req = { body: { email: 'test@example.com', password: 'password123' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    sinon.stub(User, 'findOne').resolves(null);
    sinon.stub(User.prototype, 'save').resolves();
    await authRoutes.post('/register')(req, res);
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith({ message: 'User registered successfully' })).to.be.true;
    User.findOne.restore();
    User.prototype.save.restore();
  });
});