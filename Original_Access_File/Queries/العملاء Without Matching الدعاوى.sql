SELECT العملاء.ID_client
FROM العملاء LEFT JOIN الدعاوى ON العملاء.ID_client=الدعاوى.clientID
WHERE (((الدعاوى.clientID) Is Null));
