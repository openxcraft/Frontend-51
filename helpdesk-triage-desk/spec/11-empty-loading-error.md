# 11 — Empty / Loading / Error: helpdesk-triage-desk (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN + AR · voice = control-tower brisk (02: signal, rule, what happens next — in that order) · Arabic is فصحى بيضاء · **numerals Western everywhere per ledger row** (severity tiers, SLA minutes, counts — a data surface; Arabic-Indic digits appear only inside verbatim customer text, 07a) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked (02): تذكرة=ticket · عنقود=cluster · الخطورة=severity · التوجيه=routing · الطابور=queue · اتفاقية مستوى الخدمة=SLA · التصعيد=escalation · الدمج=merge · الإغلاق=disposition · كشف اللغة=language detection · سجل الرد=response log.

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| S1 first-run (no tickets) | "Nothing to triage yet. Paste a batch — or open the sample wave and watch Arabic and English tickets about one fault land in one cluster." | "لا شيء للتفرّغ بعد. الصق دفعةً — أو افتح الموجة النموذجية وشاهد تذاكر عربية وإنجليزية عن عطلٍ واحد تهبط في عنقودٍ واحد." | Paste tickets / Open sample batch |
| S1/S2 filtered-empty | "No tickets match these filters. Everything stays in the queue — clear the filters to see it." | "لا تذاكر تطابق هذه المرشّحات. كل شيء باقٍ في الطابور — امسح المرشّحات لرؤيته." | Clear filters |
| S1/S2 no-access | "This triage desk belongs to another workspace." | "مكتب التفرّغ هذا يخصّ مساحة عمل أخرى." | Switch workspace |
| S2 unclustered view, none | "Nothing waits for a cluster. The keyword engine ran and every ticket found its home." | "لا شيء ينتظر عنقوداً. عمل محرك الكلمات المفتاحية ووجدت كل تذكرة موضعها." | — |
| S2 unrouted view, none | "Everything in this view carries a routing decision. The rules left no strays." | "كل شيء في هذا العرض يحمل قرار توجيه. لم تترك القواعد شارداً." | — |
| S3 cluster membership, unclustered ticket | "No cluster yet — the engine found no signature-term match at threshold, and it says so instead of guessing." | "لا عنقود بعد — لم يجد المحرك تطابق مصطلحاتٍ عند الحدّ، ويقول ذلك بدل التخمين." | Assign to a cluster / Create cluster |
| S4 cluster board first-run (no clusters) | "No intent clusters yet. A cluster is a bilingual pair of labels and the signature terms that feed it — start from the six starters, or run the engine and see what lands." | "لا عنقودات نية بعد. العنقود هو زوج تسميات ثنائي اللغة والمصطلحات المفتاحية التي تغذّيه — ابدأ من العناصر الستة الجاهزة، أو شغّل المحرك وانظر ما يهبط." | Browse starter clusters / Run clustering |
| S4 archived-only view | "Only archived clusters match here. Their histories stay; their checks stopped." | "العنقودات المؤرشفة وحدها تطابق هنا. تواريخها تبقى؛ وفحوصها توقفت." | Show active clusters |
| S5 cluster, no member tickets | "This cluster holds no tickets right now. Its signature terms still route new arrivals in." | "لا يحمل هذا العنقود تذاكر الآن. مصطلحاته المفتاحية ما زالت تُدخل الوافدين الجدد." | — |
| S6 routing rules first-run | "No routing rules yet. A rule reads severity, cluster, language, and tier — and names the queue it sends to." | "لا قواعد توجيه بعد. القاعدة تقرأ الخطورة والعنقود واللغة والمستوى — وتسمّي الطابور الذي ترسل إليه." | Create routing rule |
| S6 no active rules | "Every rule here is switched off. Tickets stay unrouted — honestly — until one is active." | "كل قاعدة هنا مطفأة. تبقى التذاكر بلا توجيه — بصراحة — حتى تُفعَّل واحدة." | Activate a rule |
| S8 monitor, nothing at risk | "Nothing is at risk. Open clocks: 14. At-risk: 0. Breached: 0." | "لا شيء في خطر. الساعات المفتوحة: 14. في خطر: 0. متجاوزة: 0." | — |
| S8 breach ledger empty | "No breaches in this range. Every clock that closed, closed inside its target." | "لا تجاوزات في هذا النطاق. كل ساعةٍ أُغلقت، أُغلقت داخل هدفها." | — |
| S9 queues first-run | "No queues yet. A queue carries a bilingual name, an owner, and the languages its responders can answer in." | "لا طوابير بعد. الطابور يحمل اسماً ثنائي اللغة ومالكاً واللغات التي يستطيع مجيبوه الرد بها." | Create queue |
| S10 jobs empty | "Nothing running. Clustering runs, re-assessments, and exports appear here while they work." | "لا شيء قيد التنفيذ. تشغيلات التجميع وإعادة التقييم والتصديرات تظهر هنا أثناء عملها." | — |
| S10 exports empty | "No exports yet. The triage log carries clusters with provenance, severities with signals, routing decisions with reasons, and the SLA ledger — the Friday answer, assembled." | "لا تصديرات بعد. سجلّ التفرّغ يحمل العنقودات بمصدرها والخطورة بإشاراتها وقرارات التوجيه بأسبابها وسجلّ اتفاقية مستوى الخدمة — إجابة الجمعة، مجمَّعة." | Export triage log |
| Clustering assist unbound (settings) | "The clustering assist is not granted. The keyword engine runs everything — authored signature terms, deterministic matches. That is the desk's default state, not a fallback." | "مساعدة التجميع غير ممنوحة. محرك الكلمات المفتاحية يشغّل كل شيء — مصطلحات مفتاحية مصوغة وتطابقات حتمية. هذه حالة المكتب الافتراضية، لا بديل طارئ." | Grant capability (kind shown) |

