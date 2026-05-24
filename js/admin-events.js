const adminState = {
  events: getStoredEvents(),
  editingId: null
};

const courseOptions = [
  "HACCP Level 3",
  "HACCP Level 4",
  "Food Safety Advanced Training",
  "Workshop",
  "Career Session",
  "Demo Class",
  "Webinar"
];

const modeOptions = ["Classroom", "Online", "Hybrid", "Structured Program"];
const statusOptions = ["Draft", "Published", "Seats Open", "Enquiry Open", "Registration Open", "Limited Seats", "Full", "Completed", "Cancelled"];

function rootPrefix() {
  return location.pathname.includes("/admin/") ? "../" : "";
}

function initAdminShell(active) {
  document.querySelectorAll("[data-admin-menu] a").forEach((link) => {
    link.classList.toggle("active", link.dataset.section === active);
  });
  const toggle = document.querySelector("[data-sidebar-toggle]");
  const sidebar = document.querySelector(".admin-sidebar");
  if (toggle && sidebar) toggle.addEventListener("click", () => sidebar.classList.toggle("open"));
}

function adminStats() {
  const today = new Date("2026-05-24T00:00:00");
  const events = adminState.events;
  return {
    total: events.length,
    upcoming: events.filter((event) => new Date(`${event.date}T00:00:00`) >= today && event.published !== false).length,
    registrations: events.reduce((sum, event) => sum + Number(event.seatsFilled || 0), 0),
    enquiries: 28,
    seatsFilled: events.reduce((sum, event) => sum + Number(event.seatsFilled || 0), 0),
    seatsAvailable: events.reduce((sum, event) => sum + Math.max(Number(event.totalSeats || 0) - Number(event.seatsFilled || 0), 0), 0)
  };
}

function renderStats() {
  const wrap = document.querySelector("[data-admin-stats]");
  if (!wrap) return;
  const stats = adminStats();
  const cards = [
    ["Total Events", stats.total],
    ["Upcoming Events", stats.upcoming],
    ["Registrations", stats.registrations],
    ["Enquiries", stats.enquiries],
    ["Seats Filled", stats.seatsFilled],
    ["Seats Available", stats.seatsAvailable]
  ];
  wrap.innerHTML = cards.map(([label, value]) => `<article class="stat-card"><span>${label}</span><strong>${value}</strong></article>`).join("");
}

function renderAdminMiniCalendar() {
  const grid = document.querySelector("[data-admin-calendar]");
  if (!grid) return;
  const month = 5;
  const year = 2026;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const eventDates = new Map(adminState.events.map((event) => [event.date, event]));
  const cells = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => `<div class="calendar-weekday">${day}</div>`);
  for (let i = 0; i < firstDay; i += 1) cells.push("<button class='muted' type='button'></button>");
  for (let day = 1; day <= daysInMonth; day += 1) {
    const iso = `${year}-06-${String(day).padStart(2, "0")}`;
    const match = eventDates.get(iso);
    cells.push(`<button class="${match ? `has-event ${eventType(match)}` : ""}" type="button">${day}</button>`);
  }
  grid.innerHTML = cells.join("");
}

function tableRow(event) {
  return `
    <tr>
      <td><strong>${formatEventDate(event.date)}</strong><br>${event.startTime || ""} - ${event.endTime || ""}</td>
      <td><strong style="color:var(--admin-navy);">${event.title}</strong><br>${event.shortDescription || ""}</td>
      <td>${event.category}</td>
      <td>${event.mode}</td>
      <td>${event.seatsFilled} / ${event.totalSeats}</td>
      <td><span class="status ${statusClass(event.status)}">${event.status}</span></td>
      <td>
        <div class="row-actions">
          <button class="admin-action" type="button" data-view="${event.id}">View</button>
          <button class="admin-action" type="button" data-edit="${event.id}">Edit</button>
          <button class="admin-action" type="button" data-duplicate="${event.id}">Duplicate</button>
          <button class="admin-action" type="button" data-full="${event.id}">Mark as Full</button>
          <button class="admin-action" type="button" data-publish="${event.id}">${event.published === false ? "Publish" : "Unpublish"}</button>
          <button class="admin-action danger" type="button" data-delete="${event.id}">Delete</button>
        </div>
      </td>
    </tr>`;
}

function mobileRow(event) {
  return `
    <article class="mobile-row">
      <strong style="color:var(--admin-navy);">${event.title}</strong>
      <span>${formatEventDate(event.date)} - ${event.category}</span>
      <span>${event.mode} - Seats ${event.seatsFilled}/${event.totalSeats}</span>
      <span class="status ${statusClass(event.status)}">${event.status}</span>
      <div class="row-actions">
        <button class="admin-action" type="button" data-edit="${event.id}">Edit</button>
        <button class="admin-action" type="button" data-duplicate="${event.id}">Duplicate</button>
        <button class="admin-action danger" type="button" data-delete="${event.id}">Delete</button>
      </div>
    </article>`;
}

