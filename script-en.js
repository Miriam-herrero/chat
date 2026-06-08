const serviceTabs = document.querySelectorAll("[data-service-tab]");
const serviceDetailEl = document.querySelector("#service-detail");
const serviceModalEl = document.querySelector("#service-modal");
const closeModalButtons = document.querySelectorAll("[data-close-modal]");
let lastServiceTrigger = null;

const calendarGridEl = document.querySelector("#calendar-grid");
const calendarMonthEl = document.querySelector("#calendar-month");
const selectedDateTitleEl = document.querySelector("#selected-date-title");
const selectedDateCopyEl = document.querySelector("#selected-date-copy");
const slotListEl = document.querySelector("#slot-list");
const prevMonthButton = document.querySelector("#prev-month");
const nextMonthButton = document.querySelector("#next-month");
const bookingModalEl = document.querySelector("#booking-modal");
const bookingFormEl = document.querySelector("#booking-form");
const bookingSummaryEl = document.querySelector("#booking-summary");
const bookingServiceEl = document.querySelector("#booking-service");
const bookingNameEl = document.querySelector("#booking-name");
const bookingPhoneEl = document.querySelector("#booking-phone");
const bookingEmailEl = document.querySelector("#booking-email");
const bookingCommentsEl = document.querySelector("#booking-comments");
const closeBookingButtons = document.querySelectorAll("[data-close-booking]");
const adminEntryButton = document.querySelector("#admin-entry");
const adminModalEl = document.querySelector("#admin-modal");
const closeAdminButtons = document.querySelectorAll("[data-close-admin]");
const pinPanelEl = document.querySelector("#pin-panel");
const adminPanelEl = document.querySelector("#admin-panel");
const pinFormEl = document.querySelector("#pin-form");
const adminPinEl = document.querySelector("#admin-pin");
const pinErrorEl = document.querySelector("#pin-error");
const adminLogoutButton = document.querySelector("#admin-logout");
const availabilityFormEl = document.querySelector("#availability-form");
const availabilityDateEl = document.querySelector("#availability-date");
const availabilityEditorEl = document.querySelector("#availability-editor");
const morningOnlyButton = document.querySelector("#morning-only");
const clearDayButton = document.querySelector("#clear-day");
const manualAppointmentFormEl = document.querySelector("#manual-appointment-form");
const manualDateEl = document.querySelector("#manual-date");
const manualTimeEl = document.querySelector("#manual-time");
const manualNameEl = document.querySelector("#manual-name");
const manualPhoneEl = document.querySelector("#manual-phone");
const manualEmailEl = document.querySelector("#manual-email");
const manualServiceEl = document.querySelector("#manual-service");
const adminAppointmentsEl = document.querySelector("#admin-appointments");
const eventsListEl = document.querySelector("#events-list");
const eventFormEl = document.querySelector("#event-form");
const eventNameEl = document.querySelector("#event-name");
const eventPlaceEl = document.querySelector("#event-place");
const eventDateEl = document.querySelector("#event-date");
const eventDurationEl = document.querySelector("#event-duration");
const eventPriceEl = document.querySelector("#event-price");
const eventContentEl = document.querySelector("#event-content");
const eventErrorEl = document.querySelector("#event-error");
const adminEventsEl = document.querySelector("#admin-events");
const ADMIN_PIN = "987321";
const STANDARD_SLOT_GROUPS = [
  { label: "Morning", slots: ["09:00", "10:00", "11:00", "12:00", "13:00"] },
  { label: "Afternoon", slots: ["16:00", "17:00", "18:00", "19:00", "20:00"] },
];
const MORNING_SLOTS = STANDARD_SLOT_GROUPS[0].slots;
const calendarFormatter = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });
const dateTitleFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
});
const CALENDAR_STORAGE_KEY = "miriamCalendarStateV2";
const today = new Date();
let calendarCursor = new Date(today.getFullYear(), today.getMonth(), 1);
let selectedDateKey = toDateKey(today);
let pendingBooking = null;
let isAdminMode = false;
let preselectedService = new URLSearchParams(window.location.search).get("service") || "";

