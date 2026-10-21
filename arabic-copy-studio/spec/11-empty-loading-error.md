# 11 — Empty / Loading / Error: arabic-copy-studio (Copy Matrix)

SME-J pass · Every string is WRITTEN (not templated), voice = craftsman-calm (02). Full bilingual matrix (Tier 1 obligation). Arabic strings are فصحى بيضاء. Every empty has one action (P01); every error follows the formula [what]+[why]+[next] (copy-voice §1.4).

## A. Empty states (four empties per P01)

| Surface & state | English | Arabic | Action |
|---|---|---|---|
| S1 first-run (no docs, no brand kit) | "Your studio is ready. Start with one brief — or set up your brand kit first." | "الاستوديو جاهز. ابدأ بموجزٍ واحد — أو أعدّ حزمة علامتك أولاً." | New document / Set up brand kit |
| S1 no-data-after-activity | "No documents match the archive filter. Documents you archived appear only there." | "لا مستندات تطابق فلتر الأرشفة. المستندات المؤرشفة تظهر هناك فقط." | Clear filter |
| S1 no-access (shared revoked) | "These documents aren't available to your seat. Ask the workspace owner to restore access." | "هذه المستندات غير متاحة لمقعدك. اطلب من مالك مساحة العمل استعادة الوصول." | Request access |
| S1 filtered-empty | "No documents match these filters." | "لا مستندات تطابق هذه المرشّحات." | Clear filters |
| S6 glossary first-run | "A glossary turns your must-use terms into enforced rules. Add your first five." | "المعجم يجعل مصطلحاتك اللازمة قواعد مفروضة. أضف مصطلحاتك الخمسة الأولى." | Add term |
| S6 conflict-empty (no conflicts) | "No term conflicts. Contradictions appear here the moment two definitions disagree." | "لا تعارضات بين المصطلحات. التعارضات تظهر هنا فور اختلاف تعريفين." | — |
| S7 brand kit empty | "Without a brand kit, suggestions stay generic and are marked as unbranded." | "من دون حزمة علامة، تبقى الاقتراحات عامة وتُوسم بأنها غير مُوجَّهة للعلامة." | Add voice traits |
| S11 templates empty (no saved briefs) | "No saved briefs yet. Turn a good brief into a reusable template after your next draft." | "لا موجزات محفوظة بعد. حوّل موجزاً ناجحاً إلى قالبٍ قابل لإعادة الاستخدام بعد مسودتك القادمة." | Browse starter templates |
| S13 jobs empty | "Nothing running. Exports, transforms, and imports appear here while they work." | "لا مهام قيد التنفيذ. التصديرات والتحويلات والاستيرادات تظهر هنا أثناء عملها." | — |

## B. Loading states (P02/P12; skeletons mirror geometry, RTL-mirrored)

| Surface & state | English | Arabic |
|---|---|---|
| S1 list skeleton | (skeleton rows ×8) + "Loading your documents…" (SR) | (صفوف هيكلية) + "جارٍ تحميل مستنداتك…" |
| S3 editor boot (staged) | shell → blocks → highlights; SR: "Opening «{title}»" | الهيكل ثم الكتل ثم الإبرازات؛ "فتح «{عنوان}»" |
| S4 generation starting | "Preparing the draft — the page reserves its place before the first line." | "تحضير المسودة — تحجز الصفحة مكانها قبل السطر الأول." |
| S4 streaming | (live word counter only; no toast) | (عدّاد كلمات مباشر فقط) |
| S4 stalled (>8s) | "The draft is taking longer than usual. You can keep waiting or stop and retry." | "تستغرق المسودة وقتاً أطول من المعتاد. يمكنك الانتظار أو الإيقاف وإعادة المحاولة." |
| S5 transform progress | "Transforming block {n} of {total}" | "تحويل الكتلة {n} من {total}" |
| S13 job row | determinate: "{done} of {total}"; indeterminate: "Working — no estimate yet" | "{done} من {total}" ؛ "قيد العمل — لا تقدير بعد" |

