# 11 — Empty / Loading / Error: hiring-pipeline-desk (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN + AR (the workspace flips direction — 05; both locales are first-class) · voice = **warm, brisk, evidence-first** (02: state what was asked, what was rated, what the rules marked; warmth lives in success and empty copy, never in errors) · Arabic is فصحى بيضاء · **numerals Western everywhere per ledger row** (ratings, weights, means, counts, dates — a data surface; never mixed systems mid-sentence, copy-voice §1.7) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked (02): وظيفة شاغرة=job opening · مرشح=candidate · طلب التقديم=application · مرحلة=stage · لوح المسار=pipeline board · دليل المقابلة=interview kit · جدارة=competency · سؤال=question · مقابلة=interview · بطاقة التقييم=scorecard · توصية=recommendation · قرار التوظيف=hiring decision · تنبيه الانحياز=bias nudge · مناقشة التقييمات=debrief · ختم الاستقلالية=independence seal · سبب الرفض=rejection reason · سجل النشاط=activity log · تصدير=export. Recommendation values: موافق بشدة / موافق / غير موافق / غير موافق بشدة. Seed stage-name fixtures (bilingual, per the workspace template): Applied/التقديم · Screening/الفرز · Interview/المقابلة · Decision/القرار · Hired/تم التوظيف · Rejected/مرفوض · Withdrawn/منسحب.

## A. Empty states (the four empties of P01, per surface)

| State | English | Arabic | Action |
|---|---|---|---|
| S1 first-run (no openings) | "No openings yet. Create one with a bilingual title, or open the sample and watch a bias nudge fire on a real scorecard." | "لا وظائف شاغرة بعد. أنشئ واحدة بعنوانٍ ثنائي اللغة، أو افتح النموذج وشاهد تنبيه انحياز يظهر على بطاقة تقييم حقيقية." | Create opening / Open the sample |
| S1 filtered-empty | "No openings match these filters. Clear them to see the full list." | "لا وظائف شاغرة تطابق هذه المرشّحات. امسحها لرؤية القائمة كاملة." | Clear filters |
| S1/S2 no-access | "This hiring desk belongs to another workspace." | "مكتب التوظيف هذا يخصّ مساحة عمل أخرى." | Switch workspace |
| S2 board empty (opening live, no applications) | "No candidates in this pipeline yet. Add one by name pair, or paste a batch — both land at Applied." | "لا مرشحين في هذا المسار بعد. أضف واحداً بزوج الأسماء، أو الصق دفعة — كلاهما يهبط في التقديم." | Add candidate / Paste import |
| S2 filtered-empty (data exists outside the filter) | "No applications match these filters — the pipeline holds 14. Clear the filters to see them." | "لا طلبات تقديم تطابق هذه المرشّحات — المسار يحمل 14. امسح المرشّحات لرؤيتها." | Clear filters |
| S2 terminal columns, none yet | "No terminal decisions yet. Rejections and withdrawals land here — reasons on the record." | "لا قرارات نهائية بعد. الرفض والانسحاب يهبطان هنا — والأسباب على السجل." | — |
| S4 kit empty (no kit yet — the non-happy path of 03) | "No kit yet — interviews need questions in the interview's language. Start with 4 competencies, or take the sample kit." | "لا دليل مقابلة بعد — تحتاج المقابلات أسئلة بلغة المقابلة. ابدأ بأربع جدارات، أو خذ الدليل النموذجي." | Start the kit / Take the sample kit |
| S4 no competencies yet (kit first-run) | "The kit starts with competencies — 4 to 6, weights summing to 100, each named in both languages." | "يبدأ الدليل بالجدارات — من 4 إلى 6، بأوزان مجموعها 100، وكلٌّ منها مسمّى باللغتين." | Add competency |
| S4 assist unbound (settings + panel) | "The question assist is not granted. The template bank drafts every question — vetted, bilingual, deterministic. That is the studio's default state, not a fallback." | "مساعدة الأسئلة غير ممنوحة. بنك القوالب يصوغ كل سؤال — مُتحرّى، ثنائي اللغة، حتمي. هذه حالة الاستوديو الافتراضية، لا بديل طارئ." | Grant capability (kind shown) / Draft from the bank |
| S5 scorecard not-started | "Your scorecard is not started. The kit's questions sit above, in the language this interview runs in." | "بطاقة تقييمك لم تبدأ بعد. أسئلة الدليل في الأعلى، بلغة هذه المقابلة." | Start rating |
| S6 debrief, no interviews in the round | "No interviews in this round yet — the debrief computes from submitted scorecards, and there are none to read." | "لا مقابلات في هذه الجولة بعد — تُحسب مناقشة التقييمات من بطاقات مسلّمة، ولا بطاقات للقراءة." | Schedule an interview |
| S6 debrief readiness (withheld — a state, not an empty) | "1 of 2 scorecards in. Means are withheld until all cards land — a mean of half the room is a rumor." | "بطاقة واحدة من 2. تُحجب المتوسطات حتى تكتمل البطاقات — متوسط نصف الغرفة إشاعة." | — |
| S7 candidates directory empty | "No candidates yet. A candidate is a name pair — Latin and Arabic, at least one — and a way to reach them." | "لا مرشحين بعد. المرشح زوج أسماء — لاتيني وعربي، أحدهما على الأقل — ووسيلة للوصول إليه." | Add candidate |
| S8 interviews list, "mine" empty | "No interviews on your list. When one is scheduled, its language and its kit appear here." | "لا مقابلات في قائمتك. عند جدولة واحدة، تظهر لغتها ودليلها هنا." | — |
| S9 jobs center empty | "Nothing running. Imports, assist runs, and exports appear here while they work." | "لا شيء قيد التنفيذ. الاستيرادات وتشغيلات المساعدة والتصديرات تظهر هنا أثناء عملها." | — |
| S10 activity log empty | "No activity yet. Every move, card, nudge, and decision lands here with its actor and time." | "لا نشاط بعد. كل حركةٍ وبطاقةٍ وتنبيهٍ وقرار يهبط هنا بفاعله ووقته." | — |
| Sample opening cleared | "The sample opening is cleared. It never returns — your workspace holds only what you put in it." | "أُزيلت الوظيفة النموذجية. لا تعود أبداً — مساحة عملك تحمل ما وضعته فيها وحده." | — |

