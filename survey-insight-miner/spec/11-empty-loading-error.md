# 11 — Empty / Loading / Error: survey-insight-miner (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR · voice = research-desk (02: measured, evidence-first, bilingual by reflex — states what the engine found, what it disclosed, and what the human decided) · Arabic is فصحى بيضاء · **numerals Western everywhere per ledger row** (data surface — never mixed systems mid-sentence) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked (02): مشروع=project · سؤال مفتوح=open-ended question · استجابة=response · محور=theme · تجميع بحسب تكرار الكلمات=keyword-frequency grouping · اقتباس=quote · تثبيت الاقتباس=pin quote · تغطية=coverage · جدول متقاطع=crosstab · تعيين=assign · دمج=merge · اعتماد=confirm · اكتشاف اللغة=language detection · نبرة=tone · لهجة=dialect · فصحى=MSA · تصدير=export · تشغيل=run · بوابة الاعتماد=confirm gate.

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| S1 projects home first-run | "No projects yet. Paste a response block from your last survey — or open the sample and watch a proposal pass the confirm gate." | "لا مشاريع بعد. الصق كتلة استجابات من استبيانك الأخير — أو افتح العيّنة وشاهد مقترحاً يعبر بوابة الاعتماد." | New project / Open sample project |
| S1 filtered-empty | "No projects match these filters." | "لا مشاريع تطابق هذه المرشّحات." | Clear filters |
| S1 no-access | "These projects belong to another workspace." | "هذه المشاريع تخصّ مساحة عمل أخرى." | Switch workspace |
| S2 project with no questions | "This project holds no questions yet. Paste your first open-ended question with its responses — respondent ref, response text, metadata." | "لا يحمل هذا المشروع أسئلة بعد. الصق سؤالك المفتوح الأول مع استجاباته — مرجع المجيب، نص الاستجابة، البيانات الوصفية." | Import responses |
| S2 question with only empty texts | "All 40 responses in this question arrived empty — detection and grouping have nothing to read. Check the export you pasted." | "وصلت كل الاستجابات الأربعين في هذا السؤال فارغة — لا ما يقرأه الاكتشاف ولا التجميع. راجع التصدير الذي لصقته." | Re-import this question |
| S3 board, run never run | "No themes yet — the clustering hasn't run on this question. One run groups the responses by keyword frequency and lays out the board." | "لا محاور بعد — لم يُشغَّل التجميع على هذا السؤال. تشغيل واحد يجمع الاستجابات بحسب تكرار الكلمات ويبسط اللوحة." | Run keyword grouping |
| S3 board, no model capability bound | "The keyword floor is the whole engine here — no clustering capability is bound. Everything on this board is deterministic and disclosed." | "أرضية الكلمات المفتاحية هي المحرك كله هنا — لا قدرة تجميع مربوطة. كل شيء على هذه اللوحة حتمي ومُفصح عنه." | View how this was computed |
| S3 filtered-empty | "No themes match these filters." | "لا محاور تطابق هذه المرشّحات." | Clear filters |
| S4 theme with no members | "This theme holds no members — its keyword left the top-12. Merge it into a living theme or delete it; it never vanishes on its own." | "لا يحمل هذا المحور أعضاء — خرجت كلمته المفتاحية من أفضل 12. ادمجه بمحور حيّ أو احذفه؛ وهو لا يختفي من تلقاء نفسه أبداً." | Merge or delete |
| S4 theme with members, no quotes | "No quotes yet — quotes are selected by rule the moment a theme holds members." | "لا اقتباسات بعد — تُختار الاقتباسات بقاعدة لحظة يحمل المحور أعضاء." | — |
| S5 reader filtered-empty | "No responses match these filters. Every response stays in the question — clear the filters to see them." | "لا استجابات تطابق هذه المرشّحات. كل الاستجابات باقية في السؤال — امسح المرشّحات لرؤيتها." | Clear filters |
| S5 unassigned tail, empty | "Nothing unassigned — every non-empty response carries a theme." | "لا شيء غير معيَّن — كل استجابة غير فارغة تحمل محوراً." | View board |
| S5 reader search, no results | "No responses match this search. The search normalizes alef and hamza forms, taa marbuta, and yaa — the rules it applied are listed beside the field." | "لا استجابات تطابق هذا البحث. يطبّع البحث صور الألف والهمزة والتاء المربوطة والياء — والقواعد المطبقة مدرجة بجوار الحقل." | Clear search |
| S6 coverage, run never run | "Coverage reads themes — run the clustering first." | "التغطية تقرأ المحاور — شغّل التجميع أولاً." | Run keyword grouping |
| S8 jobs empty | "Nothing running. Imports, clustering runs, and exports appear here while they work." | "لا مهام قيد التنفيذ. الاستيرادات وتشغيلات التجميع والتصديرات تظهر هنا أثناء عملها." | — |
| S9 activity empty | "No activity yet — every confirm, rename, merge, assign, and pin lands here with its actor." | "لا نشاط بعد — كل اعتماد وإعادة تسمية ودمج وتعيين وتثبيت يهبط هنا مع فاعله." | — |
| Sample project badge | "Sample project — a pending proposal, a merge pair, and an unassigned tail of 9. Clear it whenever real work arrives." | "مشروع عيّنة — مقترح قيد البوابة، وزوج دمج، وذيل غير معيَّن من 9. امسحه متى وصل العمل الحقيقي." | Clear sample |

