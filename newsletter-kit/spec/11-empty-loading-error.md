# 11 — Empty / Loading / Error: newsletter-kit (Copy Matrix)

SME-J pass · Every string is WRITTEN (not templated), voice = desk-editor practical (02). Full bilingual matrix. Arabic is فصحى بيضاء; Western digits everywhere (ledger numeral policy — never mixed mid-sentence). Every empty has one action (P01); every error follows [what]+[why]+[next] (copy-voice §1.4).

## A. Empty states

| Surface & state | English | Arabic | Action |
|---|---|---|---|
| S1 issues, first-run | "Your desk is ready. Open the sample issue and clear its two QA fails — that's the whole job in three minutes." | "مكتبك جاهز. افتح العدد النموذجي وأصلح الفحصين الفاشلين فيه — هذه هي المهمة كلها في ثلاث دقائق." | Open sample issue / افتح العدد النموذجي |
| S1 issues, filtered-empty | "No issues match these filters." | "لا أعداد تطابق هذه المرشّحات." | Clear filters / إزالة المرشّحات |
| S1 issues, no-access | "These issues belong to another workspace." | "هذه الأعداد تخصّ مساحة عمل أخرى." | Switch workspace / تبديل مساحة العمل |
| S2 subject variants, locale empty | "No subject variants in this locale yet — add the first, or draft some with assist." | "لا نسخ موضوع في هذه اللغة بعد — أضف الأولى، أو اصنع بعضها بالمساعدة." | Add variant / إضافة نسخة |
| S3 QA results, before first run | "No QA run yet — the checklist runs in seconds." | "لا تشغيل فحص بعد — تعمل القائمة في ثوانٍ." | Run QA / تشغيل الفحص |
| S4 lists, first-run | "Your first list starts with a paste — a CSV of emails and language preferences is enough." | "قائمتك الأولى تبدأ بلصق — ملف CSV بالبريد وتفضيلات اللغة يكفي." | Create list / إنشاء قائمة |
| S4 lists, filtered-empty | "No lists match this search." | "لا قوائم تطابق هذا البحث." | Clear search / إزالة البحث |
| S4 subscribers, no-data-after-activity | "Every subscriber in this view was removed. Removals are final and logged." | "أُزيل كل مشترك في هذا العرض. الإزالة نهائية ومسجَّلة." | Clear filters / إزالة المرشّحات |
| S4 subscribers, filtered-empty | "No subscribers match these filters." | "لا مشتركين يطابقون هذه المرشّحات." | Clear filters / إزالة المرشّحات |
| S5 channels, none bound (normal mode, not an error) | "No delivery channel is bound. Export works today — bind a channel whenever you want scheduling." | "لا قناة إرسال مرتبطة. التصدير يعمل اليوم — اربط قناة متى أردت الجدولة." | Bind channel · Export instead / اربط قناة · التصدير بدلاً منها |
| S5 jobs, first-run | "Nothing running or finished yet. Imports, QA runs, exports, and sends appear here while they work." | "لا شيء قيد التنفيذ أو منتهٍ بعد. الاستيرادات والفحوص والتصديرات والإرسالات تظهر هنا أثناء عملها." | — |

## B. Loading states (P02/P12; skeletons mirror geometry, RTL-skeletons flip)

| Surface & state | English | Arabic |
|---|---|---|
| S1 list skeleton | (skeleton rows ×8) + SR: "Loading your issues…" | (صفوف هيكلية ×8) + "جارٍ تحميل أعدادك…" |
| S2 composer boot | two-column skeletons + SR: "Opening «{title}»" | هيكلية عمودين + "فتح «{العنوان}»" |
| S3 QA run | "Checking the Arabic edition — 4 of 10 checks." | "فحص النسخة العربية — 4 من 10 فحوص." |
| S3 preview switch | "Rendering at 320px…" | "عرض المعاينة عند 320 بكسل…" |
| S2 assist start | "Drafting 3 variants — the first arrives in a moment." | "صياغة 3 نسخ — تصل الأولى بعد لحظة." |
| S2 assist stalled (>8s) | "The drafts are taking longer than usual. Keep waiting, or stop and retry." | "تستغرق المسودات وقتاً أطول من المعتاد. انتظر، أو أوقف وأعد المحاولة." |
| S4 import | "Reviewing row 34 of 120." | "مراجعة الصف 34 من 120." |
| S5 channel verify | "Verifying the delivery credential…" | "جارٍ التحقق من اعتماد الإرسال…" |
| S5 send queued | "Queued for 09:00 — the list snapshot is taken." | "في الانتظار حتى 09:00 — أُخذت لقطة القائمة." |
| S5 send running | "Sending the Arabic edition — 1,240 of 3,000." | "إرسال النسخة العربية — 1,240 من 3,000." |
| S5 export | "Rendering 2 editions and 1 CSV segment…" | "توليد نسختين ومقطع CSV واحد…" |

