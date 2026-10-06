const crtToggle = document.createElement("button");
const crtPreference = localStorage.getItem("crt-mode");
let crtEnabled = crtPreference !== "off";

crtToggle.className = "crt-toggle";
crtToggle.type = "button";
crtToggle.setAttribute("aria-label", "toggle CRT effect");

function renderCrtMode() {
    document.body.classList.toggle("crt-off", !crtEnabled);
    crtToggle.textContent = "";
    crtToggle.title = `${crtEnabled ? "disable" : "enable"} CRT effect`;
    crtToggle.setAttribute("aria-pressed", String(crtEnabled));
}

crtToggle.addEventListener("click", () => {
    crtEnabled = !crtEnabled;
    localStorage.setItem("crt-mode", crtEnabled ? "on" : "off");
    renderCrtMode();
});

renderCrtMode();
document.querySelector(".directory-structure").appendChild(crtToggle);