## B. Loading (P02/P12 — skeletons mirror board/card/kit geometry per direction, RTL skeletons flip; honest determinate progress)

| State | English | Arabic |
|---|---|---|
| S2 board skeleton | skeleton cards ×8 + "Loading the board…" (SR) | بطاقات هيكلية ×8 + "جارٍ تحميل لوح المسار…" |
| S3 application detail boot | timeline skeleton with the interviews block reserved | هيكلية الخط الزمني مع حجز مقطع المقابلات |
| S4 kit boot | composer skeleton mirroring the bilingual competency rows | هيكلية المُحرِّر تطابق صفوف الجدارات الثنائية |
| S5 scorecard boot | card skeleton with the rating grid reserved | هيكلية البطاقة مع حجز شبكة التقييم |
| Import Job (determinate) | "Importing 9 of 14 candidates — invalid rows will be named." | "استيراد 9 من 14 مرشحاً — الصفوف غير الصالحة ستُسمّى." |
| Assist run (assist mode, streaming) | "Proposing questions — Communication in Arabic, Arabic, mid level. Each waits for your accept or dismiss." | "صوغ الأسئلة — التواصل بالعربية، بالعربية، مستوى متوسط. كل سؤال ينتظر قبولك أو رفضك." |
| Assist run (template mode) | "From the template bank — not generated. 3 questions, no quota used." | "من بنك القوالب — ليست مولَّدة. 3 أسئلة، بلا استهلاكٍ للحصة." |
| Scorecard draft autosave | "Saving draft…" | "جارٍ حفظ المسودة…" |
| Scorecard submit in flight | "Submitting your scorecard…" | "جارٍ تسليم بطاقة تقييمك…" |
| Export Job | "Assembling the opening package — slate, scorecards, decisions, activity ledger." | "تجميع حزمة الوظيفة — القائمة والبطاقات والقرارات وسجلّ النشاط." |
| Artifact retrieval | "Retrieving the artifact — it expires in 7 days and regenerates identically." | "استرجاع المُخرَج — تنتهي صلاحيته بعد 7 أيام ويُعاد توليده مطابقاً." |

