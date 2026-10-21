# 11 — Empty / Loading / Error: attendance-shift-planner (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR · voice = ops-floor calm-command (02: states the rule, the measured value, and the next action in one breath) · Arabic is فصحى بيضاء · **numerals Western everywhere per ledger row** (data surface — never mixed systems mid-sentence, copy-voice §1.7) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · warmth only in publish success and first-run, never in violations · terminology locked (02): فريق=team · عامل=worker · مؤهل=qualification · مناوبة=shift · إسناد المناوبة=shift assignment · خطة الأسبوع=week plan · مجموعة قواعد الولاية القضائية=jurisdiction ruleset · قاعدة=rule · مخالفة القاعدة=rule violation · تنازل مسجّل=waiver · نشر الخطة=publication · سجل النشر=publication record · تبادل=swap · حاجز النشر=publication gate · جدول الشبكة=planning grid · مفتش المخالفات=violation inspector · وضع رمضان=Ramadan mode.

## A. Empty states (four empties per P01 — every surface enumerated)

| State | English | Arabic | Action |
|---|---|---|---|
| S1 first-run (no teams) | "No teams yet. Create one and pin its ruleset — or open the sample team and watch the inspector name a planted violation." | "لا فرق بعد. أنشئ فريقاً وثبّت مجموعة قواعده — أو افتح فريق العيّنة وشاهد المفتش يسمّي مخالفة مزروعة." | Create team / Open sample team |
| S1 filtered-empty | "No teams match these filters." | "لا فرقاً تطابق هذه المرشّحات." | Clear filters |
| S1 no-access | "These teams belong to another workspace." | "هذه الفرق تخصّ مساحة عمل أخرى." | Switch workspace |
| S2 roster, no workers | "This team has no workers yet. Add them one by one, or paste the roster list." | "لا عاملين في هذا الفريق بعد. أضِفهم واحداً واحداً، أو الصق قائمة العاملين." | Add worker / Paste roster |
| S2 filtered-empty (roster) | "No workers match these filters — the roster keeps everyone." | "لا عاملين يطابقون هذه المرشّحات — القائمة تحتفظ بالجميع." | Clear filters |
| S2 qualifications, none yet | "The qualification library is empty. Stock entries ship with the workspace — this filters to none." | "مكتبة المؤهلات فارغة. المدخلات الجاهزة تأتي مع مساحة العمل — هذا المرشّح لا يظهر شيئاً." | Clear filters |
| S3 blank week plan | "This week is blank. Place the first shift in any cell — the inspector speaks only when a rule breaks." | "هذا الأسبوع فارغ. ضع المناوبة الأولى في أي خانة — لا يتحدث المفتش إلا عند كسر قاعدة." | Place first shift |
| S3 inspector, clean draft | "No violations. The rules ran against this draft — rest, caps, qualifications, unavailability — and found nothing." | "لا مخالفات. جرت القواعد على هذه المسودة — الراحة والحدود والمؤهلات وعدم التوفر — ولم تجد شيئاً." | View gate |
| S3 inspector, filtered-empty | "No violations match these filters. Others exist on this draft." | "لا مخالفات تطابق هذه المرشّحات. غيرها قائم على هذه المسودة." | Clear filters |
| S3 inspector, week-edge honesty | "Week-edge check limited: no published prior week found. Rest and consecutive-day rules see this week only." | "فحص حدّ الأسبوع محدود: لا أسبوع سابق منشور. قاعدتا الراحة والأيام المتتالية ترى هذا الأسبوع فقط." | — |
| S4 custom rulesets, none | "No custom rulesets yet. Clone KSA v1 or UAE v1 and tighten it to company policy." | "لا مجموعات قواعد مخصّصة بعد. استنسخ نسخة السعودية أو الإمارات وشدّدها وفق سياسة الشركة." | Clone a ruleset |
| S4 filtered-empty | "No rulesets match these filters." | "لا مجموعات قواعد تطابق هذه المرشّحات." | Clear filters |
| S5 publications, none | "Nothing published yet. A publication record is written when the gate opens." | "لا شيء منشور بعد. يُكتب سجل النشر عند انفتاح الحاجز." | Open planner |
| S5 swap log, no swaps | "No swaps recorded. Agreed swaps land here with their provenance — from, to, when, source." | "لا تبادلات مسجّلة. التبادلات المتّفق عليها تصل هنا مع مصدرها — من، إلى، متى، وكيف." | Record a swap |
| S7 jobs, nothing running | "Nothing running. Roster pastes, scans, exports, and swap imports appear here while they work." | "لا مهام قيد التنفيذ. لصق القوائم والفحوص والتصديرات واستيراد التبادلات تظهر هنا أثناء عملها." | — |
| S9 worker review, nothing published | "No published week to show yet. This view reads published plans only." | "لا أسبوع منشور للعرض بعد. هذه الشاشة تقرأ الخطط المنشورة فقط." | — |
| Gate, no blockers | "Nothing blocks publication. Blocking violations: 0. Coverage shortfalls: 0." | "لا شيء يعترض النشر. مخالفات معترضة: 0. نواقص تغطية: 0." | Publish week |

