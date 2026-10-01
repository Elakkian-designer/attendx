// ---------- MOCK DATA (replace this later with real data from a database) ----------
const subjects = [
  { name: "Data Structure", pct: 93 },
  { name: "Operating System", pct: 88 },
  { name: "Computer Network", pct: 74 },
  { name: "Database Management", pct: 69 },
];

const timetableByDay = {
  Mon: [
    { time: "8:55 – 9:50 AM", subject: "Data Structure", teacher: "Mrs. Mouthami" },
    { time: "9:50 – 10:45 AM", subject: "Operating System", teacher: "Mr. Premkumar" },
    { time: "11:05 – 12:00 PM", subject: "Artificial Intelligence", teacher: "Mr. Rajesh" },
    { time: "12:00 – 12:50 PM", subject: "Database Management", teacher: "Miss Avani" },
    { time: "1:45 – 2:35 PM", subject: "Computer Network", teacher: "Mr. Karthik" },
    { time: "2:35 – 3:25 PM", subject: "Mobile App Development", teacher: "Miss Kalaiyarasi" },
    { time: "3:25 – 4:00 PM", subject: "Linear Algebra", teacher: "Mr. Munirathnam" },
  ],
};
["Tue", "Wed", "Thu", "Fri"].forEach((d) => (timetableByDay[d] = timetableByDay.Mon));

const notifications = [
  { title: "Star Placement", sub: "Placed for 7 LPA", group: "Today", read: false },
  { title: "Smart India Hackathon", sub: "Hackathon on 12.8.2026", group: "Today", read: false },
  { title: "Low attendance", sub: "DBMS low attendance", group: "Today", read: false },
  { title: "Bus no: 12 Repair", sub: "Bus 12 students can avail Bus 10", group: "Old", read: true },
  { title: "Dress Code", sub: "Saturday dress code: T-shirt", group: "Old", read: true },
  { title: "App Update", sub: "Now Dark mode available", group: "Old", read: true },
  { title: "RO Maintenance", sub: "S&H Block RO under maintenance", group: "Old", read: true },
];

// ---------- NAVIGATION ----------
function goTo(screenId) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
  document.querySelectorAll(".nav-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.target === screenId);
  });
  window.scrollTo(0, 0);
}

document.querySelectorAll("[data-target]").forEach((el) => {
  el.addEventListener("click", () => goTo(el.dataset.target));
});

// ---------- LOGIN ----------
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  // Placeholder auth: accepts anything for now.
  // Replace this with a real check against your backend / Firebase Auth.
  const id = document.getElementById("login-id").value.trim();
  if (!id) return;
  localStorage.setItem("attendx_user", id);
  goTo("screen-home");
});

document.getElementById("forgot-btn").addEventListener("click", () => {
  alert("Password reset isn't wired up yet — hook this to your backend's reset flow.");
});

// ---------- RENDER: ATTENDANCE ----------
function renderSubjects() {
  const list = document.getElementById("subject-list");
  list.innerHTML = subjects
    .map(
      (s) => `
    <div class="subject-row">
      <div class="subject-top"><span>${s.name}</span><strong>${s.pct}%</strong></div>
      <div class="bar-track"><div class="bar-fill" style="width:${s.pct}%"></div></div>
    </div>`
    )
    .join("");
}

// ---------- RENDER: TIMETABLE ----------
const days = [
  { key: "Mon", num: 15 },
  { key: "Tue", num: 16 },
  { key: "Wed", num: 17 },
  { key: "Thu", num: 18 },
  { key: "Fri", num: 19 },
];

function renderDayTabs(selected) {
  const wrap = document.getElementById("day-tabs");
  wrap.innerHTML = days
    .map(
      (d) => `<button class="day-tab ${d.key === selected ? "active" : ""}" data-day="${d.key}">
      ${d.key}<span class="num">${d.num}</span></button>`
    )
    .join("");
  wrap.querySelectorAll(".day-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      renderDayTabs(btn.dataset.day);
      renderTimetable(btn.dataset.day);
    });
  });
}

function renderTimetable(day) {
  const list = document.getElementById("timetable-list");
  list.innerHTML = timetableByDay[day]
    .map(
      (row) => `
    <div class="tt-row">
      <div class="tt-time">${row.time}</div>
      <div>
        <div class="tt-subject">${row.subject}</div>
        <div class="tt-teacher">${row.teacher}</div>
      </div>
    </div>`
    )
    .join("");
}

// ---------- RENDER: NOTIFICATIONS ----------
function renderNotifications(filter = "all") {
  const groups = document.getElementById("notif-groups");
  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });
  const order = ["Today", "Old"];
  groups.innerHTML = order
    .map((g) => {
      const items = filtered.filter((n) => n.group === g);
      if (!items.length) return "";
      return `<h3 class="notif-group-title">${g}</h3>` +
        items
          .map(
            (n) => `
        <div class="notif-row ${n.read ? "read" : ""}">
          <span class="notif-dot"></span>
          <div>
            <div class="notif-title">${n.title}</div>
            <div class="notif-sub">${n.sub}</div>
          </div>
        </div>`
          )
          .join("");
    })
    .join("");
}

document.querySelectorAll("#notif-tabs .tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll("#notif-tabs .tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    renderNotifications(tab.dataset.filter);
  });
});

// ---------- SETTINGS: DARK MODE ----------
const lightBtn = document.getElementById("light-mode-btn");
const darkBtn = document.getElementById("dark-mode-btn");

function setDarkMode(on) {
  document.body.classList.toggle("dark", on);
  lightBtn.classList.toggle("active", !on);
  darkBtn.classList.toggle("active", on);
  localStorage.setItem("attendx_dark", on ? "1" : "0");
}
lightBtn.addEventListener("click", () => setDarkMode(false));
darkBtn.addEventListener("click", () => setDarkMode(true));

document.getElementById("about-btn").addEventListener("click", () => {
  alert("AttendX — track attendance, timetable and notifications in one place.");
});
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("attendx_user");
  goTo("screen-login");
});

// ---------- INIT ----------
renderSubjects();
renderDayTabs("Mon");
renderTimetable("Mon");
renderNotifications("all");
setDarkMode(localStorage.getItem("attendx_dark") === "1");

// Skip login if already "logged in" (demo convenience)
if (localStorage.getItem("attendx_user")) {
  goTo("screen-home");
}

// ---------- PWA: service worker registration ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
