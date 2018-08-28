let userId;
let thread;

let run = function() {
	let mainBody = document.getElementById('mainBody');
	let button = document.createElement('A');
	button.attributes.role = 'button';
	button.title = chrome.i18n.getMessage('sendmail');
	button.className = 'sendMailButton';
	button.id = 'sendMailButton';
	button.innerHTML = '<img alt="' + chrome.i18n.getMessage('sendmail') + '" src="/Img/Icons/transparent.gif">';
	mainBody.insertBefore(button, mainBody.childNodes[0]);
	button.addEventListener('click', function() {
        sendMailAction();
    });
};

let sendMailAction = function() {
	chrome.storage.local.get(['thread'], function(result) {
		thread = result.thread;
	});
	let player = document.getElementsByClassName('hasByline')[0].innerText;
	let playerName = player.substring(0, player.lastIndexOf(' ')).trim();
	let playerId = player.substring(player.indexOf('(') + 1, player.indexOf(')')).trim();

	let managerUrl = getManagerUrl();
	
	if(managerUrl === '') {
		return;
	}
	getUserId(managerUrl).then(function() {
		if(!userId) {
			console.log(chrome.i18n.getMessage('noUserFound'));
		}
		if(!thread || !userId) {
			return;
		}
		savePlayer(playerName, playerId);
	});
	
}

let getManagerUrl = function() {
	let result = '';
	let boxBodies = document.getElementsByClassName('boxBody');
	let boxBodyChildren;
	for(let i = 0; i < boxBodies.length; i++) {
		if(boxBodies[i].innerHTML.indexOf('/Club/Manager') !== -1) {
			boxBodyChildren = boxBodies[i].childNodes;
			break;
		}
	}
	let found = false;
	for(let i = 0; i < boxBodyChildren.length; i++) {
		if(boxBodyChildren[i].tagName === 'UL') {
			let count = 0;
			for(let li = 0; li < boxBodyChildren.length; li++) {
				if(boxBodyChildren[i].childNodes[li].tagName == 'LI') {
					if(count == 1) {
						for(let a = 0; a < boxBodyChildren[i].childNodes[li].childNodes.length; a++) {
							if(boxBodyChildren[i].childNodes[li].childNodes[a].tagName == 'A') {
								result = boxBodyChildren[i].childNodes[li].childNodes[a].href;
								return result;
							}
						}
					}
					count++;
				}
			}
			break;
		}
	}
	return result;
};

let savePlayer = function(playerName, playerId) {
	let player = {"name": playerName, "id": playerId};
	return chrome.storage.local.set({"player": player}, checkRedirect);
};

let checkRedirect = function() {
	if(thread && thread !== '' && userId) {
		window.location.href = '/MyHattrick/Inbox/?actionType=newMail&userId=' + userId;
	}
};

let getUserId = function(managerUrl) {
	return fetch(managerUrl)
		.then((response) => response.text())
	    .then(function(text) {
	    	let parser = new DOMParser();
		    let htmlDocument = parser.parseFromString(text, "text/html");
		    let byLine = htmlDocument.documentElement.getElementsByClassName("hasByline")[0];
		    userId = byLine.innerText.substring(byLine.innerText.indexOf('(') + 1, byLine.innerText.indexOf(')')).trim();
	    });
}

run();