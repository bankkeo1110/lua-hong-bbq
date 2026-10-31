// Hình minh hoạ dạng SVG. Khi có ảnh thật của quán, thay các thành phần này bằng <Image>.

export function TableArt() {
  return (
    <svg viewBox="0 0 440 360" role="img" aria-label="Bàn nướng than hoa với ghế nhựa và ly bia">
      <ellipse cx="220" cy="330" rx="190" ry="20" fill="rgba(0,0,0,.3)" />
      <rect x="40" y="170" width="360" height="26" rx="8" fill="#d9d2c0" />
      <rect x="70" y="196" width="14" height="124" fill="#9b9484" />
      <rect x="356" y="196" width="14" height="124" fill="#9b9484" />
      <path d="M150 170l14-34h112l14 34z" fill="#2a2a2a" />
      <rect x="164" y="124" width="112" height="14" rx="4" fill="#E5432D" />
      <g stroke="#555" strokeWidth="3">
        {[180, 200, 220, 240, 260].map((x) => (
          <line key={x} x1={x} y1="124" x2={x} y2="136" />
        ))}
      </g>
      <rect x="172" y="112" width="36" height="14" rx="6" fill="#B8412F" />
      <rect x="214" y="110" width="40" height="14" rx="6" fill="#D9694F" />
      <path d="M196 104c-10-16 10-22 0-40M236 100c-10-16 10-22 0-40" stroke="#f5f1e6" strokeWidth="5" fill="none" opacity=".35" strokeLinecap="round" />
      {[60, 332].map((x) => (
        <g key={x}>
          <rect x={x} y="150" width="34" height="20" rx="6" fill="#f5f1e6" />
          <rect x={x + 2} y="104" width="30" height="46" rx="5" fill="#F4B63E" />
          <rect x={x + 2} y="104" width="30" height="12" rx="5" fill="#fff" />
        </g>
      ))}
      <g fill="#2E6FB7">
        <rect x="10" y="236" width="56" height="12" rx="5" />
        <rect x="18" y="248" width="8" height="70" />
        <rect x="50" y="248" width="8" height="70" />
        <rect x="374" y="236" width="56" height="12" rx="5" />
        <rect x="382" y="248" width="8" height="70" />
        <rect x="414" y="248" width="8" height="70" />
      </g>
    </svg>
  );
}

const BG: Record<string, string> = {
  meat: "#7a2a20",
  seafood: "#1f5560",
  beer: "#8a5a2b",
  grill: "#2d1a12",
  combo: "#2E6FB7",
  space: "#16393E",
};

export function Tile({ kind }: { kind: keyof typeof BG }) {
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="200" height="200" fill={BG[kind]} />
      {kind === "meat" && (
        <g>
          <ellipse cx="100" cy="104" rx="84" ry="56" fill="#f4ecdd" />
          <ellipse cx="100" cy="104" rx="68" ry="42" fill="none" stroke="#c9b99a" strokeWidth="3" />
          {[[58, 88, -8], [102, 82, 6], [70, 114, 4], [114, 112, -6]].map(([x, y, r], i) => (
            <g key={i} transform={`rotate(${r} ${x + 24} ${y + 10})`}>
              <rect x={x} y={y} width="48" height="20" rx="9" fill="#d96a58" />
              <rect x={x + 6} y={y + 6} width="30" height="4" rx="2" fill="#f6d9cf" />
            </g>
          ))}
        </g>
      )}
      {kind === "seafood" && (
        <g>
          <ellipse cx="100" cy="110" rx="84" ry="52" fill="#f4ecdd" />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M${48 + i * 28} 118c0-30 28-40 38-24c8 14-12 34-38 24z`} fill="#f08a5d" />
          ))}
          <path d="M120 70c18-6 36 6 30 24" stroke="#f4ecdd" strokeWidth="6" fill="none" strokeLinecap="round" />
          <circle cx="152" cy="132" r="10" fill="#6aa84f" />
        </g>
      )}
      {kind === "beer" && (
        <g>
          {[62, 118].map((x) => (
            <g key={x}>
              <rect x={x} y="70" width="44" height="90" rx="8" fill="#F4B63E" />
              <rect x={x} y="60" width="44" height="24" rx="10" fill="#fff" />
              <path d={`M${x + 44} 90h14c10 0 10 40 0 40h-14`} fill="none" stroke="#f5f1e6" strokeWidth="6" />
            </g>
          ))}
        </g>
      )}
      {kind === "grill" && (
        <g>
          <circle cx="100" cy="104" r="76" fill="#3a3a3a" />
          <circle cx="100" cy="104" r="62" fill="#E5432D" opacity=".85" />
          {[60, 80, 100, 120, 140].map((x) => (
            <line key={x} x1={x} y1="52" x2={x} y2="156" stroke="#222" strokeWidth="5" />
          ))}
          <rect x="70" y="84" width="40" height="16" rx="7" fill="#B8412F" />
          <rect x="94" y="108" width="40" height="16" rx="7" fill="#D9694F" />
        </g>
      )}
      {kind === "combo" && (
        <g>
          <ellipse cx="100" cy="112" rx="88" ry="60" fill="#f4ecdd" />
          <rect x="44" y="84" width="46" height="18" rx="8" fill="#d96a58" />
          <rect x="96" y="80" width="50" height="18" rx="8" fill="#b8412f" />
          <path d="M52 124c0-26 26-34 34-20c6 12-10 28-34 20z" fill="#f08a5d" />
          <circle cx="126" cy="126" r="14" fill="#6aa84f" />
          <circle cx="146" cy="116" r="10" fill="#F4B63E" />
        </g>
      )}
      {kind === "space" && (
        <g>
          <rect x="24" y="112" width="152" height="12" rx="5" fill="#d9d2c0" />
          <rect x="38" y="124" width="8" height="52" fill="#9b9484" />
          <rect x="154" y="124" width="8" height="52" fill="#9b9484" />
          <rect x="16" y="144" width="30" height="8" rx="4" fill="#2E6FB7" />
          <rect x="154" y="144" width="30" height="8" rx="4" fill="#2E6FB7" />
          <path d="M10 26Q50 50 100 28T190 26" stroke="#0a1b1e" strokeWidth="3" fill="none" />
          {[24, 60, 98, 138, 176].map((x, i) => (
            <circle key={x} cx={x} cy={i % 2 ? 44 : 34} r="6" fill={["#F4B63E", "#E5432D", "#fff3c4"][i % 3]} />
          ))}
        </g>
      )}
    </svg>
  );
}
