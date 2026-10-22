import React from 'react';
import { Product } from '../types';

interface ProductVisualProps {
  product: Product;
  selectedColor?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  product,
  selectedColor,
  className = '',
  size = 'md'
}) => {
  // Determine color hex
  const activeColor = selectedColor || product.availableColors[0]?.hex || '#1b4329';
  const isLight = activeColor === '#ffffff' || activeColor === '#f0ece1' || activeColor === '#e8e2d5' || activeColor === '#e8dfcb' || activeColor === '#d9d5c5' || activeColor === '#e3dfd3';
  const strokeColor = isLight ? '#9ca3af' : 'rgba(0,0,0,0.15)';

  const sizeClasses = {
    sm: 'h-36',
    md: 'h-52',
    lg: 'h-72'
  };

  // Specific visual by product ID
  const renderBagGraphic = () => {
    switch (product.id) {
      case 'eco-tshirt-bag':
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full max-h-48 drop-shadow-md transition-transform duration-300 group-hover:scale-105">
            {/* T-Shirt Grocery Bag Silhouette with handles and center cutout */}
            <path
              d="M 50 20 C 50 15 55 10 60 10 L 75 10 C 80 10 82 15 82 25 L 82 70 C 82 75 88 80 100 80 C 112 80 118 75 118 70 L 118 25 C 118 15 120 10 125 10 L 140 10 C 145 10 150 15 150 20 L 150 215 C 150 222 144 228 136 228 L 64 228 C 56 228 50 222 50 215 Z"
              fill={activeColor}
              stroke={strokeColor}
              strokeWidth="2"
            />
            {/* Side gusset fold lines */}
            <path d="M 66 75 L 66 228" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M 134 75 L 134 228" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeDasharray="3 3" />
            {/* Embossed Non-Woven Diamond Pattern */}
            <pattern id="nw-dots" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.8" fill="rgba(255,255,255,0.22)" />
              <circle cx="6" cy="6" r="0.8" fill="rgba(0,0,0,0.08)" />
            </pattern>
            <rect x="52" y="75" width="96" height="150" fill="url(#nw-dots)" opacity="0.6" />
            {/* Eco Recycle Leaf Stamp */}
            <g transform="translate(85, 130) scale(0.3)">
              <circle cx="50" cy="50" r="42" fill="rgba(255,255,255,0.25)" />
              <path d="M 35 60 C 35 60 33 45 45 38 C 57 31 59 42 57 49 C 55 56 45 62 35 60 Z" fill={isLight ? '#1b4329' : '#ffffff'} />
            </g>
            <text x="100" y="172" textAnchor="middle" fontSize="8" fontWeight="bold" fill={isLight ? '#1b4329' : '#ffffff'} opacity="0.9" letterSpacing="1">
              ECOTEX REUSABLE
            </text>
          </svg>
        );

      case 'eco-dcut-biodegradable':
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full max-h-48 drop-shadow-md transition-transform duration-300 group-hover:scale-105">
            {/* Biodegradable D-Cut Flat Bag */}
            <rect
              x="45"
              y="30"
              width="110"
              height="190"
              rx="6"
              fill={activeColor}
              stroke={strokeColor}
              strokeWidth="2"
            />
            {/* Smooth Oval D-Cut Handle */}
            <rect
              x="75"
              y="52"
              width="50"
              height="20"
              rx="10"
              fill="#F4F9F5"
              stroke={strokeColor}
              strokeWidth="1.8"
            />
            {/* Compostable Leaf Badge Graphic */}
            <circle cx="100" cy="135" r="28" fill="rgba(255,255,255,0.28)" />
            <path
              d="M 90 145 C 90 145 88 128 100 120 C 112 112 115 125 112 132 C 109 139 98 147 90 145 Z"
              fill={isLight ? '#2c5324' : '#ffffff'}
            />
            <path d="M 91 144 C 98 137 103 130 110 123" stroke={isLight ? '#8ea853' : 'rgba(255,255,255,0.8)'} strokeWidth="1.5" />
            <text x="100" y="180" textAnchor="middle" fontSize="7.5" fontWeight="600" fill={isLight ? '#2c5324' : '#ffffff'} letterSpacing="1">
              100% COMPOSTABLE
            </text>
            <text x="100" y="192" textAnchor="middle" fontSize="6.5" fill={isLight ? '#556b4f' : 'rgba(255,255,255,0.8)'}>
              ASTM D6400 / EN 13432
            </text>
          </svg>
        );

      case 'eco-tote-heavy-duty':
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full max-h-48 drop-shadow-md transition-transform duration-300 group-hover:scale-105">
            {/* Long Shoulder Webbing Handles */}
            <path
              d="M 75 110 L 75 25 C 75 14 125 14 125 25 L 125 110"
              fill="none"
              stroke={isLight ? '#4b5563' : 'rgba(0,0,0,0.35)'}
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Main Box Tote Body */}
            <rect
              x="42"
              y="70"
              width="116"
              height="150"
              rx="4"
              fill={activeColor}
              stroke={strokeColor}
              strokeWidth="2"
            />
            {/* Side 3D Gusset shadow */}
            <path
              d="M 142 70 L 158 82 L 158 220 L 142 220 Z"
              fill="rgba(0,0,0,0.18)"
            />
            {/* Handle X-box Reinforcement Stitching */}
            <rect x="71" y="80" width="10" height="20" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            <line x1="71" y1="80" x2="81" y2="100" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            <line x1="81" y1="80" x2="71" y2="100" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            <rect x="119" y="80" width="10" height="20" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            <line x1="119" y1="80" x2="129" y2="100" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            <line x1="129" y1="80" x2="119" y2="100" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />

            {/* Front Imprint Area */}
            <rect x="62" y="115" width="76" height="60" rx="3" fill="none" stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
            <text x="100" y="145" textAnchor="middle" fontSize="9" fontWeight="800" fill={isLight ? '#1b4329' : '#ffffff'} letterSpacing="1">
              ECOTEX
            </text>
            <text x="100" y="157" textAnchor="middle" fontSize="6.5" fill={isLight ? '#374151' : 'rgba(255,255,255,0.85)'}>
              HEAVY DUTY 80 GSM
            </text>
            <circle cx="100" cy="188" r="4" fill={isLight ? '#7ea242' : '#8ea853'} />
          </svg>
        );

      case 'eco-laminated-gift-bag':
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full max-h-48 drop-shadow-lg transition-transform duration-300 group-hover:scale-105">
            {/* Tubular Soft Handles */}
            <path
              d="M 80 85 C 80 20 120 20 120 85"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Laminated Bag Body with Gloss Reflection */}
            <rect
              x="46"
              y="60"
              width="108"
              height="162"
              rx="3"
              fill={activeColor}
              stroke={strokeColor}
              strokeWidth="1.5"
            />
            {/* Diagonal Gloss Sheen Gradient */}
            <path
              d="M 46 60 L 110 60 L 60 222 L 46 222 Z"
              fill="rgba(255,255,255,0.18)"
            />
            <path
              d="M 80 60 L 130 60 L 95 222 L 80 222 Z"
              fill="rgba(255,255,255,0.08)"
            />
            {/* Gold / Metallic Brand Seal */}
            <circle cx="100" cy="125" r="22" fill="#d4af37" stroke="#fff" strokeWidth="1" />
            <circle cx="100" cy="125" r="19" fill="#1b4329" />
            <path d="M 93 130 C 93 130 91 120 99 116 C 107 112 109 119 107 124 Z" fill="#d4af37" />
            <text x="100" y="165" textAnchor="middle" fontSize="7.5" fontWeight="600" fill={isLight ? '#1f2937' : '#ffffff'} letterSpacing="1">
              LUXURY PACKAGING
            </text>
            <text x="100" y="176" textAnchor="middle" fontSize="6" fill={isLight ? '#4b5563' : 'rgba(255,255,255,0.75)'}>
              WATERPROOF LAMINATED
            </text>
          </svg>
        );

      case 'eco-insulated-cooler-bag':
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full max-h-48 drop-shadow-md transition-transform duration-300 group-hover:scale-105">
            {/* Webbed handles */}
            <path
              d="M 72 90 L 72 32 C 72 20 128 20 128 32 L 128 90"
              fill="none"
              stroke="#374151"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Cooler Rectangular Silhouette */}
            <rect
              x="40"
              y="68"
              width="120"
              height="150"
              rx="8"
              fill={activeColor}
              stroke={strokeColor}
              strokeWidth="2"
            />
            {/* Zipper Rim Top */}
            <rect x="40" y="68" width="120" height="14" rx="2" fill="#2d3748" />
            <line x1="42" y1="75" x2="158" y2="75" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 2" />
            {/* Zipper Pull Tag */}
            <circle cx="145" cy="75" r="3.5" fill="#f87171" />
            {/* Thermal Snowflake & Leaf Icon */}
            <g transform="translate(100, 135) scale(0.6)">
              <circle cx="0" cy="0" r="32" fill="rgba(255,255,255,0.2)" />
              {/* Cold Snowflake lines */}
              <line x1="-16" y1="0" x2="16" y2="0" stroke={isLight ? '#1b4329' : '#ffffff'} strokeWidth="2.5" />
              <line x1="0" y1="-16" x2="0" y2="16" stroke={isLight ? '#1b4329' : '#ffffff'} strokeWidth="2.5" />
              <line x1="-11" y1="-11" x2="11" y2="11" stroke={isLight ? '#1b4329' : '#ffffff'} strokeWidth="2" />
              <line x1="-11" y1="11" x2="11" y2="-11" stroke={isLight ? '#1b4329' : '#ffffff'} strokeWidth="2" />
            </g>
            <text x="100" y="175" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill={isLight ? '#111827' : '#ffffff'}>
              THERMAL LOCK INSULATION
            </text>
            <text x="100" y="186" textAnchor="middle" fontSize="6.5" fill={isLight ? '#374151' : 'rgba(255,255,255,0.8)'}>
              4+ HOURS COLD RETENTION
            </text>
          </svg>
        );

      case 'eco-industrial-wiping-rags':
      default:
        return (
          <svg viewBox="0 0 200 240" className="w-full h-full max-h-48 drop-shadow-md transition-transform duration-300 group-hover:scale-105">
            {/* Recycled Cotton Wiping Bale / Dispenser Box */}
            <path
              d="M 50 80 L 100 55 L 150 80 L 150 185 L 100 210 L 50 185 Z"
              fill={activeColor}
              stroke={strokeColor}
              strokeWidth="2"
            />
            {/* 3D Box facet lines */}
            <path d="M 100 55 L 100 210" stroke="rgba(0,0,0,0.18)" strokeWidth="2" />
            <path d="M 50 80 L 100 105 L 150 80" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
            {/* Dispenser Oval Top */}
            <ellipse cx="100" cy="80" rx="20" ry="9" fill="#1b4329" />
            {/* Cotton Fabric Pulling Out */}
            <path
              d="M 94 76 C 90 60 102 52 108 62 C 114 70 105 76 102 78 Z"
              fill="#f3f4f6"
              stroke="#d1d5db"
              strokeWidth="1"
            />
            {/* CircuTex Recycling Badge */}
            <g transform="translate(100, 145) scale(0.4)">
              <circle cx="0" cy="0" r="30" fill="rgba(255,255,255,0.25)" />
              <path d="M -15 10 L 0 -15 L 15 10 Z" fill={isLight ? '#1b4329' : '#ffffff'} />
            </g>
            <text x="100" y="172" textAnchor="middle" fontSize="7" fontWeight="bold" fill={isLight ? '#111827' : '#ffffff'}>
              CIRCUTEX™ 100% RECLAIMED
            </text>
            <text x="100" y="182" textAnchor="middle" fontSize="6" fill={isLight ? '#374151' : 'rgba(255,255,255,0.85)'}>
              CLEAN GREEN CERTIFIED RAGS
            </text>
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative w-full ${sizeClasses[size]} flex items-center justify-center p-4 rounded-xl overflow-hidden bg-gradient-to-b from-[#f3f7ee] to-[#e7efe0] border border-[#dce6d3] group ${className}`}
    >
      {/* Decorative eco leaf watermarks */}
      <div className="absolute top-2 right-2 text-[10px] font-mono tracking-wider font-semibold text-[#577247]/70 bg-white/70 px-2 py-0.5 rounded">
        {product.gsm} GSM
      </div>
      
      {/* Product Vector Art */}
      <div className="w-full h-full flex items-center justify-center">
        {renderBagGraphic()}
      </div>

      {/* Sustainable Certification micro text */}
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-[#55694c]">
        <span className="truncate">{product.certifications[0]}</span>
        <span className="shrink-0 font-medium">MOQ {product.moq}</span>
      </div>
    </div>
  );
};
