SELECT الجلسات.المحكمة, الجلسات.الدائرة, الدعاوى.matterAR, الدعاوى.[client&Cap], الدعاوى.[opponent&Cap], الجلسات.lastDecision, الجلسات.التاريخ, الدعاوى.matterDistination, الدعاوى.matterStatus, الجلسات.القرار, الدعاوى.matterCourt, الدعاوى.matterCircut
FROM الدعاوى INNER JOIN الجلسات ON الدعاوى.matterID=الجلسات.matterID
WHERE (((الجلسات.التاريخ)<=Date()) And ((الدعاوى.matterDistination)=Forms!Dashboard!التقارير.Form!الجهة) And ((الدعاوى.matterStatus)="سارية") And ((الجلسات.القرار) Is Null))
ORDER BY الجلسات.التاريخ;
