// Streamjar user API key
// Get this from your streamjar account.
var sjKey = '';

// Global Settings
messageDelay = 10000; // How long to show donation messages.
followDelay = 5000; // How long to show follow alert.
eventsToShow = 3; // Number of events to show in the event list.
timer = 6000; // How long to show each timed message.
numMessages = 3; // Number of timed messages.
timeBetweenMessages = 900000; // How often do you want to trigger the timed messages. 900000 = 15 minutes
friends = ["DrackmelKress", "Lagby", "Rocketbear", "Ocravn", "WolfStar76", "DreadGazeebo", "Nosferatu1208", "BigHossenfeffer", "Mushious", "Xvaliance", "Favorlock", "Phantomlover", "Queen_Liz", "BasicallyToast", "JDubb", "Telroa", "ThePixelQuest", "DreadPixie"]; // List of friends you want to support.

// Connect to Streamjar Websocket
var sock = io('https://ws.streamjar.tv/overlay', { query: 'key='+sjKey });
sock.on('connect', function() {
	console.log('Connected to Streamjar.');
	connectedPopup();
});
sock.on('error', function(){
	console.error('ERROR: Can\t connect to WS.');
	errorPopup();
})
sock.on('disconnect', function(){
	console.error('Disconnected from Streamjar.');
	disconnectedPopup();
});

// Event Queue
// This is where all events are stored until the program gets around to displaying the alerts.
followQueue = [];
tipQueue = [];
subQueue = [];
gamewispQueue = [];

// Donation Event
sock.on('donation', function(data) {
	console.log(data.name + ' just donated to the stream.');
	tipQueue.push(data);
});

// Follow Event
sock.on('follow', function(data) {
	console.log(data.name + ' just followed the stream.');
	followQueue.push(data);
});

// Subscribe Event
sock.on('subscribe', function(data) {
	console.log(data.name + ' just subscribed to the stream.');
	subQueue.push(data);
});

// Gamewisp Subscribe Event
sock.on('gamewisp-subscribe', function(data) {
	console.log(data.username + ' just subscribed to the stream through gamewisp.');
	gamewispQueue.push(data);
});

// Gamewisp Re-Subscribe Event
sock.on('gamewisp-resubscribe', function(data) {
	console.log(data.username + ' just re-subscribed to the stream through gamewisp.');
	gamewispQueue.push(data);
});

// Queue Checker
function queueChecker(){
	
	if (subQueue.length){
		subscriberAlert(subQueue[0]);
		subQueue.splice( $.inArray(subQueue[0],subQueue) ,1 );
		
	} else if (gamewispQueue.length){
		gamewispSubscribe(gamewispQueue[0]);
		gamewispQueue.splice( $.inArray(gamewispQueue[0],gamewispQueue) ,1 );
		
	} else if (tipQueue.length){
		donationAlert(tipQueue[0]);
		tipQueue.splice( $.inArray(tipQueue[0],tipQueue) ,1 );
		
	} else if (followQueue.length){
		followerAlert(followQueue[0]);
		followQueue.splice( $.inArray(followQueue[0],followQueue) ,1 );
	}
}


// Connected Popup
function connectedPopup(){
	$('.wrapper').prepend('<div class="error" style="display:none;">Connected to Streamjar.</div>');
	$('.error').fadeIn("slow", function(){
		$('.error').delay(5000).fadeOut("slow", function(){
			$(this).remove();
		});
	});
}

// Error Popup
function errorPopup(){
	// Only show error message if it is not already on the page. This prevents spamming.
	if( $('.error').length < 1 ){
		$('.wrapper').prepend('<div class="error" style="display:none;">Error: Can\'t connect to Websocket.</div>');
		$('.error').fadeIn("slow", function(){
			$('.error').delay(5000).fadeOut("slow", function(){
				$(this).remove();
			});
		});
	}
}

// Disconnected Popup
function disconnectedPopup(){
	// Only show error message if it is not already on the page. This prevents spamming.
	if( $('.error').length < 1 ){
		$('.wrapper').prepend('<div class="error" style="display:none;">Disconnected from Streamjar. Reconnecting...</div>');
		$('.error').fadeIn("slow", function(){
			$('.error').delay(5000).fadeOut("slow", function(){
				$(this).remove();
			});
		});
	}
}

// Donation Alert
function donationAlert(data){
	var username = data.name;
	var amount = data.amount;
	var convertedAmount = toUSD(amount);
	var message = data.message;
	var avatar = data.avatar;

	$('.alert').prepend('<div class="donation"><span class="alert-name">'+username+'</span> - <span class="alert-text">'+convertedAmount+'</span></div>')

	
	$('.donation-message').animate({
		'bottom':'300px'
	}, 500);

	$('.donation-message span').empty().text(username+' says, \"'+message+'\"');
	playSound('tip');
	
	// Hide the slider at end of animation.
	setTimeout(function(){
		$('.donation-message').animate({
			'bottom':'-300px'
		}, 500);
	}, messageDelay);
	
	animate();
	trimList();
}

// Follower Alert
function followerAlert(data){
	var username = data.name;
	var avatar = data.avatar;

	$('.alert').prepend('<div class="follow animation-target"><span class="alert-name">'+username+'</span> - <span class="alert-text">FOLLOW</span></div>');

	$('.alert-message').animate({
		'bottom':'400px'
	}, 500);

	$('.alert-message span').empty().text(username+' followed!');
	
	// Hide the slider at end of animation.
	setTimeout(function(){
		$('.alert-message').animate({
			'bottom':'-400px'
		}, 500);
	}, followDelay);	
	
	playSound('follower');
	animate();
	trimList();
}