## B. Loading (P02/P12 — skeletons mirror board/reader geometry per direction; honest determinate progress)

| State | English | Arabic |
|---|---|---|
| S1 list skeleton | skeleton rows ×8 + "Loading your projects…" (SR) | صفوف هيكلية + "جارٍ تحميل مشاريعك…" |
| Board boot | card-grid skeleton with reserved quote-wall rows | هيكلية شبكة بطاقات مع صفوف اقتباسات محجوزة |
| Import job (determinate) | "Importing 180 of 300 responses — empty texts are kept and counted." | "استيراد 180 من 300 استجابة — النصوص الفارغة تُحفظ وتُعدّ." |
| Intake detection (live) | "Detecting language and tone row by row…" | "اكتشاف اللغة والنبرة صفاً صفاً…" |
| Clustering run (staged) | "Grouping 240 of 300 responses — themes reach the board as their keywords close." | "تجميع 240 من 300 استجابة — المحاور تصل اللوحة كلما اكتملت كلماتها المفتاحية." |
| Model-proposal phase | "Requesting theme proposals — the keyword floor is already on the board; proposals confirm nothing by themselves." | "طلب مقترحات المحاور — أرضية الكلمات المفتاحية على اللوحة أصلاً؛ والمقترحات لا تعتمد شيئاً بنفسها." |
| Derived recompute | "Updating coverage…" (≤120ms — usually invisible) | "تحديث التغطية…" |
| Confirm-gate open | "Re-evaluating the proposal's members…" (≤200ms — truth at open) | "إعادة تقييم أعضاء المقترح…" |
| Theme-label autosave (P10) | "Saving…" → "Saved" (fades after 3s) | "جارٍ الحفظ…" → "حُفظ" |
| Export job | "Packaging the analysis — theme report and coded dataset." | "تجميع التحليل — تقرير المحاور ومجموعة البيانات المرمّزة." |
| Crosstab compute | (derived read — updates within 120ms, no spinner) | (قراءة مشتقة — تتحدث خلال 120 مللي ثانية، بلا مؤشر دوران) |

