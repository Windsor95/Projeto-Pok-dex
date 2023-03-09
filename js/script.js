const btnCloseModal = document.querySelector(".js-close-modal-details-pokemon");
const countPokemons = document.getElementById("js-count-pokemons");
const btnDropdownSelect = document.querySelector(".js-open-select-custom");

btnDropdownSelect.addEventListener("click", () => {
  btnDropdownSelect.parentElement.classList.toggle("active");
});

// Pokémons cards

const areaPokemons = document.getElementById("js-list-pokemons");

function primeiraLetraM(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function creatCardPokemon(code, type, nome, imagePok) {
  let card = document.createElement("button");
  card.classList = `card-pokemon js-open-details-pokemon ${type}`;
  card.setAttribute("code-pokemon", code);
  areaPokemons.appendChild(card);
  let image = document.createElement("div");
  image.classList = "image";
  card.appendChild(image);

  let imageSrc = document.createElement("img");
  imageSrc.classList = "thumg-img";
  imageSrc.setAttribute("src", imagePok);
  image.appendChild(imageSrc);

  let infoPokemon = document.createElement("div");
  infoPokemon.classList = "info";
  card.appendChild(infoPokemon);

  let txtAreaPok = document.createElement("div");
  txtAreaPok.classList = "text";
  infoPokemon.appendChild(txtAreaPok);

  let codigoPok = document.createElement("span");
  codigoPok.textContent =
    code < 10 ? `#00${code}` : code < 100 ? `#0${code}` : `#${code}`;
  txtAreaPok.appendChild(codigoPok);

  let nomePok = document.createElement("h3");
  nomePok.textContent = primeiraLetraM(nome);
  txtAreaPok.appendChild(nomePok);

  let areaIcon = document.createElement("div");
  areaIcon.classList = "icon";
  infoPokemon.appendChild(areaIcon);

  let imgType = document.createElement("img");
  imgType.setAttribute("src", `img/icon-types/${type}.svg`);
  areaIcon.appendChild(imgType);
}

function listingPokemons(urlApi) {
  axios({
    method: "GET",
    url: urlApi,
  }).then((response) => {
    let countPokemon = document.getElementById("js-count-pokemons");
    const { results, next, count } = response.data;
    countPokemon.innerText = count;

    results.forEach((pokemon) => {
      let urlApiDetails = pokemon.url;

      axios({
        method: "GET",
        url: `${urlApiDetails}`,
      }).then((response) => {
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

        const cardPokemon = document.querySelectorAll(
          ".js-open-details-pokemon"
        );

        cardPokemon.forEach((card) => {
          card.addEventListener("click", openDetailsPokemon);
        });
      });
    });
  });
}

listingPokemons("https://pokeapi.co/api/v2/pokemon?limit=9&offset=0");

function openDetailsPokemon() {
  document.documentElement.classList.add("open-modal");

  let codePokemon = this.getAttribute("code-pokemon");
  let imagePokemon = this.querySelector(".thumg-img");
  let iconTypePokemon = this.querySelector(".info .icon img");
  let namePokemon = this.querySelector(".info h3").textContent;
  let codeStringPokemon = this.querySelector(".info span").textContent;

  const modalDetails = document.getElementById("js-modal-details");
  const imgPokemonModal = document.getElementById("js-image-pokemon-modal");
  const iconTypePokemonModal = document.getElementById("js-image-type-modal");
  const namePokemonModal = document.getElementById("js-name-pokemon-modal");
  const codePokemonModal = document.getElementById("js-code-pokemon-modal");
  const heightPokemonModal = document.getElementById("js-height-pokemon");
  const weightPokemonModal = document.getElementById("js-weight-pokemon");
  const mainAbilitiesModal = document.getElementById("js-main-abilities");

  imgPokemonModal.setAttribute("src", imagePokemon.getAttribute("src"));
  modalDetails.setAttribute("type-pokemon-modal", this.classList[2]);
  iconTypePokemonModal.setAttribute("src", iconTypePokemon.getAttribute("src"));

  namePokemonModal.textContent = namePokemon;
  codePokemonModal.textContent = codeStringPokemon;

  axios({
    method: "GET",
    url: `https://pokeapi.co/api/v2/pokemon/${codePokemon}`,
  }).then((response) => {
    let data = response.data;

    let infoPokemon = {
      mainAbilities: primeiraLetraM(data.abilities[0].ability.name),
      types: data.types,
      weight: data.weight,
      height: data.height,
      abilities: data.abilities,
      stats: data.stats,
      urlType: data.types[0].type.url,
    };

    function listingTypesPokemon() {
      const areaTypesModal = document.getElementById("js-types-pokemon");
      areaTypesModal.innerHTML = "";

      let arrayTypes = infoPokemon.types;

      arrayTypes.forEach((itemType) => {
        let itemList = document.createElement("li");
        areaTypesModal.appendChild(itemList);

        let spanList = document.createElement("span");
        spanList.classList = `tag-type ${itemType.type.name}`;
        spanList.textContent = primeiraLetraM(itemType.type.name);
        itemList.appendChild(spanList);
      });
    }

    function listingWeaknesses() {
      const areaWeak = document.getElementById("js-area-weak");

      areaWeak.innerHTML = "";

      axios({
        method: "GET",
        url: `${infoPokemon.urlType}`,
      }).then((response) => {
        let weaknesses = response.data.damage_relations.double_damage_from;
        weaknesses.forEach((itemType) => {
          let itemListWeak = document.createElement("li");
          areaWeak.appendChild(itemListWeak);

          let spanList = document.createElement("span");
          spanList.classList = `tag-type ${itemType.name}`;
          spanList.textContent = primeiraLetraM(itemType.name);
          itemListWeak.appendChild(spanList);
        });
      });
    }

    heightPokemonModal.textContent = `${infoPokemon.height / 10}m`;
    weightPokemonModal.textContent = `${infoPokemon.weight / 10}kg`;
    mainAbilitiesModal.textContent = infoPokemon.mainAbilities;

    const statsHp = document.getElementById("js-stats-hp");
    const statsAttack = document.getElementById("js-stats-attack");
    const statsDefense = document.getElementById("js-stats-defense");
    const statsSpAttack = document.getElementById("js-stats-sp-attack");
    const statsSpDefense = document.getElementById("js-stats-sp-defense");
    const statsSpeed = document.getElementById("js-stats-speed");

    statsHp.style.width = `${infoPokemon.stats[0].base_stat}%`;
    statsAttack.style.width = `${infoPokemon.stats[1].base_stat}%`;
    statsDefense.style.width = `${infoPokemon.stats[2].base_stat}%`;
    statsSpAttack.style.width = `${infoPokemon.stats[3].base_stat}%`;
    statsSpDefense.style.width = `${infoPokemon.stats[4].base_stat}%`;
    statsSpeed.style.width = `${infoPokemon.stats[5].base_stat}%`;

    listingTypesPokemon();
    listingWeaknesses();
  });
}

function closeDetailsPokemon() {
  document.documentElement.classList.remove("open-modal");
}

if (btnCloseModal) {
  btnCloseModal.addEventListener("click", closeDetailsPokemon);
}

// Pokémons list types

const typeArea = document.getElementById("js-type-area");
const typeAreaMobile = document.querySelector(".dropdown-select");

axios({
  method: "GET",
  url: "https://pokeapi.co/api/v2/type",
}).then((response) => {
  let { results } = response.data;

  results.forEach((type, index) => {
    if (index < 18) {
      let itemType = document.createElement("li");
      typeArea.appendChild(itemType);

      let btnType = document.createElement("button");
      btnType.classList = `type-filter ${type.name}`;
      btnType.setAttribute("code-type", index + 1);
      itemType.appendChild(btnType);

      let iconType = document.createElement("div");
      iconType.classList = `icon`;
      btnType.appendChild(iconType);

      let imgTypeSrc = document.createElement("img");
      imgTypeSrc.setAttribute("src", `img/icon-types/${type.name}.svg`);
      iconType.appendChild(imgTypeSrc);

      let txtTypePok = document.createElement("span");
      txtTypePok.textContent = primeiraLetraM(type.name);
      btnType.appendChild(txtTypePok);

      // Pokémons list types Mobile

      let itemTypeMobile = document.createElement("li");
      typeAreaMobile.appendChild(itemTypeMobile);

      let btnTypeMobile = document.createElement("button");
      btnTypeMobile.classList = `type-filter ${type.name}`;
      btnTypeMobile.setAttribute("code-type", index + 1);
      itemTypeMobile.appendChild(btnTypeMobile);

      let iconTypeMobile = document.createElement("div");
      iconTypeMobile.classList = `icon`;
      btnTypeMobile.appendChild(iconTypeMobile);

      let imgTypeSrcMobile = document.createElement("img");
      imgTypeSrcMobile.setAttribute("src", `img/icon-types/${type.name}.svg`);
      iconTypeMobile.appendChild(imgTypeSrcMobile);

      let txtTypePokMobile = document.createElement("span");
      txtTypePokMobile.textContent = primeiraLetraM(type.name);
      btnTypeMobile.appendChild(txtTypePokMobile);

      const allTypes = document.querySelectorAll(".type-filter");

      allTypes.forEach((btn) => {
        btn.addEventListener("click", filterByTypes);
      });
    }
  });
});

// Carregar mais

const btnCarregarMais = document.querySelector("#js-btn-load-more");

let countPagination = 10;

function garregarPAookemon() {
  listingPokemons(
    `https://pokeapi.co/api/v2/pokemon?limit=9&offset=${countPagination}`
  );

  countPagination = countPagination + 9;
}

btnCarregarMais.addEventListener("click", garregarPAookemon);

// filtrar pokemon por tipo

function filterByTypes() {
  let codeTypePok = this.getAttribute("code-type");

  let countPokemon = document.getElementById("js-count-pokemons");
  const areaPokemons = document.getElementById("js-list-pokemons");
  const btnCarregarMais = document.querySelector("#js-btn-load-more");
  const allTypes = document.querySelectorAll(".type-filter");

  areaPokemons.innerHTML = "";
  btnCarregarMais.style.display = "none";

  const sectionPokemons = document.querySelector(".s-all-info-pokemons");
  const topSection = sectionPokemons.offsetTop;

  window.scrollTo({
    top: topSection + 288,
    behavior: "smooth",
  });
  allTypes.forEach((type) => {
    type.classList.remove("active");
  });

  this.classList.add("active");
  if (codeTypePok) {
    axios({
      method: "GET",
      url: `https://pokeapi.co/api/v2/type/${codeTypePok}`,
    }).then((response) => {
      let { pokemon } = response.data;
      countPokemon.textContent = pokemon.length;

      pokemon.forEach((pok) => {
        const { url } = pok.pokemon;

        axios({
          method: "GET",
          url: `${url}`,
        }).then((response) => {
          const { name, id, sprites, types } = response.data;

          const infoCard = {
            nome: name,
            code: id,
            image: sprites.other.home.front_default,
            type: types[0].type.name,
          };

          if (infoCard.image) {
            creatCardPokemon(
              infoCard.code,
              infoCard.type,
              infoCard.nome,
              infoCard.image
            );
          }

          const cardPokemon = document.querySelectorAll(
            ".js-open-details-pokemon"
          );

          cardPokemon.forEach((card) => {
            card.addEventListener("click", openDetailsPokemon);
          });
        });
      });
    });
  } else {
    areaPokemons.innerHTML = "";
    listingPokemons("https://pokeapi.co/api/v2/pokemon?limit=9&offset=0");
    btnCarregarMais.style.display = "block";
  }
}

// Pesquisando Pokémons

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
}
