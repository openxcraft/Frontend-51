# 11 — Empty / Loading / Error: bilingual-content-calendar (Copy Matrix)

SME-J pass · Voice: organized-calm newsroom desk (02). Bilingual core matrix (all states; ar strings فصحى بيضاء).

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| First-run (no horizon) | "Start with the horizon you're planning — this Ramadan, or the month ahead. Moments come pre-placed." | "ابدأ بالأفق الذي تخطط له — رمضان هذا، أو الشهر القادم. اللحظات تأتي مسبقة التموضع." | Create Ramadan horizon / Create month |
| Horizon empty (no slots) | "An empty grid is a clean start. Add your first slot — the Arabic and English versions link automatically." | "الشبكة الفارغة بدايةٌ نظيفة. أضف خانتك الأولى — تترابط النسختان العربية والإنجليزية تلقائياً." | Add slot |
| Filtered-empty | "No slots match these filters — parity, channel, or status." | "لا خانات تطابق هذه المرشحات — التطابق أو القناة أو الحالة." | Clear filters |
| No-access | "This horizon belongs to another workspace." | "هذا الأفق يخصّ مساحة عمل أخرى." | Switch workspace |
| Moments library (outside any season) | "No seasonal moments in this range. Ramadan and the Eids live one horizon away." | "لا لحظات موسمية في هذا النطاق. رمضان والعيدان على بُعد أفقٍ واحد." | Jump to Ramadan |
| Review clean | "Nothing to flag — no timing conflicts, no missing variants." | "لا ما يُعلَّم — لا تعارضات توقيت ولا نسخ ناقصة." | Approve horizon |

## B. Loading

| State | English | Arabic |
|---|---|---|
| Grid boot | skeleton cells mirroring geometry; SR: "Loading {horizon} — dual calendar" | خلايا هيكلية؛ "جارٍ تحميل {الأفق} — التقويم المزدوج" |
| Slot drawer | skeleton panes (ar/en) | لوحا هيكلية |
| Pattern applying | "Applying pattern to 21 slots — {n} of {total}" | "تطبيق النمط على ٢١ خانة — {n} من {total}" |
| Export | "Preparing the export — dual dates included." | "تحضير التصدير — التواريخ المزدوجة مشمولة." |

## C. Errors (typed → copy with next action)

| Class | English | Arabic |
|---|---|---|
| VALIDATION (channel limit) | "Feed accepts 6 slots that day — this would be the 7th. Move it or clear one." | "تقبل الفيد ٦ خانات في ذلك اليوم — وستكون هذه السابعة. انقلها أو أخلِ إحداها." |
| VALIDATION (slot fields) | "A slot needs a channel, a time, and a title before it can live on the grid." | "تحتاج الخانة إلى قناة ووقت وعنوان قبل أن تسكن الشبكة." |
| NOT_FOUND (slot) | "That slot was deleted from another session. The grid refreshed around it." | "حُذفت تلك الخانة من جلسة أخرى. تحدّثت الشبكة حولها." |
| PERMISSION | "Planning rights for this workspace sit with its members. You can review, or request access." | "صلاحيات التخطيط لهذه المساحة بيد أعضائها. يمكنك المراجعة أو طلب الوصول." |
| CONFLICT | "Farah moved this slot while you were editing it. Both placements are kept — choose one." | "نقلت فرح هذه الخانة أثناء تحريرك. الاحتفاظ بالوضعين معاً — اختر أحدهما." |
| RATE_LIMIT (export) | "This month's export window is used up. Exports resume {date} — the plan itself is untouched." | "استُهلكت نافذة التصدير لهذا الشهر. يستأنف التصدير في {تاريخ} — الخطة نفسها بمعزلٍ عن ذلك." |
| NETWORK | "The plan view went stale — reconnecting. Nothing you planned is lost." | "تقادم عرض الخطة — تجري إعادة الاتصال. لا شيء مما خططت له ضائع." |
| UNKNOWN | "Something failed on our side (ref {id}). Retry; quote the reference if it repeats." | "حدث خلل لدينا (مرجع {id}). أعد المحاولة؛ واذكر المرجع إن تكرر." |

## D. Success & status

| Moment | English | Arabic |
|---|---|---|
| Horizon approved | "Approved. The plan is now the record of what goes out." | "تمت الموافقة. الخطة الآن سجلٌ لما سيصدر." |
| Pattern applied with conflicts | "Pattern applied to 21 slots — 2 need your eye (marked in red on the grid)." | "طُبّق النمط على ٢١ خانة — اثنتان تستحقان نظرك (معلَّمتان على الشبكة)." |
| Variant completed | "English variant ready — this slot is now both-languages." | "النسخة الإنجليزية جاهزة — الخانة الآن باللغتين." |
| Undo (slot move) | "Slot moved — Undo (7s)" | "نُقلت الخانة — تراجع (٧ ثوانٍ)" |
| Export ready | "Export ready — dual dates, both variants, single-locale slots labeled." | "التصدير جاهز — تواريخ مزدوجة، ونسختان، والخانات أحادية اللغة موسومة." |

## E. Season-specific copy

| Moment | English | Arabic |
|---|---|---|
| Ramadan mode on | "Ramadan mode: days now breathe around iftar and suhoor. Quiet hours are guidance, not guards." | "وضع رمضان: أيامٌ تتنفس حول الإفطار والسحور. ساعات السكوت إرشادٌ لا حرّاس." |
| Quiet-hours override | "You're planning inside quiet hours. Say why — it stays with the slot's record." | "تخطط داخل ساعات السكوت. اذكر السبب — يبقى مع سجل الخانة." |
| Method disclosure | "Hijri dates follow the Umm al-Qura method your workspace declared." | "تتبع التواريخ الهجرية طريقة أم القرى التي أعلنتها مساحة عملك." |
