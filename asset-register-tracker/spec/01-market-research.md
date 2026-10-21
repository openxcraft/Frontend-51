# 01 — Market Research: asset-register-tracker

SME-A pass · URLs retrieved / fetched 2026-10-16 (research digest Q1–Q6). Every competitor below was verified live (HTTP 200/301 via direct fetch) or returned by quoted search as cited. Pricing figures are as printed on vendor pages on that date; no figure is invented. Unverifiable quantities are marked "unverified estimate".

## Direct competitors (6)

| Competitor | Class | Proof (URLs) | Signal | Gap we attack |
|---|---|---|---|---|
| Snipe-IT | free open-source + hosted registry | snipeitapp.com [1]; docs [2]; pricing fetched [3] | "track who has which laptop"; free self-host core; hosted $399.99/yr–$2,499.99/yr with ∞ users/assets [3] | IT-department shape (licenses, depreciation fields); checkout as fields, not signed chains; Latin-first; self-host ops burden |
| Asset Panda | mobile-first lifecycle platform | assetpanda.com [4]; pricing = demo-booking only [5]; LinkedIn [6] | "full asset lifecycle… tracking, inspections, audits, compliance, and AI" [4]; sales-led pricing (no public price) [5] | Enterprise-sales posture; AI bolted on (we are declared non-AI — cleaner promise); no signed custody chain, no bilingual |
| Reftab | hosted tracker, check-in/out + QR | reftab.com [7]; pricing fetched [8] | $125/mo hardware tier, unlimited users; 50 assets free forever; feature list: QR/barcode scanning, check-in/out, audits, maintenance [8] | ITAM sprawl (software spend, compliance, maintenance — excluded from us by LOOP-10); custody = assignment history without signatures; Latin-first |
| GoCodes | QR-label platform, per-asset tiers | gocodes.com [9]; pricing fetched [10] | Patented QR labels, "trusted by 1,000+ companies since 2011" (vendor claim) [9]; $500/yr (200 assets, 3 users) → $2,500/yr (2,000 assets); label hardware $2–8/label [10] | Labels sold as hardware consumable, not modeled as lifecycle data; custody light; tracker add-ons (GPS/NFC) sprawl; Latin-first |
| Shelf.nu | open-source equipment checkout | shelf.nu checkout [11]; tags guide [12] | "Scan a code, transfer custody" [11]; free tier includes custody; label sizes 25/40/60mm, PNG/SVG/PDF export [12] | Checkout-first (bookings, reservations); no label lifecycle states; no retirement/certificate records; Latin-first |
| Cheqroom / itemit / Itefy class | equipment checkout apps | cheqroom.com/asset-tags [13]; itemit [14]; itefy [15] | Category centers who-has-what with due dates; tags as consumables [13] | AV/equipment niche shape; no registry taxonomies, no audit exports, no bilingual |

[1] https://snipeitapp.com · [2] https://snipe-it.readme.io/docs/introduction · [3] https://snipeitapp.com/pricing · [4] https://www.assetpanda.com · [5] https://www.assetpanda.com/pricing/ · [6] https://www.linkedin.com/company/asset-panda · [7] https://reftab.com · [8] https://reftab.com/pricing · [9] https://gocodes.com · [10] https://gocodes.com/pricing/ · [11] https://www.shelf.nu/solutions/equipment-check-in · [12] https://www.shelf.nu/blog/asset-tags-guide · [13] https://www.cheqroom.com/asset-tags · [14] https://itemit.com/asset-tracking/equipment-checkout-software · [15] https://www.itefy.com/features/checkout-checkin

## Indirect competitors (4)

