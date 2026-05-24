const VLEARNS_WHATSAPP = "https://wa.me/917907884504";
const VLEARNS_REGISTER_TEXT = "Hi V Learns Education, I want to register for an upcoming training batch";
const VLEARNS_SAMPLE_REGISTRATIONS = [
  {
    id: "reg_001",
    name: "Aisha Rahman",
    phone: "+91 90000 11111",
    email: "aisha@example.com",
    event: "HACCP Level 3 - Supervisory Level",
    course: "HACCP Level 3",
    date: "2026-06-15",
    source: "WhatsApp",
    status: "New",
    message: "Interested in the next HACCP Level 3 batch."
  },
  {
    id: "reg_002",
    name: "Rohit Menon",
    phone: "+91 90000 22222",
    email: "rohit@example.com",
    event: "Food Safety Career Guidance Session",
    course: "Career Session",
    date: "2026-07-05",
    source: "Calendar",
    status: "Contacted",
    message: "Need guidance before selecting a course."
  }
];

const VLEARNS_SAMPLE_ENQUIRIES = [
  {
    id: "enq_001",
    name: "Fathima K",
    phone: "+91 90000 33333",
    email: "fathima@example.com",
    interestedCourse: "HACCP Level 4",
    message: "Need next batch details.",
    date: "2026-05-24",
    status: "New",
    source: "Contact Form"
  },
  {
    id: "enq_002",
    name: "Arjun P",
    phone: "+91 90000 44444",
    email: "arjun@example.com",
    interestedCourse: "Food Safety Advanced Training",
    message: "Career guidance request.",
    date: "2026-05-24",
    status: "Follow-up",
    source: "Chatbot"
  }
];

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

function readStoredList(key, fallback) {
  const stored = localStorage.getItem(key);
  if (!stored) return fallback.slice();
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : fallback.slice();
  } catch (error) {
    return fallback.slice();
  }
}

function writeStoredList(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}

function getStoredRegistrations() {
  return readStoredList("vlearns_registrations", VLEARNS_SAMPLE_REGISTRATIONS);
}

function saveStoredRegistrations(registrations) {
  writeStoredList("vlearns_registrations", registrations);
}

function getStoredEnquiries() {
  return readStoredList("vlearns_enquiries", VLEARNS_SAMPLE_ENQUIRIES);
}

function saveStoredEnquiries(enquiries) {
  writeStoredList("vlearns_enquiries", enquiries);
}

function addStoredRegistration(registration) {
  const registrations = getStoredRegistrations();
  registrations.unshift({
    id: `reg_${Date.now()}`,
    source: "Calendar Form",
    status: "New",
    ...registration
  });
  saveStoredRegistrations(registrations);
  return registrations[0];
}

function addStoredEnquiry(enquiry) {
  const enquiries = getStoredEnquiries();
  enquiries.unshift({
    id: `enq_${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    source: "Calendar Form",
    status: "New",
    ...enquiry
  });
  saveStoredEnquiries(enquiries);
  return enquiries[0];
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
