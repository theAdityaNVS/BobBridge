// components/bob-icon.tsx — IBM Bob robot with construction helmet icon

interface BobIconProps {
  className?: string;
}

export function BobIcon({ className = "h-8 w-8" }: BobIconProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="IBM Bob - Construction Robot"
      fill="none"
    >
      {/* Construction Helmet */}
      <g>
        {/* Helmet brim */}
        <ellipse cx="100" cy="65" rx="55" ry="8" fill="#2C3E50" />
        {/* Helmet dome - gradient blue */}
        <defs>
          <linearGradient id="helmetGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0F62FE" />
            <stop offset="100%" stopColor="#8A3FFC" />
          </linearGradient>
        </defs>
        <path
          d="M 45 65 Q 45 25 100 25 Q 155 25 155 65 Z"
          fill="url(#helmetGradient)"
        />
        {/* Helmet stripe */}
        <rect x="45" y="60" width="110" height="5" fill="#2C3E50" />
        {/* Helmet vents */}
        <rect x="85" y="35" width="8" height="20" rx="2" fill="#0353E9" />
        <rect x="107" y="35" width="8" height="20" rx="2" fill="#0353E9" />
      </g>

      {/* Robot Head */}
      <g>
        {/* Head rectangle */}
        <rect x="60" y="70" width="80" height="50" rx="5" fill="#E8E8E8" stroke="#2C3E50" strokeWidth="4" />
        
        {/* Side panels */}
        <rect x="50" y="85" width="10" height="20" rx="2" fill="#C0C0C0" stroke="#2C3E50" strokeWidth="3" />
        <rect x="140" y="85" width="10" height="20" rx="2" fill="#C0C0C0" stroke="#2C3E50" strokeWidth="3" />
        
        {/* Eyes */}
        <circle cx="80" cy="92" r="10" fill="#2C3E50" />
        <circle cx="120" cy="92" r="10" fill="#2C3E50" />
        <circle cx="82" cy="90" r="4" fill="white" />
        <circle cx="122" cy="90" r="4" fill="white" />
        
        {/* Smile */}
        <path
          d="M 75 105 Q 100 115 125 105"
          stroke="#2C3E50"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Robot Body */}
      <g>
        {/* Body rectangle */}
        <rect x="65" y="120" width="70" height="55" rx="8" fill="white" stroke="#2C3E50" strokeWidth="4" />
        
        {/* Code symbol </> */}
        <text x="100" y="157" fontSize="32" fontWeight="bold" fill="#0F62FE" textAnchor="middle" fontFamily="monospace">
          {'</>'}
        </text>
      </g>

      {/* Arms */}
      <g>
        {/* Left arm */}
        <rect x="45" y="130" width="15" height="35" rx="7" fill="#C0C0C0" stroke="#2C3E50" strokeWidth="3" />
        <circle cx="52.5" cy="167" r="8" fill="#C0C0C0" stroke="#2C3E50" strokeWidth="3" />
        
        {/* Right arm */}
        <rect x="140" y="130" width="15" height="35" rx="7" fill="#C0C0C0" stroke="#2C3E50" strokeWidth="3" />
        <circle cx="147.5" cy="167" r="8" fill="#C0C0C0" stroke="#2C3E50" strokeWidth="3" />
      </g>
    </svg>
  );
}

// Made with Bob