# 11 — Empty / Loading / Error: podcast-publish-kit (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim (no templates), voice = producer-practical (02), Arabic = فصحاء بيضاء, Western numerals everywhere per ledger (incl. inside Arabic strings; timecodes render LTR-isolated mono — 05). Every empty has exactly one action (P01); every error follows [what]+[why]+[next] (copy-voice §1.4); buttons ≤3 words; errors ≤2 sentences; toasts ≤12 words.

## A. Empty states (four empties per P01 — enumerated per surface)

| Surface & state | English | Arabic | Action |
|---|---|---|---|
| Board first-run (no episodes, no shows) | "Your episode studio is ready. Import one transcript to get chapters and bilingual notes — or try it on a sample episode." | "استوديو الحلقات جاهز. استورد تفريغاً واحداً لتحصل على فصول وملاحظات بلغتين — أو جرّب حلقة عيّنة." | Import transcript / Try sample episode |
| Board first-run (new show, no episodes) | "First episode of «{show}». Title it, then bring its transcript." | "أول حلقة من «{برنامج}». عنونها، ثم أحضر تفريغها." | Add episode |
| Board filtered-empty (stage/show filter) | "No episodes match this filter. Episodes exist outside it." | "لا حلقات تطابق هذا المرشّح. توجد حلقات خارجه." | Clear filter |
| Board no-access | "This show belongs to another workspace." | "هذا البرنامج يخصّ مساحة عمل أخرى." | Switch workspace |
| Transcript empty (episode in Draft) | "No transcript yet. Paste the text — or pull it from your transcript source." | "لا تفريغ بعد. الصق النص — أو اجلبه من مصدر التفريغ." | Paste transcript |
| Chapters empty | "No chapters yet. Focus a segment and press ⌘Enter — or request suggestions." | "لا فصول بعد. اختر مقطعاً واضغط ⌘Enter — أو اطلب الاقتراحات." | Suggest chapters |
| Notes empty | "Show notes start with the summary. Both locales sit side by side." | "ملاحظات الحلقة تبدأ من الملخص. اللغتان جنباً إلى جنب." | Write summary |
| Suggestions empty (assist on, none requested) | "Suggestions appear here when you ask for them. Marking by hand works the whole time." | "تظهر الاقتراحات هنا حين تطلبها. والتأشير اليدوي يعمل طوال الوقت." | Suggest chapters |
| Packages first-run | "No packages yet — one is built from an episode whose chapters and notes are done." | "لا حزم بعد — تُبنى الحزمة من حلقة اكتملت فصولها وملاحظاتها." | Open episodes board |
| Jobs empty | "Nothing running. Imports, suggestions, builds, and deliveries appear here while they work." | "لا مهام قيد التنفيذ. الاستيراد والاقتراح والبناء والتسليم تظهر هنا أثناء عملها." | — |
| Channels empty (Settings) | "No publication channels yet. Download-and-upload works by hand — a channel only speeds it up." | "لا قنوات نشر بعد. التنزيل والرفع يعملان يدوياً — القناة اختيار للتسريع فقط." | Add channel |
| Palette no-results | "No results for «{query}»." | "لا نتائج لـ«{استعلام}»." | — |

## B. Loading (P02/P12; skeletons mirror geometry, RTL-mirrored; written labels per async-contract §3)

| Surface & state | English | Arabic |
|---|---|---|
| Board boot | (skeleton columns ×5) + "Loading your episodes…" (SR) | (أعمدة هيكلية ×5) + "جارٍ تحميل حلقاتك…" |
| Workbench boot (staged) | shell → zones → segments; SR: "Opening «{title}»" | الهيكل ثم المناطق ثم المقاطع؛ "فتح «{عنوان}»" |
| Transcript import (determinate) | "Converting 340 of 912 segments…" | "تحويل 340 من 912 مقطعاً…" |
| Import awaiting-input (untimed) | "This transcript has no timestamps. Declare the episode duration, or link your audio file." | "التفريغ بلا طوابع زمنية. أعلن مدة الحلقة، أو اربط ملف الصوت." |
| Suggestion run | "Drafting chapter suggestions…" | "جارٍ صياغة اقتراحات الفصول…" |
| Suggestion stalled (>8s) | "Suggestions are taking longer than usual. Keep waiting, or stop and retry." | "تستغرق الاقتراحات وقتاً أطول من المعتاد. انتظر، أو أوقف وأعد المحاولة." |
| Package build | "Building the package — 11 chapters, bilingual notes…" | "تُبنى الحزمة — 11 فصلاً، وملاحظات بلغتين…" |
| Delivery | "Delivering to «{channel}»…" | "جارٍ التسليم إلى «{قناة}»…" |
| Credential verify | "Verifying the channel with a real round-trip…" | "جارٍ التحقق من القناة بجولة فعلية…" |
| Job row | determinate: "{done} of {total}"; indeterminate: "Working — no estimate yet" | "{done} من {total}" ؛ "قيد العمل — لا تقدير بعد" |
| Notes autosave | "Saving…" → "Saved" (fades) | "جارٍ الحفظ…" → "حُفظ" |

