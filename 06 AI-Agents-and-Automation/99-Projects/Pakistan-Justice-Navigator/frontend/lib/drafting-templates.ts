export type DraftField = {
  id: string;
  label: string;
  type?: "text" | "textarea" | "date" | "number";
  placeholder?: string;
  hint?: string;
};

export type DraftTemplate = {
  id: string;
  name: string;
  summary: string;
  fields: DraftField[];
  build: (values: Record<string, string>) => string;
};

const blank = "[__________]";
const v = (values: Record<string, string>, key: string) => values[key]?.trim() || blank;

const header = (title: string) =>
  `${title}\n(DRAFT TEMPLATE — prepared with Pakistan Justice Navigator. Review every line, correct it for your facts, and have a qualified lawyer check it before use.)\n\n`;

export const DRAFT_TEMPLATES: DraftTemplate[] = [
  {
    id: "legal-notice",
    name: "Legal notice",
    summary: "A formal written demand sent before taking further steps.",
    fields: [
      { id: "date", label: "Date", type: "date" },
      { id: "senderName", label: "Your full name" },
      { id: "senderAddress", label: "Your address", type: "textarea" },
      { id: "recipientName", label: "Recipient full name" },
      { id: "recipientAddress", label: "Recipient address", type: "textarea" },
      { id: "subject", label: "Subject", placeholder: "e.g. Demand for return of advance payment" },
      { id: "facts", label: "What happened", type: "textarea", hint: "State dates, amounts and events in order, in plain words." },
      { id: "demand", label: "What you are asking for", type: "textarea" },
      { id: "days", label: "Days allowed to respond", type: "number", placeholder: "15" }
    ],
    build: (x) =>
      header("LEGAL NOTICE") +
      `Date: ${v(x, "date")}\n\nFrom:\n${v(x, "senderName")}\n${v(x, "senderAddress")}\n\nTo:\n${v(x, "recipientName")}\n${v(x, "recipientAddress")}\n\nSubject: ${v(x, "subject")}\n\nSir/Madam,\n\nOn behalf of ${v(x, "senderName")}, you are hereby notified as follows:\n\n1. Facts\n${v(x, "facts")}\n\n2. Demand\n${v(x, "demand")}\n\nYou are requested to comply within ${v(x, "days")} days of receipt of this notice. If you do not, the sender reserves the right to pursue the remedies available under the applicable law.\n\nSincerely,\n\n${v(x, "senderName")}\nSignature: ____________________`
  },
  {
    id: "rental-agreement",
    name: "Rental agreement",
    summary: "A basic residential tenancy draft between landlord and tenant.",
    fields: [
      { id: "date", label: "Agreement date", type: "date" },
      { id: "city", label: "City" },
      { id: "landlord", label: "Landlord full name" },
      { id: "tenant", label: "Tenant full name" },
      { id: "property", label: "Property address", type: "textarea" },
      { id: "rent", label: "Monthly rent (PKR)", type: "number" },
      { id: "deposit", label: "Security deposit (PKR)", type: "number" },
      { id: "start", label: "Start date", type: "date" },
      { id: "months", label: "Duration (months)", type: "number", placeholder: "11" }
    ],
    build: (x) =>
      header("RENTAL AGREEMENT") +
      `This agreement is made at ${v(x, "city")} on ${v(x, "date")} between:\n\nLandlord: ${v(x, "landlord")}\nTenant: ${v(x, "tenant")}\n\n1. Premises\nThe landlord lets and the tenant takes on rent the premises located at: ${v(x, "property")}.\n\n2. Term\nThe tenancy begins on ${v(x, "start")} for a period of ${v(x, "months")} months.\n\n3. Rent\nThe tenant shall pay monthly rent of PKR ${v(x, "rent")}, payable in advance on or before the agreed day of each month.\n\n4. Security deposit\nThe tenant has paid a refundable security deposit of PKR ${v(x, "deposit")}, to be returned at the end of the tenancy subject to deductions for unpaid dues or damage beyond normal wear.\n\n5. Use and upkeep\nThe premises shall be used for residential purposes only and kept in good condition.\n\n6. Ending the tenancy\nEither party may end the tenancy by giving written notice of [__________] days.\n\n[Add any other agreed terms here.]\n\nLandlord signature: ____________________   Tenant signature: ____________________\nWitness 1: ____________________   Witness 2: ____________________`
  },
  {
    id: "affidavit",
    name: "Affidavit",
    summary: "A sworn written statement of facts for a stated purpose.",
    fields: [
      { id: "name", label: "Deponent full name" },
      { id: "relation", label: "Son/daughter/wife of" },
      { id: "address", label: "Address", type: "textarea" },
      { id: "purpose", label: "Purpose of the affidavit", placeholder: "e.g. Proof of residence" },
      { id: "statement", label: "Statement of facts", type: "textarea", hint: "Only include facts you personally know to be true." },
      { id: "place", label: "Place" },
      { id: "date", label: "Date", type: "date" }
    ],
    build: (x) =>
      header("AFFIDAVIT") +
      `I, ${v(x, "name")}, son/daughter/wife of ${v(x, "relation")}, resident of ${v(x, "address")}, do hereby solemnly affirm and declare on oath as under:\n\nPurpose: ${v(x, "purpose")}\n\n1. That I am the deponent and am competent to make this affidavit.\n2. That the facts stated below are true and correct to the best of my knowledge and belief:\n\n${v(x, "statement")}\n\n3. That nothing has been concealed and no part of this affidavit is false.\n\nDEPONENT\n${v(x, "name")}\nSignature: ____________________\n\nVERIFICATION\nVerified at ${v(x, "place")} on ${v(x, "date")} that the contents of this affidavit are true and correct. [To be attested by an authorised officer as required.]`
  }
];
