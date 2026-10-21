# 11 — Empty / Loading / Error: loyalty-stamp-card (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR (bilingual-ar product — both locales carry every string; the console renders its workspace locale, the pass renders the member locale) · voice = counter-plain (02: short declaratives a person can say mid-rush; warmth in success and empty states, never in failure) · Arabic is فصحى بيضاء utility register, unvocalized · numerals Western everywhere (ledger row — data surface; never mixed systems mid-sentence) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked: الختم=stamp · البطاقة=card · العميل=member · مكافأة=reward · مستوى المكافأة=reward tier · استبدال=redeem · تعديل=adjustment · سجل التدقيق=audit ledger · منطقة الختم=stamper · بطاقة العميل=member pass · انتهاء الصلاحية=expiry.

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| S1 first-run (no published program) | "No loyalty card is live yet. Author one bilingual card in the studio — or stamp the seeded sample member and watch the ledger record it." | "لا بطاقة ولاء مباشرة بعد. أنشئ بطاقة ثنائية اللغة في الاستوديو — أو اختم لعميل العيّنة وشاهد السجل يدوّن ذلك." | Open Card Studio / Stamp the sample member |
| S1 checklist complete | "Your first day on the console: 41 stamps, 5 redemptions, every one attributed. The counter is yours." | "يومك الأول على المنصة: 41 ختماً و5 استبدالات، وكل واحد موثّق باسم صاحبه. المكان لك." | View today's ledger |
| S2 no search results | "No member matches this search. Try the phone number, or enroll them — it takes three fields." | "لا عميل يطابق هذا البحث. جرّب رقم الهاتف، أو سجّله — ثلاثة حقول فقط." | Enroll this person |
| S2 filtered-empty (blocked filter on) | "No blocked members. Nothing is frozen." | "لا عملاء موقوفين. لا شيء مجمّد." | Clear filter |
| S5 members first-run | "No members yet. The counter QR enrolls them — they scan, type three fields, and their pass appears." | "لا عملاء بعد. رمز الماسة يسجّلهم — يمسحون الرمز، يكتبون ثلاثة حقول، وتظهر بطاقتهم." | Show the counter QR |
| S5 filtered-empty | "No members match these filters." | "لا عملاء يطابقون هذه المرشّحات." | Clear filters |
| S5 no-access (wrong workspace) | "This members list belongs to another store's console." | "قائمة العملاء هذه تخصّ منصة متجر آخر." | Switch workspace |
| S4 programs first-run | "No programs yet. One ladder card with two bilingual tiers is a good first card." | "لا برامج بعد. بطاقة سُلّم بمستويين ثنائيي اللغة بدايةٌ جيدة." | Create a program |
| S4 filtered-empty (e.g. drafts only) | "No programs match this filter." | "لا برامج تطابق هذا المرشّح." | Clear filters |
| S6 draft program insights (zero-count) | "This card is still a draft — nothing to count until it's live at the counter." | "هذه البطاقة ما تزال مسودة — لا شيء يُحتسب قبل أن تنتقل إلى الماسة." | Open in studio |
| S7 pass: token failure | "This pass link is no longer valid. Ask at the counter — they re-issue it in seconds without losing your stamps." | "رابط البطاقة هذا لم يعد صالحاً. اسأل عند الماسة — يُعيدون إصداره في ثوانٍ دون فقدان أختامك." | — |
| S9 audit empty (over-filtered) | "No entries match these filters. The day's ledger is never empty." | "لا قيود تطابق هذه المرشّحات. سجل اليوم لا يخلو أبداً." | Clear filters |
| S8 jobs empty | "Nothing running. Member exports appear here while they work." | "لا مهام قيد التنفيذ. تصديرات العملاء تظهر هنا أثناء عملها." | — |

## B. Loading (P02/P12 — skeletons mirror geometry per direction; the stamp dots never shift)

