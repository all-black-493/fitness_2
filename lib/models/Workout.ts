import mongoose, { Schema, type Document } from "mongoose"

export interface IExercise {
  name: string
  sets: {
    reps?: number
    weight?: number
    time?: string
    distance?: number
  }[]
}

export interface IWorkout extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  name: string
  date: Date
  exercises: IExercise[]
  communityId?: mongoose.Types.ObjectId
  taggedFriendIds?: mongoose.Types.ObjectId[]
  tags?: string[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const ExerciseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  sets: [
    {
      reps: { type: Number },
      weight: { type: Number },
      time: { type: String },
      distance: { type: Number },
    },
  ],
})

const WorkoutSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    exercises: [ExerciseSchema],
    communityId: {
      type: Schema.Types.ObjectId,
      ref: "Community",
    },
    taggedFriendIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tags: [String],
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
WorkoutSchema.index({ userId: 1, date: -1 })
WorkoutSchema.index({ communityId: 1, date: -1 })

export default mongoose.models.Workout || mongoose.model<IWorkout>("Workout", WorkoutSchema)
