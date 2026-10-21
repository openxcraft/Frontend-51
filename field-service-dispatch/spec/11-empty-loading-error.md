# 11 — Empty / Loading / Error: field-service-dispatch (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR · voice = floor-plain (02: present-tense state, past-tense outcome, numbers in the sentence) · Arabic is فصحى بيضاء, utility register; customer-facing touchpoint copy softens with لطفاً sparingly · numerals Western everywhere (ledger row; never mixed systems mid-sentence) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked: بطاقة العمل=job card · التوزيع=dispatch · الفني=technician · نافذة الزيارة=visit window · التأكيد=confirmation · نقطة التواصل=touchpoint · لوح التوزيع=dispatch board · طابور التأكيدات=confirmation queue · تسجيل الوصول=check-in · إيقاف مؤقت=pause · اعتماد الإتمام=completion sign-off · عدم الحضور=no-show · إعادة الجدولة=reschedule · ورقة اليوم=day sheet · التوزيع غير المؤكد=unconfirmed dispatch.

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| S1 board first-run | "The board is empty. Add today's first job — or open the sample day and watch a job clear the confirmation gate." | "اللوح فارغ. أضف أول بطاقة عمل لهذا اليوم — أو افتح اليوم العيّنة وشاهد بطاقة تعبر بوابة التأكيد." | New job card / Open sample day |
| S1 no jobs that day | "No job cards on Wednesday 4 November. Tomorrow holds 7." | "لا بطاقات عمل في الأربعاء 4 نوفمبر. غداً يحمل 7 بطاقات." | Go to tomorrow |
| S1 no-data-after-activity | "This view hides finished days — closed, cancelled, and no-show cards live in the register." | "هذا العرض يخفي الأيام المنتهية — بطاقات الإغلاق والإلغاء وعدم الحضور تسكن السجل." | Open the register |
| S1 filtered-empty | "No job cards match these filters." | "لا بطاقات عمل تطابق هذه المرشّحات." | Clear filters |
| S1 no-access | "This board belongs to another workspace." | "هذا اللوح يخصّ مساحة عمل أخرى." | Switch workspace |
| S4 queue first-run | "No touchpoints yet. Scheduling a job requests its booking confirmation automatically — or request one yourself from the card." | "لا نقاط تواصل بعد. جدولةُ البطاقة تطلب تأكيد الحجز تلقائياً — أو اطلبه بنفسك من البطاقة." | New job card |
| S4 queue clean sweep | "Nothing awaiting confirmation. Every touchpoint today is resolved." | "لا شيء بانتظار التأكيد. كل نقاط التواصل اليوم محسومة." | View the day |
| S5 register first-run | "No job cards yet. The first phone call makes the first card." | "لا بطاقات عمل بعد. أول اتصال هاتفي يصنع أولى البطاقات." | New job card |
| S5 filtered-empty | "No job cards match these filters." | "لا بطاقات عمل تطابق هذه المرشّحات." | Clear filters |
| S6 customers first-run | "No customers yet. Add the first one from intake — a name, a phone, a district." | "لا عملاء بعد. أضف أولهم من الاستقبال — اسم، وهاتف، وحيّ." | Add customer |
| S6 filtered-empty | "No customers match this search." | "لا عملاء يطابقون هذا البحث." | Clear search |
| S7 technicians first-run | "No technicians yet. The lanes are waiting for their people." | "لا فنيين بعد. المسارات تنتظر أصحابها." | Add technician |
| S8 jobs empty | "Nothing running. Sends and exports appear here while they work." | "لا مهام قيد التنفيذ. الإرسالات والتصديرات تظهر هنا أثناء عملها." | — |

## B. Loading (P02/P12 — skeletons mirror lane/queue geometry per direction; honest progress)

