// platform/static/ts/create_comment.ts
document.addEventListener("DOMContentLoaded", () => {
  const textareas = document.querySelectorAll(".create_comment");
  textareas.forEach((textarea) => {
    textarea.addEventListener("input", () => {
      if (textarea.scrollHeight > textarea.clientHeight) {
        textarea.style.height = textarea.scrollHeight + "px";
      }
    });
  });
});
//# sourceMappingURL=create_comment.js.map
