SELECT العملاء.Client_en, Contacts.Contact1, Contacts.[E-mail Address], Contacts.[Job Title], Contacts.[Business Phone], Contacts.[Mobile Phone], Contacts.Address, Contacts.City, Contacts.[Country/Region]
FROM العملاء INNER JOIN Contacts ON العملاء.العميل=Contacts.العميل
WHERE (((العملاء.Status)="active") AND ((العملاء.[Cash/probono])="cash"));
