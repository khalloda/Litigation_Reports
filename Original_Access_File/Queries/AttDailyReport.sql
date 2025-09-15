SELECT lawyers.LawyerName, Attendance.AttSituation, Attendance.AttDate
FROM lawyers INNER JOIN Attendance ON lawyers.[اسم المحامي]=Attendance.المحامي
WHERE (((Attendance.AttDate)=[Forms]![Dashboard]![AttMainForm].[Form]![Text16]))
ORDER BY lawyers.LawyerID;
