"use client";

import { useState } from "react";
import { Calendar, User, Mail, Phone, Compass, Send, Check, Shield, Landmark, Sparkles, Car } from "lucide-react";
import { TRANSLATIONS } from "@/constants/translations";
import { Property } from "@/constants/properties";

interface ToursCalendarProps {
  lang?: "en" | "es";
  wishlistProperties?: Property[];
}

export default function ToursCalendar({ lang = "en", wishlistProperties = [] }: ToursCalendarProps) {
  const t = TRANSLATIONS[lang].discoveryTours;

  // Booking Form State
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [passengerCount, setPassengerCount] = useState(2);
  const [wantsLodging, setWantsLodging] = useState(false);
  const [lodgingPreference, setLodgingPreference] = useState("luxury");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone || !arrivalDate || !departureDate) {
      setBookingError(lang === "es" ? "Por favor complete todos los campos requeridos." : "Please fill out all required fields.");
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
        financing: "Cash",
        horizon: "Immediate",
        motivation: "Vacation",
        wishlistPropertyIds: wishlistProperties.map(p => p.id),
        tourDates: tourDatesStr,
        tourPeople: passengerCount,
        tourLodging: wantsLodging,
        tourLodgingPref: wantsLodging ? lodgingPreference : undefined,
        status: "Discovery Tour Programado",
        notes: [`Requested Private Property Tour.`],
        lastInteractionDate: new Date().toISOString()
      };
      currentLeads.push(newLead);
    }

    localStorage.setItem("imagine_leads", JSON.stringify(currentLeads));

    setTimeout(() => {
      setBookingSuccess(false);
      setClientName("");
      setClientEmail("");
      setClientPhone("");
      setArrivalDate("");
      setDepartureDate("");
      setPassengerCount(2);
      setWantsLodging(false);
      setLodgingPreference("luxury");
    }, 5000);
  };

  const experienceItems = lang === "es" ? [
    {
      title: "Transporte Privado en Buseta",
      description: "Recogida privada y cómoda en el aeropuerto (SJO/LIR) y traslado directo a las propiedades de su interés a bordo de nuestra buseta dedicada.",
      icon: Car
    },
    {
      title: "Visitas Privadas Exclusivas",
      description: "Acceso y recorridos privados uno a uno a las propiedades seleccionadas en su lista de favoritos, a su propio ritmo y con total discreción.",
      icon: Sparkles
    },
    {
      title: "Asesoría Legal e Impositiva",
      description: "Coordinación de reuniones privadas con abogados locales de confianza para aclarar dudas sobre fideicomisos, residencia y derecho de propiedad en Costa Rica.",
      icon: Landmark
    },
    {
      title: "Inmersión de Estilo de Vida",
      description: "Almuerzo o cena gourmet en restaurantes selectos de la zona, visita a colegios bilingües y exploración guiada de las playas y comunidades aledañas.",
      icon: Compass
    }
  ] : [
    {
      title: "Private Shuttle Transport",
      description: "Comfortable, private airport pickup (SJO/LIR) and direct transfers to your selected properties in our dedicated shuttle van.",
      icon: Car
    },
    {
      title: "Private One-on-One Viewings",
      description: "Private, dedicated walkthroughs of your shortlisted properties, conducted at your own pace with total privacy and undivided attention.",
      icon: Sparkles
    },
    {
      title: "Legal & Residency Consultation",
      description: "Private consultations with trusted local attorneys to clarify real estate laws, escrow processes, tax structures, and residency options.",
      icon: Landmark
    },
    {
      title: "Lifestyle & Dining Immersion",
      description: "Gourmet dining at curated regional restaurants, tours of top bilingual schools, and guided neighborhood orientation checks.",
      icon: Compass
    }
  ];

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
            <p className="text-xs text-gray-400 mt-1">
              {lang === "es" ? "Expediciones privadas e itinerarios de lujo personalizados" : "Private expeditions and bespoke luxury itineraries"}
            </p>
          </div>
        </div>

        {/* Experience Cards */}
        <div className="space-y-4">
          {experienceItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-5 rounded-2xl border border-white/5 bg-[#01140f]/80 flex gap-4 items-start">
                <div className="p-2.5 bg-sunset/15 rounded-xl text-sunset flex-shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="font-serif text-sm md:text-base text-pearl font-medium">{item.title}</h4>
                  <p className="text-xs text-gray-300/80 leading-relaxed font-light mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Form */}
      <div className="rounded-[2.5rem] border border-white/10 bg-[#041c16]/90 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl h-full flex flex-col justify-between">
        <div>
          <h4 className="font-serif text-xl text-pearl mb-2 flex items-center gap-2">
            <User size={18} className="text-sunset" />
            {t.reserveSeat}
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed mb-6 font-light">
            {lang === "es"
              ? "Planifique su recorrido privado por las propiedades de su interés. Diseñaremos un itinerario exclusivo adaptado a su agenda."
              : "Plan your private property tour. We will design a custom itinerary fully aligned with your schedule."}
          </p>

          <form onSubmit={handleBooking} className="space-y-4">
            {bookingSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-pearl space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-xl">
                  <Check size={20} />
                </div>
                <h5 className="font-serif text-lg text-center text-emerald-400">
                  {lang === "es" ? "Solicitud de Tour Recibida" : "Tour Request Received"}
                </h5>
                <p className="text-xs leading-relaxed text-gray-300 text-center font-light">
                  {lang === "es"
                    ? "¡Petición recibida con éxito! Nuestro equipo preparará una propuesta de itinerario privado con opciones de transporte y logística personalizada y se comunicará con usted en menos de 24 horas."
                    : "Request received successfully! Our team will prepare a private itinerary proposal with custom transport and logistics details and reach out within 24 hours."}
                </p>
                <div className="pt-2 text-center text-[10px] text-gray-400 uppercase tracking-wider">
                  Imagine Concierge Priority Tech
                </div>
              </div>
            ) : (
              <>
                {/* Variable destinations from Wishlist */}
                <div className="p-4 rounded-xl bg-[#01140f] border border-white/5">
                  <span className="text-[9px] uppercase tracking-widest text-sunset font-semibold block">
                    {t.tourSelected}
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
                        ? "Agregue propiedades a favoritos en el catálogo para incluirlas automáticamente en su itinerario."
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
                      {lang === "es" ? "Cantidad de Personas" : "Number of People"}
                    </label>
                    <select
                      value={passengerCount}
                      onChange={(e) => setPassengerCount(Number(e.target.value))}
                      className="w-full rounded-2xl border border-white/10 bg-[#01140f] px-4 py-3 text-xs text-pearl outline-none focus:border-sunset"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
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
                      <option value="eco">{lang === "es" ? "Estándar / Eco-Lodge" : "Standard / Eco-Lodge"}</option>
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
                    <Send size={13} /> {t.bookNow}
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
