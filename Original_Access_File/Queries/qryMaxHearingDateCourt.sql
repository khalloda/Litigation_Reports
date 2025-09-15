SELECT الجلسات.التاريخ, الجلسات.matterID, الجلسات.القرار
FROM (الدعاوى INNER JOIN الجلسات ON الدعاوى.matterID=الجلسات.matterID) INNER JOIN qryMatterMaxHearingDate2 ON (الدعاوى.matterID=qryMatterMaxHearingDate2.matterID) AND (qryMatterMaxHearingDate2.MaxOfالتاريخ=الجلسات.التاريخ);
