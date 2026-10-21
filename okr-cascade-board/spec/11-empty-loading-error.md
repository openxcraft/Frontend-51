# 11 — Empty / Loading / Error: okr-cascade-board (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR (bilingual-en product — both locales carried because the workspace flips; 05 direction model) · voice = operator-plain (02: states what the cadence shows and what it does not) · Arabic is فصحى بيضاء utility register · numerals Western everywhere (ledger row — never mixed systems mid-sentence) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked: الهدف=objective · النتيجة الرئيسية=key result · دورة الأهداف=cycle · تحديث التقدم=check-in · مستوى الثقة=confidence · العائق=blocker · تسلسل الأهداف=cascade · المواءمة=alignment · درجة الإنجاز=grade · الفترة=period · مساعد الصياغة=drafting assist. Vocabulary boundary (LOOP-10): no HR-appraisal terms in either locale — the product grades objectives, never people.

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| S1 cycles first-run | "No cycles yet. Create the quarter's cycle — or open the sample and watch a check-in land on the cascade." | "لا دورات بعد. أنشئ دورة الربع — أو افتح العيّنة وشاهد تحديث تقدم يهبط على التسلسل." | Create cycle / Open sample cycle |
| S1 filtered-empty | "No cycles match these filters." | "لا دورات تطابق هذه المرشّحات." | Clear filters |
| S1 no-access | "This workspace's cycles are not visible to your seat." | "دورات مساحة العمل هذه غير مرئية لمقعدك." | Switch workspace |
| S2 board empty (new cycle) | "This cycle has no objectives yet. Start at the company tier — one bilingual objective is enough to begin." | "لا أهداف في هذه الدورة بعد. ابدأ من مستوى الشركة — هدف ثنائي اللغة واحد يكفي للبداية." | Add company objective |
| S2 filtered-empty | "No objectives match this filter." | "لا أهداف تطابق هذا المرشّح." | Clear filters |
| S2 no-access (other team's lane) | "This team's objectives are read-only to your seat." | "أهداف هذا الفريق للقراءة فقط لمقعدك." | View as read-only |
| S3 key results empty | "No key results yet. An objective needs 3–5 measurable ones — the lint checks each pair as you type." | "لا نتائج رئيسية بعد. يحتاج الهدف إلى 3–5 نتائج قابلة للقياس — والفاحص يراجع كل زوج أثناء الكتابة." | Add key result |
| S3 assist proposals empty (unbound) | "The drafting assist is not connected. Write the pair yourself — the lint stays on." | "مساعد الصياغة غير متصل. اكتب الزوج بنفسك — والفاحص يعمل دائماً." | Write the pair |
| S4 desk — none due | "Nothing due from you this period. Your next check-in opens {date}." | "لا شيء مستحق منك في هذه الفترة. يفتح تحديثك التالي في {تاريخ}." | View my key results |
| S4 desk — no owned KRs | "You own no key results. Leads assign them when objectives are authored." | "لا تملك نتائج رئيسية. يعيّنها القادة عند صياغة الأهداف." | — |
| S5 coverage — cycle has no KRs | "No key results in this cycle yet — the coverage grid fills as they're added." | "لا نتائج رئيسية في هذه الدورة بعد — تكتمل شبكة التغطية مع إضافتها." | Go to the board |
| S5 blockers none | "No open blockers. The digest lists them the moment an owner names one." | "لا عوائق مفتوحة. يدرجها الملخّص لحظة تسمية مالكها لها." | — |
| S6 grade sheet not computed | "No grade sheet yet. Grading runs at cycle close — from submitted values only." | "لا ورقة درجات بعد. تُحسب الدرجات عند إقفال الدورة — من القيم المُسلَّمة فقط." | Start the close gate |
| S7 jobs empty | "Nothing running. Drafting runs and exports appear here while they work." | "لا مهام قيد التنفيذ. تشغيلات الصياغة والتصديرات تظهر هنا أثناء عملها." | — |
| S8 activity empty | "No recorded actions yet. Every consequential change lands here with its actor and time." | "لا إجراءات مسجّلة بعد. كل تغيير جوهري يصل هنا مع فاعله ووقته." | — |
| S9 usage — assist unbound | "The drafting assist is not connected, so nothing is metered. The editor and lint are unlimited." | "مساعد الصياغة غير متصل، فلا شيء يُقاس. المحرّر والفاحص بلا حدود." | Connect capability |

## B. Loading (P02/P12 — skeletons mirror geometry per direction; honest progress)

| State | English | Arabic |
|---|---|---|
| S1 list skeleton | skeleton rows ×8 + "Loading your cycles…" (SR) | صفوف هيكلية + "جارٍ تحميل دوراتك…" |
| S2 board skeleton | tier/lane skeleton per direction + "Loading the cascade…" | هيكلية المستويات والمسارات + "جارٍ تحميل التسلسل…" |
| S4 desk boot | queue skeleton ×3 + "Loading your due check-ins…" | هيكلية قائمة + "جارٍ تحميل تحديثاتك المستحقة…" |
| S5 grid skeleton | period headers + row strips (direction-aware) | رؤوس الفترات وصفوف مبدئية حسب الاتجاه |
| Draft job (determinate) | "Drafting proposals — chunk 4 of 6." | "صياغة المقترحات — الجزء 4 من 6." |
| Draft stream partial | "Still drafting — 4 of 6 chunks in. Stop keeps what's arrived, marked partial." | "ما زالت الصياغة جارية — وصل 4 من 6 أجزاء. الإيقاف يحفظ الواصل موسوماً جزئياً." |
| Export job | "Bundling the cycle package — check-in history, grade sheet, activity appendix." | "تجميع حزمة الدورة — سجل تحديثات التقدم وورقة الدرجات وملحق النشاط." |
| Grading compute (large cycles) | "Computing grades — 180 key results, submitted values only." | "حساب الدرجات — 180 نتيجة رئيسية، من القيم المُسلَّمة فقط." |
| Autosave (P10) | "Saving…" → "Saved" (fades) | "جارٍ الحفظ…" → "حُفظ" |
| S7 job row | determinate: "4 of 6"; indeterminate: "Working — no estimate yet" | "4 من 6" ؛ "قيد العمل — لا تقدير بعد" |

## C. Errors (7 classes; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (cycle dates) | "The cycle can't end before it starts. Fix the end date — the period grid previews as you type." | "لا يمكن أن تنتهي الدورة قبل أن تبدأ. صحّح تاريخ النهاية — تُعاين شبكة الفترات أثناء الكتابة." |
| VALIDATION (anchor weekday) | "Weekly cadence with Monday due days needs cycles that start on a Monday. Shift the start date or the due day." | "الإيقاع الأسبوعي بمواعيد الاثنين يتطلب دورات تبدأ يوم الاثنين. غيّر تاريخ البدء أو يوم الاستحقاق." |
| VALIDATION (metric span) | "A key result's target can't equal its baseline — progress would be undefined. Name a real delta." | "لا يمكن أن يساوي هدف النتيجة الرئيسية خط أساسها — سيصبح التقدم غير معرّف. حدّد فارقاً حقيقياً." |
| VALIDATION (empty check-in value) | "The check-in needs your current value — the number you know, not a percent guess. Enter it and submit." | "يحتاج تحديث التقدم قيمتك الحالية — الرقم الذي تعرفه لا تخميناً بالنسب. أدخله ثم سلّم." |
| VALIDATION (state gates) | "Grading runs on a cycle in its grading state — activate first. Current state: {state}." | "يُحسب التقدير في دورة بحالة التقدير — نشّطها أولاً. الحالة الحالية: {الحالة}." |
| VALIDATION (required reason) | "Archiving needs a reason — it's the line the activity log keeps forever." | "الأرشفة تحتاج سبباً — فهو السطر الذي يحفظه سجل النشاط دائماً." |
| VALIDATION (export state) | "Exports run on closed or grading cycles — this one is still {state}." | "التصدير يعمل على الدورات المقفلة أو في التقدير — هذه ما تزال {الحالة}." |
| VALIDATION (cadence unconfirmed) | "A cadence change re-derives every period. Confirm the migration first — it names what moves." | "تغيير الإيقاع يعيد اشتقاق كل فترة. أكّد الترحيل أولاً — فهو يسمّي ما يتحرك." |
| NOT_FOUND (stale link) | "That cycle, objective, or key result is gone from this workspace. It may have been archived while you were away." | "تلك الدورة أو الهدف أو النتيجة غابت عن مساحة العمل. ربما أُرشفت أثناء غيابك." → العودة إلى الدورات |
| NOT_FOUND (expired artifact) | "This export expired 3 days ago. Regenerate it — the closed cycle it came from hasn't changed." | "انتهت صلاحية هذا التصدير قبل 3 أيام. أعد توليده — الدورة المقفلة التي صدر عنها لم تتغيّر." |
| NOT_FOUND (expired proposal) | "This drafting proposal expired unattended on 26 Oct. Request it again — your focus brief was kept." | "انتهت صلاحية مقترح الصياغة هذا دون مراجعة في 26 أكتوبر. اطلبه مجدداً — حُفظ موجز تركيزك." |
| PERMISSION (assist unconsented) | "Drafting proposals need the drafting-assist capability granted to this workspace. Grant it — or write the pair yourself; the editor and lint always work." | "صياغة المقترحات تتطلب منح قدرة مساعد الصياغة لمساحة العمل. امنحها — أو اكتب الزوج بنفسك؛ المحرّر والفاحص يعملان دائماً." |
| PERMISSION (role boundary) | "Company objectives are authored by workspace admins. Ask yours — or add a team objective under an existing one." | "أهداف الشركة يصوغها مديرو مساحة العمل. اطلب منهم — أو أضف هدفاً للفريق تحت هدف قائم." |
| PERMISSION (other team) | "Your seat reads this team's objectives but doesn't edit them." | "مقعدك يقرأ أهداف هذا الفريق ولا يحرّرها." |
| CONFLICT (concurrent edit) | "Noura saved a change here while you did. Both versions are kept side by side — choose what stays." | "حفظت نورة تغييراً هنا أثناء عملك. النسختان محفوظتان جنباً إلى جنب — اختر ما يبقى." |
| CONFLICT (stale check-in) | "This check-in moved while you edited it — a correction may have landed. Reopen it from the history; both revisions are kept." | "تحرّك تحديث التقدم هذا أثناء تحريرك — ربما ورد تصحيح. أعد فتحه من السجل؛ كلا المراجعتين محفوظة." |
| RATE_LIMIT (assist quota) | "This month's drafting window is used. The editor and lint keep working unlimited — drafting resumes 1 Nov." | "استُهلكت نافذة الصياغة لهذا الشهر. المحرّر والفاحص يعملان بلا حدود — تستأنف الصياغة في 1 نوفمبر." |
| RATE_LIMIT (rung 2 notice) | "Running near the drafting limit — proposals will thin out until 1 Nov." | "اقترب الاستخدام من حدّ الصياغة — ستقلّ المقترحات حتى 1 نوفمبر." |
| NETWORK (list fetch) | "The cascade went stale — reconnecting. Nothing you submitted is lost." | "تقادم التسلسل — تجري إعادة الاتصال. لا شيء ممّا سلّمته ضائع." |
| NETWORK (queued submit) | "You're offline — this check-in is queued with your value and confidence. It submits when you're back; cancel it any time before." | "أنت غير متصل — هذا التحديث في قائمة الانتظار بقيمتك ومستوى ثقتك. يُسلَّم عند عودتك؛ ألغِه قبلها متى شئت." |
| NETWORK (export partial) | "The package delivered without the activity appendix — the cascade and grade sheet arrived. Retry just the appendix." | "وصلت الحزمة دون ملحق النشاط — وصل التسلسل وورقة الدرجات. أعد محاولة الملحق وحده." |
| UNKNOWN | "Something failed on our side (ref okb-corr-0001). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع okb-corr-0001). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; the Settle is the only celebration)

| Moment | English | Arabic |
|---|---|---|
| Check-in submitted (the Settle) | "Checkout conversion 2.3 of 3.0 — 22% · objective 30% · cascade 3 of 9 moved." | "تحويل إتمام الشراء 2.3 من 3.0 — 22% · الهدف 30% · تحرّك 3 من 9 في التسلسل." |
| Correction saved | "Corrected 36 → 35 — revision 2 kept, the trail shows both." | "صُحّح 36 إلى 35 — حُفظت المراجعة 2، والسجل يعرض الاثنين." |
| On-behalf submitted | "Check-in recorded for Tariq by Omar — provenance kept on the grid." | "سُجّل التحديث لطارق نيابةً عنه من عمر — المصدر محفوظ في الشبكة." |
| Lint clean | "Pair passes the writing rules — measurable, tightened, lengths balanced." | "اجتاز الزوج قواعد الكتابة — قابل للقياس، محكم، ومتوازن الطول." |
| Objective committed | "Objective committed to the cascade — 2 alignment links, 3 key results." | "أُلزم الهدف بالتسلسل — وصلتا مواءمة و3 نتائج رئيسية." |
| Alignment changed | "Re-aligned — this objective now answers to 2 company objectives; warnings recomputed." | "أُعيدت المواءمة — يجيب هذا الهدف الآن عن هدفين للشركة؛ وأُعيد حساب التنبيهات." |
| Re-baseline recorded | "Baseline moved 2.1 → 2.2 with your reason. History keeps every prior value." | "انتقل خط الأساس من 2.1 إلى 2.2 بسببك. يحفظ السجل كل قيمة سابقة." |
| Archive done | "Archived with the reason attached — 4 key results and 11 check-ins left the rollup, none left the record." | "أُرشف مع السبب المرفق — 4 نتائج رئيسية و11 تحديثاً غادرت الحساب ولم يغادر أيٌّ منها السجل." |
| Grades computed | "Grade sheet ready — 9 objectives, 2 unreported key results excluded and counted." | "ورقة الدرجات جاهزة — 9 أهداف، ونتيجتان رئيسيتان غير مُبلَّغتين مستبعدتان ومعدودتان." |
| Cycle closed | "Cycle closed — the grade sheet is now the immutable record; export it any time." | "أُقفلت الدورة — ورقة الدرجات الآن السجل الثابت؛ صدّرها متى شئت." |
| Export ready | "Export ready — cycle package, expires in 7 days, regenerable from the closed cycle." | "التصدير جاهز — حزمة الدورة، تنتهي بعد 7 أيام، وقابلة لإعادة التوليد من الدورة المقفلة." |
| Undo window (P03, draft discard) | "Draft discarded — Undo (7s)" | "أُهدرت المسودة — تراجع (7 ثوانٍ)" |

## E. Cadence & assist moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| Period opened (desk) | "Period 5 is open — 2 key results expect your numbers by Monday 10:00." | "الفترة 5 مفتوحة — نتيجتان رئيسيتان تنتظران أرقامك قبل الاثنين 10:00." |
| Grace entered | "Period 4 closed — 30 minutes of grace left. 3 owners haven't submitted." | "أُقفلت الفترة 4 — بقي 30 دقيقة من المهلة. 3 مالكين لم يسلّموا." |
| Zone legend — missing | "Missing — an unsubmitted draft exists. A draft is not a report." | "مفقود — توجد مسودة غير مُسلَّمة. المسودة ليست تقريراً." |
| At-risk (confidence) | "At risk: OTIF — confidence 2 on period 2. Read the check-in; the number is behind the word." | "في خطر: التسليم الكامل — ثقة 2 في الفترة 2. اقرأ التحديث؛ الرقم خلف الكلمة." |
| At-risk (cadence) | "At risk: replenishment — periods 2–3 missed after period 1 reported." | "في خطر: التجديد — فُقدت الفترتان 2–3 بعد إبلاغ الفترة 1." |
| Unstaffed ambition | "This company objective has no team answering it. Link a team objective — or archive it with a reason." | "هدف الشركة هذا بلا فريق يجيب عنه. اربط هدفاً للفريق — أو أرشفه بسبب." |
| Orphaned effort | "This team objective answers to no company objective. Link it upward — orphaned effort is invisible ambition." | "هدف الفريق هذا لا يجيب عن أي هدف للشركة. اربطه صعوداً — الجهد اليتيم طموح غير مرئي." |
| Draft proposal card (P15) | "Proposal: raise Arabic-content conversion from 1.4% to 2.2% — drafted by the assist, yours to judge. Accept, edit, or dismiss." | "مقترح: رفع تحويل المحتوى العربي من 1.4% إلى 2.2% — صاغه المساعد، والحكم لك. اقبل أو حرّر أو ارفض." |
| Assist provenance chip | "Drafted by the assist — edited by you. The record shows both." | "صاغه المساعد — وحرّرته أنت. السجل يعرض الاثنين." |
| Degraded run notice | "The assist is off — the pair editor and lint carry the work. Nothing else changes." | "المساعد متوقف — محرّر الزوج والفاحص يحملان العمل. لا شيء آخر يتغيّر." |
| Quota meter warning (80%) | "Drafting window at 20 of 25 — the editor stays unlimited either way." | "نافذة الصياغة عند 20 من 25 — المحرّر يبقى بلا حدود في الحالين." |
| Sample cycle badge | "Sample cycle — the whole ritual, synthetic numbers. Clear it whenever the real quarter arrives." | "دورة عيّنة — الطقس كاملاً بأرقام تركيبية. امسحها متى وصل الربع الحقيقي." |
| Unreported rollup | "Not yet reported — no check-in has landed. Shown as —, never as zero." | "غير مُبلَّغ بعد — لم يهبط أي تحديث. يُعرض شرطةً، ولا يُعرض صفراً أبداً." |
| Pre-change bucket (cadence migration) | "2 check-ins predate the new grid — listed as submitted, never re-counted." | "تحديثان يسبقان الشبكة الجديدة — مدرجان كما سُلّما، ولا يُعاد عدّهما أبداً." |

## F. Bidi/mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Arabic KR statement in EN chrome | "'ارتفاع التسليم الكامل في الموعد من 82% إلى 95%' renders right-to-left inside the English board — isolated, never force-flipped." | "تُعرض 'ارتفاع التسليم الكامل في الموعد من 82% إلى 95%' من اليمين إلى اليسار داخل اللوحة الإنجليزية — معزولة، ولا تُقلب قسراً." |
| Latin unit beside Arabic statement | "The % sign and the Western digits stay Latin inside the Arabic statement — the metric is one token, isolated as one." | "تبقى علامة % والأرقام الغربية لاتينية داخل العبارة العربية — المقياس رمز واحد يُعزل كواحد." |
| Blocker free text direction | "Blocker text follows its author's script — 'the OTIF figure lives in another team's report' sits LTR inside the Arabic dashboard, isolated." | "نص العائق يتبع كتابة صاحبه — جملة 'رقم التسليم يعيش في تقرير آخر' تظهر لاتينية داخل لوحة العربية، معزولة." |
| Mixed member name rendering | "Member names render at their own direction — 'طارق منصور' inside LTR chrome, 'Dana Al-Fahim' inside RTL, both isolated." | "أسماء الأعضاء تُعرض باتجاه كتابتها — 'طارق منصور' داخل واجهة لاتينية و'Dana Al-Fahim' داخل عربية، وكلاهما معزول." |
| Pair editor column direction | "The EN column stays LTR and the AR column stays RTL — whichever way the workspace flips, each column keeps its own script's direction." | "يبقى العمود الإنجليزي لاتينياً والعربي عربياً — أيّاً كان اتجاه مساحة العمل، يحتفظ كل عمود باتجاه كتابته." |