## C. Errors (all 7 classes; every error names the next action — the 03 failure→error mapping, verbatim)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (kit competency count) | "A kit carries 4 to 6 competencies — this one has 3. Add at least one more." | "يحمل الدليل من 4 إلى 6 جدارات — هذا يحمل 3. أضف جدارةً أخرى على الأقل." |
| VALIDATION (weights drift) | "Competency weights must sum to 100 — they sum to 85, 15 short." | "يجب أن يبلغ مجموع أوزان الجدارات 100 — يبلغ 85، وينقص 15." |
| VALIDATION (bilingual coverage gate at scheduling) | "Cannot schedule an Arabic interview — 1 competency has no Arabic questions: Safety Compliance. Add the questions, then schedule." | "لا يمكن جدولة مقابلة عربية — جدارة واحدة بلا أسئلة عربية: الالتزام بالسلامة. أضف الأسئلة ثم جدوِل." |
| VALIDATION (scorecard missing rating) | "Communication in Arabic is unrated — every competency needs a rating before submit." | "التواصل بالعربية بلا تقييم — كل جدارةٍ تحتاج تقييماً قبل التسليم." |
| VALIDATION (scorecard empty evidence) | "Customer Empathy has no evidence — a rating without evidence is just a number." | "التعاطف مع العميل بلا دليل — التقييم بلا دليلٍ مجرّد رقم." |
| VALIDATION (recommendation missing) | "Choose a recommendation — strong-yes, yes, no, or strong-no." | "اختر توصية — موافق بشدة، موافق، غير موافق، أو غير موافق بشدة." |
| VALIDATION (debrief gate — decision early) | "1 of 2 scorecards submitted — Dalal's card is missing. The decision waits for the full room." | "سُلِّمت بطاقة واحدة من 2 — بطاقة دلال ناقصة. القرار ينتظر الغرفة كاملة." |
| VALIDATION (reject without rationale) | "A rejection needs a rationale — it is the answer when someone asks why, six weeks later." | "الرفض يحتاج مبرراً — هو الجواب حين يسأل أحدهم لماذا، بعد ستة أسابيع." |
| VALIDATION (hold without review date) | "A hold needs a review-on date — otherwise it is a rejection without the honesty." | "التجميد يحتاج تاريخ مراجعة — وإلا فهو رفضٌ بلا صدق." |
| VALIDATION (terminal move without reason) | "Moving to Rejected needs a reason — it stays on the record permanently." | "الانتقال إلى مرفوض يحتاج سبباً — يبقى على السجل بشكلٍ دائم." |
| VALIDATION (import row shape) | "Row 9 has no name in either language — rows 1 to 8 imported. Fix row 9 and paste it again." | "الصف 9 بلا اسم بإحدى اللغتين — استُوردت الصفوف 1 إلى 8. صحّح الصف 9 والصقه مجدداً." |
| VALIDATION (nudge dismissal without reason) | "Dismissing a nudge needs a reason — 'standing by my read' is a valid one." | "رفض التنبيه يحتاج سبباً — 'أتحمّل قراءتي' سبب صالح." |
| VALIDATION (opening count / paused opening at scheduling) | "This opening is paused — schedule interviews when it is open again." | "هذه الوظيفة موقوفة — جدوِل المقابلات حين تُفتح مجدداً." |
| NOT_FOUND (stale link) | "That opening, application, or interview is gone from this workspace — it may have been closed while you were away." → Return to the board | "تلك الوظيفة أو طلب التقديم أو المقابلة غابت عن مساحة العمل — ربما أُغلقت أثناء غيابك." ← العودة إلى اللوح |
| NOT_FOUND (expired artifact) | "This export expired 3 days ago. Regenerate it — the opening's state is unchanged, so the package will be identical." | "انتهت صلاحية هذا التصدير قبل 3 أيام. أعد توليده — حالة الوظيفة لم تتغيّر، فستكون الحزمة مطابقة." |
| PERMISSION (sealed scorecard fetch) | "Scorecards are sealed until you submit yours — the independence seal is the method, not a courtesy." | "بطاقات التقييم مختومة حتى تُسلّم بطاقتك — ختم الاستقلالية هو المنهج، لا مجاملة." |
| PERMISSION (role boundary on the board) | "Interviewer seats read the board and write scorecards. Moving applications needs a recruiter or hiring-manager seat." | "مقاعد المحاورين تقرأ اللوح وتكتب البطاقات. نقل طلبات التقديم يتطلب مقعد مسؤول توظيف أو مدير توظيف." |
| PERMISSION (capability unconsented) | "The question assist needs its capability granted to this workspace. Grant it — or draft from the template bank; the bank always works." | "تحتاج مساعدة الأسئلة إلى منح قدرتها لمساحة العمل هذه. امنحها — أو اصوغ من بنك القوالب؛ البنك يعمل دائماً." |
| CONFLICT (concurrent kit save) | "Another seat saved this kit while you did. Both versions are kept side by side — choose what stays." | "حفظ مقعدٌ آخر هذا الدليل أثناء عملك. النسختان محفوظتان جنباً إلى جنب — اختر ما يبقى." |
| CONFLICT (stale stage move) | "Another seat moved this application first — it is in Interview now. Reload the card and move from there." | "نقل مقعدٌ آخر طلب التقديم هذا أولاً — هو في المقابلة الآن. أعد تحميل البطاقة وانقلها من هناك." |
| CONFLICT (scorecard stale draft) | "Your draft was saved later from another device. Both versions are kept — choose what you submit." | "حُفظت مسودتك لاحقاً من جهازٍ آخر. النسختان محفوظتان — اختر ما تُسلّمه." |
| CONFLICT (interviewer double-booking) | "Dalal is booked — this interview overlaps 'Junior Accountant round 2' at 10:00. Pick another time." | "دلال محجوزة — تتقاطع هذه المقابلة مع 'محاسب مبتدئ، الجولة 2' الساعة 10:00. اختر وقتاً آخر." |
| CONFLICT (decision vs late card) | "A scorecard landed while you recorded this decision — it did not record. Read the debrief with all cards in, then decide again." | "هبطت بطاقة تقييم أثناء تسجيلك هذا القرار — لم يُسجَّل. اقرأ مناقشة التقييمات ببطاقاتها كاملة ثم قرّر مجدداً." |
| RATE_LIMIT (assist quota) | "This window's assist runs are used — 20 of 20. The template bank keeps drafting; proposals resume 1 Nov." | "استُهلكت تشغيلات المساعدة لهذه النافذة — 20 من 20. بنك القوالب يواصل الصوغ؛ وتستأنف المقترحات في 1 نوفمبر." |
| RATE_LIMIT (export quota) | "The export window is used for this cycle — the next package frees up on 1 Nov. Nothing about the opening changes." | "استُهلكت نافذة التصدير لهذه الدورة — تتحرر الحزمة التالية في 1 نوفمبر. لا شيء في الوظيفة يتغيّر." |
| NETWORK (list fetch) | "The board went stale — reconnecting. Every move you made is safe." | "تقادم اللوح — تجري إعادة الاتصال. كل حركةٍ قمت بها آمنة." |
| NETWORK (artifact delivery) | "The artifact download dropped mid-way — the file is held, retrying. Nothing to regenerate." | "انقطع تنزيل المُخرَج في منتصفه — الملف محفوظ وتُعاد المحاولة. لا شيء يحتاج إعادة توليد." |
| UNKNOWN | "Something failed on our side (ref hpd-corr-0001). Retry — if it repeats, quote the reference." | "حدث خللٌ لدينا (مرجع hpd-corr-0001). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips + counts; the energetic overshoot is reserved for the unseal, nothing else)

