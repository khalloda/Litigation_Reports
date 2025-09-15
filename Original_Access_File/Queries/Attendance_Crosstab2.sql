TRANSFORM Count(Attendance.[AttSituation]) AS CountOfAttSituation
SELECT Attendance.[AttDate], Count(Attendance.[AttSituation]) AS [Total Of AttSituation]
FROM Attendance
GROUP BY Attendance.[AttDate]
PIVOT Attendance.[المحامي];
