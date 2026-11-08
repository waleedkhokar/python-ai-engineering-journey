# Pakistan Legal Corpus — Source Register

Primary-source policy: only official government and court systems belong in the Tier-1 corpus.

## Federal legislation
- Pakistan Code — Ministry of Law & Justice: https://pakistancode.gov.pk/english/
- The manifest currently contains **13 verified direct Pakistan Code PDF endpoints** for priority federal sources. These rows use `status=source_url_verified` until the PDF is actually downloaded and ingested.
- The verified direct-PDF set currently includes:
  - Constitution of the Islamic Republic of Pakistan (`PK-001`)
  - Pakistan Penal Code, 1860 (`PK-002`)
  - Code of Criminal Procedure, 1898 (`PK-003`)
  - Code of Civil Procedure, 1908 (`PK-004`)
  - Specific Relief Act, 1877 (`PK-007`)
  - Limitation Act, 1908 (`PK-008`)
  - Registration Act, 1908 (`PK-010`)
  - Anti-Money Laundering Act, 2010 (`PK-015`)
  - Anti-Terrorism Act, 1997 (`PK-016`)
  - Protection against Harassment of Women at the Workplace Act, 2010 (`PK-017`)
  - Electronic Transactions Ordinance, 2002 (`PK-018`)
  - Juvenile Justice System Act, 2018 (`PK-019`)
  - Legal Aid and Justice Authority Act, 2020 (`PK-020`)

## Sindh legislation
- Sindh Code — Government of Sindh: https://www.sindhlaws.gov.pk/SindhIndex.aspx
- Current Sindh rows remain metadata-only until a direct official act/PDF endpoint is individually verified.

## Sindh High Court case law
- Official case-law search: https://caselaw.shc.gov.pk/caselaw/pview.php?rpt=search
- The five `SHC-*` rows supplied in the starter dataset are placeholders and are quarantined from evidence retrieval until replaced with real case records and official judgment/order files.

## Integrity rules
- Preserve title, source URL, authority, date/citation where available and file name.
- Do not substitute unofficial mirrors when an official download fails.
- `source_url_verified` means the official file endpoint is known; it does **not** mean text has been ingested.
- `metadata_only` can identify a candidate source but cannot justify an exact section/article claim.
- `ingested` is assigned only after source text has actually been chunked and pushed to the corpus store.
- Exact legal text shown to users must come from an ingested source chunk whose provenance points back to the official document.
