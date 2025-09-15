SELECT الجلسات.المحكمة, الجلسات.الدائرة, الدعاوى.matterAR, الدعاوى.[client&Cap], الدعاوى.[opponent&Cap], الجلسات.lastDecision, الجلسات.nextHearing, الدعاوى.matterStatus, الجلسات.تقرير, الجلسات.القرار, الجلسات.الجهة, الجلسات.التاريخ
FROM الدعاوى INNER JOIN الجلسات ON الدعاوى.matterID=الجلسات.matterID
WHERE (((الجلسات.nextHearing) Between Forms!Dashboard!التقارير.Form!Text42 And Forms!Dashboard!التقارير.Form!Text151) And ((الدعاوى.matterStatus)="سارية") And ((الجلسات.تقرير)=True) And ((الجلسات.الجهة)=Forms!Dashboard!التقارير.Form!Combo70))
ORDER BY الجلسات.nextHearing;
