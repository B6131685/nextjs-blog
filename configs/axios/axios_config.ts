import Axios from "axios";

const axios = Axios.create({
    baseURL: process.env.BASEURL+"/api",
    headers: { "Content-Type": "application/json" }
});

export default axios;