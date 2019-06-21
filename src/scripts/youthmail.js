let subject = 'Crack en inferiores: :playerName';

const bodies = [`Buenas, del staff de la Sub17 Argentina estamos interesados en tu jugador [b]{0} {1}[/b] por el rendimiento que tuvo.

Te pedimos que pases por este thread para mostrarlo: [post={4}]. Ahí te vamos a brindar todo tipo de asesoramiento para optimizar su entrenamiento y mejorar tus inferiores.

En el foro, tenés que indicarnos:
- Habilidades del jugador
- El entrenamiento actual (primario y secundario) y si el jugador es prioridad.
- Los comentarios del cazatalentos
- ¿Cuál es tu intención para con el jugador una vez promocionado? venderlo o entrenarlo?

Muchas gracias por tu tiempo, la única manera de que no se nos escape ninguna promesa para la selección Argentina es con la ayuda de managers como vos.

Si decidís no pasar, nos serviría saber el motivo para modificar lo que sea necesario. Lo mismo si no queres recibir mas mails como este, nos avisas y te anotamos en la lista negra.

Suerte!`, `Buenas, del staff de la Sub17 Argentina estamos interesados en tu jugador [b]{0} {1}[/b] por el rendimiento que tuvo.

[b]Tu jugador está entre los mejores 15 de esta barrida, de acuerdo a su edad/rendimientos/especialidad, así que no dejes de pasar![/b]

[b]Por ejemplo: Sabías que en inferiores podes pactar amistosos cada 20 días y éstos son un entrenamiento extra para tus jugadores?[/b] Vemos que no has pactado en el último mes, estás perdiendo entrenamiento... más y más consejos por acá: [post={4}]

En el foro, tenes que indicarnos:
- Habilidades del jugador
- Los comentarios del cazatalentos
- El entrenamiento actual (primario y secundario) y si el jugador es prioridad.
- ¿Cuál es tu intención para con el jugador una vez promocionado? venderlo o entrenarlo?

Muchas gracias por tu tiempo, la única manera de que no se nos escape ninguna promesa para la selección Argentina es con la ayuda de managers como vos.

Si decidís no pasar, nos serviría saber el motivo para modificar lo que sea necesario. Lo mismo si no queres recibir mas mails como este, nos avisas y te anotamos en la lista negra.

Suerte!`, `Buenas, del staff de la Sub17 Argentina estamos interesados en tu jugador [b]{0} {1}[/b] por el rendimiento que tuvo.

[b]Tu jugador está entre los mejores 15 de esta barrida, de acuerdo a su edad/rendimientos/especialidad, así que no dejes de pasar![/b]

[b]Por ejemplo: Sabías que hay un truco para poder jugar más partidos y, por ende, que tus jugadores reciban más entrenamiento? Para esto debes jugar en ligas de 4 equipos (cosa que no estás haciendo). Una vez que termina, salís de la liga y te metes en otra (también de 4 equipos) que empiece a los 2/3 días. De está manera, no tenes que esperar 7 días para el próximo partido y entonces ganas un entrenamiento extra en ese semana.[/b] Por lo que tus jugadores podrían estar recibiendo más entrenamiento... más y más consejos por acá: [post={4}]

En el foro tenes que indicarnos:
- Habilidades del jugador
- El entrenamiento actual (primario y secundario) y si el jugador es prioridad.
- Los comentarios del cazatalentos
- ¿Cuál es tu intención para con el jugador una vez promocionado? venderlo o entrenarlo?

Muchas gracias por tu tiempo, la única manera de que no se nos escape ninguna promesa para la selección Argentina es con la ayuda de managers como vos.

Si decidís no pasar, nos serviría saber el motivo para modificar lo que sea necesario. Lo mismo si no queres recibir mas mails como este, nos avisas y te anotamos en la lista negra.

Suerte!
`, `Buenas, del staff de la Sub17 Argentina estamos interesados en tu jugador [b]{0} {1}[/b] por el rendimiento que tuvo.

[b]Tu jugador está entre los mejores 15 de esta barrida, de acuerdo a su edad/rendimientos/especialidad, así que no dejes de pasar![/b]

Te pedimos que pases por este thread: [post={4}]. Ahí te vamos a brindar todo tipo de asesoramiento para optimizar su entrenamiento y mejorar tus inferiores.

En el mismo, tenes que indicarnos:
- Habilidades del jugador
- El entrenamiento actual (primario y secundario) y si el jugador es prioridad.
- Los comentarios del cazatalentos
- ¿Cuál es tu intención para con el jugador una vez promocionado? venderlo o entrenarlo?

Muchas gracias por tu tiempo, la única manera de que no se nos escape ninguna promesa para la selección Argentina es con la ayuda de managers como vos.

Si decidís no pasar, nos serviría saber el motivo para modificar lo que sea necesario. Lo mismo si no queres recibir mas mails como este, nos avisas y te anotamos en la lista negra.

Suerte!`];
const msgs = [
	chrome.i18n.getMessage('normal'), 
	chrome.i18n.getMessage('bestNoFriendly'), 
	chrome.i18n.getMessage('bestNoLeague'),
	chrome.i18n.getMessage('bestNormal')
];
let buttons;
let thread;

