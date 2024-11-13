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
getData().then(recettes => {
  ustensils = getUniqueUstensils(recettes); // Extraire les ustensiles uniques
  console.log(ustensils);
  populateUstensilsList(ustensils); // Afficher la liste d'ustensiles dans la dropbox

  appliances = getUniqueAppliance(recettes);
  console.log(appliances);
  populateAppliancesList(appliances);
  const dropdownButtonAppliances = document.querySelector('.dropdown_button_appliances');
  const dropdownButtonUstensils = document.querySelector('.dropdown_button_ustensils');
  const ustensilsList = document.getElementById('dropdown_ustensils');
  const appliancesList = document.getElementById('dropdown_appliances');
  // Par défaut, on cache la liste des ustensiles
  ustensilsList.style.display = 'none';
  ustensilsList.style.listStyle= 'none'

  
  appliancesList.style.display = 'none';
  appliancesList.style.listStyle= 'none'
  
  dropdownButtonAppliances.addEventListener('click', () => {
    // Si la liste est déjà visible, la masquer, sinon l'afficher
    appliancesList.style.display = appliancesList.style.display === 'none' ? 'block' : 'none';
  });

  
  dropdownButtonUstensils.addEventListener('click', () => {
    // Si la liste est déjà visible, la masquer, sinon l'afficher
    ustensilsList.style.display = ustensilsList.style.display === 'none' ? 'block' : 'none';
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