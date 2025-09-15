SELECT العملاء.العميل, الدعاوى.[matterStartDate], الدعاوى.[matterAR], الدعاوى.[matterSubject], الدعاوى.[lawyerA], الدعاوى.[lawyerB], الدعاوى.[matterSelect], الدعاوى.[matterCategory]
FROM العملاء INNER JOIN الدعاوى ON العملاء.[ID_client]=الدعاوى.clientID
WHERE (((الدعاوى.[matterStartDate]) Between Forms!Dashboard!التقارير.Form!Text235 And Forms!Dashboard!التقارير.Form!Text237) And ((الدعاوى.[lawyerA]) Is Not Null) And ((الدعاوى.[matterSelect])=Yes))
ORDER BY الدعاوى.[matterStartDate];
