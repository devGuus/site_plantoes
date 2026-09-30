const CONFIG = {
  APP_NAME:        "PlantãoApp",
  APP_TAGLINE:     "Gerencie seus plantões com facilidade",
  APP_DESCRIPTION: "O aplicativo completo para profissionais de saúde controlarem plantões, finanças e agenda em um só lugar.",

  PLAYSTORE_LINK: "#",   // Ex: "https://play.google.com/store/apps/details?id=..."
  APPSTORE_LINK:  "#",   // Ex: "https://apps.apple.com/app/..."
  PREMIUM_LINK:   "#",   // Link para página de assinatura

  EMAIL_CONTATO: "bps.software1@gmail.com",
  YEAR: new Date().getFullYear(),
};

/* ============================================================
   FUNCIONALIDADES
   Adicione, edite ou remova cards aqui (máx. 6 recomendado)
   ============================================================ */
const FEATURES = [
  {
    icon: "📅",
    title: "Calendário de Plantões",
    desc:  "Visualize todos os seus plantões em um calendário interativo. Adicione, edite e acompanhe sua agenda em segundos.",
  },
  {
    icon: "💰",
    title: "Controle Financeiro",
    desc:  "Registre os ganhos de cada plantão e acompanhe sua renda mensal com relatórios claros e organizados.",
  },
  {
    icon: "🔔",
    title: "Notificações Automáticas",
    desc:  "Receba lembretes antes dos seus plantões e alertas sobre pagamentos pendentes. Nunca perca um compromisso.",
  },
  {
    icon: "🤖",
    title: "Integração com IA",
    desc:  "Em breve: gerencie seus plantões por mensagem no WhatsApp com o apoio de inteligência artificial.",
  },
  {
    icon: "📊",
    title: "Relatórios Detalhados",
    desc:  "Exporte relatórios por período, local e tipo de plantão para facilitar sua declaração de Imposto de Renda.",
  },
  {
    icon: "📱",
    title: "Interface Simples",
    desc:  "Design pensado para o dia a dia corrido. Cadastre um plantão em segundos, de qualquer lugar.",
  },
];

/* ============================================================
   POPULA O DOM COM OS DADOS DO CONFIG
   ============================================================ */
function populateConfig() {
  // Título da aba e meta description
  document.title = CONFIG.APP_NAME;
  const meta = document.getElementById("meta-description");
  if (meta) meta.setAttribute("content", CONFIG.APP_TAGLINE);

  // Logo e textos principais
  setText("nav-logo",            CONFIG.APP_NAME);
  setText("hero-title",          CONFIG.APP_TAGLINE);
  setText("hero-subtitle",       CONFIG.APP_DESCRIPTION);
  setText("download-title",      `Baixe o ${CONFIG.APP_NAME} agora`);
  setText("footer-logo",         CONFIG.APP_NAME);
  setHTML("footer-copy",         `&copy; ${CONFIG.YEAR} ${CONFIG.APP_NAME}. Todos os direitos reservados.`);

  // Links das lojas
  setLink("hero-android",     CONFIG.PLAYSTORE_LINK);
  setLink("download-android", CONFIG.PLAYSTORE_LINK);
  setLink("hero-ios",         CONFIG.APPSTORE_LINK);
  setLink("download-ios",     CONFIG.APPSTORE_LINK);
  setLink("premium-btn",      CONFIG.PREMIUM_LINK);

  // E-mails
  ["download-email", "footer-email"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.href        = `mailto:${CONFIG.EMAIL_CONTATO}`;
    el.textContent = CONFIG.EMAIL_CONTATO;
  });
}

/* Helpers */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
function setHTML(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
}
function setLink(id, href) {
  const el = document.getElementById(id);
  if (el) el.href = href;
}

/* ============================================================
   RENDERIZA CARDS DE FUNCIONALIDADES
   ============================================================ */
function renderFeatures() {
  const grid = document.getElementById("features-grid");
  if (!grid) return;

  grid.innerHTML = FEATURES.map((f, i) => `
    <div class="feature-card fade-in" style="transition-delay:${(i % 3) * 0.1}s">
      <div class="feature-icon">${f.icon}</div>
      <h3>${f.title}</h3>
      <p>${f.desc}</p>
    </div>
  `).join("");
}

/* ============================================================
   ANIMAÇÕES AO SCROLL (Intersection Observer)
   ============================================================ */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // anima uma única vez
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
}

/* ============================================================
   NAVBAR — efeito de scroll + menu mobile
   ============================================================ */
function initNavbar() {
  const navbar    = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks  = document.getElementById("nav-links");
  if (!navbar || !hamburger || !navLinks) return;

  // Classe "scrolled" ao rolar
  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Abre/fecha menu mobile
  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.classList.toggle("active", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Fecha ao clicar em um link
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // Fecha ao clicar fora do menu
  document.addEventListener("click", e => {
    if (!navbar.contains(e.target)) closeMenu();
  });

  function closeMenu() {
    navLinks.classList.remove("open");
    hamburger.classList.remove("active");
    document.body.style.overflow = "";
  }
}

/* ============================================================
   EFEITO RIPPLE NOS BOTÕES
   ============================================================ */
function initRipple() {
  document.addEventListener("click", e => {
    const btn = e.target.closest(".btn-ripple");
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x    = e.clientX - rect.left - size / 2;
    const y    = e.clientY - rect.top  - size / 2;

    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    btn.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
}

/* ============================================================
   SCROLL SUAVE COM OFFSET PARA NAVBAR FIXA
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      const id = anchor.getAttribute("href");
      if (id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
function init() {
  populateConfig();
  renderFeatures();

  // IntersectionObserver precisa ser iniciado após renderFeatures
  // para observar os cards criados dinamicamente
  requestAnimationFrame(initScrollAnimations);

  initNavbar();
  initRipple();
  initSmoothScroll();
}

document.addEventListener("DOMContentLoaded", init);
