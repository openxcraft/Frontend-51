# 11 — Empty / Loading / Error: visitor-badge-checkin (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR · voice = lobby-plain (02: courteous, brisk, hospitality-first; warmth in welcome and success, never in failure) · Arabic is فصحى بيضاء, softened sparingly with تفضل/لطفاً · numerals Western everywhere (ledger row — never mixed systems mid-sentence) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked: زيارة=visit · زائر=visitor · المضيف=host · تسجيل الحضور=check-in · تسجيل المغادرة=check-out · بطاقة الزائر=visitor badge · مواصفة البطاقة=badge spec · الدعوة المسبقة=pre-registration · رمز الدخول=check-in code · سجل الزوار=visitor log · من في المبنى=in-building list.

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| S1 board first-run | "No visits yet today. Load the sample day — four visits with a badge correction to explore — or pre-register your first guest." | "لا زيارات بعد اليوم. حمّل يوم العيّنة — أربع زيارات مع تصحيح بطاقة للاستكشاف — أو سجّل مسبقاً ضيفك الأول." | Load sample day / Pre-register a guest |
| S1 board quiet-day (after activity) | "Quiet morning — no one is expected before 11:00. Pre-registrations you create appear here." | "صباح هادئ — لا أحد متوقع قبل 11:00. الدعوات المسبقة التي تنشئها تظهر هنا." | Pre-register a guest |
| S1 no-show zone empty | "No one has missed their window today." | "لم يفت أحد نافذة زيارته اليوم." | — |
| S2/S5 filtered-empty | "No visits match these filters." | "لا زيارات تطابق هذه المرشّحات." | Clear filters |
| S2/S5 no-access | "These visits belong to another workspace." | "هذه الزيارات تخصّ مساحة عمل أخرى." | Switch workspace |
| S5 log range archived | "Visits from June are in the archive. The live log keeps 12 months." | "زيارات يونيو في الأرشيف. يحتفظ السجل النشط بـ 12 شهراً." | Export the archive |
| S5 in-building empty | "No visitors are in the building right now. The list computes at each refresh." | "لا زوار في المبنى الآن. تُحسب القائمة عند كل تحديث." | Refresh |
| S3 composer first-use | "Pre-register a guest and the lobby will know who, when, and why — before they walk in." | "سجّل ضيفاً مسبقاً وسيعرف الاستقبال من ومتى ولماذا — قبل دخوله." | Start the invitation |
| S6 studio first-run | "One badge template is active. Duplicate it when your spec becomes yours." | "مواصفة بطاقة واحدة نشطة. استنسخها حين تصبح مواصفتك خاصة بك." | Open the active template |
| S6 template list filtered-empty | "No templates match this filter." | "لا مواصفات تطابق هذه المرشّحة." | Clear filters |
| S8 host surface first-run | "No guests expected for you. Pre-register one and you'll be told the moment they arrive." | "لا ضيوف متوقعون لديك. سجّل أحدهم مسبقاً وستُخبَر لحظة وصوله." | Pre-register a guest |
| S8 no-access (no host membership) | "Host tools need a member seat. Ask your workspace admin to add you as a host." | "أدوات المضيف تتطلب مقعد عضو. اطلب من مسؤول مساحة عمل إضافتك مضيفاً." | Request access |
| S10 jobs empty | "Nothing running. Exports and end-of-day sweeps appear here while they work." | "لا مهام قيد التنفيذ. تظهر التصديرات ومسوح نهاية اليوم هنا أثناء عملها." | — |
| S9 kiosk idle (welcome) | "Welcome. تفضل بتسجيل حضورك — Choose your language to begin." | "أهلاً وسهلاً. تفضل بتسجيل حضورك — اختر لغتك للبدء." | العربية / English |

## B. Loading (P02/P12 — skeletons mirror geometry per direction; honest progress)

