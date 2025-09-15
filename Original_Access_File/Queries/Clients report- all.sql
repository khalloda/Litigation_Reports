SELECT الدعاوى.[matterAR], الجلسات.المحكمة, الجلسات.الدائرة, الدعاوى.[client&Cap], الدعاوى.[opponent&Cap], الدعاوى.[matterSubject], الجلسات.التاريخ, الجلسات.القرار, الدعاوى.[clientBranch], الدعاوى.[المخصص المالي], الدعاوى.[matteEvaluation], الدعاوى.[matterStatus], الدعاوى.محامي, العملاء.العميل, العملاء.logo
FROM العملاء INNER JOIN (الدعاوى INNER JOIN الجلسات ON الدعاوى.[matterID]=الجلسات.matterID) ON العملاء.[ID_client]=الدعاوى.clientID
WHERE (((الجلسات.القرار)<>"") And ((الدعاوى.[matterStatus])="سارية") And ((الجلسات.تقرير)=Yes) And ((الدعاوى.[matterSelect])=Yes));
