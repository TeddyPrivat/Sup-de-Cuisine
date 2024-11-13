import { createRecette, truncateTextByHeight } from "./recette.js";

const url = 'https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json'

let recettes = [];

//Ensemble de nos tags permettant de filtrer les recherches
let tagUsedFilters = [];

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

function getUniqueUstensils(recettes) {
  const ustensilsSet = new Set(); // Utilisation d'un Set : pas de doublons possibles

  recettes.forEach(recette => {
    recette.ustensils.forEach(ustensil => {
      ustensilsSet.add(ustensil.toLowerCase()); 
    });
  });

  return Array.from(ustensilsSet); // Convertit le Set en tableau
}

function getUniqueAppliance(recettes){
  const appliancesSet = new Set();

  recettes.forEach(recette => {
    if(recette.appliance){
      appliancesSet.add(recette.appliance.toLowerCase());
    }
  });
  return Array.from(appliancesSet);
}

function getUniqueIngredient(recettes){
  const ingredientsSet = new Set();

  recettes.forEach(recette => {
    if(recette.ingredients){
      recette.ingredients.forEach(ingredient => {
      ingredientsSet.add(ingredient.ingredient.toLowerCase());
      });
    }
  });
  return Array.from(ingredientsSet);
}

function applyFilters() {
  const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();

  // Vérifie si la recherche a au moins 3 caractères ou s'il y a des filtres appliqués
  if (searchTerm.length >= 3 || tagUsedFilters.length > 0) {
    const filteredRecettes = filterRecettes(recettes, searchTerm);
    displayRecettes(filteredRecettes);
  } else {
    displayRecettes(recettes);
  }
}

function addTag(tagText) {
  const tagsContainer = document.getElementById("tags");

  // On évite les doublons de tags
  if ([...tagsContainer.children].some(tag => tag.textContent.trim() === tagText)) return;

  const tag = document.createElement("div");
  tag.classList.add("tag");
  tag.innerHTML = `${tagText} <i class="fa fa-times"></i>`;
  tagUsedFilters.push(tagText);

  // Ajoute l'événement pour retirer le tag lorsqu'on clique sur la croix
  tag.querySelector("i").addEventListener("click", () => {
    tag.remove();
    tagUsedFilters = tagUsedFilters.filter(element => element !== tagText);
    applyFilters();
  });

  tagsContainer.appendChild(tag);
  applyFilters();
}

function populateIngredientsList(ingredientsArray) {
  const ingredientsList = document.getElementById('dropdown_ingredients');
  
  // Barre de recherche pour filtrer les ingrédients
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Poulet...';
  searchInput.className = 'search-bar'; 

  ingredientsList.appendChild(searchInput);

  // Fonction pour filtrer les éléments de la liste en fonction de la recherche
  function filterList() {
    const query = searchInput.value.toLowerCase();
    ingredientsList.querySelectorAll('.ingredient-item').forEach(item => {
      const ingredientName = item.textContent.toLowerCase();
      item.style.display = ingredientName.includes(query) ? 'block' : 'none';
    });
  }

  searchInput.addEventListener('input', filterList);

  ingredientsArray.forEach(ingredient => {
    const item = document.createElement('li');
    item.textContent = ingredient;
    item.className = 'ingredient-item'; 
    
    item.addEventListener('click', () => {
      addTag(ingredient);
    });
    ingredientsList.appendChild(item);
  });
}

function populateAppliancesList(applianceArray) {
  const applianceList = document.getElementById('dropdown_appliances'); 
  
  applianceArray.forEach(appliance => {
    const item = document.createElement('li');
    item.textContent = appliance;
    item.className = 'appliance-item';

    item.addEventListener('click', () => {
      addTag(appliance);
    });
    applianceList.appendChild(item);
  });
}


function populateUstensilsList(ustensilArray) {
  const ustensilsList = document.getElementById('dropdown_ustensils');
  ustensilArray.forEach(ustensil => {
    const item = document.createElement('li');
    item.textContent = ustensil;
    item.className = 'ustensil-item';
    
    item.addEventListener('click', () => {
      addTag(ustensil);
    });
    ustensilsList.appendChild(item);
  });
}


