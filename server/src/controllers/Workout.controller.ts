import { Controller } from "../decorators/Controller";
import { Middleware } from "../decorators/Middleware";
import { Get, Post, Put } from "../decorators/RequestMethods";
import { IsUser } from "../middleware/IsUser";
import { IExercise, ISet } from "../models/Exercise";
import User from "../models/User";
import Workout, { IWorkout } from "../models/Workout";
import { BaseController } from "./Controller";
import { Request, Response } from "express";

@Controller("/api/workouts")
export default class WorkoutController extends BaseController {
  @Middleware([IsUser])
  @Post("/user/exercise")
  public async addUserExercise(req: Request, res: Response) {
    const user = await User.findById(res.locals.userId);
    if (!user) {
      return res.status(404).send({ errors: { general: "User not found" } });
    }

    user.exercises.push(req.body.exercise);
    await user.save();

    return res.send({ user });
  }

  @Middleware([IsUser])
  @Post("/")
  public async createWorkout(req: Request, res: Response) {
    let workout: IWorkout | null = null;
    if (!req.body._id) {
      workout = new Workout({
        ...req.body,
      });
      await workout.save();
    } else {
      workout = await Workout.findById(req.body._id);
      if (!workout) {
        return res
          .status(404)
          .send({ errors: { general: "Workout not found" } });
      }

      workout.exercises = req.body.exercises;
      await workout.save();
    }

    const user = await User.findById(res.locals.userId);
    if (!user) {
      return res.status(404).send({ errors: { general: "User not found" } });
    }

    function selectSetWithHighestWeightAndReps(exercise: IExercise) {
      let highestWeightSet: ISet | null = null;
      let highestReps = -Infinity;

      for (let set of exercise.sets) {
        if (set.weight) {
          if (
            set.reps > highestReps ||
            (set.reps === highestReps && set.weight > highestWeightSet?.weight!)
          ) {
            highestReps = set.reps;
            highestWeightSet = set;
          }
        }
      }

      return highestWeightSet;
    }

    function calculateOneRepMax(weight, reps) {
      const oneRepMax = weight * (1 + reps / 30);
      return Math.round(oneRepMax);
    }

    // check if new workout has new record
    for (let exercise of workout.exercises) {
      let recordExists = false;
      for (let record of user.records) {
        if (record.exercise === exercise.title) {
          recordExists = true;

          const topSet = selectSetWithHighestWeightAndReps(exercise);
          const oneRepMax = calculateOneRepMax(
            topSet?.weight || 0,
            topSet?.reps || 0
          );
          if (oneRepMax > record.oneRepMax) {
            record.weight = topSet?.weight || 0;
            record.reps = topSet?.reps || 0;
            record.oneRepMax = oneRepMax;
          }
        }
      }

      if (!recordExists) {
        const topSet = selectSetWithHighestWeightAndReps(exercise);
        user.records.push({
          date: workout.date,
          exercise: exercise.title,
          weight: topSet?.weight || 0,
          reps: topSet?.reps || 0,
          oneRepMax: calculateOneRepMax(topSet?.weight || 0, topSet?.reps || 0),
        });
      }
    }

    await user.save();

    return res.send({ workout });
  }

  @Middleware([IsUser])
  @Get("/date/:date")
  public async getWorkoutByDate(req: Request, res: Response) {
    const workout = await Workout.findOne({ date: req.params.date });

    return res.send({ workout });
  }
}
