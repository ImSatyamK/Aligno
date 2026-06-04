import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    username : {
        type: String,
        required: true,
        unique: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true,
        minLength: 6
    },
    profileImg : {
        type: String,
        default: ''
    },
    coverImg : {
        type: String,
        default: ''
    },
    bio : {
        type: String,
        default: ''
    },
    link : {
        type: String,
        default: ''
    },
    likes : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    following : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    followers : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }]
},
    {timestamps: true})


const User = mongoose.model('User', userSchema)

export default User