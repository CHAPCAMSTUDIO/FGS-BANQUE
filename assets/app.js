"use strict";

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const chartInstances = [];

const formatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const accounts = [
  {
    id: "current",
    name: "Compte courant",
    type: "Compte individuel",
    balance: 12450.8,
    number: "FR76 •••• •••• 8912",
    change: 6.4,
    icon: "landmark",
    tone: "standard",
    operations: [
      { label: "Salaire Septembre", date: "08 sept.", amount: 2680.0 },
      { label: "Virement à Sarah", date: "06 sept.", amount: -150.0 },
      { label: "Maison Lumière", date: "04 sept.", amount: -84.2 },
    ],
  },
  {
    id: "savings",
    name: "Epargne",
    type: "Livret FGS",
    balance: 25800.0,
    number: "FR76 •••• •••• 2940",
    change: 4.1,
    icon: "piggy-bank",
    tone: "savings",
    operations: [
      { label: "Versement programmé", date: "02 sept.", amount: 500.0 },
      { label: "Interêts annuels", date: "01 sept.", amount: 73.8 },
      { label: "Versement programmé", date: "02 août", amount: 500.0 },
    ],
  },
  {
    id: "project",
    name: "Compte projet",
    type: "Projet personnel",
    balance: 4250.0,
    number: "FR76 •••• •••• 7614",
    change: -1.8,
    icon: "target",
    tone: "project",
    operations: [
      { label: "Versement Voyage", date: "03 sept.", amount: 250.0 },
      { label: "Réservation hôtel", date: "30 août", amount: -320.0 },
      { label: "Versement Voyage", date: "03 août", amount: 200.0 },
    ],
  },
];

const transactions = [
  {
    id: "tx-001",
    date: "2026-09-08",
    description: "Salaire Septembre",
    detail: "Virement reçu - Atelier Nord",
    category: "Revenus",
    icon: "briefcase-business",
    tone: "mint",
    amount: 2680.0,
    status: "Terminé",
    statusClass: "complete",
    account: "Compte courant",
  },
  {
    id: "tx-002",
    date: "2026-09-06",
    description: "Virement à Sarah Leroy",
    detail: "Virement ponctuel",
    category: "Virements",
    icon: "arrow-up-right",
    tone: "blue",
    amount: -150.0,
    status: "Terminé",
    statusClass: "complete",
    account: "Compte courant",
  },
  {
    id: "tx-003",
    date: "2026-09-05",
    description: "Marché Saint-Martin",
    detail: "Paiement carte •••• 4812",
    category: "Alimentation",
    icon: "shopping-basket",
    tone: "sand",
    amount: -46.25,
    status: "Terminé",
    statusClass: "complete",
    account: "Compte courant",
  },
  {
    id: "tx-004",
    date: "2026-09-04",
    description: "Maison Lumière",
    detail: "Prélèvement mensuel",
    category: "Logement",
    icon: "house",
    tone: "blue",
    amount: -84.2,
    status: "Terminé",
    statusClass: "complete",
    account: "Compte courant",
  },
  {
    id: "tx-005",
    date: "2026-09-03",
    description: "Versement Projet Voyage",
    detail: "Virement interne",
    category: "Epargne",
    icon: "plane",
    tone: "mint",
    amount: -250.0,
    status: "Terminé",
    statusClass: "complete",
    account: "Compte projet",
  },
  {
    id: "tx-006",
    date: "2026-09-02",
    description: "Streamline Plus",
    detail: "Paiement carte •••• 4812",
    category: "Abonnements",
    icon: "repeat-2",
    tone: "sand",
    amount: -12.99,
    status: "Terminé",
    statusClass: "complete",
    account: "Compte courant",
  },
  {
    id: "tx-007",
    date: "2026-09-01",
    description: "Remboursement mutuelle",
    detail: "Versement reçu",
    category: "Santé",
    icon: "heart-pulse",
    tone: "mint",
    amount: 42.5,
    status: "Terminé",
    statusClass: "complete",
    account: "Compte courant",
  },
  {
    id: "tx-008",
    date: "2026-08-30",
    description: "Mobilité Métropole",
    detail: "Paiement carte •••• 4812",
    category: "Transport",
    icon: "train-front",
    tone: "blue",
    amount: -36.4,
    status: "En attente",
    statusClass: "pending",
    account: "Compte courant",
  },
  {
    id: "tx-009",
    date: "2026-08-28",
    description: "Café des Arts",
    detail: "Paiement carte •••• 4812",
    category: "Loisirs",
    icon: "coffee",
    tone: "sand",
    amount: -8.6,
    status: "Terminé",
    statusClass: "complete",
    account: "Compte courant",
  },
];

const budgetCategories = [
  { name: "Logement", icon: "house", tone: "blue", spent: 1080, budget: 1250 },
  { name: "Alimentation", icon: "shopping-basket", tone: "mint", spent: 412, budget: 520 },
  { name: "Transport", icon: "train-front", tone: "sand", spent: 168, budget: 220 },
  { name: "Loisirs", icon: "film", tone: "blue", spent: 139, budget: 200 },
  { name: "Abonnements", icon: "repeat-2", tone: "mint", spent: 48, budget: 65 },
  { name: "Autres", icon: "circle-ellipsis", tone: "red", spent: 363, budget: 395 },
];

const documentsData = [
  { id: "doc-01", title: "Relevé de compte - Août 2026", category: "Relevés", date: "01 septembre 2026", size: "184 Ko", icon: "file-text", tone: "blue" },
  { id: "doc-02", title: "Récapitulatif annuel 2025", category: "Documents", date: "12 janvier 2026", size: "228 Ko", icon: "files", tone: "mint" },
  { id: "doc-03", title: "Convention de compte", category: "Contrats", date: "18 janvier 2024", size: "396 Ko", icon: "file-signature", tone: "sand" },
  { id: "doc-04", title: "Information tarifaire 2026", category: "Informations", date: "02 janvier 2026", size: "121 Ko", icon: "info", tone: "blue" },
  { id: "doc-05", title: "Relevé de compte - Juillet 2026", category: "Relevés", date: "01 août 2026", size: "177 Ko", icon: "file-text", tone: "blue" },
  { id: "doc-06", title: "Attestation de titulaire", category: "Documents", date: "15 juin 2026", size: "93 Ko", icon: "badge-check", tone: "mint" },
];

const notificationData = [
  { id: "note-01", type: "operation", icon: "arrow-down-left", tone: "mint", title: "Salaire reçu", body: "Votre virement de 2 680,00 EUR est disponible sur votre compte courant.", date: "Aujourd'hui, 09:12", read: false },
  { id: "note-02", type: "alert", icon: "circle-alert", tone: "sand", title: "Votre budget loisirs approche sa limite", body: "Vous avez utilisé 70 % de votre budget loisirs de septembre.", date: "Hier, 18:40", read: false },
  { id: "note-03", type: "security", icon: "shield-check", tone: "red", title: "Nouvel appareil reconnu", body: "Une connexion depuis votre ordinateur Windows a été enregistrée.", date: "04 septembre, 10:05", read: false },
  { id: "note-04", type: "information", icon: "piggy-bank", tone: "mint", title: "Versement épargne effectué", body: "250,00 EUR ont été ajoutés à votre Projet Voyage.", date: "03 septembre, 08:30", read: true },
  { id: "note-05", type: "operation", icon: "credit-card", tone: "blue", title: "Paiement carte validé", body: "Votre paiement de 46,25 EUR chez Marché Saint-Martin est confirmé.", date: "02 septembre, 17:20", read: true },
];

const conversations = [
  {
    id: "advisor",
    name: "Camille Durand",
    role: "Conseillère FGS",
    initials: "CD",
    online: true,
    unread: true,
    preview: "Votre demande a bien été prise en compte.",
    time: "10:24",
    messages: [
      { mine: false, text: "Bonjour Alex, je suis Camille, votre conseillère FGS. Comment puis-je vous aider aujourd'hui ?", time: "09:48" },
      { mine: true, text: "Bonjour Camille, je souhaite savoir si mon prochain versement épargne est bien programmé.", time: "10:02", read: true },
      { mine: false, text: "Oui, votre versement de 250,00 EUR est prévu le 3 octobre. Votre Projet Voyage progresse très bien.", time: "10:17" },
      { mine: false, text: "Votre demande a bien été prise en compte. Je reste disponible si vous avez besoin d'ajuster ce montant.", time: "10:24" },
    ],
  },
  {
    id: "support",
    name: "Assistance cartes",
    role: "Service cartes",
    initials: "AC",
    online: true,
    unread: false,
    preview: "Votre carte Premium est active.",
    time: "Lun.",
    messages: [
      { mine: false, text: "Votre carte FGS Premium est active et prête à être utilisée.", time: "Lun., 14:18" },
      { mine: true, text: "Merci, parfait.", time: "Lun., 14:24", read: true },
    ],
  },
  {
    id: "documents",
    name: "Centre documentaire",
    role: "Informations",
    initials: "CD",
    online: false,
    unread: false,
    preview: "Votre relevé du mois d'août est disponible.",
    time: "30 août",
    messages: [
      { mine: false, text: "Votre relevé de compte du mois d'août est désormais disponible dans vos documents.", time: "30 août, 08:00" },
    ],
  },
];

const state = {
  page: "dashboard",
  theme: getStoredTheme(),
  cardLocked: false,
  cardOnline: true,
  cardContactless: true,
  cardCash: true,
  notificationFilter: "all",
  documentFilter: "Tous",
  profileEditing: false,
  activeConversation: "advisor",
  pendingTransfer: null,
    beneficiaries: [],
    emailOutbox: [],
  notifications: notificationData.map((notification) => ({ ...notification })),
  profile: {
    firstName: "Alex",
    lastName: "Martin",
    email: "alex.martin@exemple.fr",
    phone: "+33 6 44 28 10 62",
    address: "18 rue des Tilleuls",
    postalCode: "69003",
    city: "Lyon",
  },
  settings: {
    biometric: true,
    transactionAlerts: true,
    securityAlerts: true,
    marketing: false,
  },
};

const pageMeta = {
  dashboard: { title: "Vue générale", kicker: "Bienvenue dans votre espace" },
  accounts: { title: "Mes comptes", kicker: "Une vision claire de votre quotidien" },
  transactions: { title: "Transactions", kicker: "Suivez chacun de vos mouvements" },
  transfers: { title: "Virements", kicker: "Envoyez de l'argent en toute simplicité" },
  cards: { title: "Mes cartes", kicker: "Vos moyens de paiement sous contrôle" },
  savings: { title: "Epargne", kicker: "Chaque projet mérite sa place" },
  budget: { title: "Budget", kicker: "Vos repères du mois de septembre" },
  documents: { title: "Documents", kicker: "Vos fichiers utiles, toujours disponibles" },
  notifications: { title: "Notifications", kicker: "Ce qui mérite votre attention" },
  messages: { title: "Messagerie", kicker: "Votre équipe FGS à portée de message" },
  profile: { title: "Mon profil", kicker: "Vos informations personnelles" },
  settings: { title: "Paramètres", kicker: "Personnalisez votre espace" },
  faq: { title: "Centre d'aide", kicker: "Les réponses à vos questions" },
};

