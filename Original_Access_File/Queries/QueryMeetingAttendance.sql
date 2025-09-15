INSERT INTO meeting_attendance ( الاسم, [تاريخ الاجتماع], [موقف الحضور], [سبب عدم الحضور] )
SELECT lawyers.[اسم المحامي], meeting_attendance.[تاريخ الاجتماع], meeting_attendance.[موقف الحضور], meeting_attendance.[سبب عدم الحضور]
FROM lawyers INNER JOIN meeting_attendance ON lawyers.[اسم المحامي]=meeting_attendance.الاسم;
