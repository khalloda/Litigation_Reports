SELECT الدعاوى.العميل AS Expr1, الدعاوى.[matterAR], الجلسات.المحكمة, الجلسات.الدائرة, الدعاوى.[client&Cap], الدعاوى.[opponent&Cap], الدعاوى.[matterSubject], الجلسات.التاريخ, الجلسات.القرار, الدعاوى.[clientBranch], الدعاوى.[المخصص المالي], الدعاوى.[matteEvaluation], الدعاوى.[فرع 2]
FROM الدعاوى INNER JOIN الجلسات ON الدعاوى.[matterID]=الجلسات.matterID
WHERE (((الجلسات.القرار)<>"") And ((الدعاوى.العميل)="أدخنة النخلة") And ((الجلسات.تقرير)=Yes) And ((الدعاوى.[matterSelect])=Yes) And ((الدعاوى.[matterStatus])="سارية"));
