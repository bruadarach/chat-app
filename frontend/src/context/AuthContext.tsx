import { createContext, useState, ReactNode, useContext } from "react";
import { AuthUserProps } from "../utils/types";

interface AuthContextType {
  authUser: AuthUserProps | null;
  setAuthUser: React.Dispatch<React.SetStateAction<string | null>>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({ children }: AuthProviderProps) => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("chat-user")!) || null
  );

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    return { authUser: null, setAuthUser: () => {} };
  }

  return context;
};
