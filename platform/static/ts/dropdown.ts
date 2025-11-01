// document.addEventListener("DOMContentLoaded", () => {
//   document.querySelectorAll(".dropdown").forEach((button) => {
//     button.addEventListener("click", () => {
//       console.log("Hello, MOM!");
//     });
//   });
// });

interface DropdownDisplayTextOptionsInterface {
  [key: number]: string;
}

class Dropdown {
  public dropdown_display_text: HTMLElement | null;
  public dropdown_view: HTMLElement | null;
  public dropdown_arrow: HTMLElement | null;
  private dropdown_display_text_options: DropdownDisplayTextOptionsInterface;

  constructor(
    public element: HTMLElement | null,
    public isDropdownOpen: boolean = false
  ) {
    this.isDropdownOpen = isDropdownOpen;
    this.element = element;
    this.dropdown_display_text =
      element?.querySelector(".dropdown_display_text") ?? null;
    this.dropdown_view = element?.querySelector(".dropdown_view") ?? null;
    this.dropdown_arrow = element?.querySelector(".dropdown_arrow") ?? null;

    this.dropdown_display_text_options = { 0: "Choose..." };
    this.changeDropdownDisplayText(0, "Choose...");
  }

  updateDropdownState() {
    if (!this.dropdown_view) return;

    this.isDropdownOpen = !this.isDropdownOpen;
    this.dropdown_view.style.display =
      this.dropdown_view.style.display === "none" ? "flex" : "none";
  }

  changeDropdownDisplayText(position: number, name: string) {
    if (this.dropdown_display_text === null) return;

    this.dropdown_display_text_options[position] = name;
    this.updateDropdownDisplayText();
  }

  updateDropdownDisplayText() {
    if (this.dropdown_display_text === null) return;

    this.dropdown_display_text.textContent = Object.keys(
      this.dropdown_display_text_options
    )
      .map(Number)
      .sort((a, b) => a - b)
      .map((key) => this.dropdown_display_text_options[key])
      .join(" | ");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll<HTMLElement>(".dropdown").forEach((dropdown) => {
    const dropdown_container = new Dropdown(dropdown);

    dropdown_container.dropdown_view!.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) {
        dropdown_container.updateDropdownState();
      }
    });

    dropdown_container.element!.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) {
        dropdown_container.updateDropdownState();
      }
    });

    dropdown_container.dropdown_display_text!.addEventListener(
      "click",
      (event) => {
        if (event.target === event.currentTarget) {
          dropdown_container.updateDropdownState();
        }
      }
    );

    dropdown_container.dropdown_arrow!.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) {
        dropdown_container.updateDropdownState();
      }
    });

    document.addEventListener("click", (event) => {
      if (!dropdown_container.element) return;

      if (
        !dropdown?.contains(event.target as Node) &&
        dropdown_container.isDropdownOpen
      ) {
        dropdown_container.updateDropdownState();
      }
    });

    dropdown_container
      .dropdown_view!.querySelectorAll<HTMLElement>(".dropdown_section")
      .forEach((section, section_index) => {
        const options = section.querySelectorAll<HTMLElement>(
          ".dropdown_section_option"
        );

        options.forEach((option) => {
          option.addEventListener("click", () => {
            options.forEach(
              (option) =>
                (option.style.backgroundColor = "oklch(27.8% 0.033 256.848)")
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