const serviceCatalog = {
  faciales: {
    title: "Exclusive facials",
    intro: "Personalized facial treatments to restore balance, firmness and natural luminosity to the skin.",
    treatments: [
      {
        name: "Personalized Facial",
        duration: "50 min",
        price: "€50",
        description:
          "Treatment designed after a previous diagnosis of the skin. Combines specific active ingredients, masks and aromatherapy to restore balance and natural luminosity.",
      },
      {
        name: "Deep Sea Purifying Facial",
        duration: "80 min",
        price: "€65",
        description:
          "Deep facial hygiene with steam, manual extraction, facial lymphatic drainage and purifying mask for clean, fresh and revitalized skin.",
      },
      {
        name: "Manual Facial Lifting",
        duration: "80 min",
        price: "€90",
        description:
          "Firming treatment that combines facial hygiene, manual lifting massage and stimulation techniques to improve the firmness and luminosity of the skin.",
      },
      {
        name: "Premium Firming Facial",
        duration: "50 min",
        price: "€60",
        description:
          "Anti-aging facial aimed at improving the tone, elasticity and quality of the skin through firming massage and facial wood therapy.",
      },
    ],
  },
  corporal: {
    title: "Body treatments and wraps",
    intro: "Treatments to renew, nourish and adapt body care to the needs of each person.",
    treatments: [
      {
        name: "Revitalizing Exfoliation with Salts and Oils",
        duration: "50 min",
        price: "€45",
        description:
          "Body exfoliation with natural salts and aromatic oils that renews the skin and provides softness and luminosity.",
      },
      {
        name: "Detoxifying Spirulina Wrap",
        duration: "80 min",
        price: "€80",
        description:
          "Body ritual that combines exfoliation and seaweed wrapping to revitalize the skin and provide a feeling of lightness.",
      },
      {
        name: "Hydrating Pink Clay Wrap",
        duration: "80 min",
        price: "€80",
        description:
          "Nourishing treatment designed to restore skin hydration and elasticity.",
      },
      {
        name: "Personalized Body Treatment",
        duration: "80 min",
        price: "€120",
        description:
          "Specific program with firming, circulatory, remodeling or detoxifying objectives adapted to the needs of each person.",
      },
    ],
  },
  masajes: {
    title: "Massages and manual therapies",
    intro: "Manual techniques and integrative therapies to relieve tension, promote circulation and recover body well-being.",
    treatments: [
      {
        name: "Aesthetic Massage",
        duration: "25 min",
        price: "€30",
        description:
          "Localized treatment aimed at stimulating circulation, improving skin quality and complementing body programs.",
      },
      {
        name: "Anti-Stress Recovery Massage",
        duration: "50 min",
        price: "€45",
        description:
          "Relaxing massage designed to relieve physical and mental tension, promoting deep rest.",
      },
      {
        name: "Lymphatic Drainage",
        duration: "50 min",
        price: "€50",
        description:
          "Gentle and rhythmic technique that promotes lymphatic circulation and helps reduce fluid retention.",
      },
      {
        name: "Holistic Foot Reflexology",
        duration: "50 min",
        price: "€50",
        description:
          "Manual work on reflex points on the feet to promote balance and general well-being.",
      },
      {
        name: "Holistic Massage with Aromatherapy",
        duration: "50 min",
        price: "€50",
        description:
          "Sensory experience that combines body massage and essential oils to harmonize body and mind.",
      },
      {
        name: "Deep Tissue Massage",
        duration: "50 min",
        price: "€55",
        description:
          "Specific work on deep muscle layers to release accumulated tension and improve mobility.",
      },
      {
        name: "Chiromassage",
        duration: "50 min",
        price: "€60",
        description:
          "Set of manual techniques aimed at relieving contractures, improving circulation and recovering body well-being.",
      },
      {
        name: "Sculpting Massage with Wood Therapy",
        duration: "50 min",
        price: "€60",
        description:
          "Natural technique performed with wooden instruments to stimulate circulation and redefine the body silhouette.",
      },
      {
        name: "Cellular Bioenergetic Osteopathy",
        duration: "80 min",
        price: "€90",
        description:
          "Integrative method that works on physical and energetic imbalances to promote harmony and global well-being.",
      },
    ],
  },
  rituales: {
    title: "World rituals",
    intro: "Immersive experiences inspired by ingredients, therapeutic heat and sensory care.",
    treatments: [
      {
        name: "Cacao Ecstasy",
        duration: "80 min",
        price: "€80",
        description:
          "Body exfoliation, nourishing cocoa wrap and relaxing massage in an immersive sensory experience.",
      },
      {
        name: "Vinotherapy Cure",
        duration: "80 min",
        price: "€80",
        description:
          "Antioxidant ritual with exfoliation, grape wrap and nourishing massage to revitalize body and skin.",
      },
      {
        name: "Hot Stone Massage",
        duration: "80 min",
        price: "€75",
        description:
          "The heat of the volcanic stones is combined with manual maneuvers to provide deep relaxation and body well-being.",
      },
    ],
  },
  autor: {
    title: "Signature rituals · Miriam Herrero",
    intro: "Deep experiences that combine manual technique, aesthetics and personalized body support.",
    treatments: [
      {
        name: "For How You Feel",
        duration: "110 min",
        price: "€90",
        description:
          "Ritual aimed at releasing tensions, balancing the nervous system and recovering physical and emotional well-being.",
      },
      {
        name: "For How You Look",
        duration: "110 min",
        price: "€95",
        description:
          "Comprehensive experience that combines advanced facial care and manual techniques to enhance the skin's natural beauty.",
      },
      {
        name: "For How You Transform",
        duration: "110 min",
        price: "€100",
        description:
          "Deep body accompaniment aimed at comprehensive well-being and personal transformation processes.",
      },
    ],
  },
  mirada: {
    title: "Eye beauty",
    intro: "Treatments to enhance the eyes in an elegant, natural and long-lasting way.",
    treatments: [
      {
        name: "Eyelash Lift",
        duration: "80 min",
        price: "€50",
        description:
          "Treatment designed to lift, curve and define natural eyelashes from the roots, enhancing the look in an elegant and natural way. Includes specific nutrition to strengthen eyelashes and enhance long-lasting results.",
      },
    ],
  },
};

