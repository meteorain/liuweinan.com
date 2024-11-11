function getFirstDay(Y, M, D) {
    var y, m, d;
    y = parseInt(Y);
    m = parseInt(M);
    d = parseInt(D);
    var fy, fa, fm;
    if (y == 0) {
        return false;
    }
    if (y == 1582 && m == 10 && d > 4 && d < 15) {
        return false;
    }
    if (y < 0) {
        y++;
    }
    if (m > 2) {
        fy = y;
        fm = m + 1;
    } else {
        fy = y - 1;
        fm = m + 13;
    }
    var returnValue = Math.floor(Math.floor(365.25 * fy) + Math.floor(30.6001 * fm) + d + 1720995);
    var gregorianStart = 15 + 31 * (18994);
    if (d + 31 * (m + 12 * y) >= gregorianStart) {
        fa = Math.floor(0.01 * fy);
        returnValue += 2 - fa + Math.floor(0.25 * fa);
    }
    return returnValue + 1;
}


function checkInArray(aDay, iDay, aSort) {
    for (var i in aDay) {
        if (aDay[i] == iDay) {
            if (aSort == false) {
                return true;
            }
            for (var j in aSort) {
                if (aSort[j] == iDay) {
                    return true;
                }
            }
        }
    }
}


function getMonthURL(iM) {
    var aM = iM.split("-");
    if (aM.length == 2) {
		return aM[0] + (parseInt(aM[1])>9 ? "_" : "_0") + parseInt(aM[1]) + "_01_archive.html";
    } else {
        return "";
    }
}


