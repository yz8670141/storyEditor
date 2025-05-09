import { defineStore } from "pinia";
import { ref, watch } from "vue";
export const userStorybookStore = defineStore("storybook", () => {
  const pages = ref([]); // 每頁物件 { id, image, text }
  const title = ref("書名是什麼我不知道");
  const author = ref("作者是誰你猜猜");
  const converImage = ref("");
  const tempCoverImage = ref("");
  function addPage(page) {
    pages.value.push(page);
  }

  function updateCover({ newTitle, newAuthor, newImage }) {
    //console.log("newTitle, newAuthor, newImage", newTitle, newAuthor, newImage);
    title.value = newTitle;
    author.value = newAuthor;
    converImage.value = newImage;
  }
  watch([title, author, tempCoverImage], ([t, a, img]) => {
    const trimmedTitle = t.trim();
    const trimmedAuthor = a.trim();
    if (trimmedTitle && trimmedAuthor && img && converImage !== img) {
      updateCover({
        newTitle: trimmedTitle,
        newAuthor: trimmedAuthor,
        newImage: img,
      });
    }
  });

  return {
    pages,
    title,
    author,
    converImage,
    tempCoverImage,
    addPage,
    updateCover,
  };
});
