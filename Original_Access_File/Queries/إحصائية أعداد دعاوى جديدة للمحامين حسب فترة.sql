SELECT [توزيع دعاوى جديدة للمحامين خلال فترة].[matterAR], lawyers.[اسم المحامي], lawyers.LawyerID, [توزيع دعاوى جديدة للمحامين خلال فترة].[matterCategory]
FROM [توزيع دعاوى جديدة للمحامين خلال فترة], lawyers
WHERE (((lawyers.[اسم المحامي])<>"**") And (([توزيع دعاوى جديدة للمحامين خلال فترة].[lawyerA]) Like "*" & [اسم المحامي] & "*"))
ORDER BY lawyers.LawyerID;
