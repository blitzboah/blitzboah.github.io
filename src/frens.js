fetch("/json/frens.json")
  .then((res) => res.json())
  .then((frens) => {
    const track = document.getElementById("frens-track");
    const renderFrens = () =>
      frens
        .map(
          (f) => `
            <a href="${f.url}" target="_blank">
                <img src="${f.img}" width="88" height="31" alt="${f.name}">
            </a>
        `,
        )
        .join("");

    track.innerHTML = renderFrens() + renderFrens();
  })
  .catch((err) => console.error("failed to load frens:", err));
