# 11 — Empty / Loading / Error: inventory-count-assistant (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR · voice = floor-practical (02: names the number and the next move) · Arabic is فصحى بيضاء utility register · numerals Western everywhere (ledger row — data surface; never mixed systems mid-sentence, copy-voice §1.7) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked per 02: جلسة جرد=count session · الجرد الدوري=cycle count · الجرد الأعمى=blind count · الصنف=item · الكمية الدفترية=book quantity · فرق الجرد=variance · السماحية=tolerance · إعادة العدّ=recount · تسوية المخزون=adjustment · دقة سجلات المخزون=IRA · منطقة=zone · سياسة الجرد=count policy · تقرير الفروقات=variance report.

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| S1 sessions first-run | "No count sessions yet. Paste your item list and book quantities, then run the first cycle slice — or open the sample session and watch the blind reveal find a variance." | "لا جلسات جرد بعد. الصق قائمة أصنافك وكمياتك الدفترية ثم شغّل أول شريحة دورية — أو افتح جلسة العيّنة وشاهد الكشف الأعمى يجد فرقاً." | Open sample session / Go to catalog |
| S1 filtered-empty | "No sessions match these filters." | "لا جلسات تطابق هذه المرشّحات." | Clear filters |
| S1 no-access | "These sessions belong to another workspace." | "هذه الجلسات تخصّ مساحة عمل أخرى." | Switch workspace |
| S1 store IRA no-data | "No closed session for this store yet — accuracy reads after the first close." | "لا جلسة مغلقة لهذا المتجر بعد — تُقرأ الدقة بعد أول إغلاق." | Open latest session |
| S2 scope empty (no register rows) | "Nothing to count here — paste book quantities for this store first. Counting needs a baseline." | "لا ما يُعدّ هنا — الصق الكميات الدفترية لهذا المتجر أولاً. الجرد يحتاج خط أساس." | Paste book quantities |
| S2 proposal empty (nothing overdue) | "Nothing is overdue. The next count is due {date} — the cadence is doing its job." | "لا شيء متأخر. العدّ القادم في {تاريخ} — الإيقاع يؤدي عمله." | View cadence policy |
| S3 blind start | "Blind count — book quantities stay masked until you end counting. Count what you see." | "جرد أعمى — تبقى الكميات الدفترية مقنّعة حتى إنهاء العدّ. عُدّ ما تراه." | Start counting |
| S4 not yet revealed | "Counting is still open — variances appear when counting ends." | "العدّ ما زال مفتوحاً — تظهر الفروق عند انتهاء العدّ." | Back to count view |
| S4 gate clear (all resolved) | "Everything is resolved — 0 uncounted, 0 open decisions. Close and post the adjustments." | "كل شيء محسوم — 0 غير معدودة و0 قرارات مفتوحة. أغلق وانشر التسويات." | Close session |
| S6 catalog first-run | "No items yet. Paste your list — SKU, barcode, Arabic name, English name — one item per line." | "لا أصناف بعد. الصق قائمتك — SKU والباركود والاسم العربي والإنجليزي — صنف في كل سطر." | Paste items |
| S6 incomplete-labels filter returns none | "Every item carries both labels." | "كل صنف يحمل الاسمين." | Clear filter |
| S6 filtered-empty | "No items match these filters." | "لا أصناف تطابق هذه المرشّحات." | Clear filters |
| S7 register empty (store) | "No book quantities for this store. Paste them — the tolerance engine judges against this baseline." | "لا كميات دفترية لهذا المتجر. الصقها — محرك السماحية يحكم على هذا الخط الأساس." | Paste book quantities |
| S8 policies first-run | "These two policies cover most stores. Edit one when your tolerance differs." | "تغطي هاتان السياستان معظم المتاجر. حرّر إحداهما إن اختلفت سماحيتك." | Edit policy |
| S9 jobs empty | "Nothing running. Imports and exports appear here while they work." | "لا مهام قيد التنفيذ. تظهر الاستيرادات والتصديرات هنا أثناء عملها." | — |
| S9 variance history empty | "No variances recorded yet — the first reveal writes them here." | "لا فروق مسجّلة بعد — أول كشف يكتبها هنا." | Open sessions |
| S9 activity empty | "Nothing yet. Every consequential change lands here with its actor." | "لا شيء بعد. كل تغيير جوهري يصل هنا مع فاعله." | — |

