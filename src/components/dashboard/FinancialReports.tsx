"use client";

import { useState } from "react";
import { Download, ChevronDown, MessageCircle, BarChart2 } from "lucide-react";
import { Property } from "@/constants/properties";

interface FinancialReportsProps {
  properties: Property[];
  lang: "en" | "es";
}

export default function FinancialReports({
  properties,
  lang
}: FinancialReportsProps) {
  const [selectedReportProp, setSelectedReportProp] = useState<string>("");
  const [reportOcupancyRate, setReportOcupancyRate] = useState<number>(75);
  const [reportCleaningFee, setReportCleaningFee] = useState<number>(450);
  const [reportMaintenanceFee, setReportMaintenanceFee] = useState<number>(300);
  const [reportUtilities, setReportUtilities] = useState<number>(620);
  
  // Tax and card fee deduction options
  const [deductIva, setDeductIva] = useState<boolean>(true); // 13% CR Short term rental VAT
  const [deductCardFee, setDeductCardFee] = useState<boolean>(true); // 3.5% card processing fee

  const [generatedReport, setGeneratedReport] = useState<any | null>(null);

  const generateFinancialReport = () => {
    const prop = properties.find(p => p.id === selectedReportProp);
    if (!prop) return;

    const nights = Math.round(365 * (reportOcupancyRate / 100));
    const averageNightlyPrice = Math.round(prop.price * 0.0001); 
    const grossIncome = nights * averageNightlyPrice;
    
    // Fee calculations
    const pmCommission = Math.round(grossIncome * 0.15);
    const cleaningTotal = Math.round((nights / 4) * reportCleaningFee);
    const maintenanceTotal = reportMaintenanceFee * 12;
    const utilitiesTotal = reportUtilities * 12;
    
    // Tax Deductions
    const ivaDeduction = deductIva ? Math.round(grossIncome * 0.13) : 0;
    const cardFeeDeduction = deductCardFee ? Math.round(grossIncome * 0.035) : 0;
    
    const totalExpenses = pmCommission + cleaningTotal + maintenanceTotal + utilitiesTotal + ivaDeduction + cardFeeDeduction;
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
      ivaDeduction,
      cardFeeDeduction,
      totalExpenses,
      netRevenue
    });
  };

  const triggerWhatsAppReport = () => {
    if (!generatedReport) return;
    const message = lang === "es"
      ? `Hola, de parte del equipo IMAGINE PM. Le adjuntamos el estado de cuenta financiero mensual de su propiedad "${generatedReport.property.nameEs || generatedReport.property.name}".\n\nIngresos brutos: $${generatedReport.grossIncome.toLocaleString()} USD\nImpuestos (13% IVA): -$${generatedReport.ivaDeduction.toLocaleString()} USD\nGastos operativos: $${generatedReport.totalExpenses.toLocaleString()} USD\nRetorno Neto de Propietario: $${generatedReport.netRevenue.toLocaleString()} USD.\n\nEnviado vía Imagine PM Hub.`
      : `Hello, from the IMAGINE PM team. Here is the financial monthly statement of your property "${generatedReport.property.name}".\n\nGross Income: $${generatedReport.grossIncome.toLocaleString()} USD\nTaxes (13% VAT): -$${generatedReport.ivaDeduction.toLocaleString()} USD\nOperating Expenses: $${generatedReport.totalExpenses.toLocaleString()} USD\nNet Owner Revenue: $${generatedReport.netRevenue.toLocaleString()} USD.\n\nSent via Imagine PM Hub.`;
    
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      {/* Calculator settings */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 flex flex-col justify-between h-fit">
        <div className="space-y-4">
          <h3 className="font-serif text-lg text-pearl mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
            <BarChart2 size={18} className="text-[#d4af37]" />
            {lang === "es" ? "Estado Financiero de Administración" : "Financial Statement Architect"}
          </h3>
          
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
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#d4af37] border-t-0 border-l-0 border-r-0">&#9662;</div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Mock Occupancy Rate (%)</label>
              <input 
                type="number"
                value={reportOcupancyRate}
                onChange={e => setReportOcupancyRate(Number(e.target.value))}
                className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Cleaning Fee (USD)</label>
              <input 
                type="number"
                value={reportCleaningFee}
                onChange={e => setReportCleaningFee(Number(e.target.value))}
                className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]"
              />
            </div>
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

          {/* Costa Rican Tax Options */}
          <div className="bg-[#01140f] border border-white/5 rounded-xl p-3.5 space-y-2.5">
            <h4 className="text-[9.5px] uppercase font-bold text-pearl tracking-wider">{lang === "es" ? "Deducciones y Retenciones del Mercado" : "Market Deductions & Taxes"}</h4>
            
            <label className="flex items-center justify-between text-[10px] text-gray-300 cursor-pointer">
              <span>{lang === "es" ? "Deducir Impuesto de Alquiler (13% IVA)" : "Deduct Rental Tax (13% VAT CR)"}</span>
              <input 
                type="checkbox"
                checked={deductIva}
                onChange={e => setDeductIva(e.target.checked)}
                className="accent-[#d4af37] w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-[10px] text-gray-300 cursor-pointer">
              <span>{lang === "es" ? "Comisión de Procesamiento Tarjeta (3.5%)" : "Card Processing Gateway Fee (3.5%)"}</span>
              <input 
                type="checkbox"
                checked={deductCardFee}
                onChange={e => setDeductCardFee(e.target.checked)}
                className="accent-[#d4af37] w-4 h-4 cursor-pointer"
              />
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={generateFinancialReport}
          disabled={!selectedReportProp}
          className="w-full bg-[#d4af37] text-[#02140f] hover:bg-white text-xs py-3 rounded-xl uppercase tracking-widest font-bold cursor-pointer text-center disabled:opacity-50 disabled:pointer-events-none mt-4 transition"
        >
          {lang === "es" ? "Generar Reporte Financiero" : "Generate Financial Report"}
        </button>
      </div>

      {/* Statement sheet */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between min-h-[500px]">
        <div>
          <h3 className="font-serif text-lg text-pearl mb-6 border-b border-white/10 pb-3 flex items-center justify-between">
            <span>{lang === "es" ? "Hoja de Balance Brandeada" : "Branded Financial Statement"}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Imagine PM Hub</span>
          </h3>

          {generatedReport ? (
            <div id="print-financial-report" className="bg-[#02140f] border border-[#d4af37]/20 p-6 rounded-xl space-y-6 font-sans">
              <div className="flex justify-between items-start border-b border-[#d4af37]/30 pb-4">
                <div>
                  <h4 className="font-serif text-[#d4af37] text-base uppercase tracking-wider">{generatedReport.property.name}</h4>
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest">iCal Unified Statement (Airbnb/Booking)</span>
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
                  {deductIva && (
                    <div className="flex justify-between text-rose-300">
                      <span>Costa Rican Short-Term VAT Tax (13% IVA)</span>
                      <span>- $${generatedReport.ivaDeduction.toLocaleString()} USD</span>
                    </div>
                  )}
                  {deductCardFee && (
                    <div className="flex justify-between text-rose-300">
                      <span>Credit Card Processing Fee (3.5%)</span>
                      <span>- $${generatedReport.cardFeeDeduction.toLocaleString()} USD</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t-2 border-[#d4af37]/30 pt-3 flex justify-between text-sm text-[#d4af37] font-bold">
                  <span>Net Owner Revenue Return</span>
                  <span>$${generatedReport.netRevenue.toLocaleString()} USD</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-xs text-gray-400 font-light italic flex-1 flex items-center justify-center">
              Generate report to view PM Statement...
            </div>
          )}
        </div>

        {generatedReport && (
          <div className="flex gap-3 mt-6 border-t border-white/10 pt-6">
            <button
              type="button"
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
              type="button"
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
  );
}
