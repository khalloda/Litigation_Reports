SELECT العملاء.العميل, الدعاوى.[matterAR], الجلسات.المحكمة, الجلسات.الدائرة, الدعاوى.[client&Cap], الدعاوى.[opponent&Cap], الدعاوى.[matterSubject], الجلسات.التاريخ, الجلسات.القرار, الدعاوى.[clientBranch], الدعاوى.[المخصص المالي], الدعاوى.[matteEvaluation]
FROM العملاء INNER JOIN (الدعاوى INNER JOIN الجلسات ON الدعاوى.[matterID]=الجلسات.matterID) ON العملاء.ID_client=الدعاوى.clientID
WHERE (((الجلسات.القرار)<>"") And ((العملاء.العميل)=Forms!Dashboard!التقارير.Form!Combo46) And ((الجلسات.تقرير)=Yes) And ((الدعاوى.[matterSelect])=Yes) And ((الدعاوى.[matterStatus])="سارية"));
