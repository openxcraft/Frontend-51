# 11 — Empty / Loading / Error: abandoned-cart-recovery (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR (bilingual-en product: EN-first chrome with full AR chrome as first-class citizen — both directions carry every operator string, and shopper-facing template copy is authored bilingually by construction) · voice = operator-desk: **plain, clock-aware, ledger-honest** (02) — states what is scheduled, what it costs in margin, when the window opens, and what happened; never sells · Arabic is فصحى بيضاء (utility precision) · **numerals Western everywhere per ledger row** (commerce data surface — never mixed systems mid-sentence, copy-voice §1.7) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked (02/07a): سلة متروكة=abandoned cart · متسوّق=shopper · تسلسل الاسترداد=recovery sequence · خطوة=step · قالب=template · نافذة الإرسال=send window · ساعات الهدوء=quiet hours · تأجيل=deferral · جدول الإرسال=send ledger · طابور الاسترداد=recovery queue · نطاق القيمة=value band · حافز=incentive · توجيه=routing · إخضاد=suppression · انسحاب=opt-out · تقرير الاسترداد=recovery report · تصدير=export · أولوية=priority.

## A. Empty states (P01 — four empties, never conflated)

| State | English | Arabic | Action |
|---|---|---|---|
| S1 first-run (no carts yet) | "No carts to recover yet. Paste your first import, or open the sample workspace and watch a send defer itself and a cart come back." | "لا سلال لاستردادها بعد. الصق أول استيراد، أو افتح مساحة العيّنة وشاهد رسالةً تؤجّل نفسها وسلةً تعود." | Paste carts / Open sample workspace |
| S1 filtered-empty | "No carts match these filters. Every cart stays in the queue — clear the filters to see them." | "لا سلال تطابق هذه المرشّحات. كل السلال باقية في الطابور — امسح المرشّحات لرؤيتها." | Clear filters |
| S1 no-access (viewer seat on a mutation surface) | "This workspace's carts are readable from your seat; the actions here need an operator seat." | "سلال مساحة العمل هذه مقروءة من مقعدك؛ الإجراءات هنا تحتاج مقعد مشغّل." | Switch workspace |
| S3 sequences first-run | "No sequences yet. A sequence is the ladder your carts climb — steps, delays, channels, bilingual templates." | "لا تسلسلات بعد. التسلسل هو السلّم الذي تصعده سلالك — خطوات وتأخيرات وقنوات وقوالب ثنائية اللغة." | Create sequence |
| S3 filtered-empty | "No sequences match these filters." | "لا تسلسلات تطابق هذه المرشّحات." | Clear filters |
| S4 library, no authored templates yet | "The stock library is here — six bilingual templates ready to bind. Yours will appear beside them as you author." | "مكتبة المخزون هنا — ستة قوالب ثنائية اللغة جاهزة للربط. ستظهر قوالبك بجانبها مع التأليف." | Author a template |
| S4 library filtered-empty | "No templates match these filters." | "لا قوالب تطابق هذه المرشّحات." | Clear filters |
| S4 dock, no drafts yet | "No generated drafts yet. Drafts arrive here only — never into a sequence — and need two reviews before they send anything." | "لا مسودات مولّدة بعد. تصل المسودات هنا فقط — لا إلى تسلسل أبداً — وتحتاج مراجعتين قبل أن ترسل أي شيء." | Generate variants / Open the library |
| S7 send ledger, no sends | "Nothing has been scheduled yet. Sends appear here the moment a cart enters a sequence — with their clocks." | "لم يُجدوَل شيء بعد. تظهر الرسائل هنا لحظة دخول سلة إلى تسلسل — مع ساعاتها." | Open the queue |
| S7 filtered-empty | "No sends match these filters. The ledger keeps every send — clear the filters to see them." | "لا رسائل تطابق هذه المرشّحات. يحتفظ الجدول بكل رسالة — امسح المرشّحات لرؤيتها." | Clear filters |
| S8 suppression ledger empty | "No suppressions on record. When a shopper opts out, the entry lands here and every future cart is held at intake." | "لا عمليات إخضاد مسجّلة. حين ينسحب متسوّق يصل القيد هنا وتُحجز كل سلة قادمة عند الاستيعاب." | — |
| S9 report, window with no events | "This window holds no recorded events — the report derives from events only and quotes nothing it did not record." | "لا أحداث مسجّلة في هذه النافذة — التقرير يُشتق من الأحداث فقط ولا يستشهد بما لم يسجّله." | Change window |
| S10 jobs empty | "Nothing running. Imports, generations, and exports appear here while they work." | "لا مهام قيد التنفيذ. تظهر الاستيرادات والتوليدات والتصديرات هنا أثناء عملها." | — |
| No channel bound (posture notice, not an empty) | "No message channel is bound. Sends hold in the ledger, and the send-list export carries copy-ready messages for dispatch through whatever you already use." | "لا قناة رسائل مرتبطة. تنتظر الرسائل في الجدول، ويحمل تصدير قائمة الإرسال رسائل جاهزة للإرسال عبر ما تستخدمه أصلاً." | Export send list |
| Generation capability unbound (rung 3) | "Generation is not bound — your library is the surface, labeled non-generative. Authoring, scheduling, and reporting never touch it." | "التوليد غير مرتبط — مكتبتك هي الواجهة، موسومة غير مولَّدة. التأليف والجدولة والتقارير لا تمسّها." | Open the library |