| State | English | Arabic |
|---|---|---|
| S2 search skeleton | 3 result rows + "Resolving members…" (SR) | ثلاثة صفوف هيكلية + "جارٍ إيجاد العملاء…" |
| S2 card sheet open | "Opening نورة العتيبي's card…" | "جارٍ فتح بطاقة نورة العتيبي…" |
| Stamp in flight (optimistic marker) | "Stamping — the dot fills while the ledger writes." | "جارٍ الختم — تملأ الدائرة بينما يدوّن السجل." |
| Redemption confirm → commit | "Recording the redemption…" | "جارٍ تسجيل الاستبدال…" |
| S5 members list | skeleton rows ×8 + "Loading members…" | صفوف هيكلية + "جارٍ تحميل العملاء…" |
| S7 pass first paint | card-face skeleton with dot geometry + "Loading your card…" | هيكل البطاقة بدوائره + "جارٍ تحميل بطاقتك…" |
| Export job (determinate) | "Exporting row 8 of 11." | "تصدير الصف 8 من 11." |
| Insights compute (large stores) | "Counting the month — stamps, redemptions, adjustments." | "جارٍ عدّ الشهر — الأختام والاستبدالات والتعديلات." |
| Autosave (studio, P10) | "Saving…" → "Saved" (fades) | "جارٍ الحفظ…" → "حُفظ" |
| Offline queued stamp | "Queued — this stamp counts the moment you're back online." | "في قائمة الانتظار — يُحتسب هذا الختم لحظة عودة الاتصال." |

