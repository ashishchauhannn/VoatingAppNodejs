
const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true

    },
    politicalParty: {
        type: String,
        unique: true,
        require: true


    },
    age: {
        type: Number,
        require: true

    },
    votes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                required: true
            },
            votedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    votecount: {
        type: Number,
        default: 0
    }


})

const CANDIDATE = mongoose.model('candidate', candidateSchema);
module.exports = CANDIDATE;