# 11 — Empty / Loading / Error: interactive-story-builder (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN + AR (Arabic script, فصحى بيضاء, unvocalized). Voice: editor-calm (02). Arabic prose renders Arabic-Indic numerals per the AR-indic-optional policy; data-like fields stay Western (rtl-rules §3). Every empty has one action (P01); every error follows [what]+[why]+[next] (copy-voice §1.4).

## A. Empty states

| Surface & state | English | Arabic | Action |
|---|---|---|---|
| S1 first-run | "Your desk is empty — every story starts as one chapter and one step. Begin blank, or start from an arc template." | "مكتبك خالٍ — كل قصة تبدأ بفصلٍ واحد وخطوةٍ واحدة. ابدأ من فراغ، أو من قالب مسار." | New story / قصة جديدة |
| S1 filtered-empty | "No stories match these filters." | "لا قصص تطابق هذه المرشّحات." | Clear filters / إزالة المرشّحات |
| S1 no-access | "These stories belong to another workspace." | "هذه القصص تخصّ مساحة عمل أخرى." | Switch workspace / تبديل مساحة العمل |
| S1 no-data-after-activity | "Archived stories are out of this view and stay yours." | "القصص المؤرشفة خارج هذا العرض وتبقى لك." | View archive / عرض الأرشيف |
| S2 templates filtered-empty | "No templates for this audience yet. A blank start works the same." | "لا قوالب لهذا الجمهور بعد. البدء من فراغ يعمل بالقدر نفسه." | Start blank / البدء من فراغ |
| S3 empty chapter | "This chapter holds no steps yet. Its first step carries the scene." | "لا يحمل هذا الفصل خطوات بعد. خطوته الأولى تحمل المشهد." | Add step / إضافة خطوة |
| S5 sync empty | "No steps to align yet — steps appear here the moment a chapter has them." | "لا خطوات للمزامنة بعد — تظهر الخطوات هنا فور وجودها في فصل." | Go to outline / الانتقال إلى المخطط |
| S8 review notes empty | "No notes on this story. Reviewers pin notes to steps." | "لا ملاحظات على هذه القصة. يثبّت المراجعون ملاحظاتهم على الخطوات." | — |
| S9 jobs empty | "Nothing running. Suggestions and exports appear here while they work." | "لا مهام قيد التنفيذ. الاقتراحات والتصديرات تظهر هنا أثناء عملها." | — |

## B. Loading states (skeletons mirror geometry per direction, P02)

| State | English | Arabic |
|---|---|---|
| S1 library | skeleton rows ×8 + "Loading your stories…" | صفوف هيكلية ×٨ + "جارٍ تحميل قصصك…" |
| S3 outline boot | shell → rail → board; SR: "Opening «{title}»" | الهيكل ثم الشريط ثم اللوحة؛ "فتح «{عنوان}»" |
| Step autosave chip | "Saving…" → "Saved" (fades) | "جارٍ الحفظ…" → "حُفظ" |
| S5 sync derivation | "Comparing both editions…" | "مقارنة النسختين…" |
| S6 media load | poster + reserved aspect-ratio box, alt text visible | ملصق وإطار محجوز، والنص البديل ظاهر |
| Suggestion run | "Drafting an outline — chapters appear as they're proposed." | "تحرير مخطط — تظهر الفصول مع اقتراحها." |
| Suggestion stalled (>8s) | "The outline is taking longer than usual. Keep waiting, or stop and retry." | "يستغرق المخطط وقتاً أطول من المعتاد. الانتظار، أو الإيقاف وإعادة المحاولة." |
| QA / export | "Checking the story…" / "Rendering chapter {n} of {total}" | "جارٍ فحص القصة…" / "توليد الفصل {n} من {total}" |

## C. Error states (7 classes; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (title) | "The story needs a title in at least one language." | "تحتاج القصة عنواناً بلغةٍ واحدة على الأقل." |
| VALIDATION (export scope) | "Export blocked — {n} media items are missing alt text in English. Add it, or narrow the export to Arabic." | "التصدير محجوب — {n} وسائط بلا نصٍّ بديل بالإنجليزية. أضِفه، أو اقتصر التصدير على العربية." |
| VALIDATION (reorder) | "The new order must list every step." | "يجب أن يذكر الترتيب الجديد كل الخطوات." |
| NOT_FOUND (stale story/artifact) | "This story is gone from the workspace — it may have been deleted." | "غابت هذه القصة عن مساحة العمل — ربما حُذفت." → العودة إلى المكتبة |
| PERMISSION (reviewer edit) | "Your reviewer seat comments and approves; editing stays with editors." | "مقعد المراجعة يعلّق ويوافق؛ التحرير يبقى للمحررين." → إضافة ملاحظة |
| CONFLICT (concurrent step edit) | "Someone changed this step while you did. Both versions are kept — choose what stays." | "غيّر أحدهم هذه الخطوة أثناء عملك. النسختان محفوظتان — اختر ما يبقى." |
| RATE_LIMIT (suggestion window) | "This month's suggestion window is used. Templates and all editing keep working — suggestions resume {date}." | "استُهلكت نافذة الاقتراحات لهذا الشهر. القوالب والتحرير يعملان — تستأنف الاقتراحات في {تاريخ}." |
| NETWORK (transport) | "The workspace went stale — reconnecting. Every saved step is safe." | "تقادمت مساحة العمل — تجري إعادة الاتصال. كل خطوة محفوظة آمنة." |
| NETWORK (offline, P20) | "You're offline. Step edits queue locally and sync when you're back." | "أنت غير متصل. تعديلات الخطوات تُصفّ محلياً وتُزامن عند عودة الاتصال." |
| UNKNOWN | "Something failed on our side (ref {id}). Retry; quote the reference if it repeats." | "حدث خلل لدينا (مرجع {id}). أعد المحاولة؛ واذكر المرجع إن تكرر." |

