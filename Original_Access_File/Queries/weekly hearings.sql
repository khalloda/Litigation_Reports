SELECT الجلسات.التاريخ, الدعاوى.[matterAR], الجلسات.المحكمة, الجلسات.الدائرة, الدعاوى.[client&Cap], الدعاوى.[opponent&Cap], الدعاوى.[matterSubject], الجلسات.[lastDecision], الجلسات.القرار, الجلسات.[إخطار العميل بالقرار], الجلسات.[حاضر 1], الجلسات.[حاضر 2], الدعاوى.[lawyerA], المحامين.lawyer_email, العملاء.العميل
FROM (العملاء INNER JOIN (المحامين INNER JOIN الدعاوى ON المحامين.lawyer_name=الدعاوى.[lawyerA]) ON العملاء.[ID_client]=الدعاوى.clientID) INNER JOIN الجلسات ON الدعاوى.[matterID]=الجلسات.matterID
WHERE (((الجلسات.التاريخ) Between #10/1/2019# And Date()) And ((الجلسات.القرار) Is Not Null) And ((الجلسات.[إخطار العميل بالقرار])=No) And ((الدعاوى.[matterStatus])="سارية"))
ORDER BY الجلسات.التاريخ, الجلسات.المحكمة;
