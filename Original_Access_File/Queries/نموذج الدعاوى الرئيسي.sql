SELECT الدعاوى.*, العملاء.العميل, العملاء.logo.FileName
FROM العملاء INNER JOIN الدعاوى ON العملاء.ID_client=الدعاوى.clientID;
