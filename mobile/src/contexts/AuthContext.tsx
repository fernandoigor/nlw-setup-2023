import { useState, createContext, ReactNode, useEffect } from "react";
import { Alert } from "react-native";
import { authGitHub } from "../lib/auth/OAuthGithub";
// import { authDiscord } from "../lib/auth/OAuthDiscord";
import { api } from "../lib/axios";

export interface UserLoginProps {
  email: string;
  password: string;
}
export interface UserProps {
  userId: string;
  username: string;
  avatar: string;
  token: string;
}

interface AuthContextData {
  user: UserProps;
  login: ({ email, password }: UserProps) => void;
  logout: () => void;
  loginGitHub: () => void;
  loginDiscord: () => void;
}

const initialState: AuthContextData = {
  user: {
    userId: "",
    username: "",
    avatar: "",
    token: "",
  },
  login() {},
  logout() {},
  loginGitHub() {},
  loginDiscord() {},
};

export const AuthContext = createContext<AuthContextData>(initialState);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [userData, setData] = useState({
    userId: "",
    username: "",
    avatar: "",
    token: "",
  });

  const login = async ({ email, password }: UserLoginProps) => {
    const responseLogin = await api.post(`/auth/login`, {
      email: email.toLowerCase(),
      password: password,
    });

    if (responseLogin) {
      const { id, token, username } = responseLogin.data;
      console.log("LOGIN", id, token, username);
      setData((prev) => ({
        userId: id,
        username,
        avatar:
          "https://thumbs.dreamstime.com/b/%C3%ADcone-an%C3%B4nimo-da-cara-do-perfil-pessoa-cinzenta-silhueta-avatar-masculino-defeito-placeholder-foto-no-branco-106473768.jpg",
        token,
      }));
    }

    return responseLogin;
  };
  const loginGitHub = async () => {
    try {
      const responseAuth = await authGitHub();
      console.log(responseAuth.data);
      const { id, username, token, avatar } = responseAuth.data;

      setData({
        userId: id,
        username: username,
        avatar: avatar,
        token: token,
      });
    } catch (error) {
      if (error?.response?.status === 400) {
        Alert.alert("Ops", "Servidor fora do ar");
      } else {
        Alert.alert("Ops", "Não foi possível autenticar com o servidor");
      }
    }
  };
  const loginDiscord = async () => {
    // await authDiscord();
  };
  function logout() {
    setData({
      userId: "",
      username: "",
      avatar: "",
      token: "",
    });
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        loginGitHub,
        loginDiscord,
        user: userData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export async function Register({ username, email, password }) {
  console.log({ username, email, password });
  return await api.post("/auth/register", { username, email, password });
}
