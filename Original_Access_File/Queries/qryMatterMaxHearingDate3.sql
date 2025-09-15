SELECT الدعاوى.matterID, Max(الجلسات.التاريخ) AS MaxOfالتاريخ, الجلسات.الإجراء
FROM الدعاوى INNER JOIN الجلسات ON الدعاوى.matterID=الجلسات.matterID
GROUP BY الدعاوى.matterID, الجلسات.الإجراء
HAVING (((الجلسات.الإجراء)="خبير"));