## C. Errors (7 classes; every error names the next action; the failing 07b operation named per row)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (daily cap — `issueStamp`) | "This card took its daily stamp already — أمينة stamped it at 08:12. The card's rule is one stamp per day; a correction needs the manager." | "أخذت هذه البطاقة ختمها اليومي بالفعل — ختمتها أمينة في 08:12. قاعدة البطاقة ختمٌ واحد في اليوم؛ والتصحيح يحتاج المدير." |
| VALIDATION (full card — `issueStamp`) | "The card is full — 8 of 8 stamps. Redeem the reward instead; the next card starts with it." | "البطاقة مكتملة — 8 من 8 أختام. استبدل المكافأة بدلاً من الختم؛ البطاقة التالية تبدأ معها." |
| VALIDATION (blank tier locale — `updateProgram`) | "Tier 2 is missing its English name. Both names are required — the card speaks two languages at one counter." | "المستوى الثاني ينقصه الاسم بالإنجليزية. الاسمان مطلوبان — البطاقة تتحدث لغتين على ماسةٍ واحدة." |
| VALIDATION (final-tier rule — `createProgram`) | "The final tier must sit at the card's last stamp — 8 of 8, not 6. Move it or change the card's length." | "يجب أن يقف المستوى الأخير عند آخر ختمٍ في البطاقة — 8 من 8، لا 6. انقله أو غيّر طول البطاقة." |
| VALIDATION (policy bounds — `updateProgram`) | "Expiry must sit between 1 and 24 months — the counter needs a rule it can state out loud." | "يجب أن تقع مدة الصلاحية بين شهر و24 شهراً — تحتاج الماسة قاعدةً يمكن قولها بصوتٍ عالٍ." |
| VALIDATION (malformed phone — `enrollMember`) | "That phone number doesn't resolve — we stripped the spaces and completed the country code, and it still isn't a valid Saudi mobile. Check the digits with the member." | "رقم الهاتف هذا لا يُحلّ — حذفنا الفراغات وأكملنا رمز الدولة وما يزال ليس جوالاً سعودياً صالحاً. تحقّق من الأرقام مع العميل." |
| VALIDATION (adjustment without reason — `adjustStamps`) | "A correction needs its reason — 'counter-error', 'missing-purchase', 'goodwill', or 'fraud-correction'. The ledger records why, not just how much." | "يحتاج التصحيح سببه — «خطأ عند الماسة» أو «شراء لم يُسجّل» أو «بادرة حسن نية» أو «تصحيح تلاعب». يدوّن السجل السبب لا المقدار وحده." |
| VALIDATION (empty export — `exportMembers`) | "There's nothing to export under these filters — zero members match. Widen the filters, or export from the insights view instead." | "لا شيء للتصدير تحت هذه المرشّحات — صفر عملاء مطابقين. وسّع المرشّحات أو صدّر من صفحة الإحصاءات بدلاً من ذلك." |
| NOT_FOUND (expired artifact — `getArtifact`) | "This export expired on 27 Sep. Regenerate it — the member list it came from hasn't changed." | "انتهت صلاحية هذا التصدير في 27 سبتمبر. أعد توليده — قائمة العملاء التي صدر عنها لم تتغيّر." |
| NOT_FOUND (pass token — `getPassView`) | "This pass link is no longer valid — it was re-issued. Ask at the counter; your stamps are safe." | "رابط البطاقة هذا لم يعد صالحاً — أُعيد إصداره. اسأل عند الماسة؛ أختامك في مأمن." |
| NOT_FOUND (stale member/program link — `getMember`/`getProgram`) | "That record is gone from this console. It may have been removed while you were away." | "هذا السجل غاب عن المنصة. ربما أُزيل أثناء غيابك." → العودة إلى القائمة |
| PERMISSION (staff-role gate — `adjustStamps`) | "Staff seats stamp and redeem; corrections need a manager. Ask ماجد — the gate is the record's integrity, not distrust." | "مقاعد الموظفين تختم وتستبدل؛ والتصحيحات تحتاج مديراً. اطلب ماجد — البوابة لسلامة السجل لا لعدم الثقة." |
| PERMISSION (blocked member — `issueStamp`/`redeemReward`) | "This member is blocked — the counter stopped on 28 Sep for photographing other members' passes. A manager can unblock with a reason." | "هذا العميل موقوف — توقّفت الماسة في 28 سبتمبر بسبب تصويره بطاقات عملاء آخرين. يستطيع مديرٌ رفع الإيقاف مع سببٍ مسجّل." |
| PERMISSION (wrong join code — `enrollMember` self channel) | "That join code doesn't match this store. Scan the QR at the counter — it carries the right code." | "رمز الانضمام هذا لا يطابق هذا المتجر. امسح الرمز عند الماسة — يحمل الرمز الصحيح." |
| PERMISSION (capability unconsented — sale-event class at settings) | "Sale-event stamping needs the sale-reporting capability granted to this store. Grant it — or keep stamping at the counter, which always works." | "الختم بحدث البيع يتطلب منح قدرة الإبلاغ عن المبيعات لهذا المتجر. امنحها — أو أبقِ الختم عند الماسة، وهو يعمل دائماً." |
| CONFLICT (concurrent redemption — `redeemReward`) | "Another register just redeemed this tier — at 09:41 by راشد. The card reloaded; the tier shows its redemption date." | "استبدلت ماسةٌ أخرى هذا المستوى للتو — في 09:41 براشد. أُعيد تحميل البطاقة؛ ويعرض المستوى تاريخ استبداله." |
| CONFLICT (stale studio draft — `updateProgram`) | "ماجد edited this draft while you did. Both versions are kept — choose what stays." | "حرّر ماجد هذه المسودة أثناء عملك. الاحتفاظ بالنسختين — اختر ما يبقى." |
| CONFLICT (stale card adjustment — `adjustStamps`) | "The card changed since you opened it — another stamp landed. Both states are kept side by side; re-apply the correction on the fresh one." | "تغيّرت البطاقة منذ فتحتها — هبط ختمٌ آخر. الحالتان محفوظتان جنباً إلى جنب؛ أعد تطبيق التصحيح على الأحدث." |
| RATE_LIMIT (export quota) | "This week's export window is used — 3 of 3. Exports resume 22 Oct; stamps and redemptions are never metered." | "استُهلكت نافذة التصدير لهذا الأسبوع — 3 من 3. تستأنف التصديرات في 22 أكتوبر؛ والأختام والاستبدالات لا تُقاس أبداً." |
| NETWORK (stale list fetch) | "The members list went stale — reconnecting. Nothing at the counter is lost." | "تقادمت قائمة العملاء — تجري إعادة الاتصال. لا شيء عند الماسة ضائع." |
| NETWORK (export segment partial) | "The export delivered 1 of 2 segments — rows 1–6 arrived, 7–11 didn't. Retry just the second segment." | "سلّم التصدير 1 من مقطعين — وصلت الصفوف 1–6 ولم تصل 7–11. أعد محاولة المقطع الثاني وحده." |
| NETWORK (queued stamp re-validation failure) | "One queued stamp didn't survive the reconnection check — the card's day was already full when it replayed. The member's card is correct as shown." | "ختمٌ واحد في قائمة الانتظار لم يصمد أمام فحص إعادة الاتصال — كان يوم البطاقة مكتملاً عند إعادة تشغيله. بطاقة العميل صحيحة كما تُعرض." |
| UNKNOWN | "Something failed on our side (ref lsc-corr-0001). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع lsc-corr-0001). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; the counter's kind of celebration)