function renderServiceDetail(serviceKey) {
  const family = serviceCatalog[serviceKey];

  if (!family || !serviceDetailEl) {
    return;
  }

  serviceDetailEl.innerHTML = `
    <div class="service-detail-header">
      <div>
        <p class="eyebrow">Service list</p>
        <h3 id="service-modal-title">${family.title}</h3>
      </div>
      <p>${family.intro}</p>
    </div>
    <div class="treatment-list">
      ${family.treatments
        .map(
          (treatment) => `
            <article class="treatment-item">
              <div>
                <h4>${treatment.name}</h4>
                <p>${treatment.description}</p>
                <button class="schedule-service-button" type="button" data-book-service="${treatment.name}">
                  Book appointment
                </button>
              </div>
              <div class="treatment-meta">
                <span>${treatment.duration}</span>
                <span>${treatment.price}</span>
              </div>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function selectServiceTab(event) {
  const selectedKey = event.currentTarget.dataset.serviceTab;
  lastServiceTrigger = event.currentTarget;

  renderServiceDetail(selectedKey);
  openServiceModal();
}

function openServiceModal() {
  if (!serviceModalEl) {
    return;
  }

  serviceModalEl.classList.add("open");
  serviceModalEl.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  serviceModalEl.querySelector(".modal-close")?.focus();
}

function closeServiceModal() {
  if (!serviceModalEl || !serviceModalEl.classList.contains("open")) {
    return;
  }

  serviceModalEl.classList.remove("open");
  serviceModalEl.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  lastServiceTrigger?.focus();
}

function handleServiceDetailClick(event) {
  const button = event.target.closest("[data-book-service]");

  if (!button) {
    return;
  }

  preselectedService = button.dataset.bookService;
  closeServiceModal();
  history.replaceState(null, "", "#calendario");
  document.querySelector("#calendario")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function handleModalKeydown(event) {
  if (event.key === "Escape") {
    closeServiceModal();
    closeBookingModal();
    closeAdminModal();
  }
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getServiceOptions() {
  return Object.values(serviceCatalog).flatMap((family) =>
    family.treatments.map((treatment) => treatment.name),
  );
}

function createInitialCalendarState() {
  const availability = {};
  const baseSlots = ["10:00", "12:00", "17:00"];

  for (let offset = 1; offset <= 24; offset += 1) {
    const date = new Date();
    date.setDate(today.getDate() + offset);

    if (date.getDay() === 0) {
      continue;
    }

    availability[toDateKey(date)] = baseSlots.slice(0, date.getDay() === 6 ? 2 : 3);
  }

  return { availability, appointments: [], events: [] };
}

function loadCalendarState() {
  try {
    const saved = localStorage.getItem(CALENDAR_STORAGE_KEY);
    const state = saved ? JSON.parse(saved) : createInitialCalendarState();
    state.availability ||= {};
    state.appointments ||= [];
    state.events ||= [];
    return state;
  } catch {
    return createInitialCalendarState();
  }
}

let calendarState = loadCalendarState();
selectedDateKey = findInitialSelectedDate();

function saveCalendarState() {
  localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(calendarState));
}

function findInitialSelectedDate() {
  const todayKey = toDateKey(today);
  return (
    Object.keys(calendarState.availability)
      .filter((dateKey) => dateKey >= todayKey && getAvailableSlots(dateKey).length)
      .sort()[0] || todayKey
  );
}

function getAppointmentsForDate(dateKey) {
  return calendarState.appointments
    .filter((appointment) => appointment.date === dateKey)
    .sort((a, b) => a.time.localeCompare(b.time));
}

function isSlotBooked(dateKey, time) {
  return calendarState.appointments.some(
    (appointment) => appointment.date === dateKey && appointment.time === time,
  );
}

function getEventForDate(dateKey) {
  return calendarState.events.find((event) => event.date === dateKey);
}

function getAvailableSlots(dateKey) {
  if (getEventForDate(dateKey)) {
    return [];
  }

  return (calendarState.availability[dateKey] || [])
    .filter((time) => !isSlotBooked(dateKey, time))
    .sort();
}

function renderCalendar() {
  if (!calendarGridEl || !calendarMonthEl) {
    return;
  }

  calendarMonthEl.textContent = calendarFormatter.format(calendarCursor);
  calendarGridEl.innerHTML = "";

  const year = calendarCursor.getFullYear();
  const month = calendarCursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < startOffset; i += 1) {
    const empty = document.createElement("span");
    empty.className = "calendar-day empty";
    calendarGridEl.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const dateKey = toDateKey(date);
    const availableCount = getAvailableSlots(dateKey).length;
    const appointmentsCount = getAppointmentsForDate(dateKey).length;
    const event = getEventForDate(dateKey);
    const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const button = document.createElement("button");
    button.type = "button";
    button.className = "calendar-day";
    button.dataset.date = dateKey;

    if (dateKey === selectedDateKey) {
      button.classList.add("selected");
    }

    if (isPast) {
      button.classList.add("past");
      button.disabled = true;
    }

    if (appointmentsCount) {
      button.classList.add("booked");
    }

    if (event) {
      button.classList.add("event-day");
      button.title = event.name;
    }

    button.innerHTML = `
      <strong>${day}</strong>
      <small>${event ? "Event" : availableCount ? `${availableCount} slots` : appointmentsCount ? `${appointmentsCount} appointment(s)` : "No slots"}</small>
    `;
    button.addEventListener("click", () => selectCalendarDate(dateKey));
    calendarGridEl.appendChild(button);
  }
}

function selectCalendarDate(dateKey) {
  selectedDateKey = dateKey;
  renderCalendar();
  renderSelectedDay();
}

function renderSelectedDay() {
  if (!selectedDateTitleEl || !slotListEl) {
    return;
  }

  const selectedDate = fromDateKey(selectedDateKey);
  const slots = getAvailableSlots(selectedDateKey);
  const appointments = getAppointmentsForDate(selectedDateKey);
  const event = getEventForDate(selectedDateKey);
  selectedDateTitleEl.textContent = dateTitleFormatter.format(selectedDate);
  selectedDateCopyEl.textContent = event
    ? `Date reserved for the event “${event.name}”.`
    : slots.length
    ? "Choose an available time and complete your details to request the booking."
    : "There are no available slots for this day. You can check other dates or contact us via WhatsApp.";
  slotListEl.innerHTML = "";

  if (!slots.length) {
    slotListEl.innerHTML = `<div class="empty-state">No times available.</div>`;
  } else {
    slots.forEach((time) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "slot-button";
      button.textContent = time;
      button.addEventListener("click", () => openBookingModal(selectedDateKey, time));
      slotListEl.appendChild(button);
    });
  }

  if (isAdminMode && appointments.length) {
    const adminList = document.createElement("div");
    adminList.className = "empty-state";
    adminList.innerHTML = `<strong>Appointments for the day</strong>${appointments
      .map((appointment) => `<br>${appointment.time} · ${appointment.name} · ${appointment.service}`)
      .join("")}`;
    slotListEl.appendChild(adminList);
  }
}

