import React from 'react';

interface SafeGuardLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const SafeGuardLogo: React.FC<SafeGuardLogoProps> = ({
  className = 'w-10 h-10',
  size,
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      {/* High-Fidelity SVG Shield Emblem */}
      <svg
        viewBox="0 0 400 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full shrink-0"
        style={size ? { width: size, height: size } : undefined}
      >
        <defs>
          {/* Shield Outer Shadow */}
          <filter id="shieldShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0f172a" floodOpacity="0.25" />
          </filter>

          {/* Blue Center Gradient */}
          <linearGradient id="centerBlueGrad" x1="200" y1="20" x2="200" y2="380" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="50%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Left Wing Gradient (Cyan / Blue) */}
          <linearGradient id="leftWingGrad" x1="60" y1="50" x2="160" y2="300" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          {/* Right Wing Gradient (Emerald / Teal) */}
          <linearGradient id="rightWingGrad" x1="240" y1="50" x2="340" y2="300" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Red ECG Line Glow */}
          <filter id="ecgGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ef4444" floodOpacity="0.6" />
          </filter>

          {/* Shield Clipping Path */}
          <clipPath id="shieldClip">
            <path d="M200 30 C270 30, 340 55, 345 120 C350 250, 270 330, 200 380 C130 330, 50 250, 55 120 C60 55, 130 30, 200 30 Z" />
          </clipPath>
        </defs>

        {/* Outer Dark Navy Border Contour */}
        <path
          d="M200 20 C280 20, 360 48, 365 120 C372 270, 280 360, 200 410 C120 360, 28 270, 35 120 C40 48, 120 20, 200 20 Z"
          fill="#0c1938"
          filter="url(#shieldShadow)"
        />

        {/* Shield Inner Background Layers (clipped) */}
        <g clipPath="url(#shieldClip)">
          {/* Base Background */}
          <rect width="400" height="450" fill="url(#centerBlueGrad)" />

          {/* Left Wing (Cyan Section) */}
          <path d="M50 30 L160 30 L150 380 L50 380 Z" fill="url(#leftWingGrad)" />

          {/* Right Wing (Green Section) */}
          <path d="M240 30 L350 30 L350 380 L250 380 Z" fill="url(#rightWingGrad)" />

          {/* Center Blue Column */}
          <path d="M150 20 L250 20 L250 390 L150 390 Z" fill="url(#centerBlueGrad)" />

          {/* Left Panel Tech Icons: Camera & Message Bubble */}
          {/* Camera Icon */}
          <g transform="translate(85, 75) scale(1.1)" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 4h-5L7 7H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-5l-2.5-3z" />
            <circle cx="10" cy="13" r="3.5" />
          </g>
          {/* Chat Message Icon */}
          <g transform="translate(85, 140) scale(1.1)" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="0" y="2" width="20" height="14" rx="3" />
            <line x1="4" y1="6" x2="16" y2="6" />
            <line x1="4" y1="10" x2="12" y2="10" />
            <path d="M4 16 L2 20 L8 16" />
          </g>

          {/* Right Panel Tech Icons: Microphone & Image/Gallery */}
          {/* Mic Icon */}
          <g transform="translate(285, 75) scale(1.1)" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="2" width="8" height="12" rx="4" />
            <path d="M2 10a8 8 0 0 0 16 0" />
            <line x1="10" y1="18" x2="10" y2="22" />
            <line x1="6" y1="22" x2="14" y2="22" />
          </g>
          {/* Image Icon */}
          <g transform="translate(285, 140) scale(1.1)" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="0" y="2" width="20" height="15" rx="3" />
            <circle cx="5.5" cy="6.5" r="1.5" />
            <path d="m20 13-6-6-8 8" />
          </g>

          {/* Center White First-Aid Cross */}
          <path
            d="M175 75 H225 V110 H260 V160 H225 V195 H175 V160 H140 V110 H175 Z"
            fill="#ffffff"
            filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.3))"
          />

          {/* Red ECG / Pulse Line */}
          <path
            d="M60 215 L140 215 L160 215 L175 165 L195 260 L215 150 L235 240 L250 215 L340 215"
            stroke="#dc2626"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            filter="url(#ecgGlow)"
          />

          {/* Supportive Protective Hands Cradling the Base */}
          {/* Left Hand */}
          <path
            d="M70 320 C90 320, 110 330, 135 320 C165 305, 185 285, 195 240 C190 265, 160 295, 130 300 C105 305, 80 295, 60 270 C55 295, 60 315, 70 320 Z"
            fill="#ffffff"
          />
          <path
            d="M80 340 C105 340, 135 345, 160 330 C185 315, 195 290, 200 270 C190 288, 170 310, 145 318 C120 325, 95 320, 75 300 C70 320, 75 335, 80 340 Z"
            fill="#ffffff"
          />
          {/* Right Hand */}
          <path
            d="M330 320 C310 320, 290 330, 265 320 C235 305, 215 285, 205 240 C210 265, 240 295, 270 300 C295 305, 320 295, 340 270 C345 295, 340 315, 330 320 Z"
            fill="#ffffff"
          />
          <path
            d="M320 340 C295 340, 265 345, 240 330 C215 315, 205 290, 200 270 C210 288, 230 310, 255 318 C280 325, 305 320, 325 300 C330 320, 325 335, 320 340 Z"
            fill="#ffffff"
          />
        </g>

        {/* Shield Outer Crisp Rim Highlight */}
        <path
          d="M200 30 C270 30, 340 55, 345 120 C350 250, 270 330, 200 380 C130 330, 50 250, 55 120 C60 55, 130 30, 200 30 Z"
          stroke="#ffffff"
          strokeWidth="6"
          strokeOpacity="0.4"
          fill="none"
        />
      </svg>

      {/* Optional Typography Pairing */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-1 leading-none">
            <span className="font-extrabold text-xl tracking-tight text-slate-900">SafeGuard</span>
            <span className="font-extrabold text-xl tracking-tight text-rose-600">AI</span>
            <span className="text-sky-500 font-bold text-xs ml-0.5">✦</span>
          </div>
          <span className="text-[10px] font-bold text-slate-500 tracking-wider mt-0.5">
            Act Fast. Stay Safe.
          </span>
        </div>
      )}
    </div>
  );
};

