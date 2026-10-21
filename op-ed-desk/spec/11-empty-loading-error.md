# 11 — Empty / Loading / Error: op-ed-desk (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN + AR (فصحى بيضاء). Voice: newsroom-terse (02); glossary fixed in 02. Arabic prose uses Arabic-Indic numerals; metadata Western (05). Every empty has one action (P01); every error = [what]+[why]+[next] (copy-voice §1.4).

## A. Empty states

| Surface & state | English | Arabic | Action |
|---|---|---|---|
| S1 queue first-run | "The queue is empty. Share the intake form — the first submission lands here." | "القائمة فارغة. شارك نموذج الاستلام — أول مقال مُرسَل يصل إلى هنا." | Copy form link / نسخ رابط النموذج |
| S1 filtered-empty | "No submissions match these filters." | "لا مقالات مُرسَلة تطابق هذه المرشّحات." | Clear filters / إلغاء المرشّحات |
| S1 archive empty | "Nothing archived yet. Declined pieces move here once their letters are sent." | "لا مؤرشف بعد. المقالات المرفوضة تنتقل إلى هنا بعد إرسال خطاباتها." | — |
| S1 no-access (reviewer role) | "The triage queue is editor-only. Your rounds are on the rounds board." | "قائمة الفرز للمحررين وحدهم. جولاتك في لوحة الجولات." | Go to rounds / الانتقال إلى الجولات |
| S4 rounds empty | "No rounds in flight. Advance a submission from the queue to open one." | "لا جولات مراجعة جارية. قدِّم مقالاً من القائمة لفتح واحدة." | Go to queue / الانتقال إلى القائمة |
| S2 lint sidebar, no report yet | "No lint report yet. Run the deterministic pass — it always works." | "لا تقرير تدقيق بعد. شغِّل الفحص الحتمي — يعمل دائماً." | Run lint / تشغيل التدقيق |
| S2 report, zero findings | "Clean pass — no findings on the deterministic rules." | "فحص نظيف — لا ملاحظات على القواعد الحتمية." | — |
| S6 contributor files first-run | "Contributor files fill as submissions arrive. Each writer gets a history page." | "ملفات الكتّاب تمتلئ بورود المقالات. لكل كاتب صفحة تاريخ." | Go to queue / الانتقال إلى القائمة |
| S6 search returned-empty | "No contributor matches this search." | "لا كاتب يطابق هذا البحث." | Clear search / إلغاء البحث |
| S7 jobs empty | "Nothing running. Lint passes appear here while they work." | "لا مهام قيد التنفيذ. عمليات التدقيق تظهر هنا أثناء عملها." | — |

## B. Loading states (P02/P12 — skeletons mirror ruled rows, RTL-mirrored)

| Surface & state | English | Arabic |
|---|---|---|
| S1 queue boot | (skeleton rows ×10) + SR: "Loading the submissions queue…" | "جارٍ تحميل قائمة المقالات المُرسَلة…" |
| S3 blind workspace | "Preparing the anonymized copy…" | "تحضير النسخة المُجهَّلة…" |
| Lint job running | "Checking rule category 3 of 7 — Arabic punctuation" | "فحص فئة القواعد ٣ من ٧ — الترقيم العربي" |
| Decision sending | "Sending the decision letter…" | "إرسال خطاب القرار…" |
| S9 submitting | "Submitting your article…" | "جارٍ إرسال مقالك…" |
| S9 status check | "Checking the reference code…" | "التحقق من رمز المتابعة…" |
| S7 job row (indeterminate) | "Working — no estimate yet" | "قيد العمل — لا تقدير بعد" |

## C. Error states (7-class taxonomy — every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (exclusivity, S9) | "The exclusivity confirmation is required — the desk only considers unpublished, exclusive submissions." | "تأكيد الحصرية مطلوب — القسم لا ينظر إلا في المقالات غير المنشورة والحصرية." |
| VALIDATION (override rationale, S5) | "An override needs a written rationale — the round was split." | "يحتاج التجاوز إلى مسوّغ مكتوب — كانت الجولة منقسمة." |
| VALIDATION (COI guard block, S4) | "Conflict-of-interest match: organization. Desk policy blocks this assignment — pick another reviewer." | "تطابق تضارب مصالح: جهة عمل. سياسة القسم تمنع هذا التعيين — اختر مراجعاً آخر." |
| NOT_FOUND (stale desk link, S2) | "That submission is no longer in this desk's queue. It may have been archived after a decision." | "لم يعد ذلك المقال في قائمة القسم. ربما أُرشف بعد قرار." |
| NOT_FOUND (reference code, S9) | "This reference code doesn't match a submission. Check the code on your receipt." | "رمز المتابعة هذا لا يطابق أي مقال. تحقق من الرمز في إيصالك." |
| PERMISSION (reviewer opens full view) | "The full view is editor-only. Your round reads the anonymized copy." | "العرض الكامل للمحررين وحدهم. جولتك تقرأ النسخة المُجهَّلة." |
| CONFLICT (round closed, S3) | "The round closed while you wrote. Its decision is recorded — your notes are kept in the round file." | "أُغلقت الجولة أثناء كتابتك. قرارها مسجَّل — وملاحظاتك محفوظة في ملف الجولة." |
| CONFLICT (triage on in-round, S1) | "Another editor advanced this submission to a round. Triage is no longer possible." | "قدَّم محرر آخر هذا المقال إلى جولة. لم يعد الفرز ممكناً." |
| CONFLICT (revision mismatch, S9) | "This piece was decided differently after your letter — start a new submission instead of a revision." | "قُرر في هذا المقال خلاف خطابك — ابدأ مقالاً جديداً بدل مراجعة." |
| RATE_LIMIT (full-pass quota, S2) | "This month's full-pass window is used. The deterministic pass keeps working — full passes resume on {date}." | "استُهلكت نافذة الفحص الكامل لهذا الشهر. الفحص الحتمي يعمل — وتُستأنف الفحوص الكاملة في {تاريخ}." |
| NETWORK (queue stale, S1) | "The queue went stale — reconnecting. Every recorded decision is safe." | "تقادمت القائمة — تجري إعادة الاتصال. كل قرار مسجَّل آمن." |
| NETWORK (send failed, S5) | "The letter didn't send — the connection dropped. It's saved unsent; copy it manually or retry." | "لم يُرسَل الخطاب — انقطع الاتصال. محفوظ غير مُرسَل؛ انسخه يدوياً أو أعد المحاولة." |
| NETWORK (offline banner, P20) | "You're offline. Reads work; sends queue and retry when you're back." | "أنت غير متصل. القراءة تعمل؛ والإرسالات تُصفّ وتُعاد المحاولة عند عودتك." |
| UNKNOWN (any) | "Something failed on our side (ref {id}). Retry — quote the reference if it repeats." | "حدث خلل لدينا (مرجع {id}). أعد المحاولة — واذكر المرجع إن تكرر." |

