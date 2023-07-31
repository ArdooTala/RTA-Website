import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AssemblyDashboard from "../components/assemblies/AssemblyDashboard.vue";
import MaterialDashboard from "../components/materials/MaterialDashboard.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: HomeView,
      children: [
        {
            path: 'about',
            component: () => import("../views/AboutView.vue"),
        },
        {
            path: 'team',
            component: () => import("../views/TeamView.vue"),
        }
      ]
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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AssembliesView.vue"),
      children: [
        {
            path: '',
            name: "assemblies",
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
      path: "/mps",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/MaterialPassportsView.vue"),
      children: [
        {
            path: '',
            name: "material_passports",
            component: MaterialDashboard,
            props: { assembly_name: '' }
        },
        {
            path: ':material_name',
            component: MaterialDashboard,
            props: true
        }
      ]
    },
  ],
});

export default router;
