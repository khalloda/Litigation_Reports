TRANSFORM Count(Attendance.[AttSituation]) AS CountOfAttSituation
SELECT Attendance.[المحامي], Count(Attendance.[AttSituation]) AS [Total Of AttSituation]
FROM Attendance
GROUP BY Attendance.[المحامي]
PIVOT Attendance.[AttDate];
