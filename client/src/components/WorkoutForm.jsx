import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import Button from "./Button";
import Autocomplete from "./Autocomplete";
import exerciseList from "../exerciseList.json";
import AppContext from "../AppContext";
import api from "../api";
import cogoToast from "cogo-toast";

export default function WorkoutForm({ currentDate, existingWorkout }) {
  const { user, setUser } = useContext(AppContext);
  const exerciseItems = exerciseList.concat(user.exercises || []);
  const [workout, setWorkout] = useState(
    existingWorkout || {
      date: currentDate,
    }
  );

  useEffect(() => {
    if (existingWorkout) {
      setWorkout(existingWorkout);
      setExercises(existingWorkout.exercises);
    } else {
      setWorkout({
        date: currentDate,
      });
      setExercises([]);
    }
  }, [existingWorkout]);

  const [exercises, setExercises] = useState(existingWorkout?.exercises || []);

  const addExercise = () => {
    setExercises((prev) => [
      ...prev,
      {
        title: "",
        isOpen: true,
        sets: [
          {
            reps: "",
            weight: "",
          },
        ],
      },
    ]);
  };

  const saveWorkout = async () => {
    const newWorkout = {
      ...workout,
      exercises,
    };

    const { data } = await api.post("/api/workouts", newWorkout);
    cogoToast.success("Workout saved successfully");
    setWorkout(data.workout);
  };

  return (
    <div>
      {exercises.length > 0 && (
        <div className="flex flex-col gap-4 mb-4">
          {exercises.map((exercise, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 border border-gray-300 p-2"
            >
              {!exercise.title ? (
                <Autocomplete
                  items={exerciseItems}
                  label="Search for exercises..."
                  onSelect={(item) => {
                    setExercises((prev) => {
                      const newExercises = [...prev];
                      newExercises[index].title = item;
                      return newExercises;
                    });
                  }}
                />
              ) : (
                <div className="flex items-center">
                  <h2
                    className="text-2xl flex-grow"
                    onClick={() => {
                      setExercises((prev) => {
                        const newExercises = [...prev];
                        newExercises[index].isOpen =
                          !newExercises[index].isOpen;
                        return newExercises;
                      });
                    }}
                  >
                    {exercise.title}
                  </h2>
                  <i
                    className="fa-solid fa-trash cursor-pointer text-2xl"
                    onClick={() => {
                      setExercises((prev) => {
                        const newExercises = [...prev];
                        newExercises.splice(index, 1);
                        return newExercises;
                      });
                    }}
                  ></i>
                </div>
              )}

              {exercise.isOpen && (
                <div className="flex flex-col gap-2">
                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="flex gap-2 items-center">
                      <span>Weight</span>
                      <input
                        type="number"
                        placeholder="Weight"
                        className="border border-gray-300 p-2 w-full"
                        value={set.weight}
                        onChange={(e) => {
                          setExercises((prev) => {
                            const newExercises = [...prev];
                            newExercises[index].sets[setIndex].weight =
                              e.target.value;
                            return newExercises;
                          });
                        }}
                      />
                      <span>Reps</span>
                      <input
                        type="number"
                        placeholder="Reps"
                        className="border border-gray-300 p-2 w-full"
                        value={set.reps}
                        onChange={(e) => {
                          setExercises((prev) => {
                            const newExercises = [...prev];
                            newExercises[index].sets[setIndex].reps =
                              e.target.value;
                            return newExercises;
                          });
                        }}
                      />
                      {setIndex > 0 && (
                        <i
                          className="fa-solid fa-trash cursor-pointer text-2xl"
                          onClick={() => {
                            setExercises((prev) => {
                              const newExercises = [...prev];
                              newExercises[index].sets.splice(setIndex, 1);
                              return newExercises;
                            });
                          }}
                        ></i>
                      )}
                      <i
                        className="fa-solid fa-plus cursor-pointer text-2xl"
                        onClick={() => {
                          setExercises((prev) => {
                            const newExercises = [...prev];
                            newExercises[index].sets.push({
                              reps: "",
                              weight: "",
                            });
                            return newExercises;
                          });
                        }}
                      ></i>
                    </div>
                  ))}
                  <Button
                    variant="success"
                    onClick={async () => {
                      setExercises((prev) => {
                        const newExercises = [...prev];
                        newExercises[index].isOpen = false;
                        return newExercises;
                      });

                      if (!exerciseItems.includes(exercise.title)) {
                        const { data } = await api.post(
                          "/api/workouts/user/exercise",
                          {
                            exercise: exercise.title,
                          }
                        );
                        setUser(data.user);
                      }
                    }}
                  >
                    Finish Exercise
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Button variant="primary" onClick={addExercise}>
          Add Exercise
        </Button>
        <Button variant="success" onClick={saveWorkout}>
          Save Workout
        </Button>
      </div>
    </div>
  );
}