function getStoredTheme() {
  try {
    return localStorage.getItem("fgs-theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function formatCurrency(value) {
  return formatter.format(value);
}

function formatCompactCurrency(value) {
  return compactFormatter.format(value);
}

function formatSignedCurrency(value) {
  return `${value >= 0 ? "+ " : "- "}${formatCurrency(Math.abs(value))}`;
}

function formatDate(dateValue, options = { day: "2-digit", month: "short", year: "numeric" }) {
  return new Intl.DateTimeFormat("fr-FR", options).format(new Date(`${dateValue}T12:00:00`));
}

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addBusinessDays(dateValue, days) {
  const date = new Date(`${dateValue}T12:00:00`);
  let remainingDays = days;

  while (remainingDays > 0) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) {
      remainingDays -= 1;
    }
  }

  return formatDateInput(date);
}

function accountTotalBalance() {
  return accounts.reduce((total, account) => total + account.balance, 0);
}

function beneficiaryInitials(name) {
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "B";
}

function createTransferEmail(transfer, source, recipient) {
  const isBeneficiary = recipient === "beneficiary";
  const to = isBeneficiary ? transfer.beneficiaryEmail : transfer.senderEmail;
  const greeting = isBeneficiary ? transfer.beneficiaryName : `${state.profile.firstName} ${state.profile.lastName}`;
  const subject = isBeneficiary ? "FGS Banque - Votre virement est en cours" : "FGS Banque - Confirmation de votre virement";
  const body = isBeneficiary
    ? `Bonjour ${greeting},\n\nUn virement de ${formatCurrency(transfer.amount)} à votre attention a été effectué depuis FGS Banque. Il est actuellement en cours de traitement.\n\nRéception estimée : au plus tard le ${formatDate(transfer.estimatedArrival, { day: "numeric", month: "long", year: "numeric" })}, soit jusqu'à 3 jours ouvrés.\n\nMotif : ${transfer.reason || "Sans motif"}\n\nFGS Banque - interface de simulation`
    : `Bonjour ${greeting},\n\nVotre virement de ${formatCurrency(transfer.amount)} vers ${transfer.beneficiaryName} a été enregistré. Le montant a été débité de votre ${source.name} et le virement est en cours de traitement.\n\nRéception estimée : au plus tard le ${formatDate(transfer.estimatedArrival, { day: "numeric", month: "long", year: "numeric" })}, soit jusqu'à 3 jours ouvrés.\n\nMotif : ${transfer.reason || "Sans motif"}\n\nFGS Banque - interface de simulation`;

  return {
    id: `email-${Date.now()}-${recipient}`,
    to,
    subject,
    body,
  };
}

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#039;",
    '"': "&quot;",
  })[character]);
}

function colorVariable(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons({ attrs: { "aria-hidden": "true" } });
  }
}

function destroyCharts() {
  while (chartInstances.length) {
    chartInstances.pop().destroy();
  }
}

function createChart(canvasId, config) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !window.Chart) {
    return;
  }

  const chart = new window.Chart(canvas.getContext("2d"), config);
  chartInstances.push(chart);
}

function applyTheme(theme, persist = true) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  if (persist) {
    try {
      localStorage.setItem("fgs-theme", theme);
    } catch {
      // Theme still applies when local storage is unavailable.
    }
  }

  $$('[data-theme-toggle] i, [data-theme-toggle] svg').forEach((icon) => {
    icon.remove();
  });
  $$('[data-theme-toggle]').forEach((button) => {
    button.insertAdjacentHTML("afterbegin", `<i data-lucide="${theme === "dark" ? "sun" : "moon"}"></i>`);
    button.setAttribute("aria-label", theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre");
    button.setAttribute("title", theme === "dark" ? "Mode clair" : "Mode sombre");
  });
  refreshIcons();
}

function toggleTheme() {
  applyTheme(state.theme === "light" ? "dark" : "light");
  if (!$("#appShell").classList.contains("is-hidden")) {
    renderApp();
  }
}

