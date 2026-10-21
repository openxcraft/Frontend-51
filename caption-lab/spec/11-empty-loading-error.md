# 11 — Empty / Loading / Error: caption-lab (Copy Matrix)

Voice: bench-craft precision; measurements carry units (02). Bilingual core matrix.

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| First-run (no project) | "Bring a transcript — timecoded or plain. Plain text becomes proposed cues you verify; timecodes start verified." | "أحضر نصاً مكتوباً — مؤقتاً أو عادياً. العادي يصبح إشاراتٍ مقترحة تتحقق منها؛ والمؤقت يبدأ مُتحقّقاً." | New project |
| Project empty (0 cues) | "No cues yet — the alignment pass will fill this grid." | "لا إشارات بعد — عملية المحاذاة ستملأ هذه الشبكة." | Run alignment |
| Filtered-empty | "No cues match this filter (over-gate, proposed, or search)." | "لا إشارات تطابق هذا المرشح (فوق البوابة، أو مقترحة، أو بحث)." | Clear filter |
| No-access | "This project belongs to another workspace." | "هذا المشروع يخصّ مساحة عمل أخرى." | Switch workspace |
| Presets empty | "Presets are the desk's shared memory — save your first style and everyone exports the same captions." | "الإعدادات المسبقة ذاكرة المكتب المشتركة — احفظ أسلوبك الأول ليصدّر الجميع الترجمات ذاتها." | Create preset |

## B. Loading

| State | English | Arabic |
|---|---|---|
| Alignment | "Aligning — cue {n} of {total}" | "المحاذاة — الإشارة {n} من {total}" |
| Grid boot | cue-row skeletons mirroring geometry | صفوف إشارات هيكلية |
| Break preview | (instant — computed; no fake progress) | (فورية — محسوبة؛ لا تقدّم زائف) |
| Preview frame | "Requesting preview frame at 12:04…" | "طلب إطار المعاينة عند ١٢:٠٤…" |
| Export | "Exporting — {format} {n} of {total formats}" | "التصدير — {صيغة} {n} من {مجموع}" |

## C. Errors

| Class | English | Arabic |
|---|---|---|
| VALIDATION (format) | "This transcript format isn't supported yet. SRT, VTT, timecoded text, or plain text work." | "صيغة النص غير مدعومة بعد. تعمل الصيغ: SRT وVTT والنص المؤقت والعادي." |
| VALIDATION (timing) | "A cue can't end before it starts. Nudge the end marker past {time}." | "لا تنتهي الإشارة قبل بدايتها. حرّك علامة النهاية بعد {الوقت}." |
| NOT_FOUND | "That cue or project no longer exists — the grid refreshed around it." | "تلك الإشارة أو المشروع لم يعد موجوداً — تحدّثت الشبكة حوله." |
| PERMISSION | "Refining rights for this project sit with its workspace." | "صلاحيات التحسين لهذا المشروع بيد مساحة عمله." |
| CONFLICT | "Two editors touched the same cue. Both versions are kept — pick what the viewer should read." | "لمس محرّران الإشارة ذاتها. النسختان محفوظتان — اختر ما ينبغي أن يقرأه المشاهد." |
| RATE_LIMIT | "This month's export window is used. Refinement keeps working — exports resume {date}." | "استُهلكت نافذة التصدير لهذا الشهر. التحسين يعمل — يستأنف التصدير في {تاريخ}." |
| NETWORK | "The grid went stale — reconnecting. Every verified cue is safe." | "تقادمت الشبكة — تجري إعادة الاتصال. كل إشارة مُتحقّقة آمنة." |
| UNKNOWN | "Something failed on our side (ref {id}). Retry; quote the reference if it repeats." | "حدث خلل لدينا (مرجع {id}). أعد المحاولة؛ واذكر المرجع إن تكرر." |

## D. Success & status

| Moment | English | Arabic |
|---|---|---|
| Gate cleared | "Under the gate — 17 words per minute." | "تحت البوابة — ١٧ كلمة في الدقيقة." |
| Alignment done | "612 cues aligned — 18 proposed, waiting for your verification." | "محاذات ٦١٢ إشارة — ١٨ مقترحة بانتظار تحققك." |
| Bulk applied | "Applied to 594 cues — 18 skipped (proposed cues verify first)." | "طُبّق على ٥٩٤ إشارة — تجاوز ١٨ (المقترحة تتحقق أولاً)." |
| Export ready | "Export ready — 4 formats, watermarked: 18 proposed cues included." | "التصدير جاهز — ٤ صيغ، موسوم: ١٨ إشارة مقترحة مشمولة." |
| Preset saved | "Preset saved at version 3 — the desk shares it, deliveries stay identical." | "حُفظ الإعداد مسبقاً في الإصدار ٣ — يشاركه المكتب، وتبقى التسليمات متطابقة." |

## E. Craft moments (product-signature)

| Moment | English | Arabic |
|---|---|---|
| Line-break proposal | "Two breaks are legal here — one keeps the verb with its subject. Your call." | "خيارا كسرٍ صحيحان هنا — أحدهما يبقي الفعل مع فاعله. قرارك." |
| Tashkeel warning | "Diacritics at this burn size (24px) clip on descenders — either enlarge or unvocalize." | "الحركات بهذا الحجم (٢٤ بكسل) تقتطع — كبّر أو أزل التشكيل." |
| Too-long cue | "This line reads at 23 wpm over a 20-wpm gate, and no break fixes it. Split the cue?" | "يُقرأ هذا السطر بـ٢٣ كلمة/دقيقة فوق بوابة ٢٠، ولا كسر يصلحه. تقسيم الإشارة؟" |
| Numeral policy | "Project policy renders Western digits in data, Arabic-Indic in prose — 3 cues disagree." | "سياسة المشروع تعرض الأرقام الغربية في البيانات والهندية في النص — ٣ إشارات تخالف." |
