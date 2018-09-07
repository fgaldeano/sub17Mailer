
const results = document.querySelectorAll('#pnlResult > div.mainBox > table.tablesorter > tbody > tr');
const panel = document.getElementById('pnlResult');
const playerType = document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlPosition');
let csvContent

const run = function() {
	if(!results) {
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
	const header = ['Id', 'Nombre', 'Edad', 'Dias para promoción', 'Especialidad', 'Rendimiento'];

	csvContent = "data:text/csv;charset=utf-8," + header.join(',') + '\r\n';
	for(let tr of results) {
		let row = getRowFromTR(tr).join(',');
		csvContent += row + '\r\n';
	}

};

const getRowFromTR = function(tr) {
	let rowArray = [];
	for(let td of tr.querySelectorAll('td')) {
		let images = td.querySelectorAll('img');
		let playerLink = td.querySelector('a');
		if(images.length > 0) {
			rowArray.push(getNumberFromStars(images));
			continue;
		}
		if(playerLink) {
			rowArray.push(playerLink.href.substring(playerLink.href.indexOf('=') + 1));
		}
		rowArray.push(td.innerText.trim());
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

    return playerType.options[playerType.selectedIndex].text.replace(' ', '_') + '.csv';
}

run();