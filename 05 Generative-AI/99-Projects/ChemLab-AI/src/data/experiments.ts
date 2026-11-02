import { Experiment } from '../types';

export const EXPERIMENTS_DATA: Experiment[] = [
  {
    id: 'acid-base-titration',
    name: 'Acid-Base Titration',
    category: 'Volumetric Analysis',
    description: 'Determination of the unknown concentration of a hydrochloric acid (HCl) solution using a standard sodium hydroxide (NaOH) solution with phenolphthalein indicator.',
    aim: 'To determine the exact molarity and concentration (g/L) of an unknown hydrochloric acid solution by titrating it against a standardized 0.1 M sodium hydroxide solution.',
    principle: 'Acid-base titration is based on a neutralization reaction where hydrogen ions (H⁺) from the acid react with hydroxide ions (OH⁻) from the base to form neutral water: H⁺(aq) + OH⁻(aq) → H₂O(l). At the equivalence point, the stoichiometry obeys N₁V₁ = N₂V₂ (or M₁V₁ = M₂V₂ for monoprotic acid and monovalent base). Phenolphthalein changes from colorless in acidic solution to faint permanent pink at the end point (pH 8.2–10.0).',
    chemicals: [
      'Unknown Hydrochloric Acid (HCl) solution',
      'Standardized 0.1 M Sodium Hydroxide (NaOH) solution',
      'Phenolphthalein indicator solution (0.1% in ethanol)',
      'Distilled water'
    ],
    apparatus: [
      '50 mL Burette with stand and clamp',
      '25 mL Volumetric Pipette & Pipette filler',
      '250 mL Conical flasks (Erlenmeyer flasks)',
      'White tile / ceramic sheet for end-point observation',
      'Funnel & Wash bottle with distilled water',
      'Beakers (100 mL and 250 mL)'
    ],
    procedure: [
      'Rinse the burette thoroughly with distilled water and then with a small portion of 0.1 M NaOH solution.',
      'Fill the burette with 0.1 M NaOH solution using a funnel, remove air bubbles from the tip, adjust the initial level to 0.00 mL, and record the initial reading.',
      'Rinse a 25 mL pipette with distilled water and then with the unknown HCl solution.',
      'Pipette exactly 25.0 mL of unknown HCl solution into a clean 250 mL conical flask.',
      'Add 2–3 drops of phenolphthalein indicator to the acid in the conical flask (the solution remains colorless).',
      'Place a white tile underneath the conical flask to enhance visibility of the color change.',
      'Slowly add NaOH from the burette while constantly swirling the flask until a persistent faint pink color appears that lasts for at least 30 seconds.',
      'Record the final burette reading. Calculate the volume of NaOH used (Titre value).',
      'Repeat the titration at least 3 times until concordant readings (differing by no more than ±0.05 mL) are obtained.'
    ],
    expectedObservations: [
      'Solution in the conical flask starts completely colorless.',
      'Transient pink spots appear where NaOH droplets land in the flask during titration and vanish upon swirling.',
      'At the endpoint, a single drop of NaOH turns the entire solution a persistent faint light pink color that remains stable for at least 30 seconds.'
    ],
    safetyPrecautions: [
      'Wear safety goggles, lab coat, and chemical-resistant gloves at all times.',
      'Sodium hydroxide (NaOH) is caustic and corrosive to eyes and skin; immediately wash off any spills with excess water.',
      'Hydrochloric acid (HCl) emits corrosive fumes; handle concentrated solutions in a fume hood.',
      'Never suck solution into a pipette by mouth; always use a rubber bulb or modern mechanical pipette filler.',
      'Ensure the burette clamp is securely attached to prevent breakage.'
    ],
    commonMistakes: [
      'Forgetting to rinse burette and pipette with their respective titrants, diluting the solutions with water drops inside.',
      'Leaving an air bubble trapped in the tip of the burette before commencing the titration.',
      'Overshooting the endpoint resulting in a dark magenta/purple color instead of faint pink.',
      'Reading the burette meniscus incorrectly (always read the bottom of the meniscus at eye level).',
      'Not swirling the flask continuously during addition of titrant.'
    ],
    keyPoints: [
      'Equivalence Point: The theoretical point where moles of acid equal moles of base.',
      'End Point: The practical point where the indicator visually changes color.',
      'Phenolphthalein indicator range: pH 8.2 to 10.0.',
      'Calculation formula: M₁V₁ (Acid) = M₂V₂ (Base).',
      'Concordant readings are concordant burette values within 0.05 mL–0.1 mL of each other.'
    ],
    keywords: ['titration', 'acid', 'base', 'neutralization', 'volumetric', 'molarity', 'phenolphthalein', 'burette', 'pipette', 'HCl', 'NaOH']
  },
  {
    id: 'standard-solution-prep',
    name: 'Preparation of a Standard Solution',
    category: 'Solution Preparation',
    description: 'Preparation of 250 mL of a primary standard 0.05 M Sodium Carbonate (Na₂CO₃) or Oxalic Acid solution using quantitative analytical weighing.',
    aim: 'To accurately weigh a primary standard solute and prepare 250.0 mL of a standard 0.05 M solution in a volumetric flask.',
    principle: 'A standard solution is a solution of precisely known concentration. A primary standard solute must be ultra-pure, stable in air, non-hygroscopic, have high molar mass, and dissolve readily in water. The molarity M is calculated using M = (mass in grams / molar mass in g/mol) × (1000 / volume in mL). For sodium carbonate (Na₂CO₃, Molar Mass = 105.99 g/mol), 0.05 M in 250 mL requires weighing exactly 1.325 g.',
    chemicals: [
      'Anhydrous Sodium Carbonate (Na₂CO₃) primary standard grade (dried at 110°C)',
      'Distilled water / Deionized water'
    ],
    apparatus: [
      'Analytical electronic balance (accuracy ±0.0001 g)',
      '250 mL Volumetric flask with stopper',
      'Weighing bottle / watch glass & Spatula',
      '100 mL Beaker',
      'Glass stirring rod',
      'Glass funnel & Wash bottle with distilled water',
      'Pasteur dropper / dropper pipette'
    ],
    procedure: [
      'Calculate the exact mass of solute required for 250 mL of 0.05 M Na₂CO₃ solution: Mass = 0.05 mol/L × 0.25 L × 105.99 g/mol = 1.3249 g (~1.325 g).',
      'Tare a clean, dry weighing bottle on an analytical balance and accurately weigh out approximately 1.325 g of dried Na₂CO₃. Record the exact mass to 4 decimal places.',
      'Transfer the weighed powder quantitatively into a clean 100 mL beaker.',
      'Add approximately 50 mL of distilled water and stir thoroughly with a glass rod until all crystals dissolve completely.',
      'Place a funnel in the neck of a 250 mL volumetric flask. Carefully pour the dissolved solution down the glass rod into the funnel.',
      'Rinse the beaker, glass rod, and funnel 3–4 times with small portions of distilled water, collecting all washings into the volumetric flask to ensure quantitative transfer.',
      'Add distilled water into the volumetric flask until the meniscus reaches approximately 1 cm below the etched calibration mark.',
      'Use a dropper pipette to add the final drops of distilled water slowly until the bottom of the meniscus aligns exactly with the calibration ring at eye level.',
      'Stopper the flask securely and invert it 10–15 times to ensure thorough mixing and homogenization.'
    ],
    expectedObservations: [
      'Solid anhydrous sodium carbonate dissolves cleanly in water to yield a clear, colorless, homogeneous solution without suspended particles.',
      'Upon inverted mixing, schlieren lines (refraction patterns) vanish, confirming complete uniform concentration.'
    ],
    safetyPrecautions: [
      'Wear eye protection and gloves while handling chemical solids and volumetric glassware.',
      'Avoid inhaling sodium carbonate dust; handle powders gently on watch glasses.',
      'Do not heat volumetric flasks, as thermal expansion permanently ruins calibration volume accuracy.',
      'Hold the volumetric flask stopper tightly while inverting to prevent spillage.'
    ],
    commonMistakes: [
      'Accidentally adding water past the 250 mL calibration mark on the volumetric flask (requires restarting completely!).',
      'Failing to wash the beaker and stirring rod into the volumetric flask, resulting in loss of solute mass.',
      'Incompletely mixing the solution after bringing it to final volume.',
      'Weighing moist sodium carbonate rather than dry oven-treated substance.'
    ],
    keyPoints: [
      'Primary Standard requirements: High purity (>99.9%), high molar mass, stability, non-deliquescent.',
      'Quantitative transfer: Ensuring every milligram of solute reaches the flask via systematic rinsing.',
      'Volumetric flask calibration is valid at room temperature (usually 20°C).',
      'Molarity calculation formula: M = m / (MW × V_L).'
    ],
    keywords: ['standard solution', 'volumetric flask', 'primary standard', 'molarity', 'weighing', 'sodium carbonate', 'concentration']
  },
  {
    id: 'qualitative-analysis-cations',
    name: 'Qualitative Analysis of Cations',
    category: 'Inorganic Chemistry',
    description: 'Systematic separation and qualitative identification of group cations (Pb²⁺, Cu²⁺, Fe³⁺, Al³⁺, Ba²⁺, NH₄⁺) using selective precipitation and confirmation reagents.',
    aim: 'To identify unknown inorganic cations present in an aqueous sample using systematic precipitation reactions and characteristic confirmatory tests.',
    principle: 'Qualitative inorganic analysis separates cations into classical analytical groups based on differences in solubility products (K_sp) of their chlorides, sulfides, hydroxides, and carbonates. Group I (e.g., Pb²⁺) precipitates with dil. HCl as insoluble chlorides. Group II (e.g., Cu²⁺) precipitates as acid-insoluble sulfides. Group III (e.g., Fe³⁺, Al³⁺) precipitates as hydroxides with NH₄OH/NH₄Cl buffer. Confirmation relies on specific complexation, color, or spot reactions.',
    chemicals: [
      'Unknown inorganic salt solution containing cation mixture',
      '6 M Hydrochloric acid (HCl)',
      '6 M Nitric acid (HNO₃)',
      '6 M Aqueous Ammonia / Ammonium hydroxide (NH₄OH)',
      'Ammonium chloride (NH₄Cl) solid/solution',
      'Potassium chromate (K₂CrO₄) solution',
      'Potassium ferrocyanide (K₄[Fe(CN)₆]) solution',
      'Potassium thiocyanate (KSCN) solution',
      'Sodium hydroxide (NaOH) solution',
      'Nessler reagent (for NH₄⁺ testing)'
    ],
    apparatus: [
      'Test tubes & Test tube rack',
      'Centrifuge & Centrifuge tubes (or Filter paper & funnel)',
      'Water bath with beaker & tripod',
      'Bunsen burner & Wire gauze',
      'Dropper pipettes & Glass stirring rods',
      'Red and Blue Litmus paper'
    ],
    procedure: [
      'Group I Test: Take 1–2 mL of unknown sample in a test tube. Add 5–6 drops of 6 M HCl. If a white precipitate forms, Group I cations (Pb²⁺) are present. Centrifuge and separate supernatant.',
      'Lead (Pb²⁺) Confirmation: Dissolve Group I white precipitate in hot distilled water. Add drops of K₂CrO₄ solution. Formation of a yellow precipitate confirms Pb²⁺.',
      'Group III Test: To the supernatant, add 1 g solid NH₄Cl and boil. Add 6 M NH₄OH until basic to litmus. Formation of reddish-brown precipitate indicates Fe³⁺; gelatinous white precipitate indicates Al³⁺.',
      'Iron (Fe³⁺) Confirmation: Dissolve reddish-brown precipitate in dil. HCl. Add KSCN solution. Formation of an intense blood-red solution ([Fe(SCN)]²⁺) confirms Fe³⁺.',
      'Copper (Cu²⁺) Confirmation: Add excess NH₄OH to sample solution. Formation of a deep royal blue complex ([Cu(NH₃)₄]²⁺) confirms Cu²⁺.',
      'Ammonium (NH₄⁺) Test: Heat sample solution with 6 M NaOH. Waft gas gently; ammoniacal odor and turning moist red litmus paper blue confirms NH₄⁺. Drop Nessler reagent to form reddish-brown precipitate.'
    ],
    expectedObservations: [
      'Pb²⁺ + HCl → White precipitate (PbCl₂), dissolves in hot water, yields bright yellow precipitate (PbCrO₄) with K₂CrO₄.',
      'Fe³⁺ + NH₄OH → Reddish-brown gelatinous precipitate (Fe(OH)₃), turns blood-red with KSCN.',
      'Cu²⁺ + excess NH₄OH → Deep royal blue solution due to tetraamminecopper(II) ion.',
      'NH₄⁺ + NaOH + heat → Pungent ammonia smell turning red litmus paper blue, brown precipitate with Nessler reagent.'
    ],
    safetyPrecautions: [
      'Perform heating steps involving ammonia or acid fumes in a fume hood or well-ventilated area.',
      'Never point test tubes towards yourself or lab partners while heating.',
      'Handle concentrated acids (HCl, HNO₃) with extreme caution; they cause severe skin burns.',
      'Nessler reagent contains heavy mercury complexes; collect mercury waste in designated hazard waste containers.'
    ],
    commonMistakes: [
      'Over-acidifying or under-buffering prior to hydroxides precipitation.',
      'Confusing gelatinous aluminum hydroxide with zinc or calcium white precipitates.',
      'Heating test tubes too rapidly causing liquid to bump out unexpectedly.',
      'Failing to wash precipitates before carrying out confirmatory reactions.'
    ],
    keyPoints: [
      'Group separation relies on selective K_sp (solubility product) thresholds.',
      'PbCl₂ is uniquely soluble in hot water among Group I chlorides.',
      'Fe³⁺ produces deep blood-red thiocyanate complexation [Fe(SCN)]²⁺.',
      'NH₄⁺ is always tested on the fresh original solution without passing through group separations.'
    ],
    keywords: ['cations', 'qualitative analysis', 'precipitation', 'lead', 'iron', 'copper', 'ammonium', 'inorganic chemistry', 'test tubes', 'Nessler']
  },
  {
    id: 'flame-test',
    name: 'Flame Test for Metal Ions',
    category: 'Qualitative Analysis',
    description: 'Identification of alkali and alkaline earth metal cations (Na⁺, K⁺, Ca²⁺, Sr²⁺, Ba²⁺, Cu²⁺) based on characteristic emission wavelengths in a Bunsen burner flame.',
    aim: 'To observe and identify metal cations present in unknown salts by observing their characteristic spectral atomic flame emission color.',
    principle: 'When metal salts are introduced into a high-temperature non-luminous flame, thermal energy excites valence electrons from lower energy ground states to higher energy excited orbitals. As these excited electrons rapidly return to lower energy states, they emit electromagnetic radiation of discrete wavelengths (photons) proportional to ΔE = hν. The emitted wavelength falls within the visible spectrum, imparting a characteristic flame color.',
    chemicals: [
      'Metal chloride salts: NaCl, KCl, CaCl₂, SrCl₂, BaCl₂, CuCl₂',
      'Concentrated Hydrochloric acid (12 M HCl) in a watch glass for cleaning platinum/nichrome wire',
      'Unknown metal salt samples'
    ],
    apparatus: [
      'Platinum loop or Nichrome wire mounted on a glass handle',
      'Bunsen burner with adjustable air collar',
      'Cobalt blue glass filter (essential for viewing K⁺ flame in presence of Na⁺ contamination)',
      'Watch glass / ceramic spot plate',
      'Safety goggles & lab apron'
    ],
    procedure: [
      'Adjust the air collar of the Bunsen burner to produce a hot, clear, non-luminous blue flame with an inner cone.',
      'Clean the nichrome wire loop by dipping it into a watch glass containing concentrated HCl and holding it in the hottest zone of the Bunsen flame until no residual color is observed.',
      'Dip the clean, moist loop into a small sample of the unknown metal chloride salt so a few tiny crystals adhere to the wire.',
      'Insert the loop into the lower outer edge of the non-luminous flame.',
      'Observe and record the intense color imparted to the flame immediately upon insertion.',
      'When testing Potassium (K⁺), view the flame through a Cobalt blue glass to absorb persistent yellow sodium emission.',
      'Clean the wire loop thoroughly with conc. HCl and flame-heating between testing different salt samples.'
    ],
    expectedObservations: [
      'Sodium (Na⁺): Persistent, intense golden yellow flame.',
      'Potassium (K⁺): Lilac / Violet flame (appears crimson-pink through cobalt blue glass).',
      'Calcium (Ca²⁺): Brick red / Orange-red flame.',
      'Strontium (Sr²⁺): Crimson / Scarlet red flame.',
      'Barium (Ba²⁺): Apple green / Yellowish-green flame.',
      'Copper (Cu²⁺): Blue-green flame with white flashes.'
    ],
    safetyPrecautions: [
      'Concentrated HCl is volatile and highly corrosive; handle with safety goggles and avoid breathing fumes.',
      'Nichrome and platinum wire retain extreme heat; allow loop to cool on a ceramic pad before touching.',
      'Tie long hair back securely and ensure no flammable vapors/solvents are near open Bunsen flames.'
    ],
    commonMistakes: [
      'Failing to clean the wire loop thoroughly, resulting in persistent sodium yellow contamination masking all other colors.',
      'Holding the loop in the cool inner cone of the flame rather than the hot outer blue cone.',
      'Using nitrate or sulfate salts instead of chloride salts (chlorides are volatile and produce stronger flame colors).',
      'Forgetting to use cobalt blue glass when inspecting potassium samples.'
    ],
    keyPoints: [
      'Atomic emission spectroscopy principle: ΔE = hν = hc / λ.',
      'Chlorides are preferred because of their high volatility in thermal flames.',
      'Cobalt blue glass absorbs yellow 589 nm sodium light while transmitting 404 nm violet potassium emission.',
      'Sodium yellow emission is extremely sensitive even to trace fingerprint oils.'
    ],
    keywords: ['flame test', 'emission spectrum', 'sodium', 'potassium', 'barium', 'calcium', 'copper', 'nichrome wire', 'cobalt glass', 'alkali metals']
  },
  {
    id: 'determination-of-ph',
    name: 'Determination of pH of Solutions',
    category: 'Physical Chemistry',
    description: 'Measurement of hydrogen ion concentration [H⁺] and pH of various household and laboratory solutions using universal indicator, pH paper, and a calibrated digital pH meter.',
    aim: 'To determine and compare the pH of various strong/weak acids, bases, and salt solutions using universal indicator paper and a digital pH meter calibrated with standard buffer solutions.',
    principle: 'pH is defined as the negative logarithm (base 10) of hydrogen ion activity: pH = -log₁₀[H⁺]. The pH scale ranges from 0 (highly acidic) to 14 (highly basic), with pH 7 being neutral at 25°C. A digital pH meter measures the electromotive force (EMF) generated across a glass-combination electrode immersed in solution, converting millivolts directly into pH units according to the Nernst equation.',
    chemicals: [
      '0.1 M Hydrochloric acid (HCl)',
      '0.1 M Ethanoic acid (CH₃COOH)',
      '0.1 M Sodium hydroxide (NaOH)',
      '0.1 M Ammonia solution (NH₃)',
      '0.1 M Sodium chloride (NaCl)',
      'Standard Buffer solutions (pH 4.00, pH 7.00, pH 10.00)',
      'Universal indicator solution & full-range pH indicator paper',
      'Distilled water'
    ],
    apparatus: [
      'Digital pH meter with glass combination electrode',
      'Small beakers (50 mL and 100 mL)',
      'Spot plate / ceramic tile',
      'Wash bottle with distilled water & lint-free tissue wipes (Kimwipes)',
      'Glass stirring rods & Dropper pipettes',
      'Thermometer'
    ],
    procedure: [
      'Calibration of pH meter: Rinse the glass electrode with distilled water and gently blot dry with lint-free tissue.',
      'Immerse electrode into pH 7.00 standard buffer solution, adjust calibration knob to 7.00. Rinse and blot.',
      'Immerse electrode into pH 4.00 buffer (for acidic range testing) or pH 10.00 buffer (for basic testing), and adjust slope control. Rinse thorough with distilled water.',
      'Testing with Universal Indicator Paper: Place 1 drop of test solution onto a strip of universal indicator paper on a spot plate. Match the resulting color against the standard pH color scale chart.',
      'Testing with Digital pH Meter: Pour 25 mL of sample solution into a clean 50 mL beaker.',
      'Lower the calibrated pH electrode into the solution, swirl gently, and allow reading to stabilize for 15–30 seconds.',
      'Record the exact pH value displayed on the meter screen.',
      'Rinse electrode thoroughly with distilled water and blot dry between every sample test.'
    ],
    expectedObservations: [
      '0.1 M HCl: pH ~ 1.0 (Dark Red on paper)',
      '0.1 M CH₃COOH: pH ~ 2.9 (Orange/Yellow on paper)',
      'Distilled water / NaCl: pH ~ 6.5–7.0 (Green on paper)',
      '0.1 M NH₃: pH ~ 11.1 (Blue-Violet on paper)',
      '0.1 M NaOH: pH ~ 13.0 (Deep Purple/Violet on paper)'
    ],
    safetyPrecautions: [
      'Wear safety glasses and gloves when handling acids and alkalis.',
      'The glass bulb at the tip of the pH electrode is extremely fragile and thin; do not bang it against beaker walls.',
      'Never allow the pH electrode bulb to dry out; store it submerged in 3 M KCl storage solution when not in use.'
    ],
    commonMistakes: [
      'Wiping or rubbing the glass electrode forcefully with tissue paper, which generates static charges and distorts readings.',
      'Skipping 2-point calibration before taking measurements.',
      'Failing to rinse the electrode between samples, causing cross-contamination of acidic and basic solutions.',
      'Measuring solution pH at non-standard temperatures without temperature compensation.'
    ],
    keyPoints: [
      'pH definition: pH = -log₁₀[H⁺]; pOH = -log₁₀[OH⁻]; pH + pOH = 14 at 25°C.',
      'Strong acids dissociate completely ([H⁺] = C), whereas weak acids dissociate partially ([H⁺] = √(K_a × C)).',
      'Glass electrode voltage follows the Nernst equation: E = E₀ + (2.303 RT/F) × pH.',
      'Two-point buffer calibration ensures accurate slope linearity.'
    ],
    keywords: ['pH meter', 'universal indicator', 'acids', 'bases', 'buffer', 'logarithm', 'hydrogen ions', 'glass electrode', 'acidity']
  }
];
