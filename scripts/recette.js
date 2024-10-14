function createCard(){
  const article = document.createElement('article');
  //article.setAttribute('class', 'restaurant');  //ajout de la classe 
  article.innerHTML= `
    <div>
      <img src="./images/${this.image}" alt="Image de la recette"/>
    </div>
    <div class="infos">
      <h1>${this.name}</h1>
      <h3>RECETTE</h3>
      <p>${this.description}</p>
    </div>
    <div class="ingredients-infos">
      
    </div>
  `
  return article;
}

export const createRecette = (recette) => {
  const {id, image, name, description } = recette;

  return{
    id: id,
    image: image,
    name: name, 
    description: description,
    createCard: createCard
  }
}