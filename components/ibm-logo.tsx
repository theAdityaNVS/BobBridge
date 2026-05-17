// components/ibm-logo.tsx — IBM official 8-bar striped logo

interface IBMLogoProps {
  className?: string;
}

export function IBMWatsonxLogo({ className = "h-8 w-auto" }: IBMLogoProps) {
  return (
    <svg
      viewBox="0 0 240 50"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="IBM watsonx.ai"
      fill="currentColor"
    >
      {/* IBM Logo - 8-bar design */}
      <g>
        {/* I */}
        <rect x="5" y="10" width="4" height="30" />
        <rect x="11" y="10" width="4" height="30" />
        <rect x="17" y="10" width="4" height="30" />
        
        {/* B */}
        <rect x="28" y="10" width="4" height="30" />
        <rect x="34" y="10" width="4" height="8" />
        <rect x="34" y="32" width="4" height="8" />
        <rect x="40" y="10" width="8" height="4" />
        <rect x="40" y="22" width="8" height="4" />
        <rect x="40" y="36" width="8" height="4" />
        <rect x="48" y="14" width="4" height="8" />
        <rect x="48" y="26" width="4" height="10" />
        
        {/* M */}
        <rect x="59" y="10" width="4" height="30" />
        <rect x="65" y="10" width="4" height="30" />
        <rect x="71" y="14" width="4" height="12" />
        <rect x="77" y="10" width="4" height="30" />
        <rect x="83" y="10" width="4" height="30" />
      </g>
      
      {/* watsonx.ai text */}
      <text x="100" y="32" fontSize="18" fontWeight="600" fontFamily="system-ui, -apple-system, sans-serif">
        watsonx.ai
      </text>
    </svg>
  );
}

export function IBMLogo({ className = "h-8 w-auto" }: IBMLogoProps) {
  return (
    <svg
      viewBox="0 0 1000 400"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="IBM"
      fill="currentColor"
    >
      {/* IBM 8-bar striped logo - Official design */}
      <g>
        {/* Top stripe */}
        <rect x="0" y="0" width="155" height="40" />
        <rect x="177" y="0" width="246" height="40" />
        <rect x="444" y="0" width="133" height="40" />
        <rect x="666" y="0" width="134" height="40" />
        
        {/* Second stripe */}
        <rect x="0" y="50" width="155" height="40" />
        <rect x="177" y="50" width="246" height="40" />
        <rect x="444" y="50" width="133" height="40" />
        <rect x="651" y="50" width="149" height="40" />
        
        {/* Third stripe - with I gaps */}
        <rect x="44" y="100" width="67" height="40" />
        <rect x="222" y="100" width="67" height="40" />
        <rect x="351" y="100" width="72" height="40" />
        <rect x="489" y="100" width="88" height="40" />
        <rect x="636" y="100" width="75" height="40" />
        
        {/* Fourth stripe - with I gaps */}
        <rect x="44" y="150" width="67" height="40" />
        <rect x="222" y="150" width="190" height="40" />
        <rect x="489" y="150" width="222" height="40" />
        
        {/* Fifth stripe - with I gaps */}
        <rect x="44" y="200" width="67" height="40" />
        <rect x="222" y="200" width="190" height="40" />
        <rect x="489" y="200" width="222" height="40" />
        
        {/* Sixth stripe - with I gaps */}
        <rect x="44" y="250" width="67" height="40" />
        <rect x="222" y="250" width="67" height="40" />
        <rect x="351" y="250" width="72" height="40" />
        <rect x="489" y="250" width="88" height="40" />
        <rect x="636" y="250" width="75" height="40" />
        
        {/* Seventh stripe */}
        <rect x="0" y="300" width="155" height="40" />
        <rect x="177" y="300" width="246" height="40" />
        <rect x="444" y="300" width="133" height="40" />
        <rect x="651" y="300" width="149" height="40" />
        
        {/* Bottom stripe */}
        <rect x="0" y="350" width="155" height="40" />
        <rect x="177" y="350" width="246" height="40" />
        <rect x="444" y="350" width="133" height="40" />
        <rect x="666" y="350" width="134" height="40" />
      </g>
    </svg>
  );
}

// Made with Bob