function populateServiceSelects() {
  const options = getServiceOptions()
    .map((service) => `<option value="${service}">${service}</option>`)
    .join("");

  if (bookingServiceEl) {
    bookingServiceEl.innerHTML = options;
  }

  if (manualServiceEl) {
    manualServiceEl.innerHTML = options;
  }
}

function openBookingModal(dateKey, time) {
  pendingBooking = { date: dateKey, time };
  bookingSummaryEl.textContent = `${dateTitleFormatter.format(fromDateKey(dateKey))} at ${time}`;
  bookingFormEl.reset();

  if (preselectedService && [...bookingServiceEl.options].some((option) => option.value === preselectedService)) {
    bookingServiceEl.value = preselectedService;
  }

  bookingModalEl.classList.add("open");
  bookingModalEl.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  bookingNameEl.focus();
}

function closeBookingModal() {
  if (!bookingModalEl || !bookingModalEl.classList.contains("open")) {
    return;
  }

  bookingModalEl.classList.remove("open");
  bookingModalEl.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  pendingBooking = null;
}

function submitBooking(event) {
  event.preventDefault();

  if (!pendingBooking || isSlotBooked(pendingBooking.date, pendingBooking.time)) {
    return;
  }

  calendarState.appointments.push({
    id: crypto.randomUUID(),
    date: pendingBooking.date,
    time: pendingBooking.time,
    service: bookingServiceEl.value,
    name: bookingNameEl.value.trim(),
    phone: bookingPhoneEl.value.trim(),
    email: bookingEmailEl.value.trim(),
    comments: bookingCommentsEl.value.trim(),
    source: "web",
  });
  saveCalendarState();
  closeBookingModal();
  renderCalendar();
  renderSelectedDay();
  renderAdminAppointments();
  selectedDateCopyEl.textContent = "Booking registered. Miriam will confirm the appointment with you.";
}

