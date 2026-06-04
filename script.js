const messagesEl = document.querySelector("#messages");
const formEl = document.querySelector("#chat-form");
const inputEl = document.querySelector("#message-input");
const promptButtons = document.querySelectorAll("[data-prompt]");
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
let preselectedService = "";

const serviceCatalog = {
  faciales: {
    title: "Faciales exclusivos",
    intro: "Tratamientos personalizados para cuidar la piel desde el diagnóstico, la técnica manual y la estética sensorial.",
    treatments: [
      {
        name: "A Medida",
        duration: "55 min",
        price: "50 EUR",
        description:
          "Tratamiento diseñado según las necesidades de la piel, con diagnóstico previo, sérums activos, mascarillas y complejos aromáticos. Una propuesta personalizada con enfoque equilibrante o hidratante.",
      },
      {
        name: "Mar Profundo Purificante",
        duration: "1 h 15 min",
        price: "65 EUR",
        description:
          "Ideal para pieles que necesitan respirar. Combina preparación con vapor, extracción manual, drenaje linfático facial y mascarilla desintoxicante.",
      },
      {
        name: "Anti-Edad Milagro Facial",
        duration: "55 min",
        price: "60 EUR",
        description:
          "Facial reafirmante orientado a mejorar firmeza, luminosidad y calidad de la piel mediante masaje manual reafirmante y maderoterapia facial sutil.",
      },
    ],
  },
  corporal: {
    title: "Cuidado corporal y envolturas",
    intro: "Rituales corporales para renovar, nutrir y acompañar el descanso del cuerpo.",
    treatments: [
      {
        name: "Exfoliación Revitalizante con Sales y Aceites",
        duration: "45 min",
        price: "45 EUR",
        description:
          "Aceites aromáticos y sales naturales para renovar la piel, eliminar células muertas y dejar una textura suave, luminosa y nutrida.",
      },
      {
        name: "Envoltura Desintoxicante de Espirulina",
        duration: "55 min",
        price: "55 EUR",
        description:
          "Tratamiento energizante con exfoliación suave y envoltura de algas marinas, ideal para complementar un reseteo corporal.",
      },
      {
        name: "Envoltura Hidratante de Arcilla Rosa",
        duration: "55 min",
        price: "55 EUR",
        description:
          "Ritual corporal ultrahidratante para pieles secas o cansadas. Incluye exfoliación, masaje craneal y aplicación de arcilla rosa rica en nutrientes.",
      },
    ],
  },
  masajes: {
    title: "Masajes manuales",
    intro: "Trabajo manual para liberar tensión, favorecer descanso y cuidar el cuerpo desde distintas técnicas.",
    treatments: [
      {
        name: "Masaje de Tejido Profundo",
        duration: "60 min",
        price: "55 EUR",
        description:
          "Trabajo manual enfocado en capas profundas del tejido muscular para liberar tensión acumulada, descontracturar y revitalizar el cuerpo.",
      },
      {
        name: "Masaje Antiestrés Recuperador",
        duration: "45 min",
        price: "45 EUR",
        description:
          "Sesión diseñada para aliviar tensiones con eficacia y favorecer el descanso tras jornadas intensas, carga mental o cansancio acumulado.",
      },
      {
        name: "Masaje Holístico y Aromaterapia",
        duration: "60 min",
        price: "50 EUR",
        description:
          "Masaje corporal relajante combinado con aceites esenciales puros para reducir el estrés y favorecer una sensación profunda de equilibrio.",
      },
      {
        name: "Masaje Escultural con Maderoterapia",
        duration: "60 min",
        price: "60 EUR",
        description:
          "Técnica natural y no invasiva con instrumentos de madera para tonificar, activar la circulación y trabajar la retención de líquidos dentro de una experiencia relajante.",
      },
      {
        name: "Reflexología Podal Holística",
        duration: "45 min",
        price: "40 EUR",
        description:
          "Técnica manual sobre puntos reflejos de los pies orientada a favorecer descanso, equilibrio y bienestar general.",
      },
    ],
  },
  rituales: {
    title: "Rituales especiales del mundo",
    intro: "Experiencias envolventes inspiradas en ingredientes, calor terapéutico y cuidado sensorial.",
    treatments: [
      {
        name: "Éxtasis de Cacao",
        duration: "1 h 25 min",
        price: "80 EUR",
        description:
          "Ritual envolvente para la piel que incluye exfoliación corporal, envoltura nutritiva de cacao puro y un masaje relajante final.",
      },
      {
        name: "Cura de Vinoterapia",
        duration: "1 h 25 min",
        price: "80 EUR",
        description:
          "Experiencia antioxidante con exfoliación revitalizante, envoltura nutritiva de uva y masaje calmante con aceites ricos en vitaminas.",
      },
      {
        name: "Masaje con Piedras Calientes",
        duration: "1 h 15 min",
        price: "75 EUR",
        description:
          "El calor terapéutico de las piedras se combina con maniobras manuales para aliviar la tensión muscular, estimular la circulación y aportar confort profundo.",
      },
    ],
  },
  autor: {
    title: "Rituales de autor Miriam Herrero",
    intro: "Experiencias profundas que combinan técnica manual, estética y acompañamiento corporal personalizado.",
    treatments: [
      {
        name: "Para cómo te sientes",
        duration: "1 h 40 min",
        price: "90 EUR",
        description:
          "Ritual profundamente relajante para liberar tensiones acumuladas, calmar el sistema nervioso y devolver al cuerpo una sensación de equilibrio. Incluye liberación del pericardio, terapia craneosacral, quiromasaje relajante profundo, peeling facial suave y masaje facial y cervical. Personalización disponible: masaje drenante o masaje sensitivo envolvente.",
      },
      {
        name: "Para cómo te ves",
        duration: "1 h 40 min",
        price: "95 EUR",
        description:
          "Tratamiento integral que combina estética avanzada manual y bienestar interno. Incluye higiene facial profunda con vapor, peeling, sérum, mascarilla personalizada, tratamiento específico según la piel, contorno de ojos, masaje facial reafirmante y terapia craneosacral. Opcional: maderoterapia, drenaje linfático manual o masaje circulatorio.",
      },
      {
        name: "Para cómo te transformas",
        duration: "1 h 40 min",
        price: "100 EUR",
        description:
          "Acompañamiento terapéutico profundo orientado a desbloquear emociones, comprender procesos internos y propiciar cambios desde el cuerpo. Incluye liberación del pericardio, terapia craneosacral, reflexología y quiromasaje terapéutico. Enfoque a elegir: acompañamiento emocional, técnica metamórfica, masaje con piedras o bambú, o drenaje linfático.",
      },
    ],
  },
};

