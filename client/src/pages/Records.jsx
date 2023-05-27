import React, { useContext } from "react";
import AppContext from "../AppContext";
import Page from "../components/Page";
import moment from "moment";

export default function Records() {
  const { user } = useContext(AppContext);
  return (
    <Page>
      <h1 className="text-2xl mb-4">Records</h1>

      {user.records.map((record) => (
        <div className="border rounded p-4 mb-4">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="font-semibold">{record.exercise}</span>
              <span className="text-sm">
                {moment(record.date).format("DD-MM-YYYY")}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">{record.weight} kg</span>
              <span className="text-sm">{record.reps} reps</span>
              <span className="text-lg">
                One Rep Max: {record.oneRepMax} kg
              </span>
            </div>
          </div>
        </div>
      ))}
    </Page>
  );
}
