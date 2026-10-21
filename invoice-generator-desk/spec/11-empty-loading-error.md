# 11 — Empty / Loading / Error: invoice-generator-desk (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR · voice = counter-plain (02: states the figure, the rule, and the next action) · Arabic is فصحى بيضاء utility register · **numerals Western in system chrome per the ledger row** (copy-voice §7: never mixed systems mid-sentence; the Arabic strings below render 0-9) — Arabic-Indic glyphs appear ONLY inside the numeral toggle's own specimen labels and document-render examples, marked `[document specimen]` · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked per the 07a glossary (فاتورة · بند · العميل · الإجمالي الفرعي · الخصم · المجموع الكلي · رقم الفاتورة · سلسلة الترقيم · نظام الأرقام · المبلغ كتابةً · تاريخ الاستحقاق · النطاق الضريبي · إصدار الفاتورة · إبطال الفاتورة · تسجيل دفعة · تسليم · تصدير).

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| S1 first-run | "No invoices yet. Open the sample to see the bilingual paper and the numeral toggle — or start your first invoice." | "لا فواتير بعد. افتح العيّنة لترى المستند الثنائي اللغة ومبدّل الأرقام — أو ابدأ فاتورتك الأولى." | Open sample / New invoice |
| S1 filtered-empty | "No invoices match these filters." | "لا فواتير تطابق هذه المرشّحات." | Clear filters |
| S1 no-access | "These invoices belong to another workspace." | "هذه الفواتير تخصّ مساحة عمل أخرى." | Switch workspace |
| S2 empty draft (paper scaffold) | "An empty invoice. Add the first line item and the paper fills itself — figures, tax, words." | "فاتورة فارغة. أضف أول بند يمتلئ به المستند — الأرقام والضريبة والمبلغ كتابةً." | Add line item |
| S2 lines removed (back to empty) | "All line items removed. The number series and totals reset with the next line you add." | "أُزيلت كل البنود. تُعاد بنية الإجماليات مع أول بند تضيفه." | Re-add a line |
| S4 clients first-run | "No clients yet. The first one takes a name in one language or two — the tax number can wait for the scheme that needs it." | "لا عملاء بعد. الأول يحتاج اسماً بلغة واحدة أو اثنتين — ورقم التسجيل الضريبي يمكن انتظاره حتى يطلبه النطاق." | Add client |
| S4 clients filtered-empty | "No clients match these filters." | "لا عملاء تطابق هذه المرشّحات." | Clear filters |
| S5 seller profile incomplete | "Your letterhead is missing pieces. Schemes that require a tax number will say so at issue time." | "الترويسة ناقصة. النطاقات التي تشترط رقم التسجيل الضريبي ستقول ذلك عند الإصدار." | Complete profile |
| S6 series list (default only) | "One series is running. Add a second when your clients sort by currency or market." | "سلسلة ترقيم واحدة قيد الاستخدام. أضف ثانية حين تصنّف عملاؤك بالعملة أو السوق." | Add series |
| S7 jobs quiet | "Nothing running. Exports and deliveries appear here while they work." | "لا مهام قيد التنفيذ. تظهر التصديرات والتسليمات هنا أثناء عملها." | — |
| S8 activity first-run | "Nothing logged yet. Every issue, void, payment mark, and render change lands here." | "لا سجل بعد. كل إصدار وإبطال وتسجيل دفعة وتغيير عرض يُدوَّن هنا." | — |
| S3 marks empty (issued) | "No payment marks. This invoice reads unmarked until you record what actually arrived." | "لا تسجيلات دفع. تبقى الفاتورة غير مسدَّدة حتى تسجّل ما وصل فعلاً." | Record payment |
| S3 deliveries empty | "Not sent yet. Connect a delivery channel — or download and send it yourself; both are equal here." | "لم تُسلَّم بعد. اربط قناة تسليم — أو نزّلها وأرسلها بنفسك؛ كلاهما سواء هنا." | Send / Download |

## B. Loading (P02/P12 — skeletons mirror geometry per direction; honest progress)

