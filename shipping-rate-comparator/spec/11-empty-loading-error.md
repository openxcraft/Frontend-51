# 11 — Empty / Loading / Error: shipping-rate-comparator (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR · voice = arithmetician-plain (02: states the number, then the chain that produced it) · Arabic is فصحى بيضاء utility register · numerals Western everywhere (ledger row — data surface; never mixed systems mid-sentence) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked: بطاقة الأسعار=rate card · منطقة=zone · شريحة الوزن=weight break · الوزن الفعلي=actual weight · الوزن الحجمي=volumetric weight · الوزن القابل للشحن=chargeable weight · القاسم=divisor · عرض السعر=quote · المقارنة=comparison · الرسوم الإضافية=surcharges · مواصفة الشحنة=shipment profile · الوجهة=destination · الدفعة=batch.

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| S1 cards first-run | "No rate cards yet. Paste one courier table — zones, weight breaks, prices — and it becomes a working card in minutes. Or open the sample cards and rate the sample box first." | "لا بطاقات أسعار بعد. الصق جدول شركة شحن واحداً — مناطق وشرائح وزن وأسعاراً — ليتحول إلى بطاقة عاملة في دقائق. أو افتح البطاقات التجريبية وسعّر الصندوق التجريبي أولاً." | Paste a card / Open samples |
| S1 filtered-empty | "No cards match these filters." | "لا بطاقات تطابق هذه المرشّحات." | Clear filters |
| S1 no-access | "These cards belong to another workspace." | "هذه البطاقات تخصّ مساحة عمل أخرى." | Switch workspace |
| S1 coverage-gap warning (not empty — surfaced) | "2 active cards have zones with no coverage — those zones never match a destination." | "بطاقتان نشطتان فيهما مناطق بلا تغطية — تلك المناطق لا تطابق أي وجهة أبداً." | Open the zones |
| S2 card draft incomplete | "This draft can't rate yet — it needs at least one covered zone, a complete weight-break ladder, and prices for every zone." | "هذه المسودة لا تسعّر بعد — تحتاج منطقةً مغطاةً واحدة على الأقل، وسلّم شرائح وزن مكتمل، وأسعاراً لكل منطقة." | Complete the card |
| S4 workbench never-run | "No comparison yet. Enter a destination and a weight — the calculator settles the chargeable weight as you type, and Run rates every selected card." | "لا مقارنة بعد. أدخل وجهاً ووزناً — تحسب الحاسبة الوزن القابل للشحن أثناء الكتابة، وزرّ التشغيل يسعّر كل بطاقة مختارة." | Run comparison |
| S4 no active cards | "Every card is retired or still a draft. Activate one — or switch on include-retired to rate against old terms." | "كل البطاقات متقاعدة أو مسودات. فعّل واحدة — أو شغّل خيار تضمين المتقاعدة للتسعير بالشروط القديمة." | Go to cards |
| S4 profiles first-run (S7) | "No shipment profiles yet. Save your standard box once — weight, dimensions, COD — and every comparison starts from it." | "لا مواصفات شحنات بعد. احفظ صندوقك القياسي مرة واحدة — وزناً وأبعاداً ودفعاً عند الاستلام — وتبدأ كل مقارنة منه." | Create a profile |
| S4/S7 filtered-empty | "No profiles match these filters." | "لا مواصفات تطابق هذه المرشّحات." | Clear filters |
| S6 history empty | "No comparisons yet — singles and batches land here, pinned ones first." | "لا مقارنات بعد — تصل المفردة والدفعات هنا، والمثبّتة أولاً." | Open the workbench |
| S6 pinned-filter empty | "No pinned comparisons. Pin one while a renewal is fresh — it becomes the baseline you re-run against." | "لا مقارنات مثبّتة. ثبّت واحدة والتفاوض حديث — تصبح الأساس الذي تعيد التشغيل مقابله." | Clear the pin filter |
| S8 jobs empty | "Nothing running. Imports, batches, and exports appear here while they work." | "لا مهام قيد التنفيذ. الاستيرادات والدفعات والتصديرات تظهر هنا أثناء عملها." | — |
| S4 batch matrix all-exceptions | "Every destination hit an exception on every card — check the destinations' spelling or the cards' coverage." | "كل وجهة اصطدمت باستثناء على كل بطاقة — راجع تهجئة الوجهات أو تغطية البطاقات." | Open the first exception |

## B. Loading (P02/P12 — skeletons mirror geometry per direction; honest progress)

