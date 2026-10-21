# 11 — Empty / Loading / Error: patient-intake-forms (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR · voice = clinic-floor plain (02: plain, unhurried, concrete — the NN/g plain-language register, research S22) · Arabic is فصحى بيضاء · **numerals Western everywhere per ledger row** (never mixed systems mid-sentence) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · **PHI rule: no answer text ever appears in toasts, announcements, titles, or URLs — labels, counts, and canonical pairs only** (a11y-baseline §7, 09) · terminology locked (02): استمارة القبول=intake form · قسم=section · سؤال=question · حقل الأعراض=symptom field · مسرد الأعراض=symptom vocabulary · مصطلح=term · صيغة عامية=colloquial variant · مطابقة=match · تطبيع=normalization · مطابقة قيد التأكيد=pending confirmation · غير مطابق=unmatched · إشارة عاجلة=urgent flag · تصعيد=escalation · مراجعة=review · تسليم=submit · محفوظة تلقائياً=autosaved · استئناف=resume · تصدير=export · رمز QR مطبوع=printed QR.

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| S1 forms first-run | "No intake forms yet. Build one in both languages from the start — or open the sample form and watch a colloquial symptom find its term." | "لا استمارات قبول بعد. ابنِ واحدة باللغتين من البداية — أو افتح الاستمارة العيّنة وشاهد عرضاً عامياً يجد مصطلحه." | Create form / Open sample |
| S1 filtered-empty | "No forms match these filters." | "لا استمارات تطابق هذه المرشّحات." | Clear filters |
| S1 no-access | "These forms belong to another clinic's workspace." | "هذه الاستمارات تخصّ مساحة عمل لعيادة أخرى." | Switch workspace |
| S2 builder, new blank form | "This form has no sections yet. Add a section, then questions — the publish gate will tell you exactly what's missing in either language." | "لا أقساماً في هذه الاستمارة بعد. أضف قسماً ثم أسئلة — بوابة النشر ستخبرك بدقة بما ينقص في كل لغة." | Add first section |
| S3 preview, empty draft | "Nothing to preview yet — one question becomes a preview the moment you add it." | "لا شيء لعرضه بعد — سؤال واحد يصير عرضاً بمجرد إضافته." | Add a question |
| S4 fill sessions, none open | "No open invitations. Create a link, print a QR, or open a kiosk session — all three work without any connected service." | "لا دعوات مفتوحة. أنشئ رابطاً، أو اطبع رمز QR، أو افتح جلسة كشك — الثلاثة تعمل بلا أي خدمة موصولة." | Create invitation |
| S5 submissions first-run | "No submissions yet. When patients complete a form, their intakes land here — flags, matches, and all." | "لا تسليمات بعد. حين يُكمل المرضى الاستمارة تصل استماراتهم هنا — الإشارات والمطابقات وكل شيء." | Open a fill invitation |
| S5 filtered-empty | "No submissions match these filters." | "لا تسليمات تطابق هذه المرشّحات." | Clear filters |
| S5 no-access | "This submission queue belongs to another workspace." | "قائمة التسليمات هذه تخصّ مساحة عمل أخرى." | Switch workspace |
| S6 normalization panel, no symptoms | "This intake reports no symptoms — the symptom fields stand empty, and that is what the record says." | "هذا القبول بلا أعراض — حقول الأعراض فارغة، وهذا ما يقوله السجل." | — |
| S6 normalization panel, all matched | "Every symptom entry carries its term — by exact match or by normalization. Nothing is waiting on you here." | "كل مدخل أعراض يحمل مصطلحه — بمطابقة تامة أو بالتطبيع. لا شيء ينتظرك هنا." | Mark reviewed |
| S6 assist-mode empty (capability unbound — the honest empty) | "No assist suggestions exist in this workspace — matching runs on the clinic's dictionary alone, and unmatched text waits for staff mapping." | "لا اقتراحات مساعدة في مساحة العمل هذه — تجري المطابقة على مسرد العيادة وحده، والنص غير المطابق ينتظر إسناداً من الموظفين." | View vocabulary |
| S7 vocabulary first-run | "The vocabulary is what symptom text lands on. It starts with 36 seeded terms — review them, add your clinic's colloquial phrases, or paste a list." | "المسرد هو ما يحطّ عليه نص الأعراض. يبدأ بـ36 مصطلحاً مزروعاً — راجعها، وأضف عبارات عيادتك العامية، أو الصق قائمة." | Review seeded terms / Paste list |
| S7 filtered-empty | "No terms match this search or filter." | "لا مصطلحات تطابق هذا البحث أو المرشّح." | Clear search |
| S8 patient, form already submitted (token used) | "This form was already submitted. If something changed, tell the front desk — they can open it again properly." | "سلّمت هذه الاستمارة بالفعل. إن تغيّر شيء، أخبر الاستقبال — يستطيعون فتحها من جديد بالطريقة الصحيحة." | — |
| S9 jobs empty | "Nothing running. Vocabulary imports and intake exports appear here while they work." | "لا مهام قيد التنفيذ. استيرادات المسرد وتصديرات القبول تظهر هنا أثناء عملها." | — |
| S9 artifacts empty | "No export packages yet. Any reviewed intake can become one — bilingual record, answers table, normalization annex." | "لا حزم تصدير بعد. أي قبول مُراجَع يمكن أن يصير واحدة — سجل ثنائي اللغة، وجدول إجابات، وملحق تطبيع." | Export an intake |
| S10 activity empty | "Nothing has happened in this workspace yet — every publish, submission, confirmation, and export will be logged here." | "لم يقع شيء في مساحة العمل هذه بعد — كل نشر وتسليم وتأكيد وتصدير سيُسجَّل هنا." | — |
| Draft-answers empty on resume | "You're back where you left off — no answers yet on this form." | "عدت إلى حيث توقفت — لا إجابات بعد في هذه الاستمارة." | Start |
| Vocabulary needed for a symptom field (none bound) | "This symptom field has no vocabulary to match against — add terms and matching begins." | "حقل الأعراض هذا بلا مسرد يطابقه — أضف المصطلحات وتبدأ المطابقة." | Open vocabulary |

