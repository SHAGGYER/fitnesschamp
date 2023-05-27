import mongoose, { Document } from "mongoose";
import { IExercise } from "./Exercise";

export interface ISet {
  reps: number;
  weight: number;
}

export interface IWorkout extends Document {
  date: Date;
  exercises: IExercise[];
}

const WorkoutSchema = new mongoose.Schema<IWorkout>(
  {
    date: Date,
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
