import { createRecette, truncateTextByHeight } from "./recette.js";

const url = 'https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json'

function getData() {
  return fetch(url)
      .then( response => response.json() )
      .then( recettes => recettes )
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
  recettesContainer.innerHTML = "";  // Vider l'affichage précédent

  recettes.forEach(recette => {
    const cardElement = createRecette(recette).createCard();
    recettesContainer.append(cardElement);

    // Troncature de la description
    const descriptionElement = cardElement.querySelector('.infos-recette');
    truncateTextByHeight(descriptionElement, 72);
  });
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


getData().then(
  (recettes) => {
    displayRecettes(recettes);
      
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener("keyup", () => {
      const searchTerm = searchInput.value.trim().toLowerCase();
      const filteredRecettes = filterRecettes(recettes, searchTerm);  
      displayRecettes(filteredRecettes);  
      });
    }
  );