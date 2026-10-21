# 11 — Empty / Loading / Error: clinic-appointment-desk (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR · voice = reception-desk calm-plain (02: names and times over adjectives; warmth in success/empty, never in errors) · Arabic is فصحى بيضاء utility register, unvocalized · numerals Western everywhere per ledger row (never mixed systems mid-sentence) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · buttons are verbs with objects ≤3 words · PHI discipline: no reason-for-visit text, staff notes, or flag information appears in any string below (a11y-baseline §7; patient-facing copy never mentions flags — 12 Q-8) · terminology locked per 02: الموعد=appointment · يحجز=to book · الطبيب=provider · نوع الزيارة=visit type · قائمة الانتظار=waitlist · التعبئة التلقائية=auto-fill · عدم الحضور=no-show · وسم نمط عدم الحضور=no-show pattern flag · سلسلة التذكيرات=reminder ladder · تسجيل الحضور=check-in · العرض=offer · كشف اليوم=day sheet · الفترة=slot · القناة=channel.

## A. Empty states (P01: first-run / no-data-after-activity / no-access / filtered — never conflated)

| State | English | Arabic | Action |
|---|---|---|---|
| S1 first-run (sample day offered) | "No clinic day loaded yet. Open the sample day — a planted cancellation, a waitlist, and a ranked refill are ready to walk through." | "لا يوم عيادة محمّلاً بعد. افتح اليوم التجريبي — إلغاء مزروع وقائمة انتظار وتعبئة مرتّبة جاهزة للتجربة." | Open sample day / افتح اليوم التجريبي |
| S1 no-data-after-activity (cleared sample) | "The sample day is cleared. Real appointments appear here the moment the desk books them." | "مُسح اليوم التجريبي. تظهر المواعيد الحقيقية هنا فور حجزها من الاستقبال." | Book appointment / احجز موعداً |
| S1 filtered-empty | "No appointments match these filters on this day." | "لا مواعيد تطابق هذه المرشّحات في هذا اليوم." | Clear filters / امسح المرشّحات |
| S1 no-access (provider role, another provider's column) | "This column belongs to another provider. Your seat reads your own day only." | "هذا العمود يخصّ طبيباً آخر. مقعدك يقرأ يومك وحدك." | Go to my day / انتقل إلى يومي |
| S2 finder no-results | "No patient matches this name or number. Create the record — name and phone are enough to start." | "لا مريض يطابق هذا الاسم أو الرقم. أنشئ السجل — الاسم والهاتف يكفيان للبدء." | Create patient / أنشئ سجل المريض |
| S4 waitlist first-run | "The waitlist is empty. When a patient asks to be called if a slot opens, add them — tier, window, and provider." | "قائمة الانتظار فارغة. حين يطلب مريض الاتصال عند توفر موعد، أضفه — الأولية والنافذة والطبيب." | Add to waitlist / أضف إلى قائمة الانتظار |
| S4 waitlist filtered-empty | "No entries match these filters." | "لا طلبات تطابق هذه المرشّحات." | Clear filters / امسح المرشّحات |
| S4 no open fills | "No open slot is waiting for a fill. Fills appear the moment a cancellation or no-show opens a usable slot." | "لا فترة مفتوحة تنتظر تعبئة. تظهر التعبئة لحظة أن يفتح إلغاء أو عدم حضور فترة صالحة." | View waitlist / اعرض قائمة الانتظار |
| S5 outbox first-run | "No messages yet. The reminder ladder schedules itself with every booking — or send one now." | "لا رسائل بعد. سلسلة التذكيرات تُجدول نفسها مع كل حجز — أو أرسل واحدة الآن." | View ladder policy / اعرض سياسة السلسلة |
| S5 filtered-empty | "No messages match these filters." | "لا رسائل تطابق هذه المرشّحات." | Clear filters / امسح المرشّحات |
| S6 patient history empty (new patient) | "No appointments yet for this patient. Book the first one." | "لا مواعيد بعد لهذا المريض. احجز الأول." | Book appointment / احجز موعداً |
| S6 no-access | "This patient's record is outside your seat's scope." | "سجل هذا المريض خارج نطاق مقعدك." | Switch scope / بدّل النطاق |
| S7 providers first-run | "No providers yet. Add the first doctor — name and session hours are enough to start booking." | "لا أطباء بعد. أضف الطبيب الأول — الاسم وساعات العمل يكفيان لبدء الحجز." | Add provider / أضف طبيباً |
| S10 jobs empty | "Nothing running. Message batches, fill runs, and exports appear here while they work." | "لا مهام قيد التنفيذ. دفعات الرسائل وتشغيلات التعبئة والتصديرات تظهر هنا أثناء عملها." | — |

## B. Loading (P02/P12 — skeletons mirror geometry per direction; honest progress)

| State | English | Arabic |
|---|---|---|
| S1 board skeleton | column-shaped skeleton ×3 + "Loading the clinic day…" (SR) | هيكل أعمدة ×3 + "جارٍ تحميل يوم العيادة…" |
| Slot picker compute | "Finding free slots for Tuesday…" | "البحث عن فترات حرة ليوم الثلاثاء…" |
| Fill computation (large waitlists) | "Ranking waitlist candidates…" | "ترتيب مرشحي قائمة الانتظار…" |
| Message batch job (determinate) | "Sending 9 of 14 reminders — 5 more." | "إرسال 9 من 14 تذكيراً — بقيت 5." |
| Export job (milestones) | "Rendering the day sheet — provider lists 2 of 3." | "تجهيز كشف اليوم — قوائم الأطباء 2 من 3." |
| Patient finder search | instant (≤16ms budget — no spinner by contract) | فوري (لا مؤشر انتظار — الميزانية تضمن السرعة) |
| Autosave (policy editors, P10) | "Saving…" → "Saved" (fades) | "جارٍ الحفظ…" → "حُفظ" |
| S10 job row | determinate: "12 of 14"; indeterminate: "Working — no estimate yet" | "12 من 14" ؛ "قيد العمل — لا تقدير بعد" |

## C. Errors (7 classes; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (booking overlap) | "Dr. Amina already has an appointment 11:00–11:20 that day. Pick another slot — the picker shows every free one." | "لدى د. أمينة موعد 11:00–11:20 في ذلك اليوم. اختر فترة أخرى — المنتقي يعرض كل الفترات الحرة." |
| VALIDATION (required field) | "The patient needs a phone number before booking — it's how reminders and offers reach them." | "يحتاج سجل المريض رقم هاتف قبل الحجز — به تصل التذكيرات والعروض." |
| VALIDATION (un-offerable remainder) | "Only 5 minutes remain in that slot — the refill floor is 15. The slot closes honestly; nothing is offered." | "بقيت 5 دقائق فقط في الفترة — حدّ التعبئة 15. تُغلق الفترة بصدق ولا يُعرض شيء." |
| VALIDATION (lifecycle order) | "This appointment is already cancelled — a cancelled appointment cannot be checked in. Book a new one instead." | "هذا الموعد ملغى أصلاً — لا يمكن تسجيل الحضور لموعد ملغى. احجز موعداً جديداً بدلاً منه." |
| VALIDATION (session hours self-overlap) | "The new hours overlap the existing 16:00–19:00 session on Tuesday. Fix the window before saving." | "الساعات الجديدة تتقاطع مع جلسة 16:00–19:00 يوم الثلاثاء. صحّح النافذة قبل الحفظ." |
| VALIDATION (override without reason) | "Offering out of rank order needs a reason — it's recorded with the offer." | "العرض خارج الترتيب يحتاج سبباً — يُسجَّل مع العرض." |
| NOT_FOUND (stale appointment link) | "That appointment is gone from this clinic. It may have been cancelled while you were away." | "ذلك الموعد غاب عن العيادة. ربما أُلغي أثناء غيابك." → العودة إلى لوحة اليوم |
| NOT_FOUND (expired artifact) | "This day sheet expired 3 days ago. Regenerate it — the day it renders is unchanged." | "انتهت صلاحية كشف اليوم قبل 3 أيام. أعد توليده — اليوم الذي يعرضه لم يتغيّر." |
| PERMISSION (channel unbound) | "Channel sending needs the patient-messaging capability granted to this clinic. Grant it — or call with the script and record the outcome; the script path always works." | "الإرسال عبر القناة يتطلب منح قدرة مراسلة المرضى لهذه العيادة. امنحها — أو اتصل بالنص المعدّ وسجّل النتيجة؛ مسار الهاتف يعمل دائماً." |
| PERMISSION (provider role on staff action) | "Your provider seat reads the day — booking and policies belong to the front desk." | "مقعد الطبيب يقرأ اليوم — الحجز والسياسات من عمل الاستقبال." |
| CONFLICT (concurrent appointment edit) | "Sara saved a change to this appointment while you did. Both versions are kept — choose what stays." | "حفظت سارة تغييراً في هذا الموعد أثناء عملك. الاحتفاظ بالنسختين — اختر ما يبقى." |
| CONFLICT (slot double-fill) | "The 11:00 slot just filled — another desk booked it a moment ago. The fill is closed; the waitlist is untouched." | "امتلأت فترة 11:00 للتو — حجزها مكتب آخر قبل لحظات. أُغلقت التعبئة؛ وقائمة الانتظار كما هي." |
| CONFLICT (message already replied) | "This message already carries a recorded reply from 09:40. Both outcomes are kept — verify with the patient before changing anything." | "تحمل هذه الرسالة رداً مسجلاً من 09:40. النتيجتان محفوظتان — تحقّق من المريض قبل أي تغيير." |
| RATE_LIMIT (channel quota) | "The channel's sending window is used for now. Send by phone script — the record and the expiry clock are identical either way." | "استُهلكت نافذة إرسال القناة مؤقتاً. أرسل عبر نص الهاتف — السجل وساعة الانتهاء ذاتان في الحالين." |
| NETWORK (board fetch) | "The day went stale — reconnecting. Everything you checked in or completed is kept." | "تقادم اليوم — تجري إعادة الاتصال. كل ما سجّلته أو أتممته محفوظ." |
| NETWORK (message partial) | "The batch delivered 12 of 14 — 2 failed with the connection. Retry just those 2." | "سلّمت الدفعة 12 من 14 — فشلت 2 بسبب الاتصال. أعد محاولة الاثنتين وحدهما." |
| UNKNOWN | "Something failed on our side (ref cad-corr-0001). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع cad-corr-0001). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips + counts, no confetti)

| Moment | English | Arabic |
|---|---|---|
| Appointment booked | "Booked — 9:40 with Dr. Amina, 20 minutes. The reminder ladder is scheduled." | "تم الحجز — 9:40 مع د. أمينة، 20 دقيقة. سلسلة التذكيرات مجدولة." |
| Check-in | "Checked in — the block moves to waiting." | "تم تسجيل الحضور — ينتقل المربع إلى الانتظار." |
| Consult completed | "Completed — 12 done today." | "اكتملت الاستشارة — 12 منجزة اليوم." |
| No-show declared | "No-show recorded — the pattern count is now 4 in the last 180 days, and the 11:00 slot is open for refill." | "سُجّل عدم الحضور — أصبح عدد النمط 4 في آخر 180 يوماً، وفترة 11:00 مفتوحة للتعبئة." |
| Cancellation recorded | "Cancelled at the patient's request — the slot is open. Run the waitlist fill?" | "أُلغي بطلب المريض — الفترة مفتوحة. تشغيل تعبئة قائمة الانتظار؟" |
| Reminder batch sent | "14 reminders sent — 12 by channel, 2 by phone script, all recorded." | "أُرسلت 14 تذكيراً — 12 عبر القناة و2 بنص الهاتف، كلها مسجلة." |
| Reply recorded (confirmed) | "Reply recorded — confirmed for tomorrow 10:00." | "سُجّل الرد — التأكيد لغد 10:00." |
| Undo window (P03, exclusion-class) | "Message retry cancelled — Undo (7s)" | "أُلغيت إعادة محاولة الرسالة — تراجع (7 ثوانٍ)" |
| Day sheet ready | "Day sheet ready — board, provider lists, and counts. Expires in 7 days." | "كشف اليوم جاهز — اللوحة وقوائم الأطباء والعدّادات. تنتهي صلاحيته بعد 7 أيام." |

## E. Waitlist & flag moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| Fill proposal ready | "5 candidates ranked — 4 eligible. Every row shows its inputs: tier, days waited, no-show penalty." | "5 مرشحين مرتبين — 4 مؤهلين. كل صف يعرض مدخلاته: الأولية وأيام الانتظار وخصم عدم الحضور." |
| Offer sent | "Offer sent to the top candidate — expires in 15 minutes. Decline or expiry moves to the next." | "أُرسل العرض للمرشح الأول — ينتهي بعد 15 دقيقة. الرفض أو الانتهاء ينقل للمرشح التالي." |
| Offer accepted (the Slot Refill moment) | "Slot refilled from the waitlist — 11:00 with Dr. Amina, 4 entries remain." | "تمت تعبئة الموعد من قائمة الانتظار — 11:00 مع د. أمينة، وتبقى 4 طلبات." |
| Offer expired | "The offer expired unanswered — the next candidate is ready. The entry stays on the list." | "انتهى العرض دون رد — المرشح التالي جاهز. ويبقى الطلب في القائمة." |
| Offer declined | "Declined — recorded, and this entry stays eligible for other slots." | "رُفض الطلب — مسجل، ويظل الطلب مؤهلاً لفترات أخرى." |
| Offers exhausted | "No takers after 3 offers — the slot stays open. Book directly if someone calls." | "لا مجيب بعد 3 عروض — تبقى الفترة مفتوحة. احجز مباشرة إن اتصل أحد." |
| Out-of-rank override | "Offered out of rank order — your reason is recorded with the offer." | "عُرض خارج الترتيب — سببك مسجّل مع العرض." |
| Flag surfaced (booking, staff-facing) | "No-show pattern: 3 in the last 180 days. Booking proceeds — the flag informs, it never blocks. See the policy." | "وسم نمط عدم الحضور: 3 في آخر 180 يوماً. الحجز يستمر — الوسم يُعلم ولا يمنع. اعرض السياسة." |
| Flag verify list (patient view) | "Behind this flag: 3 appointments — dates and states below, no clinical details." | "خلف هذا الوسم: 3 مواعيد — التواريخ والحالات أدناه، دون أي تفاصيل سريرية." |
| Flag window boundary | "2 older no-shows sit outside the 180-day window — they don't count." | "عدم حضوران أقدم خارج نافذة 180 يوماً — لا يُحتسبان." |
| Penalty disclosure (fill row) | "Penalty −30: 3 no-shows in the window. The rule and its cap are in the policy panel." | "الخصم −30: 3 حالات عدم حضور في النافذة. القاعدة وحدّها في لوحة السياسات." |
| Ineligible row reason (window-miss) | "Not offered — the requested window starts 20 Oct." | "لا يُعرض — النافذة المطلوبة تبدأ 20 أكتوبر." |
| Ineligible row reason (already-booked) | "Not offered — the patient already has an appointment that day." | "لا يُعرض — لدى المريض موعد في ذلك اليوم." |
| Ranking disclosure (policy panel) | "Ranking = urgent tier 100 + 2 per day waited (cap 60 days) − 10 per no-show in window (cap 30). Ties: earlier request first." | "الترتيب = أولية عاجلة 100 + 2 لكل يوم انتظار (بحدّ 60 يوماً) − 10 لكل عدم حضور في النافذة (بحدّ 30). التعادل: الطلب الأسبق أولاً." |
| Ladder disclosure | "Reminders: 48 hours before, and same-day at 08:00. Each carries the clinic's cancellation policy line. The ladder never cancels — the desk decides." | "التذكيرات: قبل 48 ساعة، ويوم الموعد الساعة 08:00. كل تذكير يحمل سطر سياسة الإلغاء الخاص بالعيادة. السلسلة لا تُلغي أبداً — القرار للاستقبال." |
| Shared-phone disclosure (finder) | "2 patients share this number — pick the right record." | "مريضان يتشاركان هذا الرقم — اختر السجل الصحيح." |
| Phone-script path (send surface) | "Send through the channel if bound — or call and read the script, then record the outcome. Both paths count." | "أرسل عبر القناة إن كانت مربوطة — أو اتصل واقرأ النص ثم سجّل النتيجة. المساران يُحتسبان." |
| Sample-day badge | "Sample day — a planted cancellation and a ranked waitlist. Clear it when real patients arrive." | "يوم تجريبي — إلغاء مزروع وقائمة انتظار مرتبة. امسحه عند وصول المرضى الحقيقيين." |
| Policy forward-only notice | "Policy changes apply from now on — today's sent messages stay sent." | "تغييرات السياسة تسري من الآن — رسائل اليوم المُرسلة تبقى مُرسلة." |

## F. Bidi/mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Latin name in RTL board | "Ina Sharma — Latin-script name inside the RTL column. Rendered isolated; the block's reading order never flips the name." | "Ina Sharma — اسم بخط لاتيني داخل العمود العربي. يُعرض معزولاً؛ وترتيب قراءة المربع لا يقلب الاسم أبداً." |
| Arabic provider in LTR session | "'د. أمينة الرشيد' renders right-to-left inside the English session — isolated, never force-flipped." | "تُعرض 'د. أمينة الرشيد' من اليمين إلى اليسار داخل الجلسة الإنجليزية — معزولة، ولا تُقلب قسراً أبداً." |
| Time + code tokens in Arabic strings | "Times and visit-type codes (CONS) are Western-numeral Latin tokens inside Arabic prose — isolated at every interpolation point." | "الأوقات ورموز أنواع الزيارة (CONS) رقوم لاتينية غربية داخل نثر عربي — معزولة عند كل نقطة إدراج." |
| Phone number rendering | "Phone numbers stay Western digits and left-to-right inside RTL copy — an isolating run, never reordered." | "تبقى أرقام الهواتف رقوماً غربية ومن اليسار إلى اليمين داخل النص العربي — مقطع معزول، لا يُعاد ترتيبه." |
