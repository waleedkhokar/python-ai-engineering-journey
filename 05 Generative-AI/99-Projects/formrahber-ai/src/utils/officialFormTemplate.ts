// Generates a crisp, high-resolution SVG of the Government of Pakistan National Identity Card form
export const GOVT_FORM_SVG_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1120" width="800" height="1120" style="background:#ffffff; font-family: Arial, Helvetica, sans-serif;">
  <style>
    .gov-title { font-size: 18px; font-weight: 800; fill: #000000; text-anchor: middle; letter-spacing: 0.5px; }
    .gov-subtitle { font-size: 16px; font-weight: 800; fill: #000000; text-anchor: middle; letter-spacing: 0.5px; }
    .section-title { font-size: 15px; font-weight: 800; fill: #000000; text-anchor: middle; letter-spacing: 1px; }
    .label-bold { font-size: 13px; font-weight: 700; fill: #000000; }
    .table-border { fill: none; stroke: #000000; stroke-width: 1.2; }
    .grid-line { stroke: #000000; stroke-width: 1.2; }
    .box-border { fill: #ffffff; stroke: #000000; stroke-width: 1.2; }
    .black-box { fill: #000000; stroke: #000000; stroke-width: 1.2; }
    .subtext { font-size: 13px; font-weight: 700; fill: #000000; }
  </style>

  <!-- Background -->
  <rect width="800" height="1120" fill="#ffffff" />
  <rect x="20" y="20" width="760" height="1080" fill="none" stroke="#e5e7eb" stroke-width="1" />

  <!-- TOP HEADER -->
  <!-- ZAIR NO. BOX -->
  <g transform="translate(310, 45)">
    <rect x="0" y="0" width="180" height="32" class="box-border" />
    <text x="90" y="21" style="font-size: 13px; font-weight: 800; fill: #000000; text-anchor: middle;">ZAIR NO: ___________</text>
  </g>

  <!-- GOVERNMENT OF PAKISTAN -->
  <text x="400" y="110" class="gov-title">GOVERNMENT OF PAKISTAN</text>
  <text x="400" y="140" class="gov-subtitle">NATIONAL IDENTITY CARD NO.</text>

  <!-- 15 CNIC BOXES WITH BLACK DASH BOXES AT 6 and 14 -->
  <g transform="translate(180, 160)">
    <!-- 15 boxes of 28x28 -->
    <rect x="0" y="0" width="28" height="28" class="box-border" />
    <rect x="28" y="0" width="28" height="28" class="box-border" />
    <rect x="56" y="0" width="28" height="28" class="box-border" />
    <rect x="84" y="0" width="28" height="28" class="box-border" />
    <rect x="112" y="0" width="28" height="28" class="box-border" />
    <!-- Separator Box 6 -->
    <rect x="140" y="0" width="28" height="28" class="black-box" />
    <rect x="168" y="0" width="28" height="28" class="box-border" />
    <rect x="196" y="0" width="28" height="28" class="box-border" />
    <rect x="224" y="0" width="28" height="28" class="box-border" />
    <rect x="252" y="0" width="28" height="28" class="box-border" />
    <rect x="280" y="0" width="28" height="28" class="box-border" />
    <rect x="308" y="0" width="28" height="28" class="box-border" />
    <rect x="336" y="0" width="28" height="28" class="box-border" />
    <!-- Separator Box 14 -->
    <rect x="364" y="0" width="28" height="28" class="black-box" />
    <rect x="392" y="0" width="28" height="28" class="box-border" />
  </g>

  <!-- SIDE - A -->
  <text x="400" y="225" class="section-title">SIDE – A</text>

  <!-- TABLE FOR SIDE - A -->
  <g transform="translate(90, 245)">
    <rect x="0" y="0" width="620" height="175" class="table-border" />
    <line x1="150" y1="0" x2="150" y2="175" class="grid-line" />
    
    <line x1="0" y1="35" x2="620" y2="35" class="grid-line" />
    <line x1="0" y1="70" x2="620" y2="70" class="grid-line" />
    <line x1="0" y1="105" x2="620" y2="105" class="grid-line" />
    <line x1="0" y1="140" x2="620" y2="140" class="grid-line" />

    <text x="12" y="23" class="label-bold">Name</text>
    <text x="12" y="58" class="label-bold">Sex</text>
    <text x="12" y="93" class="label-bold">Father Name</text>
    <text x="12" y="128" class="label-bold">Identification Mark</text>
    <text x="12" y="163" class="label-bold">Date Of Birth</text>
  </g>

  <!-- SIDE - B -->
  <text x="400" y="465" class="section-title">SIDE – B</text>

  <!-- TABLE FOR SIDE - B -->
  <g transform="translate(90, 485)">
    <rect x="0" y="0" width="620" height="195" class="table-border" />
    <line x1="150" y1="0" x2="150" y2="195" class="grid-line" />

    <line x1="0" y1="35" x2="620" y2="35" class="grid-line" />
    <line x1="0" y1="70" x2="620" y2="70" class="grid-line" />
    <line x1="0" y1="110" x2="620" y2="110" class="grid-line" />
    <line x1="0" y1="155" x2="620" y2="155" class="grid-line" />

    <text x="12" y="23" class="label-bold">Family No.</text>
    <text x="12" y="58" class="label-bold">CNIC No.</text>
    <text x="12" y="93" class="label-bold">Present Address</text>
    <text x="12" y="138" class="label-bold">Permanent</text>
    <text x="12" y="150" class="label-bold">Address</text>
    
    <!-- Bottom Row split into Date of Issue and Expiry Date -->
    <text x="12" y="180" class="label-bold">Date Of Issue</text>
    <line x1="300" y1="155" x2="300" y2="195" class="grid-line" />
    <text x="312" y="180" class="label-bold">Expiry Date</text>
    <line x1="420" y1="155" x2="420" y2="195" class="grid-line" />
  </g>

  <!-- INSTRUCTION TEXT -->
  <text x="90" y="730" class="subtext">Please Paste A Copy Of CNIC</text>

  <!-- TWO LARGE BOXES FOR SIDE 'A' AND SIDE 'B' COPIES -->
  <g transform="translate(90, 760)">
    <!-- Box 1 -->
    <rect x="0" y="0" width="295" height="165" class="table-border" />
    <text x="147" y="90" class="label-bold" style="text-anchor: middle;">SIDE 'A'</text>

    <!-- Box 2 -->
    <rect x="325" y="0" width="295" height="165" class="table-border" />
    <text x="472" y="90" class="label-bold" style="text-anchor: middle;">SIDE 'B'</text>
  </g>

</svg>
`)}`;

// Generates a crisp vector illustration of a Bank building with financial icons matching user request
export const BANK_ILLUSTRATION_SVG_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" style="background:#f0f7ff; font-family: system-ui, -apple-system, sans-serif;">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#eff6ff" />
      <stop offset="100%" stop-color="#dbeafe" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#1e293b" flood-opacity="0.12" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="900" height="600" fill="url(#bgGrad)" />

  <!-- Soft organic background backdrop shapes -->
  <path d="M 80,180 C 140,60 340,40 450,90 C 560,140 760,70 830,200 C 900,340 810,500 660,530 C 510,560 310,540 170,480 C 50,420 40,300 80,180 Z" fill="#dbeafe" opacity="0.6" />

  <!-- TOP CIRCLE: Piggy Bank -->
  <g transform="translate(450, 120)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="70" fill="#3b82f6" opacity="0.12" />
    <circle cx="0" cy="0" r="65" fill="#ffffff" stroke="#3b82f6" stroke-width="3" />
    <!-- Piggy Body -->
    <path d="M -28,8 C -38,-15 -8,-32 20,-22 C 34,-18 38,-4 34,10 C 28,20 14,26 -4,23 C -18,20 -23,18 -28,8 Z" fill="#ff6b6b" />
    <ellipse cx="30" cy="-6" rx="7" ry="10" fill="#ff8787" />
    <circle cx="28" cy="-8" r="1.5" fill="#a82323" />
    <circle cx="28" cy="-4" r="1.5" fill="#a82323" />
    <circle cx="12" cy="-14" r="3" fill="#1e1b4b" />
    <path d="M -8,-25 Q -2,-34 5,-24 Z" fill="#ff8787" />
    <rect x="-20" y="15" width="7" height="11" rx="2" fill="#d94848" />
    <rect x="8" y="15" width="7" height="11" rx="2" fill="#d94848" />
    <rect x="-8" y="-28" width="10" height="3" fill="#d94848" />
  </g>

  <!-- TOP-LEFT CIRCLE: ATM Machine -->
  <g transform="translate(250, 130)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="55" fill="#3b82f6" opacity="0.12" />
    <circle cx="0" cy="0" r="50" fill="#ffffff" stroke="#3b82f6" stroke-width="2.5" />
    <rect x="-22" y="-30" width="44" height="60" rx="6" fill="#2563eb" />
    <rect x="-16" y="-24" width="32" height="20" rx="3" fill="#ff6b6b" />
    <rect x="-12" y="-20" width="24" height="12" rx="2" fill="#ffffff" opacity="0.95" />
    <circle cx="-8" cy="8" r="2" fill="#ffffff" />
    <circle cx="-2" cy="8" r="2" fill="#ffffff" />
    <circle cx="4" cy="8" r="2" fill="#ffffff" />
    <rect x="-12" y="16" width="24" height="5" rx="2" fill="#1e293b" />
  </g>

  <!-- TOP-RIGHT CIRCLE: Briefcase & Growth -->
  <g transform="translate(650, 130)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="55" fill="#3b82f6" opacity="0.12" />
    <circle cx="0" cy="0" r="50" fill="#ffffff" stroke="#3b82f6" stroke-width="2.5" />
    <rect x="-24" y="-10" width="48" height="32" rx="5" fill="#2563eb" />
    <path d="M -10,-10 L -10,-18 Q -10,-22 0,-22 Q 10,-22 10,-18 L 10,-10" fill="none" stroke="#2563eb" stroke-width="3" />
    <rect x="-5" y="-2" width="10" height="14" fill="#ff6b6b" rx="2" />
    <rect x="-2" y="-32" width="30" height="22" rx="3" fill="#ffffff" stroke="#ff6b6b" stroke-width="2" />
    <path d="M 2,-16 L 10,-24 L 16,-19 L 24,-29" fill="none" stroke="#ff6b6b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </g>

  <!-- MIDDLE-LEFT CIRCLE: Smartphone BUY -->
  <g transform="translate(150, 250)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="48" fill="#3b82f6" opacity="0.12" />
    <circle cx="0" cy="0" r="44" fill="#ffffff" stroke="#3b82f6" stroke-width="2.5" />
    <rect x="-16" y="-28" width="32" height="56" rx="5" fill="#1e1b4b" />
    <rect x="-13" y="-23" width="26" height="46" rx="3" fill="#eff6ff" />
    <path d="M -7,-8 L -3,-8 L 0,0 L 7,0 L 9,-6 L -2,-6" fill="none" stroke="#2563eb" stroke-width="1.8" />
    <circle cx="1" cy="4" r="1.5" fill="#2563eb" />
    <circle cx="6" cy="4" r="1.5" fill="#2563eb" />
    <rect x="-9" y="8" width="18" height="7" rx="3.5" fill="#ff6b6b" />
    <text x="0" y="13.5" fill="#ffffff" font-size="5.5" font-weight="900" text-anchor="middle">BUY</text>
  </g>

  <!-- MIDDLE-RIGHT CIRCLE: Credit Card -->
  <g transform="translate(750, 250)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="48" fill="#3b82f6" opacity="0.12" />
    <circle cx="0" cy="0" r="44" fill="#ffffff" stroke="#3b82f6" stroke-width="2.5" />
    <rect x="-22" y="-15" width="44" height="30" rx="4" fill="#2563eb" />
    <rect x="-22" y="-7" width="44" height="7" fill="#1e1b4b" />
    <rect x="-17" y="3" width="8" height="6" rx="1.5" fill="#facc15" />
  </g>

  <!-- CENTRAL BANK BUILDING -->
  <g transform="translate(450, 360)" filter="url(#shadow)">
    <!-- Base steps -->
    <rect x="-200" y="90" width="400" height="16" fill="#1e1b4b" rx="2" />
    <rect x="-185" y="78" width="370" height="12" fill="#2e1065" rx="2" />
    <rect x="-170" y="68" width="340" height="10" fill="#312e81" rx="2" />

    <!-- Columns -->
    <rect x="-150" y="-30" width="20" height="98" fill="#2563eb" rx="2" />
    <rect x="-90" y="-30" width="20" height="98" fill="#2563eb" rx="2" />
    <rect x="-30" y="-30" width="20" height="98" fill="#2563eb" rx="2" />
    <rect x="10" y="-30" width="20" height="98" fill="#2563eb" rx="2" />
    <rect x="70" y="-30" width="20" height="98" fill="#2563eb" rx="2" />
    <rect x="130" y="-30" width="20" height="98" fill="#2563eb" rx="2" />

    <line x1="-144" y1="-28" x2="-144" y2="66" stroke="#60a5fa" stroke-width="2.5" />
    <line x1="-84" y1="-28" x2="-84" y2="66" stroke="#60a5fa" stroke-width="2.5" />
    <line x1="-24" y1="-28" x2="-24" y2="66" stroke="#60a5fa" stroke-width="2.5" />
    <line x1="16" y1="-28" x2="16" y2="66" stroke="#60a5fa" stroke-width="2.5" />
    <line x1="76" y1="-28" x2="76" y2="66" stroke="#60a5fa" stroke-width="2.5" />
    <line x1="136" y1="-28" x2="136" y2="66" stroke="#60a5fa" stroke-width="2.5" />

    <!-- Architrave -->
    <rect x="-165" y="-44" width="330" height="14" fill="#1e1b4b" />

    <!-- Triangular Pediment -->
    <polygon points="0,-110 -180,-44 180,-44" fill="#2563eb" />
    <polygon points="0,-100 -160,-46 160,-46" fill="#3b82f6" />

    <!-- "BANK" Bold Red Text -->
    <text x="0" y="-58" font-size="42" font-weight="900" fill="#ff5a5f" text-anchor="middle" letter-spacing="3">BANK</text>
  </g>

  <!-- BOTTOM-RIGHT: Person with Coin Cart -->
  <g transform="translate(710, 450)">
    <rect x="-30" y="8" width="60" height="10" rx="3" fill="#2563eb" />
    <circle cx="-16" cy="24" r="7" fill="#1e1b4b" />
    <circle cx="-16" cy="24" r="2.5" fill="#ffffff" />
    <circle cx="16" cy="24" r="7" fill="#1e1b4b" />
    <circle cx="16" cy="24" r="2.5" fill="#ffffff" />
    <line x1="25" y1="10" x2="60" y2="-18" stroke="#1e1b4b" stroke-width="3.5" stroke-linecap="round" />

    <!-- Stack of Coins -->
    <g transform="translate(0, -20)">
      <rect x="-18" y="16" width="36" height="8" rx="3" fill="#ff6b6b" stroke="#ffffff" stroke-width="1" />
      <rect x="-18" y="10" width="36" height="8" rx="3" fill="#ff8787" stroke="#ffffff" stroke-width="1" />
      <rect x="-18" y="4" width="36" height="8" rx="3" fill="#ff6b6b" stroke="#ffffff" stroke-width="1" />
      <rect x="-18" y="-2" width="36" height="8" rx="3" fill="#ff8787" stroke="#ffffff" stroke-width="1" />
      <circle cx="0" cy="-22" r="18" fill="#ff6b6b" stroke="#ffffff" stroke-width="2" />
      <text x="0" y="-15" font-size="18" font-weight="900" fill="#ffffff" text-anchor="middle">$</text>
    </g>

    <text x="-35" y="-50" font-size="32" font-weight="900" fill="#ff5a5f">%</text>
  </g>

  <!-- FLOATING DOLLAR COINS -->
  <g transform="translate(420, 50)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="16" fill="#ff6b6b" stroke="#ffffff" stroke-width="2" />
    <text x="0" y="5.5" font-size="16" font-weight="900" fill="#ffffff" text-anchor="middle">$</text>
  </g>

  <g transform="translate(480, 85)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="20" fill="#ff5a5f" stroke="#ffffff" stroke-width="2" />
    <text x="0" y="6.5" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle">$</text>
  </g>

  <g transform="translate(180, 430)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="15" fill="#ff6b6b" stroke="#ffffff" stroke-width="2" />
    <text x="0" y="5" font-size="15" font-weight="900" fill="#ffffff" text-anchor="middle">$</text>
  </g>

  <g transform="translate(130, 500)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="18" fill="#ff5a5f" stroke="#ffffff" stroke-width="2" />
    <text x="0" y="6" font-size="18" font-weight="900" fill="#ffffff" text-anchor="middle">$</text>
  </g>

  <g transform="translate(220, 490)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="16" fill="#ff6b6b" stroke="#ffffff" stroke-width="2" />
    <text x="0" y="5.5" font-size="16" font-weight="900" fill="#ffffff" text-anchor="middle">$</text>
  </g>

  <g transform="translate(680, 220)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="22" fill="#ff5a5f" stroke="#ffffff" stroke-width="2" />
    <text x="0" y="7.5" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle">$</text>
  </g>

</svg>
`)}`;

// Generates a crisp, high-resolution SVG of the Bank AL Habib Account Opening form
export const BANK_FORM_SVG_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(`

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1120" width="800" height="1120" style="background:#ffffff; font-family: Arial, Helvetica, sans-serif;">
  <style>
    .bank-title { font-size: 22px; font-weight: 800; fill: #15803d; letter-spacing: -0.3px; }
    .form-heading { font-size: 14px; font-weight: 800; fill: #15803d; text-align: right; }
    .sub-heading { font-size: 11px; font-weight: 600; fill: #15803d; }
    .label-text { font-size: 10px; font-weight: 700; fill: #1f2937; }
    .label-small { font-size: 9px; font-weight: 600; fill: #374151; }
    .box-border { fill: #ffffff; stroke: #4b5563; stroke-width: 0.9; }
    .green-banner { fill: #15803d; }
    .banner-text { font-size: 12px; font-weight: 800; fill: #ffffff; text-anchor: middle; letter-spacing: 0.5px; }
    .grid-line { stroke: #6b7280; stroke-width: 0.8; }
  </style>

  <!-- Background -->
  <rect width="800" height="1120" fill="#ffffff" />
  <rect x="10" y="10" width="780" height="1100" fill="none" stroke="#d1d5db" stroke-width="1" />

  <!-- HEADER AREA -->
  <!-- Bank Logo & Name -->
  <g transform="translate(30, 25)">
    <!-- Camel Logo Symbol in Hexagon -->
    <polygon points="25,5 45,15 45,35 25,45 5,35 5,15" fill="none" stroke="#15803d" stroke-width="2" />
    <path d="M 18,32 C 18,25 22,22 25,22 C 28,22 30,26 32,32 Z" fill="#15803d" />
    <text x="55" y="32" class="bank-title">Bank AL Habib Limited</text>
    <text x="55" y="48" style="font-size:11px; font-weight:600; fill:#374151;">Branch: ________________________________________________</text>
  </g>

  <!-- Right Header: Account Opening Form -->
  <g transform="translate(480, 20)">
    <text x="280" y="15" class="form-heading" text-anchor="end">ACCOUNT OPENING FORM</text>
    <text x="280" y="28" class="sub-heading" text-anchor="end">For Individuals and Sole Proprietorship</text>
    
    <text x="0" y="46" class="label-small">Branch Code</text>
    <!-- 4 boxes -->
    <g transform="translate(60, 36)">
      <rect x="0" y="0" width="16" height="16" class="box-border" />
      <rect x="16" y="0" width="16" height="16" class="box-border" />
      <rect x="32" y="0" width="16" height="16" class="box-border" />
      <rect x="48" y="0" width="16" height="16" class="box-border" />
    </g>

    <text x="130" y="46" class="label-small">Account Number (For Bank Use Only)</text>
    <!-- 10 boxes -->
    <g transform="translate(130, 54)">
      <rect x="0" y="0" width="14" height="16" class="box-border" />
      <rect x="14" y="0" width="14" height="16" class="box-border" />
      <rect x="28" y="0" width="14" height="16" class="box-border" />
      <rect x="42" y="0" width="14" height="16" class="box-border" />
      <rect x="56" y="0" width="14" height="16" class="box-border" />
      <rect x="70" y="0" width="14" height="16" class="box-border" />
      <rect x="84" y="0" width="14" height="16" class="box-border" />
      <rect x="98" y="0" width="14" height="16" class="box-border" />
      <rect x="112" y="0" width="14" height="16" class="box-border" />
      <rect x="126" y="0" width="14" height="16" class="box-border" />
    </g>
  </g>

  <text x="520" y="105" class="label-small">Date: ____________________________________</text>

  <!-- TOP ACCOUNT CONFIGURATION FIELDS -->
  <g transform="translate(30, 115)">
    <text x="0" y="15" class="label-small">Title of Account:</text>
    <line x1="90" y1="15" x2="740" y2="15" stroke="#4b5563" stroke-width="0.8" />

    <text x="0" y="32" class="label-small">Mailing Address:</text>
    <line x1="90" y1="32" x2="740" y2="32" stroke="#4b5563" stroke-width="0.8" />

    <text x="0" y="49" class="label-small">City/District:</text>
    <line x1="70" y1="49" x2="220" y2="49" stroke="#4b5563" stroke-width="0.8" />
    <text x="230" y="49" class="label-small">Postal code:</text>
    <line x1="290" y1="49" x2="400" y2="49" stroke="#4b5563" stroke-width="0.8" />
    <text x="410" y="49" class="label-small">Country:</text>
    <line x1="460" y1="49" x2="570" y2="49" stroke="#4b5563" stroke-width="0.8" />

    <text x="580" y="49" class="label-small">Date of Attaining Majority</text>
    <text x="580" y="60" class="label-small" style="font-size:8px;">Date - Month - Year</text>

    <!-- Account Nature Checkboxes -->
    <text x="0" y="75" class="label-small">Nature of Account:</text>
    <rect x="90" y="66" width="10" height="10" class="box-border" /><text x="104" y="74" class="label-small">Individual (Single)</text>
    <rect x="185" y="66" width="10" height="10" class="box-border" /><text x="199" y="74" class="label-small">Joint</text>
    <rect x="235" y="66" width="10" height="10" class="box-border" /><text x="249" y="74" class="label-small">Proprietorship</text>
    <rect x="320" y="66" width="10" height="10" class="box-border" /><text x="334" y="74" class="label-small">Photo</text>
    <rect x="380" y="66" width="10" height="10" class="box-border" /><text x="394" y="74" class="label-small">Minor</text>

    <!-- Account Type Checkboxes -->
    <text x="0" y="93" class="label-small">Type of Account:</text>
    <rect x="90" y="84" width="10" height="10" class="box-border" /><text x="104" y="92" class="label-small">Current</text>
    <rect x="185" y="84" width="10" height="10" class="box-border" /><text x="199" y="92" class="label-small">Savings</text>
    <rect x="235" y="84" width="10" height="10" class="box-border" /><text x="249" y="92" class="label-small">BBA</text>
    <rect x="320" y="84" width="10" height="10" class="box-border" /><text x="334" y="92" class="label-small">ESA</text>
    <rect x="380" y="84" width="10" height="10" class="box-border" /><text x="394" y="92" class="label-small">Other (specify)</text>

    <!-- Currency Checkboxes -->
    <text x="0" y="111" class="label-small">Currency of Account:</text>
    <rect x="90" y="102" width="10" height="10" class="box-border" /><text x="104" y="110" class="label-small">Pak. Rupees</text>
    <rect x="185" y="102" width="10" height="10" class="box-border" /><text x="199" y="110" class="label-small">US Dollars</text>
    <rect x="250" y="102" width="10" height="10" class="box-border" /><text x="264" y="110" class="label-small">Pound Sterling</text>
    <rect x="340" y="102" width="10" height="10" class="box-border" /><text x="354" y="110" class="label-small">Euro</text>

    <text x="0" y="132" class="label-small">Details of Business: __________________________________________________</text>
    <text x="520" y="132" class="label-small">NTN (Optional): __________________</text>
  </g>

  <!-- MAIN SECTION BANNER: PERSONAL INFORMATION -->
  <rect x="30" y="260" width="740" height="20" class="green-banner" />
  <text x="400" y="274" class="banner-text">PERSONAL INFORMATION</text>

  <!-- APPLICANT 1 AND APPLICANT 2 BANNERS -->
  <rect x="190" y="282" width="280" height="18" fill="#15803d" />
  <text x="330" y="295" class="banner-text" style="font-size:10px;">Applicant 1</text>

  <rect x="480" y="282" width="290" height="18" fill="#15803d" />
  <text x="625" y="295" class="banner-text" style="font-size:10px;">Applicant 2</text>

  <!-- TABLE GRID FOR APPLICANT DETAILS -->
  <g transform="translate(30, 300)">
    <!-- Outer Table Frame -->
    <rect x="0" y="0" width="740" height="380" fill="none" stroke="#374151" stroke-width="1" />
    <line x1="160" y1="0" x2="160" y2="380" class="grid-line" />
    <line x1="450" y1="0" x2="450" y2="380" class="grid-line" />

    <!-- Row 1: Full Name -->
    <text x="8" y="22" class="label-small">Full Name (as per CNIC)</text>
    <line x1="0" y1="32" x2="740" y2="32" class="grid-line" />

    <!-- Row 2: CNIC Number -->
    <text x="8" y="48" class="label-small">CNIC Number</text>
    <!-- Segmented CNIC boxes for App 1 -->
    <g transform="translate(165, 38)">
      <rect x="0" y="0" width="13" height="14" class="box-border" />
      <rect x="13" y="0" width="13" height="14" class="box-border" />
      <rect x="26" y="0" width="13" height="14" class="box-border" />
      <rect x="39" y="0" width="13" height="14" class="box-border" />
      <rect x="52" y="0" width="13" height="14" class="box-border" />
      <text x="66" y="11" style="font-size:10px;">-</text>
      <rect x="72" y="0" width="13" height="14" class="box-border" />
      <rect x="85" y="0" width="13" height="14" class="box-border" />
      <rect x="98" y="0" width="13" height="14" class="box-border" />
      <rect x="111" y="0" width="13" height="14" class="box-border" />
      <rect x="124" y="0" width="13" height="14" class="box-border" />
      <rect x="137" y="0" width="13" height="14" class="box-border" />
      <rect x="150" y="0" width="13" height="14" class="box-border" />
      <text x="164" y="11" style="font-size:10px;">-</text>
      <rect x="170" y="0" width="13" height="14" class="box-border" />
    </g>
    <line x1="0" y1="58" x2="740" y2="58" class="grid-line" />

    <!-- Row 3: NICOP/POC -->
    <text x="8" y="72" class="label-small">NICOP/POC/Alien Reg. Number</text>
    <line x1="0" y1="80" x2="740" y2="80" class="grid-line" />

    <!-- Row 4: Date of Birth -->
    <text x="8" y="94" class="label-small">Date of Birth</text>
    <line x1="0" y1="102" x2="740" y2="102" class="grid-line" />

    <!-- Row 5: Mother's Maiden Name -->
    <text x="8" y="116" class="label-small">Mother's Maiden Name</text>
    <line x1="0" y1="124" x2="740" y2="124" class="grid-line" />

    <!-- Row 6: Passport Number -->
    <text x="8" y="138" class="label-small">Passport Number</text>
    <line x1="0" y1="148" x2="740" y2="148" class="grid-line" />

    <!-- Row 7: Nationality -->
    <text x="8" y="162" class="label-small">Nationality</text>
    <line x1="0" y1="172" x2="740" y2="172" class="grid-line" />

    <!-- Row 8: Residence Status -->
    <text x="8" y="188" class="label-small">Residence Status</text>
    <rect x="168" y="180" width="10" height="10" class="box-border" /><text x="182" y="188" class="label-small">Resident</text>
    <rect x="230" y="180" width="10" height="10" class="box-border" /><text x="244" y="188" class="label-small">Non-Resident (Country) _______</text>
    <line x1="0" y1="202" x2="740" y2="202" class="grid-line" />

    <!-- Row 9: Permanent Address -->
    <text x="8" y="222" class="label-small">Permanent Residential</text>
    <text x="8" y="234" class="label-small">Address</text>
    <line x1="160" y1="218" x2="450" y2="218" stroke="#d1d5db" />
    <line x1="160" y1="232" x2="450" y2="232" stroke="#d1d5db" />
    <line x1="0" y1="250" x2="740" y2="250" class="grid-line" />

    <!-- Row 10: Profession -->
    <text x="8" y="268" class="label-small">Business / Profession</text>
    <rect x="168" y="260" width="10" height="10" class="box-border" /><text x="182" y="268" class="label-small">Salaried</text>
    <rect x="228" y="260" width="10" height="10" class="box-border" /><text x="242" y="268" class="label-small">Business/Self-Employed</text>
    <rect x="350" y="260" width="10" height="10" class="box-border" /><text x="364" y="268" class="label-small">Housewife</text>
    <line x1="0" y1="282" x2="740" y2="282" class="grid-line" />

    <!-- Row 11: Employer Name -->
    <text x="8" y="300" class="label-small">Name/Address of Employer/</text>
    <text x="8" y="312" class="label-small">Business</text>
    <line x1="0" y1="324" x2="740" y2="324" class="grid-line" />

    <!-- Row 12: Telephone numbers -->
    <text x="8" y="342" class="label-small">Telephone number(s)</text>
    <text x="168" y="342" class="label-small">Office: ____________</text>
    <text x="310" y="342" class="label-small">Mobile: ____________</text>
    <line x1="0" y1="354" x2="740" y2="354" class="grid-line" />

    <!-- Row 13: Email -->
    <text x="8" y="370" class="label-small">E-mail</text>
  </g>

  <!-- APPLICANT 3 AND APPLICANT 4 BANNERS -->
  <rect x="190" y="690" width="280" height="18" fill="#15803d" />
  <text x="330" y="703" class="banner-text" style="font-size:10px;">Applicant 3</text>

  <rect x="480" y="690" width="290" height="18" fill="#15803d" />
  <text x="625" y="703" class="banner-text" style="font-size:10px;">Applicant 4</text>

  <!-- LOWER REPEATED TABLE FRAME -->
  <g transform="translate(30, 708)">
    <rect x="0" y="0" width="740" height="370" fill="none" stroke="#374151" stroke-width="1" />
    <line x1="160" y1="0" x2="160" y2="370" class="grid-line" />
    <line x1="450" y1="0" x2="450" y2="370" class="grid-line" />

    <line x1="0" y1="30" x2="740" y2="30" class="grid-line" />
    <line x1="0" y1="60" x2="740" y2="60" class="grid-line" />
    <line x1="0" y1="90" x2="740" y2="90" class="grid-line" />
    <line x1="0" y1="120" x2="740" y2="120" class="grid-line" />
    <line x1="0" y1="150" x2="740" y2="150" class="grid-line" />
    <line x1="0" y1="180" x2="740" y2="180" class="grid-line" />
    <line x1="0" y1="210" x2="740" y2="210" class="grid-line" />
    <line x1="0" y1="250" x2="740" y2="250" class="grid-line" />
    <line x1="0" y1="290" x2="740" y2="290" class="grid-line" />
    <line x1="0" y1="330" x2="740" y2="330" class="grid-line" />

    <text x="8" y="20" class="label-small">Full name (as per CNIC)</text>
    <text x="8" y="50" class="label-small">CNIC Number</text>
    <text x="8" y="80" class="label-small">NICOP/POC/Alien Reg. Number</text>
    <text x="8" y="110" class="label-small">Date of Birth</text>
    <text x="8" y="140" class="label-small">Mother's Maiden Name</text>
    <text x="8" y="170" class="label-small">Passport Number</text>
    <text x="8" y="200" class="label-small">Nationality</text>
    <text x="8" y="235" class="label-small">Permanent Address</text>
    <text x="8" y="275" class="label-small">Business/Profession</text>
    <text x="8" y="315" class="label-small">Employer Name</text>
    <text x="8" y="350" class="label-small">Telephone / E-mail</text>
  </g>

</svg>
`)}`;

// Generates a crisp, high-resolution SVG of the University of Lahore style official admission form
export const OFFICIAL_FORM_SVG_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1120" width="800" height="1120" style="background:#ffffff; font-family: Arial, Helvetica, sans-serif;">
  <style>
    .header-title { font-size: 22px; font-weight: 900; fill: #1e3a8a; letter-spacing: -0.5px; }
    .uni-green { fill: #16a34a; font-weight: 900; }
    .uni-name { font-size: 20px; font-weight: 800; fill: #1f2937; letter-spacing: 0.5px; }
    .label-text { font-size: 13px; font-weight: 700; fill: #374151; }
    .sublabel { font-size: 10px; font-weight: 500; fill: #6b7280; }
    .box-border { fill: #ffffff; stroke: #9ca3af; stroke-width: 1.2; rx: 2; }
    .grid-line { stroke: #9ca3af; stroke-width: 1; }
    .section-title { font-size: 17px; font-weight: 900; fill: #0284c7; text-transform: uppercase; letter-spacing: 0.5px; }
    .undertaking-text { font-size: 10.5px; fill: #4b5563; line-height: 1.4; }
  </style>

  <!-- Background Canvas -->
  <rect width="800" height="1120" fill="#ffffff" />
  <rect x="15" y="15" width="770" height="1090" fill="none" stroke="#e5e7eb" stroke-width="1.5" />

  <!-- TOP HEADER ROW -->
  <!-- Top Left: Form Number -->
  <text x="40" y="55" class="label-text" style="fill:#0284c7; font-size: 13px;">FORM NUMBER</text>
  <rect x="40" y="62" width="180" height="38" class="box-border" />

  <!-- Top Center: University Logo Branding -->
  <g transform="translate(300, 30)">
    <!-- Tower Icon -->
    <path d="M 25,45 L 30,10 L 35,45 Z" fill="#16a34a" />
    <circle cx="30" cy="10" r="3" fill="#15803d" />
    <path d="M 15,48 A 18,18 0 0,1 45,48" stroke="#16a34a" stroke-width="3" fill="none" />
    <text x="55" y="24" style="font-size: 12px; font-weight: 800; fill: #4b5563; letter-spacing: 1px;">THE</text>
    <text x="55" y="42" class="uni-name"><tspan fill="#16a34a">UNIVERSITY</tspan> OF</text>
    <text x="55" y="62" style="font-size: 22px; font-weight: 900; fill: #16a34a; letter-spacing: 1px;">LAHORE</text>
  </g>

  <!-- Top Right: Entry Test Roll Number -->
  <text x="560" y="55" class="label-text" style="fill:#0284c7; font-size: 13px;">ENTRY TEST ROLL NUMBER</text>
  <rect x="560" y="62" width="200" height="38" class="box-border" />

  <!-- SECTION 1: PERSONAL DETAILS -->
  <text x="40" y="135" class="section-title">PERSONAL DETAILS</text>

  <!-- Field: Name -->
  <text x="40" y="172" class="label-text">Name:</text>
  <rect x="230" y="152" width="530" height="32" class="box-border" />

  <!-- Field: Father/Guardian Name -->
  <text x="40" y="215" class="label-text">Father's/Guardian's Name:</text>
  <rect x="230" y="195" width="530" height="32" class="box-border" />

  <!-- Field: NIC No -->
  <text x="40" y="258" class="label-text">NIC No:</text>
  <rect x="230" y="238" width="530" height="32" class="box-border" />
  <text x="230" y="283" class="sublabel">In case you do not have CNIC provide Parent's NIC details.</text>

  <!-- Field: Date of Birth & Gender -->
  <text x="40" y="318" class="label-text">Date of Birth: <tspan style="font-size:10px; font-weight:normal; fill:#6b7280;">(DD MM YYYY)</tspan></text>

  <!-- DOB segmented boxes -->
  <g transform="translate(230, 298)">
    <rect x="0" y="0" width="24" height="28" class="box-border" />
    <rect x="26" y="0" width="24" height="28" class="box-border" />
    <rect x="58" y="0" width="24" height="28" class="box-border" />
    <rect x="84" y="0" width="24" height="28" class="box-border" />
    <rect x="116" y="0" width="24" height="28" class="box-border" />
    <rect x="142" y="0" width="24" height="28" class="box-border" />
    <rect x="168" y="0" width="24" height="28" class="box-border" />
    <rect x="194" y="0" width="24" height="28" class="box-border" />
  </g>

  <!-- Gender -->
  <text x="530" y="318" class="label-text">Gender:</text>
  <rect x="590" y="302" width="20" height="20" class="box-border" />
  <text x="618" y="317" class="label-text">M</text>
  <rect x="645" y="302" width="20" height="20" class="box-border" />
  <text x="673" y="317" class="label-text">F</text>

  <!-- Field: Place of Birth & Nationality -->
  <text x="40" y="362" class="label-text">Place of Birth:</text>
  <rect x="230" y="342" width="220" height="32" class="box-border" />

  <text x="470" y="362" class="label-text">Nationality:</text>
  <rect x="550" y="342" width="210" height="32" class="box-border" />

  <!-- Field: Postal Address -->
  <text x="40" y="415" class="label-text">Postal Address:</text>
  <rect x="230" y="392" width="530" height="32" class="box-border" />
  <rect x="230" y="432" width="530" height="32" class="box-border" />

  <!-- Field: Phone No & Mobile No -->
  <text x="40" y="495" class="label-text">Phone No:</text>
  <rect x="230" y="475" width="220" height="32" class="box-border" />

  <text x="470" y="495" class="label-text">Mobile No:</text>
  <rect x="550" y="475" width="210" height="32" class="box-border" />

  <!-- Field: Email -->
  <text x="40" y="538" class="label-text">Email:</text>
  <rect x="230" y="518" width="530" height="32" class="box-border" />


  <!-- SECTION 2: PREVIOUS QUALIFICATIONS -->
  <text x="40" y="590" class="section-title">PREVIOUS QUALIFICATIONS</text>

  <!-- Table Outline -->
  <g transform="translate(40, 605)">
    <!-- Header Box -->
    <rect x="0" y="0" width="720" height="32" fill="#f3f4f6" stroke="#6b7280" stroke-width="1.2" />
    <line x1="220" y1="0" x2="220" y2="160" stroke="#6b7280" stroke-width="1.2" />
    <line x1="280" y1="0" x2="280" y2="160" stroke="#6b7280" stroke-width="1.2" />
    <line x1="560" y1="0" x2="560" y2="160" stroke="#6b7280" stroke-width="1.2" />
    <line x1="640" y1="0" x2="640" y2="160" stroke="#6b7280" stroke-width="1.2" />

    <!-- Table Header Labels -->
    <text x="10" y="20" style="font-size:12px; font-weight:800; fill:#0284c7;">Certificate/Degree/Specialization</text>
    <text x="232" y="20" style="font-size:12px; font-weight:800; fill:#0284c7;">Year</text>
    <text x="292" y="20" style="font-size:12px; font-weight:800; fill:#0284c7;">Board/University</text>
    <text x="572" y="20" style="font-size:12px; font-weight:800; fill:#0284c7;">Marks</text>
    <text x="648" y="20" style="font-size:12px; font-weight:800; fill:#0284c7;">Div/Grade</text>

    <!-- Table Rows -->
    <rect x="0" y="0" width="720" height="160" fill="none" stroke="#6b7280" stroke-width="1.2" />
    <line x1="0" y1="64" x2="720" y2="64" stroke="#9ca3af" stroke-width="1" />
    <line x1="0" y1="96" x2="720" y2="96" stroke="#9ca3af" stroke-width="1" />
    <line x1="0" y1="128" x2="720" y2="128" stroke="#9ca3af" stroke-width="1" />
  </g>

  <!-- SECTION 3: UNDERTAKINGS -->
  <text x="40" y="800" class="section-title">UNDERTAKINGS</text>
  <text x="40" y="822" style="font-size:12px; font-weight:800; fill:#1f2937;">Candidates awaiting results are required to sign the following undertaking:</text>
  <text x="40" y="842" class="undertaking-text">I undertake to submit attested photocopy of my Intermediate/A-Level/DAE/Bachelors/Masters/MPhil result as soon as it is</text>
  <text x="40" y="858" class="undertaking-text">declared. In case, if the result is declared, I will submit it within 3 weeks from the date of admission. If I fail to fulfill the eligibility</text>
  <text x="40" y="874" class="undertaking-text">criteria for admission, The University of Lahore has the right to cancel my admission.</text>

  <!-- Signature and Date lines -->
  <text x="40" y="930" class="label-text">Signature of Applicant: <tspan style="font-weight:normal; fill:#9ca3af;">____________________________________</tspan></text>
  <text x="450" y="930" class="label-text">Date: <tspan style="font-weight:normal; fill:#9ca3af;">________________________</tspan></text>

</svg>
`)}`;