## B. Loading (P02/P12 — skeletons mirror queue/timeline geometry per direction; honest determinate progress)

| State | English | Arabic |
|---|---|---|
| S1 queue skeleton | skeleton rows ×10 mirroring row geometry (direction-aware) + "Loading the recovery queue…" | صفوف هيكلية + "جارٍ تحميل طابور الاسترداد…" |
| S2 cart detail | header + items + timeline skeletons, reserved widths | هيكلية الرأس والبنود والخط الزمني بعرض محجوز |
| Import job (determinate) | "Importing 9 of 14 carts — bad rows are named, under-threshold carts park." | "استيراد 9 من 14 سلة — الصفوف المعطوبة تُسمّى، وما دون الحد يُنتظر." |
| Generation stream (P13) | "Generating variant 3 of 4 — drafts only; stop any time." | "توليد الصيغة 3 من 4 — مسودات فقط؛ أوقف متى شئت." |
| Export job | "Packaging the export — report, send list, sequence archive." | "تجميع التصدير — التقرير وقائمة الإرسال وأرشيف التسلسل." |
| Report deriving | "Deriving the report from recorded events…" (derived read — no spinner beyond 300ms) | "اشتقاق التقرير من الأحداث المسجّلة…" |
| Preview computing | "Computing the timeline — every deferral included…" (≤150ms, 10) | "حساب الخط الزمني — مع كل تأجيل…" |
| Autosave (template + policy editors, P10) | "Saving…" → "Saved" (fades after 3s) | "جارٍ الحفظ…" → "حُفظ" |
| Ledger refresh | "Refreshing the send ledger…" | "تحديث جدول الإرسال…" |

