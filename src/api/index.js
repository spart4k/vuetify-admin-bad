import Chapters from "./chapters";
import Cities from "./cities";
import ChapterClass from "./classes";
import ChapterCategories from "./categories";
import Services from "./services";
import Clients from "./clients";
import Masters from "./masters";

const API_URL = "https://tints.c.roky.rocks/api/";

export const chapters = new Chapters(API_URL);
export const cities = new Cities(API_URL);
export const classes = new ChapterClass(API_URL);
export const categories = new ChapterCategories(API_URL);
export const services = new Services(API_URL);
export const clients = new Clients(API_URL);
export const masters = new Masters(API_URL);
