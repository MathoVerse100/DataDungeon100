document.addEventListener("DOMContentLoaded", () => {
  const togglePassword =
    document.querySelector<HTMLElement>("#toggle-password");
  const password = document.querySelector<HTMLElement>("#password");

  if (togglePassword && password) {
    togglePassword?.addEventListener("click", () => {
      if (password.getAttribute("type") == "password") {
        togglePassword.style.backgroundImage =
          "url('http://localhost:8000/assets/show_password.png')";
        password.setAttribute("type", "text");
      } else {
        togglePassword.style.backgroundImage =
          "url('http://localhost:8000/assets/hide_password.png')";
        password.setAttribute("type", "password");
      }
    });
  }
});
