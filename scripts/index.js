import { createRecette } from "./recette.js";

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

getData().then(
  (recettes) => {
    const recettesContainer = document.getElementById('recettes');
    const recettesLength = recettes.length;
    for(let i = 0; i < recettesLength ; i++){
      const recette = createRecette(recettes[i]);
      recettesContainer.append(recette.createCard());
    }
  }
);

