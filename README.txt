Battle Match — localhost
========================

http://localhost:8080/BattleMatch.html

npx --yes serve . -p 8080
  or
python -m http.server 8080

Title screen should say: Build: split-js

Files
-----
BattleMatch.html     shell: turns, input, shots, menus
three.min.js         Three.js r160
js/config.js         shared numbers
js/sprites.js        charge timer + stars
js/vehicles.js       tank / plane models
js/units.js          army men
js/wall.js           barrier mesh
js/camp.js           green camp
js/depot.js          blue tank depot
js/airport.js        red airfield
js/targets.js        single-player dummies
js/board.js          match, gravity, lock, fire

Edit the js file for that piece. Reload the browser.