const bookingLine =
  "Para confirmar disponibilidad y reservar, lo mejor es escribir por WhatsApp al +34 646 410 037.";

const demoReplies = [
  `Gracias por contarlo. Puedo ayudarte a ordenar la necesidad y elegir entre facial, masaje, ritual corporal o ritual de autor. ${bookingLine}`,
  `Lo miro contigo desde una primera orientación, sin sustituir una sesión profesional. Si buscas calma, cuerpo o transformación, puedo proponerte una opción y derivarte a reserva. ${bookingLine}`,
  `Podemos partir de lo que necesitas ahora: descanso, tensión muscular, piel, detox o acompañamiento emocional. ${bookingLine}`,
];

const initialMessages = [
  {
    author: "bot",
    label: "Asistente Miriam",
    text:
      "Hola, soy el asistente digital de Miriam Herrero Sánchez. Puedo orientarte entre sus servicios, terapias, rituales y talleres, y ayudarte a dar el siguiente paso para reservar.",
  },
];

function addMessage({ author, label, text }) {
  const message = document.createElement("article");
  message.className = `message ${author}`;
  message.innerHTML = `<strong>${label}</strong><span>${escapeHtml(text)}</span>`;
  messagesEl.appendChild(message);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getDemoReply(message) {
  const normalized = message.toLowerCase();

  if (normalized.includes("taller") || normalized.includes("retiro") || normalized.includes("formacion") || normalized.includes("formación")) {
    return `Miriam también organiza talleres y retiros grupales según disponibilidad. Puedo ayudarte a preparar la consulta para pedir fechas, ubicación y condiciones. ${bookingLine}`;
  }

  if (normalized.includes("piel") || normalized.includes("facial") || normalized.includes("cara")) {
    return `Para necesidades de piel, la carta incluye A Medida, Mar Profundo Purificante y Anti-Edad Milagro Facial. La elección depende de si buscas hidratación, limpieza profunda o firmeza. ${bookingLine}`;
  }

  if (normalized.includes("estrés") || normalized.includes("estres") || normalized.includes("cansancio") || normalized.includes("descanso")) {
    return `Para estrés, cansancio o necesidad de descanso, pueden encajar el Masaje Antiestrés Recuperador, el Masaje Holístico con Aromaterapia o el ritual de autor Para cómo te sientes. ${bookingLine}`;
  }

  if (normalized.includes("tension") || normalized.includes("tensión") || normalized.includes("contractura") || normalized.includes("muscular")) {
    return `Para tensión muscular, la carta contempla Masaje de Tejido Profundo, Piedras Calientes o un ritual de autor personalizado. Conviene confirmar con Miriam qué intensidad y formato encaja mejor. ${bookingLine}`;
  }

  if (normalized.includes("transform")) {
    return `Para procesos de cambio o desbloqueo emocional, el ritual de autor Para cómo te transformas es la opción más orientada a acompañamiento profundo desde el cuerpo. ${bookingLine}`;
  }

  if (normalized.includes("terapia") || normalized.includes("tratamiento") || normalized.includes("servicio")) {
    return `Puedo orientarte por familias: faciales, cuidado corporal, masajes manuales, rituales especiales o rituales de autor. Si me dices qué buscas, afino la recomendación. ${bookingLine}`;
  }

  return demoReplies[Math.floor(Math.random() * demoReplies.length)];
}

function handleSubmit(event) {
  event.preventDefault();
  const text = inputEl.value.trim();

  if (!text) {
    return;
  }

  addMessage({ author: "user", label: "Tú", text });
  inputEl.value = "";
  inputEl.style.height = "auto";

  window.setTimeout(() => {
    addMessage({
      author: "bot",
      label: "Asistente Miriam",
      text: getDemoReply(text),
    });
  }, 520);
}

function usePrompt(event) {
  inputEl.value = event.currentTarget.dataset.prompt;
  inputEl.focus();
  inputEl.style.height = `${inputEl.scrollHeight}px`;
}

function resizeInput() {
  inputEl.style.height = "auto";
  inputEl.style.height = `${inputEl.scrollHeight}px`;
}

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

  return { availability, appointments: [] };
}

function loadCalendarState() {
  try {
    const saved = localStorage.getItem(CALENDAR_STORAGE_KEY);
    return saved ? JSON.parse(saved) : createInitialCalendarState();
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

function getAvailableSlots(dateKey) {
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

    button.innerHTML = `
      <strong>${day}</strong>
      <small>${availableCount ? `${availableCount} huecos` : appointmentsCount ? `${appointmentsCount} cita(s)` : "Sin huecos"}</small>
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
  selectedDateTitleEl.textContent = dateTitleFormatter.format(selectedDate);
  selectedDateCopyEl.textContent = slots.length
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

initialMessages.forEach(addMessage);
formEl.addEventListener("submit", handleSubmit);
inputEl.addEventListener("input", resizeInput);
promptButtons.forEach((button) => button.addEventListener("click", usePrompt));
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
populateServiceSelects();
renderCalendar();
renderSelectedDay();
