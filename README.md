# Beam-Alert-Overlay
An alert overlay using streamjar websockets for beam.pro.

This is a base template meant to be modified for individual use. It will not work out of the box as it at least requires a streamjar account and a personal streamjar API key from said account.

Install: <br>
1. Download this folder to your desktop. <br>
2. Go to alerts/js/main.js. <br>
3. Put in your streamjar key and beam.pro user id. <br>
4. Go to alerts/overlay.html and open it. <br>
5. Customize the three messages that appear there. <br>
6. You're now technically good to go! Load this up in your OBS/Xsplit browser plugin.

Customization:  <br>
- Colors: You currently need to know CSS to change the colors. If enough people want the overlay I can make this easier later.
- Sounds: You can customize sounds by overwriting the related sound in the sound folder. For example, just overwrite the follow.ogg file with your own to replace the follow sound. It is recommended that the "followDelay" setting in alerts/js/main.js is set to a longer length of time than your longest sound.

