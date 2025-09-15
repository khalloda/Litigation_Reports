SELECT الدعاوى.العميل, الدعاوى.[matterAR], الدعاوى.[client&Cap], الدعاوى.[opponent&Cap], الدعاوى.[matterSubject], الدعاوى.المحامي, الدعاوى.[matterStatus], الدعاوى.[matterPartner], الجلسات.التاريخ, الجلسات.القرار, الجلسات.الحاضر, الجلسات.الإجراء, الجلسات.المحكمة, الجلسات.الدائرة, الجلسات.الجهة, الجلسات.[العمل المطلوب] AS Expr1, الدعاوى.[matteEvaluation]
FROM الدعاوى INNER JOIN الجلسات ON الدعاوى.[matterAR]=الجلسات.[رقم الدعوى]
WHERE (((الدعاوى.[matterAR])=Forms!التقارير!Combo0));