## B. Loading (P02/P12 — skeletons mirror queue/monitor geometry per direction; honest determinate progress)

| State | English | Arabic |
|---|---|---|
| S2 queue skeleton | skeleton rows ×10 + "Loading the queue…" (SR) | صفوف هيكلية ×10 + "جارٍ تحميل الطابور…" |
| Ticket detail boot | reading-surface skeleton with reserved assessment panel | هيكلية سطح القراءة مع لوحة التقييم المحجوزة |
| Paste batch intake | "Reading the batch — detection and severity run as each ticket lands." | "قراءة الدفعة — الكشف والخطورة يعملان مع هبوط كل تذكرة." |
| Clustering run (determinate) | "Clustering 40 of 62 — keyword engine. Matches land as they compute." | "التجميع 40 من 62 — محرك الكلمات المفتاحية. التطابقات تهبط مع حسابها." |
| Clustering run (assist bound) | "Clustering 40 of 62 — keyword engine, assist proposing. Proposals wait for confirmation." | "التجميع 40 من 62 — محرك الكلمات المفتاحية والمساعدة تقترح. المقترحات تنتظر التأكيد." |
| Re-assessment job | "Re-assessing 140 of 212 against Severity v4 — changed tickets re-open their routing." | "إعادة تقييم 140 من 212 مقابل الخطورة الإصدار 4 — التذاكر المتغيرة تفتح توجيهها مجدداً." |
| Severity recompute (tier fix) | "Re-running the matrix…" (≤50ms — usually invisible) | "إعادة تشغيل المصفوفة…" |
| Cluster save | "Saving the cluster…" | "جارٍ حفظ العنقود…" |
| Export job | "Assembling the triage log — clusters, severities, decisions, clocks." | "تجميع سجلّ التفرّغ — العنقودات والخطورة والقرارات والساعات." |
| Monitor refresh | (derived read — recomputes within 120ms, no spinner) | (قراءة مشتقة — تعيد الحساب خلال 120 مللي ثانية، بلا مؤشر دوران) |
| Binding verification | "Verifying the intake channel — a real round-trip, not a checkbox." | "التحقق من قناة الاستلام — جولة فعلية، لا مربّع تأشير." |