| State | English | Arabic |
|---|---|---|
| S1 board skeleton | three zone skeletons + "Loading today's visits…" (SR) | هياكل المناطق الثلاث + "جارٍ تحميل زيارات اليوم…" |
| Kiosk code lookup | inline field pulse ≤300ms; then result | نبض الحقل نفسه؛ ثم النتيجة |
| Check-in commit | "Registering your visit…" (visible ≤900ms budget) | "جارٍ تسجيل زيارتك…" |
| Badge resolving | "Preparing your badge…" | "جارٍ تجهيز بطاقتك…" |
| Returning-visitor lookup | "Checking earlier visits…" | "جارٍ فحص الزيارات السابقة…" |
| Export job (determinate) | "Exporting the log — visit 12 of 23." | "تصدير السجل — الزيارة 12 من 23." |
| Archive export (large) | "Assembling 12 months of visits — this takes about 2–3 minutes." | "تجميع زيارات 12 شهراً — يستغرق نحو دقيقتين إلى ثلاث." |
| End-of-day sweep | "Closing the day — checking 14 open visits." | "إغلاق اليوم — فحص 14 زيارة مفتوحة." |
| S6 preview render | "Rendering the badge in both directions…" | "عرض البطاقة في الاتجاهين…" |
| Autosave (composer/studio) | "Saving…" → "Saved" (fades) | "جارٍ الحفظ…" → "حُفظ" |
| S9 kiosk wake (config cached) | no skeleton — instant welcome; refresh behind the screen | بلا هيكل — ترحيب فوري؛ التحديث خلف الشاشة |

