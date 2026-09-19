const menuBtn = document.querySelector('#menuBtn');
const mobileMenu = document.querySelector('#mobileMenu');
const year = document.querySelector('#year');
const themeToggles = document.querySelectorAll('#themeToggle, #mobileThemeToggle');
const projectTrack = document.querySelector('#projectTrack');
const projectCards = document.querySelectorAll('.project-card');
const prevProject = document.querySelector('#prevProject');
const nextProject = document.querySelector('#nextProject');
const carouselStatus = document.querySelector('#carouselStatus');

year.textContent = new Date().getFullYear();

const closeMobileMenu = () => {
  mobileMenu?.classList.add('hidden');
  mobileMenu?.classList.remove('flex');
  menuBtn?.classList.remove('active');
  menuBtn?.setAttribute('aria-expanded', 'false');
  menuBtn?.setAttribute('aria-label', 'Buka Menu');
};

menuBtn?.addEventListener('click', (event) => {
  event.stopPropagation();
  const isClosed = mobileMenu.classList.contains('hidden');
  mobileMenu.classList.toggle('hidden');
  mobileMenu.classList.toggle('flex');
  menuBtn.setAttribute('aria-expanded', isClosed);
  menuBtn.setAttribute('aria-label', isClosed ? 'Tutup Menu' : 'Buka Menu');
  menuBtn.classList.toggle('active');
});

mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

document.addEventListener('click', (event) => {
  if (!mobileMenu?.classList.contains('hidden') && !mobileMenu.contains(event.target) && !menuBtn.contains(event.target)) {
    closeMobileMenu();
  }
});

const setTheme = (isDark) => {
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggles.forEach(toggle => {
    toggle.setAttribute('aria-pressed', isDark);
    toggle.setAttribute('aria-label', isDark ? 'Aktifkan light mode' : 'Aktifkan dark mode');
    const icon = toggle.querySelector('.theme-icon');
    if (icon) icon.innerHTML = isDark ? '&#9788;' : '&#9790;';
  });
};

setTheme(localStorage.getItem('theme') === 'dark');
themeToggles.forEach(toggle => toggle.addEventListener('click', () => {
  setTheme(!document.documentElement.classList.contains('dark'));
}));

let currentProject = 0;
const updateCarousel = () => {
  if (!projectTrack || !projectCards.length) return;
  const visibleProjects = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
  const maxProject = Math.max(0, projectCards.length - visibleProjects);
  currentProject = Math.min(currentProject, maxProject);
  const gap = 24;
  const cardWidth = projectCards[0].getBoundingClientRect().width + gap;
  projectTrack.style.transform = `translateX(-${currentProject * cardWidth}px)`;
  carouselStatus.textContent = `${currentProject + 1} / ${projectCards.length}`;
  prevProject.disabled = currentProject === 0;
  nextProject.disabled = currentProject === maxProject;
};

prevProject?.addEventListener('click', () => {
  currentProject = Math.max(0, currentProject - 1);
  updateCarousel();
});

nextProject?.addEventListener('click', () => {
  const visibleProjects = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
  const maxProject = Math.max(0, projectCards.length - visibleProjects);
  currentProject = Math.min(maxProject, currentProject + 1);
  updateCarousel();
});

window.addEventListener('resize', updateCarousel);
updateCarousel();

