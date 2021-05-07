import axios from "axios";
import API from "./api";

// const baseURL = "http://localhost:8082/project-factory/api/v1";
const headers = {
  Accept: "*/*",
  "Content-Type": "application/json",
};

export const signInCallBack = async (user, account, profile) => {
  try {
    const response = await API.post(
      `/users/signInCallBack`,
      {
        name: user.name,
        email: user.email,
        provider: account.provider,
        accessToken: account.accessToken,
        idToken: account.idToken,
        image: user.image,
      },
      { headers }
    );
    const json = response.data;
    return [json.token];
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = async (username, password) => {
  const data = {
    username,
    password,
  };

  try {
    const response = await API.post(`/users/login`, data, {
      headers,
    });
    // console.log(response);
    const json = response.data;
    return [json.token];
  } catch (error) {
    console.log(error);
  }
};

export const getUsers = async (token) => {
  const data = {
    token,
  };

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_HOST_BACKEND}/users`,
      data,
      {
        headers,
      }
    );
    console.log(response);
    const json = response.data;
    return [json.token];
  } catch (error) {
    console.log(error);
  }
};

export const addUser = async (username, password) => {
  const data = {
    username,
    password,
  };

  try {
    const response = await API.post(`/users/register`, data, {
      headers,
    });
    if (response.status == 201) {
      const json = response.data;
      return [json.token];
    }
  } catch (error) {
    if (error.response.status == 409) {
      return Promise.resolve();
      // return [error.response.data];
    }
    console.log("Error-------------------------------------");
    console.log(error);
    return Promise.reject(error);
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_HOST_BACKEND}/users/${userId}`,
      data,
      {
        headers,
      }
    );
    console.log(response);
    const json = response.data;
    return [json.token];
  } catch (error) {
    console.log(error);
  }
};

export const getIsExistUser = async (userEmail) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_HOST_BACKEND}/users/email/${userEmail}`,
      data,
      {
        headers,
      }
    );
    if (response.status == 200) {
      console.log(response);
      const json = response.data;
      return [json.algo]; // falta ver que llega
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateLastLoginUser = async (userEmail) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_HOST_BACKEND}/users/email/${userEmail}`,
      data,
      {
        headers,
      }
    );
    if (response.status == 200) {
      console.log(response);
      const json = response.data;
      return [json.algo]; // falta ver que llega
    }
  } catch (error) {
    console.log(error);
  }
};