## B. Loading (P02/P12 — skeletons mirror the three-region grid geometry per direction; day columns mirror, worker names at own script)

| State | English | Arabic |
|---|---|---|
| S1 list skeleton | skeleton rows ×8 + "Loading your teams…" (SR) | صفوف هيكلية + "جارٍ تحميل فرقك…" |
| S3 grid boot | navigator + rail + grid + inspector skeletons, inspector width reserved | هيكلية الملاحّ والشريط والشبكة والمفتش، بعرض محجوز للمفتش |
| Roster paste (determinate) | "Importing the roster — row 34 of 46. Invalid rows will be named when the import lands." | "استيراد قائمة العاملين — السطر 34 من 46. السطور غير الصالحة ستُسمّى عند الاكتمال." |
| Guardrail scan (progressive) | "Checking worker 34 of 46 — Riyadh Flagship, KSA v1." | "فحص العامل 34 من 46 — فرع الرياض، السعودية إصدار 1." |
| Live recompute after a mutation | "Re-running the rules…" (≤120ms — usually invisible) | "إعادة تشغيل القواعد…" |
| Swap-set import | "Applying swap 3 of 12 — each application re-checked for both workers." | "تطبيق التبادل 3 من 12 — كل تطبيق يُفحص للعاملين معاً." |
| Export job | "Packaging the schedule — team grid, worker views, marketplace format." | "تجميع الجدول — شبكة الفريق، وصفحات العاملين، وصيغة السوق." |
| Artifact regeneration | "Regenerating the artifact from the published state…" | "إعادة توليد المخرج من الحالة المنشورة…" |
| Autosave (draft week, P10) | "Saving…" → "Saved" (fades after 3s) | "جارٍ الحفظ…" → "حُفظ" |
| Gate refresh | (derived read — updates within 120ms, no spinner) | (قراءة مشتقة — تتحدث خلال 120 مللي ثانية، بلا مؤشر دوران) |

## C. Errors (7 classes; every row names the failing operation and the next action)