function showToast(title, message, type = "info") {
  const icon = type === "success" ? "circle-check" : type === "error" ? "circle-alert" : type === "warning" ? "triangle-alert" : "info";
  const tone = type === "success" ? "mint" : type === "error" ? "red" : type === "warning" ? "sand" : "blue";
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="round-icon ${tone}"><i data-lucide="${icon}"></i></span><div><b>${escapeHTML(title)}</b><p>${escapeHTML(message)}</p></div>`;
  $("#toastStack").append(toast);
  refreshIcons();
  window.setTimeout(() => {
    toast.remove();
  }, 4200);
}

function setOverlayState(layer, isOpen) {
  layer.classList.toggle("is-open", isOpen);
  layer.setAttribute("aria-hidden", String(!isOpen));
  layer.style.visibility = isOpen ? "visible" : "";
  layer.style.opacity = isOpen ? "1" : "";
  layer.style.pointerEvents = isOpen ? "auto" : "";
}

function openLogin() {
  const layer = $("#loginLayer");
  setOverlayState(layer, true);
  window.setTimeout(() => $("#loginForm input[name='identifier']")?.focus(), 80);
}

function closeLogin() {
  const layer = $("#loginLayer");
  setOverlayState(layer, false);
}

function openModal(content, wide = false) {
  const layer = $("#modalLayer");
  const panel = $("#modalPanel");
  panel.className = `modal-panel${wide ? " modal-wide" : ""}`;
  panel.innerHTML = content;
  setOverlayState(layer, true);
  refreshIcons();
  window.setTimeout(() => $("[data-modal-close]", panel)?.focus(), 60);
}

function closeModal() {
  const layer = $("#modalLayer");
  setOverlayState(layer, false);
  $("#modalPanel").innerHTML = "";
}

function toggleMobileNav() {
  const drawer = $("#mobileDrawer");
  const opening = !drawer.classList.contains("is-open");
  drawer.classList.toggle("is-open", opening);
  drawer.setAttribute("aria-hidden", String(!opening));
}

function closeMobileNav() {
  const drawer = $("#mobileDrawer");
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
}

function enterApp() {
  closeLogin();
  $("#publicShell").classList.add("is-hidden");
  $("#appShell").classList.remove("is-hidden");
  state.page = "dashboard";
  renderApp();
  showToast("Connexion réussie", "Bonjour Alex, votre espace est prêt.", "success");
}

function leaveApp() {
  destroyCharts();
  $("#appShell").classList.add("is-hidden");
  $("#publicShell").classList.remove("is-hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setPage(page) {
  if (!pageMeta[page]) {
    return;
  }

  state.page = page;
  renderApp();
  closeMobileNav();
  $("#pageContent")?.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateNavigation() {
  const page = state.page;
  $$('[data-page]').forEach((button) => {
    button.classList.toggle("is-active", button.dataset.page === page);
  });

  const meta = pageMeta[page];
  $("#pageTitle").textContent = meta.title;
  $("#topbarKicker").textContent = meta.kicker;
  const unread = state.notifications.filter((notification) => !notification.read).length;
  const badge = $("#notificationBadge");
  badge.textContent = unread;
  badge.hidden = unread === 0;
}

function renderApp() {
  destroyCharts();
  const renderer = pageRenderers[state.page] || pageRenderers.dashboard;
  $("#pageContent").innerHTML = renderer();
  updateNavigation();
  refreshIcons();
  requestAnimationFrame(() => {
    mountChartsForPage(state.page);
  });
}

function accountCard(account, detailed = false) {
  const changeClass = account.change < 0 ? "negative" : "";
  const changeIcon = account.change < 0 ? "trending-down" : "trending-up";
  const className = detailed ? "account-detail-card" : "account-card";
  const detail = detailed
    ? `<span class="account-number">${account.number}</span>
       <strong class="account-balance">${formatCurrency(account.balance)}</strong>
       <span class="amount-change ${changeClass}"><i data-lucide="${changeIcon}"></i>${Math.abs(account.change).toFixed(1).replace(".", ",")} % ce mois</span>
       <div class="account-op-list">${account.operations.slice(0, 2).map((operation) => `<div class="account-op"><span>${escapeHTML(operation.label)}</span><b class="${operation.amount >= 0 ? "credit" : ""}">${formatSignedCurrency(operation.amount)}</b></div>`).join("")}</div>
       <button class="small-action" type="button" data-account-id="${account.id}">Voir le compte <i data-lucide="arrow-right"></i></button>`
    : `<strong class="account-balance">${formatCurrency(account.balance)}</strong>
       <div class="account-card-footer"><span class="amount-change ${changeClass}"><i data-lucide="${changeIcon}"></i>${Math.abs(account.change).toFixed(1).replace(".", ",")} % ce mois</span><button class="small-action" type="button" data-account-id="${account.id}">Détails <i data-lucide="arrow-right"></i></button></div>`;

  return `<article class="${className} ${account.tone}">
    <div class="account-card-top">
      <div><h3>${account.name}</h3><small>${account.type}</small></div>
      <span class="account-icon ${account.tone}"><i data-lucide="${account.icon}"></i></span>
    </div>
    ${detail}
  </article>`;
}

function pageHeading(title, description, actions = "") {
  return `<div class="page-heading"><div><h2>${title}</h2><p>${description}</p></div>${actions ? `<div class="heading-actions">${actions}</div>` : ""}</div>`;
}

function dashboardPage() {
  const currentAccount = accounts.find((account) => account.id === "current") || accounts[0];
  const totalBalance = accountTotalBalance();
  return `<section class="page-view">
    <div class="dashboard-welcome">
      <div><h2>Bonjour, Alex</h2><p>Voici l'essentiel de votre situation financière.</p></div>
      <span class="period-pill"><i data-lucide="calendar-days"></i> Septembre 2026</span>
    </div>

    <section class="balance-card">
      <div class="balance-main">
        <span class="balance-card-label"><i data-lucide="wallet"></i> Solde disponible</span>
        <strong class="balance-amount">${formatCurrency(currentAccount.balance)}</strong>
        <span class="balance-meta">sur votre ${currentAccount.name} <b>+ ${formatCurrency(520.4)} ce mois</b></span>
        <div class="quick-actions">
          <button class="button button-light" type="button" data-command="transfer"><i data-lucide="arrow-left-right"></i> Faire un virement</button>
          <button class="button button-secondary" type="button" data-command="transactions"><i data-lucide="receipt-text"></i> Transactions</button>
          <button class="button button-secondary" type="button" data-command="cards"><i data-lucide="credit-card"></i> Mes cartes</button>
          <button class="button button-secondary" type="button" data-command="savings"><i data-lucide="piggy-bank"></i> Epargne</button>
          <button class="button button-secondary" type="button" data-command="statement"><i data-lucide="download"></i> Relevé</button>
        </div>
      </div>
      <div class="balance-side"><span>Patrimoine total</span><b>${formatCurrency(totalBalance)}</b><small><i data-lucide="trending-up"></i> + 8,4 % cette année</small></div>
    </section>

    <section class="account-grid">${accounts.map((account) => accountCard(account)).join("")}</section>

    <section class="dashboard-grid">
      <div class="dashboard-column">
        <article class="panel">
          <div class="panel-heading"><div><h3>Evolution du solde</h3><p>6 derniers mois</p></div><button class="small-action" type="button" data-page="accounts">Voir l'analyse <i data-lucide="arrow-up-right"></i></button></div>
          <div class="chart-wrap"><canvas id="balanceChart" aria-label="Graphique de l'évolution du solde" role="img"></canvas></div>
          <div class="legend-row"><span><i></i> Solde global</span><span><i class="mint"></i> Epargne mensuelle</span></div>
        </article>
        <article class="panel">
          <div class="panel-heading"><div><h3>Dernières transactions</h3><p>Les mouvements les plus récents</p></div><button class="small-action" type="button" data-page="transactions">Tout voir <i data-lucide="arrow-right"></i></button></div>
          <div class="transaction-feed">${transactions.slice(0, 5).map(transactionFeedRow).join("")}</div>
        </article>
      </div>
      <div class="dashboard-column">
        <article class="panel">
          <div class="panel-heading"><div><h3>Dépenses du mois</h3><p>Par rapport à août</p></div><button class="icon-button" type="button" data-page="budget" aria-label="Voir le budget" title="Voir le budget"><i data-lucide="arrow-up-right"></i></button></div>
          <div class="expense-stat"><div><span>Total dépensé</span><b>${formatCurrency(2210.0)}</b><small>+ 4,8 %</small></div><div class="expense-ring" aria-hidden="true"></div></div>
          <div class="legend-row"><span><i></i> Logement</span><span><i class="mint"></i> Alimentation</span><span><i class="sand"></i> Autres</span></div>
        </article>
        <article class="panel">
          <div class="panel-heading"><div><h3>Epargne</h3><p>Projet Voyage</p></div><button class="icon-button" type="button" data-page="savings" aria-label="Voir l'épargne" title="Voir l'épargne"><i data-lucide="arrow-up-right"></i></button></div>
          <div class="savings-mini"><div class="savings-mini-value"><div><span>Progression</span><b>3 250,00 EUR</b></div><span>65 %</span></div><div class="progress-track"><span style="width: 65%"></span></div><button class="small-action" type="button" data-page="savings">Gérer mon objectif <i data-lucide="arrow-right"></i></button></div>
        </article>
        <article class="panel">
          <div class="panel-heading"><div><h3>À suivre</h3><p>${state.notifications.filter((notification) => !notification.read).length} notification(s) non lue(s)</p></div><button class="icon-button" type="button" data-page="notifications" aria-label="Voir les notifications" title="Notifications"><i data-lucide="bell"></i></button></div>
          <div class="notification-mini">${state.notifications.filter((notification) => !notification.read).slice(0, 3).map(notificationMini).join("") || "<p class='empty-state'>Vous êtes à jour.</p>"}</div>
        </article>
      </div>
    </section>
  </section>`;
}

function transactionFeedRow(transaction) {
  return `<div class="transaction-row">
    <span class="round-icon ${transaction.tone}"><i data-lucide="${transaction.icon}"></i></span>
    <div><b>${escapeHTML(transaction.description)}</b><small>${formatDate(transaction.date, { day: "numeric", month: "short" })} · ${escapeHTML(transaction.category)}</small></div>
    <strong class="${transaction.amount >= 0 ? "credit" : "debit"}">${formatSignedCurrency(transaction.amount)}</strong>
  </div>`;
}

function notificationMini(notification) {
  return `<div class="notification-mini-item"><span class="round-icon ${notification.tone}"><i data-lucide="${notification.icon}"></i></span><div><b>${escapeHTML(notification.title)}</b><small>${escapeHTML(notification.date)}</small></div></div>`;
}

function accountsPage() {
  return `<section class="page-view">
    ${pageHeading("Mes comptes", "Retrouvez vos soldes, opérations et repères essentiels.", `<button class="button button-primary" type="button" data-command="transfer"><i data-lucide="arrow-left-right"></i> Nouveau virement</button>`)}
    <section class="account-page-grid">${accounts.map((account) => accountCard(account, true)).join("")}</section>
    <section class="panel account-summary-panel">
      <div><div class="panel-heading"><div><h3>Répartition de vos avoirs</h3><p>Au 8 septembre 2026</p></div></div><div class="chart-wrap chart-small"><canvas id="assetBreakdownChart" aria-label="Répartition des avoirs" role="img"></canvas></div></div>
      <div class="summary-stat-grid"><div><span>Disponible</span><b>${formatCurrency(12450.8)}</b></div><div><span>Placements</span><b>${formatCurrency(30050.0)}</b></div><div><span>Versements reçus</span><b>+ ${formatCurrency(3322.5)}</b></div><div><span>Charges ce mois</span><b>- ${formatCurrency(2210.0)}</b></div></div>
    </section>
  </section>`;
}

function transactionsPage() {
  return `<section class="page-view">
    ${pageHeading("Transactions", "Recherchez, filtrez et consultez le détail de vos opérations.", `<button class="button button-secondary" type="button" data-command="statement"><i data-lucide="download"></i> Télécharger un relevé</button>`)}
    <section class="panel data-toolbar">
      <label class="search-field"><i data-lucide="search"></i><input id="transactionSearch" type="search" data-transaction-control placeholder="Rechercher une transaction"></label>
      <div class="filter-group"><select id="transactionType" data-transaction-control aria-label="Filtrer par type"><option value="all">Crédits et débits</option><option value="credit">Crédits</option><option value="debit">Débits</option></select><select id="transactionPeriod" data-transaction-control aria-label="Filtrer par période"><option value="all">Toute période</option><option value="7">7 derniers jours</option><option value="30">30 derniers jours</option></select><select id="transactionSort" data-transaction-control aria-label="Trier les transactions"><option value="newest">Plus récentes</option><option value="oldest">Plus anciennes</option><option value="highest">Montant décroissant</option><option value="lowest">Montant croissant</option></select></div>
    </section>
    <section class="panel table-panel"><div class="table-wrap"><table><thead><tr><th>Date</th><th>Description</th><th>Catégorie</th><th>Montant</th><th>Statut</th><th><span class="is-hidden">Détail</span></th></tr></thead><tbody id="transactionTableBody">${transactionTableRows(transactions)}</tbody></table></div></section>
  </section>`;
}

function transactionTableRows(rows) {
  if (!rows.length) {
    return `<tr><td colspan="6"><div class="empty-state">Aucune transaction ne correspond à ces critères.</div></td></tr>`;
  }

  return rows.map((transaction) => `<tr>
    <td>${formatDate(transaction.date)}</td>
    <td><div class="transaction-description"><span class="round-icon ${transaction.tone}"><i data-lucide="${transaction.icon}"></i></span><div><b>${escapeHTML(transaction.description)}</b><small>${escapeHTML(transaction.detail)}</small></div></div></td>
    <td><span class="category-tag">${escapeHTML(transaction.category)}</span></td>
    <td class="amount-cell ${transaction.amount >= 0 ? "credit" : ""}">${formatSignedCurrency(transaction.amount)}</td>
    <td><span class="status-pill ${transaction.statusClass}">${escapeHTML(transaction.status)}</span></td>
    <td><button class="row-action" type="button" data-transaction-id="${transaction.id}" aria-label="Voir le détail de ${escapeHTML(transaction.description)}" title="Voir le détail"><i data-lucide="chevron-right"></i></button></td>
  </tr>`).join("");
}

function transfersPage() {
  const accountOptions = accounts.map((account) => `<option value="${account.id}">${account.name} · ${formatCurrency(account.balance)}</option>`).join("");
  const savedBeneficiaries = state.beneficiaries.length
    ? state.beneficiaries.map((beneficiary) => `<button class="saved-beneficiary" type="button" data-beneficiary-id="${beneficiary.id}"><span class="avatar">${beneficiaryInitials(beneficiary.name)}</span><span><b>${escapeHTML(beneficiary.name)}</b><small>${escapeHTML(beneficiary.email)}</small></span><i data-lucide="arrow-up-right"></i></button>`).join("")
    : `<p class="empty-beneficiary-state">Aucun bénéficiaire enregistré. Saisissez librement les coordonnées ci-dessous.</p>`;
  const requestDate = formatDateInput(new Date());
  return `<section class="page-view">
    ${pageHeading("Faire un virement", "Choisissez le compte à débiter puis préparez votre ordre de virement.")}
    <section class="transfer-layout">
      <article class="panel form-card"><h3>Nouvel ordre</h3><p>Le montant est débité du compte choisi après votre confirmation. Le virement reste en cours jusqu'à 3 jours ouvrés.</p>
        <form class="transfer-form" id="transferForm">
          <label class="form-field">Compte source<select name="source" required>${accountOptions}</select></label>
          <section class="beneficiary-section" aria-labelledby="beneficiaryTitle"><div class="beneficiary-section-head"><div><h4 id="beneficiaryTitle">Mes bénéficiaires</h4><p>Ajoutez-en autant que nécessaire, sans liste préchargée.</p></div><span class="status-pill">${state.beneficiaries.length} enregistré(s)</span></div><div class="saved-beneficiary-list">${savedBeneficiaries}</div></section>
          <div class="form-divider">Nouveau bénéficiaire</div>
          <div class="form-grid"><label class="form-field">Nom ou raison sociale<input name="beneficiaryName" type="text" autocomplete="name" placeholder="Ex. Marie Dupont" required></label><label class="form-field">E-mail du bénéficiaire<input name="beneficiaryEmail" type="email" autocomplete="email" placeholder="beneficiaire@gmail.com" required></label></div>
          <label class="checkbox-label"><input name="saveBeneficiary" type="checkbox" checked><span>Ajouter ce bénéficiaire à mes prochains virements</span></label>
          <div class="form-grid"><label class="form-field">Montant<input name="amount" type="number" min="0.01" step="0.01" placeholder="0,00" inputmode="decimal" required></label><label class="form-field">Date de la demande<input name="date" type="date" value="${requestDate}" required></label></div>
          <label class="form-field">Motif<textarea name="reason" maxlength="140" placeholder="Ex. Participation au week-end"></textarea></label>
          <label class="form-field">Mon e-mail de suivi<input name="senderEmail" type="email" autocomplete="email" placeholder="votre.email@gmail.com" required></label>
          <div class="info-box"><i data-lucide="mail-check"></i><p>Deux e-mails de suivi seront générés : un pour le bénéficiaire et un pour vous. Cette version HTML peut ouvrir les brouillons Gmail après validation, mais ne les envoie pas automatiquement.</p></div>
          <button class="button button-primary" type="submit">Continuer <i data-lucide="arrow-right"></i></button>
        </form>
      </article>
      <aside class="panel transfer-summary-card"><h3>Bon à savoir</h3><p>Quelques repères avant de valider.</p><ul class="transfer-summary-list"><li><span>Débit du compte</span><b>Dès votre confirmation</b></li><li><span>Réception estimée</span><b>Jusqu'à 3 jours ouvrés</b></li><li><span>Plafond disponible</span><b>3 000,00 EUR</b></li><li><span>Frais</span><b>0,00 EUR</b></li><li><span>Suivi e-mail</span><b>Bénéficiaire et vous</b></li></ul><div class="info-box"><i data-lucide="shield-check"></i><p>Chaque virement nécessite une confirmation de votre part avant validation.</p></div></aside>
    </section>
  </section>`;
}

function cardsPage() {
  const locked = state.cardLocked;
  return `<section class="page-view">
    ${pageHeading("Mes cartes", "Gardez le contrôle sur vos paiements et vos plafonds.", `<button class="button button-secondary" type="button" data-card-action="preferences"><i data-lucide="sliders-horizontal"></i> Paramètres des cartes</button>`)}
    <section class="cards-layout">
      <div class="bank-card-stack">
        <div class="bank-card ${locked ? "gold" : ""}"><span class="bank-card-brand">FGS</span><span class="bank-card-network">VISA</span><span class="card-chip-large"></span><span class="bank-card-type">PREMIUM</span><span class="bank-card-number">•••• 4812</span><span class="bank-card-holder">ALEX MARTIN · 09/29</span></div>
        <div class="bank-card virtual"><span class="bank-card-brand">FGS</span><span class="bank-card-network">VISA</span><span class="card-chip-large"></span><span class="bank-card-type">VIRTUELLE</span><span class="bank-card-number">•••• 2901</span><span class="bank-card-holder">ALEX MARTIN · 09/28</span></div>
      </div>
      <div class="card-information">
        <article class="panel"><div class="panel-heading"><div><h3>FGS Premium</h3><p>Carte principale · •••• 4812</p></div><span class="card-status ${locked ? "locked" : ""}">${locked ? "Verrouillée" : "Active"}</span></div>
          <div class="card-metrics"><div><span>Plafond paiement</span><b>2 400 EUR</b></div><div><span>Utilisé ce mois</span><b>682 EUR</b></div><div><span>Retraits</span><b>500 EUR</b></div></div>
          <div class="control-row"><button class="button ${locked ? "button-primary" : "button-secondary"}" type="button" data-card-action="lock"><i data-lucide="${locked ? "unlock" : "lock"}"></i> ${locked ? "Déverrouiller" : "Verrouiller"}</button><button class="button button-secondary" type="button" data-card-action="info"><i data-lucide="eye"></i> Afficher les informations</button></div>
        </article>
        <article class="panel"><div class="panel-heading"><div><h3>Réglages rapides</h3><p>Choisissez les usages autorisés.</p></div></div>
          ${toggleRow("Paiements en ligne", "Achats sur internet", "cardOnline", state.cardOnline)}
          ${toggleRow("Sans contact", "Paiements sans code PIN", "cardContactless", state.cardContactless)}
          ${toggleRow("Retraits", "Distributeurs automatiques", "cardCash", state.cardCash)}
        </article>
        <article class="panel"><div class="panel-heading"><div><h3>Dépenses de la carte</h3><p>Septembre 2026</p></div></div><div class="chart-wrap chart-small"><canvas id="cardSpendChart" aria-label="Dépenses de la carte par semaine" role="img"></canvas></div></article>
      </div>
    </section>
  </section>`;
}

function toggleRow(title, detail, setting, enabled) {
  return `<div class="toggle-row"><div><b>${title}</b><small>${detail}</small></div><button class="switch ${enabled ? "is-on" : ""}" type="button" data-toggle-setting="${setting}" role="switch" aria-checked="${enabled}" aria-label="${title}"></button></div>`;
}

function savingsPage() {
  return `<section class="page-view">
    ${pageHeading("Mon épargne", "Suivez vos réserves et donnez de l'élan à vos projets.", `<button class="button button-primary" type="button" data-savings-action="add"><i data-lucide="plus"></i> Alimenter un projet</button>`)}
    <section class="savings-layout">
      <div><article class="panel savings-total-card"><div><p>Montant épargné</p><h3>${formatCurrency(25800.0)}</h3><p>+ ${formatCurrency(750.0)} versés depuis le début du mois</p></div><div class="chart-wrap chart-small"><canvas id="savingsHistoryChart" aria-label="Historique de l'épargne" role="img"></canvas></div></article>
        <div class="goal-list">
          ${goalCard("Voyage", "Projet Voyage", 3250, 5000, "plane", "mint", "Juin 2027")}
          ${goalCard("Réserve", "Coussin de sécurité", 8400, 10000, "shield-check", "blue", "Décembre 2026")}
          ${goalCard("Projet", "Nouvel atelier", 2150, 4500, "sparkles", "sand", "Mars 2027")}
        </div>
      </div>
      <aside class="savings-sidebar"><article class="panel"><div class="panel-heading"><div><h3>Ce mois-ci</h3><p>Un rythme régulier</p></div></div><div class="summary-stat-grid"><div><span>Versements</span><b>${formatCurrency(750)}</b></div><div><span>Intérêts</span><b>${formatCurrency(73.8)}</b></div></div></article><article class="panel"><div class="panel-heading"><div><h3>Prochain versement</h3><p>Versement programmé</p></div><span class="round-icon mint"><i data-lucide="calendar-days"></i></span></div><strong class="account-balance">${formatCurrency(250)}</strong><p class="panel-copy">Le 3 octobre vers votre Projet Voyage.</p><button class="small-action" type="button" data-savings-action="schedule">Modifier le versement <i data-lucide="arrow-right"></i></button></article></aside>
    </section>
  </section>`;
}

function goalCard(label, name, current, target, icon, tone, deadline) {
  const progress = Math.round((current / target) * 100);
  return `<article class="goal-card"><div class="goal-head"><div><span class="round-icon ${tone}"><i data-lucide="${icon}"></i></span><div><h3>${name}</h3><p>${label} · objectif ${deadline}</p></div></div><button class="row-action" type="button" data-savings-action="goal" aria-label="Gérer ${name}" title="Gérer"><i data-lucide="chevron-right"></i></button></div><div class="goal-numbers"><b>${formatCurrency(current)}</b> <span>sur ${formatCurrency(target)}</span></div><div class="progress-track"><span style="width:${progress}%"></span></div><div class="goal-foot"><span>${progress} % atteint</span><span>Reste ${formatCurrency(target - current)}</span></div></article>`;
}

function budgetPage() {
  const totalBudget = budgetCategories.reduce((total, item) => total + item.budget, 0);
  const totalSpent = budgetCategories.reduce((total, item) => total + item.spent, 0);
  return `<section class="page-view">
    ${pageHeading("Mon budget", "Gardez le cap sur vos dépenses de septembre.", `<button class="button button-secondary" type="button" data-budget-action="edit"><i data-lucide="sliders-horizontal"></i> Ajuster les budgets</button>`)}
    <section class="panel budget-summary"><div><span>Budget mensuel</span><b>${formatCurrency(totalBudget)}</b></div><div><span>Dépenses réalisées</span><b>${formatCurrency(totalSpent)}</b></div><div><span>Montant restant</span><b>${formatCurrency(totalBudget - totalSpent)}</b></div></section>
    <section class="budget-layout"><div class="panel"><div class="panel-heading"><div><h3>Par catégorie</h3><p>Utilisation de votre budget mensuel</p></div><button class="small-action" type="button" data-budget-action="edit">Modifier <i data-lucide="arrow-up-right"></i></button></div><div class="budget-items">${budgetCategories.map(budgetItem).join("")}</div></div><div class="dashboard-column"><article class="panel"><div class="panel-heading"><div><h3>Répartition</h3><p>Dépenses de septembre</p></div></div><div class="chart-wrap chart-small"><canvas id="budgetDoughnutChart" aria-label="Répartition du budget par catégorie" role="img"></canvas></div></article><article class="panel"><div class="panel-heading"><div><h3>Evolution mensuelle</h3><p>Mai à septembre</p></div></div><div class="chart-wrap chart-small"><canvas id="budgetTrendChart" aria-label="Evolution mensuelle des dépenses" role="img"></canvas></div></article></div></section>
  </section>`;
}

function budgetItem(item) {
  const progress = Math.min(Math.round((item.spent / item.budget) * 100), 100);
  return `<article class="budget-item"><span class="round-icon ${item.tone}"><i data-lucide="${item.icon}"></i></span><div class="budget-item-details"><b>${item.name}</b><small>${formatCurrency(item.spent)} dépensés sur ${formatCurrency(item.budget)}</small><div class="budget-progress ${item.tone}"><i style="width:${progress}%"></i></div></div><div class="budget-item-amount"><b>${formatCurrency(item.budget - item.spent)}</b>restant</div></article>`;
}

function documentsPage() {
  const categories = ["Tous", "Relevés", "Documents", "Contrats", "Informations"];
  const visibleDocuments = state.documentFilter === "Tous" ? documentsData : documentsData.filter((documentItem) => documentItem.category === state.documentFilter);
  return `<section class="page-view">
    ${pageHeading("Mes documents", "Consultez et téléchargez vos fichiers en quelques instants.")}
    <div class="documents-filter">${categories.map((category) => `<button class="filter-chip ${state.documentFilter === category ? "is-active" : ""}" type="button" data-document-filter="${category}">${category}</button>`).join("")}</div>
    <section class="document-library">${visibleDocuments.map(documentCard).join("")}</section>
  </section>`;
}

function documentCard(documentItem) {
  return `<article class="document-card"><span class="round-icon ${documentItem.tone}"><i data-lucide="${documentItem.icon}"></i></span><div><h3>${documentItem.title}</h3><p>${documentItem.category} · ${documentItem.date} · ${documentItem.size}</p></div><div class="document-actions"><button class="row-action" type="button" data-document-preview="${documentItem.id}" aria-label="Consulter ${documentItem.title}" title="Consulter"><i data-lucide="eye"></i></button><button class="row-action" type="button" data-document-download="${documentItem.id}" aria-label="Télécharger ${documentItem.title}" title="Télécharger"><i data-lucide="download"></i></button></div></article>`;
}

function notificationsPage() {
  const notifications = state.notifications.filter((notification) => state.notificationFilter === "all" || (state.notificationFilter === "unread" ? !notification.read : notification.type === state.notificationFilter));
  return `<section class="page-view">
    ${pageHeading("Notifications", "Vos opérations, alertes et informations importantes.", `<button class="button button-secondary" type="button" data-notification-action="all-read"><i data-lucide="check-check"></i> Tout marquer comme lu</button>`)}
    <section class="notifications-layout"><div><div class="documents-filter"><button class="filter-chip ${state.notificationFilter === "all" ? "is-active" : ""}" type="button" data-notification-filter="all">Toutes</button><button class="filter-chip ${state.notificationFilter === "unread" ? "is-active" : ""}" type="button" data-notification-filter="unread">Non lues</button><button class="filter-chip ${state.notificationFilter === "operation" ? "is-active" : ""}" type="button" data-notification-filter="operation">Opérations</button><button class="filter-chip ${state.notificationFilter === "alert" ? "is-active" : ""}" type="button" data-notification-filter="alert">Alertes</button><button class="filter-chip ${state.notificationFilter === "security" ? "is-active" : ""}" type="button" data-notification-filter="security">Sécurité</button></div><article class="panel notification-list">${notifications.length ? notifications.map(notificationItem).join("") : "<div class='empty-state'>Aucune notification dans cette catégorie.</div>"}</article></div><aside class="panel notification-insight"><h3>En bref</h3><div class="insight-stat"><span>Solde disponible</span><b>${formatCurrency(12450.8)}</b></div><div class="insight-stat"><span>Budget utilisé</span><b>79 %</b></div><div class="info-box"><i data-lucide="shield-check"></i><p>Vos alertes de sécurité sont actives.</p></div></aside></section>
  </section>`;
}

function notificationItem(notification) {
  return `<article class="notification-item ${notification.read ? "" : "is-unread"}"><span class="round-icon ${notification.tone}"><i data-lucide="${notification.icon}"></i></span><div class="notification-copy"><b>${notification.title}</b><p>${notification.body}</p><small>${notification.date}</small></div><div class="notification-actions">${notification.read ? "" : `<button class="row-action" type="button" data-notification-mark="${notification.id}" aria-label="Marquer comme lu" title="Marquer comme lu"><i data-lucide="check"></i></button>`}<button class="row-action" type="button" data-notification-delete="${notification.id}" aria-label="Supprimer la notification" title="Supprimer"><i data-lucide="trash-2"></i></button></div></article>`;
}

function messagesPage() {
  const active = conversations.find((conversation) => conversation.id === state.activeConversation) || conversations[0];
  return `<section class="page-view">
    ${pageHeading("Messagerie", "Échangez directement avec les équipes FGS Banque.")}
    <section class="messages-layout"><aside class="conversation-list"><div class="conversation-list-header"><h3>Conversations</h3><button class="icon-button" type="button" data-message-action="new" aria-label="Nouvelle conversation" title="Nouvelle conversation"><i data-lucide="square-pen"></i></button></div>${conversations.map((conversation) => conversationChoice(conversation)).join("")}</aside><article class="message-thread"><header class="message-thread-header"><div><h3>${active.name}</h3><p>${active.online ? "Disponible" : active.role}</p></div><button class="icon-button" type="button" data-message-action="details" aria-label="Informations sur la conversation" title="Informations"><i data-lucide="info"></i></button></header><div class="message-scroll" id="messageScroll">${active.messages.map((message) => `<div class="message-bubble ${message.mine ? "mine" : ""}"><p>${escapeHTML(message.text)}</p><small>${message.time}${message.mine && message.read ? " · Lu" : ""}</small></div>`).join("")}</div><form class="message-compose" id="messageForm"><button class="icon-button" type="button" data-message-action="attach" aria-label="Ajouter une pièce jointe" title="Ajouter une pièce jointe"><i data-lucide="paperclip"></i></button><input name="message" type="text" maxlength="500" autocomplete="off" placeholder="Écrire un message" required><button class="icon-button" type="submit" aria-label="Envoyer le message" title="Envoyer"><i data-lucide="send-horizontal"></i></button></form></article></section>
  </section>`;
}

function conversationChoice(conversation) {
  return `<button class="conversation-choice ${conversation.id === state.activeConversation ? "is-active" : ""}" type="button" data-conversation-id="${conversation.id}"><span class="avatar">${conversation.initials}</span><div><b>${conversation.name}</b><span>${conversation.preview}</span></div><div>${conversation.unread ? "<i class='unread-dot'></i>" : ""}<small>${conversation.time}</small></div></button>`;
}

function profilePage() {
  const profile = state.profile;
  const disabled = state.profileEditing ? "" : "disabled";
  return `<section class="page-view">
    ${pageHeading("Mon profil", "Consultez et modifiez vos informations personnelles.", state.profileEditing ? `<button class="button button-secondary" type="button" data-profile-cancel>Annuler</button>` : `<button class="button button-primary" type="button" data-profile-edit><i data-lucide="pencil"></i> Modifier mes informations</button>`)}
    <section class="profile-layout"><aside class="profile-card"><span class="avatar">AM</span><h3>Alex Martin</h3><p>Client FGS depuis janvier 2024</p><div class="profile-stat-line"><span>Statut</span><b>Profil vérifié</b></div><div class="profile-stat-line"><span>Dernière connexion</span><b>Aujourd'hui, 09:04</b></div><div class="profile-stat-line"><span>Conseillère</span><b>Camille Durand</b></div></aside><article class="panel profile-form-card"><h3>Informations personnelles</h3><p>${state.profileEditing ? "Mettez à jour les champs puis enregistrez vos modifications." : "Vos coordonnées sont utilisées pour vous accompagner au quotidien."}</p><form class="profile-form" id="profileForm"><div class="form-grid"><label class="form-field">Prénom<input name="firstName" value="${escapeHTML(profile.firstName)}" ${disabled} required></label><label class="form-field">Nom<input name="lastName" value="${escapeHTML(profile.lastName)}" ${disabled} required></label></div><div class="form-grid"><label class="form-field">Email<input name="email" type="email" value="${escapeHTML(profile.email)}" ${disabled} required></label><label class="form-field">Téléphone<input name="phone" type="tel" value="${escapeHTML(profile.phone)}" ${disabled} required></label></div><div class="form-divider">Adresse</div><label class="form-field">Adresse<input name="address" value="${escapeHTML(profile.address)}" ${disabled} required></label><div class="form-grid"><label class="form-field">Code postal<input name="postalCode" value="${escapeHTML(profile.postalCode)}" ${disabled} required></label><label class="form-field">Ville<input name="city" value="${escapeHTML(profile.city)}" ${disabled} required></label></div>${state.profileEditing ? `<button class="button button-primary" type="submit"><i data-lucide="save"></i> Enregistrer les modifications</button>` : ""}</form></article></section>
  </section>`;
}

function settingsPage() {
  return `<section class="page-view">
    ${pageHeading("Paramètres", "Sécurité, préférences et apparence de votre espace FGS.")}
    <section class="settings-grid">
      <article class="settings-card"><div class="settings-card-head"><div><span class="round-icon blue"><i data-lucide="shield-check"></i></span><div><h3>Sécurité</h3><p>Protégez vos accès.</p></div></div></div>${toggleRow("Authentification biométrique", "Utiliser votre empreinte ou Face ID", "biometric", state.settings.biometric)}${toggleRow("Alertes de sécurité", "Être prévenu en cas d'activité sensible", "securityAlerts", state.settings.securityAlerts)}</article>
      <article class="settings-card"><div class="settings-card-head"><div><span class="round-icon mint"><i data-lucide="bell-ring"></i></span><div><h3>Préférences</h3><p>Choisissez vos alertes.</p></div></div></div>${toggleRow("Notifications de transactions", "Paiements et opérations", "transactionAlerts", state.settings.transactionAlerts)}${toggleRow("Informations FGS", "Actualités et nouveautés", "marketing", state.settings.marketing)}</article>
      <article class="settings-card"><div class="settings-card-head"><div><span class="round-icon sand"><i data-lucide="monitor-smartphone"></i></span><div><h3>Appareils</h3><p>Vos connexions actives.</p></div></div></div><div class="device-list"><div class="device-row"><div><span class="round-icon blue"><i data-lucide="monitor"></i></span><span><b>Windows · Chrome</b><small>Lyon · actif maintenant</small></span></div><span class="status-pill complete">Actuel</span></div><div class="device-row"><div><span class="round-icon mint"><i data-lucide="smartphone"></i></span><span><b>iPhone</b><small>Dernière activité hier</small></span></div><button class="small-action" type="button" data-settings-action="device">Gérer</button></div></div></article>
      <article class="settings-card"><div class="settings-card-head"><div><span class="round-icon blue"><i data-lucide="languages"></i></span><div><h3>Région</h3><p>Langue et devise.</p></div></div></div><div class="form-grid"><label class="form-field">Langue<select data-setting-select="language"><option>Français</option><option>English</option></select></label><label class="form-field">Devise<select data-setting-select="currency"><option>Euro (EUR)</option><option>Dollar (USD)</option></select></label></div></article>
      <article class="settings-card wide"><div class="settings-card-head"><div><span class="round-icon mint"><i data-lucide="sun-moon"></i></span><div><h3>Apparence</h3><p>Choisissez l'ambiance la plus confortable.</p></div></div></div><div class="theme-choice-list"><button class="theme-choice ${state.theme === "light" ? "is-active" : ""}" type="button" data-setting-theme="light"><span class="theme-preview"><i></i><i></i><i></i></span><span>Mode clair</span></button><button class="theme-choice ${state.theme === "dark" ? "is-active" : ""}" type="button" data-setting-theme="dark"><span class="theme-preview dark"><i></i><i></i><i></i></span><span>Mode sombre</span></button></div></article>
    </section>
  </section>`;
}

function faqPage() {
  const items = [
    ["Comment consulter le détail de mes comptes ?", "Ouvrez Mes comptes depuis la navigation. Chaque carte présente le solde, les dernières opérations et un accès à la vue détaillée."],
    ["Puis-je verrouiller ma carte temporairement ?", "Oui. Dans Mes cartes, utilisez le bouton Verrouiller. Vous pouvez la déverrouiller au même endroit lorsque vous le souhaitez."],
    ["Comment préparer un virement ?", "Dans Virements, choisissez le compte source, le bénéficiaire, le montant, le motif et la date. Une confirmation est toujours demandée avant la validation."],
    ["Comment suivre mon objectif d'épargne ?", "La page Epargne centralise le montant atteint, la progression, l'historique et les prochains versements de chaque projet."],
    ["Où vérifier mes appareils connectés ?", "Rendez-vous dans Paramètres, section Appareils. Vous y voyez les appareils actifs et leur dernière activité."],
    ["Comment modifier la langue ou l'apparence ?", "La section Paramètres contient vos préférences de langue, de devise, de notifications et le choix entre mode clair et sombre."],
  ];
  return `<section class="page-view"><section class="faq-layout"><aside class="faq-aside"><p class="eyebrow">Questions fréquentes</p><h3>Une réponse à portée de main.</h3><p>Retrouvez les principaux repères pour gérer votre espace FGS Banque.</p><button class="button button-secondary" type="button" data-page="messages"><i data-lucide="messages-square"></i> Contacter FGS</button></aside><div class="faq-list">${items.map(([question, answer], index) => `<article class="faq-item ${index === 0 ? "is-open" : ""}"><button class="faq-question" type="button" data-faq-id="${index}" aria-expanded="${index === 0}">${question}<i data-lucide="plus"></i></button><div class="faq-answer"><p>${answer}</p></div></article>`).join("")}</div></section></section>`;
}

const pageRenderers = {
  dashboard: dashboardPage,
  accounts: accountsPage,
  transactions: transactionsPage,
  transfers: transfersPage,
  cards: cardsPage,
  savings: savingsPage,
  budget: budgetPage,
  documents: documentsPage,
  notifications: notificationsPage,
  messages: messagesPage,
  profile: profilePage,
  settings: settingsPage,
  faq: faqPage,
};

function mountChartsForPage(page) {
  const ink = colorVariable("--ink");
  const muted = colorVariable("--muted");
  const line = colorVariable("--line");
  const blue = colorVariable("--blue-700");
  const teal = colorVariable("--teal");
  const gold = colorVariable("--gold");
  const red = colorVariable("--red");
  const surface = colorVariable("--surface");
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 550 },
    plugins: { legend: { display: false }, tooltip: { backgroundColor: colorVariable("--navy"), titleFont: { family: "Manrope" }, bodyFont: { family: "DM Sans" }, padding: 10, displayColors: false } },
  };
  const lineOptions = {
    ...commonOptions,
    scales: {
      x: { grid: { display: false }, ticks: { color: muted, font: { family: "DM Sans", size: 10 } }, border: { display: false } },
      y: { grid: { color: line }, ticks: { color: muted, font: { family: "DM Sans", size: 10 }, maxTicksLimit: 4 }, border: { display: false } },
    },
  };

  if (page === "dashboard") {
    createChart("balanceChart", {
      type: "line",
      data: { labels: ["Avr.", "Mai", "Juin", "Juil.", "Août", "Sept."], datasets: [{ data: [38500, 39150, 39460, 40720, 41980, 42500], borderColor: blue, backgroundColor: "rgba(32, 144, 206, 0.10)", fill: true, tension: 0.42, borderWidth: 3, pointRadius: 0, pointHoverRadius: 4, pointBackgroundColor: blue }] },
      options: { ...lineOptions, scales: { ...lineOptions.scales, y: { ...lineOptions.scales.y, ticks: { ...lineOptions.scales.y.ticks, callback: (value) => `${Math.round(value / 1000)} k` } } } },
    });
  }

  if (page === "accounts") {
    createChart("assetBreakdownChart", {
      type: "doughnut",
      data: { labels: accounts.map((account) => account.name), datasets: [{ data: accounts.map((account) => account.balance), backgroundColor: [blue, teal, gold], borderColor: surface, borderWidth: 4, hoverOffset: 5 }] },
      options: { ...commonOptions, cutout: "68%" },
    });
  }

  if (page === "cards") {
    createChart("cardSpendChart", {
      type: "bar",
      data: { labels: ["S1", "S2", "S3", "S4"], datasets: [{ data: [142, 188, 231, 121], backgroundColor: [blue, blue, teal, gold], borderRadius: 4, borderSkipped: false }] },
      options: { ...lineOptions, scales: { ...lineOptions.scales, y: { ...lineOptions.scales.y, ticks: { ...lineOptions.scales.y.ticks, callback: (value) => `${value} EUR` } } } },
    });
  }

  if (page === "savings") {
    createChart("savingsHistoryChart", {
      type: "line",
      data: { labels: ["Avr.", "Mai", "Juin", "Juil.", "Août", "Sept."], datasets: [{ data: [21600, 22400, 23350, 24100, 25050, 25800], borderColor: teal, backgroundColor: "rgba(14, 138, 117, 0.11)", fill: true, tension: 0.42, borderWidth: 3, pointRadius: 0 }] },
      options: { ...lineOptions, scales: { x: { display: false }, y: { display: false } }, plugins: { ...commonOptions.plugins, tooltip: { ...commonOptions.plugins.tooltip, callbacks: { label: (context) => formatCurrency(context.raw) } } } },
    });
  }

  if (page === "budget") {
    createChart("budgetDoughnutChart", {
      type: "doughnut",
      data: { labels: budgetCategories.map((item) => item.name), datasets: [{ data: budgetCategories.map((item) => item.spent), backgroundColor: [blue, teal, gold, "#4f8bb3", "#75bfa6", red], borderColor: surface, borderWidth: 4, hoverOffset: 5 }] },
      options: { ...commonOptions, cutout: "65%" },
    });
    createChart("budgetTrendChart", {
      type: "line",
      data: { labels: ["Mai", "Juin", "Juil.", "Août", "Sept."], datasets: [{ data: [1890, 2070, 1935, 2108, 2210], borderColor: blue, backgroundColor: "rgba(32, 144, 206, 0.08)", fill: true, tension: 0.42, borderWidth: 3, pointRadius: 0 }] },
      options: { ...lineOptions, scales: { ...lineOptions.scales, y: { ...lineOptions.scales.y, ticks: { ...lineOptions.scales.y.ticks, callback: (value) => `${value / 1000} k` } } } },
    });
  }

  void ink;
}

function filterTransactions() {
  const search = $("#transactionSearch")?.value.trim().toLocaleLowerCase("fr") || "";
  const type = $("#transactionType")?.value || "all";
  const period = $("#transactionPeriod")?.value || "all";
  const sort = $("#transactionSort")?.value || "newest";
  const reference = new Date("2026-09-08T12:00:00");
  const filtered = transactions.filter((transaction) => {
    const searchable = `${transaction.description} ${transaction.detail} ${transaction.category}`.toLocaleLowerCase("fr");
    const typeMatches = type === "all" || (type === "credit" ? transaction.amount >= 0 : transaction.amount < 0);
    const dateMatches = period === "all" || new Date(`${transaction.date}T12:00:00`) >= new Date(reference.getTime() - Number(period) * 86400000);
    return searchable.includes(search) && typeMatches && dateMatches;
  });

  filtered.sort((first, second) => {
    if (sort === "oldest") return new Date(first.date) - new Date(second.date);
    if (sort === "highest") return second.amount - first.amount;
    if (sort === "lowest") return first.amount - second.amount;
    return new Date(second.date) - new Date(first.date);
  });

  const tbody = $("#transactionTableBody");
  if (tbody) {
    tbody.innerHTML = transactionTableRows(filtered);
    refreshIcons();
  }
}

function openAccountModal(accountId) {
  const account = accounts.find((entry) => entry.id === accountId);
  if (!account) return;
  const recentOperations = account.operations.map((operation) => `<div><span>${escapeHTML(operation.label)}<small>${operation.date}</small></span><b class="${operation.amount >= 0 ? "credit" : ""}">${formatSignedCurrency(operation.amount)}</b></div>`).join("");
  openModal(`<button class="icon-button modal-close" type="button" data-modal-close aria-label="Fermer" title="Fermer"><i data-lucide="x"></i></button><div class="modal-title-row"><span class="round-icon ${account.tone}"><i data-lucide="${account.icon}"></i></span><div><h2 id="modalTitle">${account.name}</h2><p class="modal-description">${account.type} · ${account.number}</p></div></div><strong class="confirmation-amount">${formatCurrency(account.balance)}</strong><div class="detail-list">${recentOperations}</div><div class="modal-actions"><button class="button button-secondary" type="button" data-modal-close>Fermer</button><button class="button button-primary" type="button" data-page="transactions">Voir les transactions <i data-lucide="arrow-right"></i></button></div>`);
}

function openTransactionModal(transactionId) {
  const transaction = transactions.find((entry) => entry.id === transactionId);
  if (!transaction) return;
  openModal(`<button class="icon-button modal-close" type="button" data-modal-close aria-label="Fermer" title="Fermer"><i data-lucide="x"></i></button><div class="modal-title-row"><span class="round-icon ${transaction.tone}"><i data-lucide="${transaction.icon}"></i></span><div><h2 id="modalTitle">${transaction.description}</h2><p class="modal-description">${transaction.detail}</p></div></div><strong class="confirmation-amount ${transaction.amount >= 0 ? "credit" : ""}">${formatSignedCurrency(transaction.amount)}</strong><div class="detail-list"><div><span>Date</span><b>${formatDate(transaction.date, { day: "numeric", month: "long", year: "numeric" })}</b></div><div><span>Catégorie</span><b>${transaction.category}</b></div><div><span>Compte</span><b>${transaction.account}</b></div><div><span>Statut</span><b>${transaction.status}</b></div><div><span>Référence</span><b>${transaction.id.toUpperCase()}</b></div></div><div class="modal-actions"><button class="button button-secondary" type="button" data-modal-close>Fermer</button><button class="button button-primary" type="button" data-document-download="doc-01"><i data-lucide="download"></i> Télécharger</button></div>`);
}

function showTransferConfirmation() {
  const transfer = state.pendingTransfer;
  if (!transfer) return;
  const source = accounts.find((account) => account.id === transfer.source);
  openModal(`<button class="icon-button modal-close" type="button" data-modal-close aria-label="Fermer" title="Fermer"><i data-lucide="x"></i></button><div class="modal-title-row"><span class="round-icon blue"><i data-lucide="shield-check"></i></span><div><h2 id="modalTitle">Confirmer le virement</h2><p class="modal-description">Le montant sera débité du compte sélectionné dès votre validation.</p></div></div><strong class="confirmation-amount">${formatCurrency(transfer.amount)}</strong><div class="detail-list"><div><span>Depuis</span><b>${source?.name || "Compte courant"}</b></div><div><span>Vers</span><b>${escapeHTML(transfer.beneficiaryName)}</b></div><div><span>E-mail du bénéficiaire</span><b>${escapeHTML(transfer.beneficiaryEmail)}</b></div><div><span>Réception estimée</span><b>Au plus tard le ${formatDate(transfer.estimatedArrival, { day: "numeric", month: "long", year: "numeric" })}</b></div><div><span>Mon e-mail de suivi</span><b>${escapeHTML(transfer.senderEmail)}</b></div><div><span>Motif</span><b>${escapeHTML(transfer.reason || "Sans motif")}</b></div><div><span>Frais</span><b>0,00 EUR</b></div></div><div class="info-box"><i data-lucide="clock-3"></i><p>Le statut restera « En cours » pendant un délai estimé de 3 jours ouvrés.</p></div><div class="modal-actions"><button class="button button-secondary" type="button" data-modal-close>Modifier</button><button class="button button-primary" type="button" data-modal-action="confirm-transfer">Débiter et confirmer <i data-lucide="check"></i></button></div>`);
}

function confirmTransfer() {
  const transfer = state.pendingTransfer;
  if (!transfer) return;
  const source = accounts.find((account) => account.id === transfer.source);
  if (!source) return;

  source.balance = Number((source.balance - transfer.amount).toFixed(2));
  source.operations.unshift({ label: `Virement à ${transfer.beneficiaryName}`, date: formatDate(transfer.date, { day: "numeric", month: "short" }), amount: -transfer.amount });
  transactions.unshift({
    id: `tx-${Date.now()}`,
    date: transfer.date,
    description: `Virement à ${transfer.beneficiaryName}`,
    detail: `En cours · arrivée estimée le ${formatDate(transfer.estimatedArrival, { day: "numeric", month: "short" })}`,
    category: "Virements",
    icon: "arrow-up-right",
    tone: "blue",
    amount: -transfer.amount,
    status: "En cours",
    statusClass: "pending",
    account: source.name,
    beneficiaryEmail: transfer.beneficiaryEmail,
    expectedDate: transfer.estimatedArrival,
  });
  if (transfer.saveBeneficiary) {
    const existingBeneficiary = state.beneficiaries.find((beneficiary) => beneficiary.email.toLocaleLowerCase("fr") === transfer.beneficiaryEmail.toLocaleLowerCase("fr"));
    if (existingBeneficiary) {
      existingBeneficiary.name = transfer.beneficiaryName;
    } else {
      state.beneficiaries.push({ id: `beneficiary-${Date.now()}`, name: transfer.beneficiaryName, email: transfer.beneficiaryEmail });
    }
  }
  const beneficiaryEmail = createTransferEmail(transfer, source, "beneficiary");
  const senderEmail = createTransferEmail(transfer, source, "sender");
  state.emailOutbox.unshift(senderEmail, beneficiaryEmail);
  state.notifications.unshift({ id: `note-${Date.now()}`, type: "operation", icon: "clock-3", tone: "blue", title: "Virement en cours", body: `${formatCurrency(transfer.amount)} ont été débités de votre ${source.name}. Réception estimée le ${formatDate(transfer.estimatedArrival, { day: "numeric", month: "long" })}.`, date: "À l'instant", read: false });
  state.pendingTransfer = null;
  renderApp();
  openModal(`<div class="success-state"><span class="success-icon"><i data-lucide="clock-3"></i></span><h2 id="modalTitle">Virement en cours</h2><p>${formatCurrency(transfer.amount)} ont été débités de votre ${escapeHTML(source.name)}. La réception par ${escapeHTML(transfer.beneficiaryName)} est estimée au plus tard le ${formatDate(transfer.estimatedArrival, { day: "numeric", month: "long", year: "numeric" })}.</p><div class="detail-list"><div><span>Statut</span><b>En cours</b></div><div><span>Suivi destinataire</span><b>${escapeHTML(transfer.beneficiaryEmail)}</b></div><div><span>Mon e-mail de suivi</span><b>${escapeHTML(transfer.senderEmail)}</b></div></div><div class="modal-actions"><button class="button button-secondary" type="button" data-modal-action="preview-transfer-emails"><i data-lucide="mail"></i> Voir les e-mails générés</button><button class="button button-primary" type="button" data-modal-close>Terminé</button></div></div>`);
  showToast("Virement en cours", "Le compte sélectionné a été débité. Réception estimée sous 3 jours ouvrés.", "success");
}

function openTransferEmailPreviews() {
  const emails = state.emailOutbox.slice(0, 2);
  if (!emails.length) return;
  const previews = emails.map((email) => `<article class="email-preview"><div class="email-preview-head"><div><span>À</span><b>${escapeHTML(email.to)}</b></div><span class="status-pill pending">Brouillon</span></div><div class="email-preview-subject"><span>Objet</span><b>${escapeHTML(email.subject)}</b></div><p>${escapeHTML(email.body).replace(/\n/g, "<br>")}</p><button class="button button-secondary" type="button" data-email-draft-id="${email.id}"><i data-lucide="external-link"></i> Ouvrir le brouillon Gmail</button></article>`).join("");
  openModal(`<button class="icon-button modal-close" type="button" data-modal-close aria-label="Fermer" title="Fermer"><i data-lucide="x"></i></button><div class="modal-title-row"><span class="round-icon blue"><i data-lucide="mail-check"></i></span><div><h2 id="modalTitle">E-mails de suivi générés</h2><p class="modal-description">Les messages sont prêts à être ouverts comme brouillons Gmail.</p></div></div><div class="info-box"><i data-lucide="info"></i><p>Dans cette interface HTML, aucun e-mail n'est expédié automatiquement. Le bouton ouvre un brouillon dans Gmail, où vous gardez la maîtrise de l'envoi.</p></div><div class="email-preview-list">${previews}</div><div class="modal-actions"><button class="button button-primary" type="button" data-modal-close>Terminé</button></div>` , true);
}

function openGmailDraft(emailId) {
  const email = state.emailOutbox.find((entry) => entry.id === emailId);
  if (!email) return;
  const url = new URL("https://mail.google.com/mail/?view=cm&fs=1");
  url.searchParams.set("to", email.to);
  url.searchParams.set("su", email.subject);
  url.searchParams.set("body", email.body);
  window.open(url.toString(), "_blank", "noopener,noreferrer");
  showToast("Brouillon Gmail ouvert", "Vérifiez le message puis envoyez-le depuis votre boîte Gmail.", "info");
}

function openCardInformation() {
  openModal(`<button class="icon-button modal-close" type="button" data-modal-close aria-label="Fermer" title="Fermer"><i data-lucide="x"></i></button><div class="modal-title-row"><span class="round-icon blue"><i data-lucide="credit-card"></i></span><div><h2 id="modalTitle">Informations carte</h2><p class="modal-description">FGS Premium · usage confidentiel</p></div></div><div class="card-secret"><span>Numéro de carte</span><b>4481 7612 3094 4812</b><span>Expire le 09/29 · Code de sécurité 382</span></div><div class="detail-list"><div><span>Statut</span><b>${state.cardLocked ? "Verrouillée" : "Active"}</b></div><div><span>Paiements en ligne</span><b>${state.cardOnline ? "Autorisés" : "Désactivés"}</b></div></div><div class="modal-actions"><button class="button button-primary" type="button" data-modal-close>J'ai terminé</button></div>`);
}

