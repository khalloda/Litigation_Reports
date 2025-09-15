SELECT First(الجلسات.الجهة) AS [الجهة Field], Count(الجلسات.الجهة) AS NumberOfDups, الجلسات.القرار
FROM الجلسات
GROUP BY الجلسات.القرار, الجلسات.الجهة
HAVING (((Count(الجلسات.الجهة))>=1) AND ((الجلسات.القرار) Is Null));
