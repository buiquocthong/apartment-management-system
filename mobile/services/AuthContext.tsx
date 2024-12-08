import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "./authApi";
import { ILogIn } from "../utils/type";

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  handleLogin: (credentials: ILogIn) => Promise<void>;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem("token");
      setToken(savedToken);
    };
    loadToken();
  }, []);

  const handleLogin = async (credentials: ILogIn) => {
    try {
      const data = await login(credentials);
      if (data.status === 200) {
        setToken(data.token);
        await AsyncStorage.setItem("token", data.token); // Save token
        setIsAuthenticated(true);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    setToken(null);
    await AsyncStorage.removeItem("token"); // Delete token
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
