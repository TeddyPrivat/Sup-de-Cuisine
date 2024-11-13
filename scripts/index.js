import { createRecette, truncateTextByHeight } from "./recette.js";

const url = 'https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json'

let recettes = [];
let activeTags = [];
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

function populateIngredientsList(ingredientsArray) {
  const ingredientsList = document.getElementById('dropdown_ingredients');
  
  // Créer une barre de recherche pour filtrer les ingrédients
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Recherchez un ingrédient...';
  searchInput.className = 'search-bar'; // Utilisation correcte de `className`

  // Ajouter la barre de recherche au début de la liste
  ingredientsList.appendChild(searchInput);

  // Fonction pour filtrer les éléments de la liste en fonction de la recherche
  function filterList() {
    const query = searchInput.value.toLowerCase();
    ingredientsList.querySelectorAll('.ingredient-item').forEach(item => {
      const ingredientName = item.textContent.toLowerCase();
      item.style.display = ingredientName.includes(query) ? 'block' : 'none';
    });
  }

  // Écouteur pour filtrer la liste en temps réel
  searchInput.addEventListener('input', filterList);

  // Créer les éléments <li> pour chaque ingrédient
  ingredientsArray.forEach(ingredient => {
    const item = document.createElement('li');
    item.textContent = ingredient;
    item.className = 'ingredient-item'; // Classe pour styliser chaque ingrédient
    
    // Ajouter un événement pour gérer la sélection d'un ingrédient
    item.addEventListener('click', () => {
      console.log(`Ingrédient sélectionné : ${ingredient}`);
      addTag(ingredient); // Appelle la fonction pour ajouter un tag si nécessaire
    });

    // Ajouter chaque <li> à la liste des ingrédients
    ingredientsList.appendChild(item);
  });
}

function populateAppliancesList(applianceArray) {
  const applianceList = document.getElementById('dropdown_appliances'); 
  
  applianceArray.forEach(appliance => {
    // Créer un élément <li> pour chaque appareil
    const item = document.createElement('li');
    item.textContent = appliance;
    item.className = 'appliance-item';  // Ajouter une classe CSS pour le style si nécessaire

    // Ajouter un événement pour gérer la sélection d'un appareil si nécessaire
    item.addEventListener('click', () => {
      console.log(`Appareil sélectionné : ${appliance}`);
      // Vous pouvez ajouter ici une action de filtrage ou de sélection par appareil
    });

    // Ajouter l'élément <li> à la liste
    applianceList.appendChild(item);
  });
}


function populateUstensilsList(ustensilArray) {
  const ustensilsList = document.getElementById('dropdown_ustensils');
  ustensilArray.forEach(ustensil => {
    // Créer un élément <li> pour chaque ustensile
    const item = document.createElement('li');
    item.textContent = ustensil;
    item.className = 'ustensil-item';  // Ajouter une classe CSS pour le style si nécessaire
    
    // Ajouter un événement pour gérer la sélection d'un ustensile (par exemple, cliquer sur un élément)
    item.addEventListener('click', () => {
      console.log(`Ustensile sélectionné : ${ustensil}`);
      // Vous pouvez ajouter ici une action de filtrage ou de sélection par ustensile si nécessaire
    });

    // Ajouter l'élément <li> à la liste
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

  ustensils = getUniqueUstensils(recettes); // Extraire les ustensiles uniques
  console.log(ustensils);
  populateUstensilsList(ustensils); // Afficher la liste d'ustensiles dans la dropbox

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
    // Si la liste est déjà visible, la masquer, sinon l'afficher
    appliancesList.style.display = appliancesList.style.display === 'none' ? 'block' : 'none';
  });

  
  dropdownButtonUstensils.addEventListener('click', () => {
    // Si la liste est déjà visible, la masquer, sinon l'afficher
    ustensilsList.style.display = ustensilsList.style.display === 'none' ? 'block' : 'none';
  });

  dropdownButtonIngredients.addEventListener('click', () => {
    // Si la liste est déjà visible, la masquer, sinon l'afficher
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

      // Troncature de la description
      const descriptionElement = cardElement.querySelector('.infos-recette');
      truncateTextByHeight(descriptionElement, 72);
    });
  }
  
}

function filterRecettes(recettes, searchTerm) {
  return recettes.filter(recette => {
    // Vérifie si le terme de recherche est dans le nom ou les ingrédients de la recette
    const descriptionRecette = recette.description.toLowerCase().includes(searchTerm.toLowerCase());
    const nameMatch = recette.name.toLowerCase().includes(searchTerm);
    const ingredientsMatch = recette.ingredients.some(ingredient =>
      ingredient.ingredient.toLowerCase().includes(searchTerm)
    );
    
    return nameMatch || ingredientsMatch || descriptionRecette;
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
  if(searchTerm.length >= 3){
    const filteredRecettes = filterRecettes(recettes, searchTerm);
    displayRecettes(filteredRecettes);
  }else{
    displayRecettes(recettes);
  }
}, 300);

getData().then(() => {
  displayRecettes(recettes); // Affiche les recettes au chargement
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener("keyup", handleSearch); // Utilise debounce sur la recherche
});