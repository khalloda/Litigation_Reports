SELECT Attendance.المحامي, Attendance.AttSituation, Attendance.AttDate
FROM Attendance
WHERE (((Attendance.المحامي)=Forms!Dashboard!AttMainForm.Form!Combo0) And ((Attendance.AttDate) Between Forms!Dashboard!AttMainForm.Form!Text2 And Forms!Dashboard!AttMainForm.Form!Text10));
