const express = require('express')
const router = express.Router()
const CANDIDATE = require('../models/candidate') //import model 
const USER = require('../models/user') //import model 
const { jwtMiddelWare, generateToken } = require('../jwt')


const checkRole = async (userID) => {
    try {
        const user = await USER.findById(userID);
        if (user.role === 'EC') {
            return true;
        }

    }
    catch (err) {
        return false;
    }
}

// post method for person


router.post('/', jwtMiddelWare, async (req, res) => {
    try {

        if (! await checkRole(req.user.id))
            return res.status(403).json({ message: 'Restricted' })

        const data = req.body //contains the data
        const newcandidate = new CANDIDATE(data); //from model

        //save the new person to database
        const response = await newcandidate.save();
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
// 

router.put('/:candidateID', jwtMiddelWare, async (req, res) => {

    try {
        if (!checkRole(req.user.id))
            return res.status(404).json({ message: 'invalid user' })

        const candidateID = req.params.candidateID;
        const updatecandidatedata = req.body;
        const response = await USER.findByIdAndUpdate(candidateID, updatecandidatedata, {

            new: true,
            runValidators: true,
        })
        if (!response) {
            res.status(403).json({ error: "invalid" });
        }
        console.log('updated');
        res.status(200).json({ message: "password updated" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "error" });
    }
})


router.delete('/:candidateID', jwtMiddelWare, async (req, res) => {

    try {
        if (!checkRole(req.user.id))
            return res.status(404).json({ message: 'invalid user' })

        const candidateID = req.params.candidateID;

        const response = await USER.findByIdAndDelete(candidateID)


        if (!response) {
            res.status(403).json({ error: "not found" });
        }
        console.log('deleted');
        res.status(200).json({ message: "candidate updated" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "error" });
    }
})

// voating

router.post('/vote/:canditateID', jwtMiddelWare, async (req, res) => {
    candidateID = req.params.canditateID;
    userId = req.user.id;
    try {
        const candidate = await CANDIDATE.findById(candidateID)
        if (!candidate) {
            return res.status(404).json({ message: "candidate not found" });
        }
        const user = await USER.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        if (user.isvoted) {
            return res.status(404).json({ message: "Already voted" });
        }

        if (user.role === "EC") {
            return res.status(404).json({ message: "NOT allowed" });
        }

        candidate.votes.push({ user: userId })
        candidate.votecount++;
        await candidate.save()
        //
        user.isvoted = true
        await user.save();
        res.status(200).json({ message: 'vote recorded successfuly' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }

})
//vote count
router.get('/vote/count', async (req, res) => {
    try {
        const candidate = await CANDIDATE.find().sort({ votecount: 'desc' });

        const voteRecord = candidate.map((data) => {

            return {
                politicalParty: data.politicalParty,
                count: data.votecount
            }
        })

        return res.status(200).json(voteRecord);

    } catch (error) {

        console.log(error);
        res.status(500).json({ error: " Internal server error" });

    }
});

// export router in server
module.exports = router;