function Calendar() {
	var Day = new Array("日", "一", "二", "三", "四", "五", "六");
	var daysInMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	var daysInAWeek = 7;
	var OStr;
	var today = new Date();

	var iCY=document.location.href.match(/\d{4}(?=[_|/])/);
	if (iCY == null) {
		iCY = today.getFullYear();
		iCM = today.getMonth() + 1;
	} else {
		var iCM=new String(document.location.href.match(/\d{4}[_|/]\d\d/)).substr(5);
	}
	var iCD=today.getDate();

	iCY = parseInt(iCY,10);
	iCM = parseInt(iCM,10);
	iCD = parseInt(iCD,10);
	if ( iCM==0 )
	{
		iCM = 12;
		iCY--;
	}

	var prev_date = new Date(iCY, iCM-2, 1);
	var next_date = new Date(iCY, iCM, 1);

	var sCP = prev_date.getFullYear() + '-' + (prev_date.getMonth() + 1);
	var sCN = next_date.getFullYear() + '-' + (next_date.getMonth() + 1);

	if (iCY == "" || isNaN(iCY)) {
		thisYear = today.getFullYear();
	} else {
		thisYear = parseInt(iCY, 10);
	}
	if (iCM == "" || isNaN(iCM)) {
		thisMonth = today.getMonth() + 1;
	} else {
		thisMonth = parseInt(iCM,10);
		if (thisMonth < 1) {
			thisMonth = 1;
		}
		if (thisMonth > 12) {
			thisMonth = 12;
		}
	}
	if (iCD == "" || isNaN(iCD)) {
		//thisDay = today.getDate();
		thisDay = 0;
	} else {
		thisDay = parseInt(iCD,10);
		if (thisDay < 0) {
			thisDay = 1;
		}
		if (thisDay > 31) {
			thisDay = 31;
		}
	}
	if ((thisYear % 4) == 0) {
		daysInMonth[1] = 29;
		if ((thisYear % 100) == 0 && (thisYear % 400) != 0) {
			daysInMonth[1] = 28;
		}
	}

	var sourcecode = document.documentElement.outerHTML;
	var posts = sourcecode.match(/\/\d{4}[/]\d{2}[/].*(?="\s*title="permanent\ link)/g);
	var postd = sourcecode.match(/\d{1,2}[/]\d{2}[/]\d{4}(?=\s*\d{2}:\d{2}:\d{2})/g);
	var temp =  "^" + thisMonth + "[/]\\d{2}[/]" + thisYear;
	var re = new RegExp(temp);

	var HasLog = new Array();
	if (posts != null) {
		for (var i = 0; i < postd.length; i++) {
			if (re.test(postd[i])) {
				HasLog[parseInt(postd[i].match(/\d{2}(?=[/]\d{4})/g),10)] = posts[i];
			}
		}
	}

	OStr = "<table cellspacing='0'>\n<tr class='calendarHead'><td colspan='7'>";
	if (getMonthURL(sCP) == "") {
		OStr += "<span class='preMonth'>&laquo;";
	} else {
		OStr += "<span class='preMonth'><a href='" + getMonthURL(sCP) + "'>&laquo;</a></span>";
	}
	OStr += "&nbsp;" + thisYear + "\u5E74&nbsp;" + thisMonth + "\u6708&nbsp;";
	if (getMonthURL(sCN) == "") {
		OStr += "<span class='nextMonth'>&raquo;</span>";
	} else {
		if (sCN == (today.getFullYear() + '-' + (today.getMonth() + 2))) {
			OStr += "<span class='nextMonth'>&raquo;</span>";
		} else {
			OStr += "<span class='nextMonth'><a href='" + getMonthURL(sCN) + "'>&raquo;</a></span>";
		}
	}
	OStr += "</td></tr>\n<tr class='week'>";
	for (i = 0; i < daysInAWeek; i++) {
		OStr += "<td class='d" + i + "'>" + Day[i] + "</td>";
	}
	OStr += "</tr>\n<tr class='day'>";
	var firstDay = (getFirstDay(thisYear, thisMonth, 1)) % 7;
	for (i = 0; i < firstDay; i++) {
		OStr += "<td>&nbsp;</td>";
	}
	for (d = 1; i < daysInAWeek; i++, d++) {
		if (d == 5 && thisMonth == 10 && thisYear == 1582) {
			d += 10;
		}
		OStr += "<td";
		if (d == thisDay && thisYear == today.getFullYear() && thisMonth == today.getMonth() + 1) {
			OStr += " class=today";
		} else {
			OStr += "";
		}
		if (HasLog[d]) {
			OStr += "><a href='" + HasLog[d];
			OStr += "'><b>" + d + "</b></a></td>";
		} else {
			OStr += ">" + d + "</td>";
		}
	}
	var lastDayOfMonth = daysInMonth[thisMonth - 1];
	for (j = 1; j < 6 && d <= lastDayOfMonth; j++) {
		OStr += "</tr>\n<tr class='day'>";
		for (i = 0; i < daysInAWeek && d <= lastDayOfMonth; i++, d++) {
			OStr += "<td";
			if (d == thisDay && thisYear == today.getFullYear() && thisMonth == today.getMonth() + 1) {
				OStr += " class=today";
			} else {
				OStr += "";
			}
			if (HasLog[d]) {
				OStr += "><a href='" + HasLog[d];
				OStr += "'><b>" + d + "</b></a></td>";
			} else {
				OStr += ">" + d + "</td>";
			}
		}
		for (; i < daysInAWeek; i++) {
			OStr += "<td>&nbsp;</td>";
		}
	}
	OStr += "</tr></table>";
	document.write(OStr);
}

function pageNavi() {
	var today = new Date();

	var iCY=document.location.href.match(/\d{4}(?=[_|/])/);
	if (iCY == null) {
		iCY = today.getFullYear();
		iCM = today.getMonth() + 1;
	} else {
		var iCM=new String(document.location.href.match(/\d{4}[_|/]\d\d/)).substr(5);
	}
	
	iCY = parseInt(iCY,10);
	iCM = parseInt(iCM,10);

	if ( iCM==0 )
	{
		iCM = 12;
		iCY--;
	}
	
	var prev_date = new Date(iCY, iCM-2, 1);
	var next_date = new Date(iCY, iCM, 1);

	var sCP = prev_date.getFullYear() + '-' + (prev_date.getMonth() + 1);
	var sCN = next_date.getFullYear() + '-' + (next_date.getMonth() + 1);
	
	var OStr = "<table width=100%><tr>";
	OStr += "<td align='left'><span class='preMonth'><a href='" + getMonthURL(sCP) + "'>&lt;&lt; Previous Month</a></span></td>";
	if (sCN == (today.getFullYear() + '-' + (today.getMonth() + 2))) {
		OStr += "<td align='right'> </td>";
	} else {
		OStr += "<td align='right'><span class='nextMonth'><a href='" + getMonthURL(sCN) + "'>Next Month &gt;&gt;</a></span></td>";
	}
	OStr += "</tr></table>";
	document.write(OStr);
}