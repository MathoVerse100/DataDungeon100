document.addEventListener("DOMContentLoaded", () => {
  const create_comments =
    document.querySelectorAll<HTMLElement>(".create_comment");

  create_comments.forEach((create_comment) => {
    const textarea = create_comment.querySelector("textarea");
    const submit_button = create_comment.querySelector("button")!;

    textarea?.addEventListener("input", () => {
      if (textarea.scrollHeight > textarea.clientHeight) {
        textarea.style.height = textarea.scrollHeight + "px";
      }
    });

    document.addEventListener("click", (event) => {
      const { selectionStart, selectionEnd, value } = textarea;

      if (event.target !== textarea && selectionStart === selectionEnd) {
        submit_button.style.display = "none";
      } else {
        submit_button.style.display = "flex";
      }
    });
  });
});