## C. Errors (all 7 classes; every error names the next action; ≤2 sentences)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (import, empty total) | "Row 3 was refused — its cart total is empty. Rows 1–2 landed; fix row 3 and import it alone." | "رُفض السطر 3 — إجمالي سلة السطر فارغ. هبط السطران 1–2؛ صحّح السطر 3 واستورده وحده." |
| VALIDATION (import, total mismatch) | "Row 5 was refused — its total reads 260.00 SAR but its items sum to 250.00. Prior rows are kept." | "رُفض السطر 5 — إجماليه 260.00 ريال بينما مجموع بنوده 250.00. الصفوف السابقة محفوظة." |
| VALIDATION (unknown template variable) | "'{{first_nam}}' is not a known variable — the set is listed beside the editor. Fix it in the English subject, column 1." | "'{{first_nam}}' ليست متغيّراً معروفاً — المجموعة مدرجة بجوار المحرّر. صحّحها في الموضوع الإنجليزي، العمود 1." |
| VALIDATION (activation gate) | "Activation refused — 1 rule failed: step 1 binds template 'Generated draft — warm nudge', which is not approved. Approve it or bind an approved template." | "رُفض التفعيل — فشلت قاعدة واحدة: الخطوة 1 تربط قالب 'مسودة مولّدة — تنبيه دافئ' وهو غير معتمد. اعتمده أو اربط قالباً معتمداً." |
| VALIDATION (delay beyond expiry) | "Step 3's delay (80h) runs past this sequence's expiry (72h). Shorten the delay or extend the expiry." | "تأخير الخطوة 3 (80 ساعة) يتجاوز انتهاء التسلسل (72 ساعة). قصّر التأخير أو مدّد الانتهاء." |
| VALIDATION (routing threshold inversion) | "The low band's ceiling (400) can't sit above the high band's floor (150) — fix both numbers before saving." | "لا يمكن أن يعلو سقف النطاق المنخفض (400) أرضية النطاق المرتفع (150) — صحّح الرقمين قبل الحفظ." |
| VALIDATION (quiet-window sanity) | "A send window can't open and close at the same minute — 21:00–21:00 is refused. Windows may cross midnight; they can't be empty." | "لا يمكن أن تُفتح نافذة الإرسال وتُغلق في الدقيقة ذاتها — رُفضت 21:00–21:00. يجوز للنوافذ عبور منتصف الليل؛ ولا يجوز أن تكون فارغة." |
| VALIDATION (override on suppressed shopper) | "This shopper is suppressed — entry from 12 Oct, reason 'complaint'. Restore the entry first if this override is intended." | "هذا المتسوّق مُخضَد — قيد من 12 أكتوبر، السبب 'شكوى'. استعد القيد أولاً إن كان هذا التجاوز مقصوداً." |
| VALIDATION (promotion without review) | "Promotion needs the review step — the diff is open, compare both locales, then confirm. Drafts never skip this gate." | "الترقية تحتاج خطوة المراجعة — الفروق مفتوحة، قارن اللغتين ثم أكّد. لا تتجاوز المسودات هذه البوابة أبداً." |
| VALIDATION (empty send-list export) | "The send list is empty — every cart in this window is recovered, expired, or held. Nothing to dispatch; no blank file was created." | "قائمة الإرسال فارغة — كل سلة في هذه النافذة مستردة أو منتهية أو محجوزة. لا شيء للإرسال؛ ولم يُنشأ ملف فارغ." |
| VALIDATION (pause/retire count drift) | "The count changed since you read it — 14 sends are pending now, not 13. Recount and confirm." | "تغيّر العدد منذ قراءته — 14 رسالة قيد الانتظار الآن، لا 13. أعد العد وأكّد." |
| NOT_FOUND (stale link) | "That cart, sequence, or template is gone from this workspace. The queue keeps everything current — jump back from there." | "تلك السلة أو التسلسل أو القالب غاب عن مساحة العمل. الطابور يحمل كل شيء حاليّاً — عد منه." |
| NOT_FOUND (expired artifact) | "This export expired on 26 Oct. Regenerate it — the state it came from is unchanged and the rebuild is identical." | "انتهت صلاحية هذا التصدير في 26 أكتوبر. أعد توليده — الحالة التي صدر عنها لم تتغيّر وإعادة البناء مطابقة." |
| NOT_FOUND (expired draft set) | "This draft set expired on 15 Oct. Drafts are working material, not library stock — regenerate from the base template." | "انتهت صلاحية هذه المجموعة في 15 أكتوبر. المسودات مادة عمل لا مخزون مكتبة — أعد التوليد من القالب الأساس." |
| NOT_FOUND (event for unknown cart) | "No cart 0055 exists in this workspace. Check the id, or import the cart first — events bind to carts." | "لا سلة 0055 في مساحة العمل هذه. تحقق من المعرّف أو استورد السلة أولاً — الأحداث ترتبط بالسلال." |
| PERMISSION (cart-source consent) | "The cart-source capability isn't granted to this workspace. Grant it — or paste the carts; pasting always works." | "قدرة مصدر السلال غير ممنوحة لمساحة العمل هذه. امنحها — أو الصق السلال؛ اللصق يعمل دائماً." |
| PERMISSION (generation consent) | "The generation capability isn't granted. Grant it — or work from your library, which is fully functional and labeled non-generative." | "قدرة التوليد غير ممنوحة. امنحها — أو اعمل من مكتبتك، وهي كاملة الوظيفة وموسومة غير مولَّدة." |
| PERMISSION (viewer role) | "Your seat reads the queue, ledger, and reports but doesn't act here. Ask the workspace owner for an operator seat." | "مقعدك يقرأ الطابور والجدول والتقارير ولا يتصرف هنا. اطلب من مالك مساحة العمل مقعد مشغّل." |
| CONFLICT (concurrent sequence edit) | "Faisal saved this sequence while you edited. Both versions are kept — choose what stays." | "حفظت فيصل هذا التسلسل أثناء تحريرك. الاحتفاظ بالنسختين — اختر ما يبقى." |
| CONFLICT (concurrent template edit) | "Dana saved this template while you edited. Both versions sit side by side — pick one." | "حفظت دانا هذا القالب أثناء تحريرك. النسختان جنباً إلى جنب — اختر إحداهما." |
| CONFLICT (concurrent policy edit) | "This policy moved under you — another seat saved version 3. Your edit and theirs are both kept with their diffs." | "تحركت هذه السياسة تحتك — حفظ مقعد آخر الإصدار 3. تعديلك وتعديلهم محفوظان مع فروقهما." |
| CONFLICT (concurrent cart override) | "Another seat overrode this cart minutes ago. Both assignments and their reasons are in the ledger — re-decide from there." | "تجاوز مقعد آخر هذه السلة قبل دقائق. التعيينان وسببهما في السجل — أعد القرار منه." |
| RATE_LIMIT (generation quota) | "This window's generation allowance is used — 12 of 12 variants. The library is the surface until 1 Nov; scheduling never touched." | "استُهلكت مخصصات التوليد لهذه النافذة — 12 من 12 صيغة. المكتبة هي الواجهة حتى 1 نوفمبر؛ والجدولة لم تُمسّ." |
| RATE_LIMIT (export quota) | "The export window is used — 6 of 6 packages this cycle. The next frees on 1 Nov; the queue and ledger never stop working." | "استُهلكت نافذة التصدير — 6 من 6 حزم في هذه الدورة. تتحرر التالية في 1 نوفمبر؛ والطابور والجدول لا يتوقفان." |
| NETWORK (list fetch) | "The queue went stale — the connection dropped. Reconnecting; every decision you made is safe." | "تقادم الطابور — انقطع الاتصال. تجري إعادة الاتصال؛ وكل قرار اتخذته آمن." |
| NETWORK (dispatch failure) | "Dispatch failed for cart 012, step 1 — the message channel refused it (ref acr-corr-0007). Retry the dispatch, or export the send list and send it yourself." | "فشل إرسال السلة 012، الخطوة 1 — رفضتها قناة الرسائل (مرجع acr-corr-0007). أعد محاولة الإرسال، أو صدّر قائمة الإرسال وأرسلها بنفسك." |
| NETWORK (artifact download) | "The artifact didn't finish downloading — it's held and unexpired. Retry the download." | "لم يكتمل تنزيل الأثر — محفوظ وغير منتهٍ. أعد محاولة التنزيل." |
| UNKNOWN | "Something failed on our side (ref acr-corr-0003). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع acr-corr-0003). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips + counts; the counter moves only at recovery)