| Moment | English | Arabic |
|---|---|---|
| Opening created | "Opening created — bilingual titles on record. The kit studio is one click away." | "أُنشئت الوظيفة الشاغرة — العنوانان على السجل. استوديو الدليل على بعد نقرة." |
| Kit saved | "Kit saved — version 3. Scheduled interviews keep the version they were scheduled on." | "حُفظ الدليل — الإصدار 3. المقابلات المجدولة تحتفظ بالإصدار الذي جُدولت عليه." |
| Question accepted (the P15 gate) | "Question added to Communication in Arabic — origin: ai-assisted, your accept on record." | "أُضيف السؤال إلى التواصل بالعربية — المصدر: بمساعدةٍ آلية، وقبولك على السجل." |
| Template questions inserted | "3 questions added from the template bank — origin: template, no quota used." | "أُضيفت 3 أسئلة من بنك القوالب — المصدر: قالب، بلا استهلاكٍ للحصة." |
| Candidate added | "Candidate added — نوف الراشد is one record in both scripts." | "أُضيف المرشح — نوف الراشد سجل واحد بالخطين." |
| Import done | "14 candidates in — 2 duplicates skipped by email, 1 invalid row named. 12 applications created at Applied." | "دخل 14 مرشحاً — تخطّي 2 مكررين بالبريد، وسُمّي صف غير صالح واحد. أُنشئت 12 طلب تقديم في التقديم." |
| Move committed (optimistic + undo) | "Moved to Screening — by you, 09:41. Undo available for 6 seconds." | "نُقل إلى الفرز — بواسطتك، 09:41. التراجع متاح لمدة 6 ثوانٍ." |
| Move undone | "Back in Applied — the move is withdrawn." | "عاد إلى التقديم — سُحبت الحركة." |
| Reject recorded | "Rejected — the reason is on the record permanently, with your name on it." | "رُفض — السبب على السجل بشكل دائم، وباسمك عليه." |
| Interview scheduled | "Interview scheduled — round 1, Arabic, Dalal and Tarek, Thursday 10:00. The kit passed the coverage gate." | "جُدولت المقابلة — الجولة 1، بالعربية، دلال وطارق، الخميس 10:00. اجتاز الدليل بوابة التغطية." |
| Scorecard submitted | "Scorecard submitted — sealed to peers. 2 nudges marked on it; they never blocked anything." | "سُلِّمت بطاقة التقييم — مختومة عن الزملاء. وُسم عليها تنبيهان؛ ولم يمنعا شيئاً." |
| Nudge closed (addressed) | "Nudge closed — 18 words of evidence now. Same rule, same input, new verdict." | "أُغلق التنبيه — 18 كلمة من الدليل الآن. القاعدة ذاتها، والمدخل ذاته، وحكمٌ جديد." |
| Nudge dismissed | "Nudge dismissed — 'standing by my read' is on the record with your name." | "رُفض التنبيه — 'أتحمّل قراءتي' على السجل باسمك." |
| Decision recorded | "Decision recorded — advance to round 2. The debrief snapshot is pinned: kit v3, both cards v2 and v1." | "سُجِّل القرار — التقدّم إلى الجولة 2. لقطة مناقشة التقييمات مثبّتة: الدليل الإصدار 3، والبطاقتان الإصداران 2 و1." |
| Export ready | "Export ready — slate, scorecards, activity ledger. Expires in 7 days; regenerates identically from unchanged state." | "التصدير جاهز — القائمة والبطاقات وسجلّ النشاط. تنتهي صلاحيته بعد 7 أيام؛ ويُعاد توليده مطابقاً من حالة لم تتغيّر." |

