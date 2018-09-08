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
		chrome.i18n.getMessage('csvHeader_position')
	];
    let playerPosition = playerType.options[playerType.selectedIndex].text;

	csvContent = "data:text/csv;charset=utf-8," + header.join(',') + '\r\n';
	for(let tr of results) {
		let row = getRowFromTR(tr).join(',') + "," + playerPosition;
		csvContent += row + '\r\n';
	}
};

const getRowFromTR = function(tr) {
	let rowArray = [];
	let index = 0;
	for(let td of tr.querySelectorAll('td')) {
		let images = td.querySelectorAll('img');
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
		if(index === 4 && images.length > 0) {
			rowArray.push(getNumberFromStars(images));
		}
		index++;
	}    
	return rowArray;
};

const getNumberFromStars = function(images) {
	let number = 0;
	for(let img of images) {
		if(img.className.indexOf('starBig') !== -1) {
			number += 5;
		}
		if(img.className.indexOf('starWhole') !== -1) {
			number += 1;
		}
		if(img.className.indexOf('starHalf') !== -1) {
			number += 0.5;
		}
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
