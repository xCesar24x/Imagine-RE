"use client";

import { useState, useMemo, type FormEvent } from "react";
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp, Download, Check, RefreshCw, X } from "lucide-react";
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
  rates?: { CRC: number; EUR: number; JPY: number; USD: number };
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
  rates,
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

  const [isSegmentDropdownOpen, setIsSegmentDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isCustomAmenitiesExpanded, setIsCustomAmenitiesExpanded] = useState(false);
  const [customAmenityInput, setCustomAmenityInput] = useState("");

  const [crudForm, setCrudForm] = useState({
    name: "",
    location: "",
    price: 0,
    currency: "USD" as "USD" | "CRC",
    commissionType: "percentage" as "percentage" | "fixed",
    commissionValue: 5,
    lotSizeM2: 0,
    constructionSizeM2: 0,
    suites: 0,
    vibeTags: "",
    description: "",
    descriptionEs: "",
    nameEs: "",
    type: ["Casa"] as any,
    segment: ["Luxury"] as Property["segment"],
    amenities: [] as string[],
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
    catasterMapNum: "",
    gallery: [] as string[]
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

  const compressAndUploadMultipleImages = async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadLogs([`[System] Iniciando carga de lote: ${files.length} archivos...`]);

    const compressedResults: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileNum = i + 1;
      setUploadLogs(prev => [...prev, `[System] Procesando archivo ${fileNum} de ${files.length}: ${file.name}...`]);

      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;
            
            const MAX_WIDTH = 1000;
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
            }
            
            const result = canvas.toDataURL("image/jpeg", 0.78);
            resolve(result);
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      });

      compressedResults.push(base64);
      const currentProgress = Math.round((fileNum / files.length) * 100);
      setUploadProgress(currentProgress);
      setUploadLogs(prev => [...prev, `[System] ✓ Optimizado ${file.name} a ${(base64.length / 1024).toFixed(1)} KB.`]);
    }

    setUploadLogs(prev => [...prev, `[System] ¡Todos los archivos procesados con éxito!`]);

    setTimeout(() => {
      setCrudForm(prev => {
        const newGallery = [...(prev.gallery || []), ...compressedResults];
        const currentCover = prev.image;
        const newCover = (!currentCover || currentCover === "/images/jungle.png") && compressedResults.length > 0
          ? compressedResults[0]
          : currentCover;

        return {
          ...prev,
          image: newCover,
          gallery: newGallery
        };
      });
      setIsUploading(false);
    }, 600);
  };

  const handleAddCustomAmenity = () => {
    const trimmed = customAmenityInput.trim();
    if (!trimmed) return;
    const currentAmenities = crudForm.amenities || [];
    if (!currentAmenities.includes(trimmed)) {
      setCrudForm(prev => ({
        ...prev,
        amenities: [...currentAmenities, trimmed]
      }));
    }
    setCustomAmenityInput("");
  };

  const handleCrudSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formattedTags = crudForm.vibeTags.split(",").map(t => t.trim()).filter(Boolean);

    const propertyData: Property = {
      id: editingPropertyId || `prop-${Date.now()}`,
      name: crudForm.name,
      location: crudForm.location,
      price: Number(crudForm.price),
      m2: Number(crudForm.constructionSizeM2 || 0),
      sqft: Math.round(Number(crudForm.constructionSizeM2 || 0) * 10.76391),
      acres: Number((Number(crudForm.lotSizeM2 || 0) / 4046.85642).toFixed(4)),
      lotSizeM2: Number(crudForm.lotSizeM2),
      constructionSizeM2: Number(crudForm.constructionSizeM2),
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
      amenities: crudForm.amenities,
      gallery: crudForm.gallery || [],
      currency: crudForm.currency,
      commissionType: crudForm.commissionType,
      commissionValue: Number(crudForm.commissionValue),
      commissionAmount: crudForm.commissionType === "percentage"
        ? Number(crudForm.price) * (Number(crudForm.commissionValue) / 100)
        : Number(crudForm.commissionValue),
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
      name: "", location: "", price: 0, currency: "USD", commissionType: "percentage", commissionValue: 5, lotSizeM2: 0, constructionSizeM2: 0, suites: 0, vibeTags: "",
      description: "", descriptionEs: "", nameEs: "", type: ["Casa"], segment: ["Luxury"], amenities: [], province: "San José", lifestyle: "Naturaleza",
      status: "Disponible", approxLocation: "", elevationM: 100, airportDistKm: 50,
      airportTimeMin: 60, closestCity: "", cityDistKm: 5, medicalDistMin: 15,
      hasFiberOptic: true, hasStarlink: false, image: "/images/jungle.png",
      fincaRegistryNum: "", catasterMapNum: "", gallery: []
    });
  };

  const handleEditClick = (p: Property) => {
    setEditingPropertyId(p.id);
    setCrudForm({
      name: p.name,
      location: p.location,
      price: p.price,
      currency: p.currency || "USD",
      commissionType: p.commissionType || "percentage",
      commissionValue: p.commissionValue !== undefined ? p.commissionValue : 5,
      lotSizeM2: p.lotSizeM2 || 0,
      constructionSizeM2: p.constructionSizeM2 || p.m2 || Math.round(p.sqft * 0.092903),
      suites: p.suites,
      vibeTags: p.vibeTags.join(", "),
      description: p.description,
      descriptionEs: p.descriptionEs || p.description,
      nameEs: p.nameEs || p.name,
      type: (Array.isArray(p.type) ? p.type : (p.type ? [p.type] : ["Casa"])) as any,
      segment: (Array.isArray(p.segment) ? p.segment : (p.segment ? [p.segment] : ["Luxury"])) as any,
      amenities: p.amenities || [],
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
      catasterMapNum: p.catasterMapNum || "",
      gallery: p.gallery || []
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

          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">
                {lang === "es" ? "Precio de Venta" : "Sale Price"}
              </label>
              <input 
                type="number"
                value={crudForm.price || ""} 
                onChange={e => setCrudForm({ ...crudForm, price: Number(e.target.value) })} 
                required 
                className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]" 
              />
              <div className="flex gap-4 items-center mt-2.5">
                <label className="flex items-center gap-1.5 text-[10px] text-pearl cursor-pointer select-none">
                  <input
                    type="radio"
                    name="currency"
                    checked={crudForm.currency === "USD"}
                    onChange={() => setCrudForm(prev => ({ ...prev, currency: "USD" }))}
                    className="accent-[#d4af37]"
                  />
                  <span>USD ($)</span>
                </label>
                <label className="flex items-center gap-1.5 text-[10px] text-pearl cursor-pointer select-none">
                  <input
                    type="radio"
                    name="currency"
                    checked={crudForm.currency === "CRC"}
                    onChange={() => setCrudForm(prev => ({ ...prev, currency: "CRC" }))}
                    className="accent-[#d4af37]"
                  />
                  <span>CRC (₡)</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">
                {lang === "es" ? "Construcción (m²)" : "Construction (m²)"}
              </label>
              <input 
                type="number"
                value={crudForm.constructionSizeM2 || ""} 
                onChange={e => setCrudForm({ ...crudForm, constructionSizeM2: Number(e.target.value) })} 
                required 
                className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]" 
              />
              {crudForm.constructionSizeM2 > 0 && (
                <div className="text-[9px] text-gray-400 mt-1 font-mono leading-none">
                  {lang === "es" ? "Equivale a: " : "Equivalency: "}
                  <span className="text-[#d4af37] font-semibold">{Math.round(crudForm.constructionSizeM2 * 10.76391).toLocaleString()}</span> sqft
                </div>
              )}
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">
                {lang === "es" ? "Terreno (m²)" : "Lot / Land (m²)"}
              </label>
              <input 
                type="number"
                value={crudForm.lotSizeM2 || ""} 
                onChange={e => setCrudForm({ ...crudForm, lotSizeM2: Number(e.target.value) })} 
                required 
                className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]" 
              />
              {crudForm.lotSizeM2 > 0 && (
                <div className="text-[9px] text-gray-400 mt-1 font-mono leading-none">
                  {lang === "es" ? "Equivale a: " : "Equivalency: "}
                  <span className="text-[#d4af37] font-semibold">{Math.round(crudForm.lotSizeM2 * 10.76391).toLocaleString()}</span> sqft /{" "}
                  <span className="text-[#d4af37] font-semibold">{(crudForm.lotSizeM2 / 4046.85642).toFixed(4)}</span> acres
                </div>
              )}
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

          {/* Commission/Earning Section */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            <h4 className="block text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
              {lang === "es" ? "Monto que nos vamos a ganar (Comisión)" : "Our Earnings (Commission)"}
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">
                  {lang === "es" ? "Tipo de Comisión" : "Commission Type"}
                </label>
                <div className="flex border border-white/10 p-0.5 rounded-xl bg-white/5 h-[37px] items-center">
                  <button
                    type="button"
                    onClick={() => setCrudForm(prev => ({ ...prev, commissionType: "percentage" }))}
                    className={`flex-1 py-1 text-[10px] font-sans uppercase tracking-wider font-semibold rounded-lg transition h-full cursor-pointer ${
                      crudForm.commissionType === "percentage" ? "bg-[#d4af37] text-[#02100b] font-bold" : "text-gray-400 hover:text-pearl"
                    }`}
                  >
                    {lang === "es" ? "% Porcentaje" : "% Percentage"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCrudForm(prev => ({ ...prev, commissionType: "fixed" }))}
                    className={`flex-1 py-1 text-[10px] font-sans uppercase tracking-wider font-semibold rounded-lg transition h-full cursor-pointer ${
                      crudForm.commissionType === "fixed" ? "bg-[#d4af37] text-[#02100b] font-bold" : "text-gray-400 hover:text-pearl"
                    }`}
                  >
                    {lang === "es" ? "Monto Fijo" : "Fixed Amount"}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">
                  {crudForm.commissionType === "percentage" 
                    ? (lang === "es" ? "Valor de Comisión (%)" : "Commission Value (%)") 
                    : (lang === "es" ? `Monto Fijo (${crudForm.currency})` : `Fixed Amount (${crudForm.currency})`)
                  }
                </label>
                <input 
                  type="number"
                  value={crudForm.commissionValue || ""} 
                  onChange={e => setCrudForm({ ...crudForm, commissionValue: Number(e.target.value) })} 
                  required 
                  className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]" 
                />
              </div>
            </div>

            {/* Live Commission Display */}
            {(() => {
              const basePrice = Number(crudForm.price) || 0;
              const value = Number(crudForm.commissionValue) || 0;
              const rate = rates?.CRC || 520;
              
              const baseCommission = crudForm.commissionType === "percentage"
                ? basePrice * (value / 100)
                : value;
              
              let usdCommission = 0;
              let crcCommission = 0;
              
              if (crudForm.currency === "CRC") {
                crcCommission = baseCommission;
                usdCommission = Math.round(baseCommission / rate);
              } else {
                usdCommission = baseCommission;
                crcCommission = Math.round(baseCommission * rate);
              }
              
              return (
                <div className="text-[10px] text-gray-400 font-mono border-t border-white/5 pt-2 flex items-center justify-between">
                  <span>{lang === "es" ? "Ganancia Estimada:" : "Estimated Earnings:"}</span>
                  <span className="text-[#d4af37] font-semibold text-xs">
                    ${usdCommission.toLocaleString()} USD / ₡{crcCommission.toLocaleString()} CRC
                  </span>
                </div>
              );
            })()}
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div className="relative">
              <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Type</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                  className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37] text-left flex justify-between items-center h-[37px] cursor-pointer"
                >
                  <span className="truncate">
                    {!crudForm.type || crudForm.type.length === 0
                      ? (lang === "es" ? "Seleccionar Tipos" : "Select Types")
                      : (Array.isArray(crudForm.type) ? crudForm.type : [crudForm.type]).map(tId => {
                          const matched = propertyTypes.find(pt => pt.id === tId);
                          return matched ? (lang === "es" ? matched.nameEs : matched.nameEn) : tId;
                        }).join(", ")
                    }
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                <AnimatePresence>
                  {isTypeDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsTypeDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 right-0 mt-1.5 bg-[#01140f] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-white/5 max-h-60 overflow-y-auto"
                      >
                        {propertyTypes
                          .filter(pt => pt.visible)
                          .map(opt => {
                            const currentTypes = Array.isArray(crudForm.type) ? crudForm.type : [crudForm.type];
                            const isSelected = currentTypes.includes(opt.id);
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                  let newTypes: string[] = [...currentTypes];
                                  if (isSelected) {
                                    newTypes = newTypes.filter(t => t !== opt.id);
                                  } else {
                                    newTypes.push(opt.id);
                                  }
                                  setCrudForm({ ...crudForm, type: newTypes });
                                }}
                                className="w-full text-left px-4 py-2.5 text-xs text-pearl hover:bg-[#d4af37]/10 flex items-center justify-between transition cursor-pointer"
                              >
                                <span>{lang === "es" ? opt.nameEs : opt.nameEn}</span>
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                                  isSelected ? "bg-[#d4af37] border-[#d4af37] text-[#02140f]" : "border-white/20 bg-black/20"
                                }`}>
                                  {isSelected && <Check size={10} strokeWidth={3} />}
                                </div>
                              </button>
                            );
                          })}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="relative">
              <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">Segment</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSegmentDropdownOpen(!isSegmentDropdownOpen)}
                  className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37] text-left flex justify-between items-center h-[37px] cursor-pointer"
                >
                  <span className="truncate">
                    {!crudForm.segment || crudForm.segment.length === 0
                      ? (lang === "es" ? "Seleccionar Segmentos" : "Select Segments")
                      : (Array.isArray(crudForm.segment) ? crudForm.segment : [crudForm.segment]).map(seg => {
                          if (seg === "Luxury") return "Signature Luxury";
                          if (seg === "Standard") return "Standard Residential";
                          if (seg === "Commercial") return "Commercial & Investment";
                          return seg;
                        }).join(", ")
                    }
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                <AnimatePresence>
                  {isSegmentDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsSegmentDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 right-0 mt-1.5 bg-[#01140f] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-white/5"
                      >
                        {[
                          { value: "Luxury", label: "Signature Luxury" },
                          { value: "Standard", label: "Standard Residential" },
                          { value: "Commercial", label: "Commercial & Investment" }
                        ].map(opt => {
                          const currentSegments = Array.isArray(crudForm.segment) ? crudForm.segment : [crudForm.segment];
                          const isSelected = currentSegments.includes(opt.value as any);
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                let newSegments: ("Luxury" | "Standard" | "Commercial")[] = [...currentSegments];
                                if (isSelected) {
                                  newSegments = newSegments.filter(s => s !== opt.value);
                                } else {
                                  newSegments.push(opt.value as any);
                                }
                                setCrudForm({ ...crudForm, segment: newSegments });
                              }}
                              className="w-full text-left px-4 py-2.5 text-xs text-pearl hover:bg-[#d4af37]/10 flex items-center justify-between transition cursor-pointer"
                            >
                              <span>{opt.label}</span>
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                                isSelected ? "bg-[#d4af37] border-[#d4af37] text-[#02140f]" : "border-white/20 bg-black/20"
                              }`}>
                                {isSelected && <Check size={10} strokeWidth={3} />}
                              </div>
                            </button>
                          );
                        })}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
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

          {/* Amenities Section */}
          <div className="border-t border-white/10 pt-4">
            <h4 className="block text-[10px] uppercase tracking-wider text-gray-400 mb-3 font-semibold">
              {lang === "es" ? "Amenidades de la Propiedad" : "Property Amenities"}
            </h4>
            
            {/* Common Amenities Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: "garden", es: "Jardín", en: "Garden" },
                { id: "attic", es: "Ático", en: "Attic" },
                { id: "garage", es: "Garaje", en: "Garage" },
                { id: "terrace", es: "Terraza", en: "Terrace" },
                { id: "pool", es: "Piscina Privada", en: "Private Pool" },
                { id: "closet", es: "Walk-in Closet", en: "Walk-in Closet" },
                { id: "kitchen", es: "Cocina Integral", en: "Equipped Kitchen" },
                { id: "laundry", es: "Cuarto de Lavado", en: "Laundry Room" },
                { id: "storage", es: "Bodega", en: "Storage Room" },
                { id: "balcony", es: "Balcón", en: "Balcony" }
              ].map(amenity => {
                const isChecked = crudForm.amenities?.includes(amenity.id);
                return (
                  <label 
                    key={amenity.id} 
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs text-pearl cursor-pointer transition select-none ${
                      isChecked 
                        ? "bg-[#d4af37]/10 border-[#d4af37]" 
                        : "bg-[#01140f] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={() => {
                        let newAmenities = [...(crudForm.amenities || [])];
                        if (isChecked) {
                          newAmenities = newAmenities.filter(id => id !== amenity.id);
                        } else {
                          newAmenities.push(amenity.id);
                        }
                        setCrudForm({ ...crudForm, amenities: newAmenities });
                      }}
                      className="hidden"
                    />
                    <div className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center transition-all ${
                      isChecked ? "bg-[#d4af37] border-[#d4af37] text-[#02140f]" : "border-white/30 bg-black/30"
                    }`}>
                      {isChecked && <Check size={10} strokeWidth={3} />}
                    </div>
                    <span>{lang === "es" ? amenity.es : amenity.en}</span>
                  </label>
                );
              })}
            </div>

            {/* Expandable Section for Less Frequent Amenities */}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setIsCustomAmenitiesExpanded(!isCustomAmenitiesExpanded)}
                className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] text-gray-400 hover:text-pearl flex items-center justify-center gap-1.5 transition uppercase tracking-wider font-semibold cursor-pointer font-mono"
              >
                <span>
                  {isCustomAmenitiesExpanded 
                    ? (lang === "es" ? "Ocultar amenidades exclusivas" : "Hide exclusive amenities")
                    : (lang === "es" ? "Ver amenidades exclusivas / menos frecuentes" : "Ver amenidades exclusivas / menos frecuentes")
                  }
                </span>
                {isCustomAmenitiesExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>

              <AnimatePresence>
                {isCustomAmenitiesExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
                      {[
                        { id: "theater", es: "Cine en Casa", en: "Home Theater" },
                        { id: "games", es: "Sala de Juegos", en: "Game Room" },
                        { id: "bar", es: "Minibar / Bar Privado", en: "Home Bar" },
                        { id: "wine", es: "Cava de Vinos", en: "Wine Cellar" },
                        { id: "gym", es: "Gimnasio Privado", en: "Private Gym" },
                        { id: "sauna", es: "Spa / Sauna", en: "Sauna / Spa" },
                        { id: "court", es: "Cancha de Tenis/Pádel", en: "Tennis/Padel Court" },
                        { id: "helipad", es: "Helipuerto", en: "Helipad" },
                        { id: "funicular", es: "Funicular", en: "Funicular" },
                        { id: "guesthouse", es: "Casa de Huéspedes", en: "Guest House" },
                        { id: "firepit", es: "Fogata / Fire Pit", en: "Fire Pit" },
                        { id: "jacuzzi", es: "Jacuzzi Exterior", en: "Outdoor Jacuzzi" }
                      ].map(amenity => {
                        const isChecked = crudForm.amenities?.includes(amenity.id);
                        return (
                          <label 
                            key={amenity.id} 
                            className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs text-pearl cursor-pointer transition select-none ${
                              isChecked 
                                ? "bg-[#d4af37]/10 border-[#d4af37]" 
                                : "bg-[#01140f] border-white/10 hover:border-white/20"
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={() => {
                                let newAmenities = [...(crudForm.amenities || [])];
                                if (isChecked) {
                                  newAmenities = newAmenities.filter(id => id !== amenity.id);
                                } else {
                                  newAmenities.push(amenity.id);
                                }
                                setCrudForm({ ...crudForm, amenities: newAmenities });
                              }}
                              className="hidden"
                            />
                            <div className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center transition-all ${
                              isChecked ? "bg-[#d4af37] border-[#d4af37] text-[#02140f]" : "border-white/30 bg-black/30"
                            }`}>
                              {isChecked && <Check size={10} strokeWidth={3} />}
                            </div>
                            <span>{lang === "es" ? amenity.es : amenity.en}</span>
                          </label>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Custom Amenities Builder */}
            <div className="mt-4 border-t border-white/5 pt-4 space-y-3">
              <label className="block text-[9px] uppercase tracking-wider text-gray-400">
                {lang === "es" ? "Agregar Amenidad Personalizada" : "Add Custom Amenity"}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customAmenityInput}
                  onChange={e => setCustomAmenityInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomAmenity();
                    }
                  }}
                  placeholder={lang === "es" ? "ej. Cava de puros, Helipuerto privado" : "e.g. Cigar Lounge, Private Helipad"}
                  className="flex-1 bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2 rounded-xl outline-none focus:border-[#d4af37]"
                />
                <button
                  type="button"
                  onClick={handleAddCustomAmenity}
                  className="bg-[#d4af37]/15 hover:bg-[#d4af37]/35 border border-[#d4af37]/35 text-[#d4af37] text-xs px-4 py-2 rounded-xl transition font-mono uppercase tracking-wider font-semibold cursor-pointer"
                >
                  {lang === "es" ? "+ Agregar" : "+ Add"}
                </button>
              </div>

              {/* Render custom selected amenities */}
              {(() => {
                const PREDEFINED_AMENITY_IDS = [
                  "garden", "attic", "garage", "terrace", "pool", "closet", "kitchen", "laundry", "storage", "balcony",
                  "theater", "games", "bar", "wine", "gym", "sauna", "court", "helipad", "funicular", "guesthouse", "firepit", "jacuzzi"
                ];
                const customSelected = (crudForm.amenities || []).filter(id => !PREDEFINED_AMENITY_IDS.includes(id));
                
                if (customSelected.length === 0) return null;
                
                return (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {customSelected.map(amenity => (
                      <div 
                        key={amenity}
                        onClick={() => {
                          setCrudForm(prev => ({
                            ...prev,
                            amenities: (prev.amenities || []).filter(id => id !== amenity)
                          }));
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-sans font-medium text-pearl bg-[#d4af37]/10 border-[#d4af37] cursor-pointer hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition select-none"
                        title={lang === "es" ? "Haz clic para remover" : "Click to remove"}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                        <span className="capitalize">{amenity}</span>
                        <X size={10} className="ml-1 opacity-60 hover:opacity-100" />
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
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
            
            <input 
              type="file" 
              id="crud-image-upload" 
              multiple
              accept="image/*" 
              className="hidden" 
              onChange={e => {
                const files = e.target.files;
                if (files && files.length > 0) compressAndUploadMultipleImages(Array.from(files));
              }}
            />
            
            <div 
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                if (files && files.length > 0) compressAndUploadMultipleImages(Array.from(files));
              }}
              onClick={() => {
                if (!isUploading) {
                  document.getElementById("crud-image-upload")?.click();
                }
              }}
              className="mt-2 p-6 border-2 border-dashed border-[#d4af37]/30 hover:border-[#d4af37]/65 rounded-xl bg-white/5 text-center text-[10px] text-gray-300 transition duration-200 cursor-pointer flex flex-col items-center justify-center gap-2 relative overflow-hidden"
            >
              <span>{lang === "es" ? "Arrastra imágenes aquí o haz clic para subir varias fotos a la vez" : "Drag & Drop images here or click to upload multiple photos at once"}</span>
              <span className="text-[9px] text-[#d4af37]/75 font-mono">WebP multi-thread compression algorithm active (Quality: 82%)</span>
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

            {/* Gallery Thumbnails Manager */}
            {crudForm.gallery && crudForm.gallery.length > 0 && (
              <div className="mt-4 space-y-2">
                <label className="block text-[9px] uppercase tracking-wider text-[#d4af37] font-semibold">
                  {lang === "es" ? "Galería de Fotos Cargadas" : "Uploaded Photos Gallery"} ({crudForm.gallery.length})
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {crudForm.gallery.map((imgBase64, idx) => {
                    const isCover = crudForm.image === imgBase64;
                    return (
                      <div 
                        key={idx} 
                        className={`relative aspect-video rounded-lg overflow-hidden border ${isCover ? "border-[#d4af37] ring-1 ring-[#d4af37]" : "border-white/10"} bg-black/40 group`}
                      >
                        <img 
                          src={imgBase64} 
                          alt={`Uploaded ${idx}`} 
                          className="object-cover w-full h-full" 
                        />
                        
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition duration-150">
                          {!isCover && (
                            <button
                              type="button"
                              onClick={() => setCrudForm(prev => ({ ...prev, image: imgBase64 }))}
                              className="bg-[#d4af37] text-black text-[8px] font-bold px-1.5 py-0.5 rounded shadow hover:bg-white transition cursor-pointer"
                            >
                              {lang === "es" ? "Portada" : "Cover"}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setCrudForm(prev => {
                                const newGallery = (prev.gallery || []).filter((_, i) => i !== idx);
                                let newCover = prev.image;
                                if (prev.image === imgBase64) {
                                  newCover = newGallery.length > 0 ? newGallery[0] : "/images/jungle.png";
                                }
                                return {
                                  ...prev,
                                  image: newCover,
                                  gallery: newGallery
                                };
                              });
                            }}
                            className="bg-red-600 text-white p-1 rounded hover:bg-red-700 transition cursor-pointer"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>

                        {isCover && (
                          <div className="absolute top-1 left-1 bg-[#d4af37] text-black text-[7px] uppercase font-bold px-1 rounded">
                            {lang === "es" ? "Portada" : "Cover"}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
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
                    name: "", location: "", price: 0, currency: "USD", commissionType: "percentage", commissionValue: 5, lotSizeM2: 0, constructionSizeM2: 0, suites: 0, vibeTags: "",
                    description: "", descriptionEs: "", nameEs: "", type: ["Casa"], segment: ["Luxury"], amenities: [], province: "San José", lifestyle: "Naturaleza",
                    status: "Disponible", approxLocation: "", elevationM: 100, airportDistKm: 50,
                    airportTimeMin: 60, closestCity: "", cityDistKm: 5, medicalDistMin: 15,
                    hasFiberOptic: true, hasStarlink: false, image: "/images/jungle.png",
                    fincaRegistryNum: "", catasterMapNum: "", gallery: []
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
                      {Array.isArray(p.type) ? p.type.map(t => (
                        <span key={t} className="px-1.5 py-0.5 rounded-full text-[7.5px] uppercase font-sans border border-white/15 bg-white/5 font-semibold text-[#d4af37] mr-1">{t}</span>
                      )) : (
                        <span className="px-2 py-0.5 rounded-full text-[8px] uppercase font-sans border border-white/15 bg-white/5 font-semibold text-[#d4af37]">{p.type}</span>
                      )}
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
                          <div><span className="text-gray-400">{lang === "es" ? "Construcción:" : "Const. Area:"}</span> {p.constructionSizeM2 || p.m2 || Math.round(p.sqft * 0.092903)} m²</div>
                          <div><span className="text-gray-400">{lang === "es" ? "Terreno:" : "Lot Area:"}</span> {p.lotSizeM2 || 0} m²</div>
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
