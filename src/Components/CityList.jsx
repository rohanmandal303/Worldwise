import styles from "./CityList.module.css";
import CityItem from "./CityItem.jsx";
import Spinner from "./Spinner.jsx";
import Message from "./Message.jsx";
import { useC } from "../contexts/ContextProvider";

function CityList() {
  const { cities, isLoading } = useC();
  if (!isLoading && !cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <ul className={styles.cityList}>
      {cities.map((c) => (
        <CityItem key={c.id} city={c} />
      ))}
    </ul>
  );
}

export default CityList;
