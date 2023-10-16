export function photographerTemplate(data) {
  const { name, portrait, city, country, tagline, price,id } = data;

  const picture = `./FishEye_Photos/Sample Photos/Photographers ID Photos/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.setAttribute("alt", name);
    const h2 = document.createElement("h2");
    h2.textContent = name;

    const location = document.createElement("span");
    location.classList.add("location");
    location.textContent = `${city}, ${country}`;

    const tagliney = document.createElement("span");
    tagliney.classList.add("tagline");
    tagliney.textContent = `${tagline}`;

    const pricey = document.createElement("span");
    pricey.classList.add("price");
    pricey.textContent = `${price}€/jour`;

    const link = document.createElement("a");
    link.setAttribute("href", `photographer.html?id=${id}&name=${name}`);

    article.appendChild(link);
    link.appendChild(img);
    link.appendChild(h2);
    article.appendChild(location);
    article.appendChild(tagliney);
    article.appendChild(pricey);

    return article;
  }
  return {  getUserCardDOM };
}
