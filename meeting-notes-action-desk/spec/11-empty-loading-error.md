# 11 — Empty / Loading / Error: meeting-notes-action-desk (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR (bilingual-en product; both locales carried because the workspace flips — house convention) · voice = plain, accountable, named-actor (02) · Arabic is فصحى بيضاء utility register · numerals Western everywhere per ledger row (never mixed systems mid-sentence) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked: الاجتماع=meeting · الملاحظات=notes · التفريغ=transcript · الملخص=summary · القرار=decision · التكليف=action · صاحب التكليف=action owner · تأكيد التكليف=confirmation · مكتب التكليفات=loop desk · سجل التكليفات=actions register · المحضر=minutes · تاريخ الاستحقاق=due date · متأخر=overdue.

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| S1 desk first-run | "No meetings yet. Create one, or open the sample debrief and watch a confirmation overdue in the loop." | "لا اجتماعات بعد. أنشئ اجتماعاً، أو افتح جلسة التذوّق النموذجية وشاهد تأخراً في التأكيد داخل الحلقة." | New meeting / Open sample meeting |
| S1 meetings filtered-empty | "No meetings match these filters." | "لا اجتماعات تطابق هذه المرشّحات." | Clear filters |
| S1 no-access | "These meetings belong to another workspace." | "هذه الاجتماعات تخصّ مساحة عمل أخرى." | Switch workspace |
| S2 capture first-run | "No notes yet. Type what you captured — or paste a transcript. Typing needs no capability and always works." | "لا ملاحظات بعد. اكتب ما دوّنته — أو الصق تفريغاً. الكتابة لا تحتاج أي قدرة وتعمل دائماً." | Type notes / Paste capture |
| S2 capture filtered-empty (revision picker) | "No earlier revision matches this filter." | "لا مراجعة سابقة تطابق هذا المرشّح." | Show latest revision |
| S3 summary never-run | "No summary yet. Run one — assist proposes, cue mode flags, and every proposal waits for your review." | "لا ملخص بعد. شغّل واحداً — تقترح المساعدة، وتلتقط الأنماط الحتمية، وكل اقتراح ينتظر مراجعتك." | Run summary |
| S3 proposals all-resolved | "Every proposal is resolved — accepted, edited, or dismissed. Dismissals stay in the record." | "حُسمت كل الاقتراحات — قُبلت أو حُرّرت أو رُفضت. الرفض يبقى في السجل." | Re-run summary |
| S4 decisions empty | "No decisions recorded. A decision is what was agreed — distinct from an action someone will do." | "لا قرارات مسجّلة. القرار هو ما اتُّفق عليه — وهو غير التكليف الذي سيقوم به أحدهم." | Record a decision |
| S5 actions first-run (meeting) | "No actions yet. Every action carries one owner, one due date, and an evidence link back to the capture." | "لا تكاليف بعد. كل تكليف يحمل مالكاً واحداً وتاريخ استحقاقاً واحداً وربطاً بالدليل في التفريغ." | Create action |
| S6 loop desk — no requests yet | "Nothing awaits confirmation. When you send an action for confirmation, it appears here until its owner responds." | "لا شيء ينتظر تأكيداً. عند إرسال تكليف للتأكيد يظهر هنا حتى يستجيب صاحبه." | Go to actions register |
| S6 loop desk — all answered | "Every confirmation is answered — 2 confirmed, 1 questioned, 1 declined this week." | "كل التأكيدات مستجابة — 2 مؤكدة، و1 مستفسَر عنها، و1 مرفوضة هذا الأسبوع." | View actions register |
| S6 owner mode — empty queue | "Nothing has your name on it. New confirmations land here with one tap to respond." | "لا شيء يحمل اسمك. التأكيدات الجديدة تصل هنا بلمسة واحدة للرد." | — |
| S7 register first-run | "No actions anywhere yet — meetings first, then actions born in them." | "لا تكاليف في أي مكان بعد — الاجتماعات أولاً، ثم التكاليف المولودة فيها." | Open desk home |
| S7 register filtered-empty | "No actions match these filters." | "لا تكاليف تطابق هذه المرشّحات." | Clear filters |
| S7 register owner-filtered empty | "No actions for Mira right now." | "لا تكاليف لميرا حالياً." | Show all owners |
| S8 members empty (fresh workspace) | "No members yet. Add the people who meet — bilingual names, one line each." | "لا أعضاء بعد. أضف من يجتمعون — أسماء ثنائية اللغة، سطر لكل واحد." | Add member |
| S9 jobs empty | "Nothing running. Imports, summarization runs, and exports appear here while they work." | "لا مهام قيد التنفيذ. الاستيرادات وتشغيلات التلخيص والتصديرات تظهر هنا أثناء عملها." | — |
| S1 zones none | "No overdue, no awaiting confirmation. The loop is clear this morning." | "لا متأخرات ولا ما ينتظر تأكيداً. الحلقة صافية هذا الصباح." | Refresh digest |

