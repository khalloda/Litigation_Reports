SELECT First(الدعاوى.[matterDegree]) AS [الدرجة Field], Count(الدعاوى.[matterDegree]) AS NumberOfDups
FROM الدعاوى
GROUP BY الدعاوى.[matterDegree]
HAVING (((Count(الدعاوى.[matterDegree]))>1));
