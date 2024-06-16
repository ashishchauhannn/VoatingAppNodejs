const express = require('express')
const router = express.Router()
const USER = require('./../models/user') //import model 
const { jwtMiddelWare, generateToken } = require('./../jwt')

// post method for person
router.post('/signup', async (req, res) => {
    try {
        const data = req.body //contains the data
        const newUSER = new USER(data); //from model


        //save the new person to database
        const response = await newUSER.save();
        console.log('Data has been saved');


        //payload function
        const payload = {
            id: response.id,

        }


        console.log(JSON.stringify(payload));
        //generate token
        const token = (generateToken(payload));
        // console.log("token is:", token)

        res.status(200).json({ response: response, token: token });
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal error!" });
    }

})
// login route

router.post('/login', async (req, res) => {
    try {
        //extrct user name and password
        const { aadharcard, password } = req.body;
        // find username by username
        const user = await user.findOne({ aadharcard: aadharcard });

        // if user cant find or exist
        if (!USER || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'invalid username or password' })
        }
        const payload = {
            id: user.id,

        }
        const token = generateToken(payload);

        res.json({ token })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: 'internal server error' })
    }
});
// profile route

router.get('/profile', jwtMiddelWare, async (req, res) => {
    try {
        const userData = req.user;
        // console.log("user data:", userData);

        const userId = userData.id;
        const user = await USER.findById(userId)
        res.status(200).json({ user });  // use to send req


    } catch (error) {

        console.error(error)
        res.status(500).json({ error: 'internal server error' })

    }
})







router.put('/profile/password', async (req, res) => {

    try {
        const userID = req.user;
        const { currentPassword, newPassword } = req.body
        const user = await USER.findbyId(userID)

        if (!(await user.comparePassword(currentPassword))) {

            return res.status(401).json({ error: "invalid credentials" });
        }

        user.password = newPassword;
        await user.save();
        console.log('password updated');
        res.status(200).json({ message: "password updated" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "error" });
    }
})







// export router in server
module.exports = router;