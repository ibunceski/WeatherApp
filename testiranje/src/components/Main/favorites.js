import React from "react";
import { useState, useEffect } from "react";
import FavoritesSearch from "./favorites-search.js";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { OPENWEATHER_API_KEY, OPENWEATHER_API_URL } from "../../api.js";
import { RiDeleteBack2Fill } from "react-icons/ri";
const Favorites = (props) => {
  const [favorites, setFavorites] = useState([]);
  const [data, setData] = useState({
    data0: null,
    data1: null,
    data2: null,
  });
  const { userUID } = props;

  // useEffect(() => {
  //     const unsubscribe = onSnapshot(favoriteCities, (snapshot) => {
  //         const newFavorites = snapshot.docs.map((doc) => ({
  //             id: doc.id,
  //             ...doc.data()
  //         }))
  //         setFavorites(newFavorites);
  //     })
  //     return () => unsubscribe();
  // }, []);

  // let addNewFavorite = async (city) => {
  //   if(favorites.length < 3) {
  //     const newFavorite = {
  //       label: city.label,
  //       city: city.value,
  //       country: city.country,
  //       latitude: city.latitude,
  //       longitude: city.longitude,
  //     };

  //     const favoritesCollection = collection(db, 'favoriteCities');

  //     const q = query(
  //       favoritesCollection,
  //       where('label', '==', newFavorite.label)
  //     );

  //     const existingDocs = await getDocs(q);

  //     if (existingDocs.docs.length === 0) {
  //       const newFavoriteRef = await addDoc(favoritesCollection, newFavorite);
  //       console.log('New favorite added:', newFavoriteRef.id);
  //       setFavorites([...favorites, newFavorite]);
  //     } else {
  //       console.log('Favorite with the same label already exists:', existingDocs.docs[0].id);
  //     }
  //   } else {
  //     console.log("You can't add more than 3 favorites.");
  //   }
  //   };

  // let getSearchValue = (value) => {
  //     addNewFavorite(value);
  //     console.log(value);
  // }
  useEffect(() => {
    if (!userUID) return;

    const userRef = doc(db, "users", userUID);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      const userData = snapshot.data();
      if (userData && userData.favorites) {
        setFavorites(userData.favorites);
      }
    });

    return () => unsubscribe();
  }, [userUID]);

  let deleteFavorite = async (favorite, idx) => {
    const userRef = doc(db, "users", userUID);
    const newFavorites = favorites.filter(
      (fav) => fav.label !== favorite.label
    );
    setData((prevData) => ({ ...prevData, [`data${idx}`]: null }));

    const updatedData = { ...data };
    for (let i = idx + 1; i < favorites.length; i++) {
      updatedData[`data${i - 1}`] = data[`data${i}`];
    }

    setData(updatedData);
    await updateDoc(userRef, {
      favorites: newFavorites,
    });
  };

  let addNewFavorite = async (city) => {
    if (favorites.length < 3) {
      const newFavorite = {
        label: city.label,
        city: city.value,
        country: city.country,
        latitude: city.latitude,
        longitude: city.longitude,
      };

      const userRef = doc(db, "users", userUID);

      // Check if the label already exists in favorites
      const existingFavorite = favorites.find(
        (favorite) => favorite.label === newFavorite.label
      );

      if (!existingFavorite) {
        await updateDoc(userRef, {
          favorites: [...favorites, newFavorite],
        });

        fetchWeatherData(newFavorite, favorites.length);
      } else {
        console.log(
          "Favorite with the same label already exists:",
          existingFavorite.label
        );
      }
    } else {
      console.log("You can't add more than 3 favorites.");
    }
  };

  let fetchWeatherData = (favorite, idx) => {
    fetch(
      `${OPENWEATHER_API_URL}/weather?lat=${favorite.latitude}&lon=${favorite.longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        setData((prevData) => ({ ...prevData, [`data${idx}`]: data }));
      })
      .catch((error) => console.log(error));
  };

  let getSearchValue = (value) => {
    addNewFavorite(value);
    console.log(value);
  };

  // if (favorites[0]) {
  //   if (!data.data0) {
  //     fetch(
  //       `${OPENWEATHER_API_URL}/weather?lat=${favorites[0].latitude}&lon=${favorites[0].longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setData((prevData) => ({ ...prevData, data0: data }));
  //       })
  //       .catch((error) => console.log(error));
  //   }
  // }
  // if (favorites[1]) {
  //   if (!data.data1) {
  //     setTimeout(() => {
  //       fetch(
  //         `${OPENWEATHER_API_URL}/weather?lat=${favorites[1].latitude}&lon=${favorites[1].longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
  //       )
  //         .then((response) => response.json())
  //         .then((data) => {
  //           setData((prevData) => ({ ...prevData, data1: data }));
  //         })
  //         .catch((error) => console.log(error));
  //     }, 1500);
  //   }
  // }

  // if (favorites[2]) {
  //   if (!data.data2)
  //     setTimeout(() => {
  //       fetch(
  //         `${OPENWEATHER_API_URL}/weather?lat=${favorites[2].latitude}&lon=${favorites[2].longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
  //       )
  //         .then((response) => response.json())
  //         .then((data) => {
  //           setData((prevData) => ({ ...prevData, data2: data }));
  //         })
  //         .catch((error) => console.log(error));
  //     }, 3000);
  // }

  return (
    // <div className="fav2">
    //   <h6 style={{ fontSize: "17px", textAlign: "center" }}>
    //     Add a new favorite location
    //   </h6>
    //   <FavoritesSearch getData={getSearchValue} />
    //   {data.data0 && (
    //     <div className="fav favorite1">
    //       <div className="favorites--city--description">
    //         <span className="favorites--city">
    //           {data.data0.name}, {data.data0.sys.country}
    //         </span>
    //         <span className="favorites--description">
    //           {data.data0.weather[0].main}
    //         </span>
    //       </div>
    //       <div className="favorites--temperature--img">
    //         <span className="favorites--temperature">
    //           {Math.round(data.data0.main.temp)}°C
    //         </span>
    //         <img
    //           className="favorites--img"
    //           src={`weather-icons/${data.data0.weather[0].icon}.png`}
    //         ></img>
    //       </div>
    //       <div>
    //         <span className="favorites--feelsLike">
    //           Feels like: {Math.round(data.data0.main.feels_like)}°C
    //         </span>
    //       </div>
    //       <RiDeleteBack2Fill
    //         onClick={() => deleteFavorite(favorites[0], 0)}
    //         className="favorites--delete--icon"
    //       ></RiDeleteBack2Fill>
    //     </div>
    //   )}
    //   {data.data1 && (
    //     <div className="fav favorite1">
    //       <div className="favorites--city--description">
    //         <span className="favorites--city">
    //           {data.data1.name}, {data.data1.sys.country}
    //         </span>
    //         <span className="favorites--description">
    //           {data.data1.weather[0].main}
    //         </span>
    //       </div>
    //       <div className="favorites--temperature--img">
    //         <span className="favorites--temperature">
    //           {Math.round(data.data1.main.temp)}°C
    //         </span>
    //         <img
    //           className="favorites--img"
    //           src={`weather-icons/${data.data1.weather[0].icon}.png`}
    //         ></img>
    //       </div>
    //       <div>
    //         <span className="favorites--feelsLike">
    //           Feels like: {Math.round(data.data1.main.feels_like)}°C
    //         </span>
    //       </div>
    //       <RiDeleteBack2Fill
    //         onClick={() => deleteFavorite(favorites[1], 1)}
    //         className="favorites--delete--icon"
    //       ></RiDeleteBack2Fill>
    //     </div>
    //   )}
    //   {data.data2 && (
    //     <div className="fav favorite1">
    //       <div className="favorites--city--description">
    //         <span className="favorites--city">
    //           {data.data2.name}, {data.data2.sys.country}
    //         </span>
    //         <span className="favorites--description">
    //           {data.data2.weather[0].main}
    //         </span>
    //       </div>
    //       <div className="favorites--temperature--img">
    //         <span className="favorites--temperature">
    //           {Math.round(data.data2.main.temp)}°C
    //         </span>
    //         <img
    //           className="favorites--img"
    //           src={`weather-icons/${data.data2.weather[0].icon}.png`}
    //         ></img>
    //       </div>
    //       <div>
    //         <span className="favorites--feelsLike">
    //           Feels like: {Math.round(data.data2.main.feels_like)}°C
    //         </span>
    //       </div>
    //       <RiDeleteBack2Fill
    //         onClick={() => deleteFavorite(favorites[2], 2)}
    //         className="favorites--delete--icon"
    //       ></RiDeleteBack2Fill>
    //     </div>
    //   )}
    // </div>
    <div className="fav2">
      <h6 style={{ fontSize: "17px", textAlign: "center" }}>
        Add a new favorite location
      </h6>
      <FavoritesSearch getData={getSearchValue} />
      {favorites.map(
        (favorite, idx) =>
          data[`data${idx}`] && (
            <div className="fav favorite1" key={favorite.label}>
              <div className="favorites--city--description">
                <span className="favorites--city">
                  {data[`data${idx}`].name}, {data[`data${idx}`].sys.country}
                </span>
                <span className="favorites--description">
                  {data[`data${idx}`].weather[0].main}
                </span>
              </div>
              <div className="favorites--temperature--img">
                <span className="favorites--temperature">
                  {Math.round(data[`data${idx}`].main.temp)}°C
                </span>
                <img
                  className="favorites--img"
                  src={`weather-icons/${
                    data[`data${idx}`].weather[0].icon
                  }.png`}
                  alt="Weather Icon"
                />
              </div>
              <div>
                <span className="favorites--feelsLike">
                  Feels like: {Math.round(data[`data${idx}`].main.feels_like)}°C
                </span>
              </div>
              <RiDeleteBack2Fill
                onClick={() => deleteFavorite(favorite, idx)}
                className="favorites--delete--icon"
              ></RiDeleteBack2Fill>
            </div>
          )
      )}
    </div>
  );
};

export default Favorites;
