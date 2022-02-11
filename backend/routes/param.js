const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const paramCtrl = require('../controllers/param');

router.get('/', auth, paramCtrl.getAllUsers);
router.get('/:id', auth, paramCtrl.getOneUserParam);
router.put('/user/:id', auth, multer, paramCtrl.modifyParam);
router.put('/password/:id', auth, paramCtrl.modifyPassword);
router.delete('/:id', auth, paramCtrl.deleteUser);

module.exports = router;