| State | English | Arabic |
|---|---|---|
| S1 list skeleton | skeleton rows ×8 + "Loading your invoices…" (SR) | صفوف هيكلية + "جارٍ تحميل فواتيرك…" |
| Composer boot | two-pane skeleton (editor + paper) | هيكلية ذات وجهين (المحرّر والمستند) |
| Export job (determinate) | "Generating the PDF — sealing the render you chose." | "توليد ملف PDF — بختم العرض الذي اخترته." |
| Delivery job (milestones) | "Delivering the invoice — preparing document…" | "تسليم الفاتورة — تجري تهيئة المستند…" |
| Batch export (5 invoices) | "Exporting 2 of 5 invoices — each PDF is its own artifact." | "تصدير 2 من 5 فواتير — كل ملف PDF مستند مستقل." |
| Artifact fetch | "Fetching the artifact — it expires 24 Oct." | "جلب المستند — تنتهي صلاحيته في 24 أكتوبر." |
| Autosave (P10) | "Saving…" → "Saved" (fades) | "جارٍ الحفظ…" → "حُفظ" |
| S7 job row | determinate: "2 of 5"; indeterminate: "Working — no estimate yet" | "2 من 5" ؛ "قيد العمل — لا تقدير بعد" |

## C. Errors (7 classes; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (issue gate — client tax number) | "The Saudi Arabia scheme requires the client's tax number on the document. Add it to شركة الفنار التجارية, then issue." | "يشترط نطاق السعودية رقم التسجيل الضريبي للعميل على المستند. أضِفه إلى شركة الفنار التجارية ثم أصدر." |
| VALIDATION (issue gate — seller) | "Your letterhead has no tax number for this scheme. The gate will keep it open until you add one." | "ترويسة فواتيرك لا تحمل رقم تسجيل ضريبياً لهذا النطاق. تظل بوابة الإصدار مفتوحة حتى تضيفه." |
| VALIDATION (zero quantity) | "Line 3 has quantity zero. Fix the quantity or remove the line — nothing was issued." | "البند 3 كميته صفر. صحّح الكمية أو أزل البند — لم يُصدر شيء." |
| VALIDATION (bilingual field empty) | "A line description needs at least one language. English, Arabic, or both — never neither." | "يحتاج وصف البند لغةً واحدة على الأقل. الإنجليزية أو العربية أو كلتاهما — ولا خلوّ أبداً." |
| VALIDATION (payment currency mismatch) | "That mark is in AED but the invoice is in SAR. Record the mark in the invoice's currency — the paper stays single-currency." | "التسجيل بالدرهم والفاتورة بالريال. سجّل الدفعة بعملة الفاتورة — يبقى المستند بعملة واحدة." |
| VALIDATION (series prefix clash) | "That prefix is already in use. Series prefixes never collide — the sequence is the document's identity." | "هذه البادئة مستخدمة سلفاً. بادئات السلاسل لا تتصادم أبداً — التسلسل هو هوية المستند." |
| NOT_FOUND (stale invoice link) | "That invoice is gone from this workspace. It may have been deleted while you were away." | "تلك الفاتورة غابت عن مساحة العمل. ربما حُذفت أثناء غيابك." → العودة إلى الفواتير |
| NOT_FOUND (expired artifact) | "This export expired 3 days ago. Regenerate it — the invoice it came from is unchanged." | "انتهت صلاحية هذا التصدير قبل 3 أيام. أعد توليده — الفاتورة التي صدر عنها لم تتغيّر." |
| PERMISSION (delivery channel unconsented) | "Sending needs a document delivery channel granted to this workspace. Grant it — or download the PDF and send it yourself; downloading always works." | "يحتاج التسليم منح قناة تسليم مستندات لمساحة العمل. امنحها — أو نزّل الملف وأرسله بنفسك؛ التنزيل يعمل دائماً." |
| PERMISSION (viewer role) | "Your seat views and exports but doesn't compose here. Ask the workspace owner for an editor seat." | "مقعدك يعرض ويصدّر ولا يُنشئ هنا. اطلب من مالك مساحة العمل مقعداً محرّراً." |
| CONFLICT (concurrent draft edit) | "Reem saved a change to this invoice while you did. Both versions are kept side by side — choose what stays." | "حفظت ريم تغييراً في هذه الفاتورة أثناء عملك. الاحتفاظ بالنسختين جنباً إلى جنب — اختر ما يبقى." |
| CONFLICT (concurrent payment mark) | "Reem recorded a payment while you did. Both marks are kept — reconcile them here." | "سجّلت ريم دفعة أثناء عملك. الاحتفاظ بالتسجيلين — تسوِّهما هنا." |
| RATE_LIMIT (soft quota) | "This month's export window is used. Composing, issuing, and downloading stay unlimited — exports resume 1 Nov." | "استُهلكت نافذة التصدير لهذا الشهر. الإنشاء والإصدار والتنزيل بلا حدود — تستأنف التصديرات في 1 نوفمبر." |
| RATE_LIMIT (80% notice) | "Running near the send limit — 8 of 10 used. Downloads are unaffected." | "اقترب الاستخدام من حدّ التسليم — 8 من 10. التنزيلات غير متأثرة." |
| NETWORK (list fetch) | "The invoice list went stale — reconnecting. Nothing you issued is lost." | "تقادمت قائمة الفواتير — تجري إعادة الاتصال. لا شيء ممّا أصدرته ضائع." |
| NETWORK (artifact delivery) | "The download didn't complete — the connection dropped. Retry the same artifact; it's still valid until 24 Oct." | "لم يكتمل التنزيل — انقطع الاتصال. أعد محاولة المستند ذاته؛ ما زال صالحاً حتى 24 أكتوبر." |
| UNKNOWN | "Something failed on our side (ref igd-corr-0007). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع igd-corr-0007). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips, no confetti — money never celebrates, it settles)