export const SafeGuardLogoFullBanner: React.FC<{ className?: string }> = ({
  className = 'max-w-md w-full',
}) => {
  return (
    <div className={`flex flex-col items-center text-center p-6 bg-white rounded-3xl border border-slate-200/90 shadow-lg ${className}`}>
      {/* Shield Emblem */}
      <div className="w-36 h-36 relative mb-3">
        <SafeGuardLogo className="w-full h-full" />
      </div>

      {/* Brand Title */}
      <div className="flex items-center space-x-1.5 justify-center">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
          SafeGuard
        </h1>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-rose-600">
          AI
        </h1>
        <div className="flex space-x-0.5 text-sky-500">
          <span className="text-base font-black">✦</span>
        </div>
      </div>

      {/* Slogan */}
      <div className="w-full max-w-xs flex items-center justify-center space-x-2 my-2">
        <div className="h-[1.5px] bg-slate-200 flex-1" />
        <span className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-wide">
          Act Fast. Stay Safe.
        </span>
        <div className="h-[1.5px] bg-slate-200 flex-1" />
      </div>

      {/* Multimodal Feature Badges Bar */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 w-full max-w-sm mt-3 pt-3 border-t border-slate-100">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shadow-2xs">
            💬
          </div>
          <span className="text-[10px] font-black text-slate-700 mt-1 uppercase">Text</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold shadow-2xs">
            📷
          </div>
          <span className="text-[10px] font-black text-slate-700 mt-1 uppercase">Image</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-xs font-bold shadow-2xs">
            🎙️
          </div>
          <span className="text-[10px] font-black text-slate-700 mt-1 uppercase">Voice</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-bold shadow-2xs">
            🌐
          </div>
          <span className="text-[10px] font-black text-slate-700 mt-1 uppercase">Multi</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold shadow-2xs">
            🚨
          </div>
          <span className="text-[10px] font-black text-slate-700 mt-1 uppercase">SOS</span>
        </div>
      </div>

      {/* Bottom Tagline Capsule */}
      <div className="mt-4 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-bold shadow-xs">
        Your Multimodal Campus Health & Emergency Safety Companion
      </div>
    </div>
  );
};