## C. Error states (typed taxonomy → copy; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (QA fails block schedule) | "Scheduling is blocked — the Arabic edition still has 2 fails. Open the checklist to fix them." | "الجدولة محجوبة — ما زالت النسخة العربية فيها فشلان. افتح قائمة الفحص لإصلاحهما." |
| VALIDATION (subject over budget) | "This subject runs 52 characters — the mobile budget is 43. Shorten it, or keep it for desktop readers." | "هذا الموضوع بطول 52 حرفاً — ميزانية الهاتف 43. اختصره، أو أبقِه لقارئي الحاسوب." |
| VALIDATION (unconsented rows) | "8 subscribers in this list have no consent record. Resolve them in the list view before scheduling." | "8 مشتركين في هذه القائمة بلا سجل موافقة. عالجهم في عرض القائمة قبل الجدولة." |
| VALIDATION (channel unverified) | "The delivery credential isn't verified. Verify it first — or export and send your way." | "اعتماد الإرسال غير موثّق. وثّقه أولاً — أو صدّر وأرسل بطريقتك." |
| VALIDATION (sent issue locked) | "This issue was sent on 12 Oct — its content is locked. Duplicate it to keep writing." | "أُرسل هذا العدد في 12 أكتوبر — محتواه مقفل. استنسخه لمواصلة الكتابة." |
| VALIDATION (import mapping) | "Column 2 is mapped to email, but row 5 isn't an address. Remap it, or skip that row." | "العمود 2 مُعيَّن للبريد، لكن الصف 5 ليس بريداً. أعد تعيينه، أو تخطَّ ذلك الصف." |
| NOT_FOUND (stale link) | "That issue or list is gone from this workspace. It may have been sent and locked, or removed." | "غاب ذلك العدد أو تلك القائمة عن مساحة العمل. ربما أُرسل وقُفل، أو أُزيل." |
| PERMISSION (seat rights) | "Your seat can view this issue — editing belongs to the workspace owner." | "مقعدك يعرض هذا العدد — التحرير من حق مالك مساحة العمل." |
| CONFLICT (concurrent edit) | "Basim edited this issue while you did. Both revisions are kept side by side — choose what stays." | "حرّر باسم هذا العدد أثناء عملك. النسختان محفوظتان جنباً إلى جنب — اختر ما يبقى." |
| CONFLICT (double-schedule) | "This issue already has a send queued to that list for 09:00. Cancel it, or schedule another list." | "لهذا العدد إرسال منتظر إلى تلك القائمة عند 09:00. ألغه، أو جدوِل قائمة أخرى." |
| RATE_LIMIT (assist quota) | "This window's 40 drafts are used. The manual editor keeps working — assist returns on 1 Nov." | "استُهلكت مسودات الـ40 لهذه النافذة. المحرّر اليدوي يعمل — تعود المساعدة في 1 نوفمبر." |
| NETWORK (send drop) | "The channel dropped at 40% of the English edition. The Arabic edition finished — retry sends only the rest." | "انقطعت القناة عند 40% من النسخة الإنجليزية. اكتملت النسخة العربية — إعادة المحاولة ترسل الباقي فقط." |
| NETWORK (assist stream drop) | "The assist stream dropped after 2 of 3 drafts. Both are kept and marked partial — retry continues, or discard them." | "انقطعت مساعدة الصياغة بعد 2 من 3 مسودات. كلتاهما محفوظتان وموسومتان بالجزئية — تستكمل إعادة المحاولة، أو اهدرهما." |
| NETWORK (offline, P20) | "You're offline. Composing continues — edits queue locally and sync when you're back." | "أنت غير متصل. يتابع التحرير — تُصفّ التعديلات محلياً وتتزامن عند عودتك." |
| UNKNOWN | "Something failed on our side (ref nk-corr-0041). Retry — quote the reference if it repeats." | "حدث خلل لدينا (مرجع nk-corr-0041). أعد المحاولة — واذكر المرجع إن تكرر." |

