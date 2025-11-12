document.addEventListener("DOMContentLoaded", () => {
  const textareas = document.querySelectorAll<HTMLElement>(".create_comment");

  textareas.forEach((textarea) => {
    textarea.addEventListener("input", () => {
      if (textarea.scrollHeight > textarea.clientHeight) {
        textarea.style.height = textarea.scrollHeight + "px";
      }
    });
  });
});
