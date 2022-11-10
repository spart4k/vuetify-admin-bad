import Chapters from "./chapters";
import Cities from "./cities";
import ChapterClass from "./classes";
import ChapterCategories from "./categories";
import Services from "./services";

const API_URL = "http://tints.c.roky.rocks/api/";

export const chapters = new Chapters(API_URL);
export const cities = new Cities(API_URL);
export const classes = new ChapterClass(API_URL);
export const categories = new ChapterCategories(API_URL);
export const services = new Services(API_URL);