function openDocumentPreview(documentId) {
  const documentItem = documentsData.find((entry) => entry.id === documentId);
  if (!documentItem) return;
  openModal(`<button class="icon-button modal-close" type="button" data-modal-close aria-label="Fermer" title="Fermer"><i data-lucide="x"></i></button><div class="modal-title-row"><span class="round-icon ${documentItem.tone}"><i data-lucide="${documentItem.icon}"></i></span><div><h2 id="modalTitle">${documentItem.title}</h2><p class="modal-description">${documentItem.category} · ${documentItem.date}</p></div></div><div class="card-secret"><span>Document disponible</span><b>${documentItem.size}</b><span>Ce document est prêt à être consulté et téléchargé.</span></div><div class="detail-list"><div><span>Type</span><b>PDF</b></div><div><span>Catégorie</span><b>${documentItem.category}</b></div><div><span>Date</span><b>${documentItem.date}</b></div></div><div class="modal-actions"><button class="button button-secondary" type="button" data-modal-close>Fermer</button><button class="button button-primary" type="button" data-document-download="${documentItem.id}"><i data-lucide="download"></i> Télécharger</button></div>`);
}

function downloadDocument(documentId) {
  const documentItem = documentsData.find((entry) => entry.id === documentId) || documentsData[0];
  const content = `FGS BANQUE\n\n${documentItem.title}\n\nCatégorie : ${documentItem.category}\nDate : ${documentItem.date}\n\nDocument généré depuis votre espace FGS Banque.`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${documentItem.title.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
  showToast("Téléchargement lancé", `${documentItem.title} est prêt.`, "success");
}

function handleCardAction(action) {
  if (action === "lock") {
    state.cardLocked = !state.cardLocked;
    renderApp();
    showToast(state.cardLocked ? "Carte verrouillée" : "Carte déverrouillée", state.cardLocked ? "Les nouveaux paiements sont momentanément bloqués." : "Votre carte peut de nouveau être utilisée.", state.cardLocked ? "warning" : "success");
  }
  if (action === "info") openCardInformation();
  if (action === "preferences") setPage("settings");
}

function handleToggleSetting(setting) {
  if (Object.hasOwn(state, setting)) {
    state[setting] = !state[setting];
    renderApp();
    showToast("Réglage mis à jour", "Votre préférence a été enregistrée.", "success");
    return;
  }
  if (Object.hasOwn(state.settings, setting)) {
    state.settings[setting] = !state.settings[setting];
    renderApp();
    showToast("Préférence mise à jour", "Votre choix est pris en compte.", "success");
  }
}

function handleSavingsAction(action) {
  if (action === "add") {
    openModal(`<button class="icon-button modal-close" type="button" data-modal-close aria-label="Fermer" title="Fermer"><i data-lucide="x"></i></button><div class="modal-title-row"><span class="round-icon mint"><i data-lucide="piggy-bank"></i></span><div><h2 id="modalTitle">Alimenter un projet</h2><p class="modal-description">Choisissez le prochain geste pour votre épargne.</p></div></div><div class="detail-list"><div><span>Projet sélectionné</span><b>Projet Voyage</b></div><div><span>Solde disponible</span><b>${formatCurrency(12450.8)}</b></div></div><div class="modal-actions"><button class="button button-secondary" type="button" data-modal-close>Plus tard</button><button class="button button-primary" type="button" data-savings-action="confirm-add">Verser 100 EUR</button></div>`);
    return;
  }
  if (action === "confirm-add") {
    closeModal();
    showToast("Versement préparé", "100,00 EUR sont prêts à être ajoutés à votre Projet Voyage.", "success");
    return;
  }
  showToast("Objectif sélectionné", "Vous pouvez ajuster ce projet depuis cette vue.", "info");
}

function sendMessage(form) {
  const input = $("input[name='message']", form);
  const text = input?.value.trim();
  if (!text) return;
  const conversation = conversations.find((entry) => entry.id === state.activeConversation);
  if (!conversation) return;
  conversation.messages.push({ mine: true, text, time: "À l'instant", read: false });
  conversation.preview = text;
  conversation.time = "Maintenant";
  conversation.unread = false;
  renderApp();
  showToast("Message envoyé", `Votre message a été envoyé à ${conversation.name}.`, "success");
}

function updateProfile(form) {
  const formData = new FormData(form);
  Object.keys(state.profile).forEach((key) => {
    state.profile[key] = String(formData.get(key) || "").trim();
  });
  state.profileEditing = false;
  renderApp();
  showToast("Profil mis à jour", "Vos informations ont été enregistrées.", "success");
}

function handleClick(event) {
  const loginOpen = event.target.closest("[data-login-open]");
  if (loginOpen) {
    event.preventDefault();
    openLogin();
    return;
  }

  const loginClose = event.target.closest("[data-login-close]");
  if (loginClose) {
    event.preventDefault();
    closeLogin();
    return;
  }

  const publicMenu = event.target.closest("[data-public-menu-toggle]");
  if (publicMenu) {
    $("#publicMobileNav").classList.toggle("is-open");
    return;
  }

  const mobileToggle = event.target.closest("[data-mobile-nav-toggle]");
  if (mobileToggle) {
    toggleMobileNav();
    return;
  }

  const closeModalButton = event.target.closest("[data-modal-close]");
  if (closeModalButton) {
    closeModal();
    return;
  }

  const themeToggle = event.target.closest("[data-theme-toggle]");
  if (themeToggle) {
    toggleTheme();
    return;
  }

  const passwordToggle = event.target.closest("[data-password-toggle]");
  if (passwordToggle) {
    const input = $("input", passwordToggle.parentElement);
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    passwordToggle.innerHTML = `<i data-lucide="${isPassword ? "eye-off" : "eye"}"></i>`;
    passwordToggle.setAttribute("aria-label", isPassword ? "Masquer le mot de passe" : "Afficher le mot de passe");
    passwordToggle.setAttribute("title", isPassword ? "Masquer le mot de passe" : "Afficher le mot de passe");
    refreshIcons();
    return;
  }

  const forgotPassword = event.target.closest("[data-forgot-password]");
  if (forgotPassword) {
    showToast("Réinitialisation demandée", "Un lien de réinitialisation a été préparé pour votre adresse email.", "info");
    return;
  }

  const pageButton = event.target.closest("[data-page]");
  if (pageButton) {
    event.preventDefault();
    closeModal();
    setPage(pageButton.dataset.page);
    return;
  }

  const commandButton = event.target.closest("[data-command]");
  if (commandButton) {
    const routes = { transfer: "transfers", transactions: "transactions", cards: "cards", savings: "savings" };
    if (commandButton.dataset.command === "statement") {
      downloadDocument("doc-01");
    } else {
      setPage(routes[commandButton.dataset.command]);
    }
    return;
  }

  const accountButton = event.target.closest("[data-account-id]");
  if (accountButton) {
    openAccountModal(accountButton.dataset.accountId);
    return;
  }

  const transactionButton = event.target.closest("[data-transaction-id]");
  if (transactionButton) {
    openTransactionModal(transactionButton.dataset.transactionId);
    return;
  }

  const modalAction = event.target.closest("[data-modal-action]");
  if (modalAction?.dataset.modalAction === "confirm-transfer") {
    confirmTransfer();
    return;
  }

  if (modalAction?.dataset.modalAction === "preview-transfer-emails") {
    openTransferEmailPreviews();
    return;
  }

  const emailDraft = event.target.closest("[data-email-draft-id]");
  if (emailDraft) {
    openGmailDraft(emailDraft.dataset.emailDraftId);
    return;
  }

  const beneficiaryButton = event.target.closest("[data-beneficiary-id]");
  if (beneficiaryButton) {
    const beneficiary = state.beneficiaries.find((entry) => entry.id === beneficiaryButton.dataset.beneficiaryId);
    const form = $("#transferForm");
    if (beneficiary && form) {
      form.elements.beneficiaryName.value = beneficiary.name;
      form.elements.beneficiaryEmail.value = beneficiary.email;
      showToast("Bénéficiaire sélectionné", `${beneficiary.name} a été ajouté au formulaire.`, "info");
    }
    return;
  }

  const cardAction = event.target.closest("[data-card-action]");
  if (cardAction) {
    handleCardAction(cardAction.dataset.cardAction);
    return;
  }

  const toggleSetting = event.target.closest("[data-toggle-setting]");
  if (toggleSetting) {
    handleToggleSetting(toggleSetting.dataset.toggleSetting);
    return;
  }

  const savingsAction = event.target.closest("[data-savings-action]");
  if (savingsAction) {
    handleSavingsAction(savingsAction.dataset.savingsAction);
    return;
  }

  const budgetAction = event.target.closest("[data-budget-action]");
  if (budgetAction) {
    showToast("Budgets prêts à être ajustés", "Choisissez une catégorie pour modifier son enveloppe.", "info");
    return;
  }

  const documentFilter = event.target.closest("[data-document-filter]");
  if (documentFilter) {
    state.documentFilter = documentFilter.dataset.documentFilter;
    renderApp();
    return;
  }

  const documentPreview = event.target.closest("[data-document-preview]");
  if (documentPreview) {
    openDocumentPreview(documentPreview.dataset.documentPreview);
    return;
  }

  const documentDownload = event.target.closest("[data-document-download]");
  if (documentDownload) {
    downloadDocument(documentDownload.dataset.documentDownload);
    return;
  }

  const notificationFilter = event.target.closest("[data-notification-filter]");
  if (notificationFilter) {
    state.notificationFilter = notificationFilter.dataset.notificationFilter;
    renderApp();
    return;
  }

  const markNotification = event.target.closest("[data-notification-mark]");
  if (markNotification) {
    const notification = state.notifications.find((entry) => entry.id === markNotification.dataset.notificationMark);
    if (notification) notification.read = true;
    renderApp();
    return;
  }

  const deleteNotification = event.target.closest("[data-notification-delete]");
  if (deleteNotification) {
    state.notifications = state.notifications.filter((entry) => entry.id !== deleteNotification.dataset.notificationDelete);
    renderApp();
    showToast("Notification supprimée", "Elle a été retirée de votre centre de notifications.", "info");
    return;
  }

  const notificationAction = event.target.closest("[data-notification-action]");
  if (notificationAction?.dataset.notificationAction === "all-read") {
    state.notifications.forEach((notification) => { notification.read = true; });
    renderApp();
    showToast("Notifications mises à jour", "Toutes les notifications sont maintenant lues.", "success");
    return;
  }

  const conversationButton = event.target.closest("[data-conversation-id]");
  if (conversationButton) {
    const conversation = conversations.find((entry) => entry.id === conversationButton.dataset.conversationId);
    if (conversation) conversation.unread = false;
    state.activeConversation = conversationButton.dataset.conversationId;
    renderApp();
    return;
  }

  const messageAction = event.target.closest("[data-message-action]");
  if (messageAction) {
    const action = messageAction.dataset.messageAction;
    if (action === "attach") showToast("Pièce jointe ajoutée", "Votre document est prêt à être envoyé avec le prochain message.", "success");
    if (action === "new") showToast("Nouvelle conversation", "Choisissez un sujet pour contacter l'équipe FGS.", "info");
    if (action === "details") showToast("Conversation sécurisée", "Vos échanges avec l'équipe FGS sont disponibles dans cet espace.", "info");
    return;
  }

  const profileEdit = event.target.closest("[data-profile-edit]");
  if (profileEdit) {
    state.profileEditing = true;
    renderApp();
    return;
  }

  const profileCancel = event.target.closest("[data-profile-cancel]");
  if (profileCancel) {
    state.profileEditing = false;
    renderApp();
    return;
  }

  const settingTheme = event.target.closest("[data-setting-theme]");
  if (settingTheme) {
    applyTheme(settingTheme.dataset.settingTheme);
    renderApp();
    return;
  }

  const settingsAction = event.target.closest("[data-settings-action]");
  if (settingsAction) {
    showToast("Appareils", "La gestion détaillée de vos appareils est disponible ici.", "info");
    return;
  }

  const faqQuestion = event.target.closest("[data-faq-id]");
  if (faqQuestion) {
    const item = faqQuestion.closest(".faq-item");
    const opening = !item.classList.contains("is-open");
    item.classList.toggle("is-open", opening);
    faqQuestion.setAttribute("aria-expanded", String(opening));
  }
}

function handleSubmit(event) {
  if (event.target.id === "loginForm") {
    event.preventDefault();
    enterApp();
    return;
  }

  if (event.target.id === "transferForm") {
    event.preventDefault();
    const formData = new FormData(event.target);
    const amount = Number(formData.get("amount"));
    if (!Number.isFinite(amount) || amount <= 0) {
      showToast("Montant requis", "Saisissez un montant supérieur à zéro.", "error");
      return;
    }
    const source = accounts.find((account) => account.id === formData.get("source"));
    if (source && amount > source.balance) {
      showToast("Solde insuffisant", "Le montant dépasse le solde disponible du compte sélectionné.", "error");
      return;
    }
    const beneficiaryName = String(formData.get("beneficiaryName") || "").trim();
    const beneficiaryEmail = String(formData.get("beneficiaryEmail") || "").trim().toLocaleLowerCase("fr");
    const senderEmail = String(formData.get("senderEmail") || "").trim().toLocaleLowerCase("fr");
    if (!beneficiaryName || !beneficiaryEmail || !senderEmail) {
      showToast("Coordonnées requises", "Renseignez le nom et l'e-mail du bénéficiaire, ainsi que votre e-mail de suivi.", "error");
      return;
    }
    const requestDate = String(formData.get("date"));
    state.pendingTransfer = {
      source: String(formData.get("source")),
      beneficiaryName,
      beneficiaryEmail,
      senderEmail,
      amount,
      reason: String(formData.get("reason") || "").trim(),
      date: requestDate,
      estimatedArrival: addBusinessDays(requestDate, 3),
      saveBeneficiary: formData.get("saveBeneficiary") === "on",
    };
    showTransferConfirmation();
    return;
  }

  if (event.target.id === "messageForm") {
    event.preventDefault();
    sendMessage(event.target);
    return;
  }

  if (event.target.id === "profileForm") {
    event.preventDefault();
    updateProfile(event.target);
  }
}

function handleInput(event) {
  if (event.target.matches("[data-transaction-control]")) {
    filterTransactions();
  }
}

function handleChange(event) {
  if (event.target.matches("[data-transaction-control]")) {
    filterTransactions();
  }
  if (event.target.matches("[data-setting-select]")) {
    showToast("Préférence mise à jour", `${event.target.dataset.settingSelect === "language" ? "Langue" : "Devise"} : ${event.target.value}`, "success");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(state.theme, false);
  refreshIcons();
  $("#publicMobileNav")?.addEventListener("click", () => {
    $("#publicMobileNav").classList.remove("is-open");
  });
});

document.addEventListener("click", handleClick);
document.addEventListener("submit", handleSubmit);
document.addEventListener("input", handleInput);
document.addEventListener("change", handleChange);
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeModal();
  closeLogin();
  closeMobileNav();
});