## C. Errors (7 classes; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (empty subject) | "A ticket needs a subject — the queue sorts on it. Add one and the batch continues." | "تحتاج التذكرة موضوعاً — الطابور يرتّب عليه. أضفه وتستمر الدفعة." |
| VALIDATION (confirm without labels) | "A cluster needs both labels before it becomes authoritative — English and Arabic, one intent, one name pair." | "يحتاج العنقود التسميتين قبل أن يصبح معتمداً — الإنجليزية والعربية، نيةٌ واحدة، زوج أسماءٍ واحد." |
| VALIDATION (manual route without reason) | "A manual route needs a reason — it is the audit answer when someone asks why this ticket moved." | "التوجيه اليدوي يحتاج سبباً — هو جواب التدقيق حين يسأل أحدهم لماذا تحركت هذه التذكرة." |
| VALIDATION (escalation without reason) | "An escalation needs a reason — 'urgent' is not a reason, it is a temperature." | "التصعيد يحتاج سبباً — 'عاجل' ليست سبباً، بل حرارة." |
| VALIDATION (merge state) | "TK-0151 is already acknowledged — only new, clustered, or routed tickets merge. Handle it on its own." | "TK-0151 معتمدة بالفعل — التذاكر الجديدة أو العنقودية أو الموجّهة وحدها تُدمج. عالجها وحدها." |
| VALIDATION (disposition on closed) | "TK-0165 already closed as resolved-elsewhere. Closed tickets keep their record — open a new one if the customer writes again." | "TK-0165 مغلقة بالفعل كمحلولة خارجياً. التذاكر المغلقة تحتفظ بسجلها — افتح جديدة إن كتب العميل مجدداً." |
| VALIDATION (policy sanity) | "Key-account × outage cannot be P4 — the matrix cell says 4 hours, the tier says everything. Fix the cell." | "لا يمكن أن يكون حساب رئيسي × عطلٍ P4 — خانة المصفوفة تقول 4 ساعات، والمستوى يقول كل شيء. صحّح الخانة." |
| VALIDATION (spam confirm missing) | "Marking spam is permanent — confirm it with the notice, or close it another way." | "وسم الرسائل المزعجة دائم — أكّده مع الإشعار، أو أغلقها بطريقة أخرى." |
| NOT_FOUND (stale link) | "That ticket, cluster, or queue is gone from this workspace. It may have been archived while you were away." | "تلك التذكرة أو العنقود أو الطابور غاب عن مساحة العمل. ربما أُرشف أثناء غيابك." → العودة إلى الطابور |
| NOT_FOUND (expired artifact) | "This export expired 3 days ago. Regenerate it — the triage state it came from is unchanged." | "انتهت صلاحية هذا التصدير قبل 3 أيام. أعد توليده — حالة التفرّغ التي صدر عنها لم تتغيّر." |
| PERMISSION (viewer role) | "Your seat reads the desk and retrieves exports. Ask the workspace owner for a triage seat." | "مقعدك يقرأ المكتب ويستعيد التصديرات. اطلب من مالك مساحة العمل مقعد تفرّغ." |
| PERMISSION (capability unconsented) | "Channel intake needs the message-intake capability granted to this workspace. Grant it — or paste the tickets; pasting always works." | "يحتاج استلام القناة إلى منح قدرة استلام الرسائل لمساحة العمل هذه. امنحها — أو الصق التذاكر؛ اللصق يعمل دائماً." |
| CONFLICT (concurrent ticket edit) | "Tarek saved a change to this ticket while you did. Both versions are kept — choose what stays." | "حفظ طارق تغييراً في هذه التذكرة أثناء عملك. الاحتفاظ بالنسختين — اختر ما يبقى." |
| CONFLICT (cluster edit) | "Maysoon saved this cluster while you edited. Both versions are kept side by side." | "حفظت ميسون هذا العنقود أثناء تحريرك. النسختان محفوظتان جنباً إلى جنب." |
| CONFLICT (bulk count drift) | "The set changed since you counted it — it is 84 tickets now, not 85. Recount and confirm." | "تغيّرت المجموعة منذ عدّها — إنها 84 تذكرة الآن، لا 85. أعد العد وأكّد." |
| RATE_LIMIT (assist quota) | "This window's assist runs are used. The keyword engine keeps clustering — proposals resume 1 Nov." | "استُهلكت تشغيلات المساعدة لهذه النافذة. محرك الكلمات المفتاحية يواصل التجميع — تستأنف المقترحات في 1 نوفمبر." |
| RATE_LIMIT (export quota) | "The export window is used for this cycle — the next package frees up on 1 Nov. Nothing about the triage state changes." | "استُهلكت نافذة التصدير لهذه الدورة — تتحرر الحزمة التالية في 1 نوفمبر. لا شيء في حالة التفرّغ يتغيّر." |
| NETWORK (list fetch) | "The queue went stale — reconnecting. Every routing decision you made is safe." | "تقادم الطابور — تجري إعادة الاتصال. كل قرار توجيهٍ اتخذته آمن." |
| NETWORK (assist partial) | "The assist stopped at ticket 6 — the 3 keyword matches already landed and stay. Retry the failed scope, or run keyword-only." | "توقفت المساعدة عند التذكرة 6 — التطابقات الثلاثة هبطت وتبقى. أعد محاولة النطاق الفاشل، أو شغّل الكلمات المفتاحية وحدها." |
| UNKNOWN | "Something failed on our side (ref htd-corr-0001). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع htd-corr-0001). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips + counts, no confetti)

