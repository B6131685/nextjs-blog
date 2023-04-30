import Axios from "axios";

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASEURL_AXIOS,
    headers: { "Content-Type": "application/json" }
});

export default axios;