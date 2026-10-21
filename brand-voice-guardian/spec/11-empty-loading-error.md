# 11 — Empty / Loading / Error: brand-voice-guardian (Copy Matrix)

Voice: precise-auditor — findings describe text, never writers (02). Bilingual core states.

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| First-run (no profile) | "Build your first profile — a register, your terms, your banned list. Thirty minutes, once." | "ابنِ ملفك الأول — سجلٌ، ومصطلحاتك، وقائمة المحظورات. ثلاثون دقيقة، مرةً واحدة." | Create profile |
| No history | "No checks yet. The first paste tells you more than any demo." | "لا تدقيق بعد. أول لصقٍ يخبرك أكثر من أي عرض." | Go to check |
| Filtered-empty | "No records match these filters." | "لا سجلات تطابق هذه المرشحات." | Clear filters |
| No-access | "This profile belongs to another workspace." | "هذا الملف يخصّ مساحة عمل أخرى." | Switch workspace |
| Partial profile notice | "Running with a partial profile — terminology and banned terms only. Calibration adds register drift." | "التشغيل بملفٍ جزئي — المصطلحات والمحظورات فقط. المعايرة تضيف انحراف السجل." | Calibrate now |

## B. Loading

| State | English | Arabic |
|---|---|---|
| Check running | "Checking — 214 rules over your text." | "جارٍ التدقيق — ٢١٤ قاعدة على نصّك." |
| Findings skeleton | finding-card skeletons ×6 | بطاقات نتائج هيكلية |
| Import | "Importing terms — row {n}" | "استيراد المصطلحات — السطر {n}" |
| Report export | "Assembling the audit report — records pinned to their profile versions." | "تجميع تقرير التدقيق — السجلات مثبّتة على إصدارات ملفاتها." |

## C. Errors

| Class | English | Arabic |
|---|---|---|
| VALIDATION | "A profile needs a name, a register, and at least one locale before it can govern anything." | "يحتاج الملف إلى اسمٍ وسجلٍ ولغةٍ واحدة على الأقل قبل أن يحكم شيئاً." |
| NOT_FOUND (record) | "That record no longer exists in this workspace." | "لم يعد ذلك السجل موجوداً في مساحة العمل." |
| PERMISSION | "Checking rights for this profile sit with its workspace." | "صلاحيات التدقيق لهذا الملف بيد مساحة عمله." |
| CONFLICT (profile edit) | "The profile changed while you were editing — both versions are kept. Merge deliberately." | "تغيّر الملف أثناء تحريرك — الاحتفاظ بالنسختين. ادمج بوعي." |
| RATE_LIMIT | "This month's check window is used. Records and reports stay open — checks resume {date}." | "استُهلكت نافذة التدقيق لهذا الشهر. السجلات والتقارير مفتوحة — يستأنف التدقيق في {تاريخ}." |
| NETWORK | "The check stopped mid-run. Nothing was half-checked — retry starts clean." | "توقف التدقيق في منتصفه. لا شيء دُقّق نصف تدقيق — تبدأ إعادة المحاولة نظيفة." |
| UNKNOWN | "Something failed on our side (ref {id}). Retry; quote the reference if it repeats." | "حدث خلل لدينا (مرجع {id}). أعد المحاولة؛ واذكر المرجع إن تكرر." |

## D. Success & status

| Moment | English | Arabic |
|---|---|---|
| Clean pass | "Clean pass — 0 findings against 214 rules checked." | "تدقيق نظيف — ٠ نتائج مقابل ٢١٤ قاعدة مُدقّقة." |
| Findings ready | "5 findings — 3 terminology, 1 banned, 1 register. Triage with the keyboard." | "٥ نتائج — ٣ مصطلحات، ١ محظور، ١ سجل. فرزها بلوحة المفاتيح." |
| Fix accepted | "Fix applied — the record notes who and when." | "طُبّق الإصلاح — يُدوّن السجل مَن ومتى." |
| Report ready | "Audit report ready — expires in 7 days, regenerable forever from the record." | "تقرير التدقيق جاهز — تنتهي صلاحيته بعد ٧ أيام، ويُعاد توليده من السجل أبداً." |

## E. Governance moments

| Moment | English | Arabic |
|---|---|---|
| Register slip finding | "Register — this line sits below the declared formality (فصحى وسطى)." | "السجل — يجلس هذا السطر دون الرسمية المعلنة (فصحى وسطى)." |
| Banned term finding | "Banned — «الأفضل عالمياً» is on the banned list (brand rule 4)." | "محظور — «الأفضل عالمياً» على قائمة المحظورات (قاعدة العلامة ٤)." |
| Regulated phrase | "Regulated — this phrasing requires the compliance citation (rule: claims-2)." | "منظّم — تتطلب هذه الصياغة إشارة الامتثال (قاعدة: الادعاءات-٢)." |
| Conflict terms | "Two terms claim the same concept. Governance never guesses — choose, and both stay recorded." | "مصطلحان يتنازعان المفهوم ذاته. الحوكمة لا تخمّن — اختر، ويبقى كلاهما مُدوّناً." |
| Heuristic fallback label | "Heuristic — register analysis is limited right now; this flag is a warning, not a verdict." | "استدلالي — تحليل السجل محدود الآن؛ هذا العلم تحذيرٌ لا حكم." |
