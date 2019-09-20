const results = document.querySelectorAll('#pnlResult > div.mainBox > table.tablesorter > tbody > tr');
const panel = document.querySelector('#pnlResult');
const playerType = document.querySelector('#ctl00_ctl00_CPContent_CPMain_ddlPosition');
const ageInput = document.querySelector('#ctl00_ctl00_CPContent_CPMain_txtAge');
let csvContent

const run = function() {
	if(results.length === 0) {
		return;
	}
	getExportData();
	addExportButton();
};

const addExportButton = function() {
	let encodedUri = encodeURI(csvContent);
	let link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", getFileName());
	link.innerHTML = chrome.i18n.getMessage('exportToCsv');
	link.className = 'exportLink';
	panel.parentNode.insertBefore(link, panel);
};

const getExportData = function() {
  const header = [
  	chrome.i18n.getMessage('csvHeader_name'), 
		chrome.i18n.getMessage('csvHeader_id'), 
		chrome.i18n.getMessage('csvHeader_years'), 
		chrome.i18n.getMessage('csvHeader_days'), 
		chrome.i18n.getMessage('csvHeader_toPromote'), 
		chrome.i18n.getMessage('csvHeader_specialty'), 
		chrome.i18n.getMessage('csvHeader_stars'), 
		chrome.i18n.getMessage('csvHeader_position'),
		chrome.i18n.getMessage('csvHeader_date')
	];
  let playerPosition = playerType.options[playerType.selectedIndex].text;

	csvContent = "data:text/csv;charset=utf-8," + header.join(',') + '\r\n';
	for(let tr of results) {
		let row = getRowFromTR(tr, playerPosition, new Date()).join(',');
		csvContent += row + '\r\n';
	}
};

const getRowFromTR = function(tr, position, now) {
	let rowArray = [];
	let index = 0;
	for(let td of tr.querySelectorAll('td')) {
		let stars = td.querySelector('.stars');
		let playerLink = td.querySelector('a');
		let innerText = td.innerText.trim();
	  if(index === 0 && playerLink) {
			rowArray.push(innerText);
			rowArray.push(playerLink.href.substring(playerLink.href.indexOf('=') + 1));
		}
		if(index === 1 && innerText.indexOf('(') !== -1) {
			let splitted = innerText.split(' (');
			rowArray.push(splitted[0]);
			rowArray.push(splitted[1].substring(0, splitted[1].length - 1));
		}
		if(index > 1 && index < 4) {
			rowArray.push(innerText);
		}
		if(index === 4 && stars.childNodes.length > 0) {
			rowArray.push(getNumberFromStars(stars));
		}
		index++;
	}
	rowArray.push(position);
	rowArray.push('' + (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear());
	return rowArray;
};

const getNumberFromStars = function(stars) {
	let number = 0;
	let intPart = stars.querySelector('.stars-full');
	let decimalPart = stars.querySelector('.stars-half');
	if(decimalPart) {
		number = parseFloat(intPart.innerText + decimalPart.innerText);
	} else {
		number = parseInt(intPart.innerText);
	}
	return number;
};

const getFileName = function() {
    if (playerType.selectedIndex == -1)
        return null;
    let rawAge = ageInput.value;
    let age = parseInt(rawAge);
    if ((age == "NaN") || (age > 17 || age < 15))
	return playerType.options[playerType.selectedIndex].text.replace(' ', '_') + '.csv';
    else
	return playerType.options[playerType.selectedIndex].text.replace(' ', '_') + ' (' + rawAge + ')' + '.csv';
}

run();
