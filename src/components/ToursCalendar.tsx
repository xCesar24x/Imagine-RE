"use client";

import { useState } from "react";
import { Calendar, User, Mail, Phone, Compass, Send, Check, Shield, Landmark } from "lucide-react";
import { TRANSLATIONS } from "@/constants/translations";
import { Property } from "@/constants/properties";

interface ToursCalendarProps {
  lang?: "en" | "es";
  wishlistProperties?: Property[];
}

interface Tour {
  id: string;
  nameEN: string;
  nameES: string;
  date: string;
  region: string;
  seatsTotal: number;
  seatsRemaining: number;
  itineraryEN: string[];
  itineraryES: string[];
}

const INITIAL_TOURS: Tour[] = [
  {
    id: "tour-papagayo",
    nameEN: "Papagayo Gold Coast Discovery Tour",
    nameES: "Tour de Descubrimiento Costa de Papagayo",
    date: "July 12, 2026",
    region: "Guanacaste (Papagayo)",
    seatsTotal: 10,
    seatsRemaining: 4,
    itineraryEN: [
      "08:00 AM - Luxury Shuttle pickup at Liberia Airport",
      "10:00 AM - Private Tour of Villa Morpho & Guanacaste Gold Estate",
      "01:00 PM - Gourmet seaside lunch at Marina Papagayo Yacht Club",
      "03:00 PM - Legal Q&A Session (Residency, Escrow & Land laws)"
    ],
    itineraryES: [
      "08:00 AM - Recogida en Shuttle privado en el Aeropuerto de Liberia",
      "10:00 AM - Tour Privado de Villa Morpho y Guanacaste Gold Estate",
      "01:00 PM - Almuerzo gourmet frente al mar en Marina Papagayo",
      "03:00 PM - Sesión de preguntas y respuestas legales (Residencia y leyes de propiedad)"
    ]
  },
  {
    id: "tour-st",
    nameEN: "Santa Teresa Surf & Mountain Discovery Tour",
    nameES: "Tour de Altura y Surf en Santa Teresa",
    date: "July 24, 2026",
    region: "Santa Teresa & Nosara",
    seatsTotal: 10,
    seatsRemaining: 7,
    itineraryEN: [
      "09:00 AM - Helicopter/Shuttle arrival & pickup at Tambor",
      "10:30 AM - Walkthrough of The Obsidian Canopy & Nosara Flow Villa",
      "01:30 PM - Organic beachfront organic dining experience",
      "03:30 PM - Property Management yields & rental marketing analysis"
    ],
    itineraryES: [
      "09:00 AM - Llegada en helicóptero/shuttle y recogida en Tambor",
      "10:30 AM - Recorrido de The Obsidian Canopy y Nosara Flow Villa",
      "01:30 PM - Almuerzo orgánico frente a la playa en Santa Teresa",
      "03:30 PM - Análisis de rendimientos de Property Management y Airbnb"
    ]
  },
  {
    id: "tour-ma",
    nameEN: "Manuel Antonio Canopy & Cliffside Luxury Tour",
    nameES: "Tour Concierge Manuel Antonio y Acantilados",
    date: "August 08, 2026",
    region: "Manuel Antonio & Quepos",
    seatsTotal: 10,
    seatsRemaining: 2,
    itineraryEN: [
      "08:30 AM - Pickup at San José (SJO) corporate private hangar",
      "11:00 AM - Walkthrough of Quepos Zenith & The Reserve",
      "01:30 PM - Gourmet canopy forest dining",
      "04:00 PM - Relocation onboarding (Schooling, lifestyle, banking)"
    ],
    itineraryES: [
      "08:30 AM - Recogida en hangar privado corporativo en San José (SJO)",
      "11:00 AM - Recorrido de Quepos Zenith y The Reserve",
      "01:30 PM - Almuerzo gourmet en el bosque tropical",
      "04:00 PM - Introducción a la reubicación (Escuelas, estilo de vida, bancos)"
    ]
  }
];