## B. Loading (P02/P12 — skeletons mirror geometry per direction; honest progress)

| State | English | Arabic |
|---|---|---|
| S1 digest skeleton | digest rows + meetings skeleton ×8 + "Loading your desk…" (SR) | صفوف هيكلية + "جارٍ تحميل لوحتك…" |
| Capture import job (determinate) | "Importing 9 of 14 segments — 'لازم تجديد الفحص' recognized as an action cue." | "استيراد 9 من 14 مقطعاً — التُقطت 'لازم تجديد الفحص' إشارةَ تكليف." |
| Transcription job (determinate) | "Transcribing — segment 5 of 12. The file never leaves the workspace grant." | "تفريغ — المقطع 5 من 12. الملف لا يغادر نطاق مساحة العمل." |
| Summarization job (progressive) | "Summarizing — 4 of 9 proposals emitted. The region below is reserved; the list fills as they arrive." | "التلخيص — صدر 4 من 9 اقتراحات. المنطقة أدناه محجوزة؛ تكتمل القائمة مع وصولها." |
| Cue-mode scan (seed scale) | "Scanning the capture for action cues…" | "جارٍ فحص التفريغ بحثاً عن إشارات التكاليف…" |
| Confirm round-trip | "Recording Faisal's confirmation…" | "جارٍ تسجيل تأكيد فيصل…" |
| Autosave (P10) | "Saving…" → "Saved" (fades) | "جارٍ الحفظ…" → "حُفظ" |
| Export job | "Building the minutes — bilingual, with the actions appendix on." | "بناء المحضر — ثنائي اللغة مع ملحق التكاليف." |
| S9 job row | determinate: "9 of 14"; indeterminate: "Working — no estimate yet" | "9 من 14" ؛ "قيد العمل — لا تقدير بعد" |
| S6 digest refresh | "Refreshing the loop…" | "جارٍ تحديث الحلقة…" |

