import mongoose, { Schema, Model, Document } from "mongoose"

interface IComment {
    _id: mongoose.Types.ObjectId,
    text: string,
    user: mongoose.Types.ObjectId
}

export interface IPost extends Document{
    user: mongoose.Types.ObjectId,
    text: string,
    img: string,
    likes: mongoose.Types.ObjectId[],
    comments: IComment[],
    visibility?: "PUBLIC" | "PRIVATE",
    userVisibility?: "PUBLIC" | "PRIVATE",
    tags: string[],
    createdAt: Date,
    updatedAt: Date
}

const postSchema = new Schema<IPost>({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
    },
    img: {
        type: String
    },
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [{
        text: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        }
    }],
    visibility: {
        type: String,
        enum: ["PUBLIC", "PRIVATE"],
        default: "PUBLIC"
    },
    userVisibility: {
        type: String,
        enum: ["PUBLIC", "PRIVATE"],
        default: "PUBLIC"
    },
    tags: [{
        type: String
    }]
}, { timestamps: true})

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', postSchema)

export default Post