function renderEventTable() {
  const table = document.querySelector("[data-events-table]");
  const mobile = document.querySelector("[data-events-mobile]");
  const events = adminState.events.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
  if (table) table.innerHTML = events.map(tableRow).join("");
  if (mobile) mobile.innerHTML = events.map(mobileRow).join("");
  renderStats();
  renderAdminMiniCalendar();
}

function field(name) {
  return document.querySelector(`[name="${name}"]`);
}

function fillForm(event) {
  const defaults = {
    title: "",
    category: "HACCP Level 3",
    date: "",
    startTime: "09:00",
    endTime: "17:00",
    mode: "Online",
    location: "",
    totalSeats: 20,
    seatsFilled: 0,
    status: "Draft",
    shortDescription: "",
    fullDescription: "",
    image: "assets/modern_industrial_training_in_action.png",
    relatedCourseUrl: "haccp-level-3.html",
    whatsappMessage: VLEARNS_REGISTER_TEXT,
    published: false
  };
  const value = { ...defaults, ...(event || {}) };
  Object.keys(value).forEach((key) => {
    const input = field(key);
    if (!input) return;
    if (input.type === "checkbox") input.checked = Boolean(value[key]);
    else input.value = value[key];
  });
}

function openDrawer(event) {
  adminState.editingId = event ? event.id : null;
  document.querySelector("[data-drawer-title]").textContent = event ? "Edit Event" : "Add New Event";
  fillForm(event);
  document.querySelector(".drawer-backdrop").classList.add("open");
}

function closeDrawer() {
  document.querySelector(".drawer-backdrop").classList.remove("open");
  document.querySelector("[data-form-error]").textContent = "";
}

function validate(payload) {
  if (!payload.title.trim()) return "Event title is required.";
  if (!payload.date) return "Date is required.";
  if (!payload.category) return "Course/type is required.";
  if (Number.isNaN(payload.totalSeats) || payload.totalSeats < 1) return "Total seats should be a number.";
  if (payload.seatsFilled > payload.totalSeats) return "Seats filled should not exceed total seats.";
  if (payload.startTime && payload.endTime && payload.startTime >= payload.endTime) return "Start time should be before end time.";
  return "";
}

function getPayload(forceStatus) {
  const payload = {
    id: adminState.editingId || `evt_${Date.now()}`,
    title: field("title").value,
    category: field("category").value,
    date: field("date").value,
    startTime: field("startTime").value,
    endTime: field("endTime").value,
    duration: field("duration").value || "1 Day",
    mode: field("mode").value,
    location: field("location").value,
    totalSeats: Number(field("totalSeats").value),
    seatsFilled: Number(field("seatsFilled").value),
    status: forceStatus || field("status").value,
    shortDescription: field("shortDescription").value,
    fullDescription: field("fullDescription").value,
    image: field("image").value,
    relatedCourseUrl: field("relatedCourseUrl").value,
    whatsappMessage: field("whatsappMessage").value,
    published: forceStatus === "Draft" ? false : field("published").checked,
    createdAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10)
  };
  if (forceStatus === "Published") {
    payload.status = "Seats Open";
    payload.published = true;
  }
  return payload;
}

function saveEvent(forceStatus) {
  const payload = getPayload(forceStatus);
  const error = validate(payload);
  if (error) {
    document.querySelector("[data-form-error]").textContent = error;
    return;
  }
  const index = adminState.events.findIndex((event) => event.id === payload.id);
  if (index >= 0) adminState.events[index] = { ...adminState.events[index], ...payload };
  else adminState.events.push(payload);
  saveStoredEvents(adminState.events);
  closeDrawer();
  renderEventTable();
}

function initEventForm() {
  const category = field("category");
  const mode = field("mode");
  const status = field("status");
  if (category) category.innerHTML = courseOptions.map((item) => `<option>${item}</option>`).join("");
  if (mode) mode.innerHTML = modeOptions.map((item) => `<option>${item}</option>`).join("");
  if (status) status.innerHTML = statusOptions.map((item) => `<option>${item}</option>`).join("");
}

function registrationRow(registration) {
  return `
    <tr>
      <td>${registration.name}</td>
      <td>${registration.phone}</td>
      <td>${registration.email || "-"}</td>
      <td>${registration.event}</td>
      <td>${registration.course}</td>
      <td>${formatEventDate(registration.date)}</td>
      <td>${registration.source}</td>
      <td><span class="status ${statusClass(registration.status)}">${registration.status}</span></td>
      <td>
        <div class="row-actions">
          <button class="admin-action" type="button" data-reg-status="${registration.id}">Edit status</button>
          <a class="admin-action" href="${VLEARNS_WHATSAPP}?text=${encodeURIComponent(`Hi ${registration.name}, this is V Learns Education regarding ${registration.event}.`)}" target="_blank" rel="noopener">WhatsApp</a>
          <button class="admin-action danger" type="button" data-reg-delete="${registration.id}">Delete</button>
        </div>
      </td>
    </tr>`;
}

