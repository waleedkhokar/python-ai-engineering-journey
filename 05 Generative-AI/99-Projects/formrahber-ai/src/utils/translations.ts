import { AppLanguage } from '../types';

export interface UITranslation {
  appName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  uploadButton: string;
  trySampleButton: string;
  howItWorksTitle: string;
  howItWorksSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  step5Title: string;
  step5Desc: string;
  featuresTitle: string;
  faqTitle: string;
  uploadHeader: string;
  dragDropText: string;
  orClickToBrowse: string;
  cameraCapture: string;
  closeCamera: string;
  takePhoto: string;
  uploadTipsHeader: string;
  tip1: string;
  tip2: string;
  tip3: string;
  tip4: string;
  samplesHeader: string;
  analyzingTitle: string;
  analyzingSubtitle: string;
  stepReading: string;
  stepDetecting: string;
  stepExplanations: string;
  stepDocuments: string;
  unsupportedTitle: string;
  unsupportedDesc1: string;
  unsupportedDesc2: string;
  overviewTitle: string;
  detectedFields: string;
  documentChecklist: string;
  requiredBadge: string;
  optionalBadge: string;
  confusingBadge: string;
  exampleLabel: string;
  commonMistakesLabel: string;
  filterAll: string;
  filterConfusing: string;
  filterRequired: string;
  startFillingButton: string;
  questionProgress: string;
  askGemini: string;
  previousQuestion: string;
  nextQuestion: string;
  skipQuestion: string;
  confirmAnswer: string;
  summaryTitle: string;
  summarySubtitle: string;
  completionScore: string;
  readyToCopy: string;
  copyAllText: string;
  copiedSuccess: string;
  editAnswer: string;
  saveEdit: string;
  startNewForm: string;
  documentsReadyCount: string;
  languageName: string;
  switchLanguage: string;
}

