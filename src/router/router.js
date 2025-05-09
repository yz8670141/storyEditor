import { createMemoryHistory, createRouter } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import EditorView from "@/views/EditorView.vue";
import PreviewView from "@/views/PreviewView.vue";

const routes = [
  { path: "/", neame: "Home", component: HomeView },
  { path: "/editor", neame: "Editor", component: EditorView },
  { path: "/preview", neame: "Preview", component: PreviewView },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
export default router;
