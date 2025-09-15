SELECT العملاء.Client_en, الدعاوى.[matterStartDate], الدعاوى.[matterEN], المحامين.Lawyer_EN, [Follow-up].[2) Engagement letter]
FROM العملاء INNER JOIN ((المحامين INNER JOIN الدعاوى ON المحامين.lawyer_name=الدعاوى.محامي) INNER JOIN [Follow-up] ON الدعاوى.[matterAR]=[Follow-up].Matter) ON العملاء.العميل=الدعاوى.العميل
WHERE ((([Follow-up].[2) Engagement letter])="Postponed"))
ORDER BY الدعاوى.[matterStartDate];
