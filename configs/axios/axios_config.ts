import Axios from "axios";

const axios = Axios.create({
    baseURL: process.env.BASEURL,
    headers: { "Content-Type": "application/json" }
});

export default axios;