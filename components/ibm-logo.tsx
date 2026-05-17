// components/ibm-logo.tsx — IBM watsonx.ai logo component

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

export function IBMLogo({ className = "h-6 w-auto" }: IBMLogoProps) {
  return (
    <svg
      viewBox="0 0 100 40"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="IBM"
    >
      <g fill="currentColor">
        {/* IBM 8-bar logo simplified */}
        <rect x="5" y="8" width="3" height="24" />
        <rect x="10" y="8" width="3" height="24" />
        <rect x="15" y="8" width="3" height="24" />
        
        <rect x="25" y="8" width="3" height="24" />
        <rect x="30" y="8" width="3" height="10" />
        <rect x="30" y="22" width="3" height="10" />
        <rect x="35" y="8" width="3" height="24" />
        
        <rect x="45" y="8" width="3" height="24" />
        <rect x="50" y="8" width="3" height="24" />
        <rect x="55" y="8" width="3" height="10" />
        <rect x="55" y="22" width="3" height="10" />
        <rect x="60" y="8" width="3" height="24" />
        <rect x="65" y="8" width="3" height="24" />
      </g>
    </svg>
  );
}

// Made with Bob