| Class & trigger (operation) | English | Arabic |
|---|---|---|
| VALIDATION (`importRoster` malformed row) | "Row 7 of the roster paste has no weekly cap — rows 1–6 imported. Fix row 7 and import it alone." | "السطر 7 من اللصق بلا حدّ أسبوعي — استُوردت السطور 1–6. صحّح السطر 7 واستورده وحده." |
| VALIDATION (`createTeam` / `createWorker` fields) | "A team needs both names and a ruleset; a worker needs both names, a code, and a weekly cap — the empty fields are marked." | "يحتاج الفريق اسمين ومجموعة قواعد؛ ويحتاج العامل اسمين ورمزاً وحداً أسبوعياً — الحقول الفارغة معلّمة." |
| VALIDATION (`saveQualification` duplicate code) | "Qualification code CASH-2 already exists in the library — codes are the stable referent. Choose another." | "رمز المؤهل CASH-2 موجود في المكتبة — الرمز هو المرجع الثابت. اختر غيره." |
| VALIDATION (`upsertShift` times) | "The shift's times don't work — end 06:00 before start 22:00 crosses midnight only if you confirm it, and a break can't cover the whole span." | "أوقات المناوبة لا تستقيم — النهاية 06:00 قبل البداية 22:00 تعبر منتصف الليل فقط بتأكيدك، والاستراحة لا تغطي المدة كاملة." |
| VALIDATION (`placeAssignment` double-booked) | "Reem is already on the Tuesday close, 15:00–23:00 — one worker, one place. Choose another worker or another cell." | "ريم على إغلاق الثلاثاء 15:00–23:00 — عامل واحد في مكان واحد. اختر عاملاً آخر أو خانة أخرى." |
| VALIDATION (`createWeekPlan` empty team) | "A week plan needs at least one active worker — this team has none. Add workers first." | "تحتاج خطة الأسبوع عاملاً فعّالاً واحداً على الأقل — لا عاملين في هذا الفريق. أضِف العاملين أولاً." |
| VALIDATION (`waiveRuleViolation` without reason) | "A waiver needs a reason — it is the audit artifact. Say why this rule stands broken this week." | "يحتاج التنازل إلى سبب — إنه أثر التدقيق. قل لماذا تبقى هذه القاعدة مخالفةً هذا الأسبوع." |
| VALIDATION (`publishWeekPlan` gate refusal) | "Publication refused — 4 blocking violations and 1 coverage shortfall. First blocker: rest period, Sultan, 7h 30m provided, 11h required." | "رُفض النشر — 4 مخالفات معترضة ونقص تغطية واحد. أول معترض: فترة الراحة، سلطان، 7 ساعات و30 دقيقة متاحة، و11 ساعة مطلوبة." |
| VALIDATION (`saveCustomRuleset` impossible values) | "Minimum rest can't exceed 24h — this draft sets 25h. Fix the rest rule before saving." | "لا يمكن أن يتجاوز الحدّ الأدنى للراحة 24 ساعة — هذه المسودة تضع 25 ساعة. صحّح قاعدة الراحة قبل الحفظ." |
| VALIDATION (`recordExternalSwap` draft week) | "Swaps record against published weeks — this week is still a draft. Publish it first, then record the swap." | "تُسجَّل التبادلات ضد الأسابيع المنشورة — هذا الأسبوع ما يزال مسودة. انشره أولاً ثم سجّل التبادل." |
| VALIDATION (`recordExternalSwap` from-worker mismatch) | "That assignment belongs to Reem, not to the from-worker you named — record the swap from the current assignee." | "ذلك الإسناد لريم، لا للعامل الذي سمّيته مصدراً — سجّل التبادل من المُسند الحالي." |
| VALIDATION (`importSwapSet` wrong week) | "This swap set belongs to the week of 26 October; the plan opens the week of 19 October. Nothing was applied." | "هذه المجموعة تخصّ أسبوع 26 أكتوبر؛ والخطة تفتح أسبوع 19 أكتوبر. لم يُطبَّق شيء." |
| VALIDATION (`importSwapSet` conflicting lines) | "Two swaps touch the same assignment — line 3 applied, line 7 skipped and named. Re-record the skipped swap after the first settles." | "تبادلان يلامسان الإسناد نفسه — طُبّق السطر 3 وتُخطي السطر 7 وسُمّي. أعد تسجيل التبادل المتخطى بعد استقرار الأول." |
| NOT_FOUND (stale link — `getTeam` / `getWeekPlan` / `getJurisdictionRuleset` / `getPublicationRecord` / `deprecateQualification` / `removeShift` / `removeAssignment`) | "That team, plan, ruleset, shift, or qualification is gone from this workspace — it may have been removed while you were away." | "ذلك الفريق أو الخطة أو مجموعة القواعد أو المناوبة أو المؤهل غاب عن مساحة العمل — ربما أُزيل أثناء غيابك." → العودة إلى الفرق |
| NOT_FOUND (`getArtifact` expired) | "This export expired 3 days ago. Regenerate it — the published state it came from is unchanged." | "انتهت صلاحية هذا التصدير قبل 3 أيام. أعد توليده — الحالة المنشورة التي صدر عنها لم تتغيّر." |
| PERMISSION (viewer-role mutation — any authoring/publication/waiver/swap write) | "Your seat reads plans and ledgers; it doesn't author here. Ask the workspace owner for a planner seat." | "مقعدك يقرأ الخطط والسجلات ولا يحرّر هنا. اطلب من مالك مساحة العمل مقعد مخطّط." |
| PERMISSION (`importSwapSet` change-channel unconsented) | "The change channel needs the schedule-change capability granted to this workspace. Grant it — or paste the swap set; pasting always works." | "تحتاج قناة التغيير إلى منح قدرة تغيير الجدول لمساحة العمل هذه. امنحها — أو الصق مجموعة التبادلات؛ اللصق يعمل دائماً." |
| CONFLICT (`updateTeam` / `updateWorker` stale version) | "Another seat saved a newer version of this team while you edited. Both versions are kept — choose what stays." | "حفظ مقعد آخر نسخة أحدث من هذا الفريق أثناء تحريرك. الاحتفاظ بالنسختين — اختر ما يبقى." |
| CONFLICT (`updateAssignment` stale revision) | "The grid moved under you — this cell was edited by another seat. Both payloads are kept side by side." | "تحرّكت الشبكة تحتك — حرّر مقعد آخر هذه الخانة. النسختان محفوظتان جنباً إلى جنب." |
| CONFLICT (`saveCustomRuleset` stale version) | "This ruleset was saved at a newer version while you edited. Both drafts are kept — re-apply your change on the newer one." | "حُفظت هذه المجموعة بإصدار أحدث أثناء تحريرك. احتُفظ بالمسودتين — أعد تطبيق تغييرك على الأحدث." |
| CONFLICT (`waiveRuleViolation` already waived) | "This violation was already waived by another seat — the standing reason is shown." | "حُلّت هذه المخالفة بالتنازل من مقعد آخر — السبب القائم معروض." |
| CONFLICT (`publishWeekPlan` stale plan) | "Another seat published this week while you did. Both publication records are kept — the later one is the live plan." | "نشر مقعد آخر هذا الأسبوع أثناء عملك. احتُفظ بسجلي النشر — اللاحق هو الخطة القائمة." |
| CONFLICT (`recordExternalSwap` superseded week) | "This week was superseded by a newer publication — the swap must record against the live one." | "حلّ هذا الأسبوعَ نشرٌ أحدث — يجب تسجيل التبادل ضد النشر القائم." |
| RATE_LIMIT (`runGuardrailCheck` scan quota) | "This month's scan window is used. Editing and live re-checks keep working — full scans resume 1 November." | "استُهلكت نافذة الفحص لهذا الشهر. التحرير والفحص الفوري يعملان — تستأنف الفحوص في 1 نوفمبر." |
| RATE_LIMIT (`importRoster` paste quota) | "The roster-paste window is used for this cycle — it resets 1 November. Add workers one by one meanwhile." | "استُهلكت نافذة لصق القوائم لهذه الدورة — تُستأنف في 1 نوفمبر. أضِف العاملين واحداً واحداً حتى ذلك الحين." |
| RATE_LIMIT (`exportSchedule` quota) | "The export window is used for this cycle — the next bundle frees up 1 November. Nothing about your plan changes." | "استُهلكت نافذة التصدير لهذه الدورة — تتحرر الحزمة التالية في 1 نوفمبر. لا شيء في خطتك يتغيّر." |
| RATE_LIMIT (`importSwapSet` quota) | "The swap-import window is used — it resets 1 November. Record single swaps meanwhile; they never quota." | "استُهلكت نافذة استيراد التبادلات — تُستأنف في 1 نوفمبر. سجّل التبادلات الفردية حتى ذلك الحين؛ فهي بلا حصة." |
| NETWORK (list & boot reads — `listTeams` / `listWorkers` / `listQualifications` / `listJurisdictionRulesets` / `listWeekPlans` / `listRuleViolations` / `listJobs` / `getSession` / `getUsage`) | "The list went stale — reconnecting. Every edit you made is queued and safe." | "تقادمت القائمة — تجري إعادة الاتصال. كل تعديل أجريته في الطابور وآمن." |
| NETWORK (`exportSchedule` per-format partial) | "The bundle delivered 2 of 3 formats — team grid and worker views arrived; the marketplace format didn't. Retry just that format." | "سلّمت الحزمة صيغتين من 3 — وصلت شبكة الفريق وصفحات العاملين، ولم تصل صيغة السوق. أعد محاولة تلك الصيغة وحدها." |
| NETWORK (`importRoster` / `importSwapSet` mid-job) | "The connection dropped mid-import — rows applied so far are kept. Retry the remainder." | "انقطع الاتصال أثناء الاستيراد — السطور المطبّقة حتى الآن محفوظة. أعد محاولة الباقي." |
| UNKNOWN (any operation, typed) | "Something failed on our side (ref asp-corr-0001). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع asp-corr-0001). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; counts and state chips — no confetti)

