(() => {
  const DEG = Math.PI / 180;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const PLACES = [
    {
      id: "pk",
      city: "Islamabad",
      country: "Pakistan",
      lat: 33.68,
      lon: 73.05,
      tz: "Asia/Karachi",
      home: true,
      title: "Home base",
      body: "Where I study at UET Taxila, lead the AWS Student Builder Group, and built Vision and CloudPulse.",
    },
    {
      id: "uk",
      city: "London",
      country: "United Kingdom",
      lat: 53.54,
      lon: -2.63,
      tz: "Europe/London",
      title: "#1 in Wigan",
      body: "Technical and local SEO for Married to the Mop that took it to the top ranking in Wigan and lifted calls by about 70%. Also area-based SEO for John Barlow Repair.",
    },
    {
      id: "us",
      city: "New York",
      country: "United States",
      lat: 39.5,
      lon: -98.35,
      tz: "America/New_York",
      title: "Client delivery",
      body: "Web and mobile builds for US clients, part of the 20+ applications my teams have shipped across five countries.",
    },
    {
      id: "eg",
      city: "Cairo",
      country: "Egypt",
      lat: 30.04,
      lon: 31.24,
      tz: "Africa/Cairo",
      title: "Client delivery",
      body: "Products built for clients in Egypt, delivered by remote teams working across time zones.",
    },
    {
      id: "in",
      city: "New Delhi",
      country: "India",
      lat: 28.61,
      lon: 77.21,
      tz: "Asia/Kolkata",
      title: "Client delivery",
      body: "Web and mobile work for clients in India, coordinated end to end from Islamabad.",
    },
  ];

  const VISITOR_ZONES = {
    "America/New_York": [40.71, -74.0, "New York"],
    "America/Detroit": [42.33, -83.05, "Detroit"],
    "America/Chicago": [41.88, -87.63, "Chicago"],
    "America/Denver": [39.74, -104.99, "Denver"],
    "America/Phoenix": [33.45, -112.07, "Phoenix"],
    "America/Los_Angeles": [34.05, -118.24, "Los Angeles"],
    "America/Vancouver": [49.28, -123.12, "Vancouver"],
    "America/Toronto": [43.65, -79.38, "Toronto"],
    "America/Mexico_City": [19.43, -99.13, "Mexico City"],
    "America/Bogota": [4.71, -74.07, "Bogotá"],
    "America/Sao_Paulo": [-23.55, -46.63, "São Paulo"],
    "America/Argentina/Buenos_Aires": [-34.6, -58.38, "Buenos Aires"],
    "Europe/London": [51.51, -0.13, "London"],
    "Europe/Dublin": [53.35, -6.26, "Dublin"],
    "Europe/Paris": [48.86, 2.35, "Paris"],
    "Europe/Madrid": [40.42, -3.7, "Madrid"],
    "Europe/Berlin": [52.52, 13.4, "Berlin"],
    "Europe/Amsterdam": [52.37, 4.9, "Amsterdam"],
    "Europe/Rome": [41.9, 12.5, "Rome"],
    "Europe/Stockholm": [59.33, 18.07, "Stockholm"],
    "Europe/Warsaw": [52.23, 21.01, "Warsaw"],
    "Europe/Istanbul": [41.01, 28.98, "Istanbul"],
    "Europe/Moscow": [55.76, 37.62, "Moscow"],
    "Africa/Cairo": [30.04, 31.24, "Cairo"],
    "Africa/Lagos": [6.52, 3.38, "Lagos"],
    "Africa/Nairobi": [-1.29, 36.82, "Nairobi"],
    "Africa/Johannesburg": [-26.2, 28.05, "Johannesburg"],
    "Asia/Dubai": [25.2, 55.27, "Dubai"],
    "Asia/Riyadh": [24.71, 46.68, "Riyadh"],
    "Asia/Qatar": [25.29, 51.53, "Doha"],
    "Asia/Tehran": [35.69, 51.39, "Tehran"],
    "Asia/Kabul": [34.53, 69.17, "Kabul"],
    "Asia/Kolkata": [28.61, 77.21, "New Delhi"],
    "Asia/Calcutta": [28.61, 77.21, "New Delhi"],
    "Asia/Kathmandu": [27.72, 85.32, "Kathmandu"],
    "Asia/Colombo": [6.93, 79.86, "Colombo"],
    "Asia/Dhaka": [23.81, 90.41, "Dhaka"],
    "Asia/Bangkok": [13.76, 100.5, "Bangkok"],
    "Asia/Kuala_Lumpur": [3.14, 101.69, "Kuala Lumpur"],
    "Asia/Singapore": [1.35, 103.82, "Singapore"],
    "Asia/Jakarta": [-6.21, 106.85, "Jakarta"],
    "Asia/Manila": [14.6, 120.98, "Manila"],
    "Asia/Shanghai": [31.23, 121.47, "Shanghai"],
    "Asia/Hong_Kong": [22.32, 114.17, "Hong Kong"],
    "Asia/Seoul": [37.57, 126.98, "Seoul"],
    "Asia/Tokyo": [35.68, 139.69, "Tokyo"],
    "Australia/Sydney": [-33.87, 151.21, "Sydney"],
    "Australia/Melbourne": [-37.81, 144.96, "Melbourne"],
    "Pacific/Auckland": [-36.85, 174.76, "Auckland"],
  };

  /* ---------- Time helpers ---------- */

  const timeFormatters = new Map();
  const timeIn = (tz, date = new Date()) => {
    if (!timeFormatters.has(tz)) {
      timeFormatters.set(
        tz,
        new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }),
      );
    }
    return timeFormatters.get(tz).format(date);
  };
  const hourIn = (tz, date = new Date()) => Number(timeIn(tz, date).slice(0, 2));

  const subsolarPoint = (date) => {
    const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 0);
    const dayOfYear = (date.getTime() - startOfYear) / 86400000;
    const declination = -23.44 * Math.cos(((2 * Math.PI) / 365) * (dayOfYear + 10));
    const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
    let lon = (12 - utcHours) * 15;
    lon = ((lon + 540) % 360) - 180;
    return { lat: declination * DEG, lon: lon * DEG };
  };

  const isDaylight = (place, sun) => {
    const d =
      Math.sin(sun.lat) * Math.sin(place.lat * DEG) +
      Math.cos(sun.lat) * Math.cos(place.lat * DEG) * Math.cos(place.lon * DEG - sun.lon);
    return d > 0;
  };

  const homeMood = (hour) => {
    if (hour >= 6 && hour < 9) return "morning stand-up";
    if (hour >= 9 && hour < 18) return "probably shipping";
    if (hour >= 18 && hour < 23) return "evening build session";
    if (hour >= 23 || hour < 2) return "late-night deploy";
    return "asleep, alerts on";
  };

  /* ---------- Basic UI ---------- */

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const header = document.getElementById("header");
  const syncHeader = () => header?.classList.toggle("is-solid", window.scrollY > 24);
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  const menuBtn = document.getElementById("menu-btn");
  const drawer = document.getElementById("drawer");
  const setDrawer = (open) => {
    if (!drawer || !menuBtn) return;
    drawer.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
  };
  menuBtn?.addEventListener("click", () => setDrawer(drawer?.hidden ?? false));
  drawer?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setDrawer(false)));

  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealables = document.querySelectorAll(".section__head, .about, .skill, .project, .contact > *");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    revealables.forEach((el) => {
      el.classList.add("reveal");
      io.observe(el);
    });
  }

  /* ---------- Clocks + place card ---------- */

  const clocksEl = document.getElementById("clocks");
  const headerStatus = document.getElementById("header-status");
  const heroLine = document.getElementById("hero-line");
  const placeEl = document.getElementById("place");
  const placeCountry = document.getElementById("place-country");
  const placeTime = document.getElementById("place-time");
  const placeTitle = document.getElementById("place-title");
  const placeBody = document.getElementById("place-body");

  let selectedId = "pk";
  const clockButtons = new Map();

  PLACES.forEach((place) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "clock";
    btn.innerHTML = `
      <span class="clock__city">${place.country}</span>
      <span class="clock__time" data-time>--:--</span>
      <span class="clock__state" data-state></span>`;
    btn.addEventListener("click", () => selectPlace(place.id, { focusGlobe: true }));
    li.appendChild(btn);
    clocksEl?.appendChild(li);
    clockButtons.set(place.id, btn);
  });

  const renderPlaceCard = (place) => {
    if (placeCountry) placeCountry.textContent = place.home ? `${place.country} · Home` : place.country;
    if (placeTime) placeTime.textContent = `${timeIn(place.tz)} local`;
    if (placeTitle) placeTitle.textContent = place.title;
    if (placeBody) placeBody.textContent = place.body;
  };

  const updateClocks = () => {
    const now = new Date();
    const sun = subsolarPoint(now);
    PLACES.forEach((place) => {
      const btn = clockButtons.get(place.id);
      if (!btn) return;
      const day = isDaylight(place, sun);
      btn.classList.toggle("is-day", day);
      btn.querySelector("[data-time]").textContent = timeIn(place.tz, now);
      btn.querySelector("[data-state]").textContent = day ? "daylight" : "night";
    });
    const home = PLACES[0];
    const homeTime = timeIn(home.tz, now);
    const mood = homeMood(hourIn(home.tz, now));
    if (headerStatus) headerStatus.textContent = `Islamabad ${homeTime} · ${mood}`;
    if (heroLine) heroLine.textContent = `${homeTime} in Islamabad, ${mood}`;
    const selected = PLACES.find((p) => p.id === selectedId);
    if (selected && placeTime) placeTime.textContent = `${timeIn(selected.tz, now)} local`;
  };

  let globeApi = null;

  function selectPlace(id, { focusGlobe = false } = {}) {
    const place = PLACES.find((p) => p.id === id);
    if (!place) return;
    selectedId = id;
    clockButtons.forEach((btn, key) => {
      btn.classList.toggle("is-active", key === id);
      btn.setAttribute("aria-pressed", String(key === id));
    });
    if (placeEl && !reduceMotion) {
      placeEl.classList.add("is-changing");
      window.setTimeout(() => {
        renderPlaceCard(place);
        placeEl.classList.remove("is-changing");
      }, 180);
    } else {
      renderPlaceCard(place);
    }
    if (focusGlobe) globeApi?.focus(place);
    globeApi?.setSelected(id);
  }

  document.querySelectorAll("[data-place]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("top")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      selectPlace(btn.getAttribute("data-place"), { focusGlobe: true });
    });
  });

  updateClocks();
  window.setInterval(updateClocks, 15000);

  /* ---------- Globe ---------- */

  const canvas = document.getElementById("globe");
  const hint = document.getElementById("globe-hint");
  const raw = window.LAND_DOTS;

  if (canvas && raw) {
    globeApi = createGlobe(canvas, raw);
  }
  selectPlace("pk");

  function createGlobe(cv, data) {
    const ctx = cv.getContext("2d");
    const count = data.length / 2;
    const dotSinLat = new Float32Array(count);
    const dotCosLat = new Float32Array(count);
    const dotLon = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const la = (data[i * 2] / 10) * DEG;
      dotSinLat[i] = Math.sin(la);
      dotCosLat[i] = Math.cos(la);
      dotLon[i] = (data[i * 2 + 1] / 10) * DEG;
    }

    const home = PLACES[0];
    const toRad = (p) => ({ ...p, la: p.lat * DEG, lo: p.lon * DEG });
    const markers = PLACES.map(toRad);

    // Visitor (approximate, from timezone only — nothing leaves the browser)
    let visitor = null;
    try {
      const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const hit = VISITOR_ZONES[zone];
      if (hit && zone !== "Asia/Karachi") {
        visitor = { la: hit[0] * DEG, lo: hit[1] * DEG, city: hit[2] };
      }
    } catch {
      visitor = null;
    }

    const toVec = (la, lo) => [Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la)];
    const buildArc = (a, b, samples = 72) => {
      const va = toVec(a.la, a.lo);
      const vb = toVec(b.la, b.lo);
      const dot = Math.min(1, Math.max(-1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]));
      const omega = Math.acos(dot);
      const lift = 0.06 + omega * 0.11;
      const pts = [];
      for (let i = 0; i <= samples; i++) {
        const t = i / samples;
        const s0 = Math.sin((1 - t) * omega) / Math.sin(omega);
        const s1 = Math.sin(t * omega) / Math.sin(omega);
        const x = va[0] * s0 + vb[0] * s1;
        const y = va[1] * s0 + vb[1] * s1;
        const z = va[2] * s0 + vb[2] * s1;
        pts.push({
          sinLa: z,
          cosLa: Math.sqrt(x * x + y * y),
          lo: Math.atan2(y, x),
          h: 1 + lift * Math.sin(Math.PI * t),
        });
      }
      return pts;
    };

    const homeRad = markers[0];
    const arcs = markers
      .filter((m) => !m.home)
      .map((m, i) => ({ id: m.id, pts: buildArc(m, homeRad), phase: i * 0.23, visitor: false }));
    if (visitor) arcs.push({ id: "visitor", pts: buildArc(visitor, homeRad), phase: 0.5, visitor: true });

    let sun = subsolarPoint(new Date());
    const shortestAngle = (from, to) => {
      let d = to - from;
      while (d > Math.PI) d -= 2 * Math.PI;
      while (d < -Math.PI) d += 2 * Math.PI;
      return d;
    };
    // Open facing the day/night boundary, with Islamabad still in view
    const towardSun = Math.max(-60 * DEG, Math.min(60 * DEG, shortestAngle(homeRad.lo, sun.lon) * 0.5));
    const view = { lon: homeRad.lo + towardSun, lat: 22 * DEG };
    const velocity = { lon: 0, lat: 0 };
    let target = null;
    let selected = "pk";
    let dragging = false;
    let moved = 0;
    let last = { x: 0, y: 0 };
    let lastInteraction = 0;
    let size = 0;
    let dpr = 1;
    let running = true;
    window.setInterval(() => (sun = subsolarPoint(new Date())), 30000);

    const BUCKETS = 12;
    const bucketPts = Array.from({ length: BUCKETS }, () => []);
    const bucketColor = Array.from({ length: BUCKETS }, (_, i) => {
      const t = i / (BUCKETS - 1);
      const r = Math.round(92 + (255 - 92) * t);
      const g = Math.round(122 + (214 - 122) * t);
      const b = Math.round(196 + (160 - 196) * t);
      const a = (0.62 + 0.36 * t).toFixed(3);
      return `rgba(${r},${g},${b},${a})`;
    });

    const resize = () => {
      const rect = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = Math.max(1, Math.round(rect.width));
      cv.width = Math.round(size * dpr);
      cv.height = Math.round(size * dpr);
    };
    resize();
    new ResizeObserver(resize).observe(cv);

    const project = (sinLa, cosLa, lo, h, R, c, sinV, cosV) => {
      const dl = lo - view.lon;
      const cosDl = Math.cos(dl);
      const x = cosLa * Math.sin(dl);
      const y = cosV * sinLa - sinV * cosLa * cosDl;
      const z = sinV * sinLa + cosV * cosLa * cosDl;
      const visible = z > 0 || (x * x + y * y) * h * h > 1;
      return { x: c + R * x * h, y: c - R * y * h, z, visible };
    };

    const smooth = (e0, e1, x) => {
      const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
      return t * t * (3 - 2 * t);
    };

    const shortest = shortestAngle;

    const markerScreen = [];

    const draw = (time) => {
      const W = size * dpr;
      const c = W / 2;
      const R = W * 0.4;
      const sinV = Math.sin(view.lat);
      const cosV = Math.cos(view.lat);
      const sinS = Math.sin(sun.lat);
      const cosS = Math.cos(sun.lat);

      ctx.clearRect(0, 0, W, W);

      // Atmosphere
      const atm = ctx.createRadialGradient(c, c, R * 0.96, c, c, R * 1.32);
      atm.addColorStop(0, "rgba(255,190,110,0.16)");
      atm.addColorStop(0.35, "rgba(122,162,255,0.06)");
      atm.addColorStop(1, "rgba(122,162,255,0)");
      ctx.fillStyle = atm;
      ctx.beginPath();
      ctx.arc(c, c, R * 1.32, 0, Math.PI * 2);
      ctx.fill();

      // Ocean, lit from the sun's side
      const sunScreen = project(sinS, cosS, sun.lon, 1, R, c, sinV, cosV);
      const lx = c + (sunScreen.x - c) * 0.55;
      const ly = c + (sunScreen.y - c) * 0.55;
      const ocean = ctx.createRadialGradient(lx, ly, R * 0.05, c, c, R);
      ocean.addColorStop(0, sunScreen.z > -0.2 ? "rgba(38,48,72,1)" : "rgba(16,22,36,1)");
      ocean.addColorStop(1, "rgba(7,10,18,1)");
      ctx.fillStyle = ocean;
      ctx.beginPath();
      ctx.arc(c, c, R, 0, Math.PI * 2);
      ctx.fill();

      // Land dots, coloured by real daylight
      for (let b = 0; b < BUCKETS; b++) bucketPts[b].length = 0;
      const baseDot = Math.max(1.1, W / 420);
      for (let i = 0; i < count; i++) {
        const dl = dotLon[i] - view.lon;
        const cosDl = Math.cos(dl);
        const z = sinV * dotSinLat[i] + cosV * dotCosLat[i] * cosDl;
        if (z <= 0.015) continue;
        const x = dotCosLat[i] * Math.sin(dl);
        const y = cosV * dotSinLat[i] - sinV * dotCosLat[i] * cosDl;
        const light =
          sinS * dotSinLat[i] + cosS * dotCosLat[i] * Math.cos(dotLon[i] - sun.lon);
        const t = smooth(-0.1, 0.22, light);
        const bucket = Math.min(BUCKETS - 1, (t * BUCKETS) | 0);
        bucketPts[bucket].push(c + R * x, c - R * y, baseDot * (0.45 + 0.55 * z));
      }
      for (let b = 0; b < BUCKETS; b++) {
        const pts = bucketPts[b];
        if (!pts.length) continue;
        ctx.fillStyle = bucketColor[b];
        ctx.beginPath();
        for (let k = 0; k < pts.length; k += 3) {
          ctx.moveTo(pts[k] + pts[k + 2], pts[k + 1]);
          ctx.arc(pts[k], pts[k + 1], pts[k + 2], 0, Math.PI * 2);
        }
        ctx.fill();
      }

      // Rim light
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1 * dpr;
      ctx.beginPath();
      ctx.arc(c, c, R, 0, Math.PI * 2);
      ctx.stroke();

      // Arcs
      const pulseT = reduceMotion ? 0.65 : (time / 3200) % 1;
      arcs.forEach((arc) => {
        const isSel = arc.id === selected || arc.visitor;
        const projected = arc.pts.map((p) => project(p.sinLa, p.cosLa, p.lo, p.h, R, c, sinV, cosV));
        ctx.lineWidth = (isSel ? 1.6 : 1.1) * dpr;
        ctx.strokeStyle = arc.visitor
          ? "rgba(160,190,255,0.55)"
          : isSel
            ? "rgba(255,200,120,0.75)"
            : "rgba(255,190,110,0.28)";
        ctx.beginPath();
        let pen = false;
        projected.forEach((p) => {
          if (!p.visible) {
            pen = false;
            return;
          }
          if (!pen) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
          pen = true;
        });
        ctx.stroke();

        // Travelling packet
        const head = (pulseT + arc.phase) % 1;
        const idx = Math.floor(head * (projected.length - 1));
        const tail = Math.max(0, idx - 9);
        ctx.lineWidth = 2.2 * dpr;
        ctx.lineCap = "round";
        ctx.strokeStyle = arc.visitor ? "rgba(210,225,255,0.95)" : "rgba(255,225,170,0.95)";
        ctx.beginPath();
        pen = false;
        for (let k = tail; k <= idx; k++) {
          const p = projected[k];
          if (!p.visible) {
            pen = false;
            continue;
          }
          if (!pen) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
          pen = true;
        }
        ctx.stroke();
        ctx.lineCap = "butt";
      });

      // Markers
      markerScreen.length = 0;
      const drawMarker = (m, label, color, isSelected, ringPhase) => {
        const p = project(Math.sin(m.la), Math.cos(m.la), m.lo, 1, R, c, sinV, cosV);
        if (p.z <= 0.02) return;
        const fade = smooth(0.02, 0.25, p.z);
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 22 * dpr);
        glow.addColorStop(0, color.replace("ALPHA", (0.55 * fade).toFixed(3)));
        glow.addColorStop(1, color.replace("ALPHA", "0"));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 22 * dpr, 0, Math.PI * 2);
        ctx.fill();

        if (!reduceMotion) {
          const ring = (time / 2200 + ringPhase) % 1;
          ctx.strokeStyle = color.replace("ALPHA", ((1 - ring) * 0.7 * fade).toFixed(3));
          ctx.lineWidth = 1 * dpr;
          ctx.beginPath();
          ctx.arc(p.x, p.y, (4 + ring * 16) * dpr, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = color.replace("ALPHA", fade.toFixed(3));
        ctx.beginPath();
        ctx.arc(p.x, p.y, (isSelected ? 4.2 : 3) * dpr, 0, Math.PI * 2);
        ctx.fill();

        if (label && (isSelected || m.home || m.isVisitor)) {
          ctx.font = `500 ${11 * dpr}px "Geist Mono", ui-monospace, monospace`;
          ctx.fillStyle = `rgba(238,241,246,${(0.9 * fade).toFixed(3)})`;
          ctx.fillText(label, p.x + 10 * dpr, p.y - 8 * dpr);
        }
        if (m.id) markerScreen.push({ id: m.id, x: p.x / dpr, y: p.y / dpr });
      };

      markers.forEach((m, i) => {
        drawMarker(
          m,
          m.home ? "Islamabad" : m.country,
          "rgba(255,200,120,ALPHA)",
          m.id === selected,
          i * 0.19,
        );
      });
      if (visitor) {
        drawMarker({ ...visitor, isVisitor: true }, `You · ${visitor.city}`, "rgba(170,198,255,ALPHA)", false, 0.4);
      }
    };

    const tick = (time) => {
      if (!running) return;
      const idle = time - lastInteraction > 2600;

      if (target) {
        const dLon = shortest(view.lon, target.lon);
        const dLat = target.lat - view.lat;
        view.lon += dLon * 0.075;
        view.lat += dLat * 0.075;
        if (Math.abs(dLon) < 0.002 && Math.abs(dLat) < 0.002) target = null;
      } else if (!dragging) {
        view.lon += velocity.lon;
        view.lat += velocity.lat;
        velocity.lon *= 0.94;
        velocity.lat *= 0.94;
        if (idle && !reduceMotion) view.lon += 0.0011;
      }
      view.lat = Math.max(-50 * DEG, Math.min(60 * DEG, view.lat));

      draw(time);
      requestAnimationFrame(tick);
    };

    // Pause when off-screen
    new IntersectionObserver((entries) => {
      const visible = entries[0]?.isIntersecting ?? true;
      if (visible && !running) {
        running = true;
        requestAnimationFrame(tick);
      } else if (!visible) {
        running = false;
      }
    }).observe(cv);

    const hideHint = () => hint?.classList.add("is-gone");

    const pickMarker = (x, y) => {
      let best = null;
      let bestD = 26;
      markerScreen.forEach((m) => {
        const d = Math.hypot(m.x - x, m.y - y);
        if (d < bestD) {
          best = m;
          bestD = d;
        }
      });
      return best;
    };

    cv.addEventListener("pointerdown", (e) => {
      dragging = true;
      moved = 0;
      target = null;
      last = { x: e.clientX, y: e.clientY };
      velocity.lon = 0;
      velocity.lat = 0;
      lastInteraction = performance.now();
      cv.classList.add("is-dragging");
      cv.setPointerCapture(e.pointerId);
    });

    cv.addEventListener("pointermove", (e) => {
      const rect = cv.getBoundingClientRect();
      if (!dragging) {
        const hover = pickMarker(e.clientX - rect.left, e.clientY - rect.top);
        cv.classList.toggle("is-pointing", Boolean(hover));
        return;
      }
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY };
      moved += Math.abs(dx) + Math.abs(dy);
      const k = 1 / (size * 0.4);
      velocity.lon = -dx * k;
      velocity.lat = dy * k;
      view.lon += velocity.lon;
      view.lat += velocity.lat;
      lastInteraction = performance.now();
      if (moved > 6) hideHint();
    });

    const endDrag = (e) => {
      if (!dragging) return;
      dragging = false;
      cv.classList.remove("is-dragging");
      lastInteraction = performance.now();
      if (moved < 6) {
        const rect = cv.getBoundingClientRect();
        const hit = pickMarker(e.clientX - rect.left, e.clientY - rect.top);
        if (hit && hit.id) {
          hideHint();
          selectPlace(hit.id, { focusGlobe: true });
        }
      }
    };
    cv.addEventListener("pointerup", endDrag);
    cv.addEventListener("pointercancel", endDrag);

    requestAnimationFrame(tick);

    return {
      focus(place) {
        target = { lon: place.lon * DEG - 12 * DEG, lat: Math.max(-30, Math.min(45, place.lat * 0.7)) * DEG };
        lastInteraction = performance.now();
      },
      setSelected(id) {
        selected = id;
      },
    };
  }
})();