| Moment | English | Arabic |
|---|---|---|
| Stamp landed (the signature moment) | "Stamp 4 of 8 — two more to 'كوكيز مجاني'." | "ختم 4 من 8 — بقي ختمان حتى «كوكيز مجاني»." |
| Stamp crossed the final tier | "Stamp 8 of 8 — 'قهوة على حسابنا' is waiting at the register." | "ختم 8 من 8 — «قهوة على حسابنا» بانتظارك عند الماسة." |
| Tier redeemable (on resolve) | "A reward is ready: 'free cookie' — redeem it at the register." | "مكافأة جاهزة: «كوكيز مجاني» — استبدلها عند الماسة." |
| Redemption recorded (receipt line) | "Redeemed 'free cookie' for سلطان الدوسري — recorded by أمينة at 09:14. The card marches on: 4 of 8." | "استُبدلت «كوكيز مجاني» لسلطان الدوسري — سجّلتها أمينة في 09:14. وتواصل البطاقة: 4 من 8." |
| Final-tier redemption (reset) | "Redeemed 'any coffee on the house' — a new card begins at 0 of 8. Thank نورة for ten visits." | "استُبدلت «قهوة على حسابنا» — بطاقة جديدة تبدأ من 0 من 8. اشكر نورة على زياراتها العشر." |
| Undo performed | "Stamp removed — 3 of 8. The undo is in the ledger with your name." | "أُلغي الختم — 3 من 8. التراجع في السجل باسمك." |
| Adjustment recorded | "Adjusted +2 for لطيفة الشمري — reason: 'counter-error'. The correction is part of the record now." | "عُدّلت +2 للطيفة الشمري — السبب: «خطأ عند الماسة». التصحيح الآن جزءٌ من السجل." |
| Program published | "The Coffee Card is live — 41 members carry it on their next visit." | "بطاقة القهوة مباشرة الآن — 41 عميلاً سيحملونها في زيارتهم القادمة." |
| Program archived | "The Bakery Card is archived — its 6 live cards finish their cycle; nothing is deleted." | "أُرشفت بطاقة المخبز — بطاقاتها الست النشطة تُكمل دورتها؛ لا شيء يُحذف." |
| Member enrolled | "محمد الأنصاري is a member — his pass is on his phone and at the counter." | "محمد الأنصاري عميلٌ الآن — بطاقته على هاتفه وعند الماسة." |
| Duplicate caught | "This phone is already a member — نورة العتيبي, 3 of 8 stamps. No second card was created." | "هذا الهاتف مسجّل لعميلةٍ بالفعل — نورة العتيبي، 3 من 8 أختام. لم تُنشأ بطاقة ثانية." |
| Card renewed (expired → new) | "The old card had expired — a fresh one began with this stamp. Its unredeemed tiers stayed with the old card." | "كانت البطاقة القديمة منتهية — بدأت بطاقة جديدة بهذا الختم. مستوياتها غير المستبدلة بقيت مع القديمة." |
| Pass token rotated | "The old pass link died; the new one is on screen. Her stamps didn't move." | "مات رابط البطاقة القديم؛ والجديد على الشاشة. أختامها لم تتحرك." |
| Export ready | "Export ready — 11 members, expires in 7 days." | "التصدير جاهز — 11 عميلاً، تنتهي صلاحيته بعد 7 أيام." |
| Undo window (P03) | "Stamped — Undo (7s)" | "خُتم — تراجع (7 ثوانٍ)" |

