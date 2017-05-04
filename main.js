var API_KEY = 'piss off';
var audioArray = ["Ana - A Vintage Performance.mp3",
					"Ana - I Don't Do Speeches.mp3",
					"Ana - I Think Justice Could Use A Little Nap.mp3",
					"Announcer - Play Of The Game.mp3",
					"D.VA - GG, GG, Baybe Baybe.mp3",
					"D.VA - Play Of The Game.mp3",
					"D.VA - Thanks For The Love.mp3",
					"Hanzo - Sake!.mp3",
					"Junkrat - I Won, I Won, What Did I Win.mp3",
					"Lúcio - Can't Stop, Won't Stop.mp3"];



var eventQueue = [];

var ws = io('https://ws.streamjar.tv/overlay', {query: 'key='+API_KEY});
ws.on('connect', function() {
	console.log('Connected.');
	});
ws.on('error', function(){
	console.error('ERROR: Can\'t connect to WS.');
})
ws.on('disconnect', function(){
	console.error('Disconnected from Streamjar.');
});

// Host Event
ws.on('host',function(data){
	console.log(data.name + ' just hosted the stream.');
	handleEvent(data, 'host');
});

// Follow Event
ws.on('follow', function(data) {
	console.log(data.name + ' just followed the stream.');
	handleEvent(data, 'follow');
});

function handleEvent(data, eventType){
	eventQueue.push({'type': eventType, 'avatar': data.avatar});
	if (eventQueue.length == 1) processQueue();

	var xhr = new XMLHttpRequest();
	xhr.open('get', data.avatar, true);
	xhr.onload = function() {
		if(this.status >= 200 && this.status < 400){
			eventQueue.push({'type': eventType, 'avatar': data.avatar});
			if (eventQueue.length == 1) processQueue();
		}
	}
}

function processQueue(){
	if (eventQueue.length > 0) displayPopup(eventQueue[0]);
}

function displayPopup(eventItem){
	console.log('============');
	console.log(eventItem);
	var avatar = document.createElement('IMG');
	avatar.id = 'avatar';
	avatar.src = eventItem.avatar;
	avatar.className = 'hexagon';
	var text = document.createElement('DIV');
	text.id = 'text';
	var audio = document.createElement('AUDIO');
	audio.autoplay = true;
	audio.volume = 0.7;
	audio.src = './audio/' + audioArray[Math.floor(Math.random()*audioArray.length)];
	audio.onended = function(){
		audio.remove();
	}

	switch(eventItem.type){
		case 'follow':
			text.innerHTML = '✌FOLLOW❕';
			break;
		case 'host':
			text.innerHTML = '📹HOST❕';
	}
	document.body.appendChild(avatar);
	document.body.appendChild(text);
	document.body.appendChild(audio);
	setTimeout(function () {
		avatar.remove();
		text.remove();
		eventQueue.shift();
		processQueue();
    }, 4000);
}