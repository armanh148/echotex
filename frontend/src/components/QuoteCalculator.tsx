import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Building2, 
  Mail, 
  Tag 
} from 'lucide-react';
import { useStore } from '../store/useStore';

interface QuoteCalculatorProps {
  initialProductId?: string;
  onNavigateToContact?: () => void;
}

interface BagModel {
  id: string;
  name: string;
  sub: string;
  basePrice: number;
  gsm: string;
  tierPricing: { minQty: number; price: number }[];
  plasticSavedPerUnit: number;
}

const BAG_MODELS: BagModel[] = [
  {
    id: 'eco-loop',
    name: 'Eco-Loop Reusable T-Shirt Bag',
    sub: '80 GSM Virgin PP · 12″ × 7″ × 22″',
    basePrice: 0.20,
    gsm: '80 GSM Non-Woven PP',
    tierPricing: [
      { minQty: 500, price: 0.26 },
      { minQty: 2500, price: 0.22 },
      { minQty: 10000, price: 0.21 },
      { minQty: 25000, price: 0.205 },
      { minQty: 50000, price: 0.20 }
    ],
    plasticSavedPerUnit: 0.036
  },
  {
    id: 'compostable-dcut',
    name: 'Compostable Bio-Gusset D-Cut Bag',
    sub: '65 GSM Bio-PLA Resin · 10″ × 14″ + 3″',
    basePrice: 0.28,
    gsm: '65 GSM Certified Bio-PLA',
    tierPricing: [
      { minQty: 500, price: 0.36 },
      { minQty: 2500, price: 0.31 },
      { minQty: 10000, price: 0.29 },
      { minQty: 25000, price: 0.285 },
      { minQty: 50000, price: 0.28 }
    ],
    plasticSavedPerUnit: 0.048
  },
  {
    id: 'signature-box',
    name: 'Signature-Box Heavy-Duty Shopper',
    sub: '100 GSM Non-Woven · 16″ × 6″ × 12″',
    basePrice: 0.42,
    gsm: '100 GSM Ultrasonic Boxed',
    tierPricing: [
      { minQty: 500, price: 0.54 },
      { minQty: 2500, price: 0.46 },
      { minQty: 10000, price: 0.44 },
      { minQty: 25000, price: 0.43 },
      { minQty: 50000, price: 0.42 }
    ],
    plasticSavedPerUnit: 0.075
  },
  {
    id: 'laminated-gift',
    name: 'Gloss & Matte Laminated Gift Tote',
    sub: '120 GSM OPP Lamination · 14″ × 4″ × 14″',
    basePrice: 0.55,
    gsm: '120 GSM Laminated OPP',
    tierPricing: [
      { minQty: 500, price: 0.72 },
      { minQty: 2500, price: 0.62 },
      { minQty: 10000, price: 0.58 },
      { minQty: 25000, price: 0.56 },
      { minQty: 50000, price: 0.55 }
    ],
    plasticSavedPerUnit: 0.095
  },
  {
    id: 'thermal-insulated',
    name: 'Thermal Insulated Non-Woven Grocery Bag',
    sub: '120 GSM + 2mm EPE Foam · 13″ × 10″ × 15″',
    basePrice: 1.15,
    gsm: '120 GSM + 2mm EPE Foam',
    tierPricing: [
      { minQty: 500, price: 1.45 },
      { minQty: 2500, price: 1.28 },
      { minQty: 10000, price: 1.22 },
      { minQty: 25000, price: 1.18 },
      { minQty: 50000, price: 1.15 }
    ],
    plasticSavedPerUnit: 0.160
  },
  {
    id: 'circa-tex-wipers',
    name: 'Circa-Tex Reclaimed Wiping Cloths',
    sub: '100% Recycled Cotton Knit · 50 lb Box',
    basePrice: 0.85,
    gsm: '180 GSM Post-Industrial Cotton',
    tierPricing: [
      { minQty: 500, price: 1.10 },
      { minQty: 2500, price: 0.95 },
      { minQty: 10000, price: 0.90 },
      { minQty: 25000, price: 0.87 },
      { minQty: 50000, price: 0.85 }
    ],
    plasticSavedPerUnit: 0.120
  }
];