function openAdminModal() {
  adminModalEl.classList.add("open");
  adminModalEl.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  pinPanelEl.hidden = isAdminMode;
  adminPanelEl.hidden = !isAdminMode;
  pinErrorEl.textContent = "";
  availabilityDateEl.value = selectedDateKey;
  renderAvailabilityEditor();
  renderAdminAppointments();
  renderAdminEvents();
  adminPinEl.focus();
}

function closeAdminModal() {
  if (!adminModalEl || !adminModalEl.classList.contains("open")) {
    return;
  }

  adminModalEl.classList.remove("open");
  adminModalEl.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function submitPin(event) {
  event.preventDefault();

  if (adminPinEl.value !== ADMIN_PIN) {
    pinErrorEl.textContent = "Incorrect PIN.";
    return;
  }

  isAdminMode = true;
  pinPanelEl.hidden = true;
  adminPanelEl.hidden = false;
  adminPinEl.value = "";
  availabilityDateEl.value = selectedDateKey;
  renderSelectedDay();
  renderAvailabilityEditor();
  renderAdminAppointments();
  renderAdminEvents();
}

function logoutAdmin() {
  isAdminMode = false;
  pinPanelEl.hidden = false;
  adminPanelEl.hidden = true;
  closeAdminModal();
  renderSelectedDay();
}

function addManualAppointment(event) {
  event.preventDefault();
  const date = manualDateEl.value;
  const time = manualTimeEl.value;

  if (isSlotBooked(date, time)) {
    window.alert("That time already has an appointment.");
    return;
  }

  if (getEventForDate(date)) {
    window.alert("That date is reserved for an event.");
    return;
  }

  if (!calendarState.availability[date]) {
    calendarState.availability[date] = [];
  }

  if (!calendarState.availability[date].includes(time)) {
    calendarState.availability[date].push(time);
  }

  calendarState.appointments.push({
    id: crypto.randomUUID(),
    date,
    time,
    service: manualServiceEl.value,
    name: manualNameEl.value.trim(),
    phone: manualPhoneEl.value.trim(),
    email: manualEmailEl.value.trim(),
    comments: "Appointment arranged by phone",
    source: "phone",
  });
  saveCalendarState();
  manualAppointmentFormEl.reset();
  selectCalendarDate(date);
  availabilityDateEl.value = date;
  renderAvailabilityEditor();
  renderAdminAppointments();
}

function deleteAppointment(id) {
  calendarState.appointments = calendarState.appointments.filter((appointment) => appointment.id !== id);
  saveCalendarState();
  renderCalendar();
  renderSelectedDay();
  renderAvailabilityEditor();
  renderAdminAppointments();
}

function renderAdminAppointments() {
  if (!adminAppointmentsEl) {
    return;
  }

  const appointments = calendarState.appointments
    .slice()
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  if (!appointments.length) {
    adminAppointmentsEl.innerHTML = `<div class="empty-state">There are no scheduled appointments yet.</div>`;
    return;
  }

  adminAppointmentsEl.innerHTML = "";
  appointments.forEach((appointment) => {
    const row = document.createElement("article");
    row.className = "appointment-row";
    row.innerHTML = `
      <div>
        <strong>${appointment.date} · ${appointment.time} · ${appointment.name}</strong>
        <span>${appointment.service}</span>
        <span>${appointment.phone}${appointment.email ? ` · ${appointment.email}` : ""}</span>
      </div>
      <button class="danger-button" type="button">Delete</button>
    `;
    row.querySelector("button").addEventListener("click", () => deleteAppointment(appointment.id));
    adminAppointmentsEl.appendChild(row);
  });
}

function renderEvents() {
  if (!eventsListEl) {
    return;
  }

  const todayKey = toDateKey(today);
  const events = calendarState.events
    .filter((event) => event.date >= todayKey)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));

  eventsListEl.innerHTML = events.length
    ? events
        .map(
          (event) => `
            <article class="event-card">
              <p class="eyebrow">${dateTitleFormatter.format(fromDateKey(event.date))}</p>
              <h3>${event.name}</h3>
              <div class="event-meta">
                <span>${event.place}</span>
                <span>${event.duration}</span>
                <span>${event.price}</span>
              </div>
              <p>${event.content}</p>
            </article>
          `,
        )
        .join("")
    : `<div class="empty-state">There are no upcoming events published yet.</div>`;
}

