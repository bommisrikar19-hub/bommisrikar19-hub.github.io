const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");

menuButton?.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");

  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation",
  );
});

document.querySelectorAll(".navigation a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document
  .querySelectorAll(".reveal")
  .forEach((element) => revealObserver.observe(element));

const numberObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const target = Number(element.dataset.count);
      const isDecimal = target % 1 !== 0;
      const started = performance.now();

      const update = (time) => {
        const progress = Math.min((time - started) / 1150, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;

        element.textContent = isDecimal ? value.toFixed(1) : Math.round(value);

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
      numberObserver.unobserve(element);
    });
  },
  { threshold: 0.8 },
);

document
  .querySelectorAll("[data-count]")
  .forEach((element) => numberObserver.observe(element));

const glow = document.querySelector(".cursor-glow");

window.addEventListener("pointermove", (event) => {
  if (glow && event.pointerType !== "touch") {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }
});

document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;

    const bounds = card.getBoundingClientRect();

    const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5;

    const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -5;

    card.style.transform = `
      perspective(900px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-4px)
    `;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();
