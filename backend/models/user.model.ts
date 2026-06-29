import mongoose, { Document, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    username: string;
    email: string;
    password: string;
    profileImg: string;
    coverImg: string;
    bio: string;
    link: string;
    likes: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    followers: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

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


const User: Model<IUser> = mongoose.model<IUser>('User', userSchema)

export default User