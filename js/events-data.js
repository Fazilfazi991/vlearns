const VLEARNS_WHATSAPP = "https://wa.me/917907884504";
const VLEARNS_REGISTER_TEXT = "Hi V Learns Education, I want to register for an upcoming training batch";

const VLEARNS_SAMPLE_EVENTS = [
  {
    id: "evt_001",
    title: "HACCP Level 3 - Supervisory Level",
    category: "HACCP Level 3",
    date: "2026-06-15",
    startTime: "09:00",
    endTime: "17:00",
    duration: "1 Day",
    mode: "Classroom / Online",
    location: "Training Center / Online",
    totalSeats: 25,
    seatsFilled: 18,
    status: "Seats Open",
    shortDescription: "A focused 1-day program for supervisors, QA/QC staff, and fresh graduates.",
    fullDescription: "Detailed description of the course/event.",
    relatedCourseUrl: "haccp-level-3.html",
    image: "assets/modern_industrial_training_in_action.png",
    published: true,
    createdAt: "2026-05-24",
    updatedAt: "2026-05-24"
  },
  {
    id: "evt_002",
    title: "HACCP Level 4 - Advanced Management Level",
    category: "HACCP Level 4",
    date: "2026-06-22",
    startTime: "09:00",
    endTime: "17:00",
    duration: "40 Hours",
    mode: "Structured Program",
    location: "Training Center / Online",
    totalSeats: 20,
    seatsFilled: 12,
    status: "Enquiry Open",
    shortDescription: "Advanced management-level HACCP training for QA/QC professionals and leaders.",
    fullDescription: "Detailed description of the course/event.",
    relatedCourseUrl: "haccp-level-4.html",
    image: "assets/collaborative_training_in_a_modern_lab.png",
    published: true,
    createdAt: "2026-05-24",
    updatedAt: "2026-05-24"
  },
  {
    id: "evt_003",
    title: "Free Food Safety Awareness Session",
    category: "Workshop",
    date: "2026-06-30",
    startTime: "18:00",
    endTime: "20:00",
    duration: "2 Hours",
    mode: "Online Webinar",
    location: "Online Webinar",
    totalSeats: 100,
    seatsFilled: 35,
    status: "Registration Open",
    shortDescription: "Introductory awareness session for learners exploring food safety and HACCP.",
    fullDescription: "Detailed description of the course/event.",
    relatedCourseUrl: "food-safety-haccp-advanced.html",
    image: "assets/modern_educational_course_offerings_layout.png",
    published: true,
    createdAt: "2026-05-24",
    updatedAt: "2026-05-24"
  },
  {
    id: "evt_004",
    title: "Food Safety Career Guidance Session",
    category: "Career Session",
    date: "2026-07-05",
    startTime: "19:00",
    endTime: "20:00",
    duration: "1 Hour",
    mode: "Online",
    location: "Online",
    totalSeats: 30,
    seatsFilled: 10,
    status: "Limited Seats",
    shortDescription: "Career guidance for graduates and professionals entering the food safety industry.",
    fullDescription: "Detailed description of the course/event.",
    relatedCourseUrl: "food-safety-haccp-advanced.html",
    image: "assets/professional_consultation_in_modern_office.png",
    published: true,
    createdAt: "2026-05-24",
    updatedAt: "2026-05-24"
  }
];

function getStoredEvents() {
  const stored = localStorage.getItem("vlearns_events");
  if (!stored) return VLEARNS_SAMPLE_EVENTS.slice();
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : VLEARNS_SAMPLE_EVENTS.slice();
  } catch (error) {
    return VLEARNS_SAMPLE_EVENTS.slice();
  }
}

function saveStoredEvents(events) {
  localStorage.setItem("vlearns_events", JSON.stringify(events));
}

function publishedEvents() {
  return getStoredEvents()
    .filter((event) => event.published !== false)
    .sort((a, b) => new Date(`${a.date}T${a.startTime || "00:00"}`) - new Date(`${b.date}T${b.startTime || "00:00"}`));
}

function formatEventDate(dateString, options = {}) {
  const defaults = { day: "2-digit", month: "short", year: "numeric" };
  return new Intl.DateTimeFormat("en-GB", { ...defaults, ...options }).format(new Date(`${dateString}T00:00:00`));
}

function eventType(event) {
  if (event.category === "Workshop") return "workshop";
  if (event.category === "Career Session") return "career";
  return "class";
}

function statusClass(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("limited")) return "limited";
  if (normalized.includes("full") || normalized.includes("cancelled")) return "danger";
  if (normalized.includes("enquiry")) return "warning";
  return "open";
}

function whatsappUrl(event) {
  const text = `${VLEARNS_REGISTER_TEXT}: ${event.title} on ${formatEventDate(event.date)}.`;
  return `${VLEARNS_WHATSAPP}?text=${encodeURIComponent(text)}`;
}

function googleCalendarUrl(event) {
  const start = `${event.date.replaceAll("-", "")}T${(event.startTime || "09:00").replace(":", "")}00`;
  const end = `${event.date.replaceAll("-", "")}T${(event.endTime || "17:00").replace(":", "")}00`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    details: `${event.shortDescription || ""} Seats: ${event.seatsFilled}/${event.totalSeats}.`,
    location: event.location || event.mode || "V Learns Education"
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