| Moment | English | Arabic |
|---|---|---|
| Roster paste done | "46 workers in — 2 invalid rows named, 1 draft role flagged for review." | "دخل 46 عاملاً — سطران غير صالحين سُمّيا، ودور مسودة واحد معلّم للمراجعة." |
| Shift placed | "Thursday evening placed — 15:00–23:00, 4 required, 0 assigned." | "وُضعت سهرة الخميس — 15:00–23:00، 4 مطلوبين، 0 مُسنداً." |
| Assignment placed | "Sultan assigned to Monday open — rest and caps re-checked for him." | "أُسند سلطان إلى فتح الاثنين — أُعيد فحص الراحة والحدود له." |
| Violation resolved by edit | "Rest period passes — 11h 30m now provided, 11h required." | "فترة الراحة تجتاز — 11 ساعة و30 دقيقة متاحة الآن، و11 ساعة مطلوبة." |
| Second-order effect surfaced | "The move fixed Friday but broke Reem's weekly cap — 1560 of 1440. Both facts are in the inspector." | "أصلح النقلُ الجمعةَ وكسر حدّ ريم الأسبوعي — 1560 من 1440. الحقيقتان في المفتش." |
| Waiver recorded | "Waiver recorded — your reason, your name, and the timestamp travel with every export of this week." | "سُجّل التنازل — سببك واسمك والطابع الزمني ترافق كل تصدير لهذا الأسبوع." |
| Scan done | "Scan complete — 4 blocking, 2 warnings. KSA v1, computed twice-identical by design." | "اكتمل الفحص — 4 مخالفات معترضة، وتحذيران. السعودية إصدار 1، محسوبة بشكل مطابق بالتصميم." |
| Week published | "Week published — Riyadh Flagship, 19 October. 1 waiver with reason, 2 accepted warnings in the record." | "نُشر الأسبوع — فرع الرياض، 19 أكتوبر. تنازل واحد بسببه، وتحذيران مقبولان في السجل." |
| Amendment published | "Amendment published — 1 swap applied (Amal → Noura, Thu evening), 1 waiver added, both workers re-checked." | "نُشر التعديل — تبادل واحد مطبّق (أمل ← نورة، مساء الخميس)، وتنازل واحد مضاف، والمعاينة أُعيدت للعاملين." |
| Swap recorded | "Swap recorded — Amal to Noura, Thursday evening, agreed on the floor. 2 new violations named." | "سُجّل التبادل — من أمل إلى نورة، مساء الخميس، اتُّفق عليه في الميدان. مخالفتان جديدتان سُمّيتا." |
| Export ready | "Schedule bundle ready — team grid, worker views, marketplace format. Expires in 7 days; regenerable forever." | "حزمة الجدول جاهزة — شبكة الفريق، وصفحات العاملين، وصيغة السوق. تنتهي بعد 7 أيام؛ وتُعاد توليدها دائماً." |
| Artifact regenerated | "Artifact regenerated — identical to the state it came from. That is what deterministic means here." | "أُعيد توليد المخرج — مطابق للحالة التي صدر عنها. هذا معنى الحتمية هنا." |
| Ruleset saved | "Ruleset saved at version 2 — existing findings keep version 1; the next scan enforces the new one." | "حُفظت المجموعة بالإصدار 2 — النتائج القائمة تحتفظ بالإصدار 1؛ والفحص التالي يفرض الجديد." |
| Qualification deprecated | "Qualification deprecated — checks stop, history stays." | "أُهمل المؤهل — تتوقف الفحوص ويبقى التاريخ." |
| Ruleset re-bound | "Team re-bound to KSA v1 — drafts re-validate now; published weeks keep the version they were published under." | "أُعيد ربط الفريق بالسعودية إصدار 1 — يُعاد فحص المسودات الآن؛ والأسابيع المنشورة تحتفظ بإصدار نشرها." |

