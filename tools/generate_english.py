import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path
from lxml import html

ROOT = Path(__file__).resolve().parents[1]

OFFICIAL_NAMES = {
    "Facial Personalizado": "Personalized Facial",
    "Mar Profundo Purificante": "Deep Sea Purifying Facial",
    "Lifting Facial Manual": "Manual Facial Lifting",
    "Facial Reafirmante Premium": "Premium Firming Facial",
    "Masaje Estético": "Aesthetic Massage",
    "Masaje Antiestrés Recuperador": "Anti-Stress Recovery Massage",
    "Drenaje Linfático": "Lymphatic Drainage",
    "Reflexología Podal Holística": "Holistic Foot Reflexology",
    "Masaje Holístico con Aromaterapia": "Holistic Massage with Aromatherapy",
    "Masaje de Tejido Profundo": "Deep Tissue Massage",
    "Quiromasaje": "Chiromassage",
    "Masaje Escultural con Maderoterapia": "Sculpting Massage with Wood Therapy",
    "Osteopatía Bioenergética Celular": "Cellular Bioenergetic Osteopathy",
    "Exfoliación Revitalizante con Sales y Aceites": "Revitalizing Exfoliation with Salts and Oils",
    "Envoltura Desintoxicante de Espirulina": "Detoxifying Spirulina Wrap",
    "Envoltura Hidratante de Arcilla Rosa": "Hydrating Pink Clay Wrap",
    "Tratamiento Corporal Personalizado": "Personalized Body Treatment",
    "Lifting de Pestañas": "Eyelash Lift",
    "Masaje con Piedras Calientes": "Hot Stone Massage",
    "Éxtasis de Cacao": "Cacao Ecstasy",
    "Cura de Vinoterapia": "Vinotherapy Cure",
    "Para Cómo Te Sientes": "For How You Feel",
    "Para Cómo Te Ves": "For How You Look",
    "Para Cómo Te Transformas": "For How You Transform",
}

CACHE = {}

def translate(text):
    clean = text.strip()
    if not clean or not re.search(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ¿¡]", clean):
        return text
    if clean in {"ES", "EN"}:
        return text
    if clean in OFFICIAL_NAMES:
        translated = OFFICIAL_NAMES[clean]
    elif clean in CACHE:
        translated = CACHE[clean]
    else:
        query = urllib.parse.urlencode({
            "client": "gtx", "sl": "es", "tl": "en", "dt": "t", "q": clean
        })
        with urllib.request.urlopen("https://translate.googleapis.com/translate_a/single?" + query, timeout=30) as response:
            payload = json.loads(response.read().decode("utf-8"))
        translated = "".join(piece[0] for piece in payload[0])
        CACHE[clean] = translated
        time.sleep(0.03)
    return text.replace(clean, translated)

def official_replacements(text):
    for spanish, english in sorted(OFFICIAL_NAMES.items(), key=lambda item: -len(item[0])):
        text = text.replace(spanish, english)
    return text

def generate_index():
    source = (ROOT / "index.html").read_text(encoding="utf-8")
    doc = html.document_fromstring(source)
    doc.set("lang", "en")
    for element in doc.iter():
        if element.tag not in {"script", "style"}:
            if element.text and element.text.strip():
                element.text = translate(element.text)
            if element.tail and element.tail.strip():
                element.tail = translate(element.tail)
        for attr in ("aria-label", "placeholder", "content"):
            if element.get(attr):
                element.set(attr, translate(element.get(attr)))
    output = "<!doctype html>\n" + html.tostring(doc, encoding="unicode", method="html")
    output = output.replace("./ritual-finder.html", "./ritual-finder-en.html")
    output = re.sub(
        r'<div class="language-switcher".*?</div>',
        '<div class="language-switcher" aria-label="Select language"><a href="./index.html" lang="es">ES</a><span aria-hidden="true">|</span><a class="active" href="./index-en.html" lang="en" aria-current="page">EN</a></div>',
        output,
        count=1,
        flags=re.S,
    )
    output = output.replace('<script src="./script.js"></script>', '<script src="./script-en.js"></script>')
    output = output.replace("<span>Sea</span>", "<span>Tue</span>")
    (ROOT / "index-en.html").write_text(official_replacements(output), encoding="utf-8")

