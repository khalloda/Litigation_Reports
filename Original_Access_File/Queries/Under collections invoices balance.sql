SELECT الفواتير.[Inv-No], Sum(السداد.Credit) AS SumOfCredit, الفواتير.Amount, [Amount]-[SumOfCredit] AS Balance, الفواتير.[Inv-Status], الفواتير.[Inv-Type]
FROM الفواتير INNER JOIN السداد ON الفواتير.[Inv-No] = السداد.[رقم الفاتورة]
GROUP BY الفواتير.[Inv-No], الفواتير.Amount, [Amount]-[SumOfCredit], الفواتير.[Inv-Status], الفواتير.[Inv-Type]
HAVING (((الفواتير.[Inv-Status])<>"paid"));
