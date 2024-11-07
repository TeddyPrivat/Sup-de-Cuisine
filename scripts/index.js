import { createRecette, truncateTextByHeight } from "./recette.js";

const url = 'https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json'

let recettes = [];

function getData() {
  return fetch(url)
      .then( response => response.json() )
      .then( data => {
        recettes = data; 
        return recettes;
      })
      .catch( error => error );
};

getData().then( 
  (recettes) => {
    console.log(recettes);
  }
);
//Tout ceci nous permet de recupérer nos recettes

function displayRecettes(recettes) {
  const recettesContainer = document.getElementById('recettes');
  const nbResults = document.getElementById('nbResults');
  recettesContainer.innerHTML = "";  // Vider l'affichage précédent
  if(recettes.length === 0){
    const noResultMessage = document.createElement('h3');
    noResultMessage.style.fontFamily = "'Protest Strike', sans-serif";
    noResultMessage.textContent = "Aucune recette à afficher";
    recettesContainer.appendChild(noResultMessage);
    nbResults.textContent = ""
  }else{
    if(recettes.length === 1){
      nbResults.textContent = recettes.length + " recette";
    }else{
      nbResults.textContent = recettes.length + " recettes";
    }
    recettes.forEach(recette => {
      const cardElement = createRecette(recette).createCard();
      recettesContainer.append(cardElement);

      // Troncature de la description
      const descriptionElement = cardElement.querySelector('.infos-recette');
      truncateTextByHeight(descriptionElement, 72);
    });
  }
  
}

function filterRecettes(recettes, searchTerm) {
  return recettes.filter(recette => {
    // Vérifie si le terme de recherche est dans le nom ou les ingrédients de la recette
    const nameMatch = recette.name.toLowerCase().includes(searchTerm);
    const ingredientsMatch = recette.ingredients.some(ingredient =>
      ingredient.ingredient.toLowerCase().includes(searchTerm)
    );
    return nameMatch || ingredientsMatch;
  });
}

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout); 
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}


const handleSearch = debounce(() => {
  const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
  const filteredRecettes = filterRecettes(recettes, searchTerm);
  displayRecettes(filteredRecettes);
}, 300);

getData().then(() => {
  displayRecettes(recettes); // Affiche les recettes au chargement
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener("keyup", handleSearch); // Utilise debounce sur la recherche
});