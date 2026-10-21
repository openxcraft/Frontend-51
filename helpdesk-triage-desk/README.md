# Helpdesk Triage Desk
Separate frontend project · family: business_ops · tier: 2 · adapter: HelpdeskTriageAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs helpdesk-triage-desk`).

## Spec traceability (source: ../specs-source/helpdesk-triage-desk/)
- Screens (11): Triage home · Triage queue · Ticket detail · Cluster board · Cluster editor · Routing rules console · Severity & SLA policy studio · SLA monitor · Queues & members · Jobs center & exports · Settings
- Adapter operations (34): getSession, createTicket, listTickets, getTicket, updateTicket, listChannelBindings, createChannelBinding, verifyChannelBinding, revokeChannelBinding, runClustering, listClusters, getCluster, saveCluster, confirmCluster, assignToCluster, saveSeverityPolicy, runSeverityReassessment, listQueues, saveQueue, listRoutingRules, saveRoutingRule, routeTicket, bulkRouteTickets, getSlaOverview, escalateTicket, logTicketResponse, setTicketDisposition, mergeTickets, addTicketNote, listMembers, listJobs, getUsage, exportTriageLog, getArtifact
- Identity: Nazim Cobalt, pairing P02 (Noto Kufi Arabic + Space Grotesk), radius B, flat-line, motion: crisp
- Direction default: bilingual-en (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