def generate_script():
    source = (ROOT / "script.js").read_text(encoding="utf-8")
    start = source.index("const serviceCatalog = {")
    end = source.index("\n};", start) + 3
    catalog = source[start:end]
    catalog = re.sub(r'"([^"\\]*(?:\\.[^"\\]*)*)"', lambda match: '"' + translate(match.group(1)) + '"', catalog)
    output = source[:start] + catalog + source[end:]
    replacements = {
        '"es-ES"': '"en-GB"',
        '"Mañana"': '"Morning"',
        '"Tarde"': '"Afternoon"',
        "Listado de servicios": "Service list",
        "Agendar cita": "Book appointment",
        "Sin huecos": "No slots",
        "Elige una hora disponible y completa tus datos para solicitar la reserva.": "Choose an available time and complete your details to request the booking.",
        "No hay huecos disponibles para este día. Puedes revisar otras fechas o contactar por WhatsApp.": "There are no available slots for this day. You can check other dates or contact us via WhatsApp.",
        "huecos": "slots",
        "cita(s)": "appointment(s)",
        "Sin horarios disponibles.": "No times available.",
        "Citas del día": "Appointments for the day",
        " a las ": " at ",
        "Reserva registrada. Miriam confirmará la cita contigo.": "Booking registered. Miriam will confirm the appointment with you.",
        "PIN incorrecto.": "Incorrect PIN.",
        "Ese horario ya tiene una cita.": "That time already has an appointment.",
        "Cita concertada por teléfono": "Appointment arranged by phone",
        "Todavía no hay citas agendadas.": "There are no scheduled appointments yet.",
        ">Eliminar<": ">Delete<",
        " · cita": " · appointment",
    }
    for spanish, english in replacements.items():
        output = output.replace(spanish, english)
    (ROOT / "script-en.js").write_text(official_replacements(output), encoding="utf-8")

def translate_option(option):
    option["text"] = translate(option["text"])
    option["sub"] = translate(option["sub"])

def generate_ritual():
    source = (ROOT / "ritual-finder.html").read_text(encoding="utf-8")
    match = re.search(r"const DATA = (.*?);\nlet current", source, re.S)
    data = json.loads(match.group(1))
    data["entry"]["title"] = translate(data["entry"]["title"])
    data["entry"]["context"] = translate(data["entry"]["context"])
    for option in data["entry"]["options"]:
        translate_option(option)
    for route in data["routes"].values():
        route["label"] = translate(route["label"])
        for question in route["questions"]:
            question["title"] = translate(question["title"])
            question["context"] = translate(question["context"])
            for option in question["options"]:
                translate_option(option)
    for treatment in data["treatments"]:
        treatment["name"] = OFFICIAL_NAMES[treatment["name"]]
        treatment["reason"] = translate(treatment["reason"])
        treatment["expect"] = [translate(item) for item in treatment["expect"]]
        treatment["alternatives"] = [OFFICIAL_NAMES[item] for item in treatment["alternatives"]]
    output = source[:match.start(1)] + json.dumps(data, ensure_ascii=False) + source[match.end(1):]
    fixed = {
        "Navegación del Ritual Finder": "Ritual Finder navigation",
        "Seleccionar idioma": "Select language",
        "← Volver a servicios": "← Back to services",
        "Encuentra tu experiencia ideal": "Find your ideal experience",
        "Cinco preguntas para descubrir qué tratamiento acompaña mejor tu cuerpo, tu piel y tu momento actual.": "Five questions to discover which treatment best supports your body, your skin and your current moment.",
        "Al terminar recibirás una recomendación personalizada": "When you finish, you will receive a personalized recommendation",
        ", con el tratamiento más adecuado, lo que puedes esperar de la sesión y dos alternativas por si deseas comparar.": ", including the most suitable treatment, what you can expect from the session and two alternatives to compare.",
        "Inicio": "Start",
        "Pregunta 0 de 5": "Question 0 of 5",
        "Permítete elegir desde lo que necesitas hoy": "Choose based on what you need today",
        "No tienes que saber el nombre del tratamiento. Responde desde la sensación que buscas y el test hará la selección por ti.": "You do not need to know the treatment name. Answer based on the feeling you are looking for and the test will make the selection for you.",
        "Comenzar": "Begin",
        "Pregunta ": "Question ",
        " de 5": " of 5",
        "Atrás": "Back",
        "Reiniciar": "Restart",
        "Resultado": "Result",
        "Recomendación personalizada": "Personalized recommendation",
        "Tu experiencia recomendada": "Your recommended experience",
        "Duración:": "Duration:",
        "Precio:": "Price:",
        "Qué puedes esperar": "What you can expect",
        "También podrían acompañarte": "You may also enjoy",
        "Siguiente paso:": "Next step:",
        "esta recomendación es orientativa. La experiencia puede ajustarse antes de la reserva según tus necesidades, disponibilidad y ubicación.": "This recommendation is for guidance. The experience can be adapted before booking according to your needs, availability and location.",
        "Agendar este tratamiento": "Book this treatment",
        "Repetir test": "Repeat test",
        "./index.html": "./index-en.html",
    }
    for spanish, english in fixed.items():
        output = output.replace(spanish, english)
    output = official_replacements(output)
    output = output.replace('<html lang="es">', '<html lang="en">')
    output = output.replace('<a class="active" href="./ritual-finder.html" lang="es" aria-current="page">ES</a>', '<a href="./ritual-finder.html" lang="es">ES</a>')
    output = output.replace('<a href="./ritual-finder-en.html" lang="en">EN</a>', '<a class="active" href="./ritual-finder-en.html" lang="en" aria-current="page">EN</a>')
    (ROOT / "ritual-finder-en.html").write_text(output, encoding="utf-8")

generate_index()
generate_script()
generate_ritual()
