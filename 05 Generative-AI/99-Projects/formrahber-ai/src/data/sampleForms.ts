import { SampleFormTemplate } from '../types';
import { OFFICIAL_FORM_SVG_DATA_URI, BANK_FORM_SVG_DATA_URI, GOVT_FORM_SVG_DATA_URI, BANK_ILLUSTRATION_SVG_DATA_URI } from '../utils/officialFormTemplate';

export const SAMPLE_FORMS: SampleFormTemplate[] = [
  {
    id: 'sample-uni-admission',
    title: 'University Undergraduate Admission Form',
    category: 'Education & Admissions',
    description: {
      en: 'Standard Pakistan/South Asian university undergraduate application covering personal details, matric/inter marks, guardian info, and required certificates.',
      ur: 'یونیورسٹی میں انڈرگریجویٹ داخلہ فارم جس میں ذاتی معلومات، میٹرک و انٹر نمبرز اور ضروری دستاویزات شامل ہیں۔',
      roman_urdu: 'University undergraduate admission form jis me zaati maaloomat, Matric/Inter marks aur documents shamil hain.'
    },
    badge: 'Popular',
    imageUrl: OFFICIAL_FORM_SVG_DATA_URI,
    data: {
      formTitle: 'University Admission Application Form (2026)',
      category: 'Education / University',
      imagePreviewUrl: OFFICIAL_FORM_SVG_DATA_URI,
      formDescription: {
        en: 'Official admission application form for undergraduate programs. Requires academic history and CNIC/B-Form verification.',
        ur: 'انڈرگریجویٹ پروگرامز کے لیے سرکاری داخلہ فارم۔ تعلیمی ریکارڈر اور شناختی کارڈ کی تصدیق درکار ہے۔',
        roman_urdu: 'Undergraduate programs ke liye official admission form. Academic records aur CNIC verification zaroori hai.'
      },
      overallTips: {
        en: 'Make sure your name spelling matches your Matriculation certificate exactly. Attach attested copies of transcripts.',
        ur: 'یہ بات یقینی بنائیں کہ نام کے ہجے میٹرک کی سند کے بالکل مطابق ہوں۔ تمام اسناد کی تصدیق شدہ کاپیاں لف کریں۔',
        roman_urdu: 'Ensure karein ke naam ki spelling Matric certificate se bilkul match kare. Copies attested honi chahiyen.'
      },
      documents: [
        {
          id: 'doc-1',
          documentName: 'CNIC / Form-B Copy',
          isExplicitlyRequired: true,
          reason: {
            en: 'Required for identity verification of the applicant.',
            ur: 'امیدوار کی قومی شناختی تصدیق کے لیے لازمی ہے۔',
            roman_urdu: 'Applicant ki identity verify karne ke liye zaroori hai.'
          },
          tip: {
            en: 'Attested copy of front and back side.',
            ur: 'فرنٹ اور بیک سائیڈ کی تصدیق شدہ کاپی۔',
            roman_urdu: 'Front aur back ki attested copy.'
          },
          isReady: false
        },
        {
          id: 'doc-2',
          documentName: 'Matriculation (10th) Result Card',
          isExplicitlyRequired: true,
          reason: {
            en: 'Proof of secondary education completion and date of birth.',
            ur: 'میٹرک کی تعلیم مکمل کرنے اور تاریخ پیدائش کا ثبوت۔',
            roman_urdu: 'Secondary education complete karne aur date of birth ka proof.'
          },
          tip: {
            en: 'Original or attested copy issued by Board (BISE).',
            ur: 'بورڈ کا جاری کردہ اصل یا تصدیق شدہ رزلٹ کارڈ۔',
            roman_urdu: 'BISE Board ka issued result card.'
          },
          isReady: false
        },
        {
          id: 'doc-3',
          documentName: 'Intermediate (12th) / FSC Marksheet',
          isExplicitlyRequired: true,
          reason: {
            en: 'Required to evaluate eligibility criteria for program choice.',
            ur: 'منتخب کردہ شعبے کے لیے اہلیت چیک کرنے کے لیے ضروری ہے۔',
            roman_urdu: 'Program eligibility check karne ke liye zaroori hai.'
          },
          tip: {
            en: 'Hope certificate accepted if 2nd year results are awaited.',
            ur: 'اگر دوسرے سال کا رزلٹ نہیں آیا تو ہوپ سرٹیفکیٹ استعمال کیا جا سکتا ہے۔',
            roman_urdu: 'Agar 2nd year result pending hai toh Hope Certificate chale ga.'
          },
          isReady: false
        },
        {
          id: 'doc-4',
          documentName: 'Father / Guardian CNIC Copy',
          isExplicitlyRequired: true,
          reason: {
            en: 'Needed for fee responsibility and emergency contact.',
            ur: 'فیس اور ایمرجنسی رابطے کے لیے سرپرست کا شناختی کارڈ۔',
            roman_urdu: 'Emergency contact aur fee records ke liye Guardian ka CNIC.'
          },
          tip: {
            en: 'Valid non-expired CNIC copy.',
            ur: 'غیر میعاد ختم شد ہ (Valid) شناختی کارڈ کاپی۔',
            roman_urdu: 'Valid active CNIC copy.'
          },
          isReady: false
        },
        {
          id: 'doc-5',
          documentName: 'Passport Size Photographs (4 Copies)',
          isExplicitlyRequired: true,
          reason: {
            en: 'Required for university ID card and official file.',
            ur: 'یونیورسٹی کے شناختی کارڈ اور فائل ورک کے لیے ضروری ہے۔',
            roman_urdu: 'University ID card aur file ke liye photographs.'
          },
          tip: {
            en: 'Blue background, recent photo taken within 3 months.',
            ur: 'نیلے بیک گراؤنڈ والی حالیہ تصاویر۔',
            roman_urdu: 'Blue background wali recent photo.'
          },
          isReady: false
        },
        {
          id: 'doc-6',
          documentName: 'Domicile Certificate (Likely Required)',
          isExplicitlyRequired: false,
          reason: {
            en: 'Needed for provincial quota seats or government university reservations.',
            ur: 'صوبائی کوٹہ یا سرکاری یونیورسٹی سیٹوں کے لیے ممکنہ طور پر درکار ہے۔',
            roman_urdu: 'Provincial quota seats ke liye likely required hai.'
          },
          tip: {
            en: 'Keep district domicile ready in case requested during interview.',
            ur: 'انٹرویو کے دوران ضرورت پڑنے کے لیے ڈومیسائل پاس رکھیں۔',
            roman_urdu: 'District domicile ready rakhein.'
          },
          isReady: false
        }
      ],
      fields: [
        {
          id: 'f-1',
          fieldName: 'Applicant Full Name',
          originalText: '1. Full Name (IN BLOCK LETTERS AS PER MATRIC CERTIFICATE)',
          explanation: {
            en: 'Write your full legal name using ALL CAPITAL letters (e.g. ALI AHMED). It must match your Matriculation certificate word for word.',
            ur: 'اپنا پورا نام تمام بڑے حروف (CAPITAL LETTERS) میں لکھیں۔ یہ نام آپ کی میٹرک کی سند سے بالکل ملتا جلتا ہونا چاہیے۔',
            roman_urdu: 'Apna poora naam saaray BARE HURUFO (Capital letters) me likhein. Matric ki certificate se exact match hona chahiye.'
          },
          fieldType: 'text',
          isRequired: true,
          isConfusing: true,
          exampleValue: 'MUHAMMAD ZESHAN ALI',
          commonMistakes: {
            en: 'Using lowercase letters, writing nicknames, or spelling differently than SSC certificate.',
            ur: 'چھوٹے حروف استعمال کرنا، عرفی نام لکھنا، یا میٹرک سند سے مختلف سپیلنگ لکھنا۔',
            roman_urdu: 'Chote letters (lowercase) use karna, nicknames likhna, ya certificate se mukhtalif spelling.'
          },
          categoryGroup: 'personal'
        },
        {
          id: 'f-2',
          fieldName: 'Father / Guardian Name',
          originalText: '2. Father / Guardian Full Name & Occupation',
          explanation: {
            en: 'Write your father’s full legal name as per his CNIC card, and his current job or business.',
            ur: 'اپنے والد کا مکمل نام ان کے شناختی کارڈ کے مطابق اور ان کا موجودہ پیشہ لکھیں۔',
            roman_urdu: 'Apne walid ka poora naam unke CNIC ke mutabiq aur unka profession likhein.'
          },
          fieldType: 'text',
          isRequired: true,
          isConfusing: false,
          exampleValue: 'TARIQ MEHMOOD (Government Employee)',
          commonMistakes: {
            en: 'Omitting the occupation or writing an incomplete name without surname.',
            ur: 'پیشہ چھوڑ دینا یا خاندانی نام کے بغیر ادھورا نام لکھنا۔',
            roman_urdu: 'Profession na likhna ya adhoora naam likhna.'
          },
          categoryGroup: 'personal'
        },
        {
          id: 'f-3',
          fieldName: 'National Identity Number (CNIC / B-Form)',
          originalText: '3. Candidate CNIC No. / Form-B No.',
          explanation: {
            en: 'Your 13-digit Computerized National Identity Card or Form-B registration number issued by NADRA.',
            ur: 'نادرا سے جاری کردہ آپ کا 13 ہندسوں پر مشتمل قومی شناختی کارڈ یا فارم - بی نمبر۔',
            roman_urdu: 'NADRA ka issued 13-digit CNIC ya Form-B number.'
          },
          fieldType: 'text',
          isRequired: true,
          isConfusing: true,
          exampleValue: '35202-1234567-1',
          commonMistakes: {
            en: 'Entering wrong number of digits, forgetting dashes, or entering father CNIC instead of candidate CNIC.',
            ur: 'غلط ہندسے درج کرنا، ڈیش (-) بھول جانا، یا اپنے بجائے والد کا شناختی کارڈ لکھنا۔',
            roman_urdu: 'Dashes bhool jana ya apne bajaye father ka CNIC likh dena.'
          },
          categoryGroup: 'personal'
        },
        {
          id: 'f-4',
          fieldName: 'Date of Birth (DD-MM-YYYY)',
          originalText: '4. Date of Birth (As Recorded in SSC Certificate)',
          explanation: {
            en: 'Your exact date of birth in Day-Month-Year format matching your 10th class result sheet.',
            ur: 'آپ کی تاریخ پیدائش (دن-مہینہ-سال) جو آپ کے میٹرک کے رزلٹ میں درج ہے۔',
            roman_urdu: 'Aap ki exact date of birth (Date-Month-Year) jo Matric result sheet par hai.'
          },
          fieldType: 'date',
          isRequired: true,
          isConfusing: false,
          exampleValue: '2005-08-14',
          commonMistakes: {
            en: 'Swapping Month and Day format (e.g., writing MM-DD-YYYY instead of DD-MM-YYYY).',
            ur: 'مہینے اور دن کی ترتیب الٹ دینا (مثلاً DD-MM کی جگہ MM-DD لکھنا)۔',
            roman_urdu: 'Month aur Day ki tarteeb ulti kar dena.'
          },
          categoryGroup: 'personal'
        },
        {
          id: 'f-5',
          fieldName: 'Permanent Address',
          originalText: '5. Permanent Home Address (As per Domicile/CNIC)',
          explanation: {
            en: 'The fixed hometown address written on your CNIC or Domicile certificate where official mail can always reach your family.',
            ur: 'آپ کا مستقل گھر کا پتہ جو آپ کے شناختی کارڈ یا ڈومیسائل پر لکھا ہے۔',
            roman_urdu: 'Aapka permanent ghar ka pata jo CNIC ya Domicile par darj hai.'
          },
          fieldType: 'textarea',
          isRequired: true,
          isConfusing: true,
          exampleValue: 'House No. 42, St # 5, Model Town, Lahore',
          commonMistakes: {
            en: 'Confusing current rental hostel/temporary residence with permanent native address.',
            ur: 'عارضی ہاسٹل کے پتے کو مستقل پتے کے ساتھ ملا دینا۔',
            roman_urdu: 'Temporary hostel/rental address ko permanent address me likhna.'
          },
          categoryGroup: 'contact'
        },
        {
          id: 'f-6',
          fieldName: 'Mobile Contact Number',
          originalText: '6. Active Applicant Mobile No. (WhatsApp Enabled)',
          explanation: {
            en: 'Provide an active 11-digit mobile phone number that is converted or registered in your name to receive SMS alerts.',
            ur: 'ایسا 11 ہندسوں کا موبائل نمبر جو ہر وقت فعال ہو اور جس پر ایس ایم ایس یا واٹس ایپ مل سکے۔',
            roman_urdu: 'Active 11-digit mobile number jo aapke paas rehta ho SMS alerts ke liye.'
          },
          fieldType: 'text',
          isRequired: true,
          isConfusing: false,
          exampleValue: '0300-1234567',
          commonMistakes: {
            en: 'Giving a number that belongs to a friend or a ported number that blocks automated university SMS.',
            ur: 'کسی دوست کا نمبر دینا یا بند رہنے والا نمبر لکھنا۔',
            roman_urdu: 'Band rehne wala ya doosray dost ka number Dena.'
          },
          categoryGroup: 'contact'
        },
        {
          id: 'f-7',
          fieldName: 'Matriculation (SSC) Total Obtained Marks',
          originalText: '7. SSC / 10th Grade Marks Obtained / Total Marks',
          explanation: {
            en: 'The actual score you earned in 10th grade examination out of total marks (e.g. 980 / 1100).',
            ur: 'میٹرک امتحانات میں حاصل کردہ کل نمبر (مثال: 1100 میں سے 980)۔',
            roman_urdu: 'Matric exam me haasil kardah total marks out of maximum marks.'
          },
          fieldType: 'text',
          isRequired: true,
          isConfusing: false,
          exampleValue: '985 / 1100',
          commonMistakes: {
            en: 'Writing grade instead of numerical total marks, or forgetting total scale.',
            ur: 'نمبروں کی جگہ صر ف گریڈ لکھ دینا يا ٹوٹل نمبر بھول جانا۔',
            roman_urdu: 'Numbers ke bajaye sirf Grade likh dena.'
          },
          categoryGroup: 'education'
        },
        {
          id: 'f-8',
          fieldName: 'Intermediate Discipline / Major Track',
          originalText: '8. Intermediate / FSC Group (Pre-Medical, Pre-Engineering, ICS, Humanities)',
          explanation: {
            en: 'Select the subject combination you studied in 11th and 12th grade.',
            ur: 'انٹرمیڈیٹ (11ویں/12ویں) میں پڑھا گیا گروپ منتخب کریں۔',
            roman_urdu: 'Inter (11th/12th) me parha gaya subject group select karein.'
          },
          fieldType: 'select',
          options: ['FSc Pre-Engineering', 'FSc Pre-Medical', 'ICS (Computer Science)', 'I.Com / Commerce', 'FA / Humanities / Arts'],
          isRequired: true,
          isConfusing: false,
          exampleValue: 'ICS (Computer Science)',
          commonMistakes: {
            en: 'Selecting Pre-Engineering when your subjects did not include Chemistry.',
            ur: 'مضمون کی غلط کیٹیگری منتخب کرنا۔',
            roman_urdu: 'Wrong group select karna.'
          },
          categoryGroup: 'education'
        }
      ]
    }
  },
  {
    id: 'sample-bank-account',
    title: 'Bank Account Opening & KYC Form',
    category: 'Banking & Finance',
    description: {
      en: 'Standard commercial bank account opening form for salary, savings, or digital account with Know Your Customer (KYC) requirements.',
      ur: 'بینک اکاؤنٹ کھولنے کا فارم جس میں کاروباری/ذاتی معلومات، آمدن کے ذرائع اور بائیو میٹرک تصدیق شامل ہے۔',
      roman_urdu: 'Bank account kholne ka form jis me personal details, income source aur KYC required hota hai.'
    },
    badge: 'Official',
    imageUrl: BANK_ILLUSTRATION_SVG_DATA_URI,
    data: {
      formTitle: 'Bank Account Opening & Customer Profile (KYC)',
      category: 'Banking / Finance',
      imagePreviewUrl: BANK_FORM_SVG_DATA_URI,
      formDescription: {
        en: 'Regulatory bank form for opening Current/Savings account. Strictly requires source of income and tax compliance details.',
        ur: 'کرنٹ یا سیونگز اکاؤنٹ کھولنے کے لیے اسٹیٹ بینک آف پاکستان کے قواعد و ضوابط کا فارم۔',
        roman_urdu: 'Current/Savings account kholne ke liye bank ka official KYC form.'
      },
      overallTips: {
        en: 'Signatures must match your CNIC signature exactly. Attach proof of income (Salary slip or business letterhead).',
        ur: 'دستخط کا شناختی کارڈ کے دستخط سے میچ ہونا لازمی ہے۔ آمدن کا ثبوت (سیلری سلپ يا لیٹر) ساتھ لگائیں۔',
        roman_urdu: 'Signatures CNIC se exact match karne chahiyen. Income proof saath zaroor attach karein.'
      },
      documents: [
        {
          id: 'bdoc-1',
          documentName: 'Original CNIC / SNIC',
          isExplicitlyRequired: true,
          reason: {
            en: 'Mandatory for NADRA Verisys biometric verification.',
            ur: 'نادرا بائیو میٹرک تصدیق کے لیے اصل شناختی کارڈ۔',
            roman_urdu: 'NADRA biometric verification ke liye original CNIC.'
          },
          tip: {
            en: 'Physical card must be presented at the time of account activation.',
            ur: 'اکاؤنٹ کھولتے وقت اصل کارڈ ساتھ لائیں۔',
            roman_urdu: 'Physical original card saath le kar jayein.'
          },
          isReady: false
        },
        {
          id: 'bdoc-2',
          documentName: 'Proof of Income / Profession',
          isExplicitlyRequired: true,
          reason: {
            en: 'State Bank anti-money laundering compliance rule.',
            ur: 'اسٹیٹ بینک کے قواعد کے تحت آمدن کے ذریعہ کا ثبوت۔',
            roman_urdu: 'Income source verify karne ke liye State Bank rule.'
          },
          tip: {
            en: 'Salary slip, employer letter, student card, or business declaration.',
            ur: 'سیلری سلپ، ملازمت کا خط، اسٹوڈنٹ کارڈ یا لیٹر ہیڈ۔',
            roman_urdu: 'Salary slip, employment letter, ya Student ID.'
          },
          isReady: false
        },
        {
          id: 'bdoc-3',
          documentName: 'Utility Bill (Electricity / Gas)',
          isExplicitlyRequired: true,
          reason: {
            en: 'Required for residential address verification.',
            ur: 'رہائشی پتے کی تصدیق کے لیے بجلی یا گیس کا بل۔',
            roman_urdu: 'Residential address confirmation ke liye electricity/gas bill.'
          },
          tip: {
            en: 'Bill must not be older than 3 months.',
            ur: 'بل 3 ماہ سے زیادہ پرانا نہ ہو۔',
            roman_urdu: 'Bill 3 months se zyada purana na ho.'
          },
          isReady: false
        }
      ],
      fields: [
        {
          id: 'bf-1',
          fieldName: 'Account Title / Legal Name',
          originalText: 'A. Title of Account (NAME TO APPEAR ON CHEQUE BOOK & DEBIT CARD)',
          explanation: {
            en: 'The name that will be printed on your ATM debit card and bank statements. Must be exactly as per CNIC.',
            ur: 'وہ نام جو آپ کے اے ٹی ایم کارڈ اور بینک سٹیٹمنٹ پر پرنٹ ہوگا۔ شناختی کارڈ کے عین مطابق ہونا چاہیے۔',
            roman_urdu: 'Aapke ATM card aur bank statement par printed naam. Exact CNIC ke mutabiq hona chahiye.'
          },
          fieldType: 'text',
          isRequired: true,
          isConfusing: true,
          exampleValue: 'MUHAMMAD HAMZA KHAN',
          commonMistakes: {
            en: 'Writing shortened names or adding titles like Mr. or Dr. when not on CNIC.',
            ur: 'مختصر نام لکھنا یا شناختی کارڈ پر نہ ہونے والے القابات (Mr./Dr.) لگانا۔',
            roman_urdu: 'Short name likhna ya CNIC ke bina Mr/Dr lagana.'
          },
          categoryGroup: 'personal'
        },
        {
          id: 'bf-2',
          fieldName: 'Source of Income / Funds',
          originalText: 'B. Primary Source of Income (Salary, Business, Pension, Inheritance, Student Allowance)',
          explanation: {
            en: 'Where does the money entering this account come from? Choose your main financial source.',
            ur: 'اس اکاؤنٹ میں آنے والی رقم کا بنیادی ذریعہ کیا ہے؟ اپنا اصل معاشی ذریعہ بتائیں۔',
            roman_urdu: 'Is account me aane walay paise kahan se aayein ge? Main financial source select karein.'
          },
          fieldType: 'select',
          options: ['Monthly Salary', 'Business Profit / Commercial', 'Remittance from Abroad', 'Freelance / Digital Services', 'Student Allowance / Family Support'],
          isRequired: true,
          isConfusing: true,
          exampleValue: 'Monthly Salary',
          commonMistakes: {
            en: 'Selecting "Business" if you do not have a registered business tax account (NTN).',
            ur: 'بغیر رجسٹرڈ این ٹی این کے بزنس منتخب کر لینا۔',
            roman_urdu: 'Bina tax NTN ke business select karna.'
          },
          categoryGroup: 'personal'
        },
        {
          id: 'bf-3',
          fieldName: 'Expected Monthly Turnover / Limit',
          originalText: 'C. Expected Monthly Credit Turnover Amount (PKR)',
          explanation: {
            en: 'The total approximate amount of money you expect to deposit into this account each month.',
            ur: 'ہر ماہ اس اکاؤنٹ میں کتنی کل رقم جمع ہونے کا امکان ہے؟ (روپوں میں تخمینہ)۔',
            roman_urdu: 'Har month account me approx kitne total paise jama hone ka imkaan hai.'
          },
          fieldType: 'select',
          options: ['Up to PKR 100,000 (Asaan Account)', 'PKR 100,000 to 500,000', 'PKR 500,000 to 2,000,000', 'Above PKR 2,000,000'],
          isRequired: true,
          isConfusing: true,
          exampleValue: 'Up to PKR 100,000 (Asaan Account)',
          commonMistakes: {
            en: 'Overestimating expected amount which leads to stricter tax audit questions.',
            ur: 'ضرورت سے زیادہ رقم کا تخمینہ بتانا جس سے غیر ضروری ٹیکس سوالات اٹھتے ہیں۔',
            roman_urdu: 'Bina waja bohot zyaada amount select kar lena.'
          },
          categoryGroup: 'personal'
        },
        {
          id: 'bf-4',
          fieldName: 'Tax Residency Status (Filer / Non-Filer)',
          originalText: 'D. Tax Status (Filer on FBR Active Taxpayer List / Non-Filer)',
          explanation: {
            en: 'Indicate whether you pay income tax and are listed on FBR Active Taxpayer List (ATL).',
            ur: 'بتائیں کہ کیا آپ ایف بی آر کی یکٹو ٹیکس پیئر لسٹ میں شامل ہیں یا نہیں۔',
            roman_urdu: 'Batayein ke kya aap FBR Active Taxpayer List (ATL) me Filer hain ya nahi.'
          },
          fieldType: 'select',
          options: ['Active Tax Filer', 'Non-Filer', 'Exempt / Student'],
          isRequired: true,
          isConfusing: true,
          exampleValue: 'Non-Filer',
          commonMistakes: {
            en: 'Claiming Filer status without checking if your status on FBR portal is currently Active.',
            ur: 'ایف بی آر پورٹل پر ایکٹو چیک کیے بغیر فائنلر کا دعویٰ کرنا۔',
            roman_urdu: 'FBR portal par status check kiye bina Filer chunna.'
          },
          categoryGroup: 'personal'
        }
      ]
    }
  },
  {
    id: 'sample-cnic-gov',
    title: 'Government Identity / Domicile Application',
    category: 'Government & Civil Affairs',
    description: {
      en: 'Official citizenship, domicile, or character certificate registration form requiring blood group, permanent district, and oath declaration.',
      ur: 'ڈومیسائل یا شہری رجسٹریشن فارم جس میں بلڈ گروپ، مستقل ضلع اور حلف نامہ کی تصدیق درکار ہے۔',
      roman_urdu: 'Domicile ya Government registration form jis me permanent district aur oath declaration zaroori hai.'
    },
    badge: 'Civil Service',
    imageUrl: GOVT_FORM_SVG_DATA_URI,
    data: {
      formTitle: 'Government Identity Card Application (Side A / Side B)',
      category: 'Government / Civil Affairs',
      imagePreviewUrl: GOVT_FORM_SVG_DATA_URI,
      formDescription: {
        en: 'Official district magistrate form for obtaining a permanent domicile certificate required for government jobs and quota seats.',
        ur: 'ضلعی مجسٹریٹ کا فارم برائے مستقل سکونت و ڈومیسائل سرٹیفکیٹ۔',
        roman_urdu: 'District Magistrate ka Domicile Certificate registration form.'
      },
      overallTips: {
        en: 'The applicant must reside in the specified district for at least 3 consecutive years. Must be signed in presence of Magistrate or Oath Commissioner.',
        ur: 'درخواست دہندہ کا متعلقہ ضلع میں کم از کم 3 سال رہائش ضروری ہے۔ اوتھ کمشنر کی تصدیق لازمی ہے۔',
        roman_urdu: 'Applicant ka us district me 3 saal rehna zaroori hai. Oath commissioner ki stamp lagwayein.'
      },
      documents: [
        {
          id: 'gdoc-1',
          documentName: 'CNIC or Form-B of Applicant',
          isExplicitlyRequired: true,
          reason: {
            en: 'Proof of age and identity registration in NADRA database.',
            ur: 'نادرا کے ڈیٹا بیس میں عمر اور شناخت کا ثبوت۔',
            roman_urdu: 'Identity verification ke liye CNIC/Form-B.'
          },
          tip: {
            en: 'Attested copy.',
            ur: 'تصدیق شدہ کاپی۔',
            roman_urdu: 'Attested copy.'
          },
          isReady: false
        },
        {
          id: 'gdoc-2',
          documentName: 'Father Domicile Certificate',
          isExplicitlyRequired: true,
          reason: {
            en: 'Required to establish ancestral origin in the district.',
            ur: 'ضلع میں آبائی رہائش ثابت کرنے کے لیے والد کا ڈومیسائل۔',
            roman_urdu: 'Father ka domicile district residency proof ke liye.'
          },
          tip: {
            en: 'Original Father Domicile for physical inspection.',
            ur: 'معائنے کے لیے والد کا اصل ڈومیسائل۔',
            roman_urdu: 'Original Father Domicile inspect karwayein.'
          },
          isReady: false
        },
        {
          id: 'gdoc-3',
          documentName: 'Educational Certificates (Matric/FA)',
          isExplicitlyRequired: true,
          reason: {
            en: 'Proof that schooling was completed within the district boundaries.',
            ur: 'اس بات کا ثبوت کہ تعلیم ضلع کی حدود میں مکمل کی گئی۔',
            roman_urdu: 'Proof ke schooling ushi district me hui hai.'
          },
          tip: {
            en: 'Attested copies of certificates from district BISE board.',
            ur: 'بورڈ کی تصدیق شدہ اسناد۔',
            roman_urdu: 'Board certified result sheets.'
          },
          isReady: false
        }
      ],
      fields: [
        {
          id: 'gf-1',
          fieldName: 'Tehsil & District of Residence',
          originalText: '1. Tehsil / Sub-Division & District Name',
          explanation: {
            en: 'The administrative sub-division (Tehsil) where your permanent house is situated within the district.',
            ur: 'آپ کی مستقل رہائش گاہ کا انتظامی تحصیل اور ضلع کا نام۔',
            roman_urdu: 'Aap ke permanent ghar ki Tehsil aur District ka naam.'
          },
          fieldType: 'text',
          isRequired: true,
          isConfusing: true,
          exampleValue: 'Tehsil Model Town, District Lahore',
          commonMistakes: {
            en: 'Mixing up Tehsil with Union Council or writing temporary city.',
            ur: 'تحصیل کو یو سی (یونین کونسل) کے ساتھ ملانا یا عارضی شہر کا نام لکھنا۔',
            roman_urdu: 'Tehsil ko Union Council samajhna ya temporary city likhna.'
          },
          categoryGroup: 'personal'
        },
        {
          id: 'gf-2',
          fieldName: 'Blood Group',
          originalText: '2. Blood Group (Medical Laboratory Verified)',
          explanation: {
            en: 'Your medical blood group type (e.g., O+, A+, B-, AB+). Should match your medical lab report.',
            ur: 'آپ کا تصدیق شدہ بلڈ گروپ (جیسے A+، O+ وغیرہ)۔',
            roman_urdu: 'Aap ka verified medical blood group (e.g. O+, A+, B+).'
          },
          fieldType: 'select',
          options: ['A Positive (A+)', 'A Negative (A-)', 'B Positive (B+)', 'B Negative (B-)', 'O Positive (O+)', 'O Negative (O-)', 'AB Positive (AB+)', 'AB Negative (AB-)'],
          isRequired: true,
          isConfusing: false,
          exampleValue: 'O Positive (O+)',
          commonMistakes: {
            en: 'Guessing blood group without a formal lab test report.',
            ur: 'لیب رپورٹ کے بغیر اندازے سے بلڈ گروپ لکھنا۔',
            roman_urdu: 'Bina lab report ke blood group guess karke likhna.'
          },
          categoryGroup: 'personal'
        },
        {
          id: 'gf-3',
          fieldName: 'Oath / Solemn Declaration Affidavit',
          originalText: '3. Declaration: I hereby declare on oath that I do not hold a domicile from any other district.',
          explanation: {
            en: 'A legal pledge that you have NOT applied for or received a domicile certificate from any other district in Pakistan. Holding dual domiciles is an offense.',
            ur: 'یہ قانوناً حلفیہ اقرار نامہ ہے کہ آپ کے پاس پاکستان کے کسی دوسرے ضلع کا ڈومیسائل نہیں ہے۔ دوہرا ڈومیسائل رکھنا جرم ہے۔',
            roman_urdu: 'Ye legal oath hai ke aap ke paas kisi doosre district ka domicile nahi hai. Dual domicile rakhna illegal hai.'
          },
          fieldType: 'checkbox',
          isRequired: true,
          isConfusing: true,
          exampleValue: 'Checked / Agreed',
          commonMistakes: {
            en: 'Applying for a second district domicile while already holding one in another province.',
            ur: 'پہلے سے ڈومیسائل موجود ہونے کے باوجود دوسرے ضلع کا بھی بنوانا۔',
            roman_urdu: 'Pehle se domicile hone ke bawajood doosre district ka apply karna.'
          },
          categoryGroup: 'other'
        }
      ]
    }
  }
];
