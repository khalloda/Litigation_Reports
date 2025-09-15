SELECT التوكيلات.العميل, التوكيلات.[رقم التوكيل], التوكيلات.حرف, التوكيلات.السنة
FROM التوكيلات LEFT JOIN العملاء ON التوكيلات.clientID=العملاء.[ID_client]
WHERE (((العملاء.[ID_client]) Is Null));