function renderAdminEvents() {
  if (!adminEventsEl) {
    return;
  }

  const events = calendarState.events.slice().sort((a, b) => a.date.localeCompare(b.date));
  adminEventsEl.innerHTML = events.length ? "" : `<div class="empty-state">There are no published events yet.</div>`;

  events.forEach((event) => {
    const row = document.createElement("article");
    row.className = "appointment-row";
    row.innerHTML = `
      <div>
        <strong>${event.date} · ${event.name}</strong>
        <span>${event.place} · ${event.duration} · ${event.price}</span>
      </div>
      <button class="danger-button" type="button">Delete</button>
    `;
    row.querySelector("button").addEventListener("click", () => deleteEvent(event.id));
    adminEventsEl.appendChild(row);
  });
}

function addEvent(event) {
  event.preventDefault();
  const date = eventDateEl.value;
  const appointments = getAppointmentsForDate(date);

  eventErrorEl.textContent = "";

  if (getEventForDate(date)) {
    eventErrorEl.textContent = "An event is already published on that date.";
    return;
  }

  if (appointments.length) {
    eventErrorEl.textContent = "That date cannot be reserved because it already has appointments. Delete or reschedule the existing appointments first.";
    return;
  }

  calendarState.events.push({
    id: crypto.randomUUID(),
    name: eventNameEl.value.trim(),
    place: eventPlaceEl.value.trim(),
    date,
    duration: eventDurationEl.value.trim(),
    price: eventPriceEl.value.trim(),
    content: eventContentEl.value.trim(),
  });
  saveCalendarState();
  eventFormEl.reset();
  renderCalendar();
  renderSelectedDay();
  renderEvents();
  renderAdminEvents();
}