## C. Errors (7 classes; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (code not found) | "That code isn't in today's visits — check the six characters on your invitation, or continue as a walk-in below." | "هذا الرمز ليس في زيارات اليوم — تحقق من الأحرف الستة في دعوتك، أو تابع كزائر غير مسجّل أدناه." |
| VALIDATION (window elapsed) | "This visit's window closed 70 minutes ago — the host stopped expecting it. Reception will help you reach them." | "أُغلقت نافذة هذه الزيارة قبل 70 دقيقة — توقف المضيف عن توقعها. سيساعدك الاستقبال في الوصول إليه." |
| VALIDATION (early arrival, inside grace) | "You're 20 minutes early — the host has been told you're here." | "وصلت مبكراً بـ 20 دقيقة — أُخبر المضيف بأنك هنا." |
| VALIDATION (walk-in missing fields) | "Your name and your host are needed to register — the company field is optional." | "الاسم والمضيف مطلوبان للتسجيل — وحقل الشركة اختياري." |
| VALIDATION (invitation window in past) | "The visit window can't start in the past — pick a time from now on." | "لا يمكن أن تبدأ نافذة الزيارة في الماضي — اختر وقتاً من الآن فصاعداً." |
| VALIDATION (duplicate open invitation) | "Sarah Mitchell already has an open invitation for this window — open it, or create a second visit if both are real." | "لدى Sarah Mitchell دعوة مفتوحة في هذه النافذة — افتحها، أو أنشئ زيارة ثانية إن كانتا حقيقيتين." |
| VALIDATION (void without reason) | "A voided badge needs its reason — the correction chain keeps the why." | "البطاقة الملغاة تحتاج سببها — سلسلة التصحيح تحتفظ بالسبب." |
| VALIDATION (template blocking issue) | "The vendor band has no text-safe variant — pick the deep amber for vendor text, then activate." | "شريط المورّد بلا صيغة نصية آمنة — اختر الكهرماني الغامق لنص المورّد ثم فعّل." |
| VALIDATION (kiosk config references retired template) | "The kiosk still points at a retired template — activate a spec for every visitor type first." | "ما زال الكيوسك يشير إلى مواصفة متقاعدة — فعّل مواصفة لكل نوع زائر أولاً." |
| NOT_FOUND (stale visit link) | "That visit is gone from this workspace — it may have been cancelled while you were away." | "تلك الزيارة غابت عن مساحة العمل — ربما أُلغيت أثناء غيابك." → العودة إلى اليوم |
| NOT_FOUND (expired artifact) | "This export expired 3 days ago. Regenerate it — the log it came from is unchanged." | "انتهت صلاحية هذا التصدير قبل 3 أيام. أعد توليده — السجل الذي صدر عنه لم يتغيّر." |
| PERMISSION (host editing another's invitation) | "You host your own invitations — this one belongs to Khalid. Reception or an admin can edit it." | "تُحرّر دعواتك أنت — هذه لخالد. يمكن للاستقبال أو المسؤول تحريرها." |
| PERMISSION (viewer issuing) | "Your seat views and exports — badge issuance needs a receptionist or admin seat." | "مقعدك يعرض ويصدّر — إصدار البطاقات يتطلب مقعد استقبال أو مسؤول." |
| PERMISSION (inactive host at check-in) | "This visit's host is no longer active — pick another host below and reception will confirm." | "مضيف هذه الزيارة لم يعد نشطاً — اختر مضيفاً آخر أدناه وسيؤكده الاستقبال." |
| CONFLICT (concurrent invitation edit) | "Reem edited this invitation while you did. Both versions are kept — choose what stays." | "حرّرت ريم هذه الدعوة أثناء عملك. الاحتفاظ بالنسختين — اختر ما يبقى." |
| CONFLICT (stale badge render at issue) | "The badge spec changed since this preview — re-preview, then issue." | "تغيّرت مواصفة البطاقة منذ هذا العرض — أعد العرض ثم الإصدار." |
| RATE_LIMIT (notification volume) | "This month's outbound notification window is used. Arrivals still record and the desk board still shows every one — outbound delivery resumes 1 Dec." | "استُهلكت نافذة الإشعارات الصادرة لهذا الشهر. ما زالت الزيارات تُسجَّل ولوحة الاستقبال تعرضها كلها — يستأنف الإرسال في 1 ديسمبر." |
| RATE_LIMIT (export volume) | "Export limit reached for this hour — the log itself is unaffected. Retry after 14:20." | "بلغ حدّ التصدير لهذه الساعة — السجل نفسه غير متأثر. أعد المحاولة بعد 14:20." |
| NETWORK (kiosk offline, queued) | "You're offline — the visit is saved on this tablet and will register the moment we reconnect. Your badge pass is ready." | "أنت غير متصل — حُفظت الزيارة على هذا الجهاز وستُسجَّل لحظة إعادة الاتصال. بطاقتك جاهزة." |
| NETWORK (desk list stale) | "The board went stale — reconnecting. No arrival you registered is lost." | "تقادمت اللوحة — تجري إعادة الاتصال. لا وصول سجّلته ضائع." |
| NETWORK (export partial) | "The bundle delivered 1 of 2 formats — the daily log arrived, the in-building list didn't. Retry just the list." | "سلّمت الحزمة 1 من 2 صيغ — وصل سجل اليوم ولم تصل قائمة من في المبنى. أعد محاولة القائمة وحدها." |
| UNKNOWN | "Something failed on our side (ref vbc-corr-0001). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع vbc-corr-0001). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips, no confetti — minimal motion)

| Moment | English | Arabic |
|---|---|---|
| Check-in committed (kiosk) | "Welcome, Noura — Khalid has been told you're here." | "أهلاً بك يا نورة — أُخبر خالد بأنك هنا." |
| Check-in committed (desk mirror) | "Noura Al-Qahtani checked in at 11:02 — host notified." | "سجّلت نورة القحطاني حضورها في 11:02 — وأُخبر المضيف." |
| Host notified (in-app fallback) | "Recorded — Khalid sees the arrival on his board." | "سُجّل — يرى خالد الوصول على لوحته." |
| Host notified (outbound) | "Khalid was notified on his channel at 11:02." | "أُخبر خالد عبر قناته في 11:02." |
| Badge ready (kiosk) | "Your badge is ready — show it during your visit." | "بطاقتك جاهزة — أظهرها طوال زيارتك." |
| Badge issued (print) | "Badge printed for Noura Al-Qahtani." | "طُبعت بطاقة نورة القحطاني." |
| Badge corrected | "Badge voided — replacement issued. The chain keeps both." | "أُلغيت البطاقة — وصدرت بديلة. تحتفظ السلسلة بكلتيهما." |
| Checked out (kiosk) | "Thank you for your visit — you're checked out at 12:41." | "شكراً لزيارتك — سُجّلت مغادرتك في 12:41." |
| Checked out (desk) | "Majed checked out at 09:22 — 1 visitor in the building." | "سجّل ماجد مغادرته في 09:22 — زائر واحد في المبنى." |
| Invitation created | "Invitation created — code 7K4QM2. Copy it or send it; the visit opens at 11:00." | "أُنشئت الدعوة — الرمز 7K4QM2. انسخه أو أرسله؛ تُفتح الزيارة في 11:00." |
| Invitation updated | "Invitation moved to 14:00 — the code stays the same." | "نُقلت الدعوة إلى 14:00 — يبقى الرمز كما هو." |
| Invitation cancelled | "Invitation cancelled — the record keeps it with your reason." | "أُلغيت الدعوة — يحتفظ السجل بها مع سببك." |
| Returning visitor matched | "We met you on 12 Oct — same details? Confirm or correct them." | "التقينا بك في 12 أكتوبر — التفاصيل ذاتها؟ أكّدها أو صحّحها." |
| Template activated | "Standard badge v2 is active for all five visitor types." | "البطاقة القياسية v2 نشطة لخمسة أنواع زوار." |
| Export ready | "Daily log ready — 23 visits, expires in 7 days." | "سجل اليوم جاهز — 23 زيارة، تنتهي صلاحيته بعد 7 أيام." |
| End-of-day sweep | "Day closed — 1 visit left open at 18:05, badge expired with it." | "أُغلق اليوم — زيارة واحدة ظلت مفتوحة في 18:05، وانتهت بطاقتها معها." |
| Undo window (P03, invitation edit) | "Invitation rescheduled — Undo (7s)" | "أُعيد جدولة الدعوة — تراجع (7 ثوانٍ)" |

## E. Signature moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| The Arrival Settle (kiosk confirmation) | the name renders in Almarai 800, settles once (opacity 120ms), host chip flips state in the same frame | يظهر الاسم بخط Almarai 800، يستقر مرة واحدة، ويتغيّر وسم المضيف في الإطار نفسه |
| Sample-day badge | "Sample day — 4 visits, 1 correction chain, synthetic names. Clear it when real guests arrive." | "يوم عيّنة — 4 زيارات وسلسلة تصحيح واحدة وأسماء تركيبية. امسحه حين يصل الضيوف الحقيقيون." |
| Normalization disclosure (returning match) | "'احمد الشمرى' matched 'أحمد الشمري' — the alef and yaa rules. See every rule the match used." | "طابقت 'احمد الشمرى' مع 'أحمد الشمري' — قاعدتا الألف والياء. اعرض كل قواعد المطابقة." |
| No-show honesty | "Expected at 08:00, window closed 08:30 — still invited, never auto-cancelled. The host decides." | "كان متوقعاً في 08:00 وأُغلقت النافذة 08:30 — ما زال مدعواً، ولا إلغاء تلقائياً. القرار للمضيف." |
| Retention statement (log header) | "The live log keeps 12 months, then archives. Exports carry the full history." | "يحتفظ السجل النشط بـ 12 شهراً ثم يؤرشف. تحمل التصديرات التاريخ كاملاً." |
| Privacy at the field (kiosk phone) | "Phone is optional — it only helps us recognize you next time." | "الهاتف اختياري — يساعدنا فقط على التعرف إليك في المرة القادمة." |
| Fire-list moment | "In-building list computed at 11:04 — 2 visitors, hosts named." | "قائمة من في المبنى محسوبة في 11:04 — زائران، والمضيفون مذكورون." |
| Correction chain read | "This badge replaced an earlier one — misspelled name. Both remain on the visit." | "هذه البطاقة تحل محل سابقة — اسم مكتوب خطأً. وتبقى كلتاهما في الزيارة." |

## F. Bidi/mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Latin visitor in Arabic kiosk | "Sarah Mitchell — rendered left-to-right inside the Arabic confirmation, isolated, never re-ordered." | "Sarah Mitchell — تُعرض من اليسار إلى اليمين داخل التأكيد العربي، معزولة، ولا يُعاد ترتيبها أبداً." |
| Arabic name on LTR badge variant | "'عبدالعزيز بن سليمان الرشد' renders right-to-left on the badge's Latin variant — isolated field, word-boundary truncation at 28 characters." | "تُعرض 'عبدالعزيز بن سليمان الرشد' من اليمين إلى اليسار في الصيغة اللاتينية للبطاقة — حقل معزول، وقطع عند حدود الكلمات عند 28 حرفاً." |
| Code inside Arabic copy | "The code 7K4QM2 stays Latin-script and left-to-right inside the Arabic sentence — tabular figures, never mirrored." | "يبقى الرمز 7K4QM2 بخط لاتيني ومن اليسار إلى اليمين داخل الجملة العربية — أرقام جدولية، ولا يُعكس أبداً." |
| Mixed company string in log row | "'شركة الأنظمة الذكية LLC' sorts by its Arabic run under Arabic rules and renders isolated in both directions." | "تُرتّب 'شركة الأنظمة الذكية LLC' بمقطعها العربي وفق قواعد العربية، وتُعرض معزولة في الاتجاهين." |