| Moment | English | Arabic |
|---|---|---|
| Batch intake done | "40 tickets in — 22 Arabic, 15 English, 3 mixed. Severity ran on every one; the clocks are live." | "دخلت 40 تذكرة — 22 عربية و15 إنجليزية و3 مختلطة. جرت الخطورة على كل واحدة؛ والساعات تعمل." |
| Clustering done (keyword) | "Keyword engine clustered 18 of 22 — 4 wait for a human, by name." | "جمّع محرك الكلمات المفتاحية 18 من 22 — 4 تنتظر إنساناً، بالاسم." |
| Cluster confirmed (the P15 gate) | "Cluster confirmed — 'Refund delay / تأخّر الاسترداد', 11 tickets, 7 Arabic, 4 English. The proposals became decisions, by your hand." | "اعتُمد العنقود — 'Refund delay / تأخّر الاسترداد'، 11 تذكرة، 7 عربية و4 إنجليزية. صارت المقترحات قرارات بيدك." |
| Route committed (Handoff Settle) | "Routed to Payments by rule R-04 — first response due 12:40." | "وُجّهت إلى المدفوعات بالقاعدة R-04 — الرد الأول بحلول 12:40." |
| Manual route recorded | "Routed to Technical by hand — your reason is in the log with your name on it." | "وُجّهت إلى الفني يدوياً — سببك في السجلّ باسمك عليه." |
| Bulk routed | "84 tickets routed to Self-service — every one was P4 in the how-to cluster, exactly as counted." | "وُجّهت 84 تذكرة إلى الخدمة الذاتية — كلها P4 في عنقود الاستخدام، كما عُدّت تماماً." |
| Severity override recorded | "Severity overridden to P2 — 'customer called twice' is now part of the record, permanently." | "سُجّل تجاوز الخطورة إلى P2 — 'اتصل العميل مرتين' صارت جزءاً من السجل، بشكل دائم." |
| Escalation recorded | "Escalated to P1 and re-routed to Payments — the lead is notified, the reason is in the log." | "صُعّدت إلى P1 وأُعيد توجيهها إلى المدفوعات — أُخطر القائد، والسبب في السجل." |
| Response logged | "Response logged — email ref RE-4471, sent 11:38. First response: met, with 22 minutes to spare." | "سُجّل الرد — بريد بمرجع RE-4471، أُرسل 11:38. الرد الأول: مستوفى، وبه 22 دقيقة فائضة." |
| Merge done | "3 tickets became 1 — the keeper carries the highest severity and the whole history." | "صارت 3 تذاكر واحدة — الحاملة تحمل أعلى خطورة والتاريخ كله." |
| Spam closed | "Marked spam — it left the counts and kept its record." | "وُسمت مزعجة — تركت العدّاد واحتفظت بسجلها." |
| Disposition reversed | "Reopened from pending-requester — the clock resumed from where it paused." | "أُعيد فتحها من بانتظار العميل — استأنف الساعته من حيث توقفت." |
| Re-assessment done | "Re-assessed 212 against Severity v4 — 9 severities changed, 3 routes re-opened for a decision. Nothing moved silently." | "أُعيد تقييم 212 مقابل الخطورة الإصدار 4 — تغيّرت 9 خطورات، وافتُتحت 3 توجيهات لقرار. لا شيء تحرك بصمت." |
| Binding verified | "Orders support inbox verified — a real round-trip succeeded. Intake is live." | "تحقّق صندوق طلبات الدعم — نجحت جولة فعلية. الاستلام يعمل." |
| Export ready | "Triage log ready — clusters with provenance, severities with signals, decisions with reasons, the SLA ledger. Expires in 7 days; regenerable forever." | "سجلّ التفرّغ جاهز — العنقودات بمصدرها والخطورة بإشاراتها والقرارات بأسبابها وسجلّ الساعات. تنتهي بعد 7 أيام؛ وتُعاد توليدها دائماً." |

