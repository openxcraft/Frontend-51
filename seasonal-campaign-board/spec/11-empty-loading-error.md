# 11 — Empty / Loading / Error: seasonal-campaign-board (Copy Matrix)

SME-J pass · Voice: coach-calm, deadline-honest (02). Every string verbatim, EN + AR. Western digits in both languages (numeral policy, 05). Fixed terminology per the 02 glossary — one term per concept, everywhere. Interpolation points are marked `{…}` and bidi-isolated at render (rtl-rules §2).

## A. Empty states

### A1 — Moment library (S1)

| State | English | Arabic | Action |
|---|---|---|---|
| First-run (no campaigns yet) | "Your season starts with a moment. Pick one from the library — Ramadan, Eid, White Friday, national days — each carries its dates, phases, and checklist." | "يبدأ موسمك بلحظة. اخترها من المكتبة — رمضان، العيد، الجمعة البيضاء، الأيام الوطنية — وكل منها يحمل تواريخه ومراحله وقائمة جهوزيته." | Browse moments |
| Filtered-empty (kind/within-days filters) | "No moments match these filters. The season is fuller than this view shows." | "لا لحظات تطابق هذه المرشّحات. الموسم أوسع مما يعرضه هذا العرض." | Clear filters |
| Search-empty | "Nothing in the library reads '{q}'. Try the moment's Arabic or English name." | "لا شيء في المكتبة يطابق «{q}». جرّب اسم اللحظة بالعربية أو الإنجليزية." | Clear search |
| No-access | "This library belongs to another workspace." | "هذه المكتبة تخصّ مساحة عمل أخرى." | Switch workspace |

### A2 — Campaign board (S3)

| State | English | Arabic | Action |
|---|---|---|---|
| First-run (board as empty) | "No campaigns yet. Start from a moment — or walk one sample campaign to see the loop." | "لا حملات بعد. ابدأ من لحظة — أو تجرّب حملة عيّنة لرؤية الدورة." | Pick a moment · Try the sample |
| Returned-empty (closed filter) | "Every campaign here is closed and archived with its closure note." | "كل حملة هنا مغلقة ومؤرشفة مع ملاحظة إغلاقها." | Show active campaigns |
| Returned-empty (assignee filter) | "No active campaigns carry work for {assignee}." | "لا حملات نشطة تحمل عملاً لـ{assignee}." | Clear assignee filter |
| Moment-window empty (a quiet week) | "A quiet week between moments — the next build-up opens {date}." | "أسبوع هادئ بين اللحظات — يفتح التمهيد القادم في {date}." | Show next moment |

### A3 — Checklist (S4)

| State | English | Arabic | Action |
|---|---|---|---|
| Needs-owner cluster | "{n} items have no owner. Assign them before the countdown reaches their due dates." | "{n} بنود بلا مسؤول. كلّفها قبل أن يبلغ العدّ التنازلي مواعيدها." | Assign owners |
| Intervention filter empty (nothing at risk) | "Nothing at risk or overdue in this campaign — readiness is holding." | "لا شيء في خطر أو متأخر في هذه الحملة — الجهوزية ثابتة." | Show full checklist |
| All done | "All {n} items are done — {campaign} is ready for its moment." | "اكتملت البنود الـ{n} — {campaign} جاهزة للحظتها." | View closure readiness |

### A4 — Team (S8)

| State | English | Arabic | Action |
|---|---|---|---|
| First-run (no assignees) | "No teammates yet. Checklist items want owners — add the people who carry them." | "لا زملاء بعد. بنود قائمة الجهوزية تحتاج مسؤولين — أضف من يحملها." | Add teammate |

### A5 — Templates (S6)

| State | English | Arabic | Action |
|---|---|---|---|
| Kind has no template | "No template for {kind} moments yet. Build one and every future campaign starts from it." | "لا قالب لحظات {kind} بعد. ابنِ واحداً وتبدأ منه كل حملة قادمة." | Create template |

### A6 — Jobs & activity (S7)

| State | English | Arabic | Action |
|---|---|---|---|
| Jobs empty | "No exports yet. Readiness reports and handoff lists appear here with their expiry windows." | "لا تصديرات بعد. تقارير الجهوزية وقوائم التسليم تظهر هنا مع نوافذ انتهائها." | Export readiness report |
| Activity empty | "Nothing recorded yet — every change lands here with its actor and time." | "لا شيء مسجّلاً بعد — كل تغيير يصل هنا مع فاعله ووقته." | — |

