import axios from "axios";
import { API_BASE_URL } from "@/constants/appConstants";

const HttpClient = axios.create({
    baseURL: API_BASE_URL,
});

export default HttpClient;
