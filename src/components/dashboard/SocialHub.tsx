"use client";

import { useState } from "react";
import { Sparkles, Download, Copy, ChevronDown } from "lucide-react";
import { Property } from "@/constants/properties";

interface SocialHubProps {
  properties: Property[];
  postingDates: Record<string, string>;
  onUpdatePostingDate: (id: string) => void;
  lang: "en" | "es";
}

export default function SocialHub({
  properties,
  postingDates,
  onUpdatePostingDate,
  lang
}: SocialHubProps) {
  const [selectedPropForSocial, setSelectedPropForSocial] = useState<string>("");
  const [generatedCopy, setGeneratedCopy] = useState({ ig: "", fb: "" });
  const [showCopySection, setShowCopySection] = useState(false);

  const getPostStatusColor = (isoString?: string) => {
    if (!isoString) return "bg-rose-600 animate-pulse";
    const diff = Date.now() - new Date(isoString).getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    if (days >= 14) return "bg-rose-600 animate-pulse";
    if (days >= 7) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const generateSocialCopy = () => {
    const prop = properties.find(p => p.id === selectedPropForSocial);
    if (!prop) return;

    // Neuromarketing Sensory Storytelling (sound, visual sights, canopy breezes)
    const igCopy = lang === "es" 
      ? `✨ imagine RE | Inmersión Sensorial y Eco-Lujo 🌿\n\nCierra los ojos y escucha: el murmullo constante de la llovizna sobre las hojas gigantes, el silbido suave del viento acariciando las copas de los árboles, y ese aroma a tierra húmeda y bosque virgen que solo encuentras a ${prop.elevationM} m.s.n.m. ⛰️\n\n"${prop.nameEs || prop.name}" en ${prop.location} no es solo una obra maestra de diseño arquitectónico; es un portal directo a la paz interior. Su estructura de concreto y vidrio templado se funde en absoluta complicidad con la naturaleza tropical costarricense.\n\n📍 Ubicación Exclusiva (Área de Privacidad): ${prop.approxLocation}\n📲 ¿Listo para desconectarte del ruido urbano y reconectarte con lo esencial? Solicita tu invitación privada para nuestro Discovery Tour VIP vía DM.\n\n#ImagineRE #CostaRicaLuxury #ForestVibe #StorytellingInmobiliario #EcoLuxury`
      : `✨ imagine RE | Sensory Storytelling & Eco-Luxury 🌿\n\nClose your eyes and listen: the rhythmic patter of mist on giant tropical leaves, the gentle whisper of wind filtering through the canopy, and the clean scent of mossy highlands at ${prop.elevationM} meters above sea level. ⛰️\n\n"${prop.name}" in ${prop.location} is more than a residence; it is a physical retreat for the senses. Architecturally designed to blend into Costa Rica's cloud forests, its structures look out onto a living painting.\n\n📍 Secluded Estate (Security Area): ${prop.approxLocation}\n📲 Ready to escape the ordinary? Request your private invitation for a VIP Discovery Tour via DM.\n\n#ImagineRE #LuxuryCostaRica #CanopyLiving #EcoArchitecture #SensoryDesign`;

    const fbCopy = lang === "es"
      ? `💼 IMAGINE REAL ESTATE & PROPERTY MANAGEMENT | Informe de Inversión y Plusvalía 📊\n\nOportunidad inmobiliaria corporativa de alta gama y rentabilidad proyectada en ${prop.location}.\n\n🏡 Residencia: ${prop.nameEs || prop.name}\n💰 Precio de Lista: $${prop.price.toLocaleString("en-US")} USD\n📐 Área de Construcción: ${(prop.m2 || Math.round(prop.sqft * 0.092903)).toLocaleString()} m² (${prop.sqft.toLocaleString("en-US")} sqft)\n🛏️ Suites Master: ${prop.suites} Suites con baño privado y vistas panorámicas.\n📡 Conectividad: Preparado para trabajo remoto de alta velocidad con ${prop.hasFiberOptic ? "Fibra Óptica redundante" : ""}${prop.hasStarlink ? " + Respaldo satelital Starlink" : ""}.\n✈️ Accesibilidad Logística: A solo ${prop.airportDistKm} km (${prop.airportTimeMin} min) de la pista de aterrizaje del Aeropuerto Internacional SJO.\n\nDiseñada para portafolios de inversión premium que busquen altas tasas de ocupación turística a través de nuestro servicio integral Imagine PM. Solicite un estudio de viabilidad financiera personalizado.`
      : `💼 IMAGINE REAL ESTATE & PROPERTY MANAGEMENT | Investment Prospect & High ROI 📊\n\nWe present a signature luxury asset featuring high equity growth and yield in ${prop.location}.\n\n🏡 Property: ${prop.name}\n💰 List Price: $${prop.price.toLocaleString("en-US")} USD\n📐 Built Area: ${(prop.m2 || Math.round(prop.sqft * 0.092903)).toLocaleString()} m² (${prop.sqft.toLocaleString("en-US")} sqft)\n🛏️ Layout: ${prop.suites} Master Suites overlooking ocean/jungle preserves.\n📡 Connectivity: Fully optimized for corporate remote work with ${prop.hasFiberOptic ? "Fiber Optic enabled" : ""}${prop.hasStarlink ? " + Starlink backup" : ""}.\n✈️ Logistics: Just ${prop.airportDistKm} km (${prop.airportTimeMin} min) from SJO International Airport.\n\nIdeal for high-yield rental portfolios with turn-key asset management by Imagine PM. Inquire for private financial modeling tables.`;

    setGeneratedCopy({ ig: igCopy, fb: fbCopy });
    setShowCopySection(true);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      {/* Table list */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
        <h3 className="font-serif text-lg text-pearl mb-6 border-b border-white/10 pb-3 flex items-center justify-between">
          <span>Posting Traffic Light Alerts</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest">Post Frequency Tracker</span>
        </h3>
        <div className="space-y-4">
          {properties.map(p => {
            const postDate = postingDates[p.id];
            const colorClass = getPostStatusColor(postDate);
            return (
              <div 
                key={p.id} 
                onClick={() => { setSelectedPropForSocial(p.id); setShowCopySection(false); }}
                className={`flex gap-4 p-4 border rounded-2xl items-center hover:border-[#d4af37]/30 cursor-pointer transition ${
                  selectedPropForSocial === p.id ? "border-[#d4af37] bg-[#011a14]" : "border-white/5"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full ${colorClass}`} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-xs text-pearl font-semibold truncate">{p.name}</h4>
                  <p className="text-[9px] text-gray-400 mt-0.5 font-mono">
                    Last posted: {postDate ? new Date(postDate).toLocaleDateString() : "Never posted"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onUpdatePostingDate(p.id); }}
                  className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-sunset bg-white/5 text-[9px] font-sans uppercase tracking-widest text-[#d4af37] cursor-pointer"
                >
                  Mark Posted
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI generator and Exporter panel */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between min-h-[500px]">
        <div>
          <h3 className="font-serif text-lg text-pearl mb-6 border-b border-white/10 pb-3">AI Social Copies & Asset Packs Exporter</h3>
          <div className="space-y-4">
            <label className="block text-[10px] uppercase tracking-wider text-gray-400">Select Property to Generate Copy</label>
            <div className="relative">
              <select
                value={selectedPropForSocial}
                onChange={e => { setSelectedPropForSocial(e.target.value); setShowCopySection(false); }}
                className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl appearance-none pr-10 focus:outline-none focus:border-[#d4af37] cursor-pointer"
              >
                <option value="">-- Choose property --</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#d4af37]" size={14} />
            </div>

            <button
              type="button"
              onClick={generateSocialCopy}
              disabled={!selectedPropForSocial}
              className="w-full bg-[#d4af37] text-[#02140f] hover:bg-white text-xs py-3 rounded-xl uppercase tracking-widest font-bold cursor-pointer text-center disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              <Sparkles size={14} />
              Generate AI Copies
            </button>
          </div>

          {showCopySection && (
            <div className="mt-8 space-y-6">
              {/* Instagram/TikTok emotional */}
              <div className="p-4 rounded-xl border border-white/5 bg-[#01140f] space-y-3 relative group">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-sunset font-sans uppercase tracking-widest font-bold">Emotional Tone (IG / TikTok)</span>
                  <button 
                    type="button"
                    onClick={() => navigator.clipboard.writeText(generatedCopy.ig)}
                    className="p-1 rounded hover:bg-white/5 text-gray-400 hover:text-white cursor-pointer"
                    title="Copy to clipboard"
                  >
                    <Copy size={13} />
                  </button>
                </div>
                <p className="text-xs text-pearl leading-relaxed whitespace-pre-line font-light">
                  {generatedCopy.ig}
                </p>
              </div>

              {/* Facebook Technical */}
              <div className="p-4 rounded-xl border border-white/5 bg-[#01140f] space-y-3 relative group">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-sunset font-sans uppercase tracking-widest font-bold">Technical / ROI Tone (Facebook)</span>
                  <button 
                    type="button"
                    onClick={() => navigator.clipboard.writeText(generatedCopy.fb)}
                    className="p-1 rounded hover:bg-white/5 text-gray-400 hover:text-white cursor-pointer"
                    title="Copy to clipboard"
                  >
                    <Copy size={13} />
                  </button>
                </div>
                <p className="text-xs text-pearl leading-relaxed whitespace-pre-line font-light">
                  {generatedCopy.fb}
                </p>
              </div>
            </div>
          )}
        </div>

        {showCopySection && (
          <div className="border-t border-white/10 pt-6 mt-8 flex flex-col gap-4">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Reels & CapCut Assets Exporter Package</span>
            <button
              type="button"
              onClick={() => {
                const blob = new Blob([generatedCopy.ig + "\n\n" + generatedCopy.fb], { type: "text/plain;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `imagine-assets-${selectedPropForSocial}.txt`;
                a.click();
              }}
              className="w-full border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-jungle text-xs py-3 rounded-xl uppercase tracking-widest font-bold cursor-pointer text-center flex items-center justify-center gap-2 transition"
            >
              <Download size={14} />
              Export Assets Package (.ZIP / Text)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