## E. Signature moments (product-signature copy — the states that make the method visible)

| Moment | English | Arabic |
|---|---|---|
| **The Cards Unseal** (the T2 signature, 05 — the announcement IS the moment) | "All scorecards in — 2 interviewers, 4 competencies, recommendation split 1 yes / 1 strong-no." | "اكتملت بطاقات التقييم — محاوران، 4 جدارات، والتوصية منقسمة: موافق واحد، وغير موافق بشدة واحد." |
| The evidence-thin nudge (marks, never blocks) | "Extreme rating — 8 words. Ratings of 1 or 4 carry the argument; 15+ words of evidence is the bar." | "تقييم متطرّف — 8 كلمات. تقييمات 1 و4 تحمل الحجة؛ و15 كلمة من الدليل هي المعيار." |
| The trait-language nudge | "Trait words without observed behavior — what did she do?" | "صفات بلا سلوك مشاهد — ماذا فعلت؟" |
| The divergence mark | "4 vs 2 — Dalal / Tarek. The split is information, not a verdict." | "4 مقابل 2 — دلال / طارق. الانقسام معلومة، لا حكم." |
| The coverage gate refusal (caught at scheduling, not in the room) | "An Arabic interview needs Arabic questions on every competency — the gap is caught here, not in the room." | "المقابلة العربية تحتاج أسئلةً عربية على كل جدارة — تُمسَك الفجوة هنا، لا في الغرفة." |
| The independence seal (sealed row) | "Sealed — Dalal has not submitted. Her judgment stays hers until it is hers to give." | "مختوم — دلال لم تُسلّم بعد. حكمها يبقى لها حتى يحين وقت منحه." |
| The template floor (assist off) | "The template bank is the studio's floor — vetted bilingual questions, deterministic order, zero quota. The assist, when granted, only proposes; you accept." | "بنك القوالب هو أرضية الاستوديو — أسئلةٌ ثنائية اللغة مُتحرّاة، وترتيبٌ حتمي، وحصة صفرية. المساعدة، عند منحها، تقترح فقط؛ وأنت تقبل." |
| The determinism note | "Re-ran the rules on the same card — the same nudges fired, the same verdicts. That is what deterministic means here." | "أُعيد تشغيل القواعد على البطاقة ذاتها — أطلقت التنبيهات ذاتها والأحكام ذاتها. هذا معنى الحتمية هنا." |