## B. Loading (P02/P12 — skeletons mirror the one-question layout / console geometry per direction; honest determinate progress)

| State | English | Arabic |
|---|---|---|
| Fill shell boot | skeleton of the question card + spine, direction-aware | هيكلية بطاقة السؤال والعمود الفقري، باتجاه العرض |
| Resume in progress | "Bringing back your answers…" | "جارٍ إرجاع إجاباتك…" |
| Autosave (P10) | "Autosaving…" → "Autosaved" (fades after 3s) | "جارٍ الحفظ التلقائي…" → "حُفظت تلقائياً" |
| Submissions queue | skeleton rows ×8 | صفوف هيكلية |
| Submission open (staged) | answers first, then matches: "Loading the intake…" | الإجابات أولاً ثم المطابقات: "جارٍ تحميل القبول…" |
| Vocabulary list | skeleton rows ×6 | صفوف هيكلية |
| Dictionary chips (the ≤120ms window) | reserved region, no text (usually invisible) | منطقة محجوزة بلا نص (غير مرئية غالباً) |
| Assist suggestions (bound) | reserved region with quiet mark | منطقة محجوزة بعلامة هادئة |
| Vocabulary import (determinate) | "Importing terms — row 17 of 36. Two rows will be named when it lands." | "استيراد المصطلحات — السطر 17 من 36. سطران سيُسمّيان عند الاكتمال." |
| Export package (determinate) | "Packaging 12 intakes — bilingual record 3 of 12." | "تجميع 12 قبولاً — السجل ثنائي اللغة 3 من 12." |
| Term save | "Saving the term…" | "جارٍ حفظ المصطلح…" |
| Publish | "Checking both languages…" | "جارٍ فحص اللغتين…" |
| Gate refresh | (derived read — updates within 120ms, no spinner) | (قراءة مشتقة — تتحدث خلال 120 مللي ثانية، بلا مؤشر دوران) |

