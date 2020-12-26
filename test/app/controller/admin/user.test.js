'use strict';

const { app, assert, } = require('egg-mock/bootstrap');

describe('test/app/controller/admin/user.test.js', () => {
  it('UserController', () => {
    let param = {'userName': 'ye', 'limit': 10, 'page': 1,};
    app.httpRequest()
      .post('/users/search')
      .type('json')
      .send(param)
      .expect('200')
      .expect(user);
    assert(result.status === 200);
  });
});