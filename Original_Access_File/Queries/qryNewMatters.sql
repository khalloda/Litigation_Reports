SELECT العملاء.Client_en, الدعاوى.matterEN, الدعاوى.matterStartDate, الدعاوى.matterSelect, الدعاوى.lawyerA
FROM العملاء LEFT JOIN الدعاوى ON العملاء.ID_client = الدعاوى.clientID
WHERE (((الدعاوى.matterStartDate) Between Forms!Dashboard!التقارير.Form!Text131 And Forms!Dashboard!التقارير.Form!Text133) And ((الدعاوى.matterSelect)=Yes));