function enquiryRow(enquiry) {
  return `
    <tr>
      <td>${enquiry.name}</td>
      <td>${enquiry.phone}</td>
      <td>${enquiry.email || "-"}</td>
      <td>${enquiry.interestedCourse}</td>
      <td>${enquiry.message || "-"}</td>
      <td>${formatEventDate(enquiry.date)}</td>
      <td><span class="status ${statusClass(enquiry.status)}">${enquiry.status}</span></td>
      <td>${enquiry.source}</td>
      <td>
        <div class="row-actions">
          <button class="admin-action" type="button" data-enq-status="${enquiry.id}">Edit status</button>
          <a class="admin-action" href="${VLEARNS_WHATSAPP}?text=${encodeURIComponent(`Hi ${enquiry.name}, this is V Learns Education regarding your ${enquiry.interestedCourse} enquiry.`)}" target="_blank" rel="noopener">WhatsApp</a>
          <button class="admin-action danger" type="button" data-enq-delete="${enquiry.id}">Delete</button>
        </div>
      </td>
    </tr>`;
}

function renderRegistrations() {
  const table = document.querySelector("[data-registrations-table]");
  if (!table) return;
  const registrations = getStoredRegistrations();
  table.innerHTML = registrations.map(registrationRow).join("");
  document.querySelector("[data-registration-count]").textContent = registrations.length;
}

function renderEnquiries() {
  const table = document.querySelector("[data-enquiries-table]");
  if (!table) return;
  const enquiries = getStoredEnquiries();
  table.innerHTML = enquiries.map(enquiryRow).join("");
  document.querySelector("[data-enquiry-count]").textContent = enquiries.length;
}

function cycleStatus(current, options) {
  const index = options.indexOf(current);
  return options[(index + 1) % options.length];
}

function initAdminRegistrations() {
  initAdminShell("registrations");
  renderRegistrations();
  document.addEventListener("click", (event) => {
    const statusButton = event.target.closest("[data-reg-status]");
    const deleteButton = event.target.closest("[data-reg-delete]");
    if (statusButton) {
      const registrations = getStoredRegistrations();
      const registration = registrations.find((item) => item.id === statusButton.dataset.regStatus);
      if (registration) registration.status = cycleStatus(registration.status, ["New", "Contacted", "Confirmed", "Paid", "Cancelled"]);
      saveStoredRegistrations(registrations);
      renderRegistrations();
    }
    if (deleteButton) {
      saveStoredRegistrations(getStoredRegistrations().filter((item) => item.id !== deleteButton.dataset.regDelete));
      renderRegistrations();
    }
  });
}

function initAdminEnquiries() {
  initAdminShell("enquiries");
  renderEnquiries();
  document.addEventListener("click", (event) => {
    const statusButton = event.target.closest("[data-enq-status]");
    const deleteButton = event.target.closest("[data-enq-delete]");
    if (statusButton) {
      const enquiries = getStoredEnquiries();
      const enquiry = enquiries.find((item) => item.id === statusButton.dataset.enqStatus);
      if (enquiry) enquiry.status = cycleStatus(enquiry.status, ["New", "Follow-up", "Converted", "Closed"]);
      saveStoredEnquiries(enquiries);
      renderEnquiries();
    }
    if (deleteButton) {
      saveStoredEnquiries(getStoredEnquiries().filter((item) => item.id !== deleteButton.dataset.enqDelete));
      renderEnquiries();
    }
  });
}

function mutateEvent(id, action) {
  const event = adminState.events.find((item) => item.id === id);
  if (!event) return;
  if (action === "delete") adminState.events = adminState.events.filter((item) => item.id !== id);
  if (action === "duplicate") adminState.events.push({ ...event, id: `evt_${Date.now()}`, title: `${event.title} Copy`, status: "Draft", published: false });
  if (action === "full") event.status = "Full";
  if (action === "publish") event.published = event.published === false;
  saveStoredEvents(adminState.events);
  renderEventTable();
}

function initAdminEvents() {
  initAdminShell("events");
  initEventForm();
  renderEventTable();
  document.querySelector("[data-add-event]").addEventListener("click", () => openDrawer(null));
  document.querySelector(".drawer-backdrop").addEventListener("click", (event) => {
    if (event.target.classList.contains("drawer-backdrop")) closeDrawer();
  });
  document.querySelector("[data-save-event]").addEventListener("click", () => saveEvent());
  document.querySelector("[data-save-draft]").addEventListener("click", () => saveEvent("Draft"));
  document.querySelector("[data-publish-event]").addEventListener("click", () => saveEvent("Published"));
  document.addEventListener("click", (event) => {
    const edit = event.target.closest("[data-edit]");
    const view = event.target.closest("[data-view]");
    const del = event.target.closest("[data-delete]");
    const dup = event.target.closest("[data-duplicate]");
    const full = event.target.closest("[data-full]");
    const pub = event.target.closest("[data-publish]");
    if (event.target.closest("[data-close-drawer]")) closeDrawer();
    if (edit || view) openDrawer(adminState.events.find((item) => item.id === (edit || view).dataset[edit ? "edit" : "view"]));
    if (del) mutateEvent(del.dataset.delete, "delete");
    if (dup) mutateEvent(dup.dataset.duplicate, "duplicate");
    if (full) mutateEvent(full.dataset.full, "full");
    if (pub) mutateEvent(pub.dataset.publish, "publish");
  });
}
