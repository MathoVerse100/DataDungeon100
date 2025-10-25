// platform/static/ts/scripts.ts
function click_alert(input) {
  window.alert(input.person);
}
document.querySelector("#notify").addEventListener("click", () => {
  const wow_element = {
    person: "human"
  };
  click_alert(wow_element);
});
//# sourceMappingURL=scripts.js.map
