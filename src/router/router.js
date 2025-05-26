import { createMemoryHistory, createRouter } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import PageEditor from "@/components/PageEditor.vue";
import BookViewer from "@/components/BookViewer.vue";
import TEST from "@/views/TEST.vue";

const routes = [
  { path: "/", name: "Home", component: HomeView },
  { path: "/pageEditor", name: "PageEditor", component: PageEditor },
  { path: "/bookViewer", name: "BookViewer", component: BookViewer },
  { path: "/tEST", name: "TEST", component: TEST },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
export default router;
