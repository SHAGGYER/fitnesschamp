import mongoose, { Document } from "mongoose";
import { IExercise } from "./Exercise";
import { IWalkingSession } from "./WalkingSession";

export interface ISet {
  reps: number;
  weight: number;
}

export interface IWorkout extends Document {
  date: Date;
  exercises: IExercise[];
  walkingSessions: IWalkingSession[];
  userId: string;
}

const WorkoutSchema = new mongoose.Schema<IWorkout>(
  {
    userId: mongoose.Schema.Types.ObjectId,
    date: Date,
    walkingSessions: [
      {
        workoutId: mongoose.Schema.Types.ObjectId,
        minutes: Number,
      },
    ],
    exercises: [
      {
        title: String,
        workoutId: mongoose.Schema.Types.ObjectId,
        sets: [
          {
            reps: Number,
            weight: Number,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Workout = mongoose.model<IWorkout>("Workout", WorkoutSchema, "workouts");
export default Workout;