## C. Errors (7 classes; every error names the next action; no answer text anywhere)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (publish gate) | "Publish refused — 3 gaps: the date-of-birth question has no English label, the 'fasting' option has no Arabic label, and the consent line has no English text. The form stays a draft; every gap links to its field." | "رُفض النشر — 3 فجوات: سؤال تاريخ الميلاد بلا تسمية إنجليزية، وخيار 'صائم' بلا تسمية عربية، وسطر الموافقة بلا نص إنجليزي. تبقى الاستمارة مسودة؛ وكل فجوة ترتبط بحقلها." |
| VALIDATION (required field at advance) | "This question is required — answer it to move on." | "هذا السؤال مطلوب — أجب عنه للمتابعة." |
| VALIDATION (submit with missing) | "3 required questions remain — first: date of birth. The form is saved as-is; answer them and submit again." | "3 أسئلة مطلوبة متبقية — أولها: تاريخ الميلاد. الاستمارة محفوظة كما هي؛ أجب عنها وسلّم مجدداً." |
| VALIDATION (consent missing) | "The consent line needs your agreement before the form can be submitted." | "سطر الموافقة يحتاج موافقتك قبل تسليم الاستمارة." |
| VALIDATION (term canonical pair) | "A term needs both languages — 'صداع' has no English canonical." | "المصطلح يحتاج اللغتين — 'صداع' بلا صيغة إنجليزية." |
| VALIDATION (duplicate canonical) | "Two active terms normalize to the same text — 'دوخة' and 'دوار' can't both be canonical. Merge or rename one." | "مصطلحان فعّالان يتطبعان إلى النص ذاته — 'دوخة' و'دوار' لا يمكن أن يكونا معاً أصلاً. ادمج أحدهما أو أعد تسميته." |
| VALIDATION (correct without target) | "Pick the term this should map to — a correction needs its destination." | "اختر المصطلح الذي ينبغي أن تُسند إليه — التصحيح يحتاج وجهته." |
| VALIDATION (review gate) | "Review refused — 2 matches are pending confirmation. Confirm or correct them, then mark the intake reviewed." | "رُفضت المراجعة — مطابقتان قيد التأكيد. أكّدهما أو صحّحهما، ثم وسِم القبول مُراجَعاً." |
| NOT_FOUND (expired fill token) | "This form's time window closed 2 hours ago. The answers you gave are retained by the clinic — ask the front desk to open it again; they'll start it properly, not from a stale link." | "أُغلقت نافذة هذه الاستمارة قبل ساعتين. إجاباتك محفوظة لدى العيادة — اطلب من الاستقبال فتحها من جديد؛ سيبدؤونها بالطريقة الصحيحة، لا من رابط منقضٍ." |
| NOT_FOUND (stale submission/form link) | "That submission or form is gone from this workspace — it may have been archived while you were away." | "ذلك التسليم أو الاستمارة غاب عن مساحة العمل — ربما أُرشِفت أثناء غيابك." → العودة إلى قائمة التسليمات |
| NOT_FOUND (expired artifact) | "This export expired 3 days ago. Regenerate it — the intake it came from is unchanged." | "انتهت صلاحية هذا التصدير قبل 3 أيام. أعد توليده — القبول الذي صدر عنه لم يتغيّر." |
| PERMISSION (patient-token scope) | "This form link doesn't open other patients' intakes — it opens exactly one." | "رابط الاستمارة هذا لا يفتح قبول مرضى آخرين — يفتح واحداً بعينه." |
| PERMISSION (reviewer attempting builder write) | "Your seat reviews intakes; building forms needs the builder seat. Ask the clinic manager." | "مقعدك يراجع القبول؛ وبناء الاستمارات يحتاج مقعد بانٍ. اطلبه من مدير العيادة." |
| PERMISSION (capability unconsented) | "The assist capability needs to be granted to this workspace first. The dictionary keeps matching in the meantime — nothing pauses." | "تحتاج قدرة المساعدة إلى منحها لمساحة العمل هذه أولاً. يواصل المسرد المطابقة في الأثناء — لا شيء يتوقف." |
| CONFLICT (concurrent form edit) | "Another seat saved changes to this form while you worked. Both versions are shown — choose what stays." | "حفظ مقعد آخر تغييرات في هذه الاستمارة أثناء عملك. النسختان معروضتان — اختر ما يبقى." |
| CONFLICT (concurrent review change) | "The review state moved while you acted on it — the current state is shown." | "تحركت حالة المراجعة أثناء تصرفك — الحالة الحالية معروضة." |
| CONFLICT (already-resolved match) | "This match was already resolved by another seat — it now reads 'confirmed'." | "حُلّت هذه المطابقة بالفعل من مقعد آخر — وهي الآن 'مؤكدة'." |
| CONFLICT (archive count drift) | "The open-submission count changed since you confirmed — it is 5 now, not 3. Recount and confirm." | "تغيّر عدد التسليمات المفتوحة منذ تأكيدك — إنه 5 الآن، لا 3. أعد العد وأكّد." |
| RATE_LIMIT (export window) | "The export window is used for this cycle — the next package frees up on 1 Nov. Nothing about your intakes changes." | "استُهلكت نافذة التصدير لهذه الدورة — تتحرر الحزمة التالية في 1 نوفمبر. لا شيء في قبولاتك يتغيّر." |
| RATE_LIMIT (import window) | "The vocabulary-import window is used this cycle. The vocabulary you have keeps working — imports resume 1 Nov." | "استُهلكت نافذة استيراد المسرد لهذه الدورة. المسرد الحالي يواصل العمل — تستأنف الاستيرادات في 1 نوفمبر." |
| NETWORK (fill autosave) | "You're offline — answers are kept on this device and save when the connection returns." | "أنت دون اتصال — تُحفظ الإجابات على هذا الجهاز وتُحفَظ لدى عودته." |
| NETWORK (queue fetch) | "The submissions list went stale — reconnecting. Every review you made is safe." | "تقادمت قائمة التسليمات — تجري إعادة الاتصال. كل مراجعة أجريتها آمنة." |
| NETWORK (export partial) | "The package delivered 2 of 3 parts — the bilingual record and answers table arrived, the normalization annex didn't. Retry just the annex." | "سلّمت الحزمة جزأين من 3 — وصل السجل ثنائي اللغة وجدول الإجابات، ولم يصل ملحق التطبيع. أعد محاولة الملحق وحده." |
| UNKNOWN | "Something failed on our side (ref pif-corr-0001). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع pif-corr-0001). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; counts and canonical pairs only — never answer text)

