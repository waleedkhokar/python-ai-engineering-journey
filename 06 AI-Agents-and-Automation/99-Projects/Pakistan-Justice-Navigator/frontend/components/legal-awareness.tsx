import Link from "next/link";
import { Notice, PageHeader } from "./app-ui";
import { Icon } from "./icons";

// General orientation only. No section numbers, deadlines or penalties are stated on purpose.
const FAQS = [
  { q: "What is an FIR?", a: "A First Information Report is the written record a police station makes when it is told about a serious (cognizable) offence. It starts the police process. What happens next depends on the facts and the law." },
  { q: "Where can I read Pakistan's laws myself?", a: "Federal laws are published on the Pakistan Code website (pakistancode.gov.pk). Provincial laws are published by provincial governments and assemblies. The Source Library lists the official links this project has collected." },
  { q: "Do I need a lawyer to write a legal notice?", a: "You can write one yourself, but its wording can affect later steps. Draft Documents gives a plain starting template; having a lawyer review it is strongly advisable." },
  { q: "Why do some answers say 'verify with the source'?", a: "AI can misread or oversimplify a law. This platform shows the official source next to every summary so you can read the original text and confirm it." },
  { q: "Can this platform tell me whether I will win?", a: "No. It organises information and points to sources. Outcomes depend on evidence, procedure and a court's judgment." }
];

export function LegalAwareness() {
  return (
    <div className="app-page">
      <PageHeader eyebrow="Legal Awareness" title="Plain-language orientation" lede="Short, general explanations to help you ask better questions. They are not a substitute for the law itself." />

      <div className="app-card">
        <div className="app-faq">
          {FAQS.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      <section className="app-grid-2">
        <Link href="/research" className="app-card app-linkcard"><Icon name="search" size={22} /><div><strong>Research a topic</strong><small>Search official-source records.</small></div><Icon name="arrow" size={16} /></Link>
        <Link href="/case/new" className="app-card app-linkcard"><Icon name="message" size={22} /><div><strong>Describe your situation</strong><small>Start the guided intake.</small></div><Icon name="arrow" size={16} /></Link>
      </section>

      <Notice>General information only. Laws change and facts matter. Confirm anything important with a qualified lawyer or the official source.</Notice>
    </div>
  );
}
