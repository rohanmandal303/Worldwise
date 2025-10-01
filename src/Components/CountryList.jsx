import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem.jsx";
import Spinner from "./Spinner";
import Message from "./Message";
import { useC } from "../contexts/ContextProvider";

function CountryList() {
  const { cities, isLoading } = useC();
  if (!isLoading && !cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );
  if (isLoading) {
    return <Spinner />;
  }
  const countries = cities.reduce((acc, cur) => {
    if (acc.map((a) => a.country).includes(cur.country)) {
      return acc;
    } else {
      return [...acc, { country: cur.country, emoji: cur.emoji }];
    }
  }, []);
  return (
    <ul className={styles.countryList}>
      {countries.map((c) => (
        <CountryItem country={c} key={c.country} />
      ))}
    </ul>
  );
}

export default CountryList;
