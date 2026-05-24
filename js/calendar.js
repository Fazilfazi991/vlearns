(function () {
  const state = {
    month: 5,
    year: 2026,
    filter: "All Events",
    selectedDate: null
  };

  const categoryAliases = {
    "Workshops": "Workshop",
    "Career Sessions": "Career Session"
  };

  function parts(dateString) {
    const date = new Date(`${dateString}T00:00:00`);
    return {
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      mon: date.toLocaleDateString("en-GB", { month: "short" }).toUpperCase()
    };
  }

  function filteredEvents() {
    const wanted = categoryAliases[state.filter] || state.filter;
    return publishedEvents().filter((event) => {
      const categoryMatch = wanted === "All Events" || event.category === wanted;
      const dateMatch = !state.selectedDate || event.date === state.selectedDate;
      return categoryMatch && dateMatch;
    });
  }

  function eventCard(event) {
    const date = parts(event.date);
    return `
      <article class="event-card" data-category="${event.category}">
        <div class="date-badge">
          <strong>${String(date.day).padStart(2, "0")}</strong>
          <span>${date.mon}</span>
        </div>
        <div class="event-content">
          <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center; justify-content:space-between;">
            <h3>${event.title}</h3>
            <span class="status ${statusClass(event.status)}">${event.status}</span>
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
            <span class="pill">${event.category}</span>
            <span class="pill">${event.duration}</span>
          </div>
          <div class="event-meta">
            <span>Duration: ${event.duration}</span>
            <span>Mode: ${event.mode}</span>
            <span>Seats: ${event.seatsFilled} / ${event.totalSeats}</span>
          </div>
          <div class="event-actions">
            <a class="event-button" href="${event.relatedCourseUrl}">View Course</a>
            <a class="event-button primary" href="${whatsappUrl(event)}" target="_blank" rel="noopener">Register on WhatsApp</a>
            <a class="event-button" href="${googleCalendarUrl(event)}" target="_blank" rel="noopener">Add to Calendar</a>
          </div>
        </div>
      </article>`;
  }

  function renderCalendar() {
    const grid = document.querySelector("[data-calendar-grid]");
    const title = document.querySelector("[data-calendar-title]");
    if (!grid || !title) return;

    title.textContent = new Date(state.year, state.month, 1).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric"
    });

    const events = publishedEvents();
    const firstDay = new Date(state.year, state.month, 1).getDay();
    const daysInMonth = new Date(state.year, state.month + 1, 0).getDate();
    const previousDays = new Date(state.year, state.month, 0).getDate();
    const cells = [];

    ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].forEach((day) => {
      cells.push(`<div class="calendar-weekday">${day}</div>`);
    });

    for (let i = 0; i < firstDay; i += 1) {
      cells.push(`<button class="muted" type="button">${previousDays - firstDay + i + 1}</button>`);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const iso = `${state.year}-${String(state.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const match = events.find((event) => event.date === iso);
      const classes = [match ? `has-event ${eventType(match)}` : "", state.selectedDate === iso ? "selected" : ""].join(" ");
      cells.push(`<button type="button" class="${classes}" data-date="${iso}">${day}</button>`);
    }

    while ((cells.length - 7) % 7 !== 0) {
      const nextDay = (cells.length - 7) - firstDay - daysInMonth + 1;
      cells.push(`<button class="muted" type="button">${nextDay}</button>`);
    }

    grid.innerHTML = cells.join("");
  }

  function renderEvents() {
    const list = document.querySelector("[data-event-list]");
    if (!list) return;
    const events = filteredEvents();
    list.innerHTML = events.length
      ? events.map(eventCard).join("")
      : `<div class="event-card" style="grid-template-columns:1fr;"><strong>No events found</strong><span>Try another filter or month.</span></div>`;
  }

  function renderPreview() {
    const list = document.querySelector("[data-homepage-events]");
    if (!list) return;
    list.innerHTML = publishedEvents().slice(0, 3).map((event) => {
      const date = parts(event.date);
      return `
        <article class="preview-card">
          <div class="date-badge"><strong>${String(date.day).padStart(2, "0")}</strong><span>${date.mon}</span></div>
          <div>
            <h3 style="margin:0 0 6px;color:var(--v-navy);font-size:1rem;">${event.title}</h3>
            <div class="event-meta"><span>${event.duration}</span><span>${event.mode}</span><span class="status ${statusClass(event.status)}">${event.status}</span></div>
          </div>
          <a class="event-button primary" href="${whatsappUrl(event)}" target="_blank" rel="noopener">Register</a>
        </article>`;
    }).join("");
  }

  function renderCourseBatches() {
    const list = document.querySelector("[data-course-batches]");
    if (!list) return;
    const courses = list.getAttribute("data-course-batches").split(",").map((item) => item.trim());
    const events = publishedEvents().filter((event) => courses.includes(event.category));
    list.innerHTML = events.map((event) => {
      const date = parts(event.date);
      return `
        <article class="batch-card">
          <div class="date-badge"><strong>${String(date.day).padStart(2, "0")}</strong><span>${date.mon}</span></div>
          <div>
            <h3 style="margin:0 0 8px;color:var(--v-navy);font-size:1rem;">${event.title}</h3>
            <div class="event-meta"><span>${event.duration}</span><span>${event.mode}</span><span>Seats: ${event.seatsFilled}/${event.totalSeats}</span><span class="status ${statusClass(event.status)}">${event.status}</span></div>
          </div>
          <a class="event-button primary" href="${whatsappUrl(event)}" target="_blank" rel="noopener">Register on WhatsApp</a>
        </article>`;
    }).join("") || `<p>No upcoming batches are published for this course yet.</p>`;
  }

  function renderAll() {
    renderCalendar();
    renderEvents();
    renderPreview();
    renderCourseBatches();
  }

  document.addEventListener("click", (event) => {
    const dateButton = event.target.closest("[data-date]");
    if (dateButton) {
      state.selectedDate = state.selectedDate === dateButton.dataset.date ? null : dateButton.dataset.date;
      renderAll();
    }

    const filter = event.target.closest("[data-event-filter]");
    if (filter) {
      state.filter = filter.dataset.eventFilter;
      state.selectedDate = null;
      document.querySelectorAll("[data-event-filter]").forEach((button) => button.classList.toggle("active", button === filter));
      renderAll();
    }

    const nav = event.target.closest("[data-month-nav]");
    if (nav) {
      state.month += Number(nav.dataset.monthNav);
      if (state.month < 0) {
        state.month = 11;
        state.year -= 1;
      }
      if (state.month > 11) {
        state.month = 0;
        state.year += 1;
      }
      state.selectedDate = null;
      renderAll();
    }
  });

  renderAll();
})();
