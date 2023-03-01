const routes = [
  {
    path: "/",
    redirect: "/weather",
  },
  {
    path: "/weather",
    component: () => import("src/views/weather/weatherPage.vue"),
  },
  {
    path: "/weather/search",
    component: () =>
      import("src/views/weather/searchWeather/searchWeather.vue"),
  },
  {
    path: "/weather/city",
    component: () => import("src/views/weather/cityList/cityList.vue"),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
