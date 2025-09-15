SELECT العملاء.العميل, الدعاوى.[matterAR], الدعاوى.[client&Cap], الدعاوى.[opponent&Cap], الدعاوى.[matterSubject], الدعاوى.[matterStatus], الدعاوى.[matterShelf], الدعاوى.infoFort
FROM العملاء INNER JOIN الدعاوى ON العملاء.ID_client = الدعاوى.clientID
WHERE (((الدعاوى.[matterStatus])="منتهية"));
