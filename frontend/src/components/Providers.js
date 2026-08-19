"use client";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "../store/store";
import { useEffect } from "react";
import { setFavourites } from "../store/favouritesSlice";
import ChatWidget from "./ChatWidget";

const SESSION_KEY = 'guest_favourites';

// Inner component that handles favourites bootstrapping
function FavouritesBootstrap() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((s) => s.auth);

  useEffect(() => {
    const bootstrap = async () => {
      if (userInfo) {
        // Logged-in: fetch from backend
        try {
          const res = await fetch('http://localhost:5000/api/favourites', {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          if (res.ok) {
            const data = await res.json();
            dispatch(setFavourites(data));
          }
        } catch (err) {
          console.error('Failed to load favourites', err);
        }
      } else {
        // Guest: load from sessionStorage
        try {
          const data = sessionStorage.getItem(SESSION_KEY);
          if (data) dispatch(setFavourites(JSON.parse(data)));
        } catch {}
      }
    };
    bootstrap();
  }, [userInfo, dispatch]);

  return null;
}

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <FavouritesBootstrap />
      {children}
      <ChatWidget />
    </Provider>
  );
}