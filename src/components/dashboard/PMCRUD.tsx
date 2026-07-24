"use client";

import { useState, type FormEvent } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { PMProperty } from "@/constants/properties";

interface PMCRUDProps {
  pmProperties: PMProperty[];
  onAddProperty: (p: PMProperty) => void;
  onUpdateProperty: (p: PMProperty) => void;
  onDeleteProperty: (id: string) => void;
  lang: "en" | "es";
}

export default function PMCRUD({
  pmProperties,
  onAddProperty,
  onUpdateProperty,
  onDeleteProperty,
  lang
}: PMCRUDProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [crudForm, setCrudForm] = useState<Omit<PMProperty, "id">>({
    name: "",
    location: "",
    descriptionEs: "",
    descriptionEn: "",
    image: "/images/jungle.png",
    gallery: [],
    airbnbUrl: "",
    privateWebUrl: "",
    whatsappContact: "",
    nightlyRate: 0,
    currency: "USD"
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newProp: PMProperty = {
      id: editingId || `pm-${Date.now()}`,
      ...crudForm
    };

    if (editingId) {
      onUpdateProperty(newProp);
    } else {
      onAddProperty(newProp);
    }

    setEditingId(null);
    setCrudForm({
      name: "", location: "", descriptionEs: "", descriptionEn: "",
      image: "/images/jungle.png", gallery: [], airbnbUrl: "",
      privateWebUrl: "", whatsappContact: "", nightlyRate: 0, currency: "USD"
    });
  };

  const handleEdit = (p: PMProperty) => {
    setEditingId(p.id);
    setCrudForm({
      name: p.name, location: p.location, descriptionEs: p.descriptionEs,
      descriptionEn: p.descriptionEn, image: p.image, gallery: p.gallery,
      airbnbUrl: p.airbnbUrl || "", privateWebUrl: p.privateWebUrl || "",
      whatsappContact: p.whatsappContact || "", nightlyRate: p.nightlyRate || 0,
      currency: p.currency || "USD"
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#021812] border border-[#d4af37]/20 p-6 rounded-2xl">
        <h3 className="text-xl text-[#d4af37] font-semibold mb-4">
          {lang === "es" ? "Agregar / Editar Propiedad PM" : "Add / Edit PM Property"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase text-gray-400 mb-1">Name</label>
              <input required value={crudForm.name} onChange={e => setCrudForm({...crudForm, name: e.target.value})} className="w-full bg-[#01140f] border border-white/10 text-pearl text-sm px-4 py-2 rounded-xl outline-none focus:border-[#d4af37]"/>
            </div>
            <div>
              <label className="block text-[10px] uppercase text-gray-400 mb-1">Location</label>
              <input required value={crudForm.location} onChange={e => setCrudForm({...crudForm, location: e.target.value})} className="w-full bg-[#01140f] border border-white/10 text-pearl text-sm px-4 py-2 rounded-xl outline-none focus:border-[#d4af37]"/>
            </div>
            <div>
              <label className="block text-[10px] uppercase text-gray-400 mb-1">Description (ES)</label>
              <textarea required rows={2} value={crudForm.descriptionEs} onChange={e => setCrudForm({...crudForm, descriptionEs: e.target.value})} className="w-full bg-[#01140f] border border-white/10 text-pearl text-sm px-4 py-2 rounded-xl outline-none focus:border-[#d4af37]"/>
            </div>
            <div>
              <label className="block text-[10px] uppercase text-gray-400 mb-1">Description (EN)</label>
              <textarea required rows={2} value={crudForm.descriptionEn} onChange={e => setCrudForm({...crudForm, descriptionEn: e.target.value})} className="w-full bg-[#01140f] border border-white/10 text-pearl text-sm px-4 py-2 rounded-xl outline-none focus:border-[#d4af37]"/>
            </div>
            <div>
              <label className="block text-[10px] uppercase text-gray-400 mb-1">Main Image URL</label>
              <input required value={crudForm.image} onChange={e => setCrudForm({...crudForm, image: e.target.value})} className="w-full bg-[#01140f] border border-white/10 text-pearl text-sm px-4 py-2 rounded-xl outline-none focus:border-[#d4af37]"/>
            </div>
            <div>
              <label className="block text-[10px] uppercase text-gray-400 mb-1">Airbnb URL</label>
              <input value={crudForm.airbnbUrl} onChange={e => setCrudForm({...crudForm, airbnbUrl: e.target.value})} className="w-full bg-[#01140f] border border-white/10 text-pearl text-sm px-4 py-2 rounded-xl outline-none focus:border-[#d4af37]"/>
            </div>
            <div>
              <label className="block text-[10px] uppercase text-gray-400 mb-1">WhatsApp</label>
              <input value={crudForm.whatsappContact} onChange={e => setCrudForm({...crudForm, whatsappContact: e.target.value})} className="w-full bg-[#01140f] border border-white/10 text-pearl text-sm px-4 py-2 rounded-xl outline-none focus:border-[#d4af37]"/>
            </div>
            <div>
              <label className="block text-[10px] uppercase text-gray-400 mb-1">Nightly Rate (USD)</label>
              <input type="number" required value={crudForm.nightlyRate} onChange={e => setCrudForm({...crudForm, nightlyRate: Number(e.target.value)})} className="w-full bg-[#01140f] border border-white/10 text-pearl text-sm px-4 py-2 rounded-xl outline-none focus:border-[#d4af37]"/>
            </div>
          </div>
          <button type="submit" className="flex items-center gap-2 bg-[#d4af37] text-black px-6 py-2.5 rounded-xl font-medium hover:bg-yellow-500 transition-colors">
            <Plus className="w-4 h-4" />
            {editingId ? (lang === "es" ? "Actualizar" : "Update") : (lang === "es" ? "Agregar" : "Add")}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {pmProperties.map(p => (
          <div key={p.id} className="flex items-center justify-between bg-[#01140f] border border-white/5 p-4 rounded-xl">
            <div className="flex items-center gap-4">
              <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded-lg" />
              <div>
                <h4 className="text-pearl font-medium">{p.name}</h4>
                <p className="text-gray-400 text-xs">{p.location} • ${p.nightlyRate}/night</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(p)} className="p-2 text-[#d4af37] hover:bg-[#d4af37]/10 rounded-lg">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => onDeleteProperty(p.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