## B. Loading

| Surface | English | Arabic |
|---|---|---|
| Library boot | moment-card skeletons, season headers held | هياكل بطاقات اللحظات مع تثبيت عناوين المواسم |
| Board boot | lane skeletons with reserved countdown boxes | هياكل الممرات مع خانات عدّ محجوزة |
| Checklist boot | row skeletons mirroring section groups | هياكل صفوف تحاكي مجموعات الأقسام |
| Readiness recompute | "Recomputing readiness…" (calm, cached value visible) | "إعادة حساب الجهوزية…" |
| Calendar strip boot | strip skeleton, both calendar labels held | هيكل الشريط مع تثبيت تسميتي التقويمين |
| Export job (determinate) | "Exporting {n} of {total} campaigns…" | "تصدير {n} من {total} حملات…" |
| Artifact fetch | "Preparing the file…" | "تجهيز الملف…" |

## C. Errors (7 classes, with recovery)

| Class | Instance | English | Arabic |
|---|---|---|---|
| VALIDATION | campaign name empty | "The campaign needs a name before the board can carry it." | "تحتاج الحملة اسماً قبل أن تحملها اللوحة." |
| VALIDATION | moment passed | "{moment} closed its window on {date}. Start from {nextMoment} instead — same kind, next season." | "أغلقت {moment} نافذتها في {date}. ابدأ من {nextMoment} — النوع نفسه، الموسم القادم." |
| VALIDATION | blocked without reason | "A blocked item carries its reason. Write one — it is the record your team reads instead of an escalation." | "البند المتوقف يحمل سببه. اكتبه — إنه السجل الذي يقرؤه فريقك بدل التصعيد." |
| VALIDATION | closure with open critical items | "2 critical items are still open. Close anyway and record them as slipped, or resolve them first." | "بندان جوهريان ما زالا مفتوحين. أغلق رغم ذلك وسجّلهما متأخرين، أو أنجزهما أولاً." |
| VALIDATION | empty export selection | "Select at least one campaign to export." | "اختر حملة واحدة على الأقل للتصدير." |
| NOT_FOUND | campaign/item gone | "That campaign or item is gone from this workspace." | "تلك الحملة أو البند غاب عن مساحة العمل." |
| NOT_FOUND | expired artifact | "This file passed its {n}-day window on {date}. Renew it once, or re-export the current state." | "تجاوز هذا الملف نافذته البالغة {n} يوماً في {date}. جدّده مرة، أو أعد تصدير الحالة الراهنة." |
| PERMISSION | viewer write | "You follow this board in view-only mode. Ask a planner to make the change." | "أنت تتابع هذه اللوحة في وضع العرض فقط. اطلب من مخطّط إجراء التغيير." |
| CONFLICT | concurrent checklist edit | "{actor} edited this item while you did. Both versions are kept — choose." | "حرّر {actor} هذا البند أثناء عملك. الاحتفاظ بالنُسختين — اختر." |
| CONFLICT | stale template save | "{actor} saved template version {v} while you edited. Your draft is kept — compare, then save as {nextV}." | "حفظ {actor} الإصدار {v} من القالب أثناء تحريرك. مسوّدتك محفوظة — قارن ثم احفظ كإصدار {nextV}." |
| RATE_LIMIT | export quota | "This month's export window is used — {used} of {limit}. The board and checklists keep working; exports resume {date}." | "استُهلكت نافذة التصدير لهذا الشهر — {used} من {limit}. اللوحة والقوائم يعملان؛ يستأنف التصدير في {date}." |
| NETWORK | offline writes | "The connection dropped. Your changes are queued per item — they send the moment you're back." | "انقطع الاتصال. تغييراتك في قائمة انتظار لكل بند — تُرسل لحظة عودتك." |
| NETWORK | stale countdown | "Countdown is stale since {time} — reconnecting to the board's clock." | "العدّ التنازلي متقادم منذ {time} — تجري إعادة الاتصال بساعة اللوحة." |
| UNKNOWN | unclassified | "Something failed on our side (ref {id}). Retry; quote the reference if it repeats." | "حدث خلل لدينا (مرجع {id}). أعد المحاولة؛ واذكر المرجع إن تكرر." |

## D. Success & status

