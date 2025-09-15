SELECT الدعاوى.matterAR, الجلسات.nextHearing, العملاء.العميل, الدعاوى.matterStatus, الدعاوى.[client&Cap], الدعاوى.[opponent&Cap], الدعاوى.matterSubject, الدعاوى.matterCourt, الدعاوى.matterCircut, الجلسات.الجهة, الدعاوى.matterID, الجلسات.التاريخ, الجلسات.shortDecision, الدعاوى.matterDistination, الجلسات.تقرير
FROM العملاء INNER JOIN (الدعاوى INNER JOIN الجلسات ON الدعاوى.matterID=الجلسات.matterID) ON العملاء.ID_client=الدعاوى.clientID
WHERE (((الجلسات.nextHearing)<Date()) AND ((الدعاوى.matterStatus)="سارية") AND ((الجلسات.تقرير)=Yes))
ORDER BY الجلسات.nextHearing;
