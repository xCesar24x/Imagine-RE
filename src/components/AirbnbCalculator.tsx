"use client";

import { useState, useMemo } from "react";
import { Send, Calculator, Building, DollarSign } from "lucide-react";
import { TRANSLATIONS } from "@/constants/translations";

interface AirbnbCalculatorProps {
  lang?: "en" | "es";
}

const TYPE_RATES = {
  Casa: 450,
  Cabaña: 250,
  Quinta: 600,
  Lote: 0,
};

export default function AirbnbCalculator({ lang = "en" }: AirbnbCalculatorProps) {
  const t = TRANSLATIONS[lang].propertyManagement;

  // Calculator variables
  const [propertyType, setPropertyType] = useState<"Casa" | "Cabaña" | "Quinta" | "Lote">("Casa");
  const [occupancy, setOccupancy] = useState<number>(60);

  // Owner details form
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [propertyLoc, setPropertyLoc] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const estimatedEarnings = useMemo(() => {
    const adr = TYPE_RATES[propertyType];
    if (adr === 0) return { monthly: 0, annual: 0, adr: 0 };
    const monthly = adr * 30 * (occupancy / 100);
    const annual = adr * 365 * (occupancy / 100);
    return { monthly, annual, adr };
  }, [propertyType, occupancy]);

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
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] max-w-5xl mx-auto items-start">
      {/* Interactive Calculator panel */}
      <div className="rounded-[2.5rem] border border-white/10 bg-[#041c16]/90 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl">
        <div className="flex items-center gap-3.5 mb-6">
          <div className="p-3 bg-sunset/10 rounded-2xl text-sunset">
            <Calculator size={24} />
          </div>
          <div>
            <h3 className="font-serif text-2xl text-pearl">{t.calculatorTitle}</h3>
            <p className="text-xs text-gray-400 mt-1">{t.calculatorSubtitle}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Property Type Selection */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-3">{t.propertyType}</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(Object.keys(TYPE_RATES) as Array<keyof typeof TYPE_RATES>).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPropertyType(type)}
                  className={`py-3 px-4 rounded-2xl border text-xs font-sans uppercase tracking-widest font-semibold transition cursor-pointer ${
                    propertyType === type
                      ? "bg-sunset border-sunset text-jungle shadow-[0_10px_30px_rgba(212,175,55,0.15)]"
                      : "bg-white/5 border-white/10 text-gray-300 hover:border-sunset/30"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Occupancy Rate Slider */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-[10px] uppercase tracking-[0.25em] text-gray-400">{t.occupancyRate}</label>
              <span className="text-sm font-sans font-bold text-sunset">{occupancy}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="95"
              step="5"
              value={occupancy}
              onChange={(e) => setOccupancy(parseInt(e.target.value))}
              className="w-full h-1 bg-[#01140f] rounded-lg appearance-none cursor-pointer accent-sunset"
            />
            <div className="flex justify-between text-[9px] text-gray-400 uppercase tracking-wider mt-2">
              <span>Low (20%)</span>
              <span>Moderate (60%)</span>
              <span>High (95%)</span>
            </div>
          </div>

          {/* Earnings Display */}
          {propertyType === "Lote" ? (
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center text-xs md:text-sm text-gray-400 leading-relaxed font-light italic">
              {lang === "es" 
                ? "¡Los lotes no generan renta vacacional directa! Consulta con Imagine para diseñar y construir una cabaña eco-luxury y desbloquear ingresos estimados de $250+ por noche."
                : "Lots don't yield vacation rental income directly! Partner with Imagine to design & build an eco-luxury cabin to unlock $250+ nightly estimated revenue."}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-white/10">
              <div className="rounded-2xl bg-[#01140f] p-5 border border-white/5">
                <span className="text-[9px] uppercase tracking-[0.25em] text-gray-400">{t.estMonthly}</span>
                <div className="text-2xl md:text-3xl font-sans font-bold text-sunset mt-1">
                  ${Math.round(estimatedEarnings.monthly).toLocaleString("en-US")}
                </div>
                <span className="text-[9px] text-gray-400 block mt-1">At ${estimatedEarnings.adr}/night ADR</span>
              </div>
              <div className="rounded-2xl bg-[#01140f] p-5 border border-white/5">
                <span className="text-[9px] uppercase tracking-[0.25em] text-gray-400">{t.estIncome}</span>
                <div className="text-2xl md:text-3xl font-sans font-bold text-white mt-1">
                  ${Math.round(estimatedEarnings.annual).toLocaleString("en-US")}
                </div>
                <span className="text-[9px] text-gray-400 block mt-1">At {occupancy}% projected occupancy</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Owner Lead Capture form */}
      <div className="rounded-[2.5rem] border border-white/10 bg-[#041c16]/90 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl h-full flex flex-col">
        <h4 className="font-serif text-xl text-pearl mb-2 flex items-center gap-2">
          <Building size={18} className="text-sunset" />
          {t.contactUsPM}
        </h4>
        <p className="text-xs text-gray-300 leading-relaxed mb-6 font-light">
          {lang === "es"
            ? "Mándanos las características generales de tu propiedad. Nuestro concierge analizará la plusvalía y te contactará con opciones a la medida."
            : "Send us the general parameters of your property. Our concierge will analyze the appreciation values and reach out with tailored proposals."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
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
          </div>

          <div className="mt-6">
            {formError && <div className="text-xs text-rose-300 font-sans mb-3">{formError}</div>}
            {formSubmitted && <div className="text-xs text-emerald-300 font-sans mb-3">{t.successMsg}</div>}

            <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-sunset px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-jungle shadow-md hover:bg-white transition-colors duration-250 cursor-pointer">
              <Send size={13} /> {t.submitPM}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
