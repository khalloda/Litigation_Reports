SELECT الجلسات.nextHearing, الدعاوى.matterAR, الجلسات.المحكمة, الجلسات.الدائرة, الدعاوى.[client&Cap], الدعاوى.[opponent&Cap], الدعاوى.matterSubject, الجلسات.lastDecision, الدعاوى.lawyerA, الدعاوى.lawyerB, الجلسات.[حاضر 1], الجلسات.[حاضر 2], الجلسات.[حاضر 3], الجلسات.[حاضر 4], الجلسات.shortDecision
FROM الدعاوى INNER JOIN الجلسات ON الدعاوى.matterID=الجلسات.matterID
WHERE (((الجلسات.nextHearing) Between Forms!Dashboard!التقارير.Form!txtFrom And Forms!Dashboard!التقارير.Form!txtTo) And ((الدعاوى.matterStatus)="سارية"))
ORDER BY الجلسات.nextHearing, الجلسات.المحكمة;
