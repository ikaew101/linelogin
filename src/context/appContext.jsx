import { createContext } from "react";

const AppContext = createContext({
    statusSave: false,
    setStatusSave: (saving) => {},
    params: "",
    setParams: (value) => {},
    loadSuccess: false,
    setLoadSuccess: (val) => {}
});

export default AppContext;
