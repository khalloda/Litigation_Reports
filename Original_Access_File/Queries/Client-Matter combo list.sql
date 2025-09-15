SELECT العملاء.العميل, الدعاوى.[matterAR], العملاء.[ID_client], الدعاوى.clientID
FROM العملاء INNER JOIN الدعاوى ON العملاء.[ID_client]=الدعاوى.clientID
WHERE (((العملاء.العميل)=[Forms]![Dashboard]![العملاء].[Form]![العميل]));