| Moment | English | Arabic |
|---|---|---|
| Import done | "14 carts in — 1 parked under threshold, 1 held at intake (suppressed shopper), 0 bad rows." | "دخلت 14 سلة — 1 منتظرة تحت الحد، و1 محجوزة عند الاستيعاب (متسوّق مُخضَد)، و0 صفوف معطوبة." |
| Import partial | "2 carts landed; row 3 was named and refused. Import row 3 alone when it's fixed." | "هبطت سلتان؛ سُمّي السطر 3 ورُفض. استورد السطر 3 وحده بعد إصلاحه." |
| Sequence activated | "Sequence active — version 3 serves new assignments. Existing sends keep their pinned versions." | "التسلسل مفعّل — الإصدار 3 يخدم التعيينات الجديدة. الرسائل القائمة تحتفظ بإصداراتها المثبّتة." |
| Sequence forked | "Active version 3 keeps serving; you are editing draft version 4. Activate to promote it." | "الإصدار 3 المفعّل يستمر في الخدمة؛ أنت تحرّر المسودة 4. فعّل لترقيتها." |
| Deferral recorded (visible, not silent) | "Send deferred — cart 002, step 1: due 23:40 America/New_York, outside send window 08:00–21:00 (US-FED, statutory anchor — 47 CFR 64.1200(c)(1)); deferred to 08:00." | "أُجّلت الرسالة — السلة 002، الخطوة 1: الاستحقاق 23:40 America/New_York، خارج نافذة الإرسال 08:00–21:00 (US-FED، مرساة قانونية — 47 CFR 64.1200(c)(1))؛ أُجّلت إلى 08:00." |
| Opt-out recorded | "Opt-out recorded — 1 pending send stopped, future carts held at intake. The suppression entry is in the ledger." | "سُجّل الانسحاب — توقفت رسالة قيد الانتظار، وتُحجز السلال القادمة عند الاستيعاب. قيد الإخضاد في السجل." |
| Suppression restored | "Restored — your note is in the ledger beside the original entry. New carts enter recovery normally." | "استُعيد — ملاحظتك في السجل بجوار القيد الأصلي. السلال الجديدة تدول الاسترداد بشكل طبيعي." |
| Override recorded | "Cart 011 assigned to High-value ladder — your reason is in the ledger; the schedule re-anchors from now." | "سُندت السلة 011 إلى سلّم القيمة المرتفعة — سببك في السجل؛ ويعيد الجدول التثبيت من الآن." |
| Recovery cancelled | "Recovery cancelled for cart 014 — 2 remaining steps stopped, history stays. Reason recorded." | "أُلغي الاسترداد للسلة 014 — توقفت خطوتان متبقيتان، ويبقى التاريخ. السبب مسجّل." |
| Template approved | "Template approved at version 2 — actor and timestamp recorded. Steps can bind it." | "اعتُمد القالب في الإصدار 2 — الفاعل والطابع الزمني مسجّلان. تستطيع الخطوات ربطه." |
| Draft promoted | "Promoted to a draft template — origin 'generated-promoted' is permanent. Approval is the next, separate gate." | "رُقّيت إلى قالب مسودة — الأصل 'مولَّد مرقّى' دائم. الاعتماد هو البوابة التالية المنفصلة." |
| Export ready | "Export ready — report, send list, sequence archive. Expires in 7 days; regenerable from unchanged state." | "التصدير جاهز — التقرير وقائمة الإرسال وأرشيف التسلسل. ينتهي بعد 7 أيام؛ ويُعاد توليده من حالة لم تتغيّر." |
| Artifact regenerated | "Regenerated — identical to the state it came from. That is what deterministic means here." | "أُعيد توليده — مطابق للحالة التي صدر عنها. هذا معنى الحتمية هنا." |
| Manual event recorded | "Recorded — provenance 'manual', your name and the claimed time on the entry. The funnel counts it like any other." | "سُجّل — المنشأ 'يدوي'، واسمك والوقت المزعوم على القيد. يعدّه القمع كأي حدث آخر." |
| Usage warning (80%, P14) | "Generation is at 80% of this window — 10 of 12 variants. The library stays open regardless." | "التوليد عند 80% من هذه النافذة — 10 من 12 صيغة. تبقى المكتبة مفتوحة على أي حال." |

