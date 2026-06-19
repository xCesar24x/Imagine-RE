"use client";

import { useState } from "react";
import { Calendar, User, Mail, Phone, Compass, Send, Check } from "lucide-react";
import { TRANSLATIONS } from "@/constants/translations";

interface ToursCalendarProps {
  lang?: "en" | "es";
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

export default function ToursCalendar({ lang = "en" }: ToursCalendarProps) {
  const t = TRANSLATIONS[lang].discoveryTours;

  const [tours, setTours] = useState<Tour[]>(INITIAL_TOURS);
  const [selectedTourId, setSelectedTourId] = useState<string>(INITIAL_TOURS[0].id);

  // Booking Form State
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const activeTour = tours.find(tour => tour.id === selectedTourId) || tours[0];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) {
      setBookingError(lang === "es" ? "Por favor complete todos los datos." : "Please fill out all fields.");
      return;
    }

    if (activeTour.seatsRemaining <= 0) {
      setBookingError(lang === "es" ? "Lo sentimos, este tour está lleno." : "Sorry, this tour is fully booked.");
      return;
    }

    setBookingError("");
    setBookingSuccess(true);

    // Deduct seat locally
    setTours(prev =>
      prev.map(tour =>
        tour.id === activeTour.id 
          ? { ...tour, seatsRemaining: tour.seatsRemaining - 1 }
          : tour
      )
    );

    setTimeout(() => {
      setBookingSuccess(false);
      setClientName("");
      setClientEmail("");
      setClientPhone("");
    }, 4500);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] max-w-5xl mx-auto items-start">
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

      {/* Seat Booking Form */}
      <div className="rounded-[2.5rem] border border-white/10 bg-[#041c16]/90 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl h-full flex flex-col justify-between">
        <div>
          <h4 className="font-serif text-xl text-pearl mb-2 flex items-center gap-2">
            <User size={18} className="text-sunset" />
            {t.reserveSeat}
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed mb-6 font-light">
            {lang === "es"
              ? "Regístrese para acompañar al equipo concierge en nuestro Discovery Tour. Se requiere confirmación telefónica previa."
              : "Register to accompany our concierge team on the Discovery Tour. Prior telephone confirmation is required."}
          </p>

          <form onSubmit={handleBooking} className="space-y-4">
            <div className="p-4 rounded-xl bg-[#01140f] border border-white/5 mb-4">
              <span className="text-[9px] uppercase tracking-widest text-gray-400 block">{t.tourSelected}</span>
              <span className="text-xs md:text-sm text-pearl font-serif font-medium mt-1 block">
                {lang === "es" ? activeTour.nameES : activeTour.nameEN} ({activeTour.date})
              </span>
            </div>

            <div>
              <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">{lang === "es" ? "Su Nombre" : "Your Name"}</label>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. David Miller"
                className="w-full rounded-2xl border border-white/10 bg-[#01140f] px-4 py-3 text-xs text-pearl outline-none focus:border-sunset"
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="david@gmail.com"
                className="w-full rounded-2xl border border-white/10 bg-[#01140f] px-4 py-3 text-xs text-pearl outline-none focus:border-sunset"
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">{lang === "es" ? "WhatsApp / Teléfono" : "WhatsApp / Phone"}</label>
              <input
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full rounded-2xl border border-white/10 bg-[#01140f] px-4 py-3 text-xs text-pearl outline-none focus:border-sunset"
              />
            </div>

            <div className="pt-2">
              {bookingError && <div className="text-xs text-rose-300 font-sans mb-3">{bookingError}</div>}
              {bookingSuccess && (
                <div className="text-xs text-emerald-300 font-sans mb-3 flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  {t.bookingSuccess}
                </div>
              )}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-sunset px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-jungle shadow-md hover:bg-white transition-colors duration-250 cursor-pointer"
              >
                <Send size={13} /> {t.bookNow}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