| Moment | English | Arabic |
|---|---|---|
| Invoice issued | "Issued INV-2026-0007 — 18,227.50 SAR total. The content is frozen; the render stays yours." | "أُصدرت INV-2026-0007 — بإجمالي 18,227.50 ريالاً. المحتوى مجمَّد؛ والعرض يبقى لك." |
| Void completed | "Voided INV-2026-0002 — the number stays consumed, the sequence has no gaps. Reason logged." | "أُبطلت INV-2026-0002 — يبقى الرقم مستهلكاً والتسلسل بلا فجوات. السبب مسجَّل." |
| Payment mark recorded | "Marked 2,500.00 SAR — partially settled, 9,500.00 remaining." | "سُجّلت 2,500.00 ريالاً — تسديد جزئي، وتبقى 9,500.00." |
| Payment settled | "Settled — the marks sum to the total. The document reads closed." | "مسدَّدة — مجموع التسجيلات يبلغ الإجمالي. تُقرأ الفاتورة مغلقة." |
| Overpayment recorded | "Marks exceed the total by 250.00 SAR — recorded as overpayment, flagged, not reconciled." | "تتجاوز التسجيلات الإجمالي بـ 250.00 ريالاً — سُجّلت زيادةً موسومةً، دون تسوية." |
| Mark deleted (undo) | "Mark removed — Undo (7 seconds)" | "أُزيل التسجيل — تراجع (7 ثوانٍ)" |
| Delivery sent | "Sent through the document delivery channel — delivered to the client's contact on file." | "سُلِّمت عبر قناة تسليم المستندات — وصلت إلى جهة اتصال العميل المسجّلة." |
| Manual download | "Downloaded — your copy is yours; the artifact stays retrievable until 24 Oct." | "نُزِّلت — نسختك ملكك؛ ويبقى المستند قابلاً للاسترجاع حتى 24 أكتوبر." |
| Export ready | "Export ready — PDF, expires in 7 days." | "التصدير جاهز — PDF، تنتهي صلاحيته بعد 7 أيام." |
| Duplicate created | "Draft copied from INV-2026-0004 — no number until you issue." | "نُسخت مسودة من INV-2026-0004 — بلا رقم حتى الإصدار." |
| Sample cleared | "Sample cleared — it won't return. Your first real invoice starts here." | "مُسحت العيّنة — لن تعود. فاتورتك الأولى تبدأ هنا." |
| Series created | "Series EUR-2026- created — numbering starts at your first issue." | "أُنشئت سلسلة EUR-2026- — يبدأ الترقيم عند أول إصدار." |
| Scheme updated | "Bahrain scheme updated to 10% — drafts recompute; issued invoices keep their pinned totals." | "حُدِّث نطاق البحرين إلى 10٪ — المسودات تُعاد حسابها؛ والصادرة تحتفظ بإجمالياتها المثبّتة." |