## D. Success & status (calm; no confetti — motion-language §2)

| Moment | English | Arabic |
|---|---|---|
| Story created | "Story created — one chapter, one step. Build from here." | "أُنشئت القصة — فصلٌ واحد وخطوةٌ واحدة. ابنِ من هنا." |
| Story duplicated | "Copy created with the structure and media. Both editions' text starts empty." | "أُنشئت نسخة بالهيكل والوسائط. نصّ النسختين يبدأ فارغاً." |
| Step added | "Step {n} added." | "أُضيفت الخطوة {n}." |
| Reorder undo window (P03) | "Step moved — Undo (5s)" | "نُقلت الخطوة — تراجع (٥ ثوانٍ)" |
| Chapter approved | "Approved at revision {n} — later edits will ask for review again." | "اعتُمدت في الإصدار {n} — التعديلات اللاحقة ستطلب المراجعة مجدداً." |
| Export ready | "Story bundle ready — both languages, expires in 7 days." | "حزمة القصة جاهزة — اللغتان معاً، تنتهي بعد ٧ أيام." |
| Artifact renewed | "Artifact renewed — new expiry in 7 days." | "جُدّد المُخرَج — صلاحية جديدة بعد ٧ أيام." |
| Partial export delivered | "4 of 5 chapters rendered — chapter 3 failed. Retry just that chapter." | "وُلّدت ٤ من ٥ فصول — فشل الفصل ٣. أعد محاولة ذلك الفصل وحده." |

## E. Guardrail & signature moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| Sync cleared (the win state) | "Chapter in sync — both editions carry all {n} steps." | "الفصل متزامن — تحمل النسختان كل الخطوات ({n})." |
| Missing-locale prompt | "This step has no English text yet. Write it, or mark the chapter Arabic-only for now." | "لا نصّ إنجليزياً لهذه الخطوة بعد. اكتبه، أو اجعل الفصل عربياً فقط مؤقتاً." |
| Length divergence | "This step runs {n}× longer in Arabic than English. Reviewed, or worth a trim?" | "تسير هذه الخطوة أطول بـ{n} أضعاف في العربية عن الإنجليزية. مراجَعة، أم جديرة بالاختصار؟" |
| Mark reviewed | "Marked reviewed — parity is now an editorial decision, on the record." | "وُسمت مراجَعة — التكافؤ الآن قرار تحريري، مسجّل." |
| Layout override prompt | "Override the media side for one edition? Say why — QA lists it." | "تجاوز جهة الوسيط لنسخةٍ واحدة؟ اذكر السبب — يسرده فحص الجودة." |
| Delete step (P04 level 2) | "Delete step {n}? Its Arabic and English text go with it." | "حذف الخطوة {n}؟ نصّها العربي والإنجليزي يذهب معها." |
| Delete story (P04 level 3, type-to-confirm) | "Type the story title to delete it, its {n} chapters, and every step." | "اكتب عنوان القصة لحذفها مع فصولها ({n}) وكل خطوة." |
| Suggestion degradation (rung 3) | "The suggestion capability is off. Your outline comes from the {template} template — labeled, non-generative." | "قدرة الاقتراح متوقفة. مخططك من قالب {القالب} — موسوم، غير توليدي." |
| Suggestion partial kept | "The outline stopped part-way — kept and marked partial. Continue or discard." | "توقّف المخطط في منتصفه — حُفظ ووُسم بالجزئية. المتابعة أو الإهدار." |
| Quota 80% (P14) | "Near the suggestion limit — {n} of {total} used this window." | "اقتربت من حد الاقتراحات — استُهلكت {n} من {total} في هذه النافذة." |
| Media unreachable | "Media unreachable at that address — the step stays; preview shows its alt text." | "الوسيط بعيد المنال على ذلك العنوان — تبقى الخطوة؛ تعرض المعاينة نصّها البديل." |
| Direction toggle announce | "Previewing in Arabic, right-to-left." / "Previewing in English, left-to-right." | "المعاينة بالعربية، من اليمين إلى اليسار." / "المعاينة بالإنجليزية، من اليسار إلى اليمين." |
| QA clean | "Checks pass — alt text, parity, and direction all accounted for." | "اجتازت الفحوص — النص البديل والتكافؤ والاتجاه، كلها محسوبة." |