| Moment | English | Arabic |
|---|---|---|
| Form published | "Published at version 3 — both languages complete, 18 questions, consent included. Submissions in flight keep version 2." | "نُشرت في الإصدار 3 — اللغتان مكتملتان، و18 سؤالاً، والموافقة مشمولة. التسليمات الجارية تحتفظ بالإصدار 2." |
| Fill invitation created | "Invitation ready — link, printed QR, or kiosk. It stays open for 72 hours." | "الدعوة جاهزة — رابط، أو رمز QR مطبوع، أو كشك. تبقى مفتوحة 72 ساعة." |
| Autosave | "Autosaved — 6 of 18 answered." | "حُفظت تلقائياً — أُجيب عن 6 من 18." |
| Resumed | "You're back — 6 answers restored, starting where you stopped." | "عدت — أُرجعت 6 إجابات، تبدأ من حيث توقفت." |
| Symptom chip accepted (dictionary) | "Added: صداع — headache (matched by normalization)." | "أُضيف: صداع — headache (مطابقة بالتطبيع)." |
| Assist chip attached | "Suggestion attached — the clinic's staff will confirm it." | "أُرفق الاقتراح — سيؤكده موظفو العيادة." |
| Submitted (patient confirmation card) | "Your intake is with the clinic — 4 sections, 18 answers. Hand this screen to the front desk if you're at the clinic." | "استمارتك لدى العيادة — 4 أقسام، و18 إجابة. أرِ هذه الشاشة للاستقبال إن كنت في العيادة." |
| Staff-authored submission | "Recorded as staff-entered — your name and today's date are on it, as the paper path requires." | "سُجِّل بإدخال من الموظفين — اسمك وتاريخ اليوم عليه، كما يتطلب مسار الورق." |
| Match confirmed | "Confirmed — 'ضيق نفس' now carries the term 'ضيق التنفس — shortness of breath'. The patient's words stay as written." | "أُكّدت — 'ضيق نفس' يحمل الآن مصطلح 'ضيق التنفس — shortness of breath'. كلمات المريض تبقى كما كُتبت." |
| Match corrected | "Mapping corrected to 'ألم في الصدر — chest pain'. The original text is unchanged — only the mapping moved." | "صُحح الإسناد إلى 'ألم في الصدر — chest pain'. النص الأصلي بلا تغيير — الإسناد وحده تحرّك." |
| Variant added from unmatched text | "Added as a variant of 'صداع — headache' — next time this phrase appears, the dictionary will know it." | "أُضيفت صيغة عامية لمصطلح 'صداع — headache' — في المرة القادمة سيعرفها المسرد." |
| Urgent flag raised | "Urgent flag: 1 term — 'ضيق التنفس — shortness of breath'. The exact answer is one link away; the decision is yours." | "إشارة عاجلة: مصطلح واحد — 'ضيق التنفس — shortness of breath'. الإجابة الدقيقة على بُعد رابط واحد؛ والقرار لك." |
| Flag escalated | "Escalated to the nurse line at 10:42 — your name and note are on the record." | "صُعِّد إلى خط التمريض في 10:42 — اسمك وملاحظتك على السجل." |
| Marked reviewed | "Reviewed — 3 symptom entries, all matched and confirmed, 1 urgent flag escalated. 14 intakes remain in the queue." | "رُوجِع — 3 مداخل أعراض، كلها مطابِقة ومؤكدة، وإشارة عاجلة واحدة مُصعَّدة. يتبقى 14 قبولاً في القائمة." |
| Export ready | "Intake package ready — bilingual record, answers table, normalization annex. Expires in 7 days; regenerable forever." | "حزمة القبول جاهزة — السجل ثنائي اللغة، وجدول الإجابات، وملحق التطبيع. تنتهي بعد 7 أيام؛ وتُعاد توليدها دائماً." |
| Vocabulary import done | "36 terms in — 2 rows named and skipped: row 9 has no English canonical, row 21's variants column is malformed." | "دخل 36 مصطلحاً — وسطران سُمّيا وتُخطيا: السطر 9 بلا صيغة إنجليزية، وعمود صيغ السطر 21 معطوب." |
| Term saved | "Term saved at version 4 — existing matches keep version 3; the next match uses the new one." | "حُفظ المصطلح في الإصدار 4 — المطابقات القائمة تحتفظ بالإصدار 3؛ والمطابقة التالية تستخدم الجديد." |
| Policy changed | "Retention set to 90 days — applies to intakes resolved from now on; existing records keep their original window." | "حُدِّدت مدة الاحتفاظ بـ90 يوماً — تسري على القبولات المحلولة من الآن؛ والسجلات القائمة تحتفظ بنافذتها الأصلية." |