## B. Loading (P02/P12 — skeletons mirror geometry per direction; honest progress)

| State | English | Arabic |
|---|---|---|
| S1 list skeleton | skeleton rows ×8 + "Loading your sessions…" (SR) | صفوف هيكلية + "جارٍ تحميل جلساتك…" |
| Catalog import job | "Importing row 120 of 400…" | "استيراد الصف 120 من 400…" |
| Stock import job | "Applying book quantities — 28 of 28 rows." | "تطبيق الكميات الدفترية — 28 من 28 صفاً." |
| Cadence proposal | "Reading the cadence…" | "قراءة الإيقاع…" |
| Reveal compute (large scopes) | "Computing variances…" | "حساب الفروقات…" |
| Report export job | "Bundling the variance report…" | "تجميع تقرير الفروقات…" |
| Offline queue | "Queued — 2 entries waiting for signal." | "في الانتظار — عدّان ينتظران الإشارة." |
| Autosave (P10) | "Saving…" → "Saved" (fades) | "جارٍ الحفظ…" → "حُفظ" |
| S9 job row | determinate: "120 of 400"; indeterminate: "Working — no estimate yet" | "120 من 400" ؛ "قيد العمل — لا تقدير بعد" |

## C. Errors (7 classes; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (malformed catalog row) | "Row 17 has no SKU — rows around it imported fine. Fix row 17 and import just it." | "السطر 17 بلا SKU — استُوردت الأسطر من حوله سليمة. صحّح السطر 17 واستورد وحده." |
| VALIDATION (finalize gate refusal) | "Close refused — 2 items uncounted and 3 variances undecided. Count KD-3002 and TX-8002, then resolve the rest." | "رُفض الإغلاق — صنفان غير معدودين و3 فروق بلا قرار. عُدّ KD-3002 وTX-8002 ثم احسم الباقي." |
| VALIDATION (resolution note required) | "Keep-book needs a reason — write why the count loses." | "الإبقاء الدفتري يحتاج سبباً — اكتب لماذا خسر العدّ." |
| VALIDATION (non-scope item) | "That item isn't in this session's scope — start a new session to count it." | "هذا الصنف ليس في نطاق هذه الجلسة — ابدأ جلسة جديدة لعدّه." |
| VALIDATION (invalid policy field) | "Percent tolerance can't be negative — −1 entered." | "لا تكون نسبة السماحية سالبة — أُدخلت −1." |
| VALIDATION (state-machine misuse) | "Counting ended for this session — entries are locked. Corrections live in the recount, not the row." | "انتهى العدّ لهذه الجلسة — الأعداد مقفلة. التصحيح يعيش في إعادة العدّ لا في السطر." |
| NOT_FOUND (stale session link) | "That session is gone from this workspace. It may have been cancelled while you were away." | "تلك الجلسة غابت عن مساحة العمل. ربما أُلغيت أثناء غيابك." |
| NOT_FOUND (expired artifact) | "This report expired 3 days ago. Regenerate it — the session it came from is unchanged." | "انتهت صلاحية هذا التقرير قبل 3 أيام. أعد توليده — الجلسة التي صدر عنها لم تتغيّر." |
| PERMISSION (stock-level channel unconsented) | "Syncing book quantities needs the stock-level channel granted to this workspace. Grant it — or paste the quantities; pasting always works." | "مزامنة الكميات الدفترية تتطلب منح قناة مستوى المخزون لمساحة العمل. امنحها — أو الصق الكميات؛ اللصق يعمل دائماً." |
| PERMISSION (viewer role) | "Your seat views and exports but doesn't count here. Ask the owner for a manager seat." | "مقعدك يعرض ويصدّر ولا يعدّ هنا. اطلب من المالك مقعداً إدارياً." |
| CONFLICT (concurrent entry) | "Sami submitted a count for this item while you edited. Both kept — choose what stands." | "أدخل سامي عدّاً لهذا الصنف أثناء تحريرك. الاحتفاظ بالاثنين — اختر ما يبقى." |
| CONFLICT (stale policy/catalog edit) | "This policy moved to version 3 while you edited. Both versions are kept side by side." | "انتقلت هذه السياسة إلى الإصدار 3 أثناء تحريرك. النسختان محفوظتان جنباً إلى جنب." |
| RATE_LIMIT (export window) | "This month's export window is used — 10 of 10. Counting and reconciling keep working; exports resume 1 Nov." | "استُهلكت نافذة التصدير لهذا الشهر — 10 من 10. الجرد والمطابقة يعملان؛ تستأنف التصديرات في 1 نوفمبر." |
| NETWORK (list fetch) | "The session list went stale — reconnecting. Every counted entry is safe." | "تقادمت قائمة الجلسات — تجري إعادة الاتصال. كل عدّ مقيد آمن." |
| NETWORK (queued flush interrupted) | "2 entries are still queued — the connection dropped mid-send. They resend on signal; nothing is lost." | "عدّان ما زالا في الانتظار — انقطع الاتصال أثناء الإرسال. يُعاد إرسالهما عند الإشارة؛ لا شيء ضائع." |
| UNKNOWN | "Something failed on our side (ref ica-corr-0007). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع ica-corr-0007). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips, no confetti)

