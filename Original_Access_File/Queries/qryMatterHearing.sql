SELECT الجلسات.matterID, العملاء.[Cash/probono], الدعاوى.[matterAR], العملاء.العميل, الدعاوى.[matterStartDate], الدعاوى.[lawyerA], الجلسات.التاريخ, الجلسات.[حاضر 1], الجلسات.[حاضر 2], الجلسات.[حاضر 3]
FROM العملاء INNER JOIN (الدعاوى INNER JOIN الجلسات ON الدعاوى.[matterID]=الجلسات.matterID) ON العملاء.ID_client = الدعاوى.clientID
WHERE (((الجلسات.التاريخ) Between #1/1/2020# And #12/31/2020#));