// Subscriber Alert
function subscriberAlert(data){
	var username = data.name;
	var avatar = data.avatar;

	$('.alert').prepend('<div class="subscriber"><span class="alert-name">'+username+'</span> - <span class="alert-text">SUB</span></div>');
	$('.alert-message').animate({
		'bottom':'400px'
	}, 500);

	$('.alert-message span').empty().text(username+' subscribed!');
	
	// Hide the slider at end of animation.
	setTimeout(function(){
		$('.alert-message').animate({
			'bottom':'-400px'
		}, 500);
	}, messageDelay);	
	
	playSound('sub');
	animate();
	trimList();
}

// Gamewisp Subscriber
function gamewispSubscribe(data){
	var username = data.username;
	var tierCost = data.tier_cost;
	var tierName = data.tier_name;
	var duration = data.duration;
	var avatar = data.avatar;
	// If they've been subscribed for more than a month...
	if (duration > 1){
		$('.alert').prepend('<div class="gw-subscriber"><span class="alert-name">'+username+'</span> - <span class="alert-text">SUB x'+duration+' ('+tierName+')</span></div>');
		$('.alert-message').animate({
			'bottom':'400px'
		}, 500);

		$('.alert-message span').empty().text(username+' re-subbed via Gamewisp for '+duration+' months!');
		playSound('resub');
		
		// Hide the slider at end of animation.
		setTimeout(function(){
			$('.alert-message').animate({
				'bottom':'-400px'
			}, 500);
		}, messageDelay);	
	}else{
		$('.alert').prepend('<div class="gw-subscriber"><span class="alert-name">'+username+'</span> - <span class="alert-text">SUB ('+tierName+')</span></div>');
		$('.alert-message').animate({
			'bottom':'400px'
		}, 500);

		$('.alert-message span').empty().text(username+' subbed via Gamewisp!');
		playSound('sub');
		
		// Hide the slider at end of animation.
		setTimeout(function(){
			$('.alert-message').animate({
				'bottom':'-400px'
			}, 500);
		}, messageDelay);	
	}
	
	animate();
	trimList();
}

// Timed Messages
function timedMessages(timer){
	// Calculate time to complete animation and pick a random friend
	var completeTimer = timer*numMessages;
	var friendpick = friends[Math.floor(Math.random()*friends.length)];

	// Show the messages
	$('.friend').text(friendpick);
	$('.timed-messages').slick('slickGoTo', 0);
	$('.timed-messages').animate({
		'top':'10px'
	}, 500);

	// Hide the slider at end of animation.
	setTimeout(function(){
		$('.timed-messages').animate({
			'top':'-200px'
		}, 500);
	}, completeTimer);
}

////////////////////
// Helper Functions
///////////////////

// Convert number to USD
function toUSD(number) {
    var number = number.toString(),
    dollars = number.split('.')[0],
    cents = (number.split('.')[1] || '') +'00';
    dollars = dollars.split('').reverse().join('')
        .replace(/(\d{3}(?!$))/g, '$1,')
        .split('').reverse().join('');
    return '$' + dollars + '.' + cents.slice(0, 2);
}

// Trim Event List
function trimList(){
	$('.alert div').slice(eventsToShow).remove();
}

// Animate Event List
function animate(){
	$('.alert div').slideDown();
}

// Play Sound
function playSound(soundType){
	var followerSounds = ['darkest_follow_01','darkest_follow_02','darkest_follow_03','darkest_follow_04','darkest_follow_05','darkest_follow_06','darkest_follow_07','darkest_follow_08','darkest_follow_09','darkest_follow_10','darkest_follow_11'];
	var resubscribeSounds = ['darkest_resub_01','darkest_resub_02','darkest_resub_03','darkest_resub_04'];
	var subscribeSounds = ['darkest_subscriber_01','darkest_subscriber_02','darkest_subscriber_03'];
	var tipSounds = ['darkest_tip_01','darkest_tip_01','darkest_tip_01','darkest_tip_01','darkest_tip_01','darkest_tip_bonus_A','darkest_tip_bonus_B'];
	
	if(soundType == "follower"){
		var chosenOne = followerSounds[Math.floor(Math.random()*followerSounds.length)];
		$('.audio-wrap').empty();
		var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', './sound/'+chosenOne+'.mp3');
        audioElement.setAttribute('autoplay', 'autoplay');
		audioElement.load();
		
	} else if (soundType == "resub"){
		var chosenOne = resubscribeSounds[Math.floor(Math.random()*resubscribeSounds.length)];
		$('.audio-wrap').empty();
		var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', './sound/'+chosenOne+'.mp3');
        audioElement.setAttribute('autoplay', 'autoplay');
		audioElement.load();
		
	} else if (soundType == "sub"){
		var chosenOne = subscribeSounds[Math.floor(Math.random()*subscribeSounds.length)];
		$('.audio-wrap').empty();
		var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', './sound/'+chosenOne+'.mp3');
        audioElement.setAttribute('autoplay', 'autoplay');
		audioElement.load();
		
	} else if (soundType == "tip"){
		var chosenOne = tipSounds[Math.floor(Math.random()*tipSounds.length)];
		$('.audio-wrap').empty();
		var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', './sound/'+chosenOne+'.mp3');
        audioElement.setAttribute('autoplay', 'autoplay');
		audioElement.load();
	}
	
}



/////////////////
// Document Ready
/////////////////

$( document ).ready(function() {
	// Start up the slider
	$('.timed-messages').slick({
		arrows: false,
		autoplay: true,
		autoplaySpeed: timer
	});
	setInterval(function(){
		timedMessages(timer);
	}, timeBetweenMessages);
	setInterval(function(){
		queueChecker();
	}, messageDelay + 1000);
	
});
