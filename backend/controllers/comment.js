const xss = require('xss')
const jwt = require('jsonwebtoken');
const db = require("../models")
const Comment = db.comments

exports.getOneComment = (req, res, next) => {
  const id = req.params.id;

  //get one comment with his user
  Comment.findByPk(id, {
    include: [ "user"],
  })
  .then((comment) => {
    res.status(200).json(comment);
  })
  .catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.createComment = (req, res, next) => {

  //init info
	const commentObject = req.body;
  const comment = {
    content: xss(commentObject.text),
    userId: xss(commentObject.userid),
    postId : req.params.post_id
  }

  //create comment
  Comment.create(comment)
    .then(data => {
      res.status(201).json({ message: 'Commentaire créé !' })
    })
    .catch(error => res.status(500).json({ error }));
};

exports.modifyComment = (req, res, next) => {
  //init info
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const userId = decodedToken.userId
  const id = req.params.id;
  const commentObject = req.body;

  const comment = {
    content : xss(commentObject.text)
  }

  //find one comment
  Comment.findByPk(id, { include: "user" })
  .then((oldcomment) => {

    //if the creator =>
    if (userId === oldcomment.user.id) {

      //edit comment
      Comment.update(comment, { where: { id: id }})
        .then(data => {
          res.status(201).json({ message: 'Commentaire modifié !' })
        })
        .catch(error => res.status(500).json({ error }));

    //if not => error
    }else{
      res.status(401).json({
        error: new Error('Invalid request!')
      });
    }
  })
  .catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteComment = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const roleId = decodedToken.roleId
  const userId = decodedToken.userId
  const id = req.params.id;

  //find one comment
  Comment.findByPk(id, { include: "user" })
  .then((comment) => {

    //if admin or if the creator =>
    if (roleId === 2 || userId === comment.user.id) {

      //delete comment
      Comment.destroy({ where: { id : id }})
        .then(() => res.status(200).json({ message: 'Commentaire supprimé !'}))
        .catch(error => res.status(400).json({ error }));

    //if not => error
    }else{
      res.status(401).json({
        error: new Error('Invalid request!')
      });
    }
  })
  .catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};