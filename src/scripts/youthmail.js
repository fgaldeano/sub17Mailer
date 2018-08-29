const normalUrl = 'https://drive.google.com/open?id=1K6zS2XX1adT0wgBDF-7K4DB79Uyo7RdUqJP_6RYzK44';
const bestNormalUrl = 'https://drive.google.com/open?id=16d9QdobMJXkV_50qjcGQc_FDSWp4MQPhC04HULZKBeI';
const bestNoLeagueUrl = 'https://drive.google.com/open?id=1NKpYDpocY2zp8EBLIZF_OjzpB-rXMeWLTfQ2CuKmtVM';
const bestNoFriendlyUrl ='https://drive.google.com/open?id=157ugVo13Bp7ibZ-knSui1Y3_gakC3ee-gj45cuTuggY';

let subject = 'Crack en inferiores: :playerName';

let normalBody='';
let bestNoFriendlyBody='';
let bestNoLeagueBody='';
let bestNormalBody='';

let player;
let mailBody;
let mailSubject;

let run = function() {
	if(!player) {
		return;
	}

	mailBody = document.getElementById('ctl00_ctl00_CPContent_CPMain_ucEditorMain_txtBody');
	mailSubject = document.getElementById('ctl00_ctl00_CPContent_CPMain_tbSubject');

	let container = document.createElement('DIV');
	container.className = 'pasteMailContainer';
    
    createButton(chrome.i18n.getMessage('normal'), container, 'template1');
	createButton(chrome.i18n.getMessage('bestNoFriendly'), container, 'template2');
	createButton(chrome.i18n.getMessage('bestNoLeague'), container, 'template3');
	createButton(chrome.i18n.getMessage('bestNormal'), container, 'template4');

	let sendMailButton = document.getElementById('ctl00_ctl00_CPContent_CPMain_btnSendNew');
	sendMailButton.addEventListener('click', function() {
        clearPlayer();
    });
};

let sendMailAction = function(template) {
    chrome.storage.local.get(['thread'], function(result) {
    	let text;
    	switch(template) {
    		case 'template1':
    		text = normalBody;
    		break;
    		case 'template2':
    		text = bestNoFriendlyBody;
    		break;
    		case 'template3':
    		text = bestNoLeagueBody;
    		break;
    		case 'template4':
    		text = bestNormalBody;
    		break
    	}
		let thread = result.thread;
		if(!thread || !text) {
			return;
		}
		mailBody.value = text.normalize().replace('{0}', player.name).replace('{1}', '[youthplayerid=' + player.id + ']').replace('{4}', thread);
		mailSubject.value = subject.replace(':playerName', player.name);
	});
};

let createButton = function(message, container, className) {
	let button = document.createElement('A');
	button.attributes.role = 'button';
	button.title = message;
	button.className = 'pasteMailButton ' + className;
	button.innerHTML = '<img alt="' + message + '" src="/Img/Icons/transparent.gif">';
	container.appendChild(button);
	mailBody.parentNode.insertBefore(container, mailBody);
	button.addEventListener('click', function() {
        sendMailAction(className);
    });
};

let clearPlayer = function() {
	chrome.storage.local.set({"player": null}, function() {});
};

fetch(normalUrl)
.then((response) => response.text())
.then(function(text) {
	let txt = text.substring(text.indexOf('"s":"') + 5).split('"', 2);
	normalBody = txt[0].replace(/\\n/g, '\n').replace(/\\u003d/, '=');
});

fetch(bestNormalUrl)
.then((response) => response.text())
.then(function(text) {
	let txt = text.substring(text.indexOf('"s":"') + 5).split('"', 2);
	bestNormalBody = txt[0].replace(/\\n/g, '\n').replace(/\\u003d/, '=');
});

fetch(bestNoLeagueUrl)
.then((response) => response.text())
.then(function(text) {
	let txt = text.substring(text.indexOf('"s":"') + 5).split('"', 2);
	bestNoLeagueBody = txt[0].replace(/\\n/g, '\n').replace(/\\u003d/, '=');
});

fetch(bestNoFriendlyUrl)
.then((response) => response.text())
.then(function(text) {
	let txt = text.substring(text.indexOf('"s":"') + 5).split('"', 2);
	bestNoFriendlyBody = txt[0].replace(/\\n/g, '\n').replace(/\\u003d/, '=');
});

chrome.storage.local.get(['player'], function(result) {
	player = result.player;
	run();
});