| State | English | Arabic |
|---|---|---|
| S1 board skeleton | lane skeletons + "Setting up today's board…" | هيكلية المسارات + "جارٍ تجهيز لوح اليوم…" |
| S4 queue skeleton | queue row skeletons ×8 | صفوف طابور هيكلية ×8 |
| Day-plan compute (large days) | "Computing the day's lanes…" | "جارٍ حساب مسارات اليوم…" |
| Confirmation send job (determinate) | "Sending confirmations — customer 3 of 9." | "إرسال التأكيدات — العميل 3 من 9." |
| Export job | "Preparing the day sheet — technician 4 of 8." | "تجهيز ورقة اليوم — الفني 4 من 8." |
| Drawer timeline | "Loading the card's timeline…" | "جارٍ تحميل مسار البطاقة…" |
| Offline action queued (P20) | "Waiting for signal — your check-in is saved in the queue." | "بانتظار الإشارة — تسجيل وصولك محفوظ في الطابور." |
| Autosave (intake, P10) | "Saving…" → "Saved" | "جارٍ الحفظ…" → "حُفظ" |

## C. Errors (7 classes; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (dispatch gate) | "JOB-1003 can't be dispatched — its booking confirmation expired at 08:00. Record the customer's phone confirmation, or record an unconfirmed dispatch with a reason." | "لا يمكن توزيع JOB-1003 — انتهت صلاحية تأكيد حجزه الساعة 08:00. سجّل تأكيد العميل هاتفياً، أو سجّل توزيعاً غير مؤكد مع سبب." |
| VALIDATION (close gate) | "JOB-1001 can't close — the completion sign-off is still pending. Wait for the customer's reply, or record a staff attestation." | "لا يمكن إغلاق JOB-1001 — اعتماد الإتمام ما يزال معلقاً. انتظر ردّ العميل، أو سجّل اعتماداً من الموظف." |
| VALIDATION (overlap) | "Salem already holds JOB-1014 at 09:00–12:00 — the new 11:00–13:00 window overlaps by an hour. Pick another window, another technician, or a shorter window." | "في حوزة سالم بطاقة JOB-1014 في 09:00–12:00 — والنافذة الجديدة 11:00–13:00 تتداخل ساعة. اختر نافذة أخرى، أو فنياً آخر، أو نافذة أقصر." |
| VALIDATION (minimum window) | "A visit window needs at least 60 minutes. The one you set is 45." | "تحتاج نافذة الزيارة 60 دقيقة على الأقل. التي حدّدتها 45." |
| VALIDATION (terminal state) | "JOB-0991 ended as a no-show — it can't reopen. Create a new card that references it." | "انتهت JOB-0991 بعدم الحضور — لا يمكن إعادة فتحها. أنشئ بطاقة جديدة تشير إليها." |
| VALIDATION (malformed intake) | "A job card needs a title and a customer. The customer field is empty." | "تحتاج بطاقة العمل عنواناً وعميلاً. خانة العميل فارغة." |
| NOT_FOUND (stale card link) | "That job card is gone from this workspace — it may have been removed while you were away." | "غابت هذه البطاقة عن مساحة العمل — ربما أُزيلت أثناء غيابك." |
| NOT_FOUND (expired artifact) | "This export expired 3 days ago. Regenerate it — the day it came from is unchanged." | "انتهت صلاحية هذا التصدير قبل 3 أيام. أعد توليده — اليوم الذي صدر عنه لم يتغيّر." |
| PERMISSION (technician scope) | "Your seat works your own job cards — this one is assigned to another technician." | "مقعدك يعمل على بطاقاتك أنت — هذه البطاقة مسندة إلى فني آخر." |
| PERMISSION (workspace boundary) | "This action belongs to another workspace." | "هذا الإجراء يخصّ مساحة عمل أخرى." |
| CONFLICT (concurrent card edit) | "Noura saved a change to this card while you did. Both versions are kept — choose what stays." | "حفظت نورة تغييراً في هذه البطاقة أثناء عملك. الاحتفاظ بالنسختين — اختر ما يبقى." |
| CONFLICT (terminal touchpoint) | "This confirmation was already recorded as confirmed at 07:40 by Noura. Outcomes are never overwritten." | "سُجّل هذا التأكيد «مؤكداً» الساعة 07:40 بواسطة نورة. النتائج لا تُستبدل أبداً." |
| RATE_LIMIT (send window) | "This month's send window is used. The copy-link and phone paths keep working — sends resume 1 December." | "استُهلكت نافذة الإرسال لهذا الشهر. مسارا الرابط والهاتف يعملان — وتستأنف الإرسالات في 1 ديسمبر." |
| RATE_LIMIT (rung 2 warning) | "Running near the send limit — 24 of 30 used. The phone path never limits." | "اقترب الاستخدام من حدّ الإرسال — 24 من 30. مسار الهاتف بلا حدود." |
| NETWORK (list fetch) | "The board went stale — reconnecting. Every state you recorded is safe." | "تقادم اللوح — تجري إعادة الاتصال. كل حالة سجّلتها آمنة." |
| NETWORK (offline queue) | "No signal — the action waits in the queue and lands when you're back. Nothing is lost." | "لا إشارة — الإجراء ينتظر في الطابور ويصل عند عودتك. لا شيء يضيع." |
| UNKNOWN | "Something failed on our side (ref fsd-corr-0001). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع fsd-corr-0001). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips, no confetti)

