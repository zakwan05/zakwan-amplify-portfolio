(() => {
  const BOOT_KEY = "zakwan-stack-boot-seen-v1";
  const TRAFFIC_KEY = "zakwan-canary-traffic";

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /** @type {(msg: string) => void} */
  const logTrail = (msg) => {
    const list = document.getElementById("trail-log");
    if (!list) return;
    const li = document.createElement("li");
    const ts = new Date().toISOString();
    li.textContent = `${ts}  ${msg}`;
    list.prepend(li);
    while (list.children.length > 40) list.lastElementChild?.remove();
  };

  // --- Mobile nav ---
  const navToggle = document.getElementById("nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  navToggle?.addEventListener("click", () => {
    const open = mobileNav?.hasAttribute("hidden") === false;
    if (!mobileNav || !navToggle) return;
    if (open) {
      mobileNav.hidden = true;
      navToggle.setAttribute("aria-expanded", "false");
    } else {
      mobileNav.hidden = false;
      navToggle.setAttribute("aria-expanded", "true");
      logTrail("EVENT mobile_nav OPEN");
    }
  });

  mobileNav?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      if (!mobileNav || !navToggle) return;
      mobileNav.hidden = true;
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // --- CloudTrail panel ---
  const trailToggle = document.getElementById("trail-toggle");
  const trailPanel = document.getElementById("trail-panel");
  trailToggle?.addEventListener("click", () => {
    if (!trailPanel || !trailToggle) return;
    const willOpen = trailPanel.hidden;
    trailPanel.hidden = !willOpen;
    trailToggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
    logTrail(willOpen ? "EVENT cloudtrail OPEN" : "EVENT cloudtrail CLOSE");
  });

  // --- Canary traffic shift (creative feature) ---
  const traffic = document.getElementById("traffic");
  const stablePct = document.getElementById("stable-pct");
  const canaryPct = document.getElementById("canary-pct");

  const applyTraffic = (value) => {
    const canary = Math.max(0, Math.min(100, Number(value) || 0));
    const stable = 100 - canary;
    if (stablePct) stablePct.textContent = String(stable);
    if (canaryPct) canaryPct.textContent = String(canary);
    document.documentElement.dataset.canary = String(canary);
    // Switch skin at 50% like a canary promotion threshold
    document.documentElement.dataset.env = canary >= 50 ? "canary" : "stable";
    try {
      localStorage.setItem(TRAFFIC_KEY, String(canary));
    } catch {
      /* ignore */
    }
  };

  let saved = 0;
  try {
    saved = Number(localStorage.getItem(TRAFFIC_KEY) || "0");
  } catch {
    saved = 0;
  }
  if (traffic) {
    traffic.value = String(saved);
    applyTraffic(saved);
    traffic.addEventListener("input", () => {
      applyTraffic(traffic.value);
      logTrail(
        `EVENT traffic_shift canary=${traffic.value}% env=${document.documentElement.dataset.env}`,
      );
    });
  }

  // --- Navigation / section trail ---
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href") || "#";
      logTrail(`EVENT navigate target=${href}`);
    });
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          logTrail(`EVENT section_view id=${entry.target.id}`);
        }
      });
    },
    { threshold: 0.45 },
  );
  document.querySelectorAll("main section[id]").forEach((sec) => sectionObserver.observe(sec));

  // --- Stack deploy theater ---
  const boot = document.getElementById("stack-boot");
  const eventsUl = document.getElementById("stack-events");
  const skipBoot = document.getElementById("skip-boot");
  const replay = document.getElementById("replay-deploy");

  const STACK_STEPS = [
    { status: "CREATE_IN_PROGRESS", resource: "AboutMeSection", cls: "busy" },
    { status: "CREATE_COMPLETE", resource: "AboutMeSection", cls: "ok" },
    { status: "CREATE_IN_PROGRESS", resource: "SkillsBoard", cls: "busy" },
    { status: "CREATE_COMPLETE", resource: "SkillsBoard", cls: "ok" },
    { status: "CREATE_IN_PROGRESS", resource: "ProjectsHistory", cls: "busy" },
    { status: "CREATE_COMPLETE", resource: "ProjectsHistory", cls: "ok" },
    { status: "CREATE_IN_PROGRESS", resource: "CanaryTrafficShift", cls: "busy" },
    { status: "CREATE_COMPLETE", resource: "CanaryTrafficShift", cls: "ok" },
    { status: "UPDATE_COMPLETE", resource: "zakwan-portfolio", cls: "ok" },
  ];

  let bootTimer = 0;

  const finishBoot = () => {
    window.clearTimeout(bootTimer);
    if (boot) boot.hidden = true;
    try {
      localStorage.setItem(BOOT_KEY, "1");
    } catch {
      /* ignore */
    }
    logTrail("EVENT stack_deploy COMPLETE");
  };

  const runBoot = ({ force = false } = {}) => {
    let seen = false;
    try {
      seen = localStorage.getItem(BOOT_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen && !force) return;
    if (!boot || !eventsUl) return;

    eventsUl.innerHTML = "";
    boot.hidden = false;
    logTrail("EVENT stack_deploy START");

    let i = 0;
    const tick = () => {
      if (i >= STACK_STEPS.length) {
        bootTimer = window.setTimeout(finishBoot, 550);
        return;
      }
      const step = STACK_STEPS[i++];
      const li = document.createElement("li");
      li.innerHTML = `<span class="${step.cls}">${step.status}</span><span>${step.resource}</span>`;
      eventsUl.appendChild(li);
      eventsUl.scrollTop = eventsUl.scrollHeight;
      bootTimer = window.setTimeout(tick, 380);
    };
    tick();
  };

  skipBoot?.addEventListener("click", finishBoot);
  replay?.addEventListener("click", () => {
    try {
      localStorage.removeItem(BOOT_KEY);
    } catch {
      /* ignore */
    }
    runBoot({ force: true });
  });

  runBoot();
  logTrail("EVENT session START userAgent=portfolio-visitor");
})();
