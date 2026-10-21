# Halal Certification Tracker
Separate frontend project · family: specialized · tier: 3 · adapter: HalalCertificationAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs halal-certification-tracker`).

## Spec traceability (source: ../specs-source/halal-certification-tracker/)
- Screens (12): Register home · Applicants directory · Application workspace · Ingredient directory · Supplier-certificate vault · Certificate detail · Renewal console · Ladder policy editor (in Settings) · Activity log · Jobs console · Settings · Command palette (overlay)
- Adapter operations (32): getSession, listApplicants, createApplicant, getApplicant, updateApplicant, listApplications, createApplication, getApplication, advanceApplication, recordAuditOutcome, listIngredients, createIngredient, updateIngredient, getIngredientImpact, importIngredients, getFormulation, setFormulation, listSupplierCertificates, createSupplierCertificate, updateSupplierCertificate, issueCertificate, listCertificates, getCertificate, setCertificateStatus, openRenewalCase, getRenewalLadder, updateRenewalLadder, exportRegister, exportCertificate, getArtifact, listJobs, listActivity
- Identity: Itqan Forest, pairing P03 (Noto Naskh Arabic + Newsreader), radius B, layered-depth, motion: stately
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
