"use client";

import { useState, useEffect, useMemo, type FormEvent } from "react";
import { X, Shield, AlertTriangle, Edit2, Users, Sparkles, FileText, BarChart2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Property, Lead, PropertyType } from "@/constants/properties";

// Import modular dashboard subcomponents
import InventoryCRUD from "./dashboard/InventoryCRUD";
import PipelineCRM from "./dashboard/PipelineCRM";
import SocialHub from "./dashboard/SocialHub";
import ContractAutomator from "./dashboard/ContractAutomator";
import FinancialReports from "./dashboard/FinancialReports";
import SettingsTab from "./dashboard/SettingsTab";

interface AdminDashboardProps {
  properties: Property[];
  onAddProperty: (p: Property) => void;
  onUpdateProperty: (p: Property) => void;
  onDeleteProperty: (id: string) => void;
  propertyTypes: PropertyType[];
  onUpdatePropertyTypes: (types: PropertyType[]) => void;
  lang: "en" | "es";
  onClose: () => void;
}

interface Collaborator {
  id: string;
  name: string;
  username: string;
  password: string;
  role: string;
}

export default function AdminDashboard({
  properties,
  onAddProperty,
  onUpdateProperty,
  onDeleteProperty,
  propertyTypes,
  onUpdatePropertyTypes,
  lang,
  onClose
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"inventory" | "crm" | "social" | "contracts" | "reports" | "settings">("inventory");

  // --- Restricted Access & Session States ---
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState<Collaborator | null>(null);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [postingDates, setPostingDates] = useState<Record<string, string>>({});
  const [crmAlert, setCrmAlert] = useState<string | null>(null);

  // Seed / Load Collaborators, Session, Leads & Postings on Mount
  useEffect(() => {
    // 1. Collaborators
    const storedCols = localStorage.getItem("imagine_collaborators");
    let colsList: Collaborator[] = [];
    if (storedCols) {
      try { colsList = JSON.parse(storedCols); } catch (e) {}
    }
    if (!colsList || colsList.length === 0) {
      colsList = [
        { id: "col-1", name: "Bryan Viquez", username: "admin", password: "admin", role: "Administrador" }
      ];
      localStorage.setItem("imagine_collaborators", JSON.stringify(colsList));
    }
    setCollaborators(colsList);

    // Session check
    const activeSessionUser = sessionStorage.getItem("imagine_admin_username");
    if (activeSessionUser) {
      const match = colsList.find(c => c.username === activeSessionUser);
      if (match) {
        setCurrentUser(match);
        setIsAuthorized(true);
      }
    }

    // 2. Leads
    const storedLeads = localStorage.getItem("imagine_leads");
    if (storedLeads) {
      setLeads(JSON.parse(storedLeads));
    } else {
      const initialLeads: Lead[] = [
        {
          id: "lead-1",
          name: "Alexis Carter",
          email: "alexis.carter@investments.com",
          phone: "+1 (555) 902-1143",
          budgetRange: "5M - 10M",
          financing: "Cash",
          horizon: "Immediate",
          motivation: "Vacation",
          requestedService: "guided_tour",
          wishlistPropertyIds: ["villa-morpho", "quepos-zenith"],
          status: "Discovery Tour Programado",
          tourDates: "2026-07-10 to 2026-07-15",
          tourPeople: 4,
          tourLodging: true,
          tourLodgingPref: "Luxury boutique hotel",
          notes: ["Client is highly interested in oceanfront sunset properties.", "Requires helicopter landing pad access verification."],
          lastInteractionDate: new Date().toISOString(),
          gdprConsent: true,
          tourAgent: "Bryan Viquez",
          tourVisitedProperties: ["villa-morpho"]
        },
        {
          id: "lead-2",
          name: "Santiago Jiménez",
          email: "santiago@grupojimenez.cr",
          phone: "+506 8843-2211",
          budgetRange: "Under 5M",
          financing: "Pre-approved",
          horizon: "1-3 months",
          motivation: "Relocation",
          requestedService: "information",
          wishlistPropertyIds: ["cloud-forest", "nosara-flow"],
          status: "Lead Nuevo",
          notes: ["Prefers mountain or cloud forest properties with fiber optic connection."],
          lastInteractionDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago (triggers warning)
          gdprConsent: false
        },
        {
          id: "lead-3",
          name: "Emma Thompson",
          email: "emma.th@londoncap.co.uk",
          phone: "+44 7700 900077",
          budgetRange: "Over 10M",
          financing: "Cash",
          horizon: "6+ months",
          motivation: "Airbnb",
          requestedService: "visit",
          wishlistPropertyIds: ["guanacaste-gold", "papagayo-point"],
          status: "Propuesta/Negociación",
          tourDates: "2026-06-25 to 2026-06-30",
          tourPeople: 2,
          tourLodging: true,
          tourLodgingPref: "High-end resort suite",
          notes: ["Expatriate looking for high ROI options in Peninsula Papagayo.", "Requested detailed iCal calendars of active listings."],
          lastInteractionDate: new Date().toISOString(),
          gdprConsent: true
        }
      ];
      setLeads(initialLeads);
      localStorage.setItem("imagine_leads", JSON.stringify(initialLeads));
    }

    // 3. Postings
    const storedPostings = localStorage.getItem("imagine_posting_dates");
    if (storedPostings) {
      setPostingDates(JSON.parse(storedPostings));
    } else {
      const initialPostings: Record<string, string> = {
        "villa-morpho": new Date().toISOString(),
        "obsidian-canopy": new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        "quepos-zenith": new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        "guanacaste-gold": new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
      };
      setPostingDates(initialPostings);
      localStorage.setItem("imagine_posting_dates", JSON.stringify(initialPostings));
    }
  }, []);

  // Cruce Inteligente (Advanced matching by budget, region & lifestyle motivation)
  const handleAddPropertyWithMatching = (newProp: Property) => {
    onAddProperty(newProp);
    
    // Scan leads for a match
    const matches = leads.filter(l => {
      // 1. Budget checking
      let budgetLimit = 999999999;
      if (l.budgetRange.includes("Under 500K")) budgetLimit = 500000;
      else if (l.budgetRange.includes("500K - 1.5M")) budgetLimit = 1500000;
      else if (l.budgetRange.includes("1.5M - 5M")) budgetLimit = 5000000;
      
      const budgetMatched = newProp.price <= budgetLimit;
      
      // 2. Lifestyle Match (e.g. Naturaleza vs Ciudad)
      const lifestyleMatched = 
        (l.motivation === "Relocation" || l.motivation === "Vacation") 
          ? newProp.lifestyle === "Naturaleza" 
          : true;

      return budgetMatched && lifestyleMatched;
    });

    if (matches.length > 0) {
      setCrmAlert(
        lang === "es"
          ? `⚠️ CRUCE INTELIGENTE: ¡La nueva propiedad "${newProp.nameEs || newProp.name}" coincide con el presupuesto y estilo de vida buscado por ${matches.map(m => m.name).join(", ")}!`
          : `⚠️ PROPERTY MATCHING: The new property "${newProp.name}" matches the budget and lifestyle profiles of ${matches.map(m => m.name).join(", ")}!`
      );
      setTimeout(() => setCrmAlert(null), 10000);
    }
  };

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const storedCols = localStorage.getItem("imagine_collaborators");
    let colsList: Collaborator[] = [];
    if (storedCols) {
      try { colsList = JSON.parse(storedCols); } catch (err) {}
    }
    if (!colsList || colsList.length === 0) {
      colsList = [
        { id: "col-1", name: "Bryan Viquez", username: "admin", password: "admin", role: "Administrador" }
      ];
    }

    const match = colsList.find(c => c.username === loginUsername && c.password === loginPassword);
    if (match) {
      setCurrentUser(match);
      setIsAuthorized(true);
      sessionStorage.setItem("imagine_admin_username", match.username);
    } else {
      setLoginError(lang === "es" ? "Usuario o contraseña incorrectos." : "Invalid username or password.");
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setCurrentUser(null);
    sessionStorage.removeItem("imagine_admin_username");
  };

  const handleUpdateCollaborators = (updatedCols: Collaborator[]) => {
    setCollaborators(updatedCols);
    localStorage.setItem("imagine_collaborators", JSON.stringify(updatedCols));
  };

  const handleUpdateLeadsList = (updatedLeads: Lead[]) => {
    setLeads(updatedLeads);
    localStorage.setItem("imagine_leads", JSON.stringify(updatedLeads));
  };

  const handleUpdatePostingDate = (id: string) => {
    const updated = {
      ...postingDates,
      [id]: new Date().toISOString()
    };
    setPostingDates(updated);
    localStorage.setItem("imagine_posting_dates", JSON.stringify(updated));
  };

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-[#02140f] border border-[#d4af37]/30 rounded-2xl w-full max-w-md p-8 shadow-2xl overflow-hidden relative font-sans text-pearl">
          <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-[#d4af37]/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-[#d4af37]/5 blur-3xl pointer-events-none" />

          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center mb-4 text-[#d4af37]">
              <Shield size={24} />
            </div>
            <h2 className="font-serif text-2xl text-pearl uppercase tracking-wider">{lang === "es" ? "Acceso Restringido" : "Restricted Access"}</h2>
            <p className="text-[10px] text-[#d4af37] uppercase tracking-widest mt-1 font-semibold">Imagine Admin Portal</p>
          </div>

          {loginError && (
            <div className="bg-rose-950/40 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-xl text-xs mb-6 font-sans text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">{lang === "es" ? "Usuario" : "Username"}</label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={e => setLoginUsername(e.target.value)}
                className="w-full bg-[#01140f] border border-white/15 text-pearl text-xs px-3.5 py-3 rounded-xl outline-none focus:border-[#d4af37] transition font-sans"
                placeholder={lang === "es" ? "ej. admin" : "e.g. admin"}
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">{lang === "es" ? "Contraseña" : "Password"}</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full bg-[#01140f] border border-white/15 text-pearl text-xs px-3.5 py-3 rounded-xl outline-none focus:border-[#d4af37] transition font-sans"
                placeholder="••••••••"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-white/15 text-white hover:bg-white hover:text-jungle text-xs py-3 rounded-xl uppercase tracking-widest font-semibold cursor-pointer text-center transition"
              >
                {lang === "es" ? "Cerrar" : "Close"}
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#d4af37] text-[#02140f] hover:bg-white text-xs py-3 rounded-xl uppercase tracking-widest font-bold cursor-pointer text-center transition"
              >
                {lang === "es" ? "Entrar" : "Login"}
              </button>
            </div>
          </form>

          <div className="text-center mt-6 text-[9px] text-gray-500 tracking-wider">
            Imagine Real Estate & Property Management &copy; 2026
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#02140f] border border-[#d4af37]/30 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-[#032219] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="text-[#d4af37]" size={28} />
            <div>
              <h2 className="font-serif text-2xl text-pearl uppercase tracking-wider">Imagine Admin Portal</h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">CMS / Mini-CRM / Legal Tech / Content Factory</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {currentUser && (
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[10px] text-white font-sans font-medium">{currentUser.name}</span>
                <span className="text-[8px] text-[#d4af37] font-mono uppercase tracking-widest">{currentUser.role}</span>
              </div>
            )}
            {currentUser && (
              <button 
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-[9px] uppercase tracking-wider font-semibold font-sans transition cursor-pointer"
              >
                {lang === "es" ? "Salir" : "Logout"}
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2.5 rounded-full border border-white/15 text-white hover:bg-white hover:text-jungle transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Dynamic Alerts Banner */}
        {crmAlert && (
          <div className="bg-amber-500/25 border-b border-amber-500 text-amber-300 px-6 py-3.5 text-xs flex items-center gap-3 font-sans font-medium">
            <AlertTriangle size={16} />
            <span>{crmAlert}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-white/10 bg-[#011a14] px-4">
          {[
            { id: "inventory", label: lang === "es" ? "Inventario CRUD" : "CRUD Inventory", icon: Edit2 },
            { id: "crm", label: "Mini-CRM Pipeline", icon: Users },
            { id: "social", label: "Social Media Hub", icon: Sparkles },
            { id: "contracts", label: "Legal Contract Tech", icon: FileText },
            { id: "reports", label: "PM Financial Reports", icon: BarChart2 },
            { id: "settings", label: lang === "es" ? "Configuración" : "Settings", icon: Shield },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-[10px] md:text-xs font-sans uppercase tracking-widest font-semibold cursor-pointer border-b-2 transition-all ${
                  activeTab === tab.id 
                    ? "border-[#d4af37] text-[#d4af37] bg-white/5" 
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area with AnimatePresence Page Transitions */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#02100b]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === "inventory" && (
                <InventoryCRUD
                  properties={properties}
                  onAddProperty={handleAddPropertyWithMatching}
                  onUpdateProperty={onUpdateProperty}
                  onDeleteProperty={onDeleteProperty}
                  propertyTypes={propertyTypes}
                  lang={lang}
                  currentUser={currentUser}
                />
              )}

              {activeTab === "crm" && (
                <PipelineCRM
                  leads={leads}
                  properties={properties}
                  onUpdateLeads={handleUpdateLeadsList}
                  lang={lang}
                />
              )}

              {activeTab === "social" && (
                <SocialHub
                  properties={properties}
                  postingDates={postingDates}
                  onUpdatePostingDate={handleUpdatePostingDate}
                  lang={lang}
                />
              )}

              {activeTab === "contracts" && (
                <ContractAutomator
                  leads={leads}
                  properties={properties}
                  lang={lang}
                />
              )}

              {activeTab === "reports" && (
                <FinancialReports
                  properties={properties}
                  lang={lang}
                />
              )}

              {activeTab === "settings" && (
                <SettingsTab
                  collaborators={collaborators}
                  currentUser={currentUser}
                  onUpdateCollaborators={handleUpdateCollaborators}
                  onUpdateCurrentUser={setCurrentUser}
                  propertyTypes={propertyTypes}
                  onUpdatePropertyTypes={onUpdatePropertyTypes}
                  lang={lang}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
