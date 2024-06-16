
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true

    },

    age: {
        type: Number,
        require: true

    },
    aadharcard: {
        type: Number,
        require: true,
        unique: true
    },

    adress: {
        type: String,
        require: true

    },

    mobile: {
        type: Number,
        unique: true,



        email: {
            type: String,
        },



    },

    password: {
        type: String

    },

    role: {
        type: String,
        enum: ['EC', 'voter'],
        default: 'voter',



    },

    isvoted: {
        type: Boolean,
        default: false
    }

})
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password'))
        return next();
    try {
        //hash pass generate
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user.password, salt);
        // override pass to hash
        user.password = hashPassword;
        next();
    } catch (err) {
        return next(err);
    }
})
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        // use bcrpt to  compare the hash function
        const isMatch = await bcrypt.compare(candidatePassword, this.password)
        return isMatch;
    } catch (error) {
        throw error;
    }
}



const USER = mongoose.model('user', userSchema);
module.exports = USER;