## C. Errors (7 classes; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (import bad row) | "Row 17 is malformed — it needs at least a respondent ref and a response. Rows 1–16 imported; fix row 17 and import it alone." | "السطر 17 معطوب — يحتاج مرجع مجيب واستجابة على الأقل. استُوردت السطور 1–16؛ صحّح السطر 17 واستورده وحده." |
| VALIDATION (theme label collision) | "A theme named 'السعر' already exists in this question — one label per language per question. Rename this one before saving." | "محور باسم 'السعر' موجود في هذا السؤال — تسمية واحدة لكل لغة لكل سؤال. أعد تسمية هذا قبل الحفظ." |
| VALIDATION (crosstab before run) | "No themes to cross yet — run the grouping first, then slice by city or channel." | "لا محاور للجدولة بعد — شغّل التجميع أولاً، ثم قطّع بحسب المدينة أو القناة." |
| VALIDATION (export nothing confirmed) | "Nothing confirmed to report — confirm or curate themes first, or include proposals explicitly." | "لا شيء معتمد للتصدير — اعتمد المحاور أو هذّبها أولاً، أو أدرج المقترحات صراحةً." |
| VALIDATION (merge across questions) | "These two themes belong to different questions — themes merge within one question at v1." | "هذان المحوران يعودان لسؤالين مختلفين — الدمج داخل سؤال واحد في الإصدار الأول." |
| VALIDATION (override on empty) | "An empty response has no language class to override — its text is blank." | "الاستجابة الفارغة لا صنف لغة له لتجاوزه — نصها فارغ." |
| VALIDATION (pin a non-member) | "This response isn't a member of the theme — assign it first; a quote must be evidence." | "هذه الاستجابة ليست عضواً في المحور — عيّنها أولاً؛ يجب أن يكون الاقتباس دليلاً." |
| NOT_FOUND (stale link) | "That project, question, response, or theme is gone from this workspace. It may have been deleted while you were away." | "ذلك المشروع أو السؤال أو الاستجابة أو المحور غاب عن مساحة العمل. ربما حُذف أثناء غيابك." → العودة إلى المشاريع |
| NOT_FOUND (merged-away theme) | "This theme was merged — its members live in 'التسعير والقيمة'. Open the survivor." | "دُمج هذا المحور — أعضاؤه في 'التسعير والقيمة'. افتح الباقي." |
| NOT_FOUND (expired artifact) | "This export expired 3 days ago. Regenerate it — the analysis it came from is unchanged." | "انتهت صلاحية هذا التصدير قبل 3 أيام. أعد توليده — التحليل الذي صدر عنه لم يتغيّر." |
| PERMISSION (clustering capability unconsented) | "Theme proposals need the response-clustering capability granted to this workspace. Grant it — or run the keyword floor; the floor always works and never waits on a meter." | "تحتاج مقترحات المحاور إلى منح قدرة تجميع الاستجابات لمساحة العمل هذه. امنحها — أو شغّل أرضية الكلمات المفتاحية؛ الأرضية تعمل دائماً ولا تنتظر عدّاداً أبداً." |
| PERMISSION (viewer role) | "Your seat reads and slices but doesn't curate here. Ask the workspace owner for a researcher seat." | "مقعدك يقرأ ويقطّع ولا يهذّب هنا. اطلب من مالك مساحة العمل مقعد باحث." |
| CONFLICT (concurrent theme edit) | "Dana saved a change to this theme while you edited. Both versions are kept side by side." | "حفظت دانا تغييراً في هذا المحور أثناء تحريرك. النسختان محفوظتان جنباً إلى جنب." |
| CONFLICT (confirm on dismissed proposal) | "This proposal was already dismissed — re-running generates fresh proposals with fresh evidence." | "رُفض هذا المقترح سابقاً — إعادة التشغيل تولّد مقترحات جديدة بأدلة جديدة." |
| CONFLICT (bulk count drift) | "The set changed since you counted it — it is 22 responses now, not 23. Recount and confirm." | "تغيّرت المجموعة منذ عدّها — إنها 22 استجابة الآن، لا 23. أعد العد وأكّد." |
| RATE_LIMIT (model-run quota) | "This month's proposal window is used. The keyword floor keeps running without limit — proposals resume 1 Nov." | "استُهلكت نافذة المقترحات لهذا الشهر. أرضية الكلمات المفتاحية تستمر بلا حد — تستأنف المقترحات في 1 نوفمبر." |
| RATE_LIMIT (export quota) | "The export window is used for this cycle — the next package frees up on 1 Nov. Nothing about your analysis changes." | "استُهلكت نافذة التصدير لهذه الدورة — تتحرر الحزمة التالية في 1 نوفمبر. لا شيء في تحليلك يتغيّر." |
| NETWORK (list fetch) | "The response list went stale — reconnecting. Every assignment you made is safe." | "تقادمت قائمة الاستجابات — تجري إعادة الاتصال. كل تعيين اتخذته آمن." |
| NETWORK (proposal stream mid-run) | "The proposal stream dropped at member 14 — this run completes as keyword-floor only, and the result says so. Retry proposals for the unconfirmed groups alone." | "انقطع تدفق المقترحات عند العضو 14 — يكتمل هذا التشغيل بأرضية الكلمات المفتاحية وحدها، والنتيجة تقول ذلك. أعد طلب المقترحات للمجموعات غير المعتمدة وحدها." |
| NETWORK (export partial) | "The package delivered 1 of 2 parts — the theme report arrived, the coded dataset didn't. Retry just the dataset." | "سلّمت الحزمة 1 من جزأين — وصل تقرير المحاور، ولم تصل مجموعة البيانات المرمّزة. أعد محاولة المجموعة وحدها." |
| UNKNOWN | "Something failed on our side (ref sim-corr-0001). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع sim-corr-0001). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips + counts, no confetti)

