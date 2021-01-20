'use strict';

const Controller = require('./base_controller');

class HomeController extends Controller {
  async index() {
    const {ctx,} = this,
      result = await ctx.helper.getNowTime();
    this.success(result, '查询');
  }
}

module.exports = HomeController;
