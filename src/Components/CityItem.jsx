import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useC } from "../contexts/ContextProvider";
export default function CityItem({ city }) {
  const { currentCity, deleteCity } = useC();
  const { cityName, date, emoji, id, position } = city;
  const d = new Date(date);
  function handleDelete(e) {
    e.preventDefault(); // prevents navigation
    e.stopPropagation();
    deleteCity(id);
  }
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          currentCity.id === id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>
          (
          {d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          )
        </time>
        <button className={styles.deleteBtn} onClick={handleDelete}>
          &times;
        </button>
      </Link>
    </li>
  );
}
