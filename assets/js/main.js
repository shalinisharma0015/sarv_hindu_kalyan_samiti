document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    }));
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        nav.classList.remove("open"); toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false"); document.body.classList.remove("menu-open");
      }
    });
  }

  // Reveal sections as they enter the viewport.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add("visible"));

  // Update active navigation based on the current page.
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a[data-page]").forEach(link => {
    if (link.dataset.page === current) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // Membership contribution selection display.
  const amountInputs = document.querySelectorAll('input[name="membership-amount"]');
  const amountDisplay = document.querySelector("[data-selected-amount]");
  function updateAmount() {
    const chosen = document.querySelector('input[name="membership-amount"]:checked');
    if (chosen && amountDisplay) amountDisplay.textContent = "₹" + Number(chosen.value).toLocaleString("en-IN");
    document.querySelectorAll(".amount-option").forEach(label => {
      const input = label.querySelector("input");
      label.classList.toggle("selected", !!input && input.checked);
    });
  }
  amountInputs.forEach(input => input.addEventListener("change", updateAmount));
  updateAmount();

  // Frontend demo form feedback. No personal data is transmitted.
  document.querySelectorAll("form[data-demo-form]").forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const toast = document.querySelector(".toast") || createToast();
      toast.textContent = form.dataset.success || "धन्यवाद! यह डेमो फॉर्म है। वास्तविक सबमिशन के लिए बैकएंड/API जोड़ना होगा।";
      toast.classList.add("show");
      window.clearTimeout(window.__toastTimer);
      window.__toastTimer = window.setTimeout(() => toast.classList.remove("show"), 4200);
      form.reset();
      updateAmount();
    });
  });

  // Donation quick amounts, if present.
  document.querySelectorAll("[data-donation-amount]").forEach(button => {
    button.addEventListener("click", () => {
      const input = document.querySelector("#donation-amount");
      if (input) input.value = button.dataset.donationAmount;
      document.querySelectorAll("[data-donation-amount]").forEach(b => b.classList.toggle("selected", b === button));
    });
  });

  // Footer year.
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  function createToast() {
    const el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    document.body.appendChild(el);
    return el;
  }
});