## C. Errors (7 classes; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (empty capture text) | "Segment 7 has no text — the segments around it imported fine. Fix segment 7 and import just it." | "المقطع 7 بلا نص — استُوردت المقاطع من حوله سليمة. صحّح المقطع 7 واستورد وحده." |
| VALIDATION (confirmation without owner) | "This action has no owner yet — a confirmation needs exactly one. Pick an owner first." | "لا مالك لهذا التكليف بعد — التأكيد يحتاج مالكاً واحداً بالضبط. اختر مالكاً أولاً." || VALIDATION (confirmation without due date) | "This action has no due date — confirmations carry a deadline. Set one first." | "لا تاريخ استحقاق لهذا التكليف — التأكيدات تحمل موعداً نهائياً. حدّده أولاً." |
| VALIDATION (out-of-sequence status) | "This action isn't confirmed yet — only its owner can confirm it, and completion comes after. Ask for the confirmation first." | "هذا التكليف غير مؤكد — لا يؤكّده إلا صاحبه، والإتمام يأتي بعده. اطلب التأكيد أولاً." |
| VALIDATION (response without note) | "A question needs its text — write what's unclear for the lead." | "الاستفسار يحتاج نصه — اكتب ما هو غير واضح لقائد الفريق." |
| NOT_FOUND (stale meeting/action link) | "That meeting or action is gone from this workspace. It may have been closed while you were away — closed meetings keep their records." | "ذلك الاجتماع أو التكليف غاب عن مساحة العمل. ربما أُغلق أثناء غيابك — الاجتماعات المغلقة تحتفظ بسجلاتها." |
| NOT_FOUND (withdrawn confirmation) | "This confirmation was withdrawn by Sara before you responded. The action is back in her drafts — nothing is lost." | "سحبت سارة هذا التأكيد قبل ردّك. عاد التكليف إلى مسوداتها — لا شيء ضائع." |
| NOT_FOUND (expired artifact) | "This export expired 3 days ago. Regenerate it — the meeting it came from is unchanged." | "انتهت صلاحية هذا التصدير قبل 3 أيام. أعد توليده — الاجتماع الذي صدر عنه لم يتغيّر." |
| PERMISSION (transcription unconsented) | "Transcription needs the audio-transcription capability granted to this workspace. Grant it — or type and paste; those paths always work." | "يحتاج التفريغ منح قدرة تفريغ الصوت لمساحة العمل. امنحها — أو اكتب والصق؛ فهذان المسار يعملان دائماً." |
| PERMISSION (viewer seat) | "Your seat views but doesn't act here. Ask the workspace lead for a member seat." | "مقعدك يعرض ولا يتفاعل هنا. اطلب من قائد مساحة العمل مقعداً عضواً." |
| CONFLICT (concurrent action edit) | "Sara edited this action while you did. Both versions are kept — choose what stays." | "حرّرت سارة هذا التكليف أثناء عملك. الاحتفاظ بالنسختين — اختر ما يبقى." |
| CONFLICT (racing confirmation) | "Omar responded first — he confirmed it 2 minutes ago. The commitment stands; your response wasn't recorded twice." | "سبقك عمر بالرد — أكّده قبل دقيقتين. الالتزام قائم؛ ولم يُسجّل ردّك مرتين." |
| RATE_LIMIT (assist quota) | "This month's assist window is used. Cue mode keeps proposing — assists resume 1 Nov." | "استُهلكت نافذة المساعدة لهذا الشهر. الأنماط الحتمية تستمر في الاقتراح — تستأنف المساعدة في 1 نوفمبر." |
| RATE_LIMIT (rung 2 notice) | "Running near the assist limit — proposals will thin out until 1 Nov." | "اقترب الاستخدام من حدّ المساعدة — ستقلّ الاقتراحات حتى 1 نوفمبر." |
| NETWORK (list fetch) | "The register went stale — reconnecting. Nothing you confirmed is lost." | "تقادم السجل — تجري إعادة الاتصال. لا شيء ممّا أكّدته ضائع." |
| NETWORK (export partial) | "The bundle delivered 1 of 2 formats — the minutes arrived, the appendix didn't. Retry just the appendix." | "سلّمت الحزمة 1 من 2 صيغ — وصل المحضر ولم يصل الملحق. أعد محاولة الملحق وحده." |
| UNKNOWN | "Something failed on our side (ref mnad-corr-0001). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع mnad-corr-0001). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips, the one Settle moment)

