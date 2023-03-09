const btnSearch = document.getElementById("js-btn-search");
const inputSearch = document.getElementById("js-input-search");
btnSearch.addEventListener("click", buscaPokemon);
inputSearch.addEventListener("keyup", (ev) => {
  if (ev.code === "Enter") {
    buscaPokemon();
    inputSearch.value = "";
  }
});

function buscaPokemon() {
  let valueInput = inputSearch.value.toLowerCase();
  const typeFilter = document.querySelectorAll(".type-filter");
  inputSearch.value = "";
  typeFilter.forEach((type) => {
    type.classList.remove("active");
  });
  axios({
    method: "GET",
    url: `https://pokeapi.co/api/v2/pokemon/${valueInput}`,
  })
    .then((response) => {
      areaPokemons.innerHTML = "";
      btnCarregarMais.style.display = "none";
      countPokemons.textContent = 1;

      const { name, id, sprites, types } = response.data;

      const infoCard = {
        nome: name,
        code: id,
        image: sprites.other.home.front_default,
        type: types[0].type.name,
      };
      creatCardPokemon(
        infoCard.code,
        infoCard.type,
        infoCard.nome,
        infoCard.image
      );

      const cardPokemon = document.querySelectorAll(".js-open-details-pokemon");

      cardPokemon.forEach((card) => {
        card.addEventListener("click", openDetailsPokemon);
      });
    })
    .catch((error) => {
      if (error.response) {
        areaPokemons.innerHTML = "";
        btnCarregarMais.style.display = "none";
        countPokemons.textContent = 0;
      }
    });

  if (valueInput !== "") {
    for (let card of areaPokemons) {
      let nomePokBusc = card.querySelectorAll("h3");

      let filterNome = valueInput;
      if (!nomePokBusc.includes(filterNome)) {
        card.style.display = "nome";
      } else {
        card.style.display = "block";
      }
    }
  }
}