| Moment | English | Arabic |
|---|---|---|
| Job scheduled | "JOB-1005 scheduled — Reda, 12:00–14:00. Booking confirmation requested; it expires at 10:00." | "جُدولت JOB-1005 — رضا، 12:00–14:00. طُلب تأكيد الحجز؛ وينتهي الساعة 10:00." |
| Confirmation link ready | "Confirmation link ready — send it through the channel, or copy it to the customer." | "رابط التأكيد جاهز — أرسله عبر القناة، أو انسخه للعميل." |
| Phone outcome recorded | "Confirmed by phone — recorded at 08:05 by Noura. The gate is clear." | "مؤكد هاتفياً — سُجّل الساعة 08:05 بواسطة نورة. البوابة مفتوحة." |
| Unconfirmed dispatch recorded | "Unconfirmed dispatch recorded: «phone agreement, no written reply». JOB-1009 carries it from here on." | "سُجّل توزيع غير مؤكد: «اتفاق هاتفي دون ردّ مكتوب». تحمله JOB-1009 من الآن فصاعداً." |
| Job dispatched | "JOB-1010 dispatched — arrival notice sent. Waleed has it on his phone." | "وُزّعت JOB-1010 — أُرسل إشعار الوصول. لدى وليد على هاتفه." |
| Checked in | "Checked in at 08:55 — JOB-1001." | "سُجّل الوصول الساعة 08:55 — JOB-1001." |
| Paused | "Paused — awaiting customer. The card waits with its reason." | "إيقاف مؤقت — بانتظار العميل. البطاقة تنتظر مع سببها." |
| Work completed | "Work done — completion note saved. Sign-off requested from the customer." | "أُنجز العمل — حُفظت ملاحظة الإتمام. وطُلب اعتماد الإتمام من العميل." |
| Job closed | "JOB-1001 closed — the customer confirmed completion at 10:40. The timeline is final." | "أُغلقت JOB-1001 — أكّد العميل الإتمام الساعة 10:40. المسار نهائي." |
| No-show recorded | "No-show recorded — customer absent, 25 minutes waited. JOB-0991 is terminal." | "سُجّل عدم الحضور — العميل غائب، وانتظار 25 دقيقة. JOB-0991 محسومة." |
| Rescheduled | "Rescheduled to Thursday 14:00–16:00 — the old confirmation is superseded and a new one is requested." | "أُعيدت الجدولة إلى الخميس 14:00–16:00 — التأكيد القديم مستبدَل وطُلب تأكيد جديد." |
| Cancelled after dispatch | "JOB-0992 cancelled after dispatch — the reason and the arrival notice stay on the record." | "أُلغيت JOB-0992 بعد التوزيع — السبب وإشعار الوصول يبقيان في السجل." |
| Day sheet ready | "Day sheet ready — 8 technicians, 13 job cards, expires in 7 days." | "ورقة اليوم جاهزة — 8 فنيين، و13 بطاقة عمل، وتنتهي بعد 7 أيام." |
| Job history ready | "Job history ready — JOB-0990: 6 events, 2 confirmations, bilingual." | "سجل البطاقة جاهز — JOB-0990: 6 أحداث، وتأكيدان، ثنائي اللغة." |
| Undo window (P03, lane move) | "Card moved back to the intake lane — Undo (6 seconds)." | "أُعيدت البطاقة إلى مسار الاستقبال — تراجع (6 ثوانٍ)." |

