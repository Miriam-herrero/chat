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
  { label: "Mañana", slots: ["09:00", "10:00", "11:00", "12:00", "13:00"] },
  { label: "Tarde", slots: ["16:00", "17:00", "18:00", "19:00", "20:00"] },
];
const MORNING_SLOTS = STANDARD_SLOT_GROUPS[0].slots;
const calendarFormatter = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" });
const dateTitleFormatter = new Intl.DateTimeFormat("es-ES", {
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
    title: "Faciales exclusivos",
    intro: "Tratamientos faciales personalizados para restaurar el equilibrio, la firmeza y la luminosidad natural de la piel.",
    treatments: [
      {
        name: "Facial Personalizado",
        duration: "50 min",
        price: "50 EUR",
        description:
          "Tratamiento diseñado tras un diagnóstico previo de la piel. Combina activos específicos, mascarillas y aromaterapia para restaurar el equilibrio y la luminosidad natural.",
      },
      {
        name: "Mar Profundo Purificante",
        duration: "80 min",
        price: "65 EUR",
        description:
          "Higiene facial profunda con vapor, extracción manual, drenaje linfático facial y mascarilla purificante para una piel limpia, fresca y revitalizada.",
      },
      {
        name: "Lifting Facial Manual",
        duration: "80 min",
        price: "90 EUR",
        description:
          "Tratamiento reafirmante que combina higiene facial, masaje lifting manual y técnicas de estimulación para mejorar la firmeza y luminosidad de la piel.",
      },
      {
        name: "Facial Reafirmante Premium",
        duration: "50 min",
        price: "60 EUR",
        description:
          "Facial antiedad orientado a mejorar el tono, la elasticidad y la calidad de la piel mediante masaje reafirmante y maderoterapia facial.",
      },
    ],
  },
  corporal: {
    title: "Tratamientos corporales y envolturas",
    intro: "Tratamientos para renovar, nutrir y adaptar el cuidado corporal a las necesidades de cada persona.",
    treatments: [
      {
        name: "Exfoliación Revitalizante con Sales y Aceites",
        duration: "50 min",
        price: "45 EUR",
        description:
          "Exfoliación corporal con sales naturales y aceites aromáticos que renueva la piel y aporta suavidad y luminosidad.",
      },
      {
        name: "Envoltura Desintoxicante de Espirulina",
        duration: "80 min",
        price: "80 EUR",
        description:
          "Ritual corporal que combina exfoliación y envoltura de algas para revitalizar la piel y aportar sensación de ligereza.",
      },
      {
        name: "Envoltura Hidratante de Arcilla Rosa",
        duration: "80 min",
        price: "80 EUR",
        description:
          "Tratamiento nutritivo diseñado para restaurar la hidratación y elasticidad de la piel.",
      },
      {
        name: "Tratamiento Corporal Personalizado",
        duration: "80 min",
        price: "120 EUR",
        description:
          "Programa específico con objetivos reafirmantes, circulatorios, remodelantes o desintoxicantes adaptado a las necesidades de cada persona.",
      },
    ],
  },
  masajes: {
    title: "Masajes y terapias manuales",
    intro: "Técnicas manuales y terapias integrativas para aliviar tensiones, favorecer la circulación y recuperar el bienestar corporal.",
    treatments: [
      {
        name: "Masaje Estético",
        duration: "25 min",
        price: "30 EUR",
        description:
          "Tratamiento localizado destinado a estimular la circulación, mejorar la calidad de la piel y complementar programas corporales.",
      },
      {
        name: "Masaje Antiestrés Recuperador",
        duration: "50 min",
        price: "45 EUR",
        description:
          "Masaje relajante diseñado para aliviar tensiones físicas y mentales, favoreciendo el descanso profundo.",
      },
      {
        name: "Drenaje Linfático",
        duration: "50 min",
        price: "50 EUR",
        description:
          "Técnica suave y rítmica que favorece la circulación linfática y ayuda a reducir la retención de líquidos.",
      },
      {
        name: "Reflexología Podal Holística",
        duration: "50 min",
        price: "50 EUR",
        description:
          "Trabajo manual sobre puntos reflejos de los pies para favorecer el equilibrio y el bienestar general.",
      },
      {
        name: "Masaje Holístico con Aromaterapia",
        duration: "50 min",
        price: "50 EUR",
        description:
          "Experiencia sensorial que combina masaje corporal y aceites esenciales para armonizar cuerpo y mente.",
      },
      {
        name: "Masaje de Tejido Profundo",
        duration: "50 min",
        price: "55 EUR",
        description:
          "Trabajo específico sobre las capas musculares profundas para liberar tensiones acumuladas y mejorar la movilidad.",
      },
      {
        name: "Quiromasaje",
        duration: "50 min",
        price: "60 EUR",
        description:
          "Conjunto de técnicas manuales orientadas a aliviar contracturas, mejorar la circulación y recuperar el bienestar corporal.",
      },
      {
        name: "Masaje Escultural con Maderoterapia",
        duration: "50 min",
        price: "60 EUR",
        description:
          "Técnica natural realizada con instrumentos de madera para estimular la circulación y redefinir la silueta corporal.",
      },
      {
        name: "Osteopatía Bioenergética Celular",
        duration: "80 min",
        price: "90 EUR",
        description:
          "Método integrativo que trabaja los desequilibrios físicos y energéticos para favorecer la armonía y el bienestar global.",
      },
    ],
  },
  rituales: {
    title: "Rituales especiales del mundo",
    intro: "Experiencias envolventes inspiradas en ingredientes, calor terapéutico y cuidado sensorial.",
    treatments: [
      {
        name: "Éxtasis de Cacao",
        duration: "80 min",
        price: "80 EUR",
        description:
          "Exfoliación corporal, envoltura nutritiva de cacao y masaje relajante en una experiencia sensorial envolvente.",
      },
      {
        name: "Cura de Vinoterapia",
        duration: "80 min",
        price: "80 EUR",
        description:
          "Ritual antioxidante con exfoliación, envoltura de uva y masaje nutritivo para revitalizar cuerpo y piel.",
      },
      {
        name: "Masaje con Piedras Calientes",
        duration: "80 min",
        price: "75 EUR",
        description:
          "El calor de las piedras volcánicas se combina con maniobras manuales para proporcionar relajación profunda y bienestar corporal.",
      },
    ],
  },
  autor: {
    title: "Rituales de autor Miriam Herrero",
    intro: "Experiencias profundas que combinan técnica manual, estética y acompañamiento corporal personalizado.",
    treatments: [
      {
        name: "Para Cómo Te Sientes",
        duration: "110 min",
        price: "90 EUR",
        description:
          "Ritual orientado a liberar tensiones, equilibrar el sistema nervioso y recuperar el bienestar físico y emocional.",
      },
      {
        name: "Para Cómo Te Ves",
        duration: "110 min",
        price: "95 EUR",
        description:
          "Experiencia integral que combina cuidado facial avanzado y técnicas manuales para potenciar la belleza natural de la piel.",
      },
      {
        name: "Para Cómo Te Transformas",
        duration: "110 min",
        price: "100 EUR",
        description:
          "Acompañamiento corporal profundo orientado al bienestar integral y a los procesos de transformación personal.",
      },
    ],
  },
  mirada: {
    title: "Belleza de la mirada",
    intro: "Tratamientos para realzar la mirada de forma elegante, natural y duradera.",
    treatments: [
      {
        name: "Lifting de Pestañas",
        duration: "80 min",
        price: "50 EUR",
        description:
          "Tratamiento diseñado para elevar, curvar y definir las pestañas naturales desde la raíz, realzando la mirada de forma elegante y natural. Incluye nutrición específica para fortalecer las pestañas y potenciar un resultado duradero.",
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
        <p class="eyebrow">Listado de servicios</p>
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
                  Agendar cita
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
      <small>${event ? "Evento" : availableCount ? `${availableCount} huecos` : appointmentsCount ? `${appointmentsCount} cita(s)` : "Sin huecos"}</small>
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
    ? `Fecha reservada para el evento “${event.name}”.`
    : slots.length
    ? "Elige una hora disponible y completa tus datos para solicitar la reserva."
    : "No hay huecos disponibles para este día. Puedes revisar otras fechas o contactar por WhatsApp.";
  slotListEl.innerHTML = "";

  if (!slots.length) {
    slotListEl.innerHTML = `<div class="empty-state">Sin horarios disponibles.</div>`;
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
    adminList.innerHTML = `<strong>Citas del día</strong>${appointments
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
  bookingSummaryEl.textContent = `${dateTitleFormatter.format(fromDateKey(dateKey))} a las ${time}`;
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
  selectedDateCopyEl.textContent = "Reserva registrada. Miriam confirmará la cita contigo.";
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
    pinErrorEl.textContent = "PIN incorrecto.";
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
    window.alert("Ese horario ya tiene una cita.");
    return;
  }

  if (getEventForDate(date)) {
    window.alert("Esa fecha está reservada para un evento.");
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
    comments: "Cita concertada por teléfono",
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
    adminAppointmentsEl.innerHTML = `<div class="empty-state">Todavía no hay citas agendadas.</div>`;
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
      <button class="danger-button" type="button">Eliminar</button>
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
    : `<div class="empty-state">Todavía no hay próximos eventos publicados.</div>`;
}

function renderAdminEvents() {
  if (!adminEventsEl) {
    return;
  }

  const events = calendarState.events.slice().sort((a, b) => a.date.localeCompare(b.date));
  adminEventsEl.innerHTML = events.length ? "" : `<div class="empty-state">Todavía no hay eventos publicados.</div>`;

  events.forEach((event) => {
    const row = document.createElement("article");
    row.className = "appointment-row";
    row.innerHTML = `
      <div>
        <strong>${event.date} · ${event.name}</strong>
        <span>${event.place} · ${event.duration} · ${event.price}</span>
      </div>
      <button class="danger-button" type="button">Eliminar</button>
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
    eventErrorEl.textContent = "Ya existe un evento publicado en esa fecha.";
    return;
  }

  if (appointments.length) {
    eventErrorEl.textContent = "No se puede reservar esa fecha porque ya tiene citas. Elimina o reprograma primero las citas existentes.";
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
                  <span>${slot}${isBooked ? " · cita" : ""}</span>
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
