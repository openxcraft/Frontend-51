# Visitor Badge Checkin
Separate frontend project · family: business_ops · tier: 3 · adapter: VisitorBadgeAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs visitor-badge-checkin`).

## Spec traceability (source: ../specs-source/visitor-badge-checkin/)
- Screens (10): Today board · Visits list · Pre-registration composer · Visit detail · Visitor log & exports · Badge studio · Settings · Host surface — my guests · Kiosk check-in · Jobs console
- Adapter operations (31): getSession, getFrontDeskBoard, listVisits, getVisit, createVisitInvitation, updateVisit, cancelVisit, getVisitByCheckInCode, lookupReturningVisitor, checkInVisitor, checkOutVisitor, listBadgeTemplates, getBadgeTemplate, saveBadgeTemplate, validateBadgeTemplate, previewBadge, issueBadge, voidBadge, getBadge, getBadgeArtifact, listHosts, addHost, updateHost, getKioskConfig, saveKioskConfig, getWorkspaceSettings, saveWorkspaceSettings, exportVisitorLog, getArtifact, listJobs, getUsage
- Identity: Barid Sky, pairing P06 (Almarai + Inter), radius B, flat-line, motion: minimal
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
