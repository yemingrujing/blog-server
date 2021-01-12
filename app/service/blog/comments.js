'use strict';

const Service = require('egg').Service;

class CommentsService extends Service {

  async search(articleTitle = null, limit = 10, page = 1) {
    const {ctx,} = this,
      {QueryTypes,} = require('sequelize'),
      list = await ctx.model.query('SELECT\n' +
        '\tc.articleId AS articleId,\n' +
        '\ta.articleTitle AS articleTitle,\n' +
        '\tc.commentContent AS commentContent,\n' +
        '\tc.nickName AS nickName,\n' +
        '\tc.email AS email,\n' +
        '\tc.author AS author,\n' +
        '\tc.parentId AS parentId,\n' +
        '\tc.parentNickName AS parentNickName,\n' +
        '\tc.STATUS AS status,\n' +
        '\tc.commentDate AS commentDate,\n' +
        '\tc.browserName AS browserName,\n' +
        '\tc.systemName AS systemName \n' +
        'FROM\n' +
        '\tcomments c\n' +
        '\tINNER JOIN articles a ON c.articleId = a.id \n' +
        (!articleTitle ? '\t' : ('WHERE a.articleTitle like \'%' + articleTitle + '%\'\n')) +
        '\tLIMIT $page,\n' +
        '\t$limit', {'bind': {'page': (page * limit) - limit, 'limit': limit,}, 'type': QueryTypes.SELECT,}),
      total = await ctx.model.query('SELECT\n' +
        '\tcount( c.id ) AS count \n' +
        'FROM\n' +
        '\tcomments c\n' +
        '\tINNER JOIN articles a ON c.articleId = a.id \n' +
        (!articleTitle ? '\t' : ('WHERE a.articleTitle like \'%' + articleTitle + '%\'\n')), {'type': QueryTypes.SELECT,});
    return {
      'total': total[0].count,
      'list': list,
    };
  }

  async add(req) {
    const {ctx,} = this,
      commentDate = await ctx.helper.getNowTime(),
      {author, articleId, email, nickName, commentContent, parentId, systemName, browserName,} = req;
    if (!commentContent) {
      ctx.throw(500, [999, '评论内容不能为空',]);
    }
    let parentNickName;
    if (parentId && parentId > 0) {
      const pComments = await ctx.model.Comments.findByPk({'id': parentId,});
      if (pComments) {
        parentNickName = pComments.parentNickName;
      }
    }
    const comments = await ctx.model.Comments.create({
      author,
      articleId,
      email,
      nickName,
      commentContent,
      parentId,
      parentNickName,
      systemName,
      browserName,
      commentDate,
    });
    if (!comments) {
      ctx.throw(500, [999, '评论保存失败',]);
    }
    return comments.id;
  }
}

module.exports = CommentsService;
