import * as AuthSession from "expo-auth-session";
import { CLIENT_ID_GITHUB, REDIRECT_URI_GITHUB } from "@env";
import axios from "axios";
import { api } from "../axios";

type AuthResponseGithub = {
  type: string;
  params: {
    code: string;
  };
};
type ProfileResponseGithub = {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  token: string;
};

export const authGitHub = async () => {
  const CLIENT_ID = CLIENT_ID_GITHUB;
  const REDIRECT_URI = REDIRECT_URI_GITHUB;
  const SCOPE = "identity";

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`;

  const { type, params } = (await AuthSession.startAsync({
    authUrl,
  })) as AuthResponseGithub;
  if (type === "success") {
    return await api.post("/auth/github", { code: params.code });
  }
};
