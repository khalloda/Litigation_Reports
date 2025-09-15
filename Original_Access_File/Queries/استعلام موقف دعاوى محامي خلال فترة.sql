SELECT العملاء.العميل, الدعاوى.[matterAR], الدعاوى.[client&Cap], الدعاوى.[opponent&Cap], الدعاوى.[matterSubject], الجلسات.التاريخ, الجلسات.القرار, الجلسات.[صالح/ضد], الدعاوى.[lawyerA], الجلسات.المحكمة, الجلسات.الدائرة
FROM العملاء INNER JOIN (الدعاوى INNER JOIN الجلسات ON الدعاوى.[matterID]=الجلسات.[matterID]) ON العملاء.[ID_client]=الدعاوى.clientID
WHERE (((الجلسات.التاريخ) Between Forms!Dashboard!التقارير.Form!Text227 And Forms!Dashboard!التقارير.Form!Text229) And ((الدعاوى.[lawyerA]) Like "*" & Forms!Dashboard!التقارير.Form!Combo223 & "*") And ((الجلسات.تقرير)=Yes))
ORDER BY الجلسات.التاريخ;
