const routes = [
  {
    path: "/",
    redirect: "/weather",
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
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
  {
    path: "/todo",
    component: () => import("src/views/todo/todoPage.vue"),
  },
  {
    path: "/calendar",
    component: () => import("src/views/calendar/calendarPage.vue"),
  },
  {
    path: "/user",
    component: () => import("src/views/user/userPage.vue"),
  },
];

export default routes;
