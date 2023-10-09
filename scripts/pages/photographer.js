const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const ogName = urlParams.get("name");

async function getPhotographers() {
  const response = await fetch("../../data/photographers.json");
  const data = await response.json();
  return data;
}

function getUserCard(photographer) {
  const { name, portrait, city, country, tagline } = photographer;
  const picture = `../../FishEye_Photos/Sample Photos/Photographers ID Photos/${portrait}`;

  const div = document.createElement("div");
  div.classList.add("photographerInfo");

  const img = document.createElement("img");
  img.setAttribute("src", picture);

  const h2 = document.createElement("h2");
  h2.textContent = name;

  const location = document.createElement("span");
  location.classList.add("location");
  location.textContent = `${city}, ${country}`;

  const tagliney = document.createElement("span");
  tagliney.classList.add("tagline");
  tagliney.textContent = `${tagline}`;

  div.appendChild(h2);
  div.appendChild(location);
  div.appendChild(tagliney);

  return { div, img };
}

function createPictureCard(mediaPhotographer) {
  const { id, photographerId, title, image, video, likes, date, price } =
    mediaPhotographer;

  const picture = `../../FishEye_Photos/Sample Photos/${ogName}/${image}`;

  const article = document.createElement("article");
  article.classList.add("pictureCard");


  const img = document.createElement("img");
  img.setAttribute("src", picture);
  img.setAttribute("alt", title);

  let mediaElement;
  if (video) {
    mediaElement = document.createElement("video");
    mediaElement.setAttribute(
      "src",
      `../../FishEye_Photos/Sample Photos/${ogName}/${video}`
    );
    mediaElement.setAttribute("alt", title);
    mediaElement.classList.add("mediaElement");

  } else {
    mediaElement = document.createElement("img");
    mediaElement.setAttribute(
      "src",
      `../../FishEye_Photos/Sample Photos/${ogName}/${image}`
    );
    mediaElement.setAttribute("alt", title);
    mediaElement.classList.add("mediaElement");
  }

  const mediaContainer = document.createElement("div");
    mediaContainer.classList.add("mediaContainer");

  const div = document.createElement("div");
  div.classList.add("pictureInfo");

  const pictureTitle = document.createElement("span");
  pictureTitle.classList.add("pictureTitle");
  pictureTitle.textContent = title;

  const likesSection = document.createElement("div");
  likesSection.classList.add("likesSection");

  const likesNumber = document.createElement("span");
  likesNumber.classList.add("likesNumber");
  likesNumber.textContent = likes;

  const like = document.createElement("img");
  like.classList.add("like");
  like.setAttribute("src", "../../assets/icons/heart.svg");

  article.appendChild(mediaContainer);
  mediaContainer.appendChild(mediaElement);
  article.appendChild(div);
  div.appendChild(pictureTitle);
  div.appendChild(likesSection);
  likesSection.appendChild(likesNumber);
  likesSection.appendChild(like);

  return article;
}

function sortPopular(mediaPhotographer) {
  mediaPhotographer.sort((a, b) => b.likes - a.likes);
  return mediaPhotographer;
}

function sortDate(mediaPhotographer) {
  mediaPhotographer.sort((a, b) => new Date(b.date) - new Date(a.date));
  return mediaPhotographer;
}
function sortTitle(mediaPhotographer) {
    mediaPhotographer.sort((a, b) => a.title.localeCompare(b.title));
    return mediaPhotographer;
    }

async function init() {
  const photographerHeader = document.querySelector(".photograph-header");
  const pictureStack = document.querySelector(".pictures-stack");

  const { photographers, media } = await getPhotographers();
  const photographer = photographers.find(
    (photographer) => photographer.id == id
  );
  photographerHeader.appendChild(getUserCard(photographer).div);
  photographerHeader.appendChild(getUserCard(photographer).img);

  const mediaPhotographer = media.filter((media) => media.photographerId == id);

  const dropdown = document.querySelector(".dropdown");
dropdown.addEventListener("change", () => {
    const value = dropdown.value;  

    if (value === "Popularité") {
        sortPopular(mediaPhotographer);} 
        else if (value === "Date") {
        sortDate(mediaPhotographer);
        } else if (value === "Titre") {
        sortTitle(mediaPhotographer);
        }
    });


  mediaPhotographer.forEach((media) => {
    pictureStack.appendChild(createPictureCard(media));
  });
}

init();