## E. Signature moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| **The Cart Comes Back** (T2 signature, 05) | "Cart 005 recovered — SAR 349.00. 3 of 14 carts recovered this window." | "عادت السلة 005 — 349.00 ريال. 3 من 14 سلة مستردة في هذه النافذة." |
| The clock defers, visibly (the quiet-hours moment) | "23:40 fell inside quiet hours. The send waits for the window — nothing ships silently." | "وقعت 23:40 داخل ساعات الهدوء. تنتظر الرسالة النافذة — لا شيء يُرسل بصمت." |
| The preview oracle (CP-2.10) | "Same sequence, same policy, same clock — the preview and the ledger will always agree." | "التسلسل ذاته، والسياسة ذاتها، والساعة ذاتها — سيتفق المعاين والجدول دائماً." |
| The sample badge | "Sample workspace — 14 carts, a deferred pair, a recovered trio, one suppressed shopper. Clear it when real carts arrive; it never returns." | "مساحة عيّنة — 14 سلة، وزوج مؤجّل، وثلاثية مستردة، ومتسوّق مُخضَد. امسحها متى وصلت السلال الحقيقية؛ لا تعود أبداً." |
| Margin discipline lands (CP-4) | "Low band: no incentive. Mid: shipping at the last step. High: 15% at the final step only. Every offer now has a policy behind it." | "النطاق المنخفض: بلا حافز. المتوسط: الشحن في الخطوة الأخيرة. المرتفع: خصم 15% في الخطوة الأخيرة فقط. لكل عرض الآن سياسة خلفه." |
| The determinism note (report re-run) | "Re-derived the report — same events in, same numbers out. SAR 939.00 is the same 939.00." | "أُعيد اشتقاق التقرير — الأحداث ذاتها دخولاً، والأرقام ذاتها خروجاً. 939.00 ريال هي ذاتها 939.00." |

