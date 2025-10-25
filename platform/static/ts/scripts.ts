import { wow } from "./types";

function click_alert(input: wow): void {
  window.alert(input.person);
}

document.querySelector("#notify")!.addEventListener("click", () => {
  const wow_element: wow = {
    person: "human",
  };

  click_alert(wow_element);
});
