const button = document.querySelector('.button');

const body = document.querySelector("body");

let isLight = false;
let isDark = true;

if(isDark)
{
    body.style.backgroundColor = "black"
    body.style.color = "white"
}

button.addEventListener( 'click',(e) => {
    if(isLight){
        body.style.backgroundColor = "black"
        body.style.color = "white"
        button.style.backgroundColor = "white"
        isDark = true;
        isLight = false;
    }
    else if(isDark){
        body.style.backgroundColor = "white"
        body.style.color = "black"
        button.style.backgroundColor = "black"
        isLight = true
        isDark = false;
    }
})