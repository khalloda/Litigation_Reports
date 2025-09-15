SELECT العملاء.ID_client, العملاء.Client_en, العملاء.Full_name, العملاء.العميل, العملاء.[Cash/probono], العملاء.Status, العملاء.logo, العملاء.contactLawyer
FROM العملاء
WHERE (((العملاء.العميل) Like "*" & [Forms]![قائمة العملاء 2]![Text20] & "*"));
