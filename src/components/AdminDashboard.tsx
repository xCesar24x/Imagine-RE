"use client";

import { useState, useEffect, useMemo, type FormEvent } from "react";
import { 
  X, Plus, Trash2, Edit2, Check, ArrowRight, ArrowLeft, 
  Download, Send, MessageCircle, AlertTriangle, FileText, 
  Sparkles, Calendar, DollarSign, Users, Shield, Copy, RefreshCw, BarChart2
} from "lucide-react";
import { Property, PROVINCE_REGIONS } from "@/constants/properties";

interface AdminDashboardProps {
  properties: Property[];
  onAddProperty: (p: Property) => void;
  onUpdateProperty: (p: Property) => void;
  onDeleteProperty: (id: string) => void;
  lang: "en" | "es";
  onClose: () => void;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  budgetRange: string;
  financing: string;
  horizon: string;
  motivation: string;
  wishlistPropertyIds: string[];
  status: "Lead Nuevo" | "En Contacto" | "Discovery Tour Programado" | "Propuesta/Negociación" | "Cierre Exitoso / Perdido";
  tourDates?: string;
  tourPeople?: number;
  tourLodging?: boolean;
  tourLodgingPref?: string;
  notes: string[];
  lastInteractionDate: string; // ISO String
}

export default function AdminDashboard({
  properties,
  onAddProperty,
  onUpdateProperty,
  onDeleteProperty,
  lang,
  onClose
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"inventory" | "crm" | "social" | "contracts" | "reports">("inventory");

  // --- CRUD State ---
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [crudForm, setCrudForm] = useState({
    name: "",
    location: "",
    price: 0,
    sqft: 0,
    suites: 0,
    vibeTags: "",
    description: "",
    descriptionEs: "",
    nameEs: "",
    type: "Casa" as Property["type"],
    segment: "Luxury" as Property["segment"],
    province: "San José" as Property["province"],
    lifestyle: "Naturaleza" as Property["lifestyle"],
    status: "Disponible" as Property["status"],
    approxLocation: "",
    elevationM: 100,
    airportDistKm: 50,
    airportTimeMin: 60,
    closestCity: "",
    cityDistKm: 5,
    medicalDistMin: 15,
    hasFiberOptic: true,
    hasStarlink: false,
    image: "/images/jungle.png"
  });

  // Helper selectors for geography CRUD
  const activeProvinceRegions = useMemo(() => {
    return PROVINCE_REGIONS[crudForm.province] || [];
  }, [crudForm.province]);

  const isCustomLocation = useMemo(() => {
    return crudForm.location !== "" && !activeProvinceRegions.includes(crudForm.location);
  }, [crudForm.location, activeProvinceRegions]);

  // Bilingual tab state and upload logs state
  const [formLangTab, setFormLangTab] = useState<"en" | "es">("en");
  const [uploadLogs, setUploadLogs] = useState<string[]>([]);

  const handleSimulatedUpload = (fileName: string) => {
    setUploadLogs([`[System] Iniciando carga de archivo: ${fileName}...`]);
    
    setTimeout(() => {
      setUploadLogs(prev => [...prev, `[System] Analizando dimensiones y espacio de color...`]);
    }, 800);
    
    setTimeout(() => {
      setUploadLogs(prev => [...prev, `[System] Optimizando imagen y comprimiendo a WebP (Calidad: 82%)...`]);
    }, 1600);
    
    setTimeout(() => {
      const reducedSize = Math.floor(Math.random() * 80 + 10);
      setUploadLogs(prev => [...prev, `[System] ¡Conversión completa! Archivo comprimido un ${reducedSize}% sin pérdida visible.`]);
    }, 2400);

    setTimeout(() => {
      const mockWebpUrl = `/images/${fileName.split(".")[0]}.webp`;
      setUploadLogs(prev => [...prev, `[System] Cargado exitosamente al Media Vault: ${mockWebpUrl}`]);
      setCrudForm(prev => ({ ...prev, image: mockWebpUrl }));
    }, 3200);
  };

  // --- CRM State ---
  const [leads, setLeeds] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNote, setNewNote] = useState("");
  const [crmAlert, setCrmAlert] = useState<string | null>(null);

  // --- Social Hub State ---
  const [postingDates, setPostingDates] = useState<Record<string, string>>({}); // propId -> Date ISO
  const [selectedPropForSocial, setSelectedPropForSocial] = useState<string>("");
  const [generatedCopy, setGeneratedCopy] = useState({ ig: "", fb: "" });
  const [showCopySection, setShowCopySection] = useState(false);

  // --- Legal Tech State ---
  const [selectedContractLead, setSelectedContractLead] = useState<string>("");
  const [selectedContractProp, setSelectedContractProp] = useState<string>("");
  const [contractType, setContractType] = useState<"pm" | "exclusive" | "commission">("pm");
  const [generatedContractHtml, setGeneratedContractHtml] = useState<string>("");

  // --- Financial State ---
  const [selectedReportProp, setSelectedReportProp] = useState<string>("");
  const [reportOcupancyRate, setReportOcupancyRate] = useState<number>(75);
  const [reportCleaningFee, setReportCleaningFee] = useState<number>(450);
  const [reportMaintenanceFee, setReportMaintenanceFee] = useState<number>(300);
  const [reportUtilities, setReportUtilities] = useState<number>(620);
  const [generatedReport, setGeneratedReport] = useState<any | null>(null);

  // Initialize CRM Leads & Social Dates
  useEffect(() => {
    // Seed initial leads if not present
    const storedLeads = localStorage.getItem("imagine_leads");
    if (storedLeads) {
      setLeeds(JSON.parse(storedLeads));
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
          wishlistPropertyIds: ["villa-morpho", "quepos-zenith"],
          status: "Discovery Tour Programado",
          tourDates: "2026-07-10 to 2026-07-15",
          tourPeople: 4,
          tourLodging: true,
          tourLodgingPref: "Luxury boutique hotel",
          notes: ["Client is highly interested in oceanfront sunset properties.", "Requires helicopter landing pad access verification."],
          lastInteractionDate: new Date().toISOString()
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
          wishlistPropertyIds: ["cloud-forest", "nosara-flow"],
          status: "Lead Nuevo",
          notes: ["Prefers mountain or cloud forest properties with fiber optic connection."],
          lastInteractionDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() // 6 days ago (triggers warning)
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
          wishlistPropertyIds: ["guanacaste-gold", "papagayo-point"],
          status: "Propuesta/Negociación",
          tourDates: "2026-06-25 to 2026-06-30",
          tourPeople: 2,
          tourLodging: true,
          tourLodgingPref: "High-end resort suite",
          notes: ["Expatriate looking for high ROI options in Peninsula Papagayo.", "Requested detailed iCal calendars of active listings."],
          lastInteractionDate: new Date().toISOString()
        }
      ];
      setLeeds(initialLeads);
      localStorage.setItem("imagine_leads", JSON.stringify(initialLeads));
    }

    // Seed posting tracker dates
    const storedPostings = localStorage.getItem("imagine_posting_dates");
    if (storedPostings) {
      setPostingDates(JSON.parse(storedPostings));
    } else {
      const initialPostings: Record<string, string> = {
        "villa-morpho": new Date().toISOString(),
        "obsidian-canopy": new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        "quepos-zenith": new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago (yellow)
        "guanacaste-gold": new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days ago (red)
      };
      setPostingDates(initialPostings);
      localStorage.setItem("imagine_posting_dates", JSON.stringify(initialPostings));
    }
  }, []);

  const saveLeadsToStorage = (updatedLeads: Lead[]) => {
    setLeeds(updatedLeads);
    localStorage.setItem("imagine_leads", JSON.stringify(updatedLeads));
  };

  // --- CRUD Functions ---
  const handleCrudSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formattedTags = crudForm.vibeTags.split(",").map(t => t.trim()).filter(Boolean);

    const propertyData: Property = {
      id: editingPropertyId || `prop-${Date.now()}`,
      name: crudForm.name,
      location: crudForm.location,
      price: Number(crudForm.price),
      sqft: Number(crudForm.sqft),
      suites: Number(crudForm.suites),
      vibeTags: formattedTags,
      description: crudForm.description,
      image: crudForm.image,
      panorama: "/panoramas/default.jpg",
      type: crudForm.type,
      segment: crudForm.segment,
      province: crudForm.province,
      lifestyle: crudForm.lifestyle,
      status: crudForm.status,
      approxLocation: crudForm.approxLocation,
      elevationM: Number(crudForm.elevationM),
      airportDistKm: Number(crudForm.airportDistKm),
      airportTimeMin: Number(crudForm.airportTimeMin),
      closestCity: crudForm.closestCity,
      cityDistKm: Number(crudForm.cityDistKm),
      medicalDistMin: Number(crudForm.medicalDistMin),
      hasFiberOptic: crudForm.hasFiberOptic,
      hasStarlink: crudForm.hasStarlink
    };

    if (editingPropertyId) {
      onUpdateProperty(propertyData);
    } else {
      onAddProperty(propertyData);
      // Property Matching Cruce Inteligente
      checkPropertyMatching(propertyData);
    }

    // Reset Form
    setEditingPropertyId(null);
    setCrudForm({
      name: "", location: "", price: 0, sqft: 0, suites: 0, vibeTags: "",
      description: "", descriptionEs: "", nameEs: "", type: "Casa", segment: "Luxury", province: "San José", lifestyle: "Naturaleza",
      status: "Disponible", approxLocation: "", elevationM: 100, airportDistKm: 50,
      airportTimeMin: 60, closestCity: "", cityDistKm: 5, medicalDistMin: 15,
      hasFiberOptic: true, hasStarlink: false, image: "/images/jungle.png"
    });
  };

  const handleEditClick = (p: Property) => {
    setEditingPropertyId(p.id);
    setCrudForm({
      name: p.name,
      location: p.location,
      price: p.price,
      sqft: p.sqft,
      suites: p.suites,
      vibeTags: p.vibeTags.join(", "),
      description: p.description,
      descriptionEs: p.description, // Simple mapping for mockup
      nameEs: p.name,
      type: p.type,
      segment: p.segment,
      province: p.province || "San José",
      lifestyle: p.lifestyle,
      status: p.status,
      approxLocation: p.approxLocation,
      elevationM: p.elevationM || 100,
      airportDistKm: p.airportDistKm || 50,
      airportTimeMin: p.airportTimeMin || 60,
      closestCity: p.closestCity || "",
      cityDistKm: p.cityDistKm || 5,
      medicalDistMin: p.medicalDistMin || 15,
      hasFiberOptic: p.hasFiberOptic ?? true,
      hasStarlink: p.hasStarlink ?? false,
      image: p.image
    });
  };

  // --- CRM Kanban Functions ---
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
    saveLeadsToStorage(updated);
    // Sync selected lead view
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(updated.find(u => u.id === leadId) || null);
    }
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
    saveLeadsToStorage(updated);
    setSelectedLead(updated.find(u => u.id === selectedLead.id) || null);
    setNewNote("");
  };

  // Cruce Inteligente (Property Matching)
  const checkPropertyMatching = (newProp: Property) => {
    const matches = leads.filter(l => {
      // Budget matching
      let budgetLimit = 999999999;
      if (l.budgetRange.includes("Under 500K")) budgetLimit = 500000;
      else if (l.budgetRange.includes("500K - 1.5M")) budgetLimit = 1500000;
      else if (l.budgetRange.includes("1.5M - 5M")) budgetLimit = 5000000;
      
      const budgetMatched = newProp.price <= budgetLimit;
      const typeMatched = true; // Simple matching
      
      return budgetMatched && typeMatched;
    });

    if (matches.length > 0) {
      setCrmAlert(`⚠️ CRUCE INTELIGENTE: ¡La nueva propiedad "${newProp.name}" coincide con el perfil e interés de ${matches.map(m => m.name).join(", ")}!`);
      setTimeout(() => setCrmAlert(null), 10000);
    }
  };

  // Inactivity calculator (Semaphore warning)
  const isLeadInactive = (isoString: string) => {
    const lastDate = new Date(isoString);
    const diffTime = Math.abs(Date.now() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 5; // Inactive if no update for more than 5 days
  };

  // --- Social Media Hub Functions ---
  const handleUpdatePostedDate = (id: string) => {
    const updated = {
      ...postingDates,
      [id]: new Date().toISOString()
    };
    setPostingDates(updated);
    localStorage.setItem("imagine_posting_dates", JSON.stringify(updated));
  };

  const getPostStatusColor = (isoString?: string) => {
    if (!isoString) return "bg-rose-600 animate-pulse"; // Red (Never posted)
    const diff = Date.now() - new Date(isoString).getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    if (days >= 14) return "bg-rose-600 animate-pulse"; // Red
    if (days >= 7) return "bg-amber-500"; // Yellow
    return "bg-emerald-500"; // Green
  };

  const generateSocialCopy = () => {
    const prop = properties.find(p => p.id === selectedPropForSocial);
    if (!prop) return;

    // Emotional Copy (IG/TikTok)
    const igCopy = `✨ imagine RE | Lifestyle & Nature 🌿\n\nDespertar rodeado de un bosque nuboso, escuchar el viento en el dosel de los árboles y respirar aire fresco a ${prop.elevationM} m.s.n.m. en ${prop.location}. ⛰️\n\n"${prop.name}" es más que una residencia, es un refugio para el alma. Su diseño abraza la naturaleza local con total armonía.\n\n📍 Ubicación Privada (Macro-área): ${prop.approxLocation}\n📲 ¿Listo para desconectarte del ruido urbano? Agenda tu Discovery Tour privado vía DM.\n\n#ImagineRE #CostaRicaLuxury #JungleVibe #MountainHideaway #EcoLuxury`;

    // Technical Copy (Facebook)
    const fbCopy = `💼 IMAGINE REAL ESTATE & PROPERTY MANAGEMENT | Informe de Inversión 📊\n\nPresentamos una oportunidad inmobiliaria premium de alta plusvalía en ${prop.location}.\n\n🏡 Propiedad: ${prop.name}\n💰 Precio de Lista: $${prop.price.toLocaleString("en-US")} USD\n📐 Área Construida: ${prop.sqft.toLocaleString("en-US")} sqft (${Math.round(prop.sqft * 0.092903).toLocaleString()} m²)\n🛏️ Distribución: ${prop.suites} Master Suites\n📡 Infraestructura: Conectividad de alta velocidad ${prop.hasFiberOptic ? "Fibra Óptica habilitada" : ""}${prop.hasStarlink ? " + Starlink disponible" : ""}\n✈️ Logística: A solo ${prop.airportDistKm} km (${prop.airportTimeMin} min) del Aeropuerto SJO.\n\nIdeal para portafolio de alquiler vacacional de alta rentabilidad con administración de propiedades integral por Imagine PM.\n\nContáctenos para verificar la viabilidad financiera e itinerarios privados.`;

    setGeneratedCopy({ ig: igCopy, fb: fbCopy });
    setShowCopySection(true);
  };

  // --- Legal Tech Contract generation ---
  const generateLegalContract = () => {
    const lead = leads.find(l => l.id === selectedContractLead);
    const prop = properties.find(p => p.id === selectedContractProp);
    if (!lead || !prop) return;

    let content = "";
    const dateStr = new Date().toLocaleDateString(lang === "es" ? "es-CR" : "en-US", { year: "numeric", month: "long", day: "numeric" });

    if (contractType === "pm") {
      content = `
        <div style="font-family: 'Playfair Display', serif; padding: 40px; color: #02140f; background: #fff; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #02140f; font-size: 24px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 2px;">CONTRATO DE ADMINISTRACIÓN DE PROPIEDADES</h1>
            <p style="color: #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 3px;">IMAGINE REAL ESTATE & PROPERTY MANAGEMENT</p>
          </div>
          
          <p>En la ciudad de San José, Costa Rica, al día <strong>${dateStr}</strong>, se celebra el presente contrato entre:</p>
          <p>Por una parte, <strong>IMAGINE S.A.</strong> (en adelante el "Administrador"), y por la otra, el Sr./Sra. <strong>${lead.name}</strong>, titular del correo electrónico <strong>${lead.email}</strong> y teléfono <strong>${lead.phone}</strong> (en adelante el "Propietario").</p>
          
          <h3 style="color: #02140f; margin-top: 30px;">CLÁUSULA PRIMERA: OBJETO DEL CONTRATO</h3>
          <p>El Propietario entrega en administración exclusiva al Administrador la propiedad denominada <strong>"${prop.name}"</strong>, ubicada en <strong>${prop.location} (${prop.approxLocation})</strong>, para su gestión hotelera, mercadeo digital y mantenimiento integral.</p>
          
          <h3 style="color: #02140f; margin-top: 30px;">CLÁUSULA SEGUNDA: COMISIÓN Y RENDIMIENTOS</h3>
          <p>El Administrador percibirá una comisión de gestión correspondiente al <strong>15% (quince por ciento)</strong> sobre los ingresos brutos generados por concepto de alquiler de la propiedad en plataformas autorizadas (Airbnb, Booking y canal directo).</p>
          
          <h3 style="color: #02140f; margin-top: 30px;">CLÁUSULA TERCERA: SERVICIOS CONCIERGE INCLUIDOS</h3>
          <p>El contrato incluye limpieza premium de entrada/salida, jardinería básica, mantenimiento de piscina, y atención concierge 24/7 para huéspedes VIP.</p>
          
          <div style="margin-top: 80px; display: flex; justify-content: space-between;">
            <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px;">
              <p><strong>IMAGINE S.A.</strong><br/>Administrador Representante</p>
            </div>
            <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px;">
              <p><strong>${lead.name}</strong><br/>Propietario / Cliente</p>
            </div>
          </div>
        </div>
      `;
    } else if (contractType === "exclusive") {
      content = `
        <div style="font-family: 'Playfair Display', serif; padding: 40px; color: #02140f; background: #fff; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #02140f; font-size: 24px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 2px;">CONTRATO DE EXCLUSIVIDAD DE CORRETAJE INMOBILIARIO</h1>
            <p style="color: #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 3px;">IMAGINE REAL ESTATE & PROPERTY MANAGEMENT</p>
          </div>
          
          <p>En Costa Rica, al día <strong>${dateStr}</strong>, se suscribe el presente acuerdo entre <strong>IMAGINE S.A.</strong> y el propietario <strong>${lead.name}</strong> para la promoción y venta en exclusiva de la propiedad:</p>
          <p><strong>Nombre:</strong> ${prop.name}<br/><strong>Ubicación:</strong> ${prop.location}<br/><strong>Valor de Salida (USD):</strong> $${prop.price.toLocaleString("en-US")} USD</p>
          
          <h3 style="color: #02140f; margin-top: 30px;">CLÁUSULA PRIMERA: EXCLUSIVIDAD</h3>
          <p>El Propietario concede a IMAGINE S.A. el derecho exclusivo para publicitar, mostrar y negociar la venta de la propiedad por un período de doce (12) meses naturales a partir de la firma de este documento.</p>
          
          <h3 style="color: #02140f; margin-top: 30px;">CLÁUSULA SEGUNDA: HONORARIOS DE CORRETAJE</h3>
          <p>En caso de concretarse la venta de la propiedad, los honorarios correspondientes al Corredor serán del <strong>6% (seis por ciento) + IVA</strong> sobre el precio final de venta pactado.</p>
          
          <div style="margin-top: 80px; display: flex; justify-content: space-between;">
            <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px;">
              <p>IMAGINE S.A.</p>
            </div>
            <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px;">
              <p>${lead.name}</p>
            </div>
          </div>
        </div>
      `;
    } else {
      content = `
        <div style="font-family: 'Playfair Display', serif; padding: 40px; color: #02140f; background: #fff; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #02140f; font-size: 24px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 2px;">ACUERDO DE PAGO DE COMISIÓN DE RE</h1>
            <p style="color: #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 3px;">IMAGINE REAL ESTATE & PROPERTY MANAGEMENT</p>
          </div>
          
          <p>Este documento formaliza el acuerdo de comisión para la promoción de <strong>${prop.name}</strong> al día <strong>${dateStr}</strong>.</p>
          <p>Se acuerda que el comisionista recibirá el <strong>3% (tres por ciento)</strong> del valor de publicación / intermediación de venta en el mercado inmobiliario.</p>
          
          <div style="margin-top: 80px; display: flex; justify-content: space-between;">
            <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px;">
              <p>IMAGINE S.A.</p>
            </div>
            <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px;">
              <p>Firma del Propietario</p>
            </div>
          </div>
        </div>
      `;
    }

    setGeneratedContractHtml(content);
  };

  const handlePrintContract = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Contrato Imagine RE</title>
          <style>
            body { font-family: 'Georgia', serif; padding: 50px; background: white; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          ${generatedContractHtml}
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // --- Financial reports logic ---
  const generateFinancialReport = () => {
    const prop = properties.find(p => p.id === selectedReportProp);
    if (!prop) return;

    // Simulate Airbnb iCal occupancies (e.g. 75% rate on 365 days = 273 nights)
    const nights = Math.round(365 * (reportOcupancyRate / 100));
    const averageNightlyPrice = Math.round(prop.price * 0.0001); // Mock rent rate: $550/night for $5.5M house
    const grossIncome = nights * averageNightlyPrice;
    
    // Fees
    const pmCommission = Math.round(grossIncome * 0.15);
    const cleaningTotal = Math.round((nights / 4) * reportCleaningFee); // Average stay of 4 nights
    const maintenanceTotal = reportMaintenanceFee * 12;
    const utilitiesTotal = reportUtilities * 12;
    const totalExpenses = pmCommission + cleaningTotal + maintenanceTotal + utilitiesTotal;
    const netRevenue = grossIncome - totalExpenses;

    setGeneratedReport({
      property: prop,
      nights,
      averageNightlyPrice,
      grossIncome,
      pmCommission,
      cleaningTotal,
      maintenanceTotal,
      utilitiesTotal,
      totalExpenses,
      netRevenue
    });
  };

  const triggerWhatsAppReport = () => {
    if (!generatedReport) return;
    const message = `Hola de parte del equipo Imagine RE & PM. Le adjuntamos el estado de cuenta financiero mensual de su propiedad "${generatedReport.property.name}".\n\nIngresos brutos: $${generatedReport.grossIncome.toLocaleString()} USD\nGastos operativos: $${generatedReport.totalExpenses.toLocaleString()} USD\nRetorno Neto: $${generatedReport.netRevenue.toLocaleString()} USD.\n\nEnviado vía Imagine PM Hub.`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

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
          <button 
            onClick={onClose}
            className="p-2.5 rounded-full border border-white/15 text-white hover:bg-white hover:text-jungle transition cursor-pointer"
          >
            <X size={18} />
          </button>
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

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#02100b]">
          {/* TAB 1: Inventory CRUD */}
          {activeTab === "inventory" && (
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              {/* Form */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-md">
                <h3 className="font-serif text-lg text-pearl mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
                  <Plus size={18} className="text-[#d4af37]" />
                  {editingPropertyId ? (lang === "es" ? "Editar Propiedad" : "Edit Property") : (lang === "es" ? "Agregar Nueva Propiedad" : "Add New Property")}
                </h3>
                <form onSubmit={handleCrudSubmit} className="space-y-4">
                  {/* Language Tab Switcher */}
                  <div className="flex border-b border-white/10 mb-4 bg-white/5 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setFormLangTab("en")}
                      className={`flex-1 py-2 text-[10px] font-sans uppercase tracking-wider font-semibold rounded-lg transition ${
                        formLangTab === "en" ? "bg-sunset text-jungle font-bold" : "text-gray-400 hover:text-pearl"
                      }`}
                    >
                      English Texts
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormLangTab("es")}
                      className={`flex-1 py-2 text-[10px] font-sans uppercase tracking-wider font-semibold rounded-lg transition ${
                        formLangTab === "es" ? "bg-sunset text-jungle font-bold" : "text-gray-400 hover:text-pearl"
                      }`}
                    >
                      Textos en Español
                    </button>
                  </div>

                  {formLangTab === "en" ? (
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Name (English)</label>
                      <input 
                        value={crudForm.name} 
                        onChange={e => setCrudForm({ ...crudForm, name: e.target.value })} 
                        required 
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]" 
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Nombre (Español)</label>
                      <input 
                        value={crudForm.nameEs} 
                        onChange={e => setCrudForm({ ...crudForm, nameEs: e.target.value })} 
                        required 
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]" 
                      />
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Price (USD)</label>
                      <input 
                        type="number"
                        value={crudForm.price || ""} 
                        onChange={e => setCrudForm({ ...crudForm, price: Number(e.target.value) })} 
                        required 
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]" 
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Size (sqft)</label>
                      <input 
                        type="number"
                        value={crudForm.sqft || ""} 
                        onChange={e => setCrudForm({ ...crudForm, sqft: Number(e.target.value) })} 
                        required 
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]" 
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Suites</label>
                      <input 
                        type="number"
                        value={crudForm.suites || ""} 
                        onChange={e => setCrudForm({ ...crudForm, suites: Number(e.target.value) })} 
                        required 
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]" 
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-4">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Type</label>
                      <select 
                        value={crudForm.type}
                        onChange={e => setCrudForm({ ...crudForm, type: e.target.value as any })}
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]"
                      >
                        <option value="Casa">Casa</option>
                        <option value="Cabaña">Cabaña</option>
                        <option value="Quinta">Quinta</option>
                        <option value="Lote">Lote</option>
                        <option value="Quinta de Descanso">Quinta de Descanso</option>
                        <option value="Terreno de Montaña">Terreno de Montaña</option>
                        <option value="Villa Exclusiva">Villa Exclusiva</option>
                        <option value="Edificio">Edificio Comercial</option>
                        <option value="Bodega">Bodega / Local</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Segment</label>
                      <select 
                        value={crudForm.segment}
                        onChange={e => setCrudForm({ ...crudForm, segment: e.target.value as any })}
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]"
                      >
                        <option value="Luxury">Signature Luxury</option>
                        <option value="Standard">Standard Residential</option>
                        <option value="Commercial">Commercial & Investment</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Vibe / Lifestyle</label>
                      <select 
                        value={crudForm.lifestyle}
                        onChange={e => setCrudForm({ ...crudForm, lifestyle: e.target.value as any })}
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]"
                      >
                        <option value="Naturaleza">Naturaleza / Campo</option>
                        <option value="Ciudad">Ciudad / Centro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Status</label>
                      <select 
                        value={crudForm.status}
                        onChange={e => setCrudForm({ ...crudForm, status: e.target.value as any })}
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]"
                      >
                        <option value="Disponible">Disponible</option>
                        <option value="Opcionada">Opcionada</option>
                        <option value="Vendida">Vendida</option>
                        <option value="Destacada">Destacada</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Province (CR)</label>
                      <select 
                        value={crudForm.province}
                        onChange={e => setCrudForm({ ...crudForm, province: e.target.value as any })}
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]"
                      >
                        <option value="San José">San José</option>
                        <option value="Alajuela">Alajuela</option>
                        <option value="Cartago">Cartago</option>
                        <option value="Heredia">Heredia</option>
                        <option value="Guanacaste">Guanacaste</option>
                        <option value="Puntarenas">Puntarenas</option>
                        <option value="Limón">Limón</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">General Region / Location</label>
                      <select 
                        value={isCustomLocation ? "custom" : crudForm.location}
                        onChange={e => {
                          const val = e.target.value;
                          if (val === "custom") {
                            setCrudForm(prev => ({ ...prev, location: "" }));
                          } else {
                            setCrudForm(prev => ({ ...prev, location: val }));
                          }
                        }}
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37] mb-2"
                      >
                        <option value="">Seleccionar Región / Cantón</option>
                        {activeProvinceRegions.map(reg => (
                          <option key={reg} value={reg}>{reg}</option>
                        ))}
                        <option value="custom">Otro (Ingresar manualmente)...</option>
                      </select>
                      
                      {(isCustomLocation || crudForm.location === "" || !activeProvinceRegions.includes(crudForm.location)) && (
                        <input 
                          value={crudForm.location} 
                          onChange={e => setCrudForm({ ...crudForm, location: e.target.value })} 
                          required 
                          placeholder="e.g. Nosara"
                          className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]" 
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Approx. Coordinates Location (Security-First)</label>
                      <input 
                        value={crudForm.approxLocation} 
                        onChange={e => setCrudForm({ ...crudForm, approxLocation: e.target.value })} 
                        required 
                        placeholder="e.g. Playa Guiones, Nosara"
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]" 
                      />
                    </div>
                  </div>

                  {/* Security-First Metrics fields */}
                  <div className="grid gap-4 sm:grid-cols-4">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Altitude (m.s.n.m.)</label>
                      <input 
                        type="number"
                        value={crudForm.elevationM} 
                        onChange={e => setCrudForm({ ...crudForm, elevationM: Number(e.target.value) })} 
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]" 
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">SJO Airport (km)</label>
                      <input 
                        type="number"
                        value={crudForm.airportDistKm} 
                        onChange={e => setCrudForm({ ...crudForm, airportDistKm: Number(e.target.value) })} 
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]" 
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Airport Time (min)</label>
                      <input 
                        type="number"
                        value={crudForm.airportTimeMin} 
                        onChange={e => setCrudForm({ ...crudForm, airportTimeMin: Number(e.target.value) })} 
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]" 
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Medical Care (min)</label>
                      <input 
                        type="number"
                        value={crudForm.medicalDistMin} 
                        onChange={e => setCrudForm({ ...crudForm, medicalDistMin: Number(e.target.value) })} 
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]" 
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Closest City Name</label>
                      <input 
                        value={crudForm.closestCity} 
                        onChange={e => setCrudForm({ ...crudForm, closestCity: e.target.value })} 
                        placeholder="e.g. Nicoya"
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]" 
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">City Distance (km)</label>
                      <input 
                        type="number"
                        value={crudForm.cityDistKm} 
                        onChange={e => setCrudForm({ ...crudForm, cityDistKm: Number(e.target.value) })} 
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]" 
                      />
                    </div>
                    <div className="flex gap-4 items-center h-full pt-4">
                      <label className="flex items-center gap-2 text-xs text-pearl cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={crudForm.hasFiberOptic}
                          onChange={e => setCrudForm({ ...crudForm, hasFiberOptic: e.target.checked })}
                          className="accent-[#d4af37]"
                        />
                        <span>Fibra Óptica</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-pearl cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={crudForm.hasStarlink}
                          onChange={e => setCrudForm({ ...crudForm, hasStarlink: e.target.checked })}
                          className="accent-[#d4af37]"
                        />
                        <span>Starlink</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Vibe Tags (Comma separated)</label>
                    <input 
                      value={crudForm.vibeTags} 
                      onChange={e => setCrudForm({ ...crudForm, vibeTags: e.target.value })} 
                      placeholder="Oceanfront, Panoramic, Smart Home, Eco-Luxury"
                      className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]" 
                    />
                  </div>

                  {formLangTab === "en" ? (
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Description (English)</label>
                      <textarea 
                        value={crudForm.description} 
                        onChange={e => setCrudForm({ ...crudForm, description: e.target.value })} 
                        required 
                        rows={3}
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]" 
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Descripción (Español)</label>
                      <textarea 
                        value={crudForm.descriptionEs} 
                        onChange={e => setCrudForm({ ...crudForm, descriptionEs: e.target.value })} 
                        required 
                        rows={3}
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]" 
                      />
                    </div>
                  )}

                  {/* Simulated Image Drag and Drop */}
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Property Image URL / Drag & Drop</label>
                    <input 
                      value={crudForm.image} 
                      onChange={e => setCrudForm({ ...crudForm, image: e.target.value })} 
                      className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]" 
                    />
                    <div 
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          handleSimulatedUpload(file.name);
                        }
                      }}
                      onClick={() => {
                        const mockName = `luxury_villa_${Date.now().toString().slice(-4)}.jpg`;
                        handleSimulatedUpload(mockName);
                      }}
                      className="mt-2 p-6 border-2 border-dashed border-[#d4af37]/30 hover:border-[#d4af37]/65 rounded-xl bg-white/5 text-center text-[10px] text-gray-300 transition duration-200 cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                      <span>Drag & Drop files here or click to simulate auto-compression WebP upload</span>
                      <span className="text-[9px] text-[#d4af37]/75 font-mono">Format: WebP auto-optimized (under 2s loaded)</span>
                    </div>

                    {uploadLogs.length > 0 && (
                      <div className="mt-3 p-3 bg-black/60 rounded-xl border border-white/10 text-[9px] font-mono text-emerald-400 space-y-1 max-h-[120px] overflow-y-auto">
                        {uploadLogs.map((log, i) => (
                          <div key={i}>{log}</div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-white/15">
                    {editingPropertyId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPropertyId(null);
                          setCrudForm({
                            name: "", location: "", price: 0, sqft: 0, suites: 0, vibeTags: "",
                            description: "", descriptionEs: "", nameEs: "", type: "Casa", segment: "Luxury", province: "San José", lifestyle: "Naturaleza",
                            status: "Disponible", approxLocation: "", elevationM: 100, airportDistKm: 50,
                            airportTimeMin: 60, closestCity: "", cityDistKm: 5, medicalDistMin: 15,
                            hasFiberOptic: true, hasStarlink: false, image: "/images/jungle.png"
                          });
                        }}
                        className="flex-1 border border-white/10 hover:border-rose-400 text-pearl text-xs py-3 rounded-xl uppercase tracking-widest font-semibold cursor-pointer text-center"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-1 bg-[#d4af37] text-[#02140f] hover:bg-white text-xs py-3 rounded-xl uppercase tracking-widest font-bold cursor-pointer text-center"
                    >
                      {editingPropertyId ? "Update Property" : "Create Property"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Listings table */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col h-full overflow-hidden">
                <h3 className="font-serif text-lg text-pearl mb-6 border-b border-white/10 pb-3">
                  {lang === "es" ? "Propiedades en Inventario" : "Active Properties Catalog"} ({properties.length})
                </h3>
                <div className="space-y-4 overflow-y-auto max-h-[550px] pr-2">
                  {properties.map(p => (
                    <div key={p.id} className="flex gap-4 p-4 border border-white/5 bg-[#011a14] rounded-2xl items-center hover:border-[#d4af37]/30 transition">
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                        <img src={p.image} alt={p.name} className="object-cover w-full h-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-sm text-pearl truncate font-semibold">{p.name}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[8px] uppercase font-sans border border-white/15 bg-white/5 font-semibold text-[#d4af37]">{p.type}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">{p.location}</p>
                        <p className="text-xs text-white mt-1.5 font-bold font-sans">${p.price.toLocaleString()} USD</p>
                        
                        {/* Status Toggle Row */}
                        <div className="flex flex-wrap gap-1 mt-2 border-t border-white/5 pt-2">
                          {(["Disponible", "Opcionada", "Vendida", "Destacada"] as const).map(status => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => {
                                const updated = { ...p, status };
                                onUpdateProperty(updated);
                              }}
                              className={`px-2 py-0.5 rounded-full text-[7.5px] font-sans uppercase tracking-wider border transition cursor-pointer font-semibold ${
                                p.status === status
                                  ? "bg-[#d4af37] border-[#d4af37] text-[#02100b]"
                                  : "bg-transparent border-white/10 text-gray-400 hover:text-white"
                              }`}
                            >
                              {status === "Disponible" ? (lang === "es" ? "Disp" : "Avail") : 
                               status === "Opcionada" ? (lang === "es" ? "Opc" : "Pend") : 
                               status === "Vendida" ? (lang === "es" ? "Vend" : "Sold") : 
                               (lang === "es" ? "Dest" : "Feat")}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => handleEditClick(p)}
                          className="p-2 rounded-lg border border-white/10 hover:border-[#d4af37] text-gray-400 hover:text-[#d4af37] transition cursor-pointer"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button 
                          onClick={() => onDeleteProperty(p.id)}
                          className="p-2 rounded-lg border border-white/10 hover:border-rose-500 hover:bg-rose-500/10 text-gray-400 hover:text-rose-500 transition cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CRM */}
          {activeTab === "crm" && (
            <div className="space-y-8">
              {/* Kanban board */}
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
                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping" title="Inactive lead! requires update" />
                              )}
                              <h5 className="font-serif text-xs text-pearl font-semibold truncate">{l.name}</h5>
                              <p className="text-[10px] text-gray-400 mt-1 truncate">{l.email}</p>
                              <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-white/5">
                                <span className="text-[9px] font-sans font-medium text-[#d4af37]">${l.budgetRange}</span>
                                <div className="flex gap-1">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); moveLeadStatus(l.id, "prev"); }}
                                    className="p-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer"
                                  >
                                    <ArrowLeft size={10} />
                                  </button>
                                  <button 
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
              {selectedLead && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 grid gap-8 lg:grid-cols-2">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start border-b border-white/10 pb-4">
                      <div>
                        <h4 className="font-serif text-xl text-pearl font-bold">{selectedLead.name}</h4>
                        <p className="text-[10px] text-sunset font-sans mt-0.5 uppercase tracking-widest">{selectedLead.status}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedLead(null)}
                        className="p-1.5 rounded-full border border-white/15 text-white hover:bg-white hover:text-jungle transition cursor-pointer"
                      >
                        <X size={13} />
                      </button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 text-xs font-sans">
                      <div>
                        <span className="text-gray-400 block mb-0.5">Email</span>
                        <a href={`mailto:${selectedLead.email}`} className="text-pearl hover:text-[#d4af37] transition font-medium">{selectedLead.email}</a>
                      </div>
                      <div>
                        <span className="text-gray-400 block mb-0.5">Teléfono</span>
                        <a href={`tel:${selectedLead.phone}`} className="text-pearl hover:text-[#d4af37] transition font-medium">{selectedLead.phone}</a>
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
                    </div>

                    {/* Wishlist item links */}
                    <div>
                      <h5 className="text-[10px] uppercase tracking-wider text-gray-400 mb-3">Saved Properties ({selectedLead.wishlistPropertyIds.length})</h5>
                      <div className="space-y-2">
                        {selectedLead.wishlistPropertyIds.map(pid => {
                          const p = properties.find(item => item.id === pid);
                          if (!p) return null;
                          return (
                            <div key={pid} className="flex items-center gap-3 p-2.5 rounded-xl border border-white/5 bg-[#01140f]">
                              <img src={p.image} className="w-10 h-10 object-cover rounded-lg border border-white/10" />
                              <div className="flex-1 min-w-0">
                                <h6 className="font-serif text-xs text-pearl truncate font-semibold">{p.name}</h6>
                                <p className="text-[9px] text-[#d4af37] truncate mt-0.5">${p.price.toLocaleString()} USD</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Discovery Tour Details if saved */}
                    {selectedLead.tourDates && (
                      <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5">
                        <h5 className="text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                          <Calendar size={13} />
                          Solicitud de Discovery Tour VIP
                        </h5>
                        <p className="text-xs text-pearl leading-relaxed">
                          <strong>Fechas solicitadas:</strong> {selectedLead.tourDates}<br/>
                          <strong>Pasajeros:</strong> {selectedLead.tourPeople} personas (Shuttle Hyundai Grand Starex)<br/>
                          <strong>Hospedaje coordinado:</strong> {selectedLead.tourLodging ? `Sí (${selectedLead.tourLodgingPref})` : "No solicitado"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* CRM Logs and Inactivity Alarms */}
                  <div className="flex flex-col border-l border-white/10 pl-6 h-full">
                    <h5 className="text-[10px] uppercase tracking-wider text-gray-400 mb-3">Admin CRM Interaction Logs</h5>
                    <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-[250px] pr-2">
                      {selectedLead.notes.map((note, idx) => (
                        <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs text-pearl leading-relaxed">
                          {note}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3 mt-auto">
                      <textarea
                        value={newNote}
                        onChange={e => setNewNote(e.target.value)}
                        placeholder="Log new interaction or notes..."
                        rows={2}
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]"
                      />
                      <button
                        onClick={addLeadNote}
                        className="w-full bg-[#d4af37] text-[#02140f] hover:bg-white text-xs py-2 rounded-xl uppercase tracking-widest font-bold cursor-pointer text-center"
                      >
                        Add CRM Log
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Social Media Hub */}
          {activeTab === "social" && (
            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
              {/* Table list */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
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
                          <p className="text-[9px] text-gray-400 mt-0.5">
                            Last posted: {postDate ? new Date(postDate).toLocaleDateString() : "Never posted"}
                          </p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUpdatePostedDate(p.id); }}
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
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
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
                            onClick={() => navigator.clipboard.writeText(generatedCopy.ig)}
                            className="p-1 rounded hover:bg-white/5 text-gray-400 hover:text-white cursor-pointer"
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
                            onClick={() => navigator.clipboard.writeText(generatedCopy.fb)}
                            className="p-1 rounded hover:bg-white/5 text-gray-400 hover:text-white cursor-pointer"
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
          )}

          {/* TAB 4: Legal Contracts */}
          {activeTab === "contracts" && (
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              {/* Form parameters */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="font-serif text-lg text-pearl mb-6 border-b border-white/10 pb-3">Legal Contract Automator</h3>
                  
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Select Client / Lead</label>
                    <div className="relative">
                      <select
                        value={selectedContractLead}
                        onChange={e => setSelectedContractLead(e.target.value)}
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl appearance-none pr-10 focus:outline-none focus:border-[#d4af37] cursor-pointer"
                      >
                        <option value="">-- Choose lead --</option>
                        {leads.map(l => (
                          <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#d4af37]" size={14} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Select Property</label>
                    <div className="relative">
                      <select
                        value={selectedContractProp}
                        onChange={e => setSelectedContractProp(e.target.value)}
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl appearance-none pr-10 focus:outline-none focus:border-[#d4af37] cursor-pointer"
                      >
                        <option value="">-- Choose property --</option>
                        {properties.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#d4af37]" size={14} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Contract Template Type</label>
                    <div className="relative">
                      <select
                        value={contractType}
                        onChange={e => setContractType(e.target.value as any)}
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl appearance-none pr-10 focus:outline-none focus:border-[#d4af37] cursor-pointer"
                      >
                        <option value="pm">Property Management Contract (PM)</option>
                        <option value="exclusive">Exclusividad de Corretaje</option>
                        <option value="commission">Comisión Venta Acuerdo</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#d4af37]" size={14} />
                    </div>
                  </div>
                </div>

                <button
                  onClick={generateLegalContract}
                  disabled={!selectedContractLead || !selectedContractProp}
                  className="w-full bg-[#d4af37] text-[#02140f] hover:bg-white text-xs py-3 rounded-xl uppercase tracking-widest font-bold cursor-pointer text-center disabled:opacity-50 disabled:pointer-events-none"
                >
                  Generate Contract
                </button>
              </div>

              {/* Preview and Export */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg text-pearl mb-6 border-b border-white/10 pb-3 flex items-center justify-between">
                    <span>PDF Print Template Preview</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">Branded Legal Documents</span>
                  </h3>
                  
                  {generatedContractHtml ? (
                    <div 
                      className="border border-white/10 rounded-xl overflow-hidden max-h-[400px] overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: generatedContractHtml }}
                    />
                  ) : (
                    <div className="py-24 text-center text-xs text-gray-400 font-light italic">
                      Fill parameters and click generate to review contract draft...
                    </div>
                  )}
                </div>

                {generatedContractHtml && (
                  <button
                    onClick={handlePrintContract}
                    className="w-full border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-jungle text-xs py-3 rounded-xl uppercase tracking-widest font-bold cursor-pointer text-center mt-6 flex items-center justify-center gap-2"
                  >
                    <Download size={14} />
                    Download Official contract PDF
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: Property Management financial reports */}
          {activeTab === "reports" && (
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              {/* Calculator settings */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="font-serif text-lg text-pearl mb-6 border-b border-white/10 pb-3">Financial Statement Architect</h3>
                  
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Property Select</label>
                    <div className="relative">
                      <select
                        value={selectedReportProp}
                        onChange={e => setSelectedReportProp(e.target.value)}
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl appearance-none pr-10 focus:outline-none focus:border-[#d4af37] cursor-pointer"
                      >
                        <option value="">-- Choose property --</option>
                        {properties.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#d4af37]" size={14} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Mock Occupancy Rate (%) via iCal</label>
                    <input 
                      type="number"
                      value={reportOcupancyRate}
                      onChange={e => setReportOcupancyRate(Number(e.target.value))}
                      className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Airbnb Cleaning Fee (USD)</label>
                    <input 
                      type="number"
                      value={reportCleaningFee}
                      onChange={e => setReportCleaningFee(Number(e.target.value))}
                      className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Maintenance (USD/mo)</label>
                      <input 
                        type="number"
                        value={reportMaintenanceFee}
                        onChange={e => setReportMaintenanceFee(Number(e.target.value))}
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Utilities (USD/mo)</label>
                      <input 
                        type="number"
                        value={reportUtilities}
                        onChange={e => setReportUtilities(Number(e.target.value))}
                        className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={generateFinancialReport}
                  disabled={!selectedReportProp}
                  className="w-full bg-[#d4af37] text-[#02140f] hover:bg-white text-xs py-3 rounded-xl uppercase tracking-widest font-bold cursor-pointer text-center disabled:opacity-50 disabled:pointer-events-none"
                >
                  Generate Financial Report
                </button>
              </div>

              {/* Statement sheet */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg text-pearl mb-6 border-b border-white/10 pb-3 flex items-center justify-between">
                    <span>Branded Financial Statement</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">Forest Green / Sunset Gold theme</span>
                  </h3>

                  {generatedReport ? (
                    <div id="print-financial-report" className="bg-[#02140f] border border-[#d4af37]/20 p-6 rounded-xl space-y-6 font-sans">
                      <div className="flex justify-between items-start border-b border-[#d4af37]/30 pb-4">
                        <div>
                          <h4 className="font-serif text-[#d4af37] text-base uppercase tracking-wider">{generatedReport.property.name}</h4>
                          <span className="text-[9px] text-gray-400 uppercase tracking-widest">iCal Calendar Unified Statement (Airbnb/Booking)</span>
                        </div>
                        <div className="text-right">
                          <span className="text-white text-sm font-semibold">{reportOcupancyRate}% Occupancy</span>
                          <span className="block text-[9px] text-gray-400">{generatedReport.nights} Rental Nights</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-pearl">
                          <span>Gross Rental Income (Est. avg $${generatedReport.averageNightlyPrice}/night)</span>
                          <span className="font-semibold text-emerald-400">+ $${generatedReport.grossIncome.toLocaleString()} USD</span>
                        </div>
                        <div className="border-t border-white/5 pt-2.5 space-y-1.5 text-[11px] text-gray-300">
                          <div className="flex justify-between">
                            <span>Imagine PM Management Fee (15%)</span>
                            <span>- $${generatedReport.pmCommission.toLocaleString()} USD</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cleaning & Turnover Costs</span>
                            <span>- $${generatedReport.cleaningTotal.toLocaleString()} USD</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Annual Property Maintenance</span>
                            <span>- $${generatedReport.maintenanceTotal.toLocaleString()} USD</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Water, electricity, internet utilities</span>
                            <span>- $${generatedReport.utilitiesTotal.toLocaleString()} USD</span>
                          </div>
                        </div>
                        <div className="border-t-2 border-[#d4af37]/30 pt-3 flex justify-between text-sm text-[#d4af37] font-bold">
                          <span>Net Owner Revenue Return</span>
                          <span>$${generatedReport.netRevenue.toLocaleString()} USD</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-24 text-center text-xs text-gray-400 font-light italic">
                      Generate report to view PM Statement...
                    </div>
                  )}
                </div>

                {generatedReport && (
                  <div className="flex gap-3 mt-6 border-t border-white/10 pt-6">
                    <button
                      onClick={() => {
                        const printWindow = window.open("", "_blank");
                        if (!printWindow) return;
                        printWindow.document.write(`
                          <html>
                            <head>
                              <title>PM Financial Report</title>
                              <style>
                                body { font-family: 'Georgia', serif; padding: 50px; background: white; }
                              </style>
                            </head>
                            <body>
                              ${document.getElementById("print-financial-report")?.innerHTML}
                              <script>
                                window.onload = function() { window.print(); }
                              </script>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                      }}
                      className="flex-1 border border-white/10 hover:border-sunset text-pearl text-xs py-3 rounded-xl uppercase tracking-widest font-semibold cursor-pointer text-center"
                    >
                      Print PDF
                    </button>
                    <button
                      onClick={triggerWhatsAppReport}
                      className="flex-1 bg-emerald-600 text-pearl hover:bg-emerald-500 text-xs py-3 rounded-xl uppercase tracking-widest font-bold cursor-pointer text-center flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle size={14} />
                      WhatsApp PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function ChevronDown({ className, size }: { className?: string; size?: number }) {
  return (
    <svg 
      className={className} 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