function deleteEvent(id) {
  calendarState.events = calendarState.events.filter((event) => event.id !== id);
  saveCalendarState();
  renderCalendar();
  renderSelectedDay();
  renderEvents();
  renderAdminEvents();
}

function getAvailabilityEditorDate() {
  if (!availabilityDateEl.value) {
    availabilityDateEl.value = selectedDateKey;
  }

  return availabilityDateEl.value;
}

function renderAvailabilityEditor() {
  if (!availabilityEditorEl) {
    return;
  }

  const date = getAvailabilityEditorDate();
  const dayAvailability = calendarState.availability[date] || [];
  const bookedSlots = getAppointmentsForDate(date).map((appointment) => appointment.time);

  availabilityEditorEl.innerHTML = STANDARD_SLOT_GROUPS.map(
    (group) => `
      <div class="availability-group">
        <strong>${group.label}</strong>
        <div class="availability-slots">
          ${group.slots
            .map((slot) => {
              const isBooked = bookedSlots.includes(slot);
              const isChecked = dayAvailability.includes(slot) || isBooked;
              return `
                <label class="availability-slot">
                  <input
                    type="checkbox"
                    value="${slot}"
                    ${isChecked ? "checked" : ""}
                    ${isBooked ? "disabled" : ""}
                  />
                  <span>${slot}${isBooked ? " · appointment" : ""}</span>
                </label>
              `;
            })
            .join("")}
        </div>
      </div>
    `,
  ).join("");
}

function saveDayAvailability(event) {
  event.preventDefault();
  const date = getAvailabilityEditorDate();
  const checkedSlots = [...availabilityEditorEl.querySelectorAll("input:checked")].map(
    (input) => input.value,
  );
  const bookedSlots = getAppointmentsForDate(date).map((appointment) => appointment.time);
  calendarState.availability[date] = [...new Set([...checkedSlots, ...bookedSlots])].sort();
  saveCalendarState();
  selectCalendarDate(date);
  renderAvailabilityEditor();
  renderAdminAppointments();
}

function setMorningOnly() {
  const date = getAvailabilityEditorDate();
  const bookedSlots = getAppointmentsForDate(date).map((appointment) => appointment.time);
  calendarState.availability[date] = [...new Set([...MORNING_SLOTS, ...bookedSlots])].sort();
  saveCalendarState();
  selectCalendarDate(date);
  renderAvailabilityEditor();
}

function clearSelectedDay() {
  const date = getAvailabilityEditorDate();
  const bookedSlots = getAppointmentsForDate(date).map((appointment) => appointment.time);
  calendarState.availability[date] = bookedSlots.sort();
  saveCalendarState();
  selectCalendarDate(date);
  renderAvailabilityEditor();
}

serviceTabs.forEach((tab) => tab.addEventListener("click", selectServiceTab));
serviceDetailEl?.addEventListener("click", handleServiceDetailClick);
closeModalButtons.forEach((button) => button.addEventListener("click", closeServiceModal));
document.addEventListener("keydown", handleModalKeydown);
prevMonthButton?.addEventListener("click", () => {
  calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() - 1, 1);
  renderCalendar();
});
nextMonthButton?.addEventListener("click", () => {
  calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + 1, 1);
  renderCalendar();
});
bookingFormEl?.addEventListener("submit", submitBooking);
closeBookingButtons.forEach((button) => button.addEventListener("click", closeBookingModal));
adminEntryButton?.addEventListener("click", openAdminModal);
closeAdminButtons.forEach((button) => button.addEventListener("click", closeAdminModal));
pinFormEl?.addEventListener("submit", submitPin);
adminLogoutButton?.addEventListener("click", logoutAdmin);
availabilityFormEl?.addEventListener("submit", saveDayAvailability);
availabilityDateEl?.addEventListener("change", () => {
  selectCalendarDate(availabilityDateEl.value);
  renderAvailabilityEditor();
});
morningOnlyButton?.addEventListener("click", setMorningOnly);
clearDayButton?.addEventListener("click", clearSelectedDay);
manualAppointmentFormEl?.addEventListener("submit", addManualAppointment);
eventFormEl?.addEventListener("submit", addEvent);
populateServiceSelects();
renderCalendar();
renderSelectedDay();
renderEvents();
