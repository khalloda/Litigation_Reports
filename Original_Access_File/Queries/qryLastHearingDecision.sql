SELECT الدعاوى.[matterID], Max(الجلسات.التاريخ) AS MaxOfالتاريخ
FROM الدعاوى INNER JOIN الجلسات ON الدعاوى.[matterID]=الجلسات.matterID
GROUP BY الدعاوى.[matterID];
