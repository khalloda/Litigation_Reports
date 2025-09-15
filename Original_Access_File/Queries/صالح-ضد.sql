SELECT العملاء.العميل, الدعاوى.matterAR, الدعاوى.[client&Cap], الدعاوى.[opponent&Cap], الدعاوى.matterSubject, الجلسات.التاريخ, الجلسات.القرار, الجلسات.[صالح/ضد], الجلسات.المحكمة, الجلسات.الدائرة
FROM العملاء INNER JOIN (الدعاوى INNER JOIN الجلسات ON الدعاوى.matterID=الجلسات.matterID) ON العملاء.ID_client=الدعاوى.clientID
WHERE (((الجلسات.التاريخ) Between Forms!Dashboard!التقارير.Form!Text106 And Forms!Dashboard!التقارير.Form!Text108) And ((الجلسات.[صالح/ضد]) Is Not Null));
