import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [userId, setUserId] = useState(false);
  const [listStoreNumber, setListStoreNumber] = useState([]);
  const [userData, setUserData] = useState();
  const flagReload = localStorage.getItem("re");
  const [reload, setReload] = useState(!flagReload);

  useEffect(() => {
    const authState = localStorage.getItem("_auth_state");
    setUserData({
      menus: JSON.parse(authState)?.menus,
    });
    if (authState) {
      setUserId(JSON.parse(authState)[0]?.id);
    }

    if (reload) {
      // localStorage.setItem('re', true)
      // window.location.reload(true);
    } else {
      // navigator.serviceWorker.getRegistrations().then((registrations) => {
      //   console.log('registration', registrations)
      //   registrations.forEach((registration) => {
      //     console.log(registration)
      //     registration.unregister();
      //   });
      // });
      // caches.keys().then((keyList) => {
      //   console.log('caches', keyList)
      //   return Promise.all(
      //     keyList.map((key) => {
      //       console.log(key)
      //       return caches.delete(key);
      //     })
      //   );
      // });
    }
    if (!window.location.pathname.startsWith("/manage")) return;
    // console.log('-----storeList')
    const jsonStores = JSON.parse(authState)[0].availableStore;
    jsonStores.mini?.sort((a, b) => a.costCenter - b.costCenter);
    jsonStores.super?.sort((a, b) => a.costCenter - b.costCenter);
    jsonStores.hyper?.sort((a, b) => a.costCenter - b.costCenter);

    const arrayMini = [],
      arraySuper = [],
      arrayHyper = [];
    jsonStores?.mini?.map((ele) => {
      arrayMini.push(ele.storeNumber);
    });
    jsonStores?.super?.map((ele) => {
      arraySuper.push(ele.storeNumber);
    });
    jsonStores?.hyper?.map((ele) => {
      arrayHyper.push(ele.storeNumber);
    });
    const allLists = arrayMini.concat(arraySuper).concat(arrayHyper);

    setListStoreNumber({
      all: allLists,
      mini: arrayMini,
      super: arraySuper,
      hyper: arrayHyper,
    });
  }, []);

  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId,
        listStoreNumber,
        userData,
        reload,
        setReload,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
