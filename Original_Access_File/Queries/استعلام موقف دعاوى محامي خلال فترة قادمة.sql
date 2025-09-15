SELECT العملاء.العميل, الدعاوى.[matterAR], الدعاوى.[client&Cap], الدعاوى.[opponent&Cap], الدعاوى.[matterSubject], الجلسات.التاريخ, الجلسات.القرار, الجلسات.[صالح/ضد], الدعاوى.[lawyerA], الجلسات.المحكمة, الجلسات.الدائرة, الجلسات.[lastDecision]
FROM العملاء INNER JOIN (الدعاوى INNER JOIN الجلسات ON الدعاوى.[matterAR]=الجلسات.[رقم الدعوى]) ON العملاء.[ID_client]=الدعاوى.clientID
WHERE (((الجلسات.التاريخ) Between Forms!Dashboard!التقارير.Form!Text227 And Forms!Dashboard!التقارير.Form!Text229) And ((الجلسات.القرار) Is Null) And ((الدعاوى.[lawyerA]) Like "*" & Forms!Dashboard!التقارير.Form!Combo223 & "*"))
ORDER BY الجلسات.التاريخ;
