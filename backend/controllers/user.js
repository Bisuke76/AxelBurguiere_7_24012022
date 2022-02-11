const bcrypt = require('bcrypt');
const passwordValidator = require('password-validator');
const jwt = require('jsonwebtoken');
const xss = require('xss');
const db = require("../models")
const User = db.users

const schemaPassValid = new passwordValidator();

schemaPassValid
.is().min(8)
.is().max(50)
.has().uppercase()
.has().lowercase()
.has().digits(2)
.has().not().spaces()
.is().not().oneOf(['Passw0rd', 'Password123']);

exports.signup = (req, res, next) => {
  //If password not valid
  if (!schemaPassValid.validate(req.body.password)) {
    return res.status(401).json({ error: 'Sécurité du mot de passe faible. Il doit contenir au moins 8 caractère, des majuscules et deux chiffres' })
  }

  //Init new user
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = {
        username: xss(req.body.username),
        email: xss(req.body.email),
        password: hash,
        sex: xss(req.body.sex),
        roleId : 1
      };

      //create user
      User.create(user)
        .then(data => {
          res.status(201).json({ message: 'Utilisateur créé !' })
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res) => {
  //init info
  let loginEmail = xss(req.body.email)
  let loginPassword = req.body.password

  //try to get pointed_user
  User.findAll({ where: { email: loginEmail } })
    .then(user => {

      //if no user
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }

      //compare passwords
      bcrypt.compare(loginPassword, user[0].password)
        .then(valid => {

          //if not the same
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }

          //answer with info
          res.status(200).json({
            userId: user[0].id,
            roleId: user[0].roleId,
            sex: user[0].sex,
            image:user[0].image,
            token: jwt.sign(
              { userId: user[0].id, roleId: user[0].roleId },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};