## F. Bidi / mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Latin handle inside Arabic chrome | "The Latin handle renders left-to-right inside the right-to-left chrome — isolated, punctuation stays put." | "يُعرض المعرّف اللاتيني من اليسار إلى اليمين داخل هيكل يجري من اليمين إلى اليسار — معزولاً، ويبقى الترقيم في مكانه." |
| Zone names inside Arabic strings | "America/New_York stays Latin in the Arabic defer reason — a place name is data, and data keeps its script." | "يبقى America/New_York باللاتينية في سبب التأجيل العربي — اسم المكان بيانات، والبيانات تحتفظ بخطّها." |
| Number order in both directions | "Times, totals, and counts keep one physical order in both directions — 23:40 is 23:40 in either chrome." | "الأوقات والإجماليات والعدّ تحافظ على ترتيب فيزيائي واحد في الاتجاهين — 23:40 هي 23:40 في أي هيكل." |
| Checkout URLs inside AR template bodies | "The {{checkout_url}} token renders LTR inside the RTL body — the editor marks the interpolation point at authoring time." | "يُعرض وسم {{checkout_url}} من اليسار إلى اليمين داخل النص الذي يجري من اليمين إلى اليسار — يوسم المحرّر نقطة الإدراج وقت التأليف." |
| The two-column authoring moment | "The English column flows leftward while the Arabic column flows rightward — one surface, two directions, alignment links between." | "يجري العمود الإنجليزي نحو اليسار بينما يجري العمود العربي نحو اليمين — سطح واحد، اتجاهان، وروابط محاذاة بينهما." |
