const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const ogName = urlParams.get("name");

// Retrieve data from the JSON file
async function getPhotographers() {
  const response = await fetch("./data/photographers.json");
  const data = await response.json();
  return data;
}
// CREATING THE USER CARD IN THE HEADER OF THE PAGE
function getUserCard(photographer) {
  const { name, portrait, city, country, tagline } = photographer;
  const picture = `./FishEye_Photos/Sample Photos/Photographers ID Photos/${portrait}`;

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
// CREATING THE PICTURE CARD FOR EACH INDIVIDUAL MEDIA ELEMENT
function createPictureCard(mediaPhotographer, counter) {
  const { title, image, video, likes } = mediaPhotographer;

  const article = document.createElement("article");
  article.classList.add("pictureCard");

  let mediaElement;
  let videomark = document.createElement("i");
  videomark.classList.add("fa-solid", "fa-video");
  videomark.setAttribute("style", "color: #801b0a;");

  if (video) {
    mediaElement = document.createElement("video");

    mediaElement.setAttribute(
      "src",
      `./FishEye_Photos/Sample Photos/${ogName}/${video}`
    );
    mediaElement.setAttribute("alt", title);
    mediaElement.classList.add("mediaElement");
    mediaElement.setAttribute("data-counter", counter);
  } else {
    mediaElement = document.createElement("img");
    mediaElement.setAttribute(
      "src",
      `./FishEye_Photos/Sample Photos/${ogName}/${image}`
    );
    mediaElement.setAttribute("alt", title);
    mediaElement.classList.add("mediaElement");
    mediaElement.setAttribute("data-counter", counter);
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
  like.setAttribute("src", "./assets/icons/heart.svg");

  const likeEmpty = document.createElement("img");
  likeEmpty.classList.add("likeEmpty");
  likeEmpty.setAttribute("src", "./assets/icons/heart empty.svg");

  article.appendChild(mediaContainer);
  mediaContainer.appendChild(mediaElement);
  if (video) {
    mediaContainer.appendChild(videomark);
  }
  article.appendChild(div);
  div.appendChild(pictureTitle);
  div.appendChild(likesSection);
  likesSection.appendChild(likesNumber);
  likesSection.appendChild(like);
  likesSection.appendChild(likeEmpty);

  return article;
}
//appending likes and rates to the bottom info sheet
function bottomInformation(photographer, totalLikes) {
  const { price } = photographer;

  const rate = document.createElement("p");
  rate.classList.add("rate");
  rate.textContent = `${price}€ / jour`;

  const totalLikesDom = document.createElement("p");
  totalLikesDom.classList.add("totalLikes");
  totalLikesDom.textContent = `${totalLikes} 🖤`;

  return { totalLikesDom, rate };
}
//SORTING FUNCTIONS FOR THE DROPDOWN MENU---------------------------------------------------------
function sortPopular(mediaPhotographer) {
  const arraySorted = mediaPhotographer.sort((a, b) => b.likes - a.likes);

  return arraySorted;
}
function sortDate(mediaPhotographer) {
  const arraySorted = mediaPhotographer.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  return arraySorted;
}
function sortTitle(mediaPhotographer) {
  const arraySorted = mediaPhotographer.sort((a, b) =>
    a.title.localeCompare(b.title)
  );
  return arraySorted;
} // END OF SORTING FUNCTIONS---------------------------------------------------------------------

async function init() {
  const photographerHeader = document.querySelector(".photograph-header");
  const pictureStack = document.querySelector(".pictures-stack");

  const { photographers, media } = await getPhotographers();
  const photographer = photographers.find(
    (photographer) => photographer.id == id
  );
  photographerHeader.appendChild(getUserCard(photographer).div);
  photographerHeader.appendChild(getUserCard(photographer).img);

  let mediaPhotographer = await media.filter(
    (media) => media.photographerId == id
  );

  mediaPhotographer = sortPopular(mediaPhotographer);
  let counter = 0;
  mediaPhotographer.forEach((media) => {
    counter++;
    pictureStack.appendChild(createPictureCard(media, counter));
  });

  let totalLikes = 0;
  mediaPhotographer.forEach((media) => {
    totalLikes += media.likes;
  });

  const bottomInfo = document.querySelector(".bottomInfo");
  let bottomInfoResult = bottomInformation(photographer, totalLikes);
  bottomInfo.appendChild(bottomInfoResult.totalLikesDom);
  bottomInfo.appendChild(bottomInfoResult.rate);

  const dropdown = document.querySelector(".dropdown");
  dropdown.addEventListener("change", () => {
    const value = dropdown.value;

    if (value === "Popularité") {
      mediaPhotographer = sortPopular(mediaPhotographer);
    } else if (value === "Date") {
      mediaPhotographer = sortDate(mediaPhotographer);
    } else if (value === "Titre") {
      mediaPhotographer = sortTitle(mediaPhotographer);
    }
    //clearing the element before adding the sorted elements
    pictureStack.innerHTML = "";
    let counter =0;

    mediaPhotographer.forEach((media) => {
      counter++;
      pictureStack.appendChild(createPictureCard(media, counter));
    });

    //LIGHTBOX reconstrucion after sorting---------------------------------------------------------------------------
    const allMediaElements = document.querySelectorAll(".mediaElement");
    allMediaElements.forEach((mediaElement) => {
      mediaElement.addEventListener("click", (e) => {
        console.log(e);
        lightboxContent(mediaPhotographer, e.target, allMediaElements);
      });
    });
  });

  //LIGHTBOX DISPLAY---------------------------------------------------------------------------
  const allMediaElements = document.querySelectorAll(".mediaElement");
  allMediaElements.forEach((mediaElement) => {
    mediaElement.addEventListener("click", (e) => {
      console.log(e);
      lightboxContent(mediaPhotographer, e.target);
    });
  });

  // LIKES LIVE COUNTER---------------------------------------------------------------------------
  let hearts = document.querySelectorAll(".like");
  let heartsEmpty = document.querySelectorAll(".likeEmpty");

  heartsEmpty.forEach((heartEmpty) => {
    heartEmpty.addEventListener("click", (e) => {
      let totalLikes = document.querySelector(".totalLikes");
      let totalLikesInt = parseInt(totalLikes.textContent);
      totalLikesInt++;
      totalLikes.textContent = `${totalLikesInt} 🖤`;
      let likesNumber = e.target.parentNode.querySelector(".likesNumber");
      let likes = parseInt(likesNumber.textContent);
      e.target.style.display = "none";
      e.target.parentNode.querySelector(".like").style.display = "block";
      likes++;
      likesNumber.textContent = likes;
    });
  });

  hearts.forEach((heart) => {
    heart.addEventListener("click", (e) => {
      let totalLikes = document.querySelector(".totalLikes");
      let totalLikesInt = parseInt(totalLikes.textContent);
      totalLikesInt--;
      totalLikes.textContent = `${totalLikesInt} 🖤`;
      let likesNumber = e.target.parentNode.querySelector(".likesNumber");
      let likes = parseInt(likesNumber.textContent);
      e.target.style.display = "none";
      e.target.parentNode.querySelector(".likeEmpty").style.display = "block";
      likes--;
      likesNumber.textContent = likes;
    });
  });

  //CONTACT FORM----------------------------------------------------------------------------------------------
  const contactForm = document.querySelector("#contact_modal");
  const contactFormBackground = document.querySelector("#contact_modal_background");
  const contactBtn = document.querySelector(".contact_button");
  const closeContact = document.querySelector(".close-contact-form");
  contactBtn.addEventListener("click", () => {
    contactFormBackground.style.display = "block";
  });
  closeContact.addEventListener("click", () => {
    contactFormBackground.style.display = "none";
  });
}
init();

function lightboxContent(mediaPhotographer, e) {
  const { title, image, video, price } = mediaPhotographer;

  let body = document.querySelector("body");
  let lightboxWrapper = document.querySelector(".lightbox-wrapper");
  let lightboxMedia = document.querySelector(".lightbox-media");
  let close = document.querySelector(".close");
  let next = document.querySelector(".next");
  let previous = document.querySelector(".prev");

  lightboxWrapper.style.display = "flex";
  body.style.overflow = "hidden"; // to prevent scrolling

  close.addEventListener("click", () => {
    lightboxWrapper.style.display = "none";
    lightboxMedia.innerHTML = "";
    body.style.overflow = "auto"; //  to re-enable scrolling
  });

  let media =
    e.tagName === "VIDEO"
      ? document.createElement("video")
      : document.createElement("img");
  media.setAttribute("src", e.src);
  media.setAttribute("alt", e.alt);

  if (e.tagName === "VIDEO") {
    media.setAttribute("controls", "controls");
    media.setAttribute("autoplay", "autoplay");
  }

  let titleMedia = document.createElement("p");
  titleMedia.textContent = e.alt;

  lightboxMedia.appendChild(media);
  lightboxMedia.appendChild(titleMedia);

  //next and previous buttons
  let counter = parseInt(e.dataset.counter);

  next.addEventListener("click", () => {
    counter++;
    if (counter > mediaPhotographer.length) {
      counter = 1;
    }
    let media = document.querySelector(
      `.mediaElement[data-counter="${counter}"]`
    );
    let clonedMedia = media.cloneNode(true);
    lightboxMedia.innerHTML = "";
    clonedMedia.setAttribute("autoplay", "autoplay");
    clonedMedia.setAttribute("controls", "controls");
    lightboxMedia.appendChild(clonedMedia);
    titleMedia.textContent = media.alt;
  });

  previous.addEventListener("click", () => {
    counter--;
    if (counter < 1) {
      counter = mediaPhotographer.length;
    }
    let media = document.querySelector(
      `.mediaElement[data-counter="${counter}"]`
    );
    let clonedMedia = media.cloneNode(true);
    lightboxMedia.innerHTML = "";
    clonedMedia.setAttribute("autoplay", "autoplay");
    clonedMedia.setAttribute("controls", "controls");
    lightboxMedia.appendChild(clonedMedia);
    titleMedia.textContent = media.alt;
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      next.click();
    } else if (event.key === "ArrowLeft") {
      previous.click();
    } else if (event.key === "Escape") {
      close.click();
    }
  });
}
