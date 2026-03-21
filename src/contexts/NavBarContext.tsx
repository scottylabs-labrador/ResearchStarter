import { createContext, useContext } from "react";

export const NavBarContext = createContext(false);

export const useNavBarHidden = () => useContext(NavBarContext);