## E. Signature moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| Gate refusal (assertive) | "Not yet. 4 blocking violations and 1 coverage shortfall stand — first: Sultan's 7h 30m rest against 11h required. Clear or waive these and the gate opens." | "ليس بعد. 4 مخالفات معترضة ونقص تغطية قائمة — أولها: راحة سلطان 7 ساعات و30 دقيقة مقابل 11 ساعة مطلوبة. صفِّها أو تنازل عنها تُفتح البوابة." |
| The Week Seals (T2 signature) | "The week seals — 46 workers inside the rules, 1 reasoned waiver, one record you can defend. Sunday is done." | "يُختم الأسبوع — 46 عاملاً داخل القواعد، وتنازل واحد مسبَّب، وسجل واحد يمكنك الدفاع عنه. انتهى الأحد." |
| Ramadan mode engaged | "Ramadan mode — the caps are now 6h a day, 36h a week, until 9 March. Plan accordingly." | "وضع رمضان — الحدود الآن 6 ساعات يومياً و36 أسبوعياً، حتى 9 مارس. خطّط على ذلك." |
| Boundary catch (the spreadsheet's blind spot) | "Week-edge check caught it: Sunday's 23:00 close meets Monday's 06:30 open — 7h 30m of rest. The prior published week supplied the evidence." | "أمسك فحص حدّ الأسبوع: إغلاق الأحد 23:00 يلتقي فتح الاثنين 06:30 — 7 ساعات و30 دقيقة من الراحة. الأسبوع المنشور السابق قدّم الدليل." |
| Sample-team value moment (P22) | "That is the whole product: the inspector named the rule, the values, and the worker. Clear the sample when real work arrives." | "هذا هو المنتج كله: سمّى المفتش القاعدة والقيم والعامل. امسح العيّنة متى وصل العمل الحقيقي." |
| Determinism note (re-scan) | "Re-ran the scan — same state in, same findings out. The 4 blockers are the same 4." | "أُعيد تشغيل الفحص — الحالة ذاتها دخولاً، والنتائج ذاتها خروجاً. المعترضات الأربعة هي الأربعة ذاتها." |

## F. Bidi / mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Latin worker name inside Arabic chrome | "Ravi Kumar renders left-to-right inside the Arabic roster — isolated, its row's punctuation stays put." | "يُعرض Ravi Kumar من اليسار إلى اليمين داخل القائمة العربية — معزولاً، ويبقى ترقيم السطر في مكانه." |
| Bilingual team name in either chrome | "The team's two names travel together — فرع الرياض — المتجر الرئيسي first in Arabic chrome, Riyadh Flagship first in English, both stored." | "اسما الفريق يسافران معاً — «Riyadh Flagship / فرع الرياض — المتجر الرئيسي» بحسب اتجاه الهيكل، وكلاهما محفوظ." |
| Time order in both directions | "Times keep one physical order in both directions — 06:30 is 06:30 in either chrome." | "تحافظ الأوقات على ترتيب فيزيائي واحد في الاتجاهين — 06:30 هي 06:30 في أي هيكل." |
| Dual-calendar dates | "The navigator reads both calendars — Gregorian 19 October 2026 with Hijri alongside, each isolated so the pair never re-orders." | "يقرأ الملاّح تقويمين — ميلادي 19 أكتوبر 2026 مع الهجري بجواره، كلٌّ معزول فلا يتبادل الزوجان الترتيب." |
| Marketplace paste lines | "Swap lines carry Latin codes and Arabic names in one string — the parser splits on structure, never on script direction." | "تحمل سطور التبادل رموزاً لاتينية وأسماء عربية في سطر واحد — يفصل المحلّل على البنية، لا على اتجاه النص." |
