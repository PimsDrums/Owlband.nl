// hier stoan de kiekes
const photos = [
  {
    image: "assets/owlband-forest.png",
    position: "center 62%",
    caption: "OWLBAND together",
    theme: {
      heroBg: "#d9ddc2",
      carouselFrame: "#697059"
    }
  },
  {
    image: "assets/owlband-studio-guitar.png",
    position: "60% center",
    caption: "In the studio / Guitar",
    theme: {
      heroBg: "#e7d6b7",
      carouselFrame: "#8d7357"
    }
  },
  {
    image: "assets/owlband-studio-drums.png",
    position: "center",
    caption: "In the studio / Drums",
    theme: {
      heroBg: "#e2c6ba",
      carouselFrame: "#8a4b3e"
    }
  },
  {
    image: "assets/owlband-studio-session.png",
    position: "center",
    caption: "In the studio / Session",
    theme: {
      heroBg: "#ded2c5",
      carouselFrame: "#5b5048"
    }
  },
  {
    image: "assets/owlband-studio-keys.png",
    position: "center",
    caption: "In the studio / Keys",
    theme: {
      heroBg: "#e5d2ad",
      carouselFrame: "#8a6948"
    }
  }
];

const slidesContainer = document.querySelector(".kiekes");
const dotsContainer = document.querySelector(".kiekes-puntjes");
const caption = document.querySelector(".kiekes-praot");
const carousel = document.querySelector(".boxske");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const autoplayDelay = 5500;
let currentPhoto = 0;
let touchStartX = 0;
let autoplayTimer;

// kiekes en puntjes maken
photos.forEach((photo, index) => {
  const slide = document.createElement("figure");
  slide.className = `kiek${index === 0 ? " is-an-de-beurt" : ""}`;
  slide.setAttribute("aria-roledescription", "slide");
  slide.setAttribute("aria-label", `${index + 1} of ${photos.length}`);
  slide.setAttribute("aria-hidden", index === 0 ? "false" : "true");
  slide.innerHTML = `<img src="${photo.image}" alt="OWLBAND band photo ${index + 1}" style="object-position:${photo.position}" ${index === 0 ? "" : "loading=\"lazy\""}>`;
  slidesContainer.appendChild(slide);

  const dot = document.createElement("button");
  dot.className = `puntje${index === 0 ? " is-an-de-beurt" : ""}`;
  dot.type = "button";
  dot.setAttribute("aria-label", `Show photo ${index + 1}`);
  dot.setAttribute("aria-current", index === 0 ? "true" : "false");
  dot.addEventListener("click", () => showPhoto(index));
  dotsContainer.appendChild(dot);
});

document.querySelector(".ons-kiekske").src = photos[0].image;

// ander kiek laten zien
function showPhoto(nextIndex, restartTimer = true) {
  const slides = [...document.querySelectorAll(".kiek")];
  const dots = [...document.querySelectorAll(".puntje")];

  slides[currentPhoto].classList.remove("is-an-de-beurt");
  slides[currentPhoto].setAttribute("aria-hidden", "true");
  dots[currentPhoto].classList.remove("is-an-de-beurt");
  dots[currentPhoto].setAttribute("aria-current", "false");

  currentPhoto = (nextIndex + photos.length) % photos.length;

  slides[currentPhoto].classList.add("is-an-de-beurt");
  slides[currentPhoto].setAttribute("aria-hidden", "false");
  dots[currentPhoto].classList.add("is-an-de-beurt");
  dots[currentPhoto].setAttribute("aria-current", "true");
  caption.textContent = photos[currentPhoto].caption;
  applyPhotoTheme(currentPhoto);

  if (restartTimer) startAutoplay();
}

// kleure mee veranderen
function applyPhotoTheme(index) {
  const theme = photos[index].theme;
  const root = document.documentElement;

  root.style.setProperty("--hero-bg", theme.heroBg);
  root.style.setProperty("--carousel-frame", theme.carouselFrame);
}

// vanzelf durgaon
function startAutoplay() {
  clearTimeout(autoplayTimer);
  if (reduceMotion || document.hidden) return;

  autoplayTimer = setTimeout(() => {
    showPhoto(currentPhoto + 1, false);
    startAutoplay();
  }, autoplayDelay);
}

// de knupkes
document.querySelector(".vurige").addEventListener("click", () => showPhoto(currentPhoto - 1));
document.querySelector(".volgende").addEventListener("click", () => showPhoto(currentPhoto + 1));

carousel.addEventListener("mouseenter", () => clearTimeout(autoplayTimer));
carousel.addEventListener("mouseleave", startAutoplay);

// vegen op telefoon
carousel.addEventListener("touchstart", event => {
  clearTimeout(autoplayTimer);
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

carousel.addEventListener("touchend", event => {
  const distance = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(distance) > 50) {
    showPhoto(currentPhoto + (distance < 0 ? 1 : -1));
  } else {
    startAutoplay();
  }
}, { passive: true });

// pijlkes op toetsenbord
document.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") showPhoto(currentPhoto - 1);
  if (event.key === "ArrowRight") showPhoto(currentPhoto + 1);
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) clearTimeout(autoplayTimer);
  else startAutoplay();
});

// joar onderin
document.querySelector("#year").textContent = new Date().getFullYear();
applyPhotoTheme(0);
startAutoplay();
