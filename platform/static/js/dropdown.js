// platform/static/ts/dropdown.ts
var Dropdown = class {
  constructor(element, isDropdownOpen = false) {
    this.element = element;
    this.isDropdownOpen = isDropdownOpen;
    this.isDropdownOpen = isDropdownOpen;
    this.element = element;
    this.dropdown_display_text = element?.querySelector(".dropdown_display_text") ?? null;
    this.dropdown_view = element?.querySelector(".dropdown_view") ?? null;
    this.dropdown_arrow = element?.querySelector(".dropdown_arrow") ?? null;
    this.dropdown_display_text_options = { 0: "Choose..." };
    this.changeDropdownDisplayText(0, "Choose...");
  }
  dropdown_display_text;
  dropdown_view;
  dropdown_arrow;
  dropdown_display_text_options;
  updateDropdownState() {
    if (!this.dropdown_view) return;
    this.isDropdownOpen = !this.isDropdownOpen;
    this.dropdown_view.style.display = this.dropdown_view.style.display === "none" ? "flex" : "none";
  }
  changeDropdownDisplayText(position, name) {
    if (this.dropdown_display_text === null) return;
    this.dropdown_display_text_options[position] = name;
    this.updateDropdownDisplayText();
  }
  updateDropdownDisplayText() {
    if (this.dropdown_display_text === null) return;
    this.dropdown_display_text.textContent = Object.keys(
      this.dropdown_display_text_options
    ).map(Number).sort((a, b) => a - b).map((key) => this.dropdown_display_text_options[key]).join(" | ");
  }
};
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".dropdown").forEach((dropdown) => {
    const dropdown_container = new Dropdown(dropdown);
    dropdown_container.dropdown_view.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) {
        dropdown_container.updateDropdownState();
      }
    });
    dropdown_container.element.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) {
        dropdown_container.updateDropdownState();
      }
    });
    dropdown_container.dropdown_display_text.addEventListener(
      "click",
      (event) => {
        if (event.target === event.currentTarget) {
          dropdown_container.updateDropdownState();
        }
      }
    );
    dropdown_container.dropdown_arrow.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) {
        dropdown_container.updateDropdownState();
      }
    });
    document.addEventListener("click", (event) => {
      if (!dropdown_container.element) return;
      if (!dropdown?.contains(event.target) && dropdown_container.isDropdownOpen) {
        dropdown_container.updateDropdownState();
      }
    });
    dropdown_container.dropdown_view.querySelectorAll(".dropdown_section").forEach((section, section_index) => {
      const options = section.querySelectorAll(
        ".dropdown_section_option"
      );
      options.forEach((option) => {
        option.addEventListener("click", () => {
          options.forEach(
            (option2) => option2.style.backgroundColor = "oklch(27.8% 0.033 256.848)"
          );
          option.style.backgroundColor = "oklch(55.1% 0.027 264.364 / 0.5)";
          dropdown_container.changeDropdownDisplayText(
            section_index,
            option.textContent.trim()
          );
        });
      });
    });
  });
});
//# sourceMappingURL=dropdown.js.map
