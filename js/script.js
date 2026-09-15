/* ==========================================================
   TECHONE — script.js
   ========================================================== */

/* ==================== CONFIGURAÇÃO CENTRAL ==================== */
const TECHONE_CONFIG = {
  whatsapp: "5581991043219",          // usado em todos os botões de orçamento
  whatsappSecondary: "5581986994650", // linha extra, exibida no rodapé e contato
  instagram: "",  // Ex: "https://instagram.com/techone"
  email: "",      // Ex: "contato@techone.com.br"
  location: "Recife - PE"
};

document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  initHeaderScroll();
  initMobileMenu();
  initActiveNav();
  initRevealOnScroll();
  initWhatsappButtons();
  initContactForm();
  initHero3D();
});

/* ==================== CONFIG APPLY ==================== */
function buildWhatsappLink(message, number) {
  const base = "https://wa.me/";
  const target = number || TECHONE_CONFIG.whatsapp || "";
  const text = encodeURIComponent(message || "Olá, TechOne! Gostaria de solicitar um orçamento.");
  return target ? `${base}${target}?text=${text}` : "#contato";
}

function formatPhoneDisplay(number) {
  // 55 81 991043219 -> +55 (81) 99104-3219
  const digits = (number || "").replace(/\D/g, "");
  const match = digits.match(/^55(\d{2})(\d{4,5})(\d{4})$/);
  if (!match) return number || "";
  return `+55 (${match[1]}) ${match[2]}-${match[3]}`;
}

function applyConfig() {
  const locationEl = document.getElementById("meta-location");
  if (locationEl) locationEl.textContent = TECHONE_CONFIG.location || "";

  const waFooter = document.getElementById("footer-whatsapp");
  if (waFooter) waFooter.href = buildWhatsappLink();

  const waFooter2 = document.getElementById("footer-whatsapp-2");
  if (waFooter2) {
    if (TECHONE_CONFIG.whatsappSecondary) {
      waFooter2.href = buildWhatsappLink(null, TECHONE_CONFIG.whatsappSecondary);
    } else {
      waFooter2.closest("li")?.remove();
    }
  }

  const waMeta1 = document.getElementById("meta-whatsapp-1");
  if (waMeta1 && TECHONE_CONFIG.whatsapp) {
    waMeta1.href = buildWhatsappLink();
    waMeta1.textContent = formatPhoneDisplay(TECHONE_CONFIG.whatsapp);
  } else if (waMeta1) {
    waMeta1.closest("p")?.remove();
  }

  const waMeta2 = document.getElementById("meta-whatsapp-2");
  if (waMeta2 && TECHONE_CONFIG.whatsappSecondary) {
    waMeta2.href = buildWhatsappLink(null, TECHONE_CONFIG.whatsappSecondary);
    waMeta2.textContent = formatPhoneDisplay(TECHONE_CONFIG.whatsappSecondary);
  } else if (waMeta2) {
    waMeta2.closest("p")?.remove();
  }

  const igFooter = document.getElementById("footer-instagram");
  if (igFooter) igFooter.href = TECHONE_CONFIG.instagram || "#";

  const emailFooter = document.getElementById("footer-email");
  if (emailFooter && TECHONE_CONFIG.email) {
    emailFooter.href = `mailto:${TECHONE_CONFIG.email}`;
  }

  const fab = document.getElementById("whatsapp-fab");
  if (fab) fab.href = buildWhatsappLink();
}

/* ==================== HEADER SCROLL ==================== */
function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ==================== MOBILE MENU ==================== */
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("mobile-menu");
  if (!hamburger || !menu) return;

  const closeMenu = () => {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  const openMenu = () => {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  hamburger.addEventListener("click", () => {
    const isOpen = menu.classList.contains("is-open");
    isOpen ? closeMenu() : openMenu();
  });

  menu.querySelectorAll("[data-nav-mobile]").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

/* ==================== ACTIVE NAV ON SCROLL ==================== */
function initActiveNav() {
  const links = Array.from(document.querySelectorAll("[data-nav]"));
  if (!links.length) return;
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!("IntersectionObserver" in window) || !sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = `#${entry.target.id}`;
          links.forEach((l) =>
            l.classList.toggle("is-active", l.getAttribute("href") === id)
          );
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ==================== REVEAL ON SCROLL ==================== */
function initRevealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => observer.observe(el));
}

/* ==================== WHATSAPP BUTTONS ==================== */
function initWhatsappButtons() {
  document.querySelectorAll("[data-whatsapp-service]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const service = btn.dataset.whatsappService;
      const message = `Olá, TechOne! Tenho interesse no serviço de ${service}. Gostaria de solicitar um orçamento.`;
      const link = buildWhatsappLink(message);
      window.open(link, "_blank", "noopener");
    });
  });
}

