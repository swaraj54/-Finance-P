const { expect } = require('chai');
const sinon = require('sinon');
const supertest = require('supertest');
const app = require('../../../index'); 
const User = require('../../../modal/user.modal');

describe('CreateUser Controller', () => {
    beforeEach(() => {
        sinon.restore();
    });

    it('should create a new user', async () => {
        const UserMock = sinon.mock(User);

        UserMock.expects('findOne').once().withArgs({ _id: 'validAdminId', type: 'admin' }).resolves({});

        const requestBody = {
            username: 'testuser',
            email: 'test@example.com',
            type: 'user',
            adminId: 'validAdminId',
        };

        const response = await supertest(app)
            .post('/createUser') 
            .send(requestBody);

        expect(response.status).to.equal(201);
        expect(response.body.success).to.equal(true);
        expect(response.body.newUser).to.be.an('object');
        expect(UserMock.verify()).to.be.true;
    });

    it('should handle errors', async () => {
        const UserMock = sinon.mock(User);

        UserMock.expects('findOne').once().withArgs({ _id: '6571b55da26a494b30c631e2', type: 'admin' }).resolves(null);

        const requestBody = {
            username: 'testuser',
            email: 'test@example.com',
            type: 'regular',
            adminId: '6571b55da26a494b30c631e2',
        };

        const response = await supertest(app)
            .post('/createUser') 
            .send(requestBody);

        console.log(response.body);

        expect(response.status).to.equal(401);
        expect(response.body.success).to.equal(false); 
        expect(response.body.error).to.equal('Admin is wrong.');
        expect(UserMock.verify()).to.be.true;
    });

});