## E. Signature & document moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| **Numeral flip (the signature)** | "Arabic-Indic numerals on — stored values unchanged." | "الأرقام العربية الهندية مفعّلة — القيم المخزنة دون تغيير." |
| Numeral flip (to Western) | "Western numerals on — same figures, different clothes." | "الأرقام الغربية مفعّلة — الأرقام ذاتها بثوب آخر." |
| Numeral toggle labels (specimen labels — the glyphs ARE the labels) | "Western 0-9" / "العربية الهندية ٠-٩" [document specimen glyphs in the AR label] | — |
| Amount-in-words rendered | "Amount in words: ثمانية عشر ألفًا ومئتان وسبعة وعشرون ريالًا سعوديًا وخمسون هللة — generated, deterministic, yours to verify." | "المبلغ كتابةً: ثمانية عشر ألفًا ومئتان وسبعة وعشرون ريالًا سعوديًا وخمسون هللة — مولَّد حتمياً، وتحقّقه عليك." |
| Tax breakdown reveal | "VAT 15% of a 15,850.00 SAR base — rounded half-up at 2 decimals." | "ضريبة القيمة المضافة 15٪ من أساس 15,850.00 ريالاً — تقريب نصف الأعلى عند منزلتين." |
| 3-decimal currency reveal | "BHD rounds at 3 decimals — 1.125 is a real amount here." | "الدينار البحريني يُقرَّب عند 3 منازل — 1.125 مبلغ حقيقي هنا." |
| Issue gate disclosure | "Issuing freezes the content and assigns INV-2026-0007 from the series. Render choices stay editable." | "الإصدار يجمّد المحتوى ويعيّن INV-2026-0007 من السلسلة. خيارات العرض تبقى قابلة للتغيير." |
| Void gate disclosure | "Voiding consumes the number — the sequence keeps no gaps. A reason is required and logged." | "الإبطال يستهلك الرقم — التسلسل بلا فجوات. السبب مطلوب ومسجَّل." |
| Render change on issued | "Render changed after issue — the stored document didn't; the next export carries this choice." | "تغيّر العرض بعد الإصدار — المستند المخزَّن لم يتغيّر؛ والتصدير القادم يحمل هذا الاختيار." |
| Hijri date line [document specimen] | "Issue date: 17 Oct 2026 — 5 Jumada I 1448 (Umm al-Qura display; stored Gregorian)." | "تاريخ الإصدار: 17 أكتوبر 2026 — 5 جمادى الأولى 1448 (عرض أم القرى؛ والمخزَّن ميلادي)." |
| Sample badge | "Sample — synthetic amounts, full pipeline. Clear it when real work arrives." | "عيّنة — مبالغ تركيبية وخط كامل. امسحها حين يصل العمل الحقيقي." |
| Overdue derived note | "Overdue is derived, not stored — 18 days past due at today's date." | "التأخير مشتق لا مخزَّن — 18 يوماً بعد الاستحقاق بتاريخ اليوم." |

## F. Bidi/mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Latin IBAN inside Arabic payment instructions | "SA03 8000 0000 6080 1016 7519 renders left-to-right inside the Arabic instructions — isolated, never force-flipped." | "يُعرض SA03 8000 0000 6080 1016 7519 من اليسار إلى اليمين داخل التعليمات العربية — معزولاً، ولا يُقلب قسراً." |
| Postal code inside Arabic address | "حي العليا، الرياض ١٢٢٤٤، السعودية — the postal code keeps its own direction inside the Arabic line [document specimen]." | "«حي العليا، الرياض ١٢٢٤٤، السعودية» — الرمز البريدي يحتفظ باتجاهه داخل السطر العربي [عيّنة مستند]." |
| Latin client name in Arabic document block | "Gulf Retail Group FZE renders LTR inside the Arabic seller/client block — isolated per field." | "تُعرض Gulf Retail Group FZE باتجاهها داخل الكتلة العربية — معزولة لكل حقل." |
| Arabic client name in EN chrome list | "بيت الأعمال للاستشارات renders right-to-left inside the English invoice list — isolated, never force-flipped." | "تُعرض بيت الأعمال للاستشارات من اليمين إلى اليسار ضمن القائمة الإنجليزية — معزولة ولا تُقلب قسراً." |
| Mixed line description | "EN-only descriptions sit in the bilingual table as single-script rows — the table never invents the missing side." | "الأوصاف الإنجليزية وحدها تجلس في الجدول الثنائي صفاً أحادي اللغة — لا يبتكر الجدول اللغة الغائبة." |
| Series number inside Arabic prose | "INV-2026-0007 keeps Latin digits and order inside Arabic sentences — isolated tokens." | "يحتفظ INV-2026-0007 بأرقامه وترتيبه اللاتيني داخل الجمل العربية — رموز معزولة." |
