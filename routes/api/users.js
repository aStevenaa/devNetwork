const express = require('express');

const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'please inculde vail email').isEmail(),
    check(
      'password',
      'please inturn a password of 7 or more charchters'
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({
        email,
      });
      if (user) {
        return res.status(400).json({
          erros: [
            {
              msg: 'user already exists',
            },
          ],
        });
      }

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'x',
        d: 'mm',
      });
      user = new User({
        name,
        email,
        avatar,
        password,
      });
      //
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get('jwtSecert'),
        {
          expiresIn: 3600000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
    console.log(req.body);
  }
);

module.exports = router;