| Moment | English | Arabic |
|---|---|---|
| Campaign created | "Campaign created — {n} items from {template}, counting down to {date}." | "أُنشئت الحملة — {n} بنود من {template}، مع العدّ نزولاً إلى {date}." |
| Quick-start created | "Campaign live in 4 steps — {moment} is {days} days out. Assign the 5 owners next." | "الحملة انطلقت في 4 خطوات — {moment} بعد {days} يوماً. كلّف المسؤولين الـ5 تالياً." |
| Item done | "{item} done — {percent} ready, {remaining} to go." | "{item} أُنجز — الجهوزية {percent}، وتبقّى {remaining}." |
| Item blocked (recorded) | "{item} blocked: {reason}. It is on the intervention list now." | "{item} متوقف: {reason}. إنه في قائمة التدخل الآن." |
| Bulk applied | "{n} items updated — {skipped} skipped, reasons in the list." | "حُدّثت {n} بنود — وتُخطّي {skipped}، أسبابها في القائمة." |
| Assignee added | "{name} added as {role} — assignable from every checklist now." | "أُضيف {name} بصفة {role} — قابل للتكليف من كل قائمة الآن." |
| Assignee deactivated | "{name} deactivated. Open items move to the needs-owner cluster; history stays theirs." | "أُبطل {name}. البنود المفتوحة تنتقل إلى عنقود بلا مسؤول؛ والتاريخ يبقى له." |
| Date confirmed (drift) | "Official date confirmed: {moment} on {date}. 3 items shifted by 1 day — see the change list." | "تأكّد التاريخ الرسمي: {moment} في {date}. انتقلت 3 بنود يوماً واحداً — انظر قائمة التغيير." |
| Closure saved | "Closed — {done} of {total} done, {slipped} slipped, lessons carried to the next template." | "أُغلقت — {done} من {total} منجزة، و{slipped} متأخرة، والدروس منقولة إلى القالب القادم." |
| Template saved | "Template saved at version {v} — future campaigns start from it; live campaigns untouched." | "حُفظ القالب في الإصدار {v} — تبدأ منه الحملات القادمة؛ والحملات القائمة بمعزل." |
| Export ready | "Readiness report ready — {n} campaigns, expires in 28 days." | "تقرير الجهوزية جاهز — {n} حملات، ينتهي بعد 28 يوماً." |
| Handoff ready | "Handoff list ready — {n} items with owners and dates, forwardable to the floor." | "قائمة التسليم جاهزة — {n} بنود بمسؤوليها ومواعيدها، قابلة للتمرير إلى الميدان." |
| Artifact renewed | "File renewed — 7 more days." | "جُدّد الملف — 7 أيام إضافية." |
| Item removed + undo | "Item removed — Undo (7 seconds)" | "أُزيل البند — تراجع (7 ثوانٍ)" |

## E. Countdown & signature moments (product-signature, 06/09)

| Moment | English | Arabic |
|---|---|---|
| Attention threshold (polite, once) | "{campaign}: {item} is due in {days} days and still open." | "{campaign}: {item} يستحق خلال {days} أيام وما زال مفتوحاً." |
| Overdue (assertive, once) | "{campaign}: {item} was due {date}. Assign it or move its date." | "{campaign}: كان موعد {item} في {date}. كلّفه أو انقل موعده." |
| Phase change | "{campaign} entered the peak window — the moment's own days start counting." | "دخلت {campaign} نافذة الذروة — أيام اللحظة نفسها تبدأ العدّ." |
| Waiver confirm (dialog) | "Close with 2 critical items open — 'Print and dispatch by T-5' and 'Price freeze' will be recorded as slipped, under your name." | "الإغلاق مع بندين جوهريين مفتوحين — «الطباعة والإرسال قبل 5 أيام» و«تجميد الأسعار» سيُسجّلان متأخرين باسمك." |
| Build-up opens | "{moment} build-up opens today — the checklist's first deadlines are {days} days out." | "يفتح تمهيد {moment} اليوم — أول مواعيد القائمة بعد {days} يوماً." |
| Ramadan moment guidance (library content) | "Ramadan moves its economy to the night. Plan the last ten days as your peak — they are the documented surge." | "ينقل رمضان اقتصاده إلى الليل. خطّط لأيام العشر الأخيرة ذروةً لك — إنها الطفرة الموثّقة." |
