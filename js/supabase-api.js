(function () {
  const config = window.VLEARNS_SUPABASE_CONFIG || {};
  const isConfigured = Boolean(config.url && config.anonKey && window.supabase);
  const client = isConfigured ? window.supabase.createClient(config.url, config.anonKey) : null;

  function mapEventFromDb(row) {
    return {
      id: row.id,
      title: row.title,
      category: row.category,
      date: row.event_date,
      startTime: row.start_time || "09:00",
      endTime: row.end_time || "17:00",
      duration: row.duration || "",
      mode: row.mode || "",
      location: row.location || "",
      totalSeats: row.total_seats || 0,
      seatsFilled: row.seats_filled || 0,
      status: row.status || "Draft",
      shortDescription: row.short_description || "",
      fullDescription: row.full_description || "",
      relatedCourseUrl: row.related_course_url || "",
      image: row.image || "",
      published: row.published !== false,
      createdAt: row.created_at ? row.created_at.slice(0, 10) : "",
      updatedAt: row.updated_at ? row.updated_at.slice(0, 10) : ""
    };
  }

  function mapEventToDb(event) {
    return {
      id: event.id,
      title: event.title,
      category: event.category,
      event_date: event.date,
      start_time: event.startTime || null,
      end_time: event.endTime || null,
      duration: event.duration || null,
      mode: event.mode || null,
      location: event.location || null,
      total_seats: Number(event.totalSeats || 0),
      seats_filled: Number(event.seatsFilled || 0),
      status: event.status || "Draft",
      short_description: event.shortDescription || null,
      full_description: event.fullDescription || null,
      related_course_url: event.relatedCourseUrl || null,
      image: event.image || null,
      published: event.published !== false,
      updated_at: new Date().toISOString()
    };
  }

  function mapRegistrationToDb(registration) {
    return {
      id: registration.id,
      name: registration.name,
      phone: registration.phone,
      email: registration.email || null,
      event_title: registration.event,
      course: registration.course,
      event_date: registration.date,
      source: registration.source || "Calendar Form",
      status: registration.status || "New",
      message: registration.message || null
    };
  }

  function mapRegistrationFromDb(row) {
    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email || "",
      event: row.event_title,
      course: row.course,
      date: row.event_date,
      source: row.source,
      status: row.status,
      message: row.message || ""
    };
  }

  function mapEnquiryToDb(enquiry) {
    return {
      id: enquiry.id,
      name: enquiry.name,
      phone: enquiry.phone,
      email: enquiry.email || null,
      interested_course: enquiry.interestedCourse,
      message: enquiry.message || null,
      enquiry_date: enquiry.date || new Date().toISOString().slice(0, 10),
      source: enquiry.source || "Calendar Form",
      status: enquiry.status || "New"
    };
  }

  function mapEnquiryFromDb(row) {
    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email || "",
      interestedCourse: row.interested_course,
      message: row.message || "",
      date: row.enquiry_date,
      status: row.status,
      source: row.source
    };
  }

  async function syncFromSupabase() {
    if (!client) return false;
    const [eventsResult, registrationsResult, enquiriesResult] = await Promise.all([
      client.from("events").select("*").order("event_date", { ascending: true }),
      client.from("registrations").select("*").order("created_at", { ascending: false }),
      client.from("enquiries").select("*").order("created_at", { ascending: false })
    ]);
    if (!eventsResult.error && eventsResult.data?.length) saveStoredEvents(eventsResult.data.map(mapEventFromDb));
    if (!registrationsResult.error && registrationsResult.data) saveStoredRegistrations(registrationsResult.data.map(mapRegistrationFromDb));
    if (!enquiriesResult.error && enquiriesResult.data) saveStoredEnquiries(enquiriesResult.data.map(mapEnquiryFromDb));
    window.dispatchEvent(new CustomEvent("vlearns:supabase-sync"));
    return true;
  }

  async function upsertEvent(event) {
    if (!client) return false;
    const { error } = await client.from("events").upsert(mapEventToDb(event));
    if (error) console.warn("Supabase event upsert failed", error.message);
    return !error;
  }

  async function deleteEvent(id) {
    if (!client) return false;
    const { error } = await client.from("events").delete().eq("id", id);
    if (error) console.warn("Supabase event delete failed", error.message);
    return !error;
  }

  async function insertRegistration(registration) {
    if (!client) return false;
    const { error } = await client.from("registrations").insert(mapRegistrationToDb(registration));
    if (error) console.warn("Supabase registration insert failed", error.message);
    return !error;
  }

  async function updateRegistration(registration) {
    if (!client) return false;
    const { error } = await client.from("registrations").upsert(mapRegistrationToDb(registration));
    if (error) console.warn("Supabase registration update failed", error.message);
    return !error;
  }

  async function deleteRegistration(id) {
    if (!client) return false;
    const { error } = await client.from("registrations").delete().eq("id", id);
    if (error) console.warn("Supabase registration delete failed", error.message);
    return !error;
  }

  async function insertEnquiry(enquiry) {
    if (!client) return false;
    const { error } = await client.from("enquiries").insert(mapEnquiryToDb(enquiry));
    if (error) console.warn("Supabase enquiry insert failed", error.message);
    return !error;
  }

  async function updateEnquiry(enquiry) {
    if (!client) return false;
    const { error } = await client.from("enquiries").upsert(mapEnquiryToDb(enquiry));
    if (error) console.warn("Supabase enquiry update failed", error.message);
    return !error;
  }

  async function deleteEnquiry(id) {
    if (!client) return false;
    const { error } = await client.from("enquiries").delete().eq("id", id);
    if (error) console.warn("Supabase enquiry delete failed", error.message);
    return !error;
  }

  window.VLearnsSupabase = {
    client,
    isConfigured,
    syncFromSupabase,
    upsertEvent,
    deleteEvent,
    insertRegistration,
    updateRegistration,
    deleteRegistration,
    insertEnquiry,
    updateEnquiry,
    deleteEnquiry
  };
})();
