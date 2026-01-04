// Composables
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "main",
    redirect: "domains",
    component: () => import("@/layouts/default.vue"),
    beforeEnter: async () => {},
    children: [
      // main.dashboard
      {
        name: "main.dashboard",
        path: "dashboard",
        component: () => import("@/pages/dashboard.vue")
      },
      // main.clients
      {
        name: "main.clients",
        path: "clients",
        component: () => import("@/pages/clients.vue")
      },
      // main.client.view
      {
        name: "main.clients.view",
        path: "clients/view",
        component: () => import("@/pages/clients-view.vue")
      },
      // main.domains
      {
        name: "main.domains",
        path: "domains",
        component: () => import("@/pages/domains.vue")
      },
      // main.domain.view
      {
        name: "main.domains.view",
        path: "domains/view",
        component: () => import("@/pages/domains-view.vue")
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