| Moment | English | Arabic |
|---|---|---|
| Import done | "300 responses in — 20 empty texts kept and counted, 1 invalid row skipped and named." | "دخلت 300 استجابة — 20 نصاً فارغاً حُفظت وعُدّت، وسطر غير صالح واحد تُخطي وسُمّي." |
| Detection done (import) | "Language mix: 214 فصحى, 47 dialect-leaning, 19 mixed-script, 20 empty — every class names its markers." | "خليط اللغة: 214 فصحى، و47 بميل لهجي، و19 نصاً مختلطاً، و20 فارغة — كل صنف يسمّي علاماته." |
| Floor run done | "Keyword grouping complete — 12 themes, 239 of 280 responses assigned, 41 unassigned." | "اكتمل تجميع الكلمات المفتاحية — 12 محوراً، وعُيّنت 239 من 280 استجابة، و41 بلا تعيين." |
| Model-assisted run done | "1 proposal awaits your gate — proposals confirm nothing by themselves." | "مقترح واحد ينتظر بوابتك — المقترحات لا تعتمد شيئاً بنفسها." |
| Theme confirmed | "Confirmed — 'الشحن وتأخير التوصيل' carries 93 responses. Your name is on the record." | "اعتُمد — 'الشحن وتأخير التوصيل' يحمل 93 استجابة. اسمك على السجل." |
| Proposal rejected | "Proposal dismissed — your reason is recorded. Re-running regenerates fresh proposals." | "رُفض المقترح — سببك مسجَّل. إعادة التشغيل تولّد مقترحات جديدة." |
| Themes merged | "Merged 31 + 45 responses into 'التسعير والقيمة' — 81 responses, union verified, pins carried over." | "دُمجت 31 + 45 استجابة في 'التسعير والقيمة' — 81 استجابة، الاتحاد مُتحقق منه، والتثبيتات انتقلت." |
| Theme renamed | "Theme renamed at version 3 — exports pin the version they came from." | "أُعيدت تسمية المحور في الإصدار 3 — التصديرات تثبّت الإصدار الذي صدرت عنه." |
| Theme deleted | "Theme deleted — its 18 members are unassigned now, each one visible in the reader." | "حُذف المحور — أعضاؤه الـ18 غير معيَّنين الآن، كل واحد ظاهر في القارئ." |
| Response assigned | "Assigned to 'الشحن وتأخير التوصيل' — 240 of 280 assigned." | "عُيّنت إلى 'الشحن وتأخير التوصيل' — عُيّنت 240 من 280." |
| Response unassigned | "Unassigned — the response stays in the question, visible in the unassigned tail." | "أُلغي التعيين — تبقى الاستجابة في السؤال، ظاهرة في الذيل غير المعيَّن." |
| Bulk assigned | "23 responses assigned — every one matched the counted filter exactly." | "عُيّنت 23 استجابة — كل واحدة طابقت المرشِّح المعدود تماماً." |
| Quote pinned | "Quote pinned by Dana — it sits above the rule-selected quotes, in the wall and the export." | "ثبّتت دانا الاقتباس — يجلس فوق الاقتباسات المختارة بالقاعدة، في الجدار وفي التصدير." |
| Quote unpinned | "Unpinned — the rule's list is restored exactly as computed." | "أُلغي التثبيت — قائمة القاعدة عادت كما حُسبت تماماً." |
| Language override recorded | "Class overridden to فصحى by Dana — the rule's markers stay listed beside it." | "تجاوزت دانا الصنف إلى الفصحى — علامات القاعدة تبقى مدرجة بجانبه." |
| Coverage updated (derived) | "Coverage: 239 assigned, 41 unassigned, 17 in multiple themes." | "التغطية: 239 معيَّنة، و41 غير معيَّنة، و17 في محاور متعددة." |
| Export ready | "Analysis package ready — theme report and coded dataset. Expires in 7 days; regenerable forever." | "حزمة التحليل جاهزة — تقرير المحاور ومجموعة البيانات المرمّزة. تنتهي بعد 7 أيام؛ وتُعاد توليدها دائماً." |
| Coded dataset note | "The dataset carries unassigned responses as unassigned — 41 rows say so. That is the countable truth." | "تحمل مجموعة البيانات الاستجابات غير المعيَّنة كما هي — 41 سطراً تقول ذلك. هذه هي الحقيقة القابلة للعدّ." |
| Artifact regenerated | "Package regenerated — identical to the state it came from. That is what deterministic means here." | "أُعيد توليد الحزمة — مطابقة للحالة التي صدرت عنها. هذا معنى الحتمية هنا." |

