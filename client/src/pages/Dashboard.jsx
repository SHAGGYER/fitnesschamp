import React, { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import { Navigate } from "react-router-dom";
import moment from "moment";
import api from "../api";
import WorkoutForm from "../components/WorkoutForm";
import Page from "../components/Page";

export default function Dashboard() {
  const { user } = useContext(AppContext);
  const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DD"));
  const [workout, setWorkout] = useState(null);

  useEffect(() => {
    getWorkout();
  }, [currentDate]);

  const getWorkout = async () => {
    const { data } = await api.get("/api/workouts/date/" + currentDate);
    setWorkout(data.workout);
  };

  const changeDate = (direction) => {
    if (direction === -1) {
      setCurrentDate(
        moment(currentDate).subtract(1, "day").format("YYYY-MM-DD")
      );
    }
    if (direction === 1) {
      setCurrentDate(moment(currentDate).add(1, "day").format("YYYY-MM-DD"));
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Page>
      <div className="flex gap-4 items-center justify-center mb-4">
        <i
          className="fa-solid fa-chevron-left fa-2x cursor-pointer"
          onClick={() => changeDate(-1)}
        ></i>
        {currentDate}
        <i
          className="fa-solid fa-chevron-right fa-2x cursor-pointer"
          onClick={() => changeDate(1)}
        ></i>
      </div>
      <WorkoutForm existingWorkout={workout} currentDate={currentDate} />
    </Page>
  );
}