export const TRANSLATIONS: Record<AppLanguage, UITranslation> = {
  en: {
    appName: 'FormRahber',
    tagline: 'Your AI Guide for Confusing Official Forms',
    heroTitle: 'Understand Every Official Form with AI',
    heroSubtitle: 'FormRahber helps you understand and complete university, scholarship, bank, job, and government forms with step-by-step AI guidance. Upload a form, get simple explanations, receive document suggestions, and confidently review your answers—all in one place.',
    uploadButton: 'Upload Your Form',
    trySampleButton: 'See Demo',
    howItWorksTitle: 'How FormRahber Works',
    howItWorksSubtitle: 'Five simple steps to complete, review, and download any confusing official form with complete confidence.',
    step1Title: '1. Snap or Upload Photo',
    step1Desc: 'Upload a photo or capture a document using your phone camera in good lighting.',
    step2Title: '2. AI Field Analysis',
    step2Desc: 'Gemini AI extracts every field, explains difficult legal jargon, and identifies required documents.',
    step3Title: '3. Guided Step-by-Step',
    step3Desc: 'Answer one easy question at a time in English, Urdu, or Roman Urdu with automatic formatting.',
    step4Title: '4. Review & Copy',
    step4Desc: 'Review your complete summary, verify document checklist, and edit any answers.',
    step5Title: '5. Download & Print Form',
    step5Desc: 'Edit field responses, preview overlays, and download as PNG image, PDF document, or print directly.',
    featuresTitle: 'Why Choose FormRahber?',
    faqTitle: 'Frequently Asked Questions',
    uploadHeader: 'Upload or Capture Your Form',
    dragDropText: 'Drag & drop your form image here',
    orClickToBrowse: 'or click to browse files (JPG, PNG)',
    cameraCapture: 'Capture with Camera',
    closeCamera: 'Close Camera',
    takePhoto: 'Take Snapshot',
    uploadTipsHeader: 'Tips for Best AI Recognition',
    tip1: 'Ensure bright lighting and flat background surface',
    tip2: 'Keep the entire form single-page visible inside frame',
    tip3: 'Avoid blurry shots or heavy shadows across text',
    tip4: 'Hold camera steady directly above the document',
    samplesHeader: 'Or Test Instantly with Demo Forms',
    analyzingTitle: 'Analyzing Your Form with Gemini AI...',
    analyzingSubtitle: 'Please wait while our vision AI reads fields and prepares explanations.',
    stepReading: 'Reading form layout & printed text...',
    stepDetecting: 'Identifying input fields & category structure...',
    stepExplanations: 'Generating plain-language explanations in English & Urdu...',
    stepDocuments: 'Detecting required supporting documents & certificates...',
    unsupportedTitle: 'Unsupported Image Detected',
    unsupportedDesc1: "This image doesn't appear to be an official form.",
    unsupportedDesc2: 'Please upload a clear photo of a supported form (University, Bank, CNIC, Passport, Job, or Scholarship form).',
    overviewTitle: 'Form Analysis Overview',
    detectedFields: 'Fields Detected',
    documentChecklist: 'Required Documents Checklist',
    requiredBadge: 'Required',
    optionalBadge: 'Optional',
    confusingBadge: 'Confusing Term',
    exampleLabel: 'Example:',
    commonMistakesLabel: 'Common Mistake:',
    filterAll: 'All Fields',
    filterConfusing: 'Confusing Fields',
    filterRequired: 'Required Only',
    startFillingButton: 'Start Guided Form Filling',
    questionProgress: 'Question {current} of {total}',
    askGemini: 'Ask Gemini for Help',
    previousQuestion: 'Previous',
    nextQuestion: 'Next Field',
    skipQuestion: 'Skip Field',
    confirmAnswer: 'Save & Continue',
    summaryTitle: 'Form Completion Summary',
    summarySubtitle: 'Your information is ready. Review and copy onto your physical official form.',
    completionScore: 'Form Completion Score',
    readyToCopy: 'Ready to Copy onto Official Form',
    copyAllText: 'Copy Form Summary',
    copiedSuccess: 'Copied to Clipboard!',
    editAnswer: 'Edit',
    saveEdit: 'Save',
    startNewForm: 'Start New Form',
    documentsReadyCount: '{ready} of {total} documents ready',
    languageName: 'English',
    switchLanguage: 'Language',
  },
  ur: {
    appName: 'فارم رہبر',
    tagline: 'مشکل سرکاری و نجی فارمز کا آسان گائیڈ',
    heroTitle: 'مشکل فارم اب آسان زبان میں سمجھیں اور بھریں',
    heroSubtitle: 'فارم رہبر آپ کو یونیورسٹی داخلہ فارم، اسکالرشپ، بینک فارم، سرکاری دستاویزات اور نوکری کی درخواستوں کو سمجھنے اور مکمل کرنے میں مدد فراہم کرتا ہے۔\n\nفارم کی تصویر اپ لوڈ کریں، سادہ وضاحتیں حاصل کریں، اور بغیر کسی الجھن کے تمام خانے پر کریں۔',
    uploadButton: 'فارم کی تصویر اپ لوڈ کریں',
    trySampleButton: 'ڈیمو دیکھیں',
    howItWorksTitle: 'فارم رہبر کیسے کام کرتا ہے؟',
    howItWorksSubtitle: 'پانچ آسان مراحل میں کسی بھی مشکل فارم کو پر کریں، ایڈٹ کریں اور پرنٹ یا ڈاؤن لوڈ کریں۔',
    step1Title: '۱۔ فارم کی تصویر لیں',
    step1Desc: 'اپنے موبائل کیمرے یا فائل سے صاف فارم کی تصویر اپ لوڈ کریں۔',
    step2Title: '۲۔ اے آئی کا جائزہ',
    step2Desc: 'جیمنائی اے آئی تمام خانوں کی نشاندہی اور مشکل اصطلاحات کو آسان اردو میں بیان کرتا ہے۔',
    step3Title: '۳۔ ایک ایک سوال کا جواب',
    step3Desc: 'ایک وقت میں ایک سادہ سوال کا جواب اردو يا انگریزی میں دیں۔',
    step4Title: '۴۔ جائزہ لیں اور کاپی کریں',
    step4Desc: 'حتمی خلاصہ دیکھیں اور ضرورت کے مطابق معلومات تبدیل کریں۔',
    step5Title: '۵۔ پر شدہ فارم ڈاؤن لوڈ کریں',
    step5Desc: 'معلومات میں ترمیم کریں، جلی تصویر یا پی ڈی ایف (PDF) ڈاؤن لوڈ کریں اور براہ راست پرنٹ کریں۔',
    featuresTitle: 'فارم رہبر کی خصوصیات',
    faqTitle: 'عام طور پر پوچھے جانے والے سوالات',
    uploadHeader: 'فارم اپ لوڈ یا کیمرے سے تصویر لیں',
    dragDropText: 'فارم کی تصویر یہاں ڈریگ اور ڈراپ کریں',
    orClickToBrowse: 'یا فائلز چننے کے لیے یہاں کلک کریں (JPG, PNG)',
    cameraCapture: 'کیمرے سے تصویر لیں',
    closeCamera: 'کیمرہ بند کریں',
    takePhoto: 'تصویر کھینچیں',
    uploadTipsHeader: 'بہترین نتیجہ حاصل کرنے کے لیے ہدایات',
    tip1: 'فارم کو اچھی روشنی اور ہموار جگہ پر رکھیں',
    tip2: 'پورا فارم ایک تصویر کے اندر واضح نظر آنا چاہیے',
    tip3: 'تصویر میں دھندلاپن یا سایہ نہیں ہونا چاہیے',
    tip4: 'موبائل کو بالکل سیدھا رکھ کر تصویر لیں',
    samplesHeader: 'یا ڈیمو فارم کے ساتھ فوری ٹیسٹ کریں',
    analyzingTitle: 'جیمنائی اے آئی فارم کا جائزہ لے رہا ہے...',
    analyzingSubtitle: 'براہِ کرم انتظار کریں، اے آئی فارم کے تمام خانوں کو سمجھ رہا ہے۔',
    stepReading: 'فارم کی تحریر اور پیٹرن پڑھا جا رہا ہے...',
    stepDetecting: 'خانوں اور زمرہ جات کی نشاندہی کی جا رہی ہے...',
    stepExplanations: 'اردو اور انگریزی میں آسان وضاحت تیار کی جا رہی ہے...',
    stepDocuments: 'ضروری دستاویزات اور اسناد کی فہرست بنائی جا رہی ہے...',
    unsupportedTitle: 'Unsupported Image Detected',
    unsupportedDesc1: "This image doesn't appear to be an official form.",
    unsupportedDesc2: 'Please upload a clear photo of a supported form (University, Bank, CNIC, Passport, Job, or Scholarship form).',
    overviewTitle: 'فارم کا تجزیاتی خلاصہ',
    detectedFields: 'شناخت شدہ خانے',
    documentChecklist: 'ضروری دستاویزات کی فہرست',
    requiredBadge: 'لازمی',
    optionalBadge: 'اختیاری',
    confusingBadge: 'مشکل اصطلاح',
    exampleLabel: 'مثال:',
    commonMistakesLabel: 'عام غلطی:',
    filterAll: 'تمام خانے',
    filterConfusing: 'مشکل خانے',
    filterRequired: 'صرف لازمی خانے',
    startFillingButton: 'فارم بھرنا شروع کریں',
    questionProgress: 'سوال {current} از {total}',
    askGemini: 'جیمنائی سے مدد لیں',
    previousQuestion: 'پچھلا سوال',
    nextQuestion: 'اگلا خانہ',
    skipQuestion: 'چھوڑ دیں',
    confirmAnswer: 'محفوظ کریں اور آگے بڑھیں',
    summaryTitle: 'فارم کی حتمی رپورٹ',
    summarySubtitle: 'آپ کی تمام معلومات تیار ہیں۔ اسے دیکھ کر اپنے اصل فارم پر لکھیں۔',
    completionScore: 'فارم کی تکمیل کی شرح',
    readyToCopy: 'اصل فارم پر منتقل کرنے کے لیے تیار',
    copyAllText: 'تمام خلاصہ کاپی کریں',
    copiedSuccess: 'کاپی ہو گیا!',
    editAnswer: 'تبدیل کریں',
    saveEdit: 'محفوظ کریں',
    startNewForm: 'نیا فارم شروع کریں',
    documentsReadyCount: '{total} میں سے {ready} دستاویزات تیار ہیں',
    languageName: 'اردو',
    switchLanguage: 'زبان',
  },
  roman_urdu: {
    appName: 'FormRahber',
    tagline: 'Mushkil Official Forms Ka Asaan Guide',
    heroTitle: 'Mushkil Form Ab Asaan Zaban Me Samjhein Aur Bharein',
    heroSubtitle: 'FormRahber aapko university, scholarship, bank, job, aur government forms ko step-by-step AI guidance ke sath samjhne aur complete karne me help karta hai. Form upload karein, asaan explanations lein, document suggestions paein, aur apne answers review karein—sab ek hi jagah.',
    uploadButton: 'Form Photo Upload Karein',
    trySampleButton: 'Demo Dekhein',
    howItWorksTitle: 'FormRahber Kaise Kaam Karta Hai?',
    howItWorksSubtitle: 'Paanch asaan steps me kisi bhi form ko edit, review, aur download karein.',
    step1Title: '1. Photo Capture ya Upload',
    step1Desc: 'Apne mobile camera ya gallery se form ki saaf photo upload karein.',
    step2Title: '2. AI Field Analysis',
    step2Desc: 'Gemini AI mushkil terms ko explain karta hai aur required documents batata hai.',
    step3Title: '3. Step-by-Step Guidance',
    step3Desc: 'Ek waqt me ek asaan sawaal ka jawab Roman Urdu ya English me dein.',
    step4Title: '4. Review & Copy',
    step4Desc: 'Final summary dekhein, documents verify karein aur answers edit karein.',
    step5Title: '5. Download & Print Form',
    step5Desc: 'Answers edit karein, PNG image ya PDF document download karein aur direct print karein.',
    featuresTitle: 'FormRahber Kyun Khas Hai?',
    faqTitle: 'Aam Sawaalat (FAQ)',
    uploadHeader: 'Form Upload Karein Ya Camera Se Photo Lein',
    dragDropText: 'Form ki image yahan drag and drop karein',
    orClickToBrowse: 'ya files choose karne ke liye click karein (JPG, PNG)',
    cameraCapture: 'Camera Se Photo Lein',
    closeCamera: 'Camera Band Karein',
    takePhoto: 'Photo Khinchein',
    uploadTipsHeader: 'Behtareen Result Ke Liye Guidance',
    tip1: 'Form ko achi roshni me aur flat jagah par rakhein',
    tip2: 'Poora form ek photo ke andar saaf nazar aana chahiye',
    tip3: 'Photo me dhundla pan ya saya nahi hona chahiye',
    tip4: 'Mobile ko seedha rakh kar snapshot lein',
    samplesHeader: 'Ya Demo Forms Ke Sath Test Karein',
    analyzingTitle: 'Gemini AI Form Analyze Kar Raha Hai...',
    analyzingSubtitle: 'Barah-e-karam wahi karein, AI saare fields ko parh raha hai.',
    stepReading: 'Form text aur layout parha ja raha hai...',
    stepDetecting: 'Input fields aur sections detect ho rahe hain...',
    stepExplanations: 'Asaan Roman Urdu aur English me explanations ban rahi hain...',
    stepDocuments: 'Required documents checklist taiyar ho rahi hai...',
    unsupportedTitle: 'Unsupported Image Detected',
    unsupportedDesc1: "This image doesn't appear to be an official form.",
    unsupportedDesc2: 'Please upload a clear photo of a supported form (University, Bank, CNIC, Passport, Job, or Scholarship form).',
    overviewTitle: 'Form Analysis Overview',
    detectedFields: 'Detected Fields',
    documentChecklist: 'Required Documents Checklist',
    requiredBadge: 'Zaroori (Required)',
    optionalBadge: 'Ikhtiyaari (Optional)',
    confusingBadge: 'Mushkil Term',
    exampleLabel: 'Example:',
    commonMistakesLabel: 'Aam Ghalti:',
    filterAll: 'Saare Fields',
    filterConfusing: 'Mushkil Fields',
    filterRequired: 'Sirf Required Fields',
    startFillingButton: 'Guided Form Filling Shuru Karein',
    questionProgress: 'Sawaal {current} of {total}',
    askGemini: 'Gemini Se Help Lein',
    previousQuestion: 'Peeche',
    nextQuestion: 'Agla Field',
    skipQuestion: 'Skip Karein',
    confirmAnswer: 'Save Aur Aage Barein',
    summaryTitle: 'Form Completion Summary',
    summarySubtitle: 'Aap ki saari details ready hain. Inhein dekh kar apne real form par likhein.',
    completionScore: 'Form Completion Score',
    readyToCopy: 'Official Form Par Copy Karne Ke Liye Ready',
    copyAllText: 'Poori Summary Copy Karein',
    copiedSuccess: 'Copied to Clipboard!',
    editAnswer: 'Edit',
    saveEdit: 'Save',
    startNewForm: 'Naya Form Shuru Karein',
    documentsReadyCount: '{total} me se {ready} documents ready hain',
    languageName: 'Roman Urdu',
    switchLanguage: 'Language',
  }
};