## C. Errors (7 classes; every string names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (unparseable transcript) | "Couldn't parse the transcript — line 41 has an incomplete timestamp. Fix it and paste again." | "تعذّر تحليل التفريغ — السطر 41 يحمل طابعاً زمنياً غير مكتمل. صحّحه والصق من جديد." |
| VALIDATION (chapter range) | "A chapter can't start after its end — start 417, end 402. Move the boundary first." | "لا يبدأ الفصل بعد نهايته — البداية 417 والنهاية 402. حرّك الحدّ أولاً." |
| VALIDATION (sign-off blocked) | "Can't sign off yet — 2 derived items are still unmet. Their fix-links are in the list." | "لا يمكن التوقيع الآن — بندان مشتقان لم يكملا بعد. روابط إصلاحهما في القائمة." |
| VALIDATION (credential input) | "The channel needs a name and both identifier and secret. Fill the three, then save." | "تحتاج القناة اسماً ومعرّفاً وسِرّاً. أكمل الثلاثة ثم احفظ." |
| NOT_FOUND (episode/package gone) | "That episode or package is gone from this workspace — it may have been deleted or moved." | "تلك الحلقة أو الحزمة غابت عن مساحة العمل — ربما حُذفت أو نُقلت." |
| NOT_FOUND (expired artifact) | "This file expired — created 12 October with a 7-day window. Renew it in one action; the package itself is safe." | "انتهت صلاحية هذا الملف — أُنشئ في 12 أكتوبر بنافذة 7 أيام. جدّده بضغطة واحدة؛ الحزمة نفسها محفوظة." |
| PERMISSION (workspace scoping) | "This show belongs to another workspace." | "هذا البرنامج يخصّ مساحة عمل أخرى." |
| PERMISSION (credential grant class) | "This channel's grant doesn't cover delivery — it was granted read-only. Extend the grant, or deliver with another channel." | "منحة هذه القناة لا تغطي التسليم — مُنحت للقراءة فقط. وسّع المنحة، أو سلّم عبر قناة أخرى." |
| CONFLICT (chapter edited elsewhere) | "Another seat edited this chapter while you did. Both versions are kept side by side — choose what stays." | "حرّر مقعدٌ آخر هذا الفصل أثناء عملك. النسختان محفوظتان جنباً إلى جنب — اختر ما يبقى." |
| CONFLICT (notes edited elsewhere) | "The notes were edited from another seat. Both versions are kept — choose, or merge by hand." | "حُرّرت الملاحظات من مقعدٍ آخر. كلا الإصدارين محفوظ — اختر، أو ادمج يدوياً." |
| RATE_LIMIT (suggestion window used) | "This month's suggestion window is used. Manual marking works in full — suggestions resume 1 November." | "استُهلكت نافذة الاقتراحات لهذا الشهر. التأشير اليدوي يعمل بكامله — تستأنف الاقتراحات في 1 نوفمبر." |
| RATE_LIMIT (80% warning, P14) | "1 suggestion left in this month's window." | "تبقّى اقتراح واحد في نافذة هذا الشهر." |
| NETWORK (import dropped) | "The connection dropped mid-import. What parsed is kept and marked partial — retry continues from where it stopped." | "انقطع الاتصال أثناء الاستيراد. ما دُمج محفوظ وموسوم بالجزئية — تستكمل إعادة المحاولة من حيث توقفت." |
| NETWORK (offline banner, P20) | "You're offline. Edits queue locally and sync when you're back." | "أنت غير متصل. التعديلات تُصفّ محلياً وتُزامن عند عودة الاتصال." |
| NETWORK (delivery unreachable) | "Couldn't reach the publication channel — the network. Retry delivery; the key prevents doubles." | "تعذّر الوصول إلى قناة النشر — الشبكة. أعِد التسليم؛ المفتاح يمنع التكرار." |
| UNKNOWN | "Something failed on our side (ref ppk-corr-0007). Retry — quote the reference if it repeats." | "حدث خلل لدينا (مرجع ppk-corr-0007). أعد المحاولة — واذكر المرجع إن تكرر." |

