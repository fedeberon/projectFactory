import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_HOST_BACKEND}`,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async function (config) {
    // if (session) {
    //   config.headers['Authorization'] = session.accessToken;
    // }
    // config.headers['Authorization'] = "Bearer ";
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.status === 401) {
      location.href = '/';
    }
    console.error(error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