| Moment | English | Arabic |
|---|---|---|
| Capture imported | "14 segments in, 0 invalid — speakers matched by name: omar haddad, ساره الراشد, and 5 more." | "دخل 14 مقطعاً، و0 غير صالحة — طُوبِع المتحدثون بالأسماء: omar haddad و ساره الراشد و5 آخرين." |
| Summarization done (cue mode) | "9 proposals from 14 segments — 8 actions and 1 decision; cue mode, no capability used." | "9 اقتراحات من 14 مقطعاً — 8 تكاليف وقرار واحد؛ الأنماط الحتمية، بلا أي قدرة." |
| Summarization done (assist) | "9 proposals — 8 from cues plus 1 the assist added (0.74). Review each before it counts." | "9 اقتراحات — 8 من الإشارات وواحد أضافته المساعدة (0.74). راجع كلاً منها قبل احتسابه." |
| Proposal accepted | "Accepted — the action carries its evidence link to segment 2 of the capture." | "قُبل — يحمل التكليف رابط دليله إلى المقطع 2 من التفريغ." |
| Confirmation requested | "Sent to Omar — respond-by 21 Oct. He confirms, questions, or declines; nothing is assigned silently." | "أُرسل إلى عمر — الرد بحلول 21 أكتوبر. يؤكد أو يستفسر أو يرفض؛ لا شيء يُسنَد بصمت." |
| **Owner confirmed (the Ta'ahhud Settle)** | "Omar confirmed 'إرسال وثائق تدقيق الموردين الناقصة' — committed 18 Oct." | "أكد عمر 'إرسال وثائق تدقيق الموردين الناقصة' — التزام 18 أكتوبر." |
| Owner questioned | "Mira asked: 'أي شهر نطابق؟ هذا الشهر ولا السابق؟' — it's back on your desk." | "استفسرت ميرا: 'أي شهر نطابق؟ هذا الشهر ولا السابق؟' — عاد إلى لوحتك." |
| Owner declined | "Layla declined the reshoot date — reassign or renegotiate; the decline is on the record." | "رفضت ليلى موعد إعادة التصوير — أعد الإسناد أو التفاوض؛ الرفض مسجّل." |
| Action in-progress | "Faisal started the fire-safety renewal — 4 days past due, visible to the desk." | "بدأ فيصل تجديد السلامة من الحريق — متأخر 4 أيام، مرئي للوحة." |
| Action done | "Yousef submitted the fridge temperature logs — done 18 Oct, no note needed." | "سلّم يوسف سجلات حرارة الثلاجات — تم 18 أكتوبر، بلا حاجة لملاحظة." |
| Action reopened | "Reopened — your reason is on the status history." | "أُعيد فتحه — سببك في سجل الحالة." |
| Bulk send | "4 confirmations sent — each owner got their own request." | "أُرسلت 4 طلبات تأكيد — لكل مالك طلبه الخاص." |
| Minutes exported | "Minutes ready — bilingual, register appendix on, expires in 7 days." | "المحضر جاهز — ثنائي اللغة مع ملحق السجل، تنتهي صلاحيته بعد 7 أيام." |
| Register exported | "Register ready — Faisal's 4 actions as printed. Exports follow the filter you set." | "السجل جاهز — تكاليف فيصل الأربعة كما هي. التصديرات تتبع المرشّح الذي حددته." |
| Undo window (P03, dismissal) | "Proposal dismissed — Undo (7s)" | "رُفض الاقتراح — تراجع (7 ثوانٍ)" |

## E. Loop & assist moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| Assist proposal (P15 draft) | "Suggestion: 'Book the chefs' tasting session' — Layla, by 24 Oct (0.91). Accept, edit, or dismiss." | "اقتراح: 'حجز جلسة تذوّق الطهاة' — ليلى، قبل 24 أكتوبر (0.91). اقبل أو حرّر أو ارفض." |
| Low-confidence label | "Low confidence (0.62) — 'Remove all plastic straws from venues' reads like a decision, not an assignment. Review before it counts." | "ثقة منخفضة (0.62) — 'إزالة كل المصاصات البلاستيكية من الفروع' يُقرأ قراراً لا تكليفاً. راجعه قبل احتسابه." |
| Cue-mode proposal | "Cue: 'أنا أتكفل بملفات تدقيق الموردين' — Omar matched by speaker. Cue mode proposes; you dispose." | "إشارة: 'أنا أتكفل بملفات تدقيق الموردين' — طُوبِع عمر بالمُتحدّث. الأنماط تقترح؛ وأنت مَن يقرّر." |
| Degraded run notice | "The assist is off this run — proposals come from cue rules. Same rules, no capability." | "المساعدة متوقفة في هذا التشغيل — الاقتراحات من قواعد الإشارات. القواعد ذاتها بلا قدرة." |
| Rung 4 banner (capability off) | "The summarization assist is unavailable right now. Everything else works — capture, cue mode, the loop, exports. We'll say when it returns (est. 2 hours)." | "مساعدة التلخيص غير متاحة الآن. كل ما عداها يعمل — التفريغ والأنماط الحتمية والحلقة والتصديرات. سنخبرك عند عودتها (تقديراً ساعتان)." |
| Quota meter warning (80%) | "Assist window at 8 of 10 — cue mode stays free either way." | "نافذة المساعدة عند 8 من 10 — الأنماط الحتمية تبقى مجانية في الحالين." |
| Confirmation-overdue escalation | "Awaiting Faisal 7 days — requested 11 Oct, respond-by 14 Oct. It's also 4 days past due. Reassign or chase; the stall is on the record." | "بانتظار فيصل 7 أيام — طُلب 11 أكتوبر والرد بحلول 14 أكتوبر. وهو أيضاً متأخر 4 أيام عن الاستحقاق. أعد الإسناد أو طارد؛ التوقف مسجّل." |
| Both-zones row (register) | "Overdue and awaiting confirmation — the room agreed it before anyone confirmed it." | "متأخر وينتظر التأكيد — أقرّت الغرفة به قبل أن يؤكده أحد." |
| Self-assignment label | "Assigned to yourself — your confirmation is still a confirmation." | "أُسنِد لنفسك — تأكيدك يبقى تأكيداً." |
| Unpaired action warning | "This action has no Arabic text yet — pair it so the owner reads it in their language." | "لا نص عربي لهذا التكليف بعد — ازدوِجه ليقرأه المالك بلغته." |
| Speaker unmatched | "'Reem' didn't match a member — add her, or leave the label as captured evidence." | "'ريم' لم تطابق عضواً — أضفها، أو اترك الاسم دليلاً ملتقطاً كما هو." |
| Sample meeting badge | "Sample debrief — full loop, synthetic dates. Clear it whenever real work arrives." | "جلسة تذوّق نموذجية — حلقة كاملة وتواريخ تركيبية. امسحها متى وصل العمل الحقيقي." |
| Stale evidence span | "The capture this action cites has a newer revision — the span still points where it did when it was written." | "للتفريغ الذي يستند إليه هذا التكليف مراجعة أحدث — ما زال الربط يشير حيث كان عند كتابته." |
| Closed meeting | "Closed — records intact. Actions keep their lineage and their history." | "مغلق — السجلات سليمة. تحتفظ التكاليف بنسبها وتاريخها." |

## F. Bidi/mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Latin token inside Arabic segment | "The segment 'راجعي فرق الـ POS في فرع أبوظبي' renders right-to-left with POS isolated — the evidence span cuts cleanly around it." | "يُعرض المقطع 'راجعي فرق الـ POS في فرع أبوظبي' من اليمين إلى اليسار مع عزل POS — ويقطع نطاق الدليل حوله بلا كسر." |
| Latin speaker label in Arabic chrome | "'omar haddad' stays left-to-right inside the Arabic capture — matched by normalization, rendered isolated." | "يبقى 'omar haddad' من اليسار إلى اليمين داخل التفريغ العربي — طوبِع بالتطبيع و عُرض معزولاً." |
| Arabic action text in EN chrome | "'تجديد فحص السلامة من الحريق' renders right-to-left inside the English register row — isolated, never force-flipped." | "تُعرض 'تجديد فحص السلامة من الحريق' من اليمين إلى اليسار داخل صف السجل الإنجليزي — معزولة ولا تُقلب قسراً أبداً." |
| Bilingual minutes pairing | "Minutes render the English section left-to-right and the Arabic section right-to-left, decisions and actions numbered once and cited in both." | "يعرض المحضر القسم الإنجليزي من اليسار إلى اليمين والقسم العربي من اليمين إلى اليسار، والقرارات والتكاليف مرقّمة مرة ومستشهد بها في الاثنين." |
