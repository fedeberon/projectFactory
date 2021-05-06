import axios from "axios";

const baseURL = "http://localhost:8082/project-factory/api/v1";
const headers = {
  Accept: "*/*",
  "Content-Type": "application/json",
};

export const loginUser = async (username, password) => {
  const data = {
    username,
    password
  };

  try {
    const response = await axios.post(`${baseURL}/users/login`, data, {
      headers,
    });
    console.log(response);
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
    const response = await axios.post(`${baseURL}/users`, data, {
      headers,
    });
    console.log(response);
    const json = response.data;
    return [json.token];
  } catch (error) {
    console.log(error);
  }
};

export const addUser = async (userName, password) => {
  const data = {
    username,
    password
  };

  try {
    const response = await axios.post(`${baseURL}/users/register`, data, {
      headers,
    });
    console.log(response);
    const json = response.data;
    return [json.token];
  } catch (error) {
    console.log(error);
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await axios.post(`${baseURL}/users/${userId}`, data, {
      headers,
    });
    console.log(response);
    const json = response.data;
    return [json.token];
  } catch (error) {
    console.log(error);
  }
};