const PRINT_OPTIONS = [
  { id: 'blank', label: 'Blank Stock', addon: 0.00, plateFee: 0, leadWeeks: 1.5, desc: 'Unprinted stock inventory' },
  { id: '1-color', label: '1-Color 1-Side', addon: 0.05, plateFee: 65, leadWeeks: 2.5, desc: 'Single PMS precision flexo' },
  { id: '2-color', label: '2-Color 2-Sides', addon: 0.09, plateFee: 120, leadWeeks: 3.0, desc: 'Dual-side registration print' },
  { id: 'cmyk', label: 'Full Process CMYK', addon: 0.16, plateFee: 240, leadWeeks: 3.5, desc: 'Photographic rotogravure' }
];

export const QuoteCalculator: React.FC<QuoteCalculatorProps> = ({
  initialProductId,
  onNavigateToContact
}) => {
  const { siteSettings, createQuote, products } = useStore();
  const quoteCalcConfig = siteSettings?.quoteCalcConfig;

  const models = useMemo(() => {
    if (products && products.length > 0) {
      return products.map((p) => ({
        id: p.id,
        name: p.name,
        sub: `${p.gsm || 80} GSM · ${p.dimensions || '12"W x 14"H'}`,
        basePrice: p.pricePerUnit,
        gsm: `${p.gsm || 80} GSM ${p.material || 'Non-Woven'}`,
        tierPricing: (p.volumeTiers && p.volumeTiers.length > 0)
          ? p.volumeTiers.map((t) => ({ minQty: t.minQty, price: t.price }))
          : [
              { minQty: p.moq || 500, price: p.pricePerUnit },
              { minQty: (p.moq || 500) * 2, price: Math.max(0.05, p.pricePerUnit * 0.9) },
              { minQty: (p.moq || 500) * 5, price: Math.max(0.04, p.pricePerUnit * 0.8) }
            ],
        plasticSavedPerUnit: 0.045
      }));
    }
    return BAG_MODELS;
  }, [products]);

  const [selectedBagId, setSelectedBagId] = useState<string>(() => initialProductId || models[0]?.id || 'eco-loop');
  const [volume, setVolume] = useState<number>(2500);
  const [selectedPrintId, setSelectedPrintId] = useState<string>('1-color');
  const [companyName, setCompanyName] = useState<string>('');
  const [procurementEmail, setProcurementEmail] = useState<string>('');
  const [rfqSubmitted, setRfqSubmitted] = useState<boolean>(false);

  const selectedBag = useMemo(
    () => models.find((b) => b.id === selectedBagId) || models[0],
    [models, selectedBagId]
  );

  const selectedPrint = useMemo(
    () => PRINT_OPTIONS.find((p) => p.id === selectedPrintId) || PRINT_OPTIONS[1],
    [selectedPrintId]
  );

  // Dynamic calculations
  const quoteSummary = useMemo(() => {
    let basePrice = selectedBag.basePrice;
    for (const tier of selectedBag.tierPricing) {
      if (volume >= tier.minQty) {
        basePrice = tier.price;
      }
    }

    const unitPrice = Number((basePrice + selectedPrint.addon).toFixed(2));
    const subtotal = Number((unitPrice * volume).toFixed(2));
    const feeThreshold = quoteCalcConfig?.freeFreightThreshold || 25000;
    const basePlateFee = selectedPrint.id === 'blank' ? 0 : (quoteCalcConfig?.plateFee ?? selectedPrint.plateFee);
    const plateFee = volume >= feeThreshold ? 0 : basePlateFee;
    const totalCost = Number((subtotal + plateFee).toFixed(2));
    const plasticSavedLbs = Math.round(volume * selectedBag.plasticSavedPerUnit);

    const leadTimeStr = selectedPrint.id === 'blank' 
      ? (quoteCalcConfig?.leadTimeBlank || `${selectedPrint.leadWeeks} Weeks`)
      : (quoteCalcConfig?.leadTimeCustom || `${selectedPrint.leadWeeks} Weeks`);

    return {
      unitPrice,
      subtotal,
      plateFee,
      totalCost,
      leadTimeWeeks: leadTimeStr,
      plasticSavedLbs
    };
  }, [selectedBag, volume, selectedPrint, quoteCalcConfig]);

  const handleGenerateRfq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !procurementEmail.trim()) return;

    // Persist RFQ to Zustand global store & Admin RFQ Inbox
    createQuote({
      name: companyName,
      company: companyName,
      email: procurementEmail,
      bagType: `${selectedBag.name} (${selectedPrint.label})`,
      quantity: volume,
      volume: `${volume.toLocaleString()} units`,
      printing: selectedPrint.label,
      message: `Configured via Instant Volume Estimator: ${volume.toLocaleString()} units, Subtotal: $${quoteSummary.subtotal}, Setup Fee: $${quoteSummary.plateFee}, Total: $${quoteSummary.totalCost}. Delivery: ${quoteSummary.leadTimeWeeks}`,
      status: 'New'
    });

    setRfqSubmitted(true);
  };

  return (
    <section id="wholesale-quote" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dcfce7] text-[#166534] text-xs font-bold tracking-wider uppercase mb-3">
            <Calculator className="w-3.5 h-3.5 text-[#22c55e]" />
            <span>OEM Direct Pricing Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight">
            Instant Custom Branding & Volume Estimator
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            Configure your exact packaging requirements below. Receive real-time volume tier discounts and export-grade FOB specification estimates.
          </p>
        </div>

        {/* 2-Column Configurator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Step 1 - Configure Your Bag Order */}
          <div className="lg:col-span-7 bg-[#f8fafc] p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
            
            <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-[#166534] text-white flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0f172a]">
                  Step 1: Configure Your Bag Order
                </h3>
                <p className="text-xs text-slate-500">
                  Select bag geometry, target volume, and printing specification.
                </p>
              </div>
            </div>

            {/* Bag Model Selector (6 Options) */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Select Bag Model
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {models.map((bag) => {
                  const isSelected = selectedBagId === bag.id;
                  return (
                    <button
                      key={bag.id}
                      type="button"
                      onClick={() => setSelectedBagId(bag.id)}
                      className={`p-3.5 text-left rounded-xl border transition-all text-xs flex flex-col justify-between cursor-pointer relative ${
                        isSelected
                          ? 'border-[#166534] bg-white ring-2 ring-[#166534]/20 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
                      }`}
                    >
                      <div className="pr-6">
                        <strong className="block font-bold text-[#0f172a] text-xs leading-snug">
                          {bag.name}
                        </strong>
                        <span className="text-[11px] text-slate-500 font-mono block mt-1">
                          {bag.sub}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="font-mono text-[#166534] font-bold text-xs">
                          From ${bag.basePrice.toFixed(2)} / pc
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {bag.gsm}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#166534] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Production Volume Slider & Quick Pills */}
            <div className="mb-6 pt-5 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Target Production Volume
                </label>
                <div className="font-mono text-base font-bold text-[#166534] bg-[#dcfce7] px-3 py-0.5 rounded-full border border-[#22c55e]/30">
                  {volume.toLocaleString()} units
                </div>
              </div>

              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                aria-label="Target Production Volume Slider"
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#166534]"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
                <span>500 (MOQ)</span>
                <span>10,000</span>
                <span>25,000</span>
                <span>50,000+</span>
              </div>

              {/* Quick Pills: [500], [2.5K], [10K], [25K], [50K+] */}
              <div className="flex items-center gap-2 mt-3.5">
                <span className="text-[11px] text-slate-500 font-medium mr-1">Quick Select:</span>
                {[
                  { label: '500', val: 500 },
                  { label: '2.5K', val: 2500 },
                  { label: '10K', val: 10000 },
                  { label: '25K', val: 25000 },
                  { label: '50K+', val: 50000 }
                ].map((pill) => {
                  const isActive = volume === pill.val;
                  return (
                    <button
                      key={pill.label}
                      type="button"
                      onClick={() => setVolume(pill.val)}
                      className={`px-3 py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      [{pill.label}]
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Printing & Logo Imprint Selector */}
            <div className="pt-5 border-t border-slate-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Custom Printing & Logo Imprint
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PRINT_OPTIONS.map((opt) => {
                  const isSelected = selectedPrintId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedPrintId(opt.id)}
                      className={`p-3 text-left rounded-xl border text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#166534] text-white border-[#166534] shadow-md'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <strong className="block text-xs font-bold">{opt.label}</strong>
                      <span className={`text-[10px] block mt-1 leading-tight ${
                        isSelected ? 'text-[#dcfce7]' : 'text-slate-400'
                      }`}>
                        {opt.desc}
                      </span>
                      <span className={`text-[10px] font-mono block mt-2 font-semibold ${
                        isSelected ? 'text-[#22c55e]' : 'text-[#166534]'
                      }`}>
                        {opt.addon === 0 ? 'No Add-on' : `+$${opt.addon.toFixed(2)} / pc`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Dynamic Quote Summary Card */}
          <div className="lg:col-span-5 bg-[#0e3d24] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#166534]/50 sticky top-24">
            
            {/* Top Header: Estimated Wholesale Unit Price */}
            <div className="pb-5 border-b border-white/15">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#22c55e] block mb-1">
                ESTIMATED WHOLESALE UNIT PRICE
              </span>
              
              <div className="flex items-baseline justify-between">
                <div className="text-4xl sm:text-5xl font-extrabold font-mono text-[#22c55e] tracking-tight tabular-nums">
                  ${quoteSummary.unitPrice.toFixed(2)}
                </div>
                <span className="text-xs text-slate-300 font-mono">
                  / piece (FOB direct)
                </span>
              </div>

              <div className="mt-3">
                <h4 className="text-base font-bold text-white">
                  {selectedBag.name}
                </h4>
                <p className="text-xs text-[#dcfce7] font-mono mt-0.5">
                  Print: {selectedPrint.label} · {volume.toLocaleString()} units
                </p>
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="py-5 space-y-2.5 text-xs text-slate-300 font-mono border-b border-white/15">
              <div className="flex justify-between">
                <span className="text-slate-400">Unit Quantity:</span>
                <span className="font-bold text-white">{volume.toLocaleString()} units</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Fabric Weight (GSM):</span>
                <span className="font-bold text-white">{selectedBag.gsm}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Plate / Setup Fee:</span>
                <span className="font-bold text-white">
                  {quoteSummary.plateFee === 0 ? (
                    <span className="text-[#22c55e]">WAIVED ($0.00)</span>
                  ) : (
                    `$${quoteSummary.plateFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Lead Time:</span>
                <span className="font-bold text-white">~{quoteSummary.leadTimeWeeks} Weeks</span>
              </div>

              <div className="flex justify-between text-[#22c55e]">
                <span>Environmental Dividend:</span>
                <span className="font-bold">Saved ~{quoteSummary.plasticSavedLbs} lbs plastic</span>
              </div>
            </div>

            {/* Total Cost Banner */}
            <div className="my-5 p-4 rounded-xl bg-white/10 border border-white/15 text-center">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-300 block mb-1">
                Estimated Total (FOB Corona, CA / Karachi)
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums">
                ${quoteSummary.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Lead Capture Form */}
            {!rfqSubmitted ? (
              <form onSubmit={handleGenerateRfq} className="space-y-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Company or Retail Chain Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-black/30 border border-white/20 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    required
                    placeholder="Procurement Email (e.g. buyer@company.com)"
                    value={procurementEmail}
                    onChange={(e) => setProcurementEmail(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-black/30 border border-white/20 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-[#0e3d24] hover:text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-[#22c55e]/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Generate Official RFQ Specification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-[#166534] border border-[#22c55e]/40 text-center space-y-2">
                <div className="w-8 h-8 mx-auto rounded-full bg-[#22c55e] text-[#0e3d24] flex items-center justify-center">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <h5 className="text-xs font-bold text-white">
                  RFQ Specification Dispatched!
                </h5>
                <p className="text-[11px] text-[#dcfce7] leading-tight">
                  Formal spec PDF sent to <strong className="text-white">{procurementEmail}</strong>. Reference: <span className="font-mono font-bold text-white">#RFQ-ECO-{Math.floor(1000 + Math.random() * 9000)}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setRfqSubmitted(false)}
                  className="text-[10px] text-white/80 hover:text-white underline pt-1 block mx-auto cursor-pointer"
                >
                  Configure Another Bag
                </button>
              </div>
            )}

            {/* Footer Trust Line */}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[10px] text-slate-300 font-mono text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>Facility ISO 9001:2015 & GRS Audited | CalRecycle SB 270</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default QuoteCalculator;