| Moment | English | Arabic |
|---|---|---|
| Entry accepted | "Counted — 3 — 12 of 14." | "عُدّ — 3 — 12 من 14." |
| Entry correction saved | "Corrected — 12 → 11, revision 2 on record." | "صُحّح — 12 إلى 11، والمراجعة 2 مسجّلة." |
| Import done | "28 items in, 0 duplicates, 1 invalid row listed by name." | "دخل 28 صنفاً، و0 تكرارات، وسطر غير صالح واحد مدرج بالاسم." |
| Book quantities applied | "28 rows applied — the tolerance engine has its baseline." | "طُبّقت 28 صفاً — لمحرك السماحية خط أساسه." |
| Policy saved | "Policy saved at version 3 — running sessions keep the version they started with." | "حُفظت السياسة في الإصدار 3 — الجلسات الجارية تحتفظ بالإصدار الذي بدأت به." |
| Session opened | "Session open — 14 items, blind mode, 2 counters on the roster." | "الجلسة مفتوحة — 14 صنفاً، جرد أعمى، وعدّادان في الكشف." |
| Session closed | "Session closed — 1 adjustment posted, IRA 96.4%. The report is ready." | "أُغلقت الجلسة — نُشرت تسوية واحدة، والدقة 96.4%. التقرير جاهز." |
| Adjustment posted | "Adjustment posted — air fryer 14 → 7, reason on record." | "نُشرت التسوية — مقلاة هوائية 14 ← 7، والسبب مسجّل." |
| Export ready | "Variance report ready — expires in 30 days." | "تقرير الفروقات جاهز — تنتهي صلاحيته بعد 30 يوماً." |
| Undo window (P03, entry) | "Entry saved — Undo (7s)" | "حُفظ العدّ — تراجع (7 ثوانٍ)" |

