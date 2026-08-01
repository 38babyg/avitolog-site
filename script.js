document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("site-nav");

  const setHeaderScrolled = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 4);
  };

  setHeaderScrolled();
  window.addEventListener("scroll", setHeaderScrolled, { passive: true });

  const closeNav = () => {
    burger?.classList.remove("is-open");
    nav?.classList.remove("is-open");
    burger?.setAttribute("aria-expanded", "false");
  };

  burger?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("is-open");
    burger.classList.toggle("is-open", isOpen);
    burger.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  nav?.querySelectorAll(".nav-link, .nav-telegram").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeNav();
  });

  const footerYear = document.getElementById("footer-year");
  if (footerYear) footerYear.textContent = new Date().getFullYear().toString();

  initLightbox();
});

function initLightbox() {
  const items = Array.from(document.querySelectorAll(".gallery-item"));
  if (!items.length) return;

  const lightbox = document.getElementById("lightbox");
  const imgEl = lightbox.querySelector(".lightbox__img");
  const captionEl = lightbox.querySelector(".lightbox__caption");
  const prevBtn = lightbox.querySelector(".lightbox__nav--prev");
  const nextBtn = lightbox.querySelector(".lightbox__nav--next");

  let currentGroup = [];
  let currentIndex = 0;

  const render = () => {
    const item = currentGroup[currentIndex];
    imgEl.src = item.dataset.full || item.querySelector("img").src;
    imgEl.alt = item.dataset.caption || "";
    captionEl.textContent = item.dataset.caption || "";
    const multiple = currentGroup.length > 1;
    prevBtn.style.display = multiple ? "flex" : "none";
    nextBtn.style.display = multiple ? "flex" : "none";
  };

  const open = (item) => {
    const group = item.dataset.group || "default";
    currentGroup = items.filter((el) => (el.dataset.group || "default") === group);
    currentIndex = currentGroup.indexOf(item);
    render();
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  const step = (delta) => {
    currentIndex = (currentIndex + delta + currentGroup.length) % currentGroup.length;
    render();
  };

  items.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      open(item);
    });
  });

  lightbox.querySelector(".lightbox__close").addEventListener("click", close);
  prevBtn.addEventListener("click", () => step(-1));
  nextBtn.addEventListener("click", () => step(1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
}
