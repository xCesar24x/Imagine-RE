"use client";

import { useState } from "react";
import { Send, Building, Calendar, Wrench, Sparkles, Droplet, Coffee, FileText, ShieldCheck } from "lucide-react";
import { TRANSLATIONS } from "@/constants/translations";

interface AirbnbCalculatorProps {
  lang?: "en" | "es";
}

const SERVICES_DATA = {
  en: [
    {
      title: "Booking & Guest Relations",
      description: "Listing setup & optimization on platforms like Airbnb/VRBO, dynamic pricing settings, 24/7 guest communications, check-in coordination, and booking management.",
      icon: Calendar
    },
    {
      title: "Full Property Maintenance",
      description: "Preventive upkeep checkups, rapid response to plumbing, electric, AC, and structural issues. We work with certified, trustworthy local technicians.",
      icon: Wrench
    },
    {
      title: "Luxury Housekeeping & Linens",
      description: "Five-star hotel quality cleaning between guest stays, professional deep cleaning, high-quality laundry operations, and replenishing signature bath amenities.",
      icon: Sparkles
    },
    {
      title: "Pool & Landscaping Care",
      description: "Regular garden mowing, professional landscape design, leaf clearing, pool skimming, water testing, and chemical balance preservation.",
      icon: Droplet
    },
    {
      title: "Exclusive VIP Concierge",
      description: "On-site guest concierge services, private airport pick-up scheduling, booking of local tours/shuttles, private chef coordination, and tailored regional recommendations.",
      icon: Coffee
    },
    {
      title: "Utility, Bills & Compliance",
      description: "Direct handling of water, electric, fiber optic internet, and municipality payments, plus local tax declarations and insurance management.",
      icon: FileText
    }
  ],
  es: [
    {
      title: "Reservas y Atención al Huésped",
      description: "Configuración y optimización de anuncios en plataformas como Airbnb/VRBO, tarifas dinámicas inteligentes, atención al cliente 24/7, registro de entrada/salida y control de reservas.",
      icon: Calendar
    },
    {
      title: "Mantenimiento Técnico Integral",
      description: "Inspecciones preventivas periódicas y atención rápida de fontanería, electricidad, aire acondicionado y detalles estructurales con personal técnico certificado y de confianza.",
      icon: Wrench
    },
    {
      title: "Limpieza VIP y Lavandería",
      description: "Limpieza profunda con estándares de hotel de 5 estrellas entre reservas, lavado profesional de blancos (sábanas y toallas) y reabastecimiento de amenidades de lujo.",
      icon: Sparkles
    },
    {
      title: "Cuidado de Áreas Verdes y Piscina",
      description: "Mantenimiento periódico de jardines, poda, diseño paisajístico, limpieza diaria de piscina, control de químicos y equilibrio del agua.",
      icon: Droplet
    },
    {
      title: "Servicios de Concierge Exclusivo",
      description: "Atención personalizada al huésped, gestión de transporte privado, chef privado en sitio, reserva de tours recomendados y experiencias locales de primer nivel.",
      icon: Coffee
    },
    {
      title: "Administración Legal y de Servicios",
      description: "Pago puntual de servicios (agua, luz, internet de fibra óptica), impuestos municipales, patentes de alquiler vacacional y coordinación de pólizas de seguro.",
      icon: FileText
    }
  ]
};

export default function AirbnbCalculator({ lang = "en" }: AirbnbCalculatorProps) {
  const t = TRANSLATIONS[lang].propertyManagement;

  // Owner details form
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [propertyLoc, setPropertyLoc] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const services = SERVICES_DATA[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !ownerEmail || !ownerPhone || !propertyLoc) {
      setFormError(lang === "es" ? "Por favor complete todos los campos." : "Please fill out all fields.");
      return;
    }
    setFormError("");
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setOwnerName("");
      setOwnerEmail("");
      setOwnerPhone("");
      setPropertyLoc("");
    }, 4000);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] max-w-6xl mx-auto items-start">
      {/* Services Showcase grid */}
      <div className="rounded-[2.5rem] border border-white/10 bg-[#041c16]/90 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl">
        <div className="flex items-center gap-3.5 mb-8">
          <div className="p-3 bg-sunset/10 rounded-2xl text-sunset">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="font-serif text-2xl text-pearl">{t.calculatorTitle}</h3>
            <p className="text-xs text-gray-400 mt-1">{t.calculatorSubtitle}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {services.map((srv, idx) => {
            const IconComponent = srv.icon;
            return (
              <div 
                key={idx} 
                className="rounded-2xl border border-white/5 bg-[#01140f]/80 p-5 hover:border-sunset/30 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-sunset/15 rounded-xl text-sunset">
                    <IconComponent size={18} />
                  </div>
                  <h4 className="font-serif text-sm md:text-base text-pearl font-medium">{srv.title}</h4>
                </div>
                <p className="text-xs text-gray-300/80 leading-relaxed font-light">
                  {srv.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Owner Lead Capture form */}
      <div className="rounded-[2.5rem] border border-white/10 bg-[#041c16]/90 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl h-full flex flex-col justify-between">
        <div>
          <h4 className="font-serif text-xl text-pearl mb-2 flex items-center gap-2">
            <Building size={18} className="text-sunset" />
            {t.contactUsPM}
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed mb-6 font-light">
            {lang === "es"
              ? "Envíenos los detalles de su propiedad. Coordinaremos una llamada de asesoría personalizada sin ningún compromiso."
              : "Send us the general parameters of your property. We will coordinate a personalized consultation call with no obligation."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">{t.ownerName}</label>
              <input
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full rounded-2xl border border-white/10 bg-[#01140f] px-4 py-3 text-xs text-pearl outline-none focus:border-sunset"
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                placeholder="johndoe@gmail.com"
                className="w-full rounded-2xl border border-white/10 bg-[#01140f] px-4 py-3 text-xs text-pearl outline-none focus:border-sunset"
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">WhatsApp / Phone</label>
              <input
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full rounded-2xl border border-white/10 bg-[#01140f] px-4 py-3 text-xs text-pearl outline-none focus:border-sunset"
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1.5">{t.propertyLoc}</label>
              <input
                value={propertyLoc}
                onChange={(e) => setPropertyLoc(e.target.value)}
                placeholder="e.g. San Ramón, Alajuela"
                className="w-full rounded-2xl border border-white/10 bg-[#01140f] px-4 py-3 text-xs text-pearl outline-none focus:border-sunset"
              />
            </div>

            <div className="mt-6 pt-2">
              {formError && <div className="text-xs text-rose-300 font-sans mb-3">{formError}</div>}
              {formSubmitted && <div className="text-xs text-emerald-300 font-sans mb-3">{t.successMsg}</div>}

              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-sunset px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-jungle shadow-md hover:bg-white transition-colors duration-250 cursor-pointer">
                <Send size={13} /> {t.submitPM}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
