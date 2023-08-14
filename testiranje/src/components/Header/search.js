import React, { useState, useEffect } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { GEODB_API_OPTIONS, GEODB_API_URL } from "../../api.js";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const Search = (props) => {
  const [search, setSearch] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const { userUID } = props;

  useEffect(() => {
    if (!userUID) return;

    const userRef = doc(db, "users", userUID);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      const userData = snapshot.data();
      if (userData && userData.searchHistory) {
        console.log(userData)
        setSearchHistory(userData.searchHistory);
      }
    });

    return () => unsubscribe();
  }, [userUID]);

  let addItemSearchHistory = async (value) => {
    if (
      searchHistory && (
      searchHistory[0]?.label === value.label ||
      searchHistory[1]?.label === value.label ||
      searchHistory[2]?.label === value.label ||
      searchHistory[3]?.label === value.label
      )
    ) {return;}
    const newItem = value;
    const userRef = doc(db, "users", userUID);

    await updateDoc(userRef, {
      searchHistory: [newItem, ...searchHistory],
    });
    console.log("New item added:", newItem.label);
  };

  const loadOptions = (inputValue) => {
    if (inputValue.length < 1)
      return ({ options: searchHistory.slice(0, 4)});
    else {
      return fetch(
        `${GEODB_API_URL}?namePrefix=${inputValue}`,
        GEODB_API_OPTIONS
      )
        .then((res) => res.json())
        .then((data) => {
          return {
            options: data.data.map((city) => ({
              label: `${city.city}, ${city.country}`,
              value: city.city,
              country: city.country,
              latitude: city.latitude,
              longitude: city.longitude,
            })),
          };
        })
        .catch((err) => console.log(err));
    }
  };

  const handleOnChange = (searchData) => {
    addItemSearchHistory(searchData);
    setSearch(searchData);
    props.retrieveData(searchData);
    setSearch("");
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      marginTop: "10px",
      width: "500px",
      height: "2rem",
      backgroundColor: "rgba(255, 255, 255, 0.4)",
      border: "none",
      borderRadius: "15px",
      textAlign: "left",
      fontSize: "20px",
      color: "white",
      cursor: "pointer",
    }),
    menu: (provided, state) => ({
      ...provided,
      backgroundColor: "rgba(255, 255, 255, 0.4)",
      color: "white",
      fontSize: "20px",
    }),
    listbox: (provided, state) => ({
      ...provided,
      color: "white",
    }),
    input: (provided, state) => ({
      ...provided,
      color: "white",
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: "white",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(255, 255, 255, 0.4)",
      color: "black",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "white",
    }),
    noOptionsMessage: (provided, state) => ({
      ...provided,
      color: "white",
    }),
    loadingMessage: (provided, state) => ({
      ...provided,
      color: "white",
    }),
  };

  return (
    <div>
      <AsyncPaginate
        styles={customStyles}
        className="search"
        placeholder="Search"
        debounceTimeout={1000}
        value={search}
        onChange={handleOnChange}
        loadOptions={loadOptions}
      />
    </div>
  );
};

export default Search;
