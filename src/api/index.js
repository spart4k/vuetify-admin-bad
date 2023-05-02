import Chapters from "./chapters";
import Cities from "./cities";
import ChapterClass from "./classes";
import ChapterCategories from "./categories";
import Services from "./services";
import Clients from "./clients";
import Masters from "./masters";
import Feeds from "./feeds";
import Appointment from "./appointment";
import axios from "axios";

// const API_URL = "https://tints.c.roky.rocks/api/";
const API_URL = "http://94.103.84.93:8080/api/";
// 5000

axios.defaults.headers.common.Authorization = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MjksInJvbGUiOjN9.XcEvsK6X6dStRHjeCTnTuzDTl_44-yyrNQePZwX7ZEw`
export const chapters = new Chapters(API_URL);
export const cities = new Cities(API_URL);
export const classes = new ChapterClass(API_URL);
export const categories = new ChapterCategories(API_URL);
export const services = new Services(API_URL);
export const clients = new Clients(API_URL);
export const masters = new Masters(API_URL);
export const appointment = new Appointment(API_URL);
export const feeds = new Feeds(API_URL);
