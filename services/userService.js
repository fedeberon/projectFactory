import API from "./api";

export const signInCallBack = async (user, account, profile) => {
  const data = {
    name: user.name,
    email: user.email,
    provider: account.provider,
    accessToken: account.accessToken,
    idToken: account.idToken,
    image: user.image,
  };

  const { token } = await API.post(`/users/signInCallBack`, data);
  return token;
};

export const loginUser = async (username, password) => {
  const data = {
    username,
    password,
  };

  const { token } = await API.post(`/users/login`, data);
  return token;
};

export const getUsers = async () => {
  return await API.get(`/users`);
};

export const getUserById = async (userId) => {
  return await API.get(`/users/${userId}`);
};

export const addUser = async (username, password) => {
  const data = {
    username,
    password,
  };

  const { token } = await API.post(`/users/register`, data);
  return token;
};

export const isUnique = async (email) => {
  return await API.post(`/users/email`, { email });
};
