import axios from "axios";
import { BASE_URL } from "./constant";

export default axios.create({
    baseURL: BASE_URL
});