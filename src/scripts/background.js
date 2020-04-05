let config = {
  apiKey: "AIzaSyD-w4KsxK0fxr9vilCXHPIr-KYgTmsG95E",
  authDomain: "ntscouting-c7546.firebaseapp.com",
  databaseURL: "https://ntscouting-c7546.firebaseio.com",
  projectId: "ntscouting-c7546",
  storageBucket: "",
  messagingSenderId: "946504729075",
  appId: "1:946504729075:web:15e5c2c6db948ee5591286"
};
firebase.initializeApp(config);
let database = firebase.firestore();
database.settings({ timestampsInSnapshots: true });
let settings = {};
database.collection('mailer').doc('settings').get().then(function(snapshot) {
	settings = snapshot.data();
});
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.command == "get"){
  	if(settings.blacklist) {
  		response({type: "result", status: "success", data: settings, request: msg});
  	} else {
	  	database.collection('mailer').doc('settings').get().then(function(snapshot) {
				settings = snapshot.data();
				response({type: "result", status: "success", data: settings, request: msg});
			}).catch(function(error) {
				settings = {};
				response({type: "result", status: "error", data: settings, request: msg});
			});
		}
	}
	return true;
});