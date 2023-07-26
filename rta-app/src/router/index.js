import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AssemblyDashboard from "../components/assemblies/AssemblyDashboard.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/projects",
      name: "projects",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/ProjectsView.vue"),
    },
    {
      path: "/assemblies",
      name: "assemblies",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AssembliesView.vue"),
      children: [
        {
            path: '',
            component: AssemblyDashboard,
            props: { assembly_name: '' }
        },
        {
            path: ':assembly_name',
            component: AssemblyDashboard,
            props: true
        }
      ]
    },
    {
      path: "/materialpassports",
      name: "materialpassports",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/MaterialPassportsView.vue"),
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/team",
      name: "team",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/TeamView.vue"),
    },
  ],
});

export default router;
