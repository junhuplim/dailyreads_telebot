const express = require('express');
const router = express.Router();
const db = require('../models/index');

router.get('/', (req,res) =>
    db.Users.findAll(
        {
            attributes: ['chatId']
        }
    )
        .then(users => {
            res.send(users);
        })
        .catch(err => console.log(err)));

module.exports = router;


