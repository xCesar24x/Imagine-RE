"use client";

import { useState, useEffect } from "react";
import { Download, Send, MessageCircle, FileText, UserCheck, ShieldCheck, Info } from "lucide-react";
import { Property, Lead } from "@/constants/properties";

interface ContractAutomatorProps {
  leads: Lead[];
  properties: Property[];
  lang: "en" | "es";
}

export default function ContractAutomator({
  leads,
  properties,
  lang
}: ContractAutomatorProps) {
  const [selectedContractLead, setSelectedContractLead] = useState<string>("");
  const [selectedContractProp, setSelectedContractProp] = useState<string>("");
  const [contractType, setContractType] = useState<"pm" | "exclusive" | "commission">("pm");
  const [contractLang, setContractLang] = useState<"en" | "es">(lang || "es");
  const [contractCommission, setContractCommission] = useState<number>(15);
  const [contractTerm, setContractTerm] = useState<number>(12);
  const [contractRepName, setContractRepName] = useState<string>("Bryan Viquez");
  const [contractRepId, setContractRepId] = useState<string>("3-101-778899");
  const [contractCustomClauses, setContractCustomClauses] = useState<string>("");
  const [includeRac, setIncludeRac] = useState<boolean>(true); // Alternative dispute resolution check
  
  // Dynamic Counterpart & Property Inputs
  const [counterpartType, setCounterpartType] = useState<"owner" | "broker" | "developer">("owner");
  const [counterpartName, setCounterpartName] = useState<string>("");
  const [counterpartId, setCounterpartId] = useState<string>("");
  const [counterpartEmail, setCounterpartEmail] = useState<string>("");
  const [counterpartPhone, setCounterpartPhone] = useState<string>("");
  
  const [propertyName, setPropertyName] = useState<string>("");
  const [propertyLocation, setPropertyLocation] = useState<string>("");
  const [fincaNum, setFincaNum] = useState<string>("");
  const [catasterNum, setCatasterNum] = useState<string>("");
  const [propertyPrice, setPropertyPrice] = useState<number>(0);

  const [generatedContractHtml, setGeneratedContractHtml] = useState<string>("");
  const [contractEmailStatus, setContractEmailStatus] = useState<string | null>(null);

  useEffect(() => {
    if (contractType === "pm") {
      setContractCommission(15);
      setContractTerm(12);
    } else if (contractType === "exclusive") {
      setContractCommission(5);
      setContractTerm(12);
    } else if (contractType === "commission") {
      setContractCommission(5);
      setContractTerm(6);
    }
  }, [contractType]);

  // Sync when selecting a lead from dropdown
  useEffect(() => {
    if (selectedContractLead) {
      const lead = leads.find(l => l.id === selectedContractLead);
      if (lead) {
        setCounterpartName(lead.name);
        setCounterpartEmail(lead.email || "");
        setCounterpartPhone(lead.phone || "");
      }
    }
  }, [selectedContractLead, leads]);

  // Sync when selecting a property from dropdown
  useEffect(() => {
    if (selectedContractProp) {
      const prop = properties.find(p => p.id === selectedContractProp);
      if (prop) {
        setPropertyName(prop.nameEs || prop.name);
        setPropertyLocation(`${prop.location} (${prop.approxLocation})`);
        setFincaNum(prop.fincaRegistryNum || "");
        setCatasterNum(prop.catasterMapNum || "");
        setPropertyPrice(prop.price || 0);
      }
    }
  }, [selectedContractProp, properties]);

  const generateLegalContract = () => {
    const dateStr = new Date().toLocaleDateString(
      contractLang === "es" ? "es-CR" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );

    // Graceful fallbacks for missing fields: put clean blank lines ________
    const finalCounterpartName = counterpartName.trim() || "__________________________________________________";
    const finalCounterpartId = counterpartId.trim() || "________________________";
    const finalCounterpartPhone = counterpartPhone.trim() || "________________________";
    const finalCounterpartEmail = counterpartEmail.trim() || "________________________";

    const finalPropertyName = propertyName.trim() || "__________________________________________________";
    const finalPropertyLocation = propertyLocation.trim() || "__________________________________________________";
    const finalFincaNum = fincaNum.trim() || "________________________";
    const finalCatasterNum = catasterNum.trim() || "________________________";

    const finalRepName = contractRepName.trim() || "Bryan Viquez";
    const finalRepId = contractRepId.trim() || "3-101-778899";

    let counterpartRoleTextEs = "PROPIETARIO";
    let counterpartRoleTextEn = "OWNER";
    if (counterpartType === "broker") {
      counterpartRoleTextEs = "CORREDOR DE BIENES RAÍCES / CO-BROKER";
      counterpartRoleTextEn = "REAL ESTATE CO-BROKER";
    } else if (counterpartType === "developer") {
      counterpartRoleTextEs = "DESARROLLADOR / EMPRESA CONTRATANTE";
      counterpartRoleTextEn = "DEVELOPER / CORPORATE PRINCIPAL";
    }

    const racText = includeRac
      ? (contractLang === "es"
          ? `<h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLÁUSULA DE RESOLUCIÓN ALTERNA DE CONFLICTOS (RAC)</h3>
             <p>Cualquier disputa o reclamación que surja de la interpretación o ejecución de este contrato se resolverá de forma definitiva mediante arbitraje de derecho, de conformidad con los reglamentos de arbitraje del Centro de Conciliación y Arbitraje de la Cámara de Comercio de Costa Rica, a cuyas normas las partes se someten de manera incondicional.</p>`
          : `<h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">ALTERNATIVE DISPUTE RESOLUTION (ADR) CLAUSE</h3>
             <p>Any dispute, claim or difference arising out of the interpretation or execution of this agreement shall be settled definitively by arbitration, in accordance with the arbitration rules of the Conciliation and Arbitration Center of the Chamber of Commerce of Costa Rica, to which rules the parties unconditionally submit.</p>`)
      : "";

    let content = "";

    if (contractType === "pm") {
      if (contractLang === "es") {
        content = `
          <div style="font-family: 'Playfair Display', serif; padding: 40px; color: #02140f; background: #fff; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #02140f; font-size: 22px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 2px;">CONTRATO DE ADMINISTRACIÓN DE PROPIEDAD</h1>
              <p style="color: #d4af37; font-size: 12px; text-transform: uppercase; letter-spacing: 3px;">IMAGINE REAL ESTATE & PROPERTY MANAGEMENT S.A.</p>
            </div>
            
            <p>En la ciudad de San José, Costa Rica, al día <strong>${dateStr}</strong>, se celebra el presente contrato de administración de propiedad entre:</p>
            <p>Por una parte, <strong>IMAGINE REAL ESTATE & PROPERTY MANAGEMENT S.A.</strong>, cédula jurídica N° <strong>${finalRepId}</strong>, representada por el Sr. <strong>${finalRepName}</strong> en su calidad de apoderado (en adelante el "ADMINISTRADOR"), y por la otra parte, <strong>${finalCounterpartName}</strong>, titular de la cédula / pasaporte N° <strong>${finalCounterpartId}</strong>, teléfono <strong>${finalCounterpartPhone}</strong> y correo <strong>${finalCounterpartEmail}</strong> (en adelante el/la "<strong>${counterpartRoleTextEs}</strong>").</p>
            
            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLÁUSULA PRIMERA: OBJETO DEL CONTRATO Y DATOS REGISTRALES</h3>
            <p>La contraparte entrega en administración exclusiva al ADMINISTRADOR la propiedad denominada <strong>"${finalPropertyName}"</strong>, ubicada en <strong>${finalPropertyLocation}</strong>, e inscrita en el Registro de la Propiedad de Costa Rica bajo el número de <strong>Finca N°: ${finalFincaNum}</strong> y <strong>Plano Catastro N°: ${finalCatasterNum}</strong>.</p>
            
            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 4px;">CLÁUSULA SEGUNDA: COMISIÓN DE GESTIÓN Y BALANCE</h3>
            <p>El ADMINISTRADOR percibirá una comisión de gestión correspondiente al <strong>${contractCommission}% (por ciento)</strong> sobre los ingresos brutos generados por concepto de alquiler de la propiedad durante la vigencia del Contrato. Los balances financieros serán entregados mensualmente.</p>
            
            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLÁUSULA TERCERA: PLAZO DE VIGENCIA</h3>
            <p>El plazo de vigencia del presente contrato será de <strong>${contractTerm} meses</strong> a partir de la firma de este documento, prorrogable de forma automática por períodos iguales salvo manifestación en contrario con 30 días de anticipación.</p>
            
            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLÁUSULA CUARTA: SERVICIOS CONCIERGE VIP INCLUIDOS</h3>
            <p>El ADMINISTRADOR coordinará servicios de limpieza premium de entrada/salida, mantenimiento de piscina, jardinería básica y atención concierge 24/7 para huéspedes VIP.</p>
            
            ${racText}

            ${contractCustomClauses.trim() ? `
              <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLÁUSULA ADICIONAL PACTADA</h3>
              <p style="white-space: pre-wrap; font-style: italic;">${contractCustomClauses}</p>
            ` : ""}

            <div style="margin-top: 80px; display: flex; justify-content: space-between;">
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>IMAGINE S.A.</strong><br/>${finalRepName}<br/>Cédula Jurídica: ${finalRepId}</p>
              </div>
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>${finalCounterpartName}</strong><br/>${counterpartRoleTextEs}<br/>ID: ${finalCounterpartId}</p>
              </div>
            </div>
          </div>
        `;
      } else {
        content = `
          <div style="font-family: 'Playfair Display', serif; padding: 40px; color: #02140f; background: #fff; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #02140f; font-size: 22px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 2px;">PROPERTY MANAGEMENT AGREEMENT</h1>
              <p style="color: #d4af37; font-size: 12px; text-transform: uppercase; letter-spacing: 3px;">IMAGINE REAL ESTATE & PROPERTY MANAGEMENT S.A.</p>
            </div>
            
            <p>In San José, Costa Rica, on <strong>${dateStr}</strong>, this property management agreement is entered into by and between:</p>
            <p>On one part, <strong>IMAGINE REAL ESTATE & PROPERTY MANAGEMENT S.A.</strong>, Corporate ID No. <strong>${finalRepId}</strong>, represented by Mr. <strong>${finalRepName}</strong> (the "MANAGER"), and on the other part, <strong>${finalCounterpartName}</strong>, ID / Passport No. <strong>${finalCounterpartId}</strong>, phone <strong>${finalCounterpartPhone}</strong>, email <strong>${finalCounterpartEmail}</strong> (the "<strong>${counterpartRoleTextEn}</strong>").</p>
            
            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLAUSE ONE: OBJECT OF AGREEMENT & REGISTRY DATA</h3>
            <p>The counterpart delivers under property management the estate named <strong>"${finalPropertyName}"</strong>, located in <strong>${finalPropertyLocation}</strong>, registered under <strong>Property Finca ID: ${finalFincaNum}</strong> and <strong>Cataster Survey Map: ${finalCatasterNum}</strong>.</p>
            
            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLAUSE TWO: MANAGEMENT FEE</h3>
            <p>The Manager shall receive a management fee of <strong>${contractCommission}%</strong> of gross rental receipts during the contract term.</p>
            
            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLAUSE THREE: CONTRACT TERM</h3>
            <p>The term shall be <strong>${contractTerm} months</strong> from execution date.</p>

            ${racText}

            ${contractCustomClauses.trim() ? `
              <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">ADDITIONAL AGREED COVENANT</h3>
              <p style="white-space: pre-wrap; font-style: italic;">${contractCustomClauses}</p>
            ` : ""}

            <div style="margin-top: 80px; display: flex; justify-content: space-between;">
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>IMAGINE S.A.</strong><br/>${finalRepName}<br/>Manager ID: ${finalRepId}</p>
              </div>
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>${finalCounterpartName}</strong><br/>${counterpartRoleTextEn}<br/>ID: ${finalCounterpartId}</p>
              </div>
            </div>
          </div>
        `;
      }
    } else if (contractType === "exclusive") {
      if (contractLang === "es") {
        content = `
          <div style="font-family: 'Playfair Display', serif; padding: 40px; color: #02140f; background: #fff; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #02140f; font-size: 22px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 2px;">CONTRATO DE CORRETAJE Y COMERCIALIZACIÓN EXCLUSIVA</h1>
              <p style="color: #d4af37; font-size: 12px; text-transform: uppercase; letter-spacing: 3px;">IMAGINE REAL ESTATE & PROPERTY MANAGEMENT S.A.</p>
            </div>
            
            <p>En Costa Rica, al día <strong>${dateStr}</strong>, se suscribe el presente acuerdo entre <strong>IMAGINE S.A.</strong>, cédula jurídica N° <strong>${finalRepId}</strong>, representada por <strong>${finalRepName}</strong> (el "CORREDOR"), y <strong>${finalCounterpartName}</strong>, cédula N° <strong>${finalCounterpartId}</strong> (el/la "<strong>${counterpartRoleTextEs}</strong>"), para la promoción y venta exclusiva del siguiente inmueble:</p>
            <p style="background: #f7f9f8; padding: 15px; border-left: 3px solid #d4af37; font-size: 12px;">
              <strong>Nombre de la Propiedad:</strong> ${finalPropertyName}<br/>
              <strong>Ubicación Geográfica:</strong> ${finalPropertyLocation}<br/>
              <strong>Finca Registrada N°:</strong> ${finalFincaNum}<br/>
              <strong>Plano Catastro N°:</strong> ${finalCatasterNum}<br/>
              <strong>Precio Sugerido de Venta:</strong> $${propertyPrice ? propertyPrice.toLocaleString("en-US") : "___________"} USD
            </p>
            
            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLÁUSULA PRIMERA: DERECHO DE EXCLUSIVIDAD</h3>
            <p>La contraparte concede al CORREDOR el derecho exclusivo para promocionar y negociar la venta de la propiedad por un período de <strong>${contractTerm} meses</strong> naturales.</p>
            
            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLÁUSULA SEGUNDA: HONORARIOS DE CORRETAJE</h3>
            <p>En caso de concretarse la venta, los honorarios correspondientes al CORREDOR serán del <strong>${contractCommission}% + IVA</strong> sobre el precio final de cierre pactado, pagaderos en el acto del traspaso notarial.</p>
            
            ${racText}

            ${contractCustomClauses.trim() ? `
              <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLÁUSULA ADICIONAL PACTADA</h3>
              <p style="white-space: pre-wrap; font-style: italic;">${contractCustomClauses}</p>
            ` : ""}

            <div style="margin-top: 80px; display: flex; justify-content: space-between;">
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>IMAGINE S.A.</strong><br/>${finalRepName}<br/>Corredor Autorizado</p>
              </div>
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>${finalCounterpartName}</strong><br/>${counterpartRoleTextEs}<br/>ID: ${finalCounterpartId}</p>
              </div>
            </div>
          </div>
        `;
      } else {
        content = `
          <div style="font-family: 'Playfair Display', serif; padding: 40px; color: #02140f; background: #fff; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #02140f; font-size: 22px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 2px;">EXCLUSIVE REAL ESTATE LISTING AGREEMENT</h1>
              <p style="color: #d4af37; font-size: 12px; text-transform: uppercase; letter-spacing: 3px;">IMAGINE REAL ESTATE & PROPERTY MANAGEMENT S.A.</p>
            </div>
            
            <p>By and between <strong>IMAGINE S.A.</strong> (the "BROKER") and <strong>${finalCounterpartName}</strong>, ID No. <strong>${finalCounterpartId}</strong> (the "<strong>${counterpartRoleTextEn}</strong>"), exclusive representation is granted for property <strong>"${finalPropertyName}"</strong> listed at <strong>$${propertyPrice ? propertyPrice.toLocaleString("en-US") : "___________"} USD</strong>.</p>

            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">FIRST CLAUSE: COMMISSION & SALES PRICE</h3>
            <p>The counterpart agrees to pay the BROKER a success fee of <strong>${contractCommission}% + VAT</strong> upon closing of the sale transaction.</p>

            ${racText}

            <div style="margin-top: 80px; display: flex; justify-content: space-between;">
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>IMAGINE S.A.</strong><br/>${finalRepName}<br/>Broker</p>
              </div>
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>${finalCounterpartName}</strong><br/>${counterpartRoleTextEn}<br/>ID: ${finalCounterpartId}</p>
              </div>
            </div>
          </div>
        `;
      }
    } else if (contractType === "commission") {
      if (contractLang === "es") {
        content = `
          <div style="font-family: 'Playfair Display', serif; padding: 40px; color: #02140f; background: #fff; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #02140f; font-size: 22px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 2px;">CONTRATO DE RECONOCIMIENTO DE COMISIÓN E INTERMEDIACIÓN</h1>
              <p style="color: #d4af37; font-size: 12px; text-transform: uppercase; letter-spacing: 3px;">IMAGINE REAL ESTATE & PROPERTY MANAGEMENT S.A.</p>
            </div>
            
            <p>En la ciudad de San José, Costa Rica, al día <strong>${dateStr}</strong>, se suscribe el presente acuerdo de honorarios de intermediación entre:</p>
            <p>Por una parte, <strong>IMAGINE REAL ESTATE & PROPERTY MANAGEMENT S.A.</strong>, cédula jurídica N° <strong>${finalRepId}</strong>, representada por <strong>${finalRepName}</strong> (el "CORREDOR INTERMEDIARIO"), y por la otra parte, <strong>${finalCounterpartName}</strong>, cédula N° <strong>${finalCounterpartId}</strong>, teléfono <strong>${finalCounterpartPhone}</strong> y correo <strong>${finalCounterpartEmail}</strong> (en adelante la "<strong>CONTRAPARTE: ${counterpartRoleTextEs}</strong>").</p>

            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLÁUSULA PRIMERA: PORCENTAJE DE COMISIÓN O MONTO PACTADO</h3>
            <p>La CONTRAPARTE reconoce formal e irrevocablemente a favor del CORREDOR INTERMEDIARIO una comisión de éxito equivalente al <strong>${contractCommission}% + IVA</strong> (o bien el monto acordado) sobre el valor total de cierre negociado para la propiedad <strong>"${finalPropertyName}"</strong> (Finca N°: ${finalFincaNum}, Plano N°: ${finalCatasterNum}).</p>

            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLÁUSULA SEGUNDA: MOMENTO Y FORMA DE LIQUIDACIÓN</h3>
            <p>La comisión acordada será liquidada y girada de forma directa en el acto del otorgamiento de la escritura notarial de traspaso o cierre definitivo de la transacción.</p>

            ${racText}

            ${contractCustomClauses.trim() ? `
              <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">CLÁUSULA ADICIONAL PACTADA</h3>
              <p style="white-space: pre-wrap; font-style: italic;">${contractCustomClauses}</p>
            ` : ""}

            <div style="margin-top: 80px; display: flex; justify-content: space-between;">
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>IMAGINE S.A.</strong><br/>${finalRepName}<br/>Corredor Intermediario</p>
              </div>
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>${finalCounterpartName}</strong><br/>${counterpartRoleTextEs}<br/>ID: ${finalCounterpartId}</p>
              </div>
            </div>
          </div>
        `;
      } else {
        content = `
          <div style="font-family: 'Playfair Display', serif; padding: 40px; color: #02140f; background: #fff; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #02140f; font-size: 22px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 2px;">REAL ESTATE COMMISSION & FEE AGREEMENT</h1>
              <p style="color: #d4af37; font-size: 12px; text-transform: uppercase; letter-spacing: 3px;">IMAGINE REAL ESTATE & PROPERTY MANAGEMENT S.A.</p>
            </div>
            
            <p>By and between <strong>IMAGINE S.A.</strong> (the "BROKER") and <strong>${finalCounterpartName}</strong>, ID No. <strong>${finalCounterpartId}</strong> (the "<strong>${counterpartRoleTextEn}</strong>"), regarding brokerage fee terms for property <strong>"${finalPropertyName}"</strong>.</p>

            <h3 style="color: #02140f; margin-top: 30px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">FIRST CLAUSE: COMMISSION FEE</h3>
            <p>The counterpart agrees to pay the BROKER a commission of <strong>${contractCommission}% + VAT</strong> upon property closing.</p>

            ${racText}

            <div style="margin-top: 80px; display: flex; justify-content: space-between;">
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>IMAGINE S.A.</strong><br/>${finalRepName}<br/>Broker</p>
              </div>
              <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 10px; font-size: 11px;">
                <p><strong>${finalCounterpartName}</strong><br/>${counterpartRoleTextEn}<br/>ID: ${finalCounterpartId}</p>
              </div>
            </div>
          </div>
        `;
      }
    }

    setGeneratedContractHtml(content);
  };

  const handlePrintContract = () => {
    if (!generatedContractHtml) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Contrato Legal Imagine RE</title>
          <style>
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body style="padding: 40px; background: #fff;">
          ${generatedContractHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const triggerEmailContract = () => {
    setContractEmailStatus(
      lang === "es" 
        ? `Documento preparado para envío a ${counterpartEmail || "cliente"}. Enlace de descarga adjuntado.` 
        : `Document prepared for email to ${counterpartEmail || "client"}.`
    );
    setTimeout(() => setContractEmailStatus(null), 5000);
  };

  const triggerWhatsAppContract = () => {
    const docName = contractType === "pm" 
      ? (lang === "es" ? "Contrato de Administración de Propiedad" : "Property Management Agreement")
      : contractType === "exclusive"
      ? (lang === "es" ? "Contrato de Exclusividad de Venta" : "Exclusive Brokerage Agreement")
      : (lang === "es" ? "Acuerdo de Comisión de Intermediación" : "Commission Fee Agreement");

    const message = lang === "es"
      ? `Estimado/a ${counterpartName || "Cliente"},\n\nEs un placer saludarle de parte de IMAGINE Real Estate. Le adjuntamos para su revisión el borrador del ${docName} para la propiedad "${propertyName || "solicitada"}" bajo las condiciones acordadas (${contractCommission}% de comisión y plazo de ${contractTerm} meses).\n\nQuedamos a su disposición para cualquier consulta.\n\nAtentamente,\n${contractRepName}\nIMAGINE Real Estate`
      : `Dear ${counterpartName || "Client"},\n\nGreetings from IMAGINE Real Estate. We have prepared and attached the draft of the ${docName} for property "${propertyName}" for your review under agreed terms (${contractCommission}% commission).\n\nBest regards,\n${contractRepName}\nIMAGINE Real Estate`;

    const targetPhone = counterpartPhone || "";
    const url = `https://api.whatsapp.com/send?phone=${encodeURIComponent(targetPhone)}&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      {/* Form parameters */}
      <div 
        className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 flex flex-col justify-between h-fit shadow-md"
      >
        <div className="space-y-4">
          <h3 className="font-serif text-lg text-pearl mb-4 border-b border-white/10 pb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="text-[#d4af37]" size={20} />
              {lang === "es" ? "Generador de Contratos Legales" : "Legal Contract Automator"}
            </span>
            <span className="text-[9px] text-gray-400 font-mono uppercase tracking-widest">{lang === "es" ? "Entrada Flexible" : "Flexible Input"}</span>
          </h3>

          {/* Quick Dropdowns to Auto-Fill */}
          <div className="grid grid-cols-2 gap-4 bg-[#01140f] p-3 rounded-xl border border-white/5">
            <div>
              <label className="block text-[9.5px] uppercase tracking-wider text-[#d4af37] font-semibold mb-1">
                {lang === "es" ? "Auto-Completar desde Lead" : "Auto-Fill from Lead"}
              </label>
              <select
                value={selectedContractLead}
                onChange={e => setSelectedContractLead(e.target.value)}
                className="w-full bg-[#021812] border border-white/10 text-pearl text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#d4af37] cursor-pointer"
              >
                <option value="">{lang === "es" ? "-- Elegir de lista CRM --" : "-- Select CRM Lead --"}</option>
                {leads.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[9.5px] uppercase tracking-wider text-[#d4af37] font-semibold mb-1">
                {lang === "es" ? "Auto-Completar desde Inmueble" : "Auto-Fill from Inventory"}
              </label>
              <select
                value={selectedContractProp}
                onChange={e => setSelectedContractProp(e.target.value)}
                className="w-full bg-[#021812] border border-white/10 text-pearl text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#d4af37] cursor-pointer"
              >
                <option value="">{lang === "es" ? "-- Elegir propiedad --" : "-- Select Property --"}</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Contract Template & Language */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">
                {lang === "es" ? "Tipo de Contrato" : "Contract Type"}
              </label>
              <select
                value={contractType}
                onChange={e => setContractType(e.target.value as any)}
                className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#d4af37] cursor-pointer"
              >
                <option value="pm">{lang === "es" ? "Administración de Propiedad (PM)" : "Property Management (PM)"}</option>
                <option value="exclusive">{lang === "es" ? "Exclusividad de Corretaje" : "Exclusive Brokerage"}</option>
                <option value="commission">{lang === "es" ? "Reconocimiento de Comisión" : "Commission Agreement"}</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">
                {lang === "es" ? "Tipo de Contraparte" : "Counterpart Role"}
              </label>
              <select
                value={counterpartType}
                onChange={e => setCounterpartType(e.target.value as any)}
                className="w-full bg-[#01140f] border border-white/10 text-[#d4af37] font-bold text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#d4af37] cursor-pointer"
              >
                <option value="owner">{lang === "es" ? "Propietario Directo" : "Direct Owner"}</option>
                <option value="broker">{lang === "es" ? "Corredor Co-Broker" : "Real Estate Co-Broker"}</option>
                <option value="developer">{lang === "es" ? "Desarrollador / Empresa" : "Developer / Principal"}</option>
              </select>
            </div>
          </div>

          {/* Counterpart Person Details */}
          <div className="space-y-3 p-4 bg-white/5 border border-white/10 rounded-xl">
            <h4 className="text-[10px] uppercase tracking-wider text-[#d4af37] font-bold flex items-center gap-1.5">
              <UserCheck size={14} />
              {lang === "es" ? "Datos de la Contraparte (Opcional o Rellenable)" : "Counterpart Details (Optional/Fillable)"}
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                  {lang === "es" ? "Nombre de Persona / Empresa" : "Full Name / Company"}
                </label>
                <input
                  type="text"
                  value={counterpartName}
                  onChange={e => setCounterpartName(e.target.value)}
                  placeholder="e.g. Maria Delgado / Inversiones S.A."
                  className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3 py-2 rounded-xl outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                  {lang === "es" ? "Cédula Física / Jurídica / ID" : "ID / Passport / Corp Tax ID"}
                </label>
                <input
                  type="text"
                  value={counterpartId}
                  onChange={e => setCounterpartId(e.target.value)}
                  placeholder="e.g. 1-1234-5678 (o vacíos para línea en blanco)"
                  className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3 py-2 rounded-xl outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                  {lang === "es" ? "Teléfono de Contacto" : "Phone Number"}
                </label>
                <input
                  type="text"
                  value={counterpartPhone}
                  onChange={e => setCounterpartPhone(e.target.value)}
                  placeholder="+506 8888-9999"
                  className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3 py-2 rounded-xl outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                  {lang === "es" ? "Correo Electrónico" : "Email Address"}
                </label>
                <input
                  type="email"
                  value={counterpartEmail}
                  onChange={e => setCounterpartEmail(e.target.value)}
                  placeholder="cliente@ejemplo.com"
                  className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3 py-2 rounded-xl outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-3 p-4 bg-white/5 border border-white/10 rounded-xl">
            <h4 className="text-[10px] uppercase tracking-wider text-[#d4af37] font-bold flex items-center gap-1.5">
              <ShieldCheck size={14} />
              {lang === "es" ? "Datos Registrales del Inmueble (Opcional)" : "Property Registry Data (Optional)"}
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                  {lang === "es" ? "Nombre de la Propiedad" : "Property Name"}
                </label>
                <input
                  type="text"
                  value={propertyName}
                  onChange={e => setPropertyName(e.target.value)}
                  placeholder="e.g. Villa Morpho"
                  className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3 py-2 rounded-xl outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                  {lang === "es" ? "Ubicación / Dirección" : "Location / Address"}
                </label>
                <input
                  type="text"
                  value={propertyLocation}
                  onChange={e => setPropertyLocation(e.target.value)}
                  placeholder="e.g. Papagayo, Guanacaste"
                  className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3 py-2 rounded-xl outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                  {lang === "es" ? "Número de Finca Registrada" : "Registry Finca Number"}
                </label>
                <input
                  type="text"
                  value={fincaNum}
                  onChange={e => setFincaNum(e.target.value)}
                  placeholder="e.g. 5-123456-000"
                  className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3 py-2 rounded-xl outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                  {lang === "es" ? "Número de Plano Catastro" : "Cataster Map Number"}
                </label>
                <input
                  type="text"
                  value={catasterNum}
                  onChange={e => setCatasterNum(e.target.value)}
                  placeholder="e.g. G-9876543-2024"
                  className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3 py-2 rounded-xl outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          </div>

          {/* Negotiated Terms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">
                {lang === "es" ? "Comisión Negociada (%)" : "Negotiated Commission (%)"}
              </label>
              <input
                type="number"
                step="0.1"
                value={contractCommission}
                onChange={e => setContractCommission(Number(e.target.value))}
                className="w-full bg-[#01140f] border border-white/10 text-[#d4af37] font-bold text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">
                {lang === "es" ? "Plazo de Vigencia (Meses)" : "Validity Term (Months)"}
              </label>
              <input
                type="number"
                value={contractTerm}
                onChange={e => setContractTerm(Number(e.target.value))}
                className="w-full bg-[#01140f] border border-white/10 text-[#d4af37] font-bold text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">
                {lang === "es" ? "Representante Imagine" : "Imagine Legal Rep"}
              </label>
              <input
                type="text"
                value={contractRepName}
                onChange={e => setContractRepName(e.target.value)}
                className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">
                {lang === "es" ? "Cédula Rep. Imagine" : "Rep ID Number"}
              </label>
              <input
                type="text"
                value={contractRepId}
                onChange={e => setContractRepId(e.target.value)}
                className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* ADR / RAC Checkbox */}
          <div className="bg-[#01140f] border border-white/5 rounded-xl p-3 flex items-center justify-between">
            <div>
              <label className="block text-[9.5px] uppercase font-bold text-pearl tracking-wider">
                {lang === "es" ? "Resolución Alterna de Conflictos (RAC)" : "Alternative Dispute Resolution (RAC)"}
              </label>
              <p className="text-[8px] text-gray-400 mt-0.5 leading-relaxed">
                {lang === "es" ? "Someter controversias a arbitraje en la Cámara de Comercio de Costa Rica." : "Submit contract claims to Costa Rican CCA arbitration."}
              </p>
            </div>
            <input 
              type="checkbox"
              checked={includeRac}
              onChange={e => setIncludeRac(e.target.checked)}
              className="accent-[#d4af37] w-4 h-4 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">
              {lang === "es" ? "Cláusulas Especiales Adicionales" : "Special Additional Clauses"}
            </label>
            <textarea
              value={contractCustomClauses}
              onChange={e => setContractCustomClauses(e.target.value)}
              placeholder={
                lang === "es"
                  ? "Cláusulas adicionales negociadas que se insertarán al final del contrato..."
                  : "Special negotiated clauses to insert at the end of the contract..."
              }
              rows={2}
              className="w-full bg-[#01140f] border border-white/10 text-pearl text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#d4af37] font-sans resize-none"
            />
          </div>

          {/* Bypass Info Banner */}
          <div className="bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-xl p-3 text-[10px] text-gray-300 flex items-start gap-2 font-sans">
            <Info size={16} className="text-[#d4af37] flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {lang === "es" 
                ? "Generación flexible: Si no posees algún dato en este momento (ej. número de finca o cédula), puedes hacer clic abajo para generar el borrador. Los espacios faltantes se completarán automáticamente con líneas en blanco (________________________) para rellenar a mano."
                : "Flexible generation: If you don't have certain details right now (e.g. ID or Finca No.), click below to generate. Missing fields will auto-fill with blank lines (________________________) to complete by hand."
              }
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={generateLegalContract}
          className="w-full bg-[#d4af37] text-[#02140f] hover:bg-white text-xs py-3.5 rounded-xl uppercase tracking-widest font-bold cursor-pointer text-center mt-4 transition shadow-md"
        >
          {lang === "es" ? "Generar Contrato Legal (Borrador Directo)" : "Generate Legal Contract (Direct Draft)"}
        </button>
      </div>

      {/* Preview and Export */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between h-[750px] overflow-hidden shadow-md">
        <div className="flex-1 flex flex-col min-h-0">
          <h3 className="font-serif text-lg text-pearl mb-4 border-b border-white/10 pb-3 flex items-center justify-between">
            <span>{lang === "es" ? "Vista Previa de Impresión PDF" : "PDF Print Document Preview"}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setContractLang("es")}
                className={`px-2.5 py-1 rounded text-[9px] font-mono font-bold uppercase transition ${contractLang === "es" ? "bg-[#d4af37] text-black" : "text-gray-400 hover:text-white"}`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => setContractLang("en")}
                className={`px-2.5 py-1 rounded text-[9px] font-mono font-bold uppercase transition ${contractLang === "en" ? "bg-[#d4af37] text-black" : "text-gray-400 hover:text-white"}`}
              >
                EN
              </button>
            </div>
          </h3>
          
          {generatedContractHtml ? (
            <div 
              className="border border-white/10 rounded-xl overflow-hidden overflow-y-auto bg-white flex-1 min-h-[300px]"
              dangerouslySetInnerHTML={{ __html: generatedContractHtml }}
            />
          ) : (
            <div className="py-24 text-center text-xs text-gray-400 font-light italic flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl">
              {lang === "es" 
                ? "Haz clic en 'Generar Contrato Legal (Borrador Directo)' para visualizar el documento..."
                : "Click 'Generate Legal Contract (Direct Draft)' to review the document..."
              }
            </div>
          )}
        </div>

        {contractEmailStatus && (
          <div className="mt-4 p-3 bg-black/60 rounded-xl border border-white/10 text-[10px] font-mono text-emerald-400 text-center">
            {contractEmailStatus}
          </div>
        )}

        {generatedContractHtml && (
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handlePrintContract}
              className="w-full border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-jungle text-xs py-3 rounded-xl uppercase tracking-widest font-bold cursor-pointer text-center flex items-center justify-center gap-2 transition"
            >
              <Download size={14} />
              {lang === "es" ? "Descargar / Imprimir Contrato PDF" : "Download / Print Contract PDF"}
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={triggerEmailContract}
                className="bg-[#032219] hover:bg-[#043326] border border-white/10 text-pearl text-[10px] py-2.5 rounded-xl uppercase tracking-widest font-bold cursor-pointer text-center flex items-center justify-center gap-1.5 transition"
              >
                <Send size={12} className="text-[#d4af37]" />
                {lang === "es" ? "Enviar por Correo" : "Send via Email"}
              </button>
              
              <button
                type="button"
                onClick={triggerWhatsAppContract}
                className="bg-emerald-700 hover:bg-emerald-600 border border-emerald-600/30 text-pearl text-[10px] py-2.5 rounded-xl uppercase tracking-widest font-bold cursor-pointer text-center flex items-center justify-center gap-1.5 transition"
              >
                <MessageCircle size={12} />
                WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