## E. Signature moments (the gate's copy — the product's voice at its most specific)

| Moment | English | Arabic |
|---|---|---|
| The Gate Clears | "JOB-1002: the customer confirmed. The gate is clear — dispatch when ready." | "JOB-1002: أكّد العميل. البوابة مفتوحة — وزّع متى شئت." |
| Customer declined | "The customer declined Wednesday morning. Reschedule, or call to settle it." | "اعتذر العميل عن صباح الأربعاء. أعد الجدولة، أو اتصل لحسمها." |
| Late reply (after expiry, before dispatch) | "A reply arrived after expiry — recorded on the timeline. The gate reads it as confirmed; the expiry stays in the record." | "وصل ردٌّ بعد انتهاء الصلاحية — سُجّل في المسار. تقرؤه البوابة مؤكداً؛ وتبقى الصلاحية المنتهية في السجل." |
| Staff attestation close | "Closed by staff attestation — Maha was unreachable; Salem attested at 17:30." | "أُغلقت باعتماد الموظف — تعذّر الوصول إلى مها؛ واعتمد سالم الساعة 17:30." |
| Superseded touchpoint | "This confirmation was superseded by the reschedule — it stays visible, never deleted." | "استُبدل هذا التأكيد بإعادة الجدولة — يبقى مرئياً، ولا يُحذف أبداً." |
| Day tally (the honest metric) | "Today: 5 confirmed · 0 declined · 1 expired · 1 unanswered · 3 pending." | "اليوم: 5 مؤكدة · 0 رفضاً · 1 منتهية · 1 بلا ردّ · 3 معلّقة." |
| Sample day badge | "Sample day — full lifecycle, synthetic customers. Clear it when real work arrives." | "يوم عيّنة — دورة حياة كاملة وعملاء تركيبيون. امسحه متى وصل العمل الحقيقي." |
| Customer touchpoint: booking request (outbound template, customer locale) | "Sanad Technical Services: your AC service visit is on Wednesday 4 November, 09:00–11:00, with Yousef. Reply YES to confirm, or contact us to reschedule." | "خدمات سند الفنية: زيارة صيانة التكييف يوم الأربعاء 4 نوفمبر، 09:00–11:00، مع يوسف. ردّ بنعم للتأكيد، أو تواصل معنا لإعادة الجدولة." |
| Customer touchpoint: arrival notice (outbound template, customer locale) | "Your technician is on the way — JOB-1001, arriving within the 09:00–11:00 window." | "فنيّك في الطريق — JOB-1001، وصول ضمن نافذة 09:00–11:00." |
| Customer touchpoint: completion sign-off request (outbound template, customer locale) | "Work is done on JOB-1001. Reply DONE to confirm completion — your confirmation closes the visit record." | "اكتمل العمل على JOB-1001. ردّ بـ«تم» لتأكيد الإتمام — تأكيدك يغلق سجل الزيارة." |

## F. Bidi/mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Latin technician name in Arabic chrome | "Anoop George — a Latin-script technician name inside the Arabic board. Rendered isolated; lane order follows the workspace setting." | "أنوب جورج — اسم فني بخط لاتيني داخل لوح عربي. يُعرض معزولاً؛ وترتيب المسارات يتبع إعداد مساحة العمل." |
| Arabic address inside an English card | "'الربيع — مجمع الفيلات 12' renders right-to-left inside the English job card — isolated, never force-flipped." | "تُعرض «الربيع — مجمع الفيلات 12» من اليمين إلى اليسار داخل البطاقة الإنجليزية — معزولة، ولا تُقلب قسراً." |
| Codes and phones inside Arabic sentences | "JOB-1009 and +966 50 123 4567 keep left-to-right order inside Arabic sentences — codes and phones never flip." | "تحافظ JOB-1009 و +966 50 123 4567 على اتجاهها داخل الجمل العربية — الرموز والهواتف لا تُقلب أبداً." |
