import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const context = createContext();
const BASE_URL = "http://localhost:8001";

const defaultState = { cities: [], isLoading: true, currentCity: {} };

function reducer(state, action) {
  switch (action.type) {
    case "setCities":
      return { ...state, cities: action.payload };
    case "setLoadingTrue":
      return { ...state, isLoading: true };
    case "setLoadingFalse":
      return { ...state, isLoading: false };
    case "setCurrentCity":
      return { ...state, currentCity: action.payload };
    default:
      throw new Error("Unknown case");
  }
}

function ContextProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [currentCity, setCurrentCity] = useState({});
  const [{ isLoading, currentCity, cities }, dispatch] = useReducer(
    reducer,
    defaultState
  );
  useEffect(function () {
    async function fetchCities() {
      try {
        dispatch({ type: "setLoadingTrue" });
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "setCities", payload: data });
      } catch {
        alert("There was an error");
      } finally {
        dispatch({ type: "setLoadingFalse" });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;
      try {
        dispatch({ type: "setLoadingTrue" });
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "setCurrentCity", payload: data });
      } catch {
        alert("There was an error");
      } finally {
        dispatch({ type: "setLoadingFalse" });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    try {
      dispatch({ type: "setLoadingTrue" });
      const res = await fetch(`${BASE_URL}/cities/`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Coontent-Type": "appication/json" },
      });
      const data = await res.json();
      dispatch({ type: "setCities", payload: [...cities, data] });
      // setCities((cities) => [...cities, data]);
      console.log(data);
    } catch {
      alert("There was an error creating the city");
    } finally {
      dispatch({ type: "setLoadingFalse" });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "setLoadingTrue" });
      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Cannot delete");
      const data = await res.json();
      // setCities((cities) => cities.filter((city) => city.id !== id));
      dispatch({
        type: "setCities",
        payload: cities.filter((city) => city.id !== id),
      });
      console.log(data);
    } catch (err) {
      alert(err);
    } finally {
      dispatch({ type: "setLoadingFalse" });
    }
  }

  return (
    <context.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        deleteCity,
        getCity,
        createCity,
      }}
    >
      {children}
    </context.Provider>
  );
}

function useC() {
  const a = useContext(context);
  if (a === undefined) throw new Error("Context not in scope");
  return a;
}

export { ContextProvider, useC };
