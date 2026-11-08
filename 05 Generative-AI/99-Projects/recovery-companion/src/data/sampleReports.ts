import { DischargePlan, SampleReport } from '../types';

export const SAMPLE_REPORTS: SampleReport[] = [
  {
    id: 'report-knee-replacement',
    title: 'Post-Operative Total Knee Arthroplasty',
    category: 'Orthopedic Surgery',
    hospitalName: 'St. Jude Medical Center',
    patientName: 'Robert Vance',
    dischargeDate: '2026-07-20',
    attendingPhysician: 'Dr. Sarah Lin, MD (Orthopedics)',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    summaryPreview: 'Right total knee replacement discharge instructions including incision care, blood thinner schedule, physical therapy exercises, and weight-bearing precautions.',
    rawText: `ST. JUDE MEDICAL CENTER - PATIENT DISCHARGE SUMMARY
Patient Name: Robert Vance | DOB: 05/14/1962 | MRN: #9842104
Discharge Date: July 20, 2026
Attending Physician: Dr. Sarah Lin, MD (Orthopedic Surgery)

PRIMARY DIAGNOSIS:
Primary Osteoarthritis of Right Knee (M17.11)
PROCEDURE PERFORMED:
Right Total Knee Arthroplasty (TKA) on July 18, 2026. Uncomplicated hospital stay.

DISCHARGE MEDICATIONS:
1. Apixaban (Eliquis) 2.5 mg PO TWICE DAILY with food for 14 days. Purpose: Deep vein thrombosis (DVT) prophylaxis.
2. Oxycodone 5 mg PO EVERY 6 HOURS AS NEEDED for severe postoperative pain (Scale 7-10). Do not drive or operate heavy machinery.
3. Acetaminophen (Tylenol) 650 mg PO EVERY 8 HOURS scheduled for mild to moderate pain (Max 3000mg/day).
4. Docusate Sodium (Colace) 100 mg PO TWICE DAILY for constipation while taking opioids.
5. Ondansetron 4 mg PO EVERY 8 HOURS AS NEEDED for nausea.

WOUND CARE & INCISION INSTRUCTIONS:
- Keep surgical dressing dry and intact. May shower after Day 5 using waterproof dressing cover. Do NOT submerge knee in tub, pool, or jacuzzi for 6 weeks.
- Check incision daily for signs of infection (increased redness, warmth, purulent drainage, or foul odor).

ACTIVITY & PHYSICAL THERAPY:
- Weight bearing as tolerated on right leg with walker or crutches.
- Home Physical Therapy starting July 22, 2026 (3x weekly).
- Perform ankle pumps 20 times every hour while awake to prevent blood clots.
- Apply ice pack to knee for 20 minutes every 2 hours to reduce swelling. Elevate calf with pillow under ankle (DO NOT place pillow directly under knee joint).

FOLLOW-UP APPOINTMENTS:
1. Dr. Sarah Lin (Orthopedics): 14 days post-op (August 3, 2026 at 10:30 AM) at St. Jude Orthopedic Clinic, Suite 400. Phone: (555) 234-8900. Staples removal and X-rays.
2. Primary Care Physician (Dr. Mark Davis): 4 weeks post-op (August 17, 2026 at 2:00 PM).

EMERGENCY RED-FLAG WARNING SIGNS (Seek Immediate Emergency Medical Care / Call 911):
- Sudden shortness of breath, chest pain, or coughing up blood (Possible Pulmonary Embolism).
- Severe swelling, calf tightness, or sudden pain in either lower leg/calf.
- High fever exceeding 101.5°F (38.6°C) or severe shaking chills.
- Inability to bend or flex knee accompanied by severe unmanageable pain.
- Foul-smelling drainage, opening of incision edges, or spreading red streaks from surgical site.
`
  },
  {
    id: 'report-cardiac-stent',
    title: 'Acute Coronary Syndrome / Post-PCI Stent',
    category: 'Cardiology',
    hospitalName: 'Mercy Heart & Vascular Institute',
    patientName: 'Eleanor Vance',
    dischargeDate: '2026-07-21',
    attendingPhysician: 'Dr. Marcus Vance, MD (Interventional Cardiology)',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    summaryPreview: 'Post-cardiac catheterization with drug-eluting stent to LAD artery. Dual antiplatelet therapy regimen, groin site care, and cardiac rehab guidance.',
    rawText: `MERCY HEART & VASCULAR INSTITUTE - DISCHARGE INSTRUCTIONS
Patient Name: Eleanor Vance | DOB: 09/28/1958 | MRN: #440219
Discharge Date: July 21, 2026
Attending Physician: Dr. Marcus Vance, MD

PRIMARY DIAGNOSIS:
Non-ST Elevation Myocardial Infarction (NSTEMI). Coronary Artery Disease.
PROCEDURES:
Left Heart Catheterization, Percutaneous Coronary Intervention (PCI) with 1x Drug-Eluting Stent placed in Left Anterior Descending (LAD) coronary artery via right femoral arteriotomy.

CRITICAL MEDICATION INSTRUCTIONS (DO NOT STOP DUAL ANTIPLATELET THERAPY):
1. Aspirin 81 mg PO ONCE DAILY indefinitely.
2. Ticagrelor (Brilinta) 90 mg PO TWICE DAILY for 12 months. CRITICAL: Never miss a dose. Stopping abruptly increases risk of stent thrombosis/heart attack.
3. Atorvastatin (Lipitor) 80 mg PO ONCE DAILY at bedtime for cholesterol lowering and plaque stabilization.
4. Metoprolol Succinate ER 25 mg PO ONCE DAILY in the morning to lower heart rate and workload.
5. Nitroglycerin 0.4 mg Sublingual Tablet AS NEEDED for chest pain. Take 1 tablet under tongue at onset of chest discomfort. If pain persists after 5 minutes, CALL 911 immediately before taking a second dose.

GROIN ACCESS SITE CARE:
- Small bruising at right groin is normal. Keep area clean and dry.
- No heavy lifting greater than 10 lbs for 7 days. Avoid straining or vigorous stair climbing.
- Inspect groin daily for swelling, lump formation, or active bleeding.

ACTIVITY & LIFESTYLE:
- No driving for 3 days post-procedure.
- Low-sodium, heart-healthy Mediterranean diet (<2,000 mg sodium/day).
- Enroll in Outpatient Cardiac Rehabilitation Program.

FOLLOW-UP APPOINTMENTS:
1. Mercy Cardiology Clinic (Dr. Marcus Vance): July 29, 2026 at 9:00 AM. Groin check & EKG. Phone: (555) 891-3000.
2. Outpatient Cardiac Rehab Orientation: August 1, 2026 at 11:00 AM.

WARNING SIGNS & EMERGENCY INSTRUCTIONS:
- Sudden chest tightness, pain radiating to left arm or jaw, or unexplained shortness of breath: CALL 911 IMMEDIATELY.
- Active bleeding, sudden swelling, or pulsating lump at right groin site: Apply firm pressure over groin and CALL 911 IMMEDIATELY.
- Dizziness, fainting spells, or pulse dropping below 50 BPM.
`
  },
  {
    id: 'report-acute-bronchitis',
    title: 'Emergency Dept: Acute Bronchitis & Asthma',
    category: 'Emergency Medicine',
    hospitalName: 'City General Hospital ED',
    patientName: 'David Chen',
    dischargeDate: '2026-07-22',
    attendingPhysician: 'Dr. Elena Rostova, MD (Emergency Medicine)',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    summaryPreview: 'ED discharge following breathing treatment for viral bronchitis with reactive airway spasm. Steroid taper, inhaler instructions, and respiratory precautions.',
    rawText: `CITY GENERAL HOSPITAL - EMERGENCY DEPARTMENT DISCHARGE SUMMARY
Patient Name: David Chen | DOB: 11/03/1984 | MRN: #671902
Discharge Date: July 22, 2026
Attending Physician: Dr. Elena Rostova, MD

PRIMARY DIAGNOSIS:
Acute Viral Bronchitis with Reactive Airway Disease / Mild Asthma Exacerbation.

DISCHARGE MEDICATIONS:
1. Prednisone 40 mg PO ONCE DAILY in the morning with food for 5 days. Take with food to avoid stomach irritation.
2. Albuterol HFA 90 mcg Inhaler: 2 puffs EVERY 4 TO 6 HOURS AS NEEDED for wheezing or shortness of breath.
3. Fluticasone Propionate (Flovent) 110 mcg Inhaler: 2 puffs TWICE DAILY. Rinse mouth with water and spit after use to prevent oral thrush.
4. Benzonatate (Tessalon Perles) 100 mg PO THREE TIMES DAILY AS NEEDED for persistent dry cough. Swallow capsules whole; do not chew.

HOME RECOVERY INSTRUCTIONS:
- Increase fluid intake to at least 8-10 glasses of water daily to help thin bronchial secretions.
- Use a cool-mist humidifier in bedroom at night.
- Avoid exposure to secondhand smoke, aerosol sprays, or extreme cold air.

FOLLOW-UP APPOINTMENTS:
1. Primary Care Doctor (Dr. James Wilson): July 27, 2026 at 3:15 PM for lung re-evaluation. Phone: (555) 432-1100.

WARNING SIGNS (RETURN TO EMERGENCY ROOM / CALL 911):
- Inability to speak in full sentences due to severe breathlessness.
- Bluish color around lips, gums, or fingernails (Cyanosis).
- High fever above 102°F or coughing up thick rust-colored or bloody sputum.
- Albuterol rescue inhaler provides no relief after 2 treatments.
`
  }
];

