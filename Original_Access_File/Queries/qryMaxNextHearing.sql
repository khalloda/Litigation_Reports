SELECT الجلسات.matterID, Max(الجلسات.nextHearing) AS MaxOfnextHearing, الجلسات.الإجراء
FROM الجلسات
GROUP BY الجلسات.matterID, الجلسات.الإجراء
HAVING (((الجلسات.الإجراء)="محكمة"));