## E. Signature moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| The Calm Hand-off (T2 signature — 05) | "Your intake is with the clinic. 4 sections, 18 answers — kept exactly as you wrote them." | "استمارتك لدى العيادة. 4 أقسام، و18 إجابة — محفوظة تماماً كما كتبتها." |
| The dictionary catches a dialect | "'سخونيه' found its term — 'حمى — fever'. The spelling you typed stayed yours; the match did the bending." | "'سخونيه' وجدت مصطلحها — 'حمى — fever'. هجاؤك الذي كتبته بقي لك؛ والمطابقة هي التي انحنت." |
| The honest unmatched | "No term matched this phrase — it's kept exactly as written and handed to the clinic's staff, who speak this language too." | "لا مصطلح طابق هذه العبارة — حُفظت كما كُتبت تماماً وسُلِّمت لموظفي العيادة، وهم أيضاً يتحدثون هذه اللغة." |
| The assist, honestly labeled | "Suggested by the assist capability — a staff member confirms it before it counts. It is a proposal, not a verdict." | "اقترحته قدرة المساعدة — يؤكده أحد الموظفين قبل أن يُعتدّ به. إنه اقتراح، لا حكم." |
| The gate refuses a half-translated form | "The gate refuses — this form would leave patients guessing. 3 gaps, each linked, each fixable in a minute." | "ترفض البوابة — هذه الاستمارة ستترك المرضى يخمّنون. 3 فجوات، كلها مرتبطة، وكلها تُصلَح في دقيقة." |
| The red flag, without drama | "1 urgent term on this intake. It counts because your clinic marked it urgent — the product counted, you decide." | "مصطلح عاجل واحد في هذا القبول. يُعَدّ لأن عيادتك وسِمته عاجلاً — المنتج يعدّ، وأنت تقرّر." |
| The boundary, named | "This is an intake record, not a chart entry. Nothing was written into any other system from here." | "هذا سجل قبول، لا مدخل في ملف طبي. لم يُكتب شيء في أي نظام آخر من هنا." |
| Sample form badge | "Sample form — a colloquial phrase, a suggestion to confirm, and one urgent flag. Clear it whenever real work arrives." | "استمارة عيّنة — عبارة عامية، واقتراح ينتظر تأكيداً، وإشارة عاجلة واحدة. امسحها متى وصل العمل الحقيقي." |

