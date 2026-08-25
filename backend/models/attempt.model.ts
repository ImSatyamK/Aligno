import mongoose, { Schema, Model } from "mongoose";

interface IAttempt {
    user: mongoose.Types.ObjectId;
    test: mongoose.Types.ObjectId;
    answers: Map<string, number>;
    questions: {
        question: string,
        options: string[],
        correctOption: number
    }[],
    correctMarks: number;
    negativeMarks: number;
    currentQuestion: number;
    score: number;
    startedAt: Date;
    endsAt: Date;
    submittedAt?: Date;
    status: "IN_PROGRESS" | "SUBMITTED";

    createdAt: Date;
    updatedAt: Date;
}

const attemptSchema = new Schema<IAttempt>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        test: {
            type: Schema.Types.ObjectId,
            ref: "Test",
            required: true,
        },

        answers: {
            type: Map,
            of: Number,
            default: {},
        },

        questions: {
            type: [{
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

        correctMarks: {
            type: Number,
            required: true,
        },

        negativeMarks: {
            type: Number,
            required: true,
        },

        currentQuestion: {
            type: Number,
            default: 0,
        },

        score: {
            type: Number,
            default: 0,
        },

        startedAt: {
            type: Date,
            required: true,
        },

        endsAt: {
            type: Date,
            required: true,
        },

        submittedAt: {
            type: Date,
        },

        status: {
            type: String,
            enum: ["IN_PROGRESS", "SUBMITTED"],
            default: "IN_PROGRESS",
        },
    },
    {
        timestamps: true,
    }
);

attemptSchema.index({
    user: 1,
    test: 1,
});

const Attempt: Model<IAttempt> =
    mongoose.models.Attempt ||
    mongoose.model<IAttempt>("Attempt", attemptSchema);

export default Attempt;