## C. Error states (typed taxonomy → copy; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (brief) | "The brief needs at least one key point. Add what the copy must say." (field-linked) | "يحتاج الموجز إلى نقطة أساسية واحدة على الأقل. أضف ما يجب أن تقوله الصياغة." |
| NOT_FOUND (doc opened from stale link) | "This document no longer exists in this workspace. It may have been archived or deleted." → Back to documents | "لم يعد هذا المستند موجوداً في مساحة العمل. ربما أُرشف أو حُذف." → العودة إلى المستندات |
| PERMISSION | "Your seat doesn't have edit access to this document. You can request it or continue in review mode." | "مقعدك لا يملك صلاحية التحرير لهذا المستند. يمكنك طلبها أو المتابعة في وضع المراجعة." |
| CONFLICT (concurrent edit) | "Reem changed this passage while you were editing. Both versions are kept side by side — choose what stays." | "عدّلتريم هذه الفقرة أثناء تحريرك. النسختان محفوظتان جنباً إلى جنب — اختر ما يبقى." |
| RATE_LIMIT (quota) | "You've used this month's generation window. Drafting, editing and export keep working — generation resumes {date}." | "استُهلكت نافذة الصياغة لهذا الشهر. التحرير والتصدير يعملان — تستأنف الصياغة في {تاريخ}." |
| RATE_LIMIT (rung 2 notice) | "Running near the window limit — suggestions will shorten until {date}." | "اقترب الحد من نافذة الاستخدام — ستُختصر الاقتراحات حتى {تاريخ}." |
| NETWORK (stream drop) | "The connection dropped mid-draft. What arrived is kept and marked partial — retry continues from where it stopped." | "انقطع الاتصال أثناء الصياغة. ما وصل محفوظ وموسوم بالجزئية — تستكمل إعادة المحاولة من حيث توقفت." |
| NETWORK (offline, P20) | "You're offline. Edits queue locally and sync when you're back." | "أنت غير متصل. تُصفّ التعديلات محلياً وتُزامن عند عودة الاتصال." |
| UNKNOWN | "Something failed on our side (ref {correlationId}). Retry — if it repeats, quote this reference." | "حدث خلل لدينا (مرجع {correlationId}). أعد المحاولة — وإن تكرر، اذكر هذا المرجع." |

## D. Success & status (calm; no confetti — motion-language §2)

| Moment | English | Arabic |
|---|---|---|
| First approved document | "Approved. This version is now the record — further edits will ask for re-approval." | "تمت الموافقة. هذا الإصدار الآن السجل — التعديلات اللاحقة ستطلب موافقة جديدة." |
| Transform committed | "Paired version saved. The two documents now travel together." | "حُفظ الإصدار المقابل. المستندان يسيران معاً الآن." |
| Undo window (P03) | "Revision created — Undo (7s)" | "أُنشئ إصدار — تراجع (٧ ثوانٍ)" |
| Autosave (P10 cycle) | "Saving…" → "Saved" (fades) | "جارٍ الحفظ…" → "حُفظ" |
| Export ready | "Export ready — expires in 7 days." | "التصدير جاهز — تنتهي صلاحيته بعد ٧ أيام." |

## E. AI degradation ladder copy (ai-native-patterns §5; surfaces per 08 map)

| Rung | English | Arabic |
|---|---|---|
| 2 reduced | "Suggestions are shorter this cycle — the usage window is close to its limit." | "الاقتراحات أقصر في هذه الدورة — اقتربت النافذة من حدّها." |
| 3 templates | "Generation is paused. Brief templates and your phrase bank remain available and are labeled as such." | "الصياغة متوقفة مؤقتاً. قوالب الموجزات ومخزون عباراتك متاحة وموسومة بذلك." |
| 4 unavailable | "Generation is unavailable right now. Everything else in the studio works — we'll say when it returns (est. {time})." | "الصياغة غير متاحة الآن. كل ما عداها في الاستوديو يعمل — وسنخبرك عند عودتها (تقديراً {وقت})." |

## F. Dialect & register moments (product-signature copy)

| Moment | English (UI in en mode) | Arabic |
|---|---|---|
| Dialect detected | "This passage reads Levantine, not the selected register. Normalize it to فصحى, or keep the dialect and mark the document?" | "تُقرأ هذه الفقرة باللهجة الشامية لا بالسجل المختار. تطبيعها إلى الفصحى، أم إبقاء اللهجة ووسم المستند؟" |
| Register drift flag | "Register drift — this line slipped below the selected formality." | "انزياح سجلي — نزل هذا السطر دون مستوى الرسمية المختار." |
| Tashkeel on | "Diacritics on — line spacing widened to fit them." | "التشكيل مفعّل — وُسّع تباعد الأسطر لاستيعابه." |
| Glossary conflict (CP-4) | "Two definitions claim «السلة». Keeping one is an owner decision — both stay visible until you choose." | "تعريفان يتنازعان «السلة». إبقاء أحدهما قرارٌ للمالك — يبقى كلاهما ظاهراً حتى تختار." |
