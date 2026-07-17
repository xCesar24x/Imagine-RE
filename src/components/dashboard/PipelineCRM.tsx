"use client";

import { useState } from "react";
import { X, ArrowLeft, ArrowRight, AlertTriangle, Users, Mail, Phone, MessageCircle, FileText, Download, ShieldCheck, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Property, Lead } from "@/constants/properties";

interface PipelineCRMProps {
  leads: Lead[];
  properties: Property[];
  onUpdateLeads: (leads: Lead[]) => void;
  lang: "en" | "es";
}

export default function PipelineCRM({
  leads,
  properties,
  onUpdateLeads,
  lang
}: PipelineCRMProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNote, setNewNote] = useState("");

  const getLeadPriorityScore = (l: Lead) => {
    const horizon = (l.horizon || "").toLowerCase();
    const financing = (l.financing || "").toLowerCase();
    const wishlistCount = (l.wishlistPropertyIds || []).length;

    const isImmediate = horizon.includes("immediate") || horizon.includes("inmediato") || horizon.includes("1-3") || horizon.includes("3");
    const isFundsReady = financing.includes("cash") || financing.includes("efectivo") || financing.includes("pre-approved") || financing.includes("pre-aprobado");
    
    if (isImmediate && isFundsReady && wishlistCount >= 3) {
      return "READY";
    }
    
    const isLongTerm = horizon.includes("6+") || horizon.includes("6") || horizon.includes("later") || horizon.includes("tarde");
    if (isLongTerm) {
      return "CURIOUS";
    }

    return "POTENTIAL";
  };

  const saveLeads = (updated: Lead[]) => {
    onUpdateLeads(updated);
    if (selectedLead) {
      setSelectedLead(updated.find(u => u.id === selectedLead.id) || null);
    }
  };

  const moveLeadStatus = (leadId: string, direction: "prev" | "next") => {
    const statuses: Lead["status"][] = ["Lead Nuevo", "En Contacto", "Discovery Tour Programado", "Propuesta/Negociación", "Cierre Exitoso / Perdido"];
    const updated = leads.map(l => {
      if (l.id === leadId) {
        const index = statuses.indexOf(l.status);
        let nextIndex = index;
        if (direction === "next" && index < statuses.length - 1) nextIndex = index + 1;
        if (direction === "prev" && index > 0) nextIndex = index - 1;
        return {
          ...l,
          status: statuses[nextIndex],
          lastInteractionDate: new Date().toISOString()
        };
      }
      return l;
    });
    saveLeads(updated);
  };

  const addLeadNote = () => {
    if (!newNote.trim() || !selectedLead) return;
    const updated = leads.map(l => {
      if (l.id === selectedLead.id) {
        return {
          ...l,
          notes: [...l.notes, newNote.trim()],
          lastInteractionDate: new Date().toISOString()
        };
      }
      return l;
    });
    saveLeads(updated);
    setNewNote("");
  };

  const handleToggleGdpr = (leadId: string) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          gdprConsent: !l.gdprConsent,
          lastInteractionDate: new Date().toISOString()
        };
      }
      return l;
    });
    saveLeads(updated);
  };

  const handleUpdateTourInfo = (leadId: string, field: "tourAgent" | "tourDates", value: string) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          [field]: value,
          lastInteractionDate: new Date().toISOString()
        };
      }
      return l;
    });
    saveLeads(updated);
  };

  const handleToggleVisitedProp = (leadId: string, propId: string) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        const currentVisited = l.tourVisitedProperties || [];
        const updatedVisited = currentVisited.includes(propId)
          ? currentVisited.filter(id => id !== propId)
          : [...currentVisited, propId];
        return {
          ...l,
          tourVisitedProperties: updatedVisited,
          lastInteractionDate: new Date().toISOString()
        };
      }
      return l;
    });
    saveLeads(updated);
  };

  const isLeadInactive = (isoString: string) => {
    const lastDate = new Date(isoString);
    const diffTime = Math.abs(Date.now() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 5;
  };

  const handleSendWhatsAppReact = (l: Lead) => {
    const wishlistNames = l.wishlistPropertyIds
      .map(id => properties.find(p => p.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    const message = lang === "es"
      ? `Hola ${l.name}, ¡un gusto saludarle! Queríamos darle seguimiento a su búsqueda en IMAGINE Real Estate. Vimos que tiene en su lista de interés: ${wishlistNames || "algunas de nuestras propiedades exclusivas"}. ¿Le gustaría agendar un Discovery Tour privado o recibir una simulación de rentabilidad iCal? Quedo a su entera disposición.`
      : `Hello ${l.name}, greetings from IMAGINE Real Estate! We wanted to follow up on your property search. We noticed you wishlisted: ${wishlistNames || "some of our signature listings"}. Would you like to schedule a private Discovery Tour or receive a projected iCal revenue report? Let us know.`;

    const url = `https://api.whatsapp.com/send?phone=${encodeURIComponent(l.phone)}&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleDownloadWishlist = (l: Lead) => {
    const wishlistProps = properties.filter(p => l.wishlistPropertyIds.includes(p.id));
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const listHtml = wishlistProps.map(p => `
      <div style="border-bottom: 1px solid #d4af37; padding: 15px 0; display: flex; justify-content: space-between;">
        <div>
          <h3 style="margin: 0; font-size: 16px; color: #02140f;">${p.name}</h3>
          <p style="margin: 3px 0; font-size: 11px; color: #666;">${p.location} | REF: ${p.refCode || "N/A"}</p>
          <p style="margin: 3px 0; font-size: 12px; color: #02140f; font-weight: bold;">$${p.price.toLocaleString()} USD</p>
        </div>
        <div style="font-size: 10px; color: #777; text-align: right;">
          ${p.suites} Suites | ${(p.m2 || Math.round(p.sqft * 0.092903)).toLocaleString()} m² (${p.sqft.toLocaleString()} sqft)<br/>
          ${p.hasFiberOptic ? "Fibra Óptica ✓" : ""}${p.hasStarlink ? " | Starlink ✓" : ""}
        </div>
      </div>
    `).join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Imagine RE - Wishlist: ${l.name}</title>
          <style>
            body { font-family: 'Georgia', serif; padding: 40px; background: white; color: #02140f; }
            h1 { font-family: 'Georgia', serif; font-size: 22px; text-transform: uppercase; border-bottom: 2px solid #02140f; padding-bottom: 10px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 30px;">
            <p style="letter-spacing: 4px; font-size: 10px; text-transform: uppercase; margin: 0; color: #d4af37;">IMAGINE REAL ESTATE</p>
            <h1>WISHLIST DE COMPRA: ${l.name.toUpperCase()}</h1>
          </div>
          <p style="font-size: 11px; color: #555;"><strong>Email:</strong> ${l.email} | <strong>Teléfono:</strong> ${l.phone}</p>
          <div style="margin-top: 30px;">
            ${listHtml || "<p>No hay propiedades en la lista de deseos de este lead.</p>"}
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-8">
      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { title: "Lead Nuevo", key: "Lead Nuevo", color: "border-sky-500/30 bg-sky-500/5 text-sky-400" },
          { title: "En Contacto", key: "En Contacto", color: "border-amber-500/30 bg-amber-500/5 text-amber-400" },
          { title: "Discovery Tour", key: "Discovery Tour Programado", color: "border-purple-500/30 bg-purple-500/5 text-purple-400" },
          { title: "Propuesta/Cierre", key: "Propuesta/Negociación", color: "border-sunset/30 bg-sunset/5 text-sunset" },
          { title: "Finalizado", key: "Cierre Exitoso / Perdido", color: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400" }
        ].map(col => {
          const colLeads = leads.filter(l => l.status === col.key);
          return (
            <div key={col.key} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col h-[500px]">
              <div className={`p-3 rounded-xl border mb-4 font-sans uppercase tracking-wider text-[10px] font-bold text-center ${col.color}`}>
                {col.title} ({colLeads.length})
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colLeads.map(l => {
                  const hasWarning = isLeadInactive(l.lastInteractionDate);
                  return (
                    <div 
                      key={l.id}
                      onClick={() => setSelectedLead(l)}
                      className={`p-4 border rounded-xl bg-[#01140f] hover:border-[#d4af37]/50 cursor-pointer transition relative group ${
                        selectedLead?.id === l.id ? "border-[#d4af37]" : "border-white/5"
                      }`}
                    >
                      {hasWarning && (
                        <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" title="Inactive lead! requires update" />
                      )}
                      
                      <h5 className="font-serif text-xs text-pearl font-semibold truncate">{l.name}</h5>
                      <p className="text-[10px] text-gray-400 mt-1 truncate">{l.email}</p>

                      {/* Lead Score Indicator */}
                      {(() => {
                        const score = getLeadPriorityScore(l);
                        return (
                          <div className="mt-2 flex items-center gap-1.5">
                            <span className={`inline-flex h-2 w-2 rounded-full ${
                              score === "READY" ? "bg-emerald-500" : score === "POTENTIAL" ? "bg-amber-500" : "bg-rose-500"
                            }`} />
                            <span className="text-[8px] font-sans tracking-wider uppercase text-gray-400 font-semibold">
                              {score === "READY" 
                                ? (lang === "es" ? "Decidido" : "Ready") 
                                : score === "POTENTIAL" 
                                  ? (lang === "es" ? "Potencial" : "Potential") 
                                  : (lang === "es" ? "Curioso" : "Curious")}
                            </span>
                          </div>
                        );
                      })()}

                      {/* Service Requested Badge */}
                      {l.requestedService && (
                        <div className="mt-1.5 flex items-center gap-1">
                          <span className={`px-2 py-0.5 text-[8px] font-sans tracking-wide uppercase rounded border font-semibold ${
                            l.requestedService === "guided_tour" 
                              ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                              : l.requestedService === "visit"
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                                : "bg-blue-500/10 border-blue-500/30 text-blue-300"
                          }`}>
                            {l.requestedService === "guided_tour" 
                              ? (lang === "es" ? "🚐 Tour Guiado" : "🚐 Guided Tour") 
                              : l.requestedService === "visit" 
                                ? (lang === "es" ? "🔑 Visita" : "🔑 Visit") 
                                : (lang === "es" ? "📄 Info" : "📄 Info")}
                          </span>
                        </div>
                      )}
                      
                      {/* Reactivate Lead WhatsApp shortcut */}
                      {hasWarning && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleSendWhatsAppReact(l); }}
                          className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-[8px] font-sans font-bold uppercase tracking-widest hover:bg-rose-900/50 transition cursor-pointer"
                        >
                          <MessageCircle size={10} />
                          {lang === "es" ? "Reactivar Lead" : "Reactivate Lead"}
                        </button>
                      )}

                      <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-white/5">
                        <span className="text-[9px] font-sans font-medium text-[#d4af37]">${l.budgetRange}</span>
                        <div className="flex gap-1">
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); moveLeadStatus(l.id, "prev"); }}
                            className="p-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer"
                          >
                            <ArrowLeft size={10} />
                          </button>
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); moveLeadStatus(l.id, "next"); }}
                            className="p-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer"
                          >
                            <ArrowRight size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lead Details Modal Panel */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 grid gap-8 lg:grid-cols-2"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-white/10 pb-4">
                <div>
                  <h4 className="font-serif text-xl text-pearl font-bold">{selectedLead.name}</h4>
                  <div className="flex items-center gap-2.5 mt-1">
                    <span className="text-[10px] text-sunset font-sans uppercase tracking-widest font-semibold">{selectedLead.status}</span>
                    <span className="text-gray-600">|</span>
                    
                    {/* GDPR Consent Status tag */}
                    <div className="flex items-center gap-1 text-[9px] font-sans font-semibold">
                      <ShieldCheck size={12} className={selectedLead.gdprConsent ? "text-emerald-400" : "text-gray-500"} />
                      <span className={selectedLead.gdprConsent ? "text-emerald-400" : "text-gray-500"}>
                        {selectedLead.gdprConsent 
                          ? (lang === "es" ? "GDPR Aceptado" : "GDPR Consent ✓")
                          : (lang === "es" ? "Sin Consentimiento GDPR" : "No GDPR Consent ✗")
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="p-1.5 rounded-full border border-white/15 text-white hover:bg-white hover:text-jungle transition cursor-pointer"
                >
                  <X size={13} />
                </button>
              </div>

              {/* GDPR Toggle Switch */}
              <div className="bg-[#01140f] border border-white/5 rounded-xl p-3.5 flex justify-between items-center">
                <div>
                  <h5 className="text-[10px] uppercase font-bold text-pearl tracking-wider">{lang === "es" ? "Consentimiento GDPR (Ley N° 8968)" : "GDPR Privacy Consent (CR Law 8968)"}</h5>
                  <p className="text-[8.5px] text-gray-400 mt-0.5 leading-relaxed">{lang === "es" ? "Declaración jurada de almacenamiento y tratamiento confidencial de datos." : "Explicit opt-in to register details & wishlist."}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleGdpr(selectedLead.id)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${selectedLead.gdprConsent ? "bg-emerald-600" : "bg-white/10"}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${selectedLead.gdprConsent ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Lead Contact Info */}
              <div className="grid gap-4 sm:grid-cols-2 text-xs font-sans">
                <div>
                  <span className="text-gray-400 block mb-0.5">Email</span>
                  <a href={`mailto:${selectedLead.email}`} className="text-pearl hover:text-[#d4af37] transition font-medium flex items-center gap-1"><Mail size={12} /> {selectedLead.email}</a>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Teléfono</span>
                  <a href={`tel:${selectedLead.phone}`} className="text-pearl hover:text-[#d4af37] transition font-medium flex items-center gap-1"><Phone size={12} /> {selectedLead.phone}</a>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Estatus Financiero</span>
                  <span className="text-pearl font-medium">{selectedLead.financing} / {selectedLead.budgetRange} USD</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Última Actividad</span>
                  <span className={`font-semibold ${isLeadInactive(selectedLead.lastInteractionDate) ? "text-rose-400" : "text-emerald-400"}`}>
                    {new Date(selectedLead.lastInteractionDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">{lang === "es" ? "Prioridad de Prospecto" : "Lead Priority"}</span>
                  {(() => {
                    const score = getLeadPriorityScore(selectedLead);
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-sans tracking-widest uppercase font-bold ${
                        score === "READY" 
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                          : score === "POTENTIAL" 
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-400" 
                            : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          score === "READY" ? "bg-emerald-400" : score === "POTENTIAL" ? "bg-amber-400" : "bg-rose-400"
                        }`} />
                        {score === "READY" 
                          ? (lang === "es" ? "Decidido (Verde)" : "Ready (Green)") 
                          : score === "POTENTIAL" 
                            ? (lang === "es" ? "Potencial (Amarillo)" : "Potential (Yellow)") 
                            : (lang === "es" ? "Curioso (Rojo)" : "Curious (Red)")}
                      </span>
                    );
                  })()}
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">{lang === "es" ? "Servicio Solicitado" : "Requested Service"}</span>
                  {selectedLead.requestedService ? (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-sans tracking-widest uppercase font-bold ${
                      selectedLead.requestedService === "guided_tour" 
                        ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                        : selectedLead.requestedService === "visit"
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                          : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                    }`}>
                      {selectedLead.requestedService === "guided_tour" 
                        ? (lang === "es" ? "🚐 Tour Guiado + Transp." : "🚐 Guided Tour + Shuttle") 
                        : selectedLead.requestedService === "visit" 
                          ? (lang === "es" ? "🔑 Visita Propiedad" : "🔑 Property Visit") 
                          : (lang === "es" ? "📄 Info Propiedad" : "📄 Property Info")}
                    </span>
                  ) : (
                    <span className="text-pearl/60 italic text-xs">{lang === "es" ? "No especificado" : "Not specified"}</span>
                  )}
                </div>
              </div>

              {/* Discovery Tour Details (Physical Visit Tracker) */}
              <div className="border-t border-white/10 pt-4 space-y-3.5">
                <h5 className="text-[10px] uppercase font-bold text-[#d4af37] tracking-wider">{lang === "es" ? "Métricas de Discovery Tour Físico" : "Physical Discovery Tour Metrics"}</h5>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                      {lang === "es" ? "Agente Asignado" : "Assigned Agent"}
                    </label>
                    <input
                      type="text"
                      value={selectedLead.tourAgent || ""}
                      onChange={e => handleUpdateTourInfo(selectedLead.id, "tourAgent", e.target.value)}
                      placeholder={lang === "es" ? "ej. Bryan Viquez" : "e.g. Bryan Viquez"}
                      className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                      {lang === "es" ? "Fechas de Visita" : "Tour Dates"}
                    </label>
                    <input
                      type="text"
                      value={selectedLead.tourDates || ""}
                      onChange={e => handleUpdateTourInfo(selectedLead.id, "tourDates", e.target.value)}
                      placeholder="e.g. 2026-07-10 to 2026-07-15"
                      className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">
                    {lang === "es" ? "Propiedades Visitadas Físicamente" : "Physically Visited Properties"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {properties.map(p => {
                      const isVisited = (selectedLead.tourVisitedProperties || []).includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleToggleVisitedProp(selectedLead.id, p.id)}
                          className={`px-3 py-1 rounded-full text-[9px] font-sans font-medium uppercase border transition cursor-pointer ${
                            isVisited 
                              ? "bg-[#d4af37] border-[#d4af37] text-jungle font-bold"
                              : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                          }`}
                        >
                          {p.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* WhatsApp Contact CTA by Service Type */}
              <div className="border-t border-white/10 pt-4 space-y-3">
                <h5 className="text-[10px] uppercase font-bold text-[#25D366] tracking-wider flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366]">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {lang === "es" ? "Contacto WhatsApp" : "WhatsApp Contact"}
                </h5>
                <button
                  type="button"
                  onClick={() => {
                    const WHATSAPP_NUMBER = "50688621215";
                    const service = selectedLead.requestedService;
                    const props = (selectedLead.wishlistPropertyIds || [])
                      .map(id => properties.find(p => p.id === id)?.name)
                      .filter(Boolean)
                      .join(", ") || (lang === "es" ? "propiedades en wishlist" : "wishlisted properties");

                    let msg = "";
                    if (service === "guided_tour") {
                      msg = lang === "es"
                        ? `Hola ${selectedLead.name}, le contacta Bryan Viquez de Imagine RE & PM. Vi que solicitó un tour guiado con transporte para visitar: ${props}. Me gustaría coordinar los detalles con usted. ¿Cuándo tiene disponibilidad?`
                        : `Hello ${selectedLead.name}, this is Bryan Viquez from Imagine RE & PM. I see you requested a guided tour with transportation to visit: ${props}. I'd love to coordinate the details with you. When are you available?`;
                    } else if (service === "visit") {
                      msg = lang === "es"
                        ? `Hola ${selectedLead.name}, le contacta Bryan Viquez de Imagine RE & PM. Vi su solicitud para coordinar una visita presencial a: ${props}. Estoy disponible para agendar la visita según su conveniencia. ¿Cuándo podría ser?`
                        : `Hello ${selectedLead.name}, this is Bryan Viquez from Imagine RE & PM. I saw your request to coordinate a property visit to: ${props}. I'm available to schedule it at your convenience. When would work for you?`;
                    } else {
                      msg = lang === "es"
                        ? `Hola ${selectedLead.name}, le contacta Bryan Viquez de Imagine RE & PM. Vi que solicitó información sobre: ${props}. Con mucho gusto le comparto todos los detalles. ¿Tiene un momento para conversar?`
                        : `Hello ${selectedLead.name}, this is Bryan Viquez from Imagine RE & PM. I see you requested information about: ${props}. I'd be happy to share all the details. Do you have a moment to chat?`;
                    }
                    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`, "_blank");
                  }}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-sans font-bold uppercase tracking-widest text-[9px] transition cursor-pointer border ${
                    selectedLead.requestedService === "guided_tour"
                      ? "bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                      : selectedLead.requestedService === "visit"
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                        : "bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
                  }`}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {selectedLead.requestedService === "guided_tour"
                    ? (lang === "es" ? "🚐 Responder: Tour Guiado" : "🚐 Reply: Guided Tour")
                    : selectedLead.requestedService === "visit"
                      ? (lang === "es" ? "🔑 Responder: Coordinar Visita" : "🔑 Reply: Schedule Visit")
                      : (lang === "es" ? "📄 Responder: Enviar Info" : "📄 Reply: Send Info")}
                </button>
              </div>

              {/* Wishlist Export Buttons */}
              <div className="border-t border-white/10 pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleDownloadWishlist(selectedLead)}
                  className="flex-1 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-jungle text-[10px] py-2.5 rounded-xl uppercase tracking-widest font-bold cursor-pointer text-center flex items-center justify-center gap-1.5 transition"
                >
                  <Download size={12} />
                  {lang === "es" ? "Exportar Wishlist PDF" : "Export Wishlist PDF"}
                </button>
              </div>
            </div>

            {/* CRM Note Logs */}
            <div className="flex flex-col border-l border-white/10 pl-6 h-full justify-between">
              <div>
                <h5 className="text-[10px] uppercase tracking-wider text-gray-400 mb-3">Admin CRM Interaction Logs</h5>
                <div className="overflow-y-auto space-y-3 mb-4 max-h-[320px] pr-2">
                  {selectedLead.notes.map((note, idx) => (
                    <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs text-pearl leading-relaxed">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-white/5">
                <textarea
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="Log new interaction or notes..."
                  rows={2}
                  className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]"
                />
                <button
                  type="button"
                  onClick={addLeadNote}
                  className="w-full bg-[#d4af37] text-[#02140f] hover:bg-white text-xs py-2 rounded-xl uppercase tracking-widest font-bold cursor-pointer text-center"
                >
                  Add CRM Log
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
