(function() {
	let button = document.querySelector('#okButton');
	let threadInput = document.querySelector('#threadInput');

	button.addEventListener('click', function() {	
	    chrome.storage.local.set({"thread":threadInput.value}, function(){});
	    window.close();
	});

	chrome.storage.local.get(['thread'], function(result) {
		threadInput.value = result.thread;
	});
})();