## D. Success & status (calm; no confetti — motion-language §2)

| Moment | English | Arabic |
|---|---|---|
| Autosave (P10 cycle) | "Saving…" → "Saved" (fades) | "جارٍ الحفظ…" → "حُفظ" |
| Variant undo (P03) | "Variant deleted — Undo (7s)" | "حُذفت النسخة — تراجع (7 ثوانٍ)" |
| QA complete | "QA complete — 8 passes, 1 warn, 1 fail in the Arabic edition." | "اكتمل الفحص — 8 فحوص ناجحة وتحذير وفشل واحد في النسخة العربية." |
| QA clear (gate opens) | "Both editions clear the checklist — scheduling is open." | "النسختان تجتازان القائمة — الجدولة متاحة." |
| Import done | "Imported 202, skipped 8 — the list holds 210 subscribers." | "استُورد 202، واستُبعد 8 — تضم القائمة 210 مشتركين." |
| Channel verified | "The delivery credential is verified — scheduling is open." | "وثُّق اعتماد الإرسال — الجدولة متاحة." |
| Send scheduled | "Scheduled for 09:00 — 4,860 subscribers, preference policy, snapshot taken." | "مُجدوَل عند 09:00 — 4,860 مشتركاً، سياسة التفضيل، وأُخذت اللقطة." |
| Send complete | "Sent — Arabic 3,013, English 1,847. Both editions archived as artifacts." | "تم الإرسال — العربية 3,013 والإنجليزية 1,847. النسختان مؤرشفتان كملفين." |
| Export ready | "Export ready — 2 editions and 1 CSV segment, expires in 7 days." | "التصدير جاهز — نسختان ومقطع CSV واحد، تنتهي صلاحيته بعد 7 أيام." |

## E. Assist degradation ladder (ai-native-patterns §5; surfaces per 08 map)

| Rung | English | Arabic |
|---|---|---|
| 2 reduced | "Assist drafts 2 instead of 3 this window — the usage limit is near." | "تصوغ المساعدة 2 بدلاً من 3 في هذه النافذة — اقترب حدّ الاستخدام." |
| 4 unavailable | "Assist is off right now. The variant editor works exactly as before — write, count, and mark a primary." | "المساعدة متوقفة الآن. محرّر النسخ يعمل كما هو — اكتب واحسب وحدّد الأساسية." |

## F. Bilingual & QA guardrail moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| Bidi guard (C02 input-time) | "A Latin name sits inside this Arabic subject — it's isolated so it can't scatter the line." | "اسم لاتيني داخل هذا الموضوع العربي — أُحيط بعزلٍ كي لا يبعثر السطر." |
| Numeral guard (C05) | "These Arabic-Indic digits (٣ من 12) mix systems — normalize to 3 of 12, or keep them as voice?" | "هذه الأرقام الهندية (٣ من 12) تخلط النظامين — تطبيعها إلى 3 من 12، أم إبقاؤها نبرةً؟" |
| Italic guard (C07 fix) | "Italics break Arabic letterforms in some clients — this quote switched to regular weight with a side rule." | "المائل يكسر أشكال الحروف العربية في بعض عملاء البريد — تحوّل هذا الاقتباس إلى وزن عادي مع فاصل جانبي." |
| Send-anyway note (warns only) | "Recorded: sending with 1 warn — the Arabic preheader is missing. The note rides with the send job." | "مُسجَّل: الإرسال مع تحذير واحد — سطر المعاينة العربي غائب. ترافق الملاحظة مهمة الإرسال." |
| Manual mode (no channel) | "No channel, no problem — this export is the send." | "بلا قناة ولا مشكلة — هذا التصدير هو الإرسال." |
| Locale-missing pair chip | "This block has no Arabic twin yet — it will send English to everyone." | "لا نظير عربي لهذه الكتلة بعد — ستُرسل الإنجليزية للجميع." |
| Bulk removal confirm (P04 L3) | "Remove 12 subscribers from «Community Weekly»? Removal is final and logged. Type the list name to confirm." | "إزالة 12 مشتركاً من «نشرة المجتمع»؟ الإزالة نهائية ومسجَّلة. اكتب اسم القائمة للتأكيد." |
