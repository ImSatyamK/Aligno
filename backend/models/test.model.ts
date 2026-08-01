import mongoose, { Schema, Model, Document } from "mongoose"

interface ITest extends Document {
    createdBy: mongoose.Types.ObjectId,
    title: string,
    description?: string,
    duration: number,
    questions: {
        question: string,
        options: string[],
        correctOption: number
    }[],
    questionCount: number,
    correctMarks: number,
    negativeMarks: number

    createdAt: Date,
    updatedAt: Date
}

const testSchema = new Schema<ITest>({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    questions: {
        type:[{
            _id: false,
            question: {
                type: String,
                required: true
            },
            options: {
                type: [String],
                required: true
            },
            correctOption: {
                type: Number,
                required: true
            }
        }],
        required: true,
    },
    questionCount: {
        type: Number,
        required: true,
        min: 1
    },
    correctMarks: {
        type: Number,
        default: 1,
    },
    negativeMarks: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true
})

testSchema.index({
    title: 1,
    createdBy: 1
}, { unique: true }
)

const Test: Model<ITest> = mongoose.models.Test || mongoose.model<ITest>('Test', testSchema)

export default Test