## F. Bidi / mixed-script moments (rtl-rules §2 — copy authored for isolation; the name pair is the product's own bilingual center)

| Moment | English | Arabic |
|---|---|---|
| Arabic name inside the LTR board | "نوف الراشد renders right-to-left inside the left-to-right board — one record, two scripts, never merged into one string." | "تُعرض نوف الراشد من اليمين إلى اليسار داخل اللوح الذي يجري من اليسار إلى اليمين — سجل واحد، خطان، ولا يُدمجان في سلسلة واحدة أبداً." |
| Latin name inside the Arabic chrome | "Reem Al-Qasimi keeps its left-to-right run inside the Arabic chrome — isolated, punctuation stays put." | "يحتفظ Reem Al-Qasimi بجريانه من اليسار إلى اليمين داخل الهيكل العربي — معزولاً، ويبقى الترقيم في مكانه." |
| The anonymized sequence label | "Candidate #3 is المرشح #3 in Arabic chrome — the numeral Western in both, the sequence stable." | "المرشح #3 هي Candidate #3 في الهيكل الإنجليزي — الرقم غربيٌّ في الحالتين، والتسلسل ثابت." |
| Code-switched evidence | "Evidence that code-switches — 'asked about SLA في سياق الدعم' — renders each run at its own direction, isolated, never reordered." | "الدليل المتبدّل بين اللغتين — 'asked about SLA في سياق الدعم' — يعرض كل جريان باتجاهه، معزولاً، بلا إعادة ترتيب." |
| The language chips | "العربية and English sit as text tokens in one symmetric pill — direction-free by construction." | "تجلس العربية وEnglish رمزين نصّيين في حبة متناظرة واحدة — بلا اتجاهٍ بالبناء." |