## F. Bidi / mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Latin drug name inside an Arabic answer | "The Latin name renders left-to-right inside the right-to-left answer — isolated, so the dose and the punctuation stay where you put them." | "يُعرض الاسم اللاتيني من اليسار إلى اليمين داخل الإجابة العربية — معزولاً، فتبقى الجرعة والترقيم حيث وضعتها." |
| Patient's English answer in the Arabic console | "Her answer renders in its own direction inside the Arabic console — the answer's direction follows its writer, never the reader." | "تُعرض إجابتها باتجاهها الخاص داخل واجهة عربية — اتجاه الإجابة يتبع كاتبها، لا قارئها أبداً." |
| The canonical pair, both scripts, one row | "'صداع — headache' renders as one bilingual row: Arabic right-to-left, English left-to-right, the dash never wandering." | "يُعرض 'صداع — headache' صفاً ثنائياً واحداً: العربية من اليمين إلى اليسار، والإنجليزية من اليسار إلى اليمين، والشرطة لا تتيه أبداً." |
| Numbers in both directions | "Dates, counts, and pain-scale values keep one physical order in both directions — 7 is 7 in either console." | "التواريخ والعدّ وقيم مقياس الألم تحافظ على ترتيب فيزيائي واحد في الاتجاهين — 7 هي 7 في أي واجهة." |
| The QR, direction-free | "The printed QR is the same square in any direction — what it carries is an opaque token, never a name or a symptom." | "رمز QR المطبوع المربع ذاته في أي اتجاه — وما يحمله رمزٌ مبهم، لا اسماً ولا عرَضاً." |
| Print, per-page direction | "The printed record runs Arabic pages right-to-left and English pages left-to-right, each under its own header — each language keeps its spine." | "يسير السجل المطبوع بصفحات عربية من اليمين إلى اليسار وصفحات إنجليزية من اليسار إلى اليمين — لكل لغة كعبها." |
