let player;
let normalSubject = 'Crack en inferiores: :playerName';
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

    
    createButton(chrome.i18n.getMessage('normal'), 'templates/normal.txt', container, 'template1');
	createButton(chrome.i18n.getMessage('bestNoFriendly'), 'templates/bestNoFriendly.txt', container, 'template2');
	createButton(chrome.i18n.getMessage('bestNoLeague'), 'templates/bestNoLeague.txt', container, 'template3');
	createButton(chrome.i18n.getMessage('bestNormal'), 'templates/bestNormal.txt', container, 'template4');

	let sendMailButton = document.getElementById('ctl00_ctl00_CPContent_CPMain_btnSendNew');
	sendMailButton.addEventListener('click', function() {
        clearPlayer();
    });
};

let sendMailAction = function(url) {
	fetch(url)
	.then((response) => response.text())
    .then(function(text) {
    	chrome.storage.local.get(['thread'], function(result) {
			let thread = result.thread;
			if(!thread || !text) {
				return;
			}
			mailBody.value = text.normalize().replace('{0}', player.name).replace('{1}', '[youthplayerid=' + player.id + ']').replace('{4}', thread);
			mailSubject.value = normalSubject.replace(':playerName', player.name);
		});
	});
      	
};

let createButton = function(message, url, container, className) {
	let fullUrl = chrome.runtime.getURL(url);
	let button = document.createElement('A');
	button.attributes.role = 'button';
	button.title = message;
	button.className = 'pasteMailButton ' + className;
	button.innerHTML = '<img alt="' + message + '" src="/Img/Icons/transparent.gif">';
	container.appendChild(button);
	mailBody.parentNode.insertBefore(container, mailBody);
	button.addEventListener('click', function() {
        sendMailAction(fullUrl);
    });
};

let clearPlayer = function() {
	chrome.storage.local.set({"player": null}, function() {});
};

chrome.storage.local.get(['player'], function(result) {
	player = result.player;
	run();
});