export default function ToursCalendar({ lang = "en", wishlistProperties = [] }: ToursCalendarProps) {
  const t = TRANSLATIONS[lang].discoveryTours;

  const [tours, setTours] = useState<Tour[]>(INITIAL_TOURS);
  const [selectedTourId, setSelectedTourId] = useState<string>(INITIAL_TOURS[0].id);

  // Booking Form State
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [passengerCount, setPassengerCount] = useState(1);
  const [wantsLodging, setWantsLodging] = useState(false);
  const [lodgingPreference, setLodgingPreference] = useState("luxury");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const activeTour = tours.find(tour => tour.id === selectedTourId) || tours[0];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone || !arrivalDate || !departureDate) {
      setBookingError(lang === "es" ? "Por favor complete todos los campos requeridos." : "Please fill out all required fields.");
      return;
    }

    if (passengerCount < 1 || passengerCount > 9) {
      setBookingError(lang === "es" ? "El límite de pasajeros para la buseta Hyundai Starex es de 9 personas." : "The passenger limit for the Hyundai Starex shuttle is 9 people.");
      return;
    }

    if (activeTour.seatsRemaining <= 0) {
      setBookingError(lang === "es" ? "Lo sentimos, este tour ya no cuenta con espacios disponibles." : "Sorry, this tour is fully booked.");
      return;
    }

    setBookingError("");
    setBookingSuccess(true);

    // Save/Sync Lead info to localStorage 'imagine_leads'
    const storedLeads = localStorage.getItem("imagine_leads");
    let currentLeads = [];
    if (storedLeads) {
      try {
        currentLeads = JSON.parse(storedLeads);
      } catch (err) {
        console.error("Error reading leads from localStorage:", err);
      }
    }

    const leadEmail = clientEmail.trim().toLowerCase();
    const leadPhone = clientPhone.trim();
    const tourDatesStr = `${arrivalDate} to ${departureDate}`;

    // Try to match existing lead
    const matchIndex = currentLeads.findIndex(
      (l: any) => l.email.toLowerCase() === leadEmail || l.phone === leadPhone
    );

    if (matchIndex > -1) {
      // Update existing lead
      currentLeads[matchIndex] = {
        ...currentLeads[matchIndex],
        tourDates: tourDatesStr,
        tourPeople: passengerCount,
        tourLodging: wantsLodging,
        tourLodgingPref: wantsLodging ? lodgingPreference : undefined,
        status: "Discovery Tour Programado",
        lastInteractionDate: new Date().toISOString()
      };
    } else {
      // Create new lead
      const newLead = {
        id: `lead-${Date.now()}`,
        name: clientName.trim(),
        email: leadEmail,
        phone: leadPhone,
        budgetRange: "5M - 10M",
        financing: "Needs financing",
        horizon: "1-3 months",
        motivation: "Relocation",
        wishlistPropertyIds: wishlistProperties.map(p => p.id),
        tourDates: tourDatesStr,
        tourPeople: passengerCount,
        tourLodging: wantsLodging,
        tourLodgingPref: wantsLodging ? lodgingPreference : undefined,
        status: "Discovery Tour Programado",
        notes: [`Created via Discovery Tour customized cotizador.`],
        lastInteractionDate: new Date().toISOString()
      };
      currentLeads.push(newLead);
    }

    localStorage.setItem("imagine_leads", JSON.stringify(currentLeads));

    // Deduct seat locally
    setTours(prev =>
      prev.map(tour =>
        tour.id === activeTour.id 
          ? { ...tour, seatsRemaining: Math.max(0, tour.seatsRemaining - 1) }
          : tour
      )
    );

    setTimeout(() => {
      setBookingSuccess(false);
      setClientName("");
      setClientEmail("");
      setClientPhone("");
      setArrivalDate("");
      setDepartureDate("");
      setPassengerCount(1);
      setWantsLodging(false);
      setLodgingPreference("luxury");
    }, 9000);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] max-w-6xl mx-auto items-start">
      {/* Tour Selection and Itinerary */}
      <div className="rounded-[2.5rem] border border-white/10 bg-[#041c16]/90 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-sunset/10 rounded-2xl text-sunset">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="font-serif text-2xl text-pearl">{t.upcomingTours}</h3>
            <p className="text-xs text-gray-400 mt-1">{lang === "es" ? "Reserve su espacio en nuestra flota corporativa" : "Secure your space in our corporate fleet"}</p>
          </div>
        </div>

        {/* Tour selection rows */}
        <div className="space-y-3">
          {tours.map(tour => (
            <button
              key={tour.id}
              onClick={() => setSelectedTourId(tour.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer ${
                selectedTourId === tour.id
                  ? "bg-white/5 border-sunset shadow-[inset_0_0_15px_rgba(212,175,55,0.08)]"
                  : "bg-transparent border-white/10 hover:border-white/20"
              }`}
            >
              <div className="min-w-0">
                <div className="text-sunset text-[10px] uppercase tracking-widest font-semibold">{tour.date}</div>
                <h4 className="font-serif text-sm md:text-base text-pearl truncate mt-1">
                  {lang === "es" ? tour.nameES : tour.nameEN}
                </h4>
                <div className="text-[10px] text-gray-400 font-sans mt-0.5">{tour.region}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                  tour.seatsRemaining <= 2 
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                }`}>
                  {tour.seatsRemaining} {t.seatsLeft}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Tour Itinerary */}
        <div className="rounded-2xl border border-white/5 bg-[#01140f] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Compass size={16} className="text-sunset" />
            <h5 className="text-xs uppercase tracking-[0.25em] text-sunset font-semibold">{t.itinerary}</h5>
          </div>
          <ol className="space-y-4">
            {(lang === "es" ? activeTour.itineraryES : activeTour.itineraryEN).map((step, index) => (
              <li key={index} className="flex gap-3 text-xs md:text-sm text-gray-300 leading-relaxed font-light">
                <span className="text-sunset font-mono font-semibold select-none">0{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Seat Booking / Customized Shuttle Cotizador Form */}
      <div className="rounded-[2.5rem] border border-white/10 bg-[#041c16]/90 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl h-full flex flex-col justify-between">
        <div>
          <h4 className="font-serif text-xl text-pearl mb-2 flex items-center gap-2">
            <User size={18} className="text-sunset" />
            {lang === "es" ? "Cotizador de Discovery Tour a la Medida" : "Custom Discovery Tour Quote Planner"}
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed mb-6 font-light">
            {lang === "es"
              ? "Planifique su expedición privada en nuestro shuttle Hyundai Starex premium. Cotizamos itinerarios, paradas gastronómicas y hospedaje exclusivo."
              : "Plan your private expedition in our premium Hyundai Starex shuttle. We quote custom itineraries, dining stops, and exclusive lodging."}
          </p>

          <form onSubmit={handleBooking} className="space-y-4">
            {bookingSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-pearl space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-xl">
                  <Check size={20} />
                </div>
                <h5 className="font-serif text-lg text-center text-emerald-400">
                  {lang === "es" ? "Solicitud de Itinerario Recibida" : "Itinerary Request Received"}
                </h5>
                <p className="text-xs leading-relaxed text-gray-300 text-center font-light">
                  {lang === "es"
                    ? "¡Petición de cotización recibida con éxito! Nuestro equipo preparará un itinerario a la medida en formato PDF con cotización personalizada para su Discovery Tour y se lo enviará en las próximas 24 horas por correo electrónico y WhatsApp."
                    : "Quote request received successfully! Our team will prepare a custom PDF itinerary with a personalized quote for your Discovery Tour and send it within the next 24 hours via email and WhatsApp."}
                </p>
                <div className="pt-2 text-center text-[10px] text-gray-400 uppercase tracking-wider">
                  Imagine Concierge Priority Tech
                </div>
              </div>
            ) : (
              <>
                {/* Selected Tour Reference */}
                <div className="p-4 rounded-xl bg-[#01140f] border border-white/5 mb-4">
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 block">{t.tourSelected}</span>
                  <span className="text-xs md:text-sm text-pearl font-serif font-medium mt-1 block">
                    {lang === "es" ? activeTour.nameES : activeTour.nameEN} ({activeTour.date})
                  </span>
                </div>

                {/* Variable destinations from Wishlist */}
                <div className="p-4 rounded-xl bg-[#01140f] border border-white/5">
                  <span className="text-[9px] uppercase tracking-widest text-sunset font-semibold block">
                    {lang === "es" ? "Destinos de Interés (de su Lista de Favoritos)" : "Custom Destinations (from your Wishlist)"}
                  </span>
                  {wishlistProperties.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {wishlistProperties.map(p => (
                        <span key={p.id} className="text-[10px] bg-sunset/10 border border-sunset/30 text-sunset px-2.5 py-1 rounded-full font-medium">
                          {p.name} ({p.location})
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400 italic mt-1 font-light">
                      {lang === "es"
                        ? "Agregue propiedades a favoritos en el catálogo para agregarlas como paradas automáticas del tour."
                        : "Heart properties in the catalog to add them as custom tour stops automatically."}
                    </p>
                  )}
                </div>

                {/* Inputs: exact dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">{lang === "es" ? "Llegada" : "Arrival Date"}</label>
                    <input
                      type="date"
                      value={arrivalDate}
                      onChange={(e) => setArrivalDate(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-white/10 bg-[#01140f] px-4 py-3 text-xs text-pearl outline-none focus:border-sunset"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">{lang === "es" ? "Salida" : "Departure Date"}</label>
                    <input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-white/10 bg-[#01140f] px-4 py-3 text-xs text-pearl outline-none focus:border-sunset"
                    />
                  </div>
                </div>

                {/* Passengers count & lodging options */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">
                      {lang === "es" ? "Pasajeros (Starex)" : "Passengers (Starex)"}
                    </label>
                    <select
                      value={passengerCount}
                      onChange={(e) => setPassengerCount(Number(e.target.value))}
                      className="w-full rounded-2xl border border-white/10 bg-[#01140f] px-4 py-3 text-xs text-pearl outline-none focus:border-sunset"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? (lang === "es" ? "Persona" : "Person") : (lang === "es" ? "Personas" : "People")}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col justify-end pb-1">
                    <label className="flex items-center gap-2 text-xs text-pearl cursor-pointer py-2">
                      <input
                        type="checkbox"
                        checked={wantsLodging}
                        onChange={(e) => setWantsLodging(e.target.checked)}
                        className="accent-sunset h-4 w-4 rounded"
                      />
                      <span>{lang === "es" ? "Requiere Hospedaje" : "Needs Lodging"}</span>
                    </label>
                  </div>
                </div>

                {/* Lodging Preference dropdown (conditional) */}
                {wantsLodging && (
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">
                      {lang === "es" ? "Tipo de Hospedaje Preferido" : "Preferred Lodging Type"}
                    </label>
                    <select
                      value={lodgingPreference}
                      onChange={(e) => setLodgingPreference(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#01140f] px-4 py-3 text-xs text-pearl outline-none focus:border-sunset"
                    >
                      <option value="budget">{lang === "es" ? "Estándar / Eco-Lodge" : "Standard / Eco-Lodge"}</option>
                      <option value="boutique">{lang === "es" ? "Hotel Boutique" : "Boutique Hotel"}</option>
                      <option value="luxury">{lang === "es" ? "Villa Privada de Lujo" : "Luxury Private Villa"}</option>
                    </select>
                  </div>
                )}

                {/* Contact information */}
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">{lang === "es" ? "Su Nombre" : "Your Name"}</label>
                  <input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. David Miller"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-[#01140f] px-4 py-3 text-xs text-pearl outline-none focus:border-sunset"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="david@gmail.com"
                      required
                      className="w-full rounded-2xl border border-white/10 bg-[#01140f] px-4 py-3 text-xs text-pearl outline-none focus:border-sunset"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">{lang === "es" ? "WhatsApp / Teléfono" : "WhatsApp / Phone"}</label>
                    <input
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      required
                      className="w-full rounded-2xl border border-white/10 bg-[#01140f] px-4 py-3 text-xs text-pearl outline-none focus:border-sunset"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  {bookingError && <div className="text-xs text-rose-300 font-sans mb-3">{bookingError}</div>}
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-sunset px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-jungle shadow-md hover:bg-white transition-colors duration-250 cursor-pointer font-bold"
                  >
                    <Send size={13} /> {lang === "es" ? "Solicitar Cotización de Tour" : "Request Tour Quote"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