let player;
const mailBody = document.querySelector('#ctl00_ctl00_CPContent_CPMain_ucEditorMain_txtBody');
const mailSubject = document.querySelector('#ctl00_ctl00_CPContent_CPMain_tbSubject');
const table = document.querySelector('div.info > table.form, div.infor > table.thin');
const container = document.createElement('DIV');
const threadSpan = document.createElement('SPAN');

const run = function() {
	if(!player) {
		return;
	}
	mailSubject.value = subject.replace(':playerName', player.name);
	container.className = 'pasteMailContainer';
	hide(container);
	createThreadSpan();
    buttons = msgs.map((message, index) => createButton(message, index));

	let sendMailButton = document.querySelector('#ctl00_ctl00_CPContent_CPMain_btnSendNew');
	sendMailButton.addEventListener('click', () => clearPlayer());
};

const createThreadSpan = function() {
	threadSpan.innerHTML = '&nbsp;';
	threadSpan.id = 'threadSpan';
	threadSpan.title = 'id';
	let row = document.createElement('TR');
	row.appendChild(document.createElement('TD'));
	let td = document.createElement('TD');
	row.appendChild(td);
	td.appendChild(threadSpan);
	table.appendChild(row);
}

const hide = function(elm) {
	elm.style.visibility = 'hidden';
}

const show = function(elm) {
	elm.style.visibility = 'visible';
}

const sendMailAction = function(index) {
	if(!thread || !bodies[index]) {
		return;
	}
	mailBody.value = bodies[index].normalize().replace('{0}', player.name).replace('{1}', '[youthplayerid=' + player.id + ']').replace('{4}', threadSpan.title);
};

const createButton = function(message, index) {
	let button = document.createElement('A');
	hide(button);
	button.attributes.role = 'button';
	button.title = message;
	button.className = 'pasteMailButton';
	button.id = 'template' + (index + 1);
	button.innerHTML = '<img alt="' + message + '" src="/Img/Icons/transparent.gif">';
	container.appendChild(button);
	mailBody.parentNode.insertBefore(container, mailBody);
	button.addEventListener('click', () => sendMailAction(index));
    return button;
};

const clearPlayer = function() {
	chrome.storage.local.set({"player": null}, ()  => {});
};

chrome.storage.local.get(['player'], result => {
	player = result.player;
	run();
});

chrome.storage.local.get(['thread'], result => {
	thread = result.thread;
	let splitted = thread.split('.');
	fetch('/Forum/Read.aspx?t=' + splitted[0] + '&n=' + splitted[1] + '&v4')
		.then(response => response.text())
		.then(text => {
			let parser = new DOMParser();
		    let htmlDocument = parser.parseFromString(text, "text/html");
			let result = htmlDocument.querySelectorAll('div.mainConf > div.boxHead > h2 > span.float_left > a[href*="/Forum/Read.aspx"]');
			threadSpan.title = thread;
			
			for(title of result) {
				if(title.innerText.indexOf('Sub17') !== -1) {
					threadSpan.innerText = title.innerText;
					break;
				}
			}
			if(threadSpan.innerHTML === '&nbsp;') {
				threadSpan.innerText = chrome.i18n.getMessage('threadNotFound');
			}
			for(button of buttons) {
				show(button);
			}
			show(container);
		})
		.catch(err => console.log(err));
});