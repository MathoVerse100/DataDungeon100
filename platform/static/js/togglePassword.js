// platform/static/ts/togglePassword.ts
document.addEventListener("DOMContentLoaded", () => {
  const togglePassword = document.querySelector("#toggle-password");
  const password = document.querySelector("#password");
  if (togglePassword && password) {
    togglePassword?.addEventListener("click", () => {
      if (password.getAttribute("type") == "password") {
        togglePassword.style.backgroundImage = "url('http://localhost:8000/assets/show_password.png')";
        password.setAttribute("type", "text");
      } else {
        togglePassword.style.backgroundImage = "url('http://localhost:8000/assets/hide_password.png')";
        password.setAttribute("type", "password");
      }
    });
  }
});
//# sourceMappingURL=togglePassword.js.map
