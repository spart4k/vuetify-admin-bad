import Chapters from "./chapters";
import Cities from "./cities";
import ChapterClass from "./classes";
import ChapterCategories from "./categories";
import Services from "./services";
import Clients from "./clients";
import Masters from "./masters";
import Feeds from "./feeds";
import Booking from "./booking";
import Shedules from "./shedules";
import axios from "axios";

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL
axios.defaults.headers.common.Authorization = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MjksInJvbGUiOjN9.XcEvsK6X6dStRHjeCTnTuzDTl_44-yyrNQePZwX7ZEw`
// 8080/users
// 5000/appointment
// 3001/review

export const shedules = new Shedules();
export const chapters = new Chapters();
export const cities = new Cities();
export const classes = new ChapterClass();
export const categories = new ChapterCategories();
export const services = new Services();
export const clients = new Clients();
export const masters = new Masters();
export const booking = new Booking();
export const feeds = new Feeds();
