import { useEffect, useState } from "react";
import "./App.css";
import HttpClient from "./services/HttpClient";
import Navbar from "./components/Navbar";
import AppContext from "./AppContext";
import { Switch, Route, Redirect } from "react-router-dom";
import Journal from "./pages/Journal";
import InstallationWizard from "./components/InstallationWizard";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [meals, setMeals] = useState([]);
  const [initiated, setInitiated] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isDenmark, setIsDenmark] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data } = await HttpClient().get("/api/auth/init");

    setInstalled(data.installed);
    setIsDenmark(data.isDenmark);

    if (data.user) {
      setUser(data.user);
      setMeals(data.meals);
    }
    setInitiated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    initiated && (
      <AppContext.Provider
        value={{
          user,
          setUser,
          logout,
          setMeals,
          meals,
          installed,
        }}
      >
        {isDenmark ? (
          <>
            {installed && <Navbar />}
            {installed && (
              <Switch>
                <Route path="/journal">
                  {user ? <Journal /> : <Redirect to="/" />}
                </Route>
                <Route path="/" exact>
                  <Dashboard />
                </Route>
              </Switch>
            )}
            {!installed && <InstallationWizard />}
          </>
        ) : (
          <div>
            <h1>You must be located in Denmark in order to use this app.</h1>
          </div>
        )}
      </AppContext.Provider>
    )
  );
}

export default App;