## D. Success & status

| Moment | English | Arabic |
|---|---|---|
| Submission received (S9) | "Received. Your reference code is {code} — keep it; it's the only way to check status." | "تم الاستلام. رمز متابعتك {code} — احتفظ به؛ فهو وسيلتك الوحيدة للاستعلام." |
| Round opened (S4) | "Round opened — 2 reviewers, blind copies, due in 48 hours." | "فُتحت الجولة — مراجعان، نسختان مُجهَّلتان، تستحق خلال ٤٨ ساعة." |
| Review submitted (S3) | "Recommendation submitted — the round summary updates when both reviews are in." | "أُرسلت التوصية — يُحدَّث ملخص الجولة عند ورود المراجعتين." |
| Lint complete (S2) | "Lint complete — 14 findings: 3 policy, 9 style, 2 integrity." | "اكتمل التدقيق — ١٤ ملاحظة: ٣ سياسات، ٩ أسلوبية، ٢ سلامة." |
| Decision recorded (S5) | "Decision recorded — the letter is saved. Send it when you're ready." | "سُجِّل القرار — الخطاب محفوظ. أرسله متى شئت." |
| Letter sent / sent manually (S5) | "Letter sent to the contributor — and logged." / "Marked sent manually — the desk's own channel delivered it." | "أُرسل الخطاب إلى الكاتب — وسُجِّل ذلك." / "وُسم مُرسَلاً يدوياً — قناة القسم نفسها أوصلته." |
| Revision linked (S2 chain) | "Revision linked — the chain now holds 2 versions and both letters." | "رُبطت المراجعة — تحمل السلسلة الآن إصدارين وخطابين." |
| Status retrieved (S9) | "Your article is in an anonymized review round — decision typically within 5 days." | "مقالك في جولة مراجعة مُجهَّلة — القرار عادةً خلال ٥ أيام." |

## E. Product-signature moments

| Moment | English | Arabic |
|---|---|---|
| Leak flagged (S3) | "Leak flagged — the round is paused. A new anonymized copy (v2) is ready; reviewers resume on it." | "وُسم تسريب — الجولة متوقفة. نسخة مُجهَّلة جديدة (الإصدار ٢) جاهزة؛ يستأنف المراجعون عليها." |
| Degraded full pass (S2) | "Full pass unavailable right now — showing the deterministic report. Categories dropped: coherence, redundancy." | "الفحص الكامل غير متاح الآن — عرض التقرير الحتمي. الفئات المُسقَطة: التماسك، التكرار." |
| Dialect flag (S2 finding) | "This passage reads Levantine, not MSA — quoted speech? Acknowledge it or leave the flag." | "تُقرأ هذه الفقرة بالشامية لا بالفصحى — كلام منقول؟ أقرِّ بها أو اترك الملاحظة." |
| Numeral mix (S2 finding) | "Numerals mix systems mid-prose — ٠-٩ and 0-9 in one paragraph." | "الأرقام تخلط النظامين في النص — ٠-٩ و0-9 في فقرة واحدة." |
| COI warning, non-blocking (S4) | "Conflict-of-interest match: organization. Assign anyway with a note, or pick another reviewer." | "تطابق تضارب مصالح: جهة عمل. عيِّن رغم ذلك مع ملاحظة، أو اختر مراجعاً آخر." |
| Override gate (S5) | "The round split 1–1. Your decision overrides it — the rationale is part of the record." | "انقسمت الجولة ١–١. قرارك يتجاوزها — والمسوّغ جزء من السجل." |
| Review integrity statement (S3) | "I reviewed the anonymized copy and did not seek the contributor's identity." | "راجعتُ النسخة المُجهَّلة ولم أبحث عن هوية الكاتب." |
| Word-band warning at intake (S9) | "Your piece runs 1,340 words — the desk's band is 650–900. It goes in flagged, not blocked." | "يمتد مقالك إلى ١٣٤٠ كلمة — نطاق القسم ٦٥٠–٩٠٠. يدخل موسوماً لا محجوباً." |