## D. Success & status (calm; the single overshoot moment is package-sealed — 05)

| Moment | English | Arabic |
|---|---|---|
| Transcript landed | "Transcript landed — 912 segments, srt format, 58:14 long." | "وصل التفريغ — 912 مقطعاً، بصيغة srt، ومدته 58:14." |
| Chapter marked | "New chapter at segment 118 — title it in both locales." | "فصل جديد عند المقطع 118 — عنونه باللغتين." |
| Suggestions arrived | "7 suggestions arrived — 4 high confidence. Review, then accept what fits." | "وصلت 7 اقتراحات — 4 عالية الثقة. راجعها ثم اقبل ما يناسب." |
| Chapter deleted (undo window) | "Chapter deleted — Undo (7s)" | "حُذف الفصل — تراجع (7 ثوانٍ)" |
| Chapter list inserted | "Chapter list added to the notes — timestamps follow the chapters, always." | "أُضيفت قائمة الفصول إلى الملاحظات — الطوابع الزمنية تتبع الفصول دائماً." |
| Package sealed (signature) | "Package ready — version 2, 11 chapters, two chapter files, bilingual notes, expires in 7 days." | "الحزمة جاهزة — الإصدار 2، و11 فصلاً، وملفا فصول، وملاحظات بلغتين، وتنتهي بعد 7 أيام." |
| Delivered | "Package delivered to «{channel}» — ref ch-8841." | "سُلّمت الحزمة إلى «{قناة}» — المرجع ch-8841." |
| Checklist clear | "Checklist clear — the episode is ready to package." | "اكتملت قائمة التحقق — الحلقة جاهزة للحزم." |
| Channel verified | "Channel verified — it received a real test round-trip." | "تم التحقق من القناة — استلمت جولة اختبار فعلية." |

## E. Guardrail moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| Assist unavailable (rung 4) | "Suggestions are off right now. Manual marking works in full — we'll say when they return (est. 2 hours)." | "الاقتراح متوقف الآن. التأشير اليدوي يعمل بكامل وظيفته — وسنعلن عودته (تقديراً ساعتان)." |
| Assist reduced (rung 2) | "Suggestions are shorter this month — the window is near its limit." | "الاقتراحات أقصر هذا الشهر — النافذة قاربت حدّها." |
| Assist templates (rung 3) | "Suggesting is paused. Boundary templates remain available, clearly labeled as non-generated." | "توقّف الاقتراح مؤقتاً. حدود جاهزة من قوالب ثابتة — موسومة بذلك بوضوح." |
| Parity warning | "Arabic summary is 74 words, English 11 — intentional?" | "الملخص بالعربية 74 كلمة وبالإنجليزية 11 — أهذا مقصود؟" |
| Chapter lint | "3 chapters missing English titles." | "3 فصول تنقصها العناوين الإنجليزية." |
| Timing pending | "Chapters are anchored to segments; timestamps await the episode duration or your audio file." | "الفصول مرتبطة بالمقاطع؛ الطوابع الزمنية تنتظر مدة الحلقة أو ملف الصوت." |
| Secret shown once | "The channel secret shows once only — copy it and keep it." | "يُعرض سِرّ القناة مرة واحدة فقط — انسخه واحتفظ به." |
| Credential failed (degraded delivery) | "Package delivery is paused — the publication channel failed verification on 12 October. Renew it, or download the package and upload it by hand." | "توقّف تسليم الحزم — قناة النشر فشلت في التحقق بتاريخ 12 أكتوبر. جدّدها، أو نزّل الحزمة وارفعها يدوياً." |
| Audio privacy line (player disabled) | "Listening needs your audio file on your machine — it never uploads." | "الاستماع يتطلب ملف الصوت على جهازك — ولا يُرفع أبداً." |
