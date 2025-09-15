SELECT First(الجلسات.[رقم الدعوى]) AS [رقم الدعوى Field], Count(الجلسات.[رقم الدعوى]) AS NumberOfDups
FROM الجلسات
GROUP BY الجلسات.[رقم الدعوى]
HAVING (((Count(الجلسات.[رقم الدعوى]))>=1));
