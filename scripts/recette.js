function createCard(){
  const article = document.createElement('article');
  article.setAttribute('class', 'recette');  //ajout de la classe 
  const ingredientsHTML = createIngredientHTML(this.ingredients)
  article.innerHTML= 
  `
    <div>
      <img class="image-recette" src="images/${this.image}" alt="Image de la recette"/>
    </div>
    <div class="infos">
      <div class="infos-name">
        <h1>${this.name}</h1>
      </div>
      <h3 class="infos-title">RECETTE</h3>
      <p class="infos-recette">${this.description}</p>
      <div class="ingredients-infos">
        <h3 class="infos-title">INGRÉDIENTS</h3>
        <div class="ingredients">${ingredientsHTML} </div>
      </div>
    </div>
  `

  return article;
}


function createIngredientHTML(ingredients){
  let ingredientHtml = '';
  ingredients.forEach(ingredientO =>{
    const quantity = ingredientO.quantity ? ingredientO.quantity : '';
    const unit = ingredientO.unit ? ingredientO.unit : '';
    ingredientHtml += `
    <div class="ingredient">
      ${ingredientO.ingredient} 
      <div class="quantite-unite">
        ${quantity} ${unit}
      </div>
    </div>
    `; 
  })

  return ingredientHtml;
}
export function truncateTextByHeight(element, maxHeight) {

  let fullText = element.innerText;

  if (element.scrollHeight > maxHeight) {
    while (element.scrollHeight > maxHeight) {
      fullText = fullText.slice(0, -1); 
      element.innerText = fullText + '...'; 
    }
  }
}

const descriptions = document.querySelectorAll('.description');
descriptions.forEach((desc) => {
  truncateTextByHeight(desc, 72); 
});

export const createRecette = (recette) => {
  const {id, image, name, description, ingredients, appliance } = recette;

  return{
    id: id,
    image: image,
    name: name, 
    description: description,
    ingredients: ingredients,
    appliance: appliance,
    createCard: createCard
  }
}