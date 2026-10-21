# Cod Order Confirmation
Separate frontend project · family: commerce_integrations · tier: 1 · FLAGSHIP · adapter: CodOrderConfirmationAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs cod-order-confirmation`).

## Spec traceability (source: ../specs-source/cod-order-confirmation/)
- Screens (13): SIGN-IN · QUEUE · ORDER DRAWER (Ladder Trail + Risk drill) · AGREEMENT SHEET · CALL LEG SHEET · HOLDS & EXCEPTIONS · MANIFESTS · TEMPLATES STUDIO · POLICY CENTER · BUYERS DIRECTORY · LEDGER & JOBS · INBOX · ONBOARDING CHECKLIST
- Adapter operations (40): getSession, listCodOrders, getCodOrder, importOrders, setOrderHold, cancelCodOrder, startLadder, getLadderPolicy, updateLadderPolicy, rescheduleAttempt, logManualContact, recordBuyerResponse, listDeliveryWindows, upsertDeliveryWindow, proposeWindowsForOrder, computeRiskScore, getRiskPolicy, updateRiskPolicy, simulateRiskPolicy, listBuyers, getBuyer, setBuyerStatus, listMessageTemplates, upsertMessageTemplate, previewMessage, listHandoffManifests, createHandoffManifest, sealHandoffManifest, exportManifest, listActivity, exportConfirmationLedger, listNotifications, markNotificationsSeen, subscribeOrderEvents, getJob, retryJob, cancelJob, listUsers, inviteUser, updateUser
- Identity: Task Courier Carbon, pairing P04 (Cairo + Sora), radius A, ink-press, motion: crisp
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