let ustensils = [];
let appliances = [];
let ingredients = [];
getData().then(recettes => {

  ingredients = getUniqueIngredient(recettes);
  console.log(ingredients);
  populateIngredientsList(ingredients);

  ustensils = getUniqueUstensils(recettes);
  console.log(ustensils);
  populateUstensilsList(ustensils);

  appliances = getUniqueAppliance(recettes);
  console.log(appliances);
  populateAppliancesList(appliances);

  const dropdownButtonAppliances = document.querySelector('.dropdown_button_appliances');
  const dropdownButtonUstensils = document.querySelector('.dropdown_button_ustensils');
  const dropdownButtonIngredients = document.querySelector('.dropdown_button_ingredients')

  const ustensilsList = document.getElementById('dropdown_ustensils');
  const appliancesList = document.getElementById('dropdown_appliances');
  const ingredientsList = document.getElementById('dropdown_ingredients')

  // Par défaut, on cache la liste des ustensiles
  ustensilsList.style.display = 'none';
  ustensilsList.style.listStyle = 'none';
  
  appliancesList.style.display = 'none';
  appliancesList.style.listStyle = 'none';

  ingredientsList.style.display = 'none';
  ingredientsList.style.listStyle = 'none';
  
  dropdownButtonAppliances.addEventListener('click', () => {
    // Au click : si la liste est déjà visible, la masquer, sinon l'afficher
    appliancesList.style.display = appliancesList.style.display === 'none' ? 'block' : 'none';
  });

  
  dropdownButtonUstensils.addEventListener('click', () => {
    ustensilsList.style.display = ustensilsList.style.display === 'none' ? 'block' : 'none';
  });

  dropdownButtonIngredients.addEventListener('click', () => {
    ingredientsList.style.display = ingredientsList.style.display === 'none' ? 'block' : 'none';
  });
});

function displayRecettes(recettes) {

  const recettesContainer = document.getElementById('recettes');
  const nbResults = document.getElementById('nbResults');
  recettesContainer.innerHTML = "";  

  if(recettes.length === 0){
    const noResultMessage = document.createElement('h3');
    noResultMessage.style.fontFamily = "'Protest Strike', sans-serif";
    noResultMessage.textContent = "Aucune recette ne contient " + searchInput.value + " essayez plutôt 'tarte aux pommes'";
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

      // Troncature de la description, ajout des 3 petits points
      const descriptionElement = cardElement.querySelector('.infos-recette');
      truncateTextByHeight(descriptionElement, 72);
    });
  }
}

function filterRecettes(recettes, searchTerm) {
  return recettes.filter(recette => {

    // Vérifie le terme de recherche dans le nom de la recette, les ingrédients ou la description
    const descriptionRecette = recette.description.toLowerCase().includes(searchTerm);
    const nameMatch = recette.name.toLowerCase().includes(searchTerm);
    const ingredientsMatch = recette.ingredients.some(ingredient =>
      ingredient.ingredient.toLowerCase().includes(searchTerm)
    );

    const tagsMatch = tagUsedFilters.every(tag => {
      const tagLower = tag.toLowerCase();

      // Vérifie si le tag est dans les ingrédients, appareils ou ustensiles
      const isIngredient = recette.ingredients.some(ingredient => ingredient.ingredient.toLowerCase() === tagLower);
      const isAppliance = recette.appliance && recette.appliance.toLowerCase() === tagLower;
      const isUstensil = recette.ustensils.some(ustensil => ustensil.toLowerCase() === tagLower);

      return isIngredient || isAppliance || isUstensil;
    });
    // Retourne vrai si le terme de recherche correspond et que tous les tags sont présents
    return (nameMatch || ingredientsMatch || descriptionRecette) && tagsMatch;
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
  applyFilters();
}, 300);



getData().then(() => {
  displayRecettes(recettes); // Affiche les recettes au chargement
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener("keyup", handleSearch);
});