- **The spreadsheet + paper sign-out sheet** (the real incumbent): the sign-out sheet is "a running custody log used to record every short-term loan" [16] — the exact job, on paper, in a drawer. Free, flexible, unauditable, unsearchable, and invisible to anyone not standing at the drawer. Our product is this sheet's honest replacement.
- **ERP / accounting fixed-asset modules** (Babington's register definition: accounting tool summarizing assets + depreciation [17]; MRI: register for audit-trail purposes [18]): they own the financial register (valuation, depreciation — excluded from our scope). They are bought by finance, hated by ops for daily lookups, and say nothing about custody or labels. Adjacent, not competing: our export feeds their audit conversation (Q4).
- **Maintenance-first CMMS platforms** (maintenance and work orders as the center, e.g. the modules bundled inside Reftab [8] and GoCodes [9]): different primary job (LOOP-10 excludes maintenance from us deliberately).
- **Generic QR-scanner + spreadsheet DIY stacks** (free QR generators [19] glued to shared sheets): zero-cost competitor; the label is durable but the data behind it is not a registry.

[16] https://www.maptrack.com/templates/equipment-checkout-sign-out-sheet · [17] https://babington.co.uk/insights/help-guides/what-is-a-fixed-asset-register · [18] https://www.mrisoftware.com/solutions/fixed-asset-management-software/what-is-a-fixed-asset-register · [19] https://www.qr-code-generator.com

## Market and demand evidence

- **Category is priced and alive**: Snipe-IT sells hosting tiers ($399.99–$2,499.99/yr, unlimited users/assets) [3]; Reftab charges $125/mo with a 50-asset free floor [8]; GoCodes sells $500–$2,500/yr per-asset tiers [10]; Asset Panda runs a sales-led motion [5]. Forbes Advisor maintains a 10-product buying guide: "asset tracking isn't just for enterprises anymore" [20].
- **The buyer pain is named by vendors themselves**: GoCodes' homepage leads with "Spreadsheet chaos — spreadsheets can't tell you: where equipment is right now, who took it last, when it's due back" [9]; Asset Panda markets against "asset chaos" [6]. When vendors put the spreadsheet at the top of the funnel, the pain is mainstream.
- **Practitioner sentiment (paraphrased, r/sysadmin threads)**: buyers prioritize easy setup above feature depth; self-host vs hosted is the recurring tension; Snipe-IT is the default free answer and the recurring complaint is the operational burden of running it [21][22]. Setup weight — not capability — is the adoption gate for our buyer.
- **GCC audit context creates a second, regional pull**: ZATCA guidance expects zakat documents for fixed assets [23]; audit-readiness guidance lists "Fixed assets. Register, additions, disposals, depreciation support" among expected evidence [24]; audit checklists circulate for Saudi businesses [25]. Accounting owns the numbers; the office manager still must produce the register, the custody story, and the disposal records. A bilingual registry with exportable evidence sits exactly there.
- **Labeling practice is established craft**: minimum scannable QR ~1.6×1.6cm; material ladder paper → laminated polyester (office default) → aluminium / tamper-evident [26][27]; standard label sheet formats exportable as PNG/SVG/PDF [12]. This de-risks the label-sheet feature (no hardware dependency) and validates print-your-own as a mainstream path.
- **Market size**: no verifiable primary figure was retrieved this session — any TAM/CAGR number here would be an unverified estimate and is excluded. The existence proof is the priced competitive set above.

[20] https://www.forbes.com/advisor/business/software/best-asset-tracking-software · [21] https://www.reddit.com/r/sysadmin/comments/1isewng/need_a_good_asset_management_software · [22] https://www.reddit.com/r/sysadmin/comments/1i7b68q/need_the_best_yet_simplest_asset_management · [23] https://www.zatca.gov.sa/en/HelpCenter/guidelines/Documents/Zakat%20Docs.pdf · [24] https://saudicomplianceinstitute.com/en/blogs/news/zatca-tax-audit-triggers-audit-ready-file-ksa · [25] https://www.creationbc.com/en-sa/news/how-to-pass-a-zatca-audit-complete-checklist-for-saudi-businesses · [26] https://blog.invgate.com/qr-codes-for-asset-management · [27] https://www.shelf.nu/blog/asset-tags-guide

## Pricing landscape

Two live models in the class: **flat-with-unlimited-users** (Snipe-IT hosted from $39.99/mo; Reftab $125/mo) and **per-asset volume tiers** (GoCodes $500/yr for 200 assets/3 users; $2,500/yr for 2,000; extra users $400/yr per 5) [3][8][10]. Free floors: Snipe-IT self-host (free, you run it), Reftab 50 assets forever, Shelf free tier with custody. Label hardware is a consumable ($2–8/label when vendor-printed) — print-your-own on standard stock is the zero-hardware path [10][12]. For a 200–500-asset office, the market pays roughly $500–$1,500/yr today; the incumbent alternative costs $0 plus one lost-laptop dispute.

## Positioning gaps (why this product)

1. **Signed custody chain as the core object**: competitors store assignment history; nobody makes the hand-off a signed, append-only event chain with correction semantics — that is compliance-suite territory at enterprise prices. We ship it at office-manager prices (02 Maha's audit-answer demand).
2. **Label lifecycle as data**: the category prints labels; none models requested/printed/applied/damaged/missing/retired as states with replacement flow and batch artifacts. Registers rot exactly here — re-printed labels over dead ones, applied labels nobody confirmed.
3. **Bilingual ar/en by construction**: Arabic names, Arabic search normalization, bidi-safe tags, bilingual label sheets (the label itself carries both scripts — a MENA-specific artifact), custody signatures by Arabic names. No verified competitor does any of this.
4. **Non-AI honesty as positioning**: the category is bolting AI on [4]; an office registry's value is that it is boring, exact, and exportable. Declared non-AI is a trust posture, not a limitation (00).
5. **Ops-shaped, not IT-shaped**: locations as building/floor/room trees, categories in both locales, retirement with certificate references, scan companion for every employee — the office manager's mental model, not the IT asset database's.

## Complaints mined (paraphrased patterns)

- r/sysadmin threads: Snipe-IT loved for price, resented for the running of it; "easy to set up" is the loudest recurring requirement [21][22].
- GoCodes' own funnel copy names spreadsheet chaos and 6–12-month enterprise implementations as the two enemies [9] — the wedge validated by the incumbent's marketing.
- r/VIDEOENGINEERING: durable QR/barcode label stock that survives handling is a recurring practical complaint; self-printing matters [28].
- r/msp: destruction certificates are demanded precisely so responsibility is documented, not argued [29] — the same instinct our custody signatures formalize.

[28] https://www.reddit.com/r/VIDEOENGINEERING/comments/1pidqyw/asset_tag_labels_durable_qrbarcode_labels_for · [29] https://www.reddit.com/r/msp/comments/3s5rc3/hard_drive_certificate_of_destruction
