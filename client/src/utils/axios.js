import axios from "axios";
const accessToken = "hjRE5t2RVXBqp561CfadH4aoW5oMSuEhDXsDxFJJ_nU";
const baseUrl = "/api/v1"
const authFetch = axios.create({
  baseURL: baseUrl,
});
authFetch.defaults.headers.common["Content-Type"] = "application/json"

const userFetch = axios.create({
  baseURL: "",
  headers: {
    Accept: "Application/json",
  },
});

const photoFetch = axios.create({
  baseURL: "",
  headers: {
    Accept: "Application/json",
  },
});

// const params = {page: 1}
// const params = new URLSearchParams();
// params.append("page", 1);
// params.append("client_id", "hjRE5t2RVXBqp561CfadH4aoW5oMSuEhDXsDxFJJ_nU");

const getData = axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    Accept: "Application/json",
    Authorization: `Client-ID ${accessToken}`,
    // "Content-Type": "application/json",
  },
  // params: params,
});

authFetch.interceptors.request.use(
  (config) => {
    console.log(config);
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export { authFetch, userFetch, photoFetch, getData };
