SELECT lawyers.[LawyerID], Count(الدعاوى.[matterAR]) AS [CountOfرقم الدعوى], lawyers.[اسم المحامي]
FROM lawyers, [فريق العمل] INNER JOIN الدعاوى ON [فريق العمل].ID=الدعاوى.[فريق العمل]
WHERE (((الدعاوى.[lawyerB]) Like "*" & [اسم المحامي] & "*"))
GROUP BY lawyers.[LawyerID], lawyers.[اسم المحامي], الدعاوى.[matterStatus]
HAVING (((lawyers.[اسم المحامي])<>"**") And ((الدعاوى.[matterStatus])="سارية"))
ORDER BY lawyers.[LawyerID];
