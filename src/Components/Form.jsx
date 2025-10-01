// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useC } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";

import styles from "./Form.module.css";
import Button from "./button";
import BackButton from "./BackButton";
import { useURLPosition } from "../hooks/useURLPosition";
import Message from "./Message";
import Spinner from "./Spinner";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [geocodeError, setGeocodeError] = useState("");
  const { data, isFormLoading } = useURLPosition();
  const { latitude: lat, longitude: lng } = data;

  const { createCity, isLoading } = useC();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      position: { lat, lng },
      notes,
    };
    await createCity(newCity);
    navigate("/app/cities");
  }

  useEffect(
    function () {
      try {
        setGeocodeError("");
        if (!data) throw new Error("Start by clicking somewhere on the map");
        if (!data.countryCode) throw new Error("Invalid location");
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName || "");
        if (data.countryCode) setEmoji(convertToEmoji(data.countryCode));
      } catch (err) {
        setGeocodeError(err.message);
      }
    },
    [data]
  );
  if (isFormLoading) return <Spinner />;
  if (geocodeError.length > 0) return <Message message={geocodeError} />;
  return (
    <form
      className={`${styles.form} ${isLoading && styles.loading}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName || ""}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName || ""}?</label>
        <DatePicker
          id="date"
          selected={date}
          dateFormat="dd/MM/yyyy"
          onChange={(date) => setDate(date)}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName || ""}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary" onClick={() => {}}>
          Add
        </Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
