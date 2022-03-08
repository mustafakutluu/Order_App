import { useContext, createContext } from "react";

const isAuthenticated = false;
export const AppContext = createContext(isAuthenticated);

export function useAppContext() {
    return useContext(AppContext);
}
