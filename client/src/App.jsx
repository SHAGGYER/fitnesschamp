import React, { useEffect, useState } from "react";
import AppContext from "./AppContext";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";
import api from "./api";
import Records from "./pages/Records";

function App() {
  const [user, setUser] = useState(null);
  const [initiated, setInitiated] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data } = await api.get("/api/auth/init");
    setUser(data.user);
    setInitiated(true);
  };

  return (
    initiated && (
      <AppContext.Provider value={{ user, setUser }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route path="/login" element={<Auth mode="login" />} />

          <Route path="/records" element={<Records />} />
          <Route path="*">"404 Not Found"</Route>
        </Routes>
      </AppContext.Provider>
    )
  );
}

export default App;
