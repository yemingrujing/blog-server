'use strict';

const { app, assert, } = require('egg-mock/bootstrap');

describe('test/app/controller/admin/user.test.js', () => {
  it('UserController', () => {
    let param = {'username': 'yemingrujing', 'password': 'As1234567', 'captcha': '1234',};
    app.httpRequest()
      .post('/api/user/search')
      .type('json')
      .send(param)
      .expect('200')
      .expect(user);
    assert(result.status === 200);
  });
});
