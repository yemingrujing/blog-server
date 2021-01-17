'use strict';

const Controller = require('./base_controller');

class UploadController extends Controller {
  async images() {
    const {service, ctx,} = this,
      {storage, imageTitle, path,} = ctx.request.body,
      file = ctx.request.files[0],
      type = file.mime.split('/')[1],
      title = (path || '/blog/common/') + new Date().getTime() + '.' + type,
      createTime = await ctx.helper.getNowTime(),
      imageStorage = await service.settings.systemConfig.imageStorage(), // 获取图床
      res = await service[imageStorage].upload(type, file, title, createTime);
    if (res) {
      const imageUrl = 'image-base-url' + title;
      if (!storage) {
        await service.settings.images.add(
          {
            'imageDir': path || '/blog/common/',
            imageTitle,
            imageUrl,
            createTime,
          });
      }
      this.success(imageUrl, '上传');
    } else {
      this.error('上传失败');
    }
  }
}

module.exports = UploadController;
