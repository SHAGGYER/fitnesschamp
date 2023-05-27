import { createContext } from "react";

const AppContext = createContext({
  user: null,
  setUser: () => null,
  logout: () => null,
  meals: [],
  setMeals: () => null,
  installed: false,
});

export default AppContext;