| State | English | Arabic |
|---|---|---|
| S1 list skeleton | skeleton rows ×8 + "Loading your cards…" (SR) | صفوف هيكلية + "جارٍ تحميل بطاقاتك…" |
| Import job (determinate) | "Parsing 12 of 24 rows — 2 issues listed below the preview." | "تحليل 12 من 24 صفاً — مشكلتان مدرجتان أسفل المعاينة." |
| Comparison compute (large libraries) | "Rating 3 kg across 40 cards…" | "تسعير 3 كجم عبر 40 بطاقة…" |
| Batch job (determinate) | "Resolving 12 of 30 destinations." | "معالجة 12 من 30 وجهة." |
| Export job | "Building the comparison table — breakdowns included." | "بناء جدول المقارنة — مع التفصيلات." |
| Artifact fetch | "Fetching the export…" | "جلب التصدير…" |
| Card editor autosave (P10) | "Saving…" → "Saved" (fades) | "جارٍ الحفظ…" → "حُفظ" |
| S8 job row | determinate: "12 of 30"; indeterminate: "Working — no estimate yet" | "12 من 30" ؛ "قيد العمل — لا تقدير بعد" |

## C. Errors (7 classes; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (import bad row) | "Row 17's price '١٥٫٠٠' uses a decimal separator the parser doesn't accept — re-enter it as digits. Rows around it parsed fine." | "سعر السطر 17 '١٥٫٠٠' يستخدم فاصلة عشرية لا يقبلها المحلّل — أعد إدخاله أرقاماً. الأسطر من حوله حُلّلت سليمة." |
| VALIDATION (break overlap) | "Row 22's break 5 kg overlaps 3–5 kg — ceilings must rise without touching. Fix the ceiling or delete the row." | "شريحة السطر 22 البالغة 5 كجم تتقاطع مع 3–5 كجم — يجب أن ترتفع السقوف دون تلامس. صحّح السقف أو احذف السطر." |
| VALIDATION (activation gate) | "Can't activate yet: zone Z3 has no coverage. Add destinations to it — or delete the zone." | "لا يمكن التفعيل بعد: المنطقة Z3 بلا تغطية. أضف وجهاً إليها — أو احذف المنطقة." |
| VALIDATION (coverage overlap) | "'الرياض' sits in both Z1 and Z2 — a destination resolves to exactly one zone per card. Remove it from one." | "'الرياض' تقع في Z1 وZ2 معاً — كل وجهة تحلّ إلى منطقة واحدة فقط في البطاقة. أزلها من إحداهما." |
| VALIDATION (run gates) | "Run needs a destination, a weight above zero, and at least one card selected." | "يحتاج التشغيل وجهاً ووزناً أكبر من صفر وبطاقةً مختارةً واحدة على الأقل." |
| NOT_FOUND (stale link) | "That card, comparison, or profile is gone from this workspace. It may have been deleted while you were away." | "تلك البطاقة أو المقارنة أو المواصفة غابت عن مساحة العمل. ربما حُذفت أثناء غيابك." |
| NOT_FOUND (expired artifact) | "This export expired 8 days ago. Regenerate it — the comparison it came from is unchanged." | "انتهت صلاحية هذا التصدير قبل 8 أيام. أعد توليده — المقارنة التي صدر عنها لم تتغيّر." |
| PERMISSION (viewer role) | "Your seat reads, runs comparisons, and exports — it doesn't edit cards here. Ask the workspace owner for an editor seat." | "مقعدك يقرأ ويشغّل المقارنات ويصدّر — ولا يحرّر البطاقات هنا. اطلب من مالك مساحة العمل مقعداً محرّراً." |
| PERMISSION (workspace scoping) | "That comparison belongs to another workspace." | "تلك المقارنة تخصّ مساحة عمل أخرى." |
| CONFLICT (concurrent card edit) | "Noura saved a change to this card while you did. Both versions are kept — choose what stays." | "حفظت نورة تغييراً في هذه البطاقة أثناء عملك. الاحتفاظ بالنسختين — اختر ما يبقى." |
| CONFLICT (concurrent profile edit) | "This profile changed while you were editing it. Both versions are side by side." | "تغيّرت هذه المواصفة أثناء تحريرك. النسختان جنباً إلى جنب." |
| RATE_LIMIT (export window) | "This month's export window is used — 20 of 20. Comparisons never meter, and downloads resume 1 Nov." | "استُهلكت نافذة التصدير لهذا الشهر — 20 من 20. المقارنات لا تُقاس أبداً، وتستأنف التنزيلات في 1 نوفمبر." |
| RATE_LIMIT (80% warning) | "Exports at 17 of 20 this window — the download itself never meters." | "التصديرات عند 17 من 20 في هذه النافذة — والتنزيل نفسه لا يُقاس أبداً." |
| NETWORK (list fetch) | "The card list went stale — reconnecting. Nothing you saved is lost." | "تقادمت قائمة البطاقات — تجري إعادة الاتصال. لا شيء ممّا حفظته ضائع." |
| NETWORK (batch partial) | "The batch delivered 24 of 30 destinations — the connection dropped. Retry just the 6 missing." | "سلّمت الدفعة 24 من 30 وجهة — انقطع الاتصال. أعد محاولة الستّ الناقصة وحدها." |
| UNKNOWN | "Something failed on our side (ref src-corr-0001). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع src-corr-0001). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips, no confetti)

