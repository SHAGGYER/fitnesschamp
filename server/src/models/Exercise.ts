import mongoose, { Document } from "mongoose";

export interface ISet {
  reps: number;
  weight?: number;
}

export interface IExercise extends Document {
  workoutId: string;
  sets: ISet[];
  title: string;
}

const ExerciseSchema = new mongoose.Schema<IExercise>(
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
  { timestamps: true }
);

const Exercise = mongoose.model<IExercise>(
  "Exercise",
  ExerciseSchema,
  "exercises"
);
export default Exercise;
