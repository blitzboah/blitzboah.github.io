const button = document.querySelector('.button');
const body = document.querySelector("body");

let isDark = true;

button.addEventListener('click', (e) => {
    if (isDark) {
        body.style.backgroundColor = "white";
        body.style.color = "black";
        button.style.backgroundColor = "black";
    } else {
        body.style.backgroundColor = "black";
        body.style.color = "white";
        button.style.backgroundColor = "white";
    }
    isDark = !isDark;
});