## E. Signature moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| The one-away state (card sheet) | "One stamp from 'قهوة على حسابنا' — she'll be back tomorrow." | "ختمٌ واحد يفصلها عن «قهوة على حسابنا» — ستعود غداً." |
| Expiring-soon badge | "This card expires 14 Nov — a visit before then keeps it alive." | "تنتهي هذه البطاقة في 14 نوفمبر — زيارةٌ قبل ذلك تبقيها حيّة." |
| Expired card (honest consequence) | "This card expired on 14 Aug with 5 stamps — its tiers died with it. Her next stamp starts a fresh one." | "انتهت هذه البطاقة في 14 أغسطس بخمسة أختام — ماتت مستوياتها معها. ختمها التالي يبدأ بطاقةً جديدة." |
| Blocked member (counter view) | "Blocked — 28 Sep, for photographing other members' passes. The record stays; only the counter stopped." | "موقوف — 28 سبتمبر، لتصويره بطاقات عملاء آخرين. يبقى السجل؛ وتوقّفت الماسة فقط." |
| Flag board (deterministic, named) | "راشد made 3 adjustments in 24 hours — goodwill, counter-error, fraud-correction. The threshold is 3; the ledger is one click away." | "أجرى راشد 3 تعديلات خلال 24 ساعة — حسن نية، خطأ ماسة، وتصحيح تلاعب. الحدّ 3؛ والسجل على بُعد نقرة." |
| Cap-blocked attempt (ledger detail) | "Blocked a second stamp for خالد السبيعي — the card took its daily stamp from أمينة at 08:12. Recorded, not refused silently." | "حُظر ختمٌ ثانٍ لخالد السبيعي — أخذت بطاقته ختمها اليومي من أمينة في 08:12. موثّق، لا مرفوض بصمت." |
| Insights completion line | "1 of 7 active cards reached its final reward this month — 0.14, floored, never rounded up." | "وصلت بطاقةٌ واحدة من 7 نشطة إلى مكافأتها الأخيرة هذا الشهر — 0.14، مقصودة لأسفل، ولا تُقرَّب أبداً." |
| Bilingual tier rendering (studio preview) | "The card speaks both: 'كوكيز مجاني' at 4, 'free cookie' at 4 — one counter, two languages, no translation gap." | "البطاقة تنطق بالاثنتين: «كوكيز مجاني» عند 4، و'free cookie' عند 4 — ماسةٌ واحدة، لغتان، ولا فجوة ترجمة." |
| Staff-verification statement (settings/pass footer) | "Only this store's staff can stamp this card. Every stamp carries a name." | "موظفو هذا المتجر وحدهم يختمون هذه البطاقة. كل ختمٍ يحمل اسماً." |
| Non-AI plainness (settings) | "Every rule here is arithmetic over the ledger — no models, no scoring, no magic. The same state always answers the same way." | "كل قاعدةٍ هنا حسابٌ فوق السجل — لا نماذج ولا تقييماً ولا سحراً. الحالة ذاتها تجيب الإجابة ذاتها دائماً." |
| Retention statement (pass footer) | "This store keeps your membership record for 12 months — stamps only, no purchase history, no marketing lists." | "يحتفظ هذا المتجر بسجلّ عضويتك 12 شهراً — أختامٌ فقط، بلا تاريخ مشتريات ولا قوائم تسويق." |
| Sample-member note | "Sample member — seeded for your first stamp. Clear it when the counter goes live." | "عميل عيّنة — مُضاف لتجربة ختمك الأول. امسحه حين تنطلق الماسة." |

## F. Bidi/mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Short code in RTL chrome | "Pass code K7M2QA — Latin characters render left-to-right inside the Arabic console, isolated, never re-ordered." | "رمز البطاقة K7M2QA — الحروف اللاتينية تُعرض من اليسار إلى اليمين داخل المنصة العربية، معزولة ولا يُعاد ترتيبها أبداً." |
| En-locale member in Arabic ledger | "Sultan Al-Dosari renders left-to-right inside the Arabic members table — isolated, never force-flipped." | "يُعرض Sultan Al-Dosari من اليسار إلى اليمين داخل جدول العملاء العربي — معزولاً ولا يُقلب قسراً." |
| Arabic tier name in the English pass face | "'كوكيز مجاني' renders right-to-left inside the English card face — the two scripts share one card, each at its own direction." | "تُعرض 'free cookie' من اليسار داخل وجه البطاقة العربية — تتشارك اللغتان بطاقةً واحدة، وكلٌّ منهما باتجاهها." |
| Numeral discipline | "Counts stay Western in both locales — '6 من 8' and '6 of 8', never mixed systems mid-sentence." | "تبقى الأرقام غربية في اللغتين — «6 من 8» و'6 of 8'، ولا تُخلط الأنظمة داخل الجملة أبداً." |
| Artifact id in a toast | "Export lsc-art-0002 — the identifier renders isolated so the digits never migrate." | "التصدير lsc-art-0002 — يُعرض المعرّف معزولاً حتى لا تهاجر أرقامه." |
| Receipt line for an en-locale member | "The receipt speaks the member's locale first: 'any coffee on the house' — recorded by أمينة, whose name renders right-to-left inside the Latin line." | "يتحدث سند الاستبدال بلغة العميل أولاً: «قهوة على حسابنا» — سجّلتها أمينة، واسمها يُعرض من اليمين داخل السطر اللاتيني." |