| Moment | English | Arabic |
|---|---|---|
| Card activated | "Card active — 'التوصيل المحلي القياسي' now rates comparisons at version 4." | "البطاقة نشطة — 'التوصيل المحلي القياسي' تسعّر المقارنات الآن بالإصدار 4." |
| Import done | "24 rows in — 22 parsed, 2 issues listed, nothing silently dropped." | "دخلت 24 صفاً — حُلّل 22، ومشكلتان مدرجتان، ولم يُهمَل شيء بصمت." |
| Comparison ready | "Comparison ready — 2 quoted, 1 no-coverage. Cheapest: 17.60 SAR on 'سلسلة التوصيل'." | "المقارنة جاهزة — عرضان مسعّران ووجهة بلا تغطية. الأرخص: 17.60 ريال على 'سلسلة التوصيل'." |
| Batch ready | "Batch ready — 6 destinations, 10 exception cells named, cheapest per row flagged." | "الدفعة جاهزة — 6 وجهات، و10 خلايا استثناء مسمّاة، والأرخص معلّم في كل صف." |
| Card duplicated | "Draft copy created — last cycle's terms stay intact at version 7." | "أُنشئت نسخة مسودة — تبقى شروط الدورة الماضية سليمة بالإصدار 7." |
| Pin saved | "Pinned — this comparison is the renewal baseline now. Re-run after the new card lands." | "مثبّتة — هذه المقارنة أساس التفاوض الآن. أعد التشغيل بعد وصول البطاقة الجديدة." |
| Export ready | "Export ready — markdown table, breakdowns on, expires in 7 days." | "التصدير جاهز — جدول ماركداون مع التفصيلات، ينتهي بعد 7 أيام." |
| Artifact regenerated | "Regenerated — same snapshot, same numbers, fresh 7-day window." | "أُعيد توليده — اللقطة ذاتها والأرقام ذاتها ونافذة 7 أيام جديدة." |
| Profile saved | "Profile saved — 'صندوق الرياض القياسي' starts your next comparison." | "حُفظت المواصفة — 'صندوق الرياض القياسي' يبدأ مقارنتك القادمة." |
| Undo window (P03, profile delete) | "Profile deleted — Undo (7s)" | "حُذفت المواصفة — تراجع (7 ثوانٍ)" |

