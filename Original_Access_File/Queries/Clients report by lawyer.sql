SELECT الدعاوى.العميل, الدعاوى.[matterAR], الجلسات.المحكمة, الجلسات.الدائرة, الدعاوى.[client&Cap], الدعاوى.[opponent&Cap], الدعاوى.[matterSubject], الجلسات.التاريخ, الجلسات.القرار, الدعاوى.[clientBranch], الدعاوى.[المخصص المالي], الدعاوى.[matteEvaluation], الدعاوى.محامي
FROM الدعاوى INNER JOIN الجلسات ON الدعاوى.[matterAR]=الجلسات.[رقم الدعوى]
WHERE (((الجلسات.القرار)<>"") And ((الدعاوى.[matterSelect])=Yes) And ((الجلسات.تقرير)=Yes) And ((الدعاوى.محامي)=Forms!التقارير!Combo75));