/* ==================== CONTACT FORM ==================== */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form) return;

  const validators = {
    name: (v) => v.trim().length >= 2 || "Informe seu nome completo.",
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Informe um email válido.",
    phone: (v) => v.replace(/\D/g, "").length >= 10 || "Informe um telefone válido com DDD.",
    service: (v) => v.trim().length > 0 || "Selecione um serviço.",
    message: (v) => v.trim().length >= 10 || "Conte um pouco mais sobre sua necessidade.",
  };

  const fields = ["name", "email", "phone", "service", "message"];

  const setError = (field, msg) => {
    const input = form.querySelector(`#field-${field}`);
    const errorEl = form.querySelector(`[data-error-for="field-${field}"]`);
    const row = input ? input.closest(".form-row") : null;
    if (row) row.classList.toggle("has-error", Boolean(msg));
    if (errorEl) errorEl.textContent = msg || "";
  };

  const validateField = (field) => {
    const input = form.querySelector(`#field-${field}`);
    if (!input) return true;
    const result = validators[field](input.value);
    setError(field, result === true ? "" : result);
    return result === true;
  };

  fields.forEach((field) => {
    const input = form.querySelector(`#field-${field}`);
    if (input) {
      input.addEventListener("blur", () => validateField(field));
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.textContent = "";

    const allValid = fields.map(validateField).every(Boolean);
    if (!allValid) {
      status.style.color = "#e0685c";
      status.textContent = "Verifique os campos destacados antes de enviar.";
      return;
    }

    // Sem backend configurado: preparado para integração futura
    // (ex.: fetch('/api/contact', { method: 'POST', body: new FormData(form) }))
    const data = Object.fromEntries(new FormData(form).entries());

    // Envia também via WhatsApp para agilizar o contato
    const message = `Olá, TechOne! Meu nome é ${data.name}. Tenho interesse no serviço de ${data.service}. ${data.message}`;
    const link = buildWhatsappLink(message);

    status.style.color = "var(--green-500)";
    status.textContent = "Mensagem pronta! Abrindo o WhatsApp para finalizar o envio...";

    form.reset();
    window.open(link, "_blank", "noopener");
  });
}

/* ==================== HERO 3D (Three.js — leve, opcional) ==================== */
function initHero3D() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return;

  const isMobile = window.innerWidth < 768;
  const isLowPower =
    navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

  const particleCount = isMobile || isLowPower ? 260 : 620;

  const heroSection = canvas.closest(".hero");
  let width = heroSection.clientWidth;
  let height = heroSection.clientHeight;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(width, height);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
  camera.position.z = isMobile ? 22 : 18;

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const radius = isMobile ? 9 : 11;

  for (let i = 0; i < particleCount; i++) {
    // distribuição esférica (rede tecnológica abstrata)
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * (0.55 + Math.random() * 0.45);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x488c03,
    size: isMobile ? 0.055 : 0.065,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // núcleo sutil
  const coreGeo = new THREE.IcosahedronGeometry(isMobile ? 2.6 : 3.1, 1);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x1b4001,
    wireframe: true,
    transparent: true,
    opacity: 0.5,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  scene.add(core);

  let rafId = null;
  let isVisible = true;

  function animate() {
    if (!isVisible) return;
    rafId = requestAnimationFrame(animate);
    points.rotation.y += 0.0009;
    points.rotation.x += 0.0003;
    core.rotation.y -= 0.0014;
    core.rotation.x += 0.0007;
    renderer.render(scene, camera);
  }
  animate();

  // pausa quando fora da viewport (performance)
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !rafId) animate();
        });
      },
      { threshold: 0 }
    );
    io.observe(heroSection);
  }

  window.addEventListener(
    "resize",
    () => {
      width = heroSection.clientWidth;
      height = heroSection.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    },
    { passive: true }
  );
}
