# Patient Intake Forms
Separate frontend project · family: specialized · tier: 2 · adapter: PatientIntakeAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs patient-intake-forms`).

## Spec traceability (source: ../specs-source/patient-intake-forms/)
- Screens (10): Forms library · Form builder · Preview & test fill · Fill sessions & links · Submissions console · Submission review workspace · Vocabulary manager · Patient fill surface · Exports & jobs · Settings
- Adapter operations (29): getSession, listForms, createForm, getForm, saveForm, publishForm, archiveForm, duplicateForm, openFillSession, resumeFillSession, saveDraftAnswers, submitIntake, normalizeSymptomText, listSubmissions, getSubmission, resolveSymptomMatch, flagSubmission, setSubmissionReviewState, exportIntakePackage, getArtifact, listSymptomTerms, saveSymptomTerm, deleteSymptomTerm, importVocabulary, listJobs, listActivity, getFormOverview, updateWorkspace, getUsage
- Identity: Rahma Sage, pairing P12 (Harmattan + Work Sans), radius C, soft-lift, motion: calm
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
