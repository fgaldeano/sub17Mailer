let userId;
let thread;

const run = function() {
	const mainBody = document.querySelector('#mainBody');
	const button = document.createElement('A');
	button.attributes.role = 'button';
	button.title = chrome.i18n.getMessage('sendmail');
	button.id = 'sendMailButton';
	button.innerHTML = '<img alt="' + chrome.i18n.getMessage('sendmail') + '" src="/Img/Icons/transparent.gif">';
	mainBody.insertBefore(button, mainBody.childNodes[0]);
	button.addEventListener('click', () => sendMailAction());
};

const sendMailAction = function() {
	chrome.storage.local.get(['thread'], result => {
		thread = result.thread;
	});
	const player = document.querySelector('.hasByline').innerText;
	const playerName = player.substring(0, player.lastIndexOf(' ')).trim();
	const playerId = player.substring(player.indexOf('(') + 1, player.indexOf(')')).trim();

	let managerUrl = getManagerUrl();
	
	if(managerUrl === '') {
		return;
	}
	getUserId(managerUrl).then(() => {
		if(!userId) {
			console.log(chrome.i18n.getMessage('noUserFound'));
		}
		if(!thread || !userId) {
			return;
		}
		savePlayer(playerName, playerId);
	});
	
}

const getManagerUrl = function() {
	let result = document.querySelectorAll('div.subMenuBox > div.boxBody > ul > li > a[href*="Club/Manager"]')[0];
	return result.href;
};

const savePlayer = function(playerName, playerId) {
	let player = {"name": playerName, "id": playerId};
	return chrome.storage.local.set({"player": player}, checkRedirect);
};

const checkRedirect = function() {
	if(thread && thread !== '' && userId) {
		window.location.href = '/MyHattrick/Inbox/?actionType=newMail&userId=' + userId + '&youthPlayerMail=true';
	}
};

const getUserId = function(managerUrl) {
	return fetch(managerUrl)
		.then(response => response.text())
	    .then(text => {
	    	let parser = new DOMParser();
		    let htmlDocument = parser.parseFromString(text, "text/html");
		    let byLine = htmlDocument.documentElement.querySelector(".hasByline");
		    userId = byLine.innerText.substring(byLine.innerText.indexOf('(') + 1, byLine.innerText.indexOf(')')).trim();
	    })
	    .catch(err => console.log(err));
}

chrome.storage.local.get(['thread'], result => {
	if(!result.thread) {
		chrome.storage.local.set({"thread":'17084291.1'}, () => {});
	}
	run();
});