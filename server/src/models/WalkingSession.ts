import mongoose, { Document } from "mongoose";

export interface IWalkingSession extends Document {
  workoutId: string;
  minutes: number;
}

const WalkingSessionSchema = new mongoose.Schema<IWalkingSession>(
  {
    workoutId: mongoose.Schema.Types.ObjectId,
    minutes: Number,
  },
  { timestamps: true }
);

const WalkingSession = mongoose.model<IWalkingSession>(
  "WalkingSession",
  WalkingSessionSchema,
  "walking_sessions"
);
export default WalkingSession;