## E. Signature moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| Blind reveal (the signature) | "The count is done. Now the book answers — 14 items, 9 within, 3 out, 2 uncounted." | "انتهى العدّ. الآن يجيب الدفتر — 14 صنفاً، 9 داخل، 3 خارج، 2 غير معدودة." |
| Blind masking (S3 companion) | "Book quantities are masked — the sheet shows what you count, not what the system claims." | "الكميات الدفترية مقنّعة — يعرض الكشف ما تعدّه لا ما يدّعيه النظام." |
| Within tolerance | "Within tolerance — the book stays. Tolerance is the deal you made with yourself: 2 units or 5%, whichever is wider." | "داخل السماحية — يبقى الدفتر. السماحية اتفاقك مع نفسك: وحدتان أو 5%، أيّهما أوسع." |
| Recount requested (auto) | "Recount requested — wireless earbuds counts 22 fewer than book, outside the band." | "طُلبت إعادة العدّ — سماعات لاسلكية أقل من الدفتر بـ22، خارج النطاق." |
| Recount confirms | "Recount confirms it — still outside tolerance. Your call: accept, keep book, or investigate." | "تؤكد إعادة العدّ — ما زال خارج السماحية. قرارك: القبول أو الإبقاء الدفتري أو التحقيق." |
| Resolution recorded | "Accepted the count — 7 stands, the book moves to 7. Reason on record." | "قُبل العدّ — 7 قائمة، وينتقل الدفتر إلى 7. السبب مسجّل." |
| Zero-book variance | "Book is 0 and the shelf has 3 — no percentage exists for this; the unit rule judges it." | "الدفتر 0 والرف فيه 3 — لا نسبة موجودة لهذا؛ تحكمه قاعدة الوحدات." |
| Late entry recorded | "Late entry recorded — 22 counted after the reveal, flagged forever." | "سُجل عدّ متأخر — 22 بعد الكشف، موسوم للأبد." |
| Cadence why-line | "A class · 30-day interval · 66 days since last count." | "فئة A · فاصل 30 يوماً · 66 يوماً منذ آخر عدّ." |
| IRA readout | "27 of 28 items within tolerance — 96.4%. The one that wasn't is on record with its reason." | "27 من 28 صنفاً داخل السماحية — 96.4%. والذي لم يكن كذلك مسجّل مع سببه." |
| Sample session badge | "Sample session — synthetic quantities. Clear it when real work arrives." | "جلسة عيّنة — كميات تركيبية. امسحها متى وصل العمل الحقيقي." |
| Channel-degraded register | "The stock-level channel is paused — its last verification failed on 12 Oct. Pasting keeps the book current by hand." | "قناة مستوى المخزون متوقفة — فشل تحقّقها الأخير في 12 أكتوبر. اللصق يُبقي الدفتر محدّثاً يدوياً." |

## F. Bidi/mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Latin barcode in Arabic sheet | "6281006000021 renders left-to-right inside the Arabic count sheet — isolated, never shuffled." | "يُعرض 6281006000021 من اليسار داخل كشف الجرد العربي — معزولاً، ولا يُعاد ترتيبه أبداً." |
| Mixed-script counter name | "أمل القحطاني / Amal Al-Qahtani — one roster entry, two scripts, both kept verbatim." | "أمل القحطاني / Amal Al-Qahtani — قيد واحد في كشف العدّادين، وخطّان، وكلاهما حرفياً." |
| Arabic-only item in English chrome | "'سجادة صلاة مخملية' renders right-to-left inside the English catalog — isolated, never force-flipped." | "تُعرض 'سجادة صلاة مخملية' من اليمين داخل الكتالوج الإنجليزي — معزولة، ولا تُقلب قسراً." |
| Eastern digits in a label | "'دلة قهوة ١٠٠٠ مل' keeps its Eastern digits in the Arabic label; every quantity cell stays Western — the two never mix in one sentence." | "تحتفظ 'دلة قهوة ١٠٠٠ مل' بأرقامها الشرقية في الاسم العربي؛ وتبقى كل خلية كمية بأرقام غربية — لا يختلط النظامان في جملة واحدة." |
| Signed delta direction | "−7 renders with its minus on the number, never on the row's edge — the sign follows the digits in both directions." | "يُعرض −7 مع سالبها على الرقم لا على حافة السطر — تتبع الإشارة الأرقام في الاتجاهين." |
