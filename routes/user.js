const { User } = require('../models/users');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// api to get stores associated with user
router.get(`/:uid/storelist`, async (req, res) => {

    const user = await User.findById(req.params.uid);
    if (!user) return res.status(400).send('Invalid Store');
    else
        return res.status(200).send(user.stores);
})

router.post('/register', async (req, res) => {
    const secret = process.env.secret;

    let user = new User({
        name: req.body.name,
        email: req.body.email,
        // 10 is salt or secret
        passwordHash: bcrypt.hashSync(req.body.password, secret),
        stores:req.body.stores
    })
    user = await user.save();

    if (!user)
        return res.status(400).send('the user cannot be created!')

    res.send(user);
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }) //find user based on email given
        const secret = process.env.secret;

        if (!user) 
        {
            return res.status(400).send('The user not found');
        }

        else if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) 
        {
            // if user and password both matches we will create token 
            const token = jwt.sign(
                {
                    //passing addional data with token
                    userId: user.name
                },
                secret,
                { expiresIn: '1d' }

            )

            res.status(200).send({ stores: user.stores, token: token })
        }
        else {
            res.status(400).send('password is wrong!');
        }
    }
    catch (err) {
        res.status(404).send({ error: err, mess: "not able to login" })
    }
})

module.exports = router;

