"use client";

import { useState, useMemo, type FormEvent } from "react";
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp, Download, Check, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Property, PROVINCE_REGIONS, PropertyType, Region } from "@/constants/properties";

interface Collaborator {
  id: string;
  name: string;
  username: string;
  password: string;
  role: string;
}

interface InventoryCRUDProps {
  properties: Property[];
  onAddProperty: (p: Property) => void;
  onUpdateProperty: (p: Property) => void;
  onDeleteProperty: (id: string) => void;
  propertyTypes: PropertyType[];
  regions: Region[];
  lang: "en" | "es";
  currentUser: Collaborator | null;
}

export default function InventoryCRUD({
  properties,
  onAddProperty,
  onUpdateProperty,
  onDeleteProperty,
  propertyTypes,
  regions,
  lang,
  currentUser
}: InventoryCRUDProps) {
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [formLangTab, setFormLangTab] = useState<"en" | "es">("en");
  
  // Collapse state for each property specs in listing (key: property ID -> boolean)
  const [expandedPropId, setExpandedPropId] = useState<string | null>(null);

  // Simulated WebP progress states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadLogs, setUploadLogs] = useState<string[]>([]);

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
    image: "/images/jungle.png",
    fincaRegistryNum: "",
    catasterMapNum: ""
  });

  const activeProvinceRegions = useMemo(() => {
    return regions
      .filter(r => r.visible && r.province === crudForm.province)
      .map(r => r.name);
  }, [crudForm.province, regions]);

  const isCustomLocation = useMemo(() => {
    return crudForm.location !== "" && !activeProvinceRegions.includes(crudForm.location);
  }, [crudForm.location, activeProvinceRegions]);

  const nextRefCode = useMemo(() => {
    let maxNum = 0;
    properties.forEach(p => {
      if (p.refCode) {
        const match = p.refCode.match(/REF-(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      }
    });
    const nextNum = maxNum + 1;
    return `REF-${nextNum < 10 ? '0' + nextNum : nextNum}`;
  }, [properties]);

  const handleSimulatedUpload = (fileName: string) => {
    setIsUploading(true);
    setUploadProgress(10);
    setUploadLogs([`[System] Iniciando carga de archivo: ${fileName}...`]);

    const steps = [
      { progress: 35, log: "[System] Analizando dimensiones y espacio de color..." },
      { progress: 70, log: "[System] Optimizando imagen y comprimiendo a WebP (Calidad: 82%)..." },
      { progress: 100, log: "[System] ¡Conversión completa! Archivo comprimido un 64% sin pérdida visible." }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setUploadProgress(step.progress);
        setUploadLogs(prev => [...prev, step.log]);
        
        if (step.progress === 100) {
          setTimeout(() => {
            const mockWebpUrl = `/images/${fileName.split(".")[0]}.webp`;
            setUploadLogs(prev => [...prev, `[System] Cargado exitosamente al Media Vault: ${mockWebpUrl}`]);
            setCrudForm(prev => ({ ...prev, image: mockWebpUrl }));
            setIsUploading(false);
          }, 600);
        }
      }, (idx + 1) * 800);
    });
  };

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
      hasStarlink: crudForm.hasStarlink,
      nameEs: crudForm.nameEs,
      descriptionEs: crudForm.descriptionEs,
      fincaRegistryNum: crudForm.fincaRegistryNum,
      catasterMapNum: crudForm.catasterMapNum,
      refCode: editingPropertyId
        ? (properties.find(p => p.id === editingPropertyId)?.refCode || nextRefCode)
        : nextRefCode
    };

    if (editingPropertyId) {
      onUpdateProperty(propertyData);
    } else {
      onAddProperty(propertyData);
    }

    // Reset Form
    setEditingPropertyId(null);
    setCrudForm({
      name: "", location: "", price: 0, sqft: 0, suites: 0, vibeTags: "",
      description: "", descriptionEs: "", nameEs: "", type: "Casa", segment: "Luxury", province: "San José", lifestyle: "Naturaleza",
      status: "Disponible", approxLocation: "", elevationM: 100, airportDistKm: 50,
      airportTimeMin: 60, closestCity: "", cityDistKm: 5, medicalDistMin: 15,
      hasFiberOptic: true, hasStarlink: false, image: "/images/jungle.png",
      fincaRegistryNum: "", catasterMapNum: ""
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
      descriptionEs: p.descriptionEs || p.description,
      nameEs: p.nameEs || p.name,
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
      image: p.image,
      fincaRegistryNum: p.fincaRegistryNum || "",
      catasterMapNum: p.catasterMapNum || ""
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Form */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-md h-fit">
        <h3 className="font-serif text-lg text-pearl mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
          <Plus size={18} className="text-[#d4af37]" />
          {editingPropertyId ? (lang === "es" ? "Editar Propiedad" : "Edit Property") : (lang === "es" ? "Agregar Nueva Propiedad" : "Add New Property")}
        </h3>
        <form onSubmit={handleCrudSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">
                {lang === "es" ? "Código de Referencia" : "Reference Code"}
              </label>
              <input 
                type="text"
                disabled
                value={editingPropertyId ? (properties.find(p => p.id === editingPropertyId)?.refCode || "") : nextRefCode} 
                className="w-full bg-[#01140f]/60 border border-white/5 text-[#d4af37] font-semibold text-xs px-3.5 py-2.5 rounded-xl cursor-not-allowed font-mono" 
              />
            </div>
            
            <div className="flex flex-col justify-end">
              <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">{lang === "es" ? "Idioma de Textos" : "Text Language"}</label>
              <div className="flex border border-white/10 p-0.5 rounded-xl bg-white/5 h-[37px] items-center">
                <button
                  type="button"
                  onClick={() => setFormLangTab("en")}
                  className={`flex-1 py-1 text-[10px] font-sans uppercase tracking-wider font-semibold rounded-lg transition h-full ${
                    formLangTab === "en" ? "bg-[#d4af37] text-[#02140f] font-bold" : "text-gray-400 hover:text-pearl"
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setFormLangTab("es")}
                  className={`flex-1 py-1 text-[10px] font-sans uppercase tracking-wider font-semibold rounded-lg transition h-full ${
                    formLangTab === "es" ? "bg-[#d4af37] text-[#02140f] font-bold" : "text-gray-400 hover:text-pearl"
                  }`}
                >
                  Español
                </button>
              </div>
            </div>
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
                {propertyTypes
                  .filter(pt => pt.visible)
                  .map(pt => (
                    <option key={pt.id} value={pt.id}>
                      {lang === "es" ? pt.nameEs : pt.nameEn}
                    </option>
                  ))
                }
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
              <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Lifestyle</label>
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
              <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Approx. Location (Security-First)</label>
              <input 
                value={crudForm.approxLocation} 
                onChange={e => setCrudForm({ ...crudForm, approxLocation: e.target.value })} 
                required 
                placeholder="e.g. Playa Guiones, Nosara"
                className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]" 
              />
            </div>
          </div>

          {/* Legal Mapping Fields (Finca Registry & Cataster Map) */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">
                {lang === "es" ? "Número de Finca (Datos Registrales)" : "Finca Registry Number"}
              </label>
              <input 
                value={crudForm.fincaRegistryNum} 
                onChange={e => setCrudForm({ ...crudForm, fincaRegistryNum: e.target.value })} 
                placeholder="e.g. 5-182390-000"
                className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37] font-mono" 
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">
                {lang === "es" ? "Número Plano Catastro" : "Cataster Map Number"}
              </label>
              <input 
                value={crudForm.catasterMapNum} 
                onChange={e => setCrudForm({ ...crudForm, catasterMapNum: e.target.value })} 
                placeholder="e.g. G-1904778-2024"
                className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37] font-mono" 
              />
            </div>
          </div>

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

          {/* WebP Upload Simulator with Deluxe Progress Bar */}
          <div>
            <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">
              {lang === "es" ? "Imagen de Propiedad (URL / Drag & Drop)" : "Property Image URL / Drag & Drop"}
            </label>
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
                if (file) handleSimulatedUpload(file.name);
              }}
              onClick={() => {
                if (!isUploading) {
                  const mockName = `luxury_villa_${Date.now().toString().slice(-4)}.jpg`;
                  handleSimulatedUpload(mockName);
                }
              }}
              className="mt-2 p-6 border-2 border-dashed border-[#d4af37]/30 hover:border-[#d4af37]/65 rounded-xl bg-white/5 text-center text-[10px] text-gray-300 transition duration-200 cursor-pointer flex flex-col items-center justify-center gap-2 relative overflow-hidden"
            >
              <span>{lang === "es" ? "Arrastra archivos aquí o haz clic para simular carga WebP" : "Drag & Drop files here or click to simulate WebP upload"}</span>
              <span className="text-[9px] text-[#d4af37]/75 font-mono">WebP compression algorithm active (Quality: 82%)</span>
            </div>

            {/* Progress Visualizer */}
            <AnimatePresence>
              {isUploading && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 space-y-2"
                >
                  <div className="flex justify-between items-center text-[9px] font-mono text-pearl">
                    <span>Compressing image to WebP...</span>
                    <span className="text-[#d4af37] font-bold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      className="bg-gradient-to-r from-[#d4af37] to-emerald-400 h-full"
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                    hasFiberOptic: true, hasStarlink: false, image: "/images/jungle.png",
                    fincaRegistryNum: "", catasterMapNum: ""
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

      {/* Catalog listing */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col h-[750px] overflow-hidden">
        <h3 className="font-serif text-lg text-pearl mb-6 border-b border-white/10 pb-3">
          {lang === "es" ? "Propiedades en Inventario" : "Active Properties Catalog"} ({properties.length})
        </h3>
        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          {properties.map(p => {
            const isExpanded = expandedPropId === p.id;
            return (
              <div key={p.id} className="p-4 border border-white/5 bg-[#011a14] rounded-2xl flex flex-col gap-3 hover:border-[#d4af37]/30 transition">
                <div className="flex gap-4 items-center">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                    <img src={p.image} alt={p.name} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {p.refCode && (
                        <span className="px-2 py-0.5 rounded-md text-[8px] uppercase font-mono border border-[#d4af37]/30 bg-[#d4af37]/5 font-semibold text-[#d4af37]">
                          {p.refCode}
                        </span>
                      )}
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
                      title="Edit"
                    >
                      <Edit2 size={13} />
                    </button>
                    {currentUser?.role === "Administrador" && (
                      <button 
                        onClick={() => onDeleteProperty(p.id)}
                        className="p-2 rounded-lg border border-white/10 hover:border-rose-500 hover:bg-rose-500/10 text-gray-400 hover:text-rose-500 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Collapsible Property Specs Accordion */}
                <div className="border-t border-white/5 pt-2">
                  <button 
                    type="button"
                    onClick={() => setExpandedPropId(isExpanded ? null : p.id)}
                    className="w-full flex justify-between items-center text-[9px] uppercase tracking-wider text-gray-400 hover:text-pearl font-mono"
                  >
                    <span>{isExpanded ? (lang === "es" ? "Ocultar Ficha Técnica" : "Hide Technical Specs") : (lang === "es" ? "Ver Ficha Técnica" : "View Technical Specs")}</span>
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-3 text-[10px] text-gray-300 font-sans space-y-2 bg-[#01140f] p-3 rounded-xl border border-white/5"
                      >
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono">
                          <div><span className="text-[#d4af37]">{lang === "es" ? "Finca:" : "Finca ID:"}</span> {p.fincaRegistryNum || "N/A"}</div>
                          <div><span className="text-[#d4af37]">{lang === "es" ? "Plano:" : "Plano ID:"}</span> {p.catasterMapNum || "N/A"}</div>
                          <div><span className="text-gray-400">Altitude:</span> {p.elevationM}m</div>
                          <div><span className="text-gray-400">Airport SJO:</span> {p.airportDistKm}km ({p.airportTimeMin}m)</div>
                          <div><span className="text-gray-400">City:</span> {p.closestCity} ({p.cityDistKm}km)</div>
                          <div><span className="text-gray-400">Medical:</span> {p.medicalDistMin}m</div>
                        </div>
                        <div className="flex gap-2.5 mt-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-mono ${p.hasFiberOptic ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20" : "bg-gray-950/40 text-gray-500"}`}>Fibra Óptica</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-mono ${p.hasStarlink ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20" : "bg-gray-950/40 text-gray-500"}`}>Starlink</span>
                        </div>
                        <p className="italic text-[9.5px] mt-1 text-gray-400 border-t border-white/5 pt-1.5 leading-relaxed">{lang === "es" ? (p.descriptionEs || p.description) : p.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