## E. Signature moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| **The Settle — volumetric wins** | "Chargeable weight 3.0 kg — volumetric basis: 35×25×15 cm ÷ 5000 = 2.63 kg, rounded up at the 0.5 kg step." | "الوزن القابل للشحن 3.0 كجم — أساس حجمي: 35×25×15 سم ÷ 5000 = 2.63 كجم، مقرّباً لأعلى عند خطوة 0.5 كجم." |
| The Settle — actual wins | "Chargeable weight 2.5 kg — actual basis: the box's 2.4 kg rounds up at the 0.5 kg step; volume bills 2.19 kg on this divisor." | "الوزن القابل للشحن 2.5 كجم — أساس فعلي: 2.4 كجم للصندوق مقرّبة لأعلى عند خطوة 0.5 كجم؛ والحجم يسعّر 2.19 كجم على هذا القاسم." |
| The Settle — minimum wins | "Chargeable weight 1.0 kg — minimum basis: this card bills no less than a kilogram." | "الوزن القابل للشحن 1.0 كجم — أساس الحدّ الأدنى: هذه البطاقة لا تسعّر بأقل من كيلوغرام." |
| Cheapest flip (re-run after card edit) | "The cheapest moved: 21.94 → 17.60 SAR — 'سلسلة التوصيل' took the standard box at the new 3 kg break." | "انتقل الأرخص: 21.94 → 17.60 ريال — أخذت 'سلسلة التوصيل' الصندوق القياسي عند شريحة 3 كجم الجديدة." |
| No-coverage row | "'طريق الخليج' doesn't cover 'الرياض' — this card rates countries, not cities. Add the destination to a zone, or ship it on a city-level card." | "لا تغطي 'طريق الخليج' مدينة 'الرياض' — هذه البطاقة تسعّر دولاً لا مدناً. أضف الوجهة إلى منطقة، أو اشحنها ببطاقة على مستوى المدن." |
| Out-of-range row | "18 kg sits above this card's 10 kg table and it has no overage policy — the quote is out of range by design." | "يقع 18 كجم فوق جدول 10 كجم لهذه البطاقة ولا سياسة وزن إضافي لديها — العرض خارج النطاق بحكم التصميم." |
| Zone probe with normalization | "'الاحساء' → Zone Z2 — matched coverage entry 'الأحساء' via the alef rule. See every rule the matcher applied." | "'الاحساء' → المنطقة Z2 — طابقت عنصر التغطية 'الأحساء' بقاعدة الألف. اعرض كل قواعد المطابقة المطبَّقة." |
| Zone probe no match | "'الظهران' resolves on no zone of this card — coverage is a list, not a guess." | "لا تحلّ 'الظهران' على أي منطقة في هذه البطاقة — التغطية قائمة لا تخمين." |
| Mixed-currency notice | "Quotes run in 2 currencies — 3 SAR cards and 1 USD card. Ranking stays inside each currency; no exchange rate is invented." | "تسري العروض بعملتين — 3 بطاقات بالريال وواحدة بالدولار. يبقى الترتيب داخل كل عملة؛ ولا يُخترع أي سعر صرف." |
| Sample badge | "Sample card — synthetic prices, real arithmetic. Clear it when your own card arrives." | "بطاقة تجريبية — أسعار تركيبية وحساب حقيقي. امسحها متى وصلت بطاقتك." |
| Stale card since run | "This card changed since the run — the snapshot keeps version 4's terms. Re-run to rate the new version." | "تغيّرت هذه البطاقة منذ التشغيل — تحتفظ اللقطة بشروط الإصدار 4. أعد التشغيل لتسعير الإصدار الجديد." |
| Remote-zone quote | "Zone Z3 is remote on this card — a 15.00 SAR surcharge applies by the card's own rule." | "المنطقة Z3 نائية في هذه البطاقة — يُطبَّق رسم إضافي 15.00 ريال بقاعدة البطاقة نفسها." |
| Overage math (breakdown) | "Overage: 2 kg above the 10 kg table × 2.00 per 0.5 kg step = 8.00 SAR, in 4 steps." | "الوزن الإضافي: 2 كجم فوق جدول 10 كجم × 2.00 لكل خطوة 0.5 كجم = 8.00 ريال، في 4 خطوات." |
| Fuel rule line (breakdown) | "Fuel 12.5% of the 40.00 transport charge = 5.00 SAR." | "الوقود 12.5% من أجرة النقل 40.00 = 5.00 ريال." |
| COD rule line (breakdown) | "Cash-on-delivery 5.00 SAR flat — applied because the profile carries 240.00 SAR COD." | "الدفع عند الاستلام 5.00 ريال ثابتة — طُبِّق لأن المواصفة تحمل 240.00 ريال دفعاً عند الاستلام." |

## F. Bidi/mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Latin channel label in AR chrome | "Pacific Freight — a Latin-script label inside Arabic chrome. Rendered isolated; the zone columns stay mirrored around it." | "Pacific Freight — تسمية بخط لاتيني داخل واجهة عربية. تُعرض معزولةً؛ وتبقى أعمدة المناطق معكوسة حولها." |
| Arabic destination in EN matrix | "'جدة' renders right-to-left inside the English batch matrix — isolated, never force-flipped." | "تُعرض 'جدة' من اليمين إلى اليسار داخل مصفوفة الدفعات الإنجليزية — معزولة، ولا تُقلب قسراً أبداً." |
| Currency code in Arabic sentence | "SAR renders as a Latin token inside the Arabic total line — isolated so the digits keep their order." | "يُعرض SAR رمزاً لاتينياً داخل سطر الإجمالي العربي — معزولاً لتحافظ الأرقام على ترتيبها." |
| Normalized-match chip | "'الأحساء' ← 'الاحساء' — the alef rule, shown where it matched." | "'الأحساء' ← 'الاحساء' — قاعدة الألف، معروضة حيث طابقت." |
