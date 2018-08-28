(function() {
	console.log(document);
	console.log(document.getElementById('okButton'));
	let button = document.getElementById('okButton');
	let threadInput = document.getElementById('threadInput');

	button.addEventListener('click', function() {	
	    chrome.storage.local.set({"thread":threadInput.value}, function(){});
	    window.close();
	});

	chrome.storage.local.get(['thread'], function(result) {
		threadInput.value = result.thread;
	});
})();