export const INITIAL_DISCHARGE_PLAN: DischargePlan = {
  id: 'plan-knee-replacement-default',
  reportId: 'report-knee-replacement',
  createdAt: '2026-07-20T14:30:00Z',
  patientName: 'Robert Vance',
  hospitalName: 'St. Jude Medical Center',
  dischargeDate: '2026-07-20',
  attendingPhysician: 'Dr. Sarah Lin, MD (Orthopedics)',
  primaryDiagnosis: 'Osteoarthritis of Right Knee (Post Right Total Knee Arthroplasty)',
  secondaryDiagnoses: ['Mild Essential Hypertension'],
  proceduresPerformed: ['Right Total Knee Replacement (Surgery on July 18, 2026)'],
  plainLanguageSummary: 'You had a successful right knee replacement surgery. Your main goals over the next two weeks are preventing blood clots with Eliquis, managing pain, keeping your surgical incision clean and dry, and working with physical therapy to rebuild leg strength.',
  keyRecoveryMilestones: [
    'Days 1-5: Strict dry bandage care, ankle pumps, and walker exercises.',
    'Day 5+: Waterproof cover allowed for light showers.',
    'Day 14: Follow-up clinic appointment for staple removal and X-rays.'
  ],
  medicalTermsGlossary: [
    { term: 'Arthroplasty', explanation: 'Surgical procedure to replace or restore a damaged joint with artificial parts.' },
    { term: 'Prophylaxis', explanation: 'Preventative treatment given to stop a medical condition (like blood clots) before it happens.' },
    { term: 'DVT (Deep Vein Thrombosis)', explanation: 'A dangerous blood clot that forms in a deep vein, most commonly in the legs.' },
    { term: 'Weight Bearing as Tolerated', explanation: 'Putting as much weight on your operated leg as you comfortably can using crutches or a walker.' }
  ],
  medications: [
    {
      id: 'med-1',
      name: 'Apixaban',
      genericName: 'Eliquis',
      dosage: '2.5 mg',
      route: 'Oral',
      frequency: 'Twice daily with food',
      scheduleTime: 'morning',
      timeLabel: '8:00 AM & 8:00 PM',
      duration: '14 days',
      purpose: 'Blood clot prevention (DVT prophylaxis)',
      specialInstructions: 'Take with breakfast and dinner. Do not skip doses to avoid dangerous leg blood clots.',
      sourceQuote: 'Apixaban (Eliquis) 2.5 mg PO TWICE DAILY with food for 14 days. Purpose: Deep vein thrombosis (DVT) prophylaxis.',
      confidence: 99,
      takenToday: false,
      remainingQuantity: 4,
      totalQuantity: 28,
      rxNumber: 'RX-884201',
      pharmacyEmail: 'refills@stjudecare.org',
      pharmacyPhone: '(555) 234-8999',
      refillThreshold: 5,
      refillRequested: false
    },
    {
      id: 'med-2',
      name: 'Oxycodone',
      genericName: 'Roxicodone',
      dosage: '5 mg',
      route: 'Oral',
      frequency: 'Every 6 hours as needed',
      scheduleTime: 'as_needed',
      timeLabel: 'As needed (Max 4/day)',
      duration: '5-7 days',
      purpose: 'Severe surgical pain management (Pain level 7-10)',
      specialInstructions: 'Take only for severe pain. Do not drive or operate machinery. May cause drowsiness and constipation.',
      sourceQuote: 'Oxycodone 5 mg PO EVERY 6 HOURS AS NEEDED for severe postoperative pain (Scale 7-10). Do not drive or operate heavy machinery.',
      confidence: 98,
      takenToday: false,
      remainingQuantity: 12,
      totalQuantity: 20,
      rxNumber: 'RX-904112',
      pharmacyEmail: 'refills@stjudecare.org',
      pharmacyPhone: '(555) 234-8999',
      refillThreshold: 5,
      refillRequested: false
    },
    {
      id: 'med-3',
      name: 'Acetaminophen',
      genericName: 'Tylenol',
      dosage: '650 mg',
      route: 'Oral',
      frequency: 'Every 8 hours scheduled',
      scheduleTime: 'morning',
      timeLabel: '8:00 AM, 4:00 PM, 12:00 AM',
      duration: '14 days',
      purpose: 'Mild to moderate base pain relief',
      specialInstructions: 'Do not exceed 3,000 mg in 24 hours. Check other medicines for hidden acetaminophen.',
      sourceQuote: 'Acetaminophen (Tylenol) 650 mg PO EVERY 8 HOURS scheduled for mild to moderate pain (Max 3000mg/day).',
      confidence: 97,
      takenToday: true,
      remainingQuantity: 3,
      totalQuantity: 30,
      rxNumber: 'RX-102938',
      pharmacyEmail: 'refills@stjudecare.org',
      pharmacyPhone: '(555) 234-8999',
      refillThreshold: 5,
      refillRequested: false
    },
    {
      id: 'med-4',
      name: 'Docusate Sodium',
      genericName: 'Colace',
      dosage: '100 mg',
      route: 'Oral',
      frequency: 'Twice daily',
      scheduleTime: 'evening',
      timeLabel: '8:00 AM & 8:00 PM',
      duration: 'While taking opioids',
      purpose: 'Stool softener to prevent opioid constipation',
      specialInstructions: 'Take with a full glass of water. Stop when no longer taking Oxycodone.',
      sourceQuote: 'Docusate Sodium (Colace) 100 mg PO TWICE DAILY for constipation while taking opioids.',
      confidence: 96,
      takenToday: false,
      remainingQuantity: 18,
      totalQuantity: 30,
      rxNumber: 'RX-772109',
      pharmacyEmail: 'refills@stjudecare.org',
      pharmacyPhone: '(555) 234-8999',
      refillThreshold: 5,
      refillRequested: false
    }
  ],
  followUps: [
    {
      id: 'fup-1',
      providerName: 'Dr. Sarah Lin, MD',
      specialty: 'Orthopedic Surgery',
      location: 'St. Jude Orthopedic Clinic, Suite 400',
      address: '1200 Medical Center Parkway, Cityville',
      phone: '(555) 234-8900',
      date: '2026-08-03',
      time: '10:30 AM',
      instructions: '14-day post-op staple removal, wound evaluation, and knee X-rays. Bring your walker.',
      sourceQuote: 'Dr. Sarah Lin (Orthopedics): 14 days post-op (August 3, 2026 at 10:30 AM) at St. Jude Orthopedic Clinic, Suite 400.',
      reminderSet: true
    },
    {
      id: 'fup-2',
      providerName: 'Home Physical Therapy',
      specialty: 'Rehabilitation',
      location: 'Patient Home Visit',
      address: 'Home Visit',
      phone: '(555) 981-4422',
      date: '2026-07-22',
      time: '1:00 PM',
      instructions: 'First home physical therapy evaluation session. Ensure ice packs and clear walkway ready.',
      sourceQuote: 'Home Physical Therapy starting July 22, 2026 (3x weekly).',
      reminderSet: true
    }
  ],
  dailyTasks: [
    {
      id: 'task-1',
      category: 'wound_care',
      categoryLabel: 'Wound Care',
      title: 'Inspect Surgical Dressing & Keep Dry',
      description: 'Check knee bandage for drainage or spreading redness. Keep 100% dry until Day 5.',
      dayOffset: 'Days 1-5',
      completed: true,
      sourceQuote: 'Keep surgical dressing dry and intact. Check incision daily for signs of infection.'
    },
    {
      id: 'task-2',
      category: 'activity',
      categoryLabel: 'Circulation Exercises',
      title: 'Ankle Pump Exercises (20x per hour)',
      description: 'Flex feet up and down 20 times every hour while awake to promote leg vein circulation.',
      dayOffset: 'Daily (Every hour)',
      completed: false,
      sourceQuote: 'Perform ankle pumps 20 times every hour while awake to prevent blood clots.'
    },
    {
      id: 'task-3',
      category: 'wound_care',
      categoryLabel: 'Swelling Control',
      title: 'Ice Knee & Elevate Ankle (20 mins)',
      description: 'Apply ice pack wrapped in towel for 20 mins. Elevate foot with pillow under ankle (NEVER under knee).',
      dayOffset: 'Every 2 hours',
      completed: false,
      sourceQuote: 'Apply ice pack to knee for 20 minutes every 2 hours... Elevate calf with pillow under ankle.'
    },
    {
      id: 'task-4',
      category: 'activity',
      categoryLabel: 'Mobility & Safety',
      title: 'Walk with Walker / Crutches',
      description: 'Practice short walking sessions around house with walker. Weight bearing as tolerated.',
      dayOffset: 'Daily',
      completed: false,
      sourceQuote: 'Weight bearing as tolerated on right leg with walker or crutches.'
    }
  ],
  warningSigns: [
    {
      id: 'warn-1',
      level: 'emergency',
      symptom: 'Sudden Shortness of Breath or Chest Pain',
      actionRequired: 'CALL 911 IMMEDIATELY. Possible Pulmonary Embolism (blood clot in lung). Do not attempt to drive yourself.',
      sourceQuote: 'Sudden shortness of breath, chest pain, or coughing up blood (Possible Pulmonary Embolism).',
      contactNumber: '911'
    },
    {
      id: 'warn-2',
      level: 'emergency',
      symptom: 'Severe Lower Leg / Calf Swelling or Sudden Tightness',
      actionRequired: 'Seek urgent emergency medical care or call 911. Possible Deep Vein Thrombosis (DVT).',
      sourceQuote: 'Severe swelling, calf tightness, or sudden pain in either lower leg/calf.',
      contactNumber: '911'
    },
    {
      id: 'warn-3',
      level: 'urgent_call',
      symptom: 'High Fever (>101.5°F) or Chills',
      actionRequired: 'Contact Surgeon Dr. Sarah Lin immediately at (555) 234-8900. Do not wait for next morning.',
      sourceQuote: 'High fever exceeding 101.5°F (38.6°C) or severe shaking chills.',
      contactNumber: '(555) 234-8900'
    },
    {
      id: 'warn-4',
      level: 'urgent_call',
      symptom: 'Incision Infection Signs (Redness, Pus, Foul Odor)',
      actionRequired: 'Call orthopedic nurse line at (555) 234-8900. Photo of wound may be requested.',
      sourceQuote: 'Foul-smelling drainage, opening of incision edges, or spreading red streaks.',
      contactNumber: '(555) 234-8900'
    }
  ],
  confidence: {
    overallScore: 98,
    medications: 99,
    followUps: 97,
    checklist: 96,
    warningSigns: 100,
    hasLowConfidenceFlag: false
  },
  sourceDocumentText: SAMPLE_REPORTS[0].rawText,
  medicalDisclaimerAcknowledged: true,
  caregiverShareCode: 'CARE-8921-RV'
};
