const $ = (q, p = document) => p.querySelector(q);
const $$ = (q, p = document) => [...p.querySelectorAll(q)];

const navbar = $("#navbar");
const menuBtn = $("#menuBtn");
const navMenu = $("#navMenu");

function setNavbarState() {
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 10);
}

function closeMenu() {
  if (!navMenu || !menuBtn) return;
  navMenu.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
  if (!navMenu || !menuBtn) return;
  const open = navMenu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
}

/* Navbar blur on scroll */
window.addEventListener("scroll", setNavbarState);
setNavbarState();

/* Mobile menu */
if (menuBtn && navMenu) {
  menuBtn.addEventListener("click", toggleMenu);

  document.addEventListener("click", (e) => {
    if (!navMenu.classList.contains("open")) return;
    const inside = navMenu.contains(e.target) || menuBtn.contains(e.target);
    if (!inside) closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

/* Smooth scroll */
$$('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const target = $(id);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    closeMenu();
  });
});

/* Scroll reveal */
const revealSelectors = [
  ".hero-copy",
  ".hero-card",
  ".section-head",
  ".panel",
  ".card",
  ".t-item",
  ".skill",
  ".contact-card"
];

const revealEls = revealSelectors.flatMap(sel => $$(sel));
revealEls.forEach(el => el.classList.add("reveal"));

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

/* Active nav link */
const sections = $$("section[id]");
const navLinks = $$('.nav-links a[href^="#"]');

function setActiveLink() {
  let current = null;

  sections.forEach((sec) => {
    const r = sec.getBoundingClientRect();
    if (r.top <= window.innerHeight * 0.35 && r.bottom >= window.innerHeight * 0.35) {
      current = sec.id;
    }
  });

  navLinks.forEach((a) => {
    const href = a.getAttribute("href").slice(1);
    a.classList.toggle("active", href === current);
  });
}
window.addEventListener("scroll", setActiveLink);
setActiveLink();

/* Footer year */
const year = $("#year");
if (year) year.textContent = new Date().getFullYear();