## E. Signature moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| The cross-language cluster (the value moment) | "One cluster, two languages: 'فشل الدفع' × 3 and 'payment failed' × 4 — one incident, one place to look." | "عنقودٌ واحد، لغتان: 'فشل الدفع' × 3 و'payment failed' × 4 — حادثٌ واحد، وموضعٌ واحد للنظر." |
| The honest unclustered | "TK-0146 matched one term where two were required — it stays unclustered and says so. Nearest-match guessing is not triage." | "طابقت TK-0146 مصطلحاً واحداً حيث طُلب اثنان — تبقى بلا عنقود وتقول ذلك. تخمين أقرب تطابق ليس تفرّغاً." |
| The named-signal severity | "P1 — impact: key account; urgency: outage term 'توقف' present; breadth: 'كل العملاء' present. The matrix read the ticket; you can read the matrix." | "P1 — الأثر: حساب رئيسي؛ الإلحاح: مصطلح العطل 'توقف' موجود؛ الاتساع: 'كل العملاء' موجود. قرأت المصفوفة التذكرة؛ وأنت تستطيع قراءة المصفوفة." |
| The routing trace | "R-04 won on order 10 — severity P2, cluster checkout-failure, language ar. R-07 also matched and lost on order 30. Both named, neither silent." | "فازت R-04 بالترتيب 10 — خطورة P2 وعنقود فشل الدفع ولغة عربية. وطابقت R-07 وخسرت بالترتيب 30. كلتاهما مسمّاة، ولا صامتة." |
| The breach ledger entry | "TK-0163 breached first response by 4 h 20 m — the timeline holds every minute: intake 21:50, the contact-form channel failed 22:40, routed 07:10. The ledger names the window, not a person." | "تجاوزت TK-0163 الرد الأول بـ 4 س و20 د — يحمل الخط الزمني كل دقيقة: الاستلام 21:50، وفشل قناة نموذج الاتصال 22:40، والتوجيه 07:10. يسمّي السجلّ النافذة، لا شخصاً." |
| The keyword floor (assist off) | "The keyword engine is the desk — authored terms, deterministic matches, honest residue. The assist, when granted, only proposes; you confirm." | "محرك الكلمات المفتاحية هو المكتب — مصطلحات مصوغة وتطابقات حتمية وبقايا صادقة. المساعدة، عند منحها، تقترح فقط؛ وأنت تؤكّد." |
| Determinism note (clustering re-run) | "Re-ran clustering on the same state — the same 18 matched, the same 4 wait. That is what deterministic means here." | "أُعيد تشغيل التجميع على الحالة ذاتها — التطابق ذاته 18، والانتظار ذاته 4. هذا معنى الحتمية هنا." |

## F. Bidi / mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Latin run inside Arabic body | "The Latin words render left-to-right inside the right-to-left body — isolated, punctuation stays put." | "تُعرض الكلمات اللاتينية من اليسار إلى اليمين داخل الجسم الذي يجري من اليمين إلى اليسار — معزولة، ويبقى الترقيم في مكانه." |
| Ticket number in Arabic chrome | "TK-0142 stays a Latin token in Arabic chrome — isolated, never reordered. 0142 is 0142 in either direction." | "تبقى TK-0142 رمزاً لاتينياً في هيكل عربي — معزولة، ولا يُعاد ترتيبها. 0142 هي 0142 في أي اتجاه." |
| Arabic cluster label in English chrome | "The Arabic label renders right-to-left beside its English twin — one intent, two scripts, never merged into one string." | "تُعرض التسمية العربية من اليمين إلى اليسار بجوار توأمها الإنجليزي — نيةٌ واحدة، خطّان، ولا تُدمجان في سلسلة واحدة أبداً." |
| Detected-language declaration | "Mixed — the body is Arabic with a Latin run inside; the chip says how it was read, and your override, if any, is recorded." | "مختلطة — الجسم عربي بجملة لاتينية داخله؛ تقول الرقاقة كيف قُرئت، وتجاوزك، إن وُجد، مسجَّل." |
