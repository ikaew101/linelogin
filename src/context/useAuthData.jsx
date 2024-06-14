import { useContext } from "react";
import { UserContext } from "./userContext";

export default function useAuthData() {
  return useContext(UserContext);
}