## E. Signature moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| The Ink Sets (theme confirmed — the T2 signature, 05) | "The ink sets — 'الشحن وتأخير التوصيل' is confirmed, 93 responses, one seal, your name on the record." | "يجثم الحبر — 'الشحن وتأخير التوصيل' معتمد، 93 استجابة، ختم واحد، واسمك على السجل." |
| The floor disclosed | "This board is the keyword floor — normalization, stopwords, and thresholds are one click away, and they always were." | "هذه اللوحة أرضية الكلمات المفتاحية — التطبيع والكلمات الوظيفية والعتبات على بعد نقرة، وكانت دائماً كذلك." |
| Coverage honesty | "17 responses carry multiple themes — shares sum past 100% because the truth does." | "17 استجابة تحمل محاور متعددة — الحصص تجتاز 100% لأن الحقيقة تجتازها." |
| The gate names its exclusions | "The gate would exclude 3 members below the evidence floor — it says so before you confirm anything." | "ستستبعد البوابة 3 أعضاء تحت أرضية الدليل — تقول ذلك قبل أن تعتمد أي شيء." |
| Quote rationale printed | "Ranked 1 of 3 — 6 theme keywords, 14 words. The rule is printed beside every quote it selects." | "المرتبة 1 من 3 — 6 كلمات مفتاحية للمحور، و14 كلمة. القاعدة مطبوعة بجانب كل اقتباس تختاره." |
| Dialect preserved | "'اللي جاني كان بس يبي' stays exactly as typed — detection disclosed, never normalized." | "يبقى 'اللي جاني كان بس يبي' كما كُتب تماماً — الاكتشاف مُفصح عنه، ولا تطبيع أبداً." |
| Determinism note (re-run) | "Re-ran the floor — same 300 responses in, same 12 themes out." | "أُعيد تشغيل الأرضية — الاستجابات الـ300 ذاتها دخولاً، والمحاور الـ12 ذاتها خروجاً." |
| Sample value moment | "A proposal, a gate, and a dialect quote that survives it — that is the whole product in one sitting." | "مقترح، وبوابة، واقتباس لهجي ينجو منها — هذا المنتج كله في جلسة واحدة." |

## F. Bidi / mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Latin token inside Arabic verbatim | "The Latin token 'Shippo' renders left-to-right inside the right-to-left verbatim — isolated, punctuation stays put." | "يُعرض الرمز اللاتيني 'Shippo' من اليسار إلى اليمين داخل الاستجابة التي تجري من اليمين إلى اليسار — معزولاً، ويبقى الترقيم في مكانه." |
| Bilingual theme label pair in en-primary chrome | "The Arabic label renders right-to-left beside its English pair — each slot at its own direction, never one mirrored afterthought." | "تُعرض التسمية العربية من اليمين إلى اليسار بجوار نظيرتها الإنجليزية — كل خانة باتجاهها، ولا واحدة منها استطراداً معكوساً." |
| Number order in both directions | "Counts and respondent refs keep one physical order in both directions — 239 is 239 in either chrome." | "تحافظ الأعداد ومراجع المجيبين على ترتيب فيزيائي واحد في الاتجاهين — 239 هي 239 في أي هيكل." |
