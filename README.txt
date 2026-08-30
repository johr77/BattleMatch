Battle Match — localhost
========================

http://localhost:8080/BattleMatch.html

npx --yes serve . -p 8080
  or
python -m http.server 8080

Files
-----
BattleMatch.html   game loop, boards, turns, input
three.min.js       Three.js r160
js/config.js       shared numbers (CELL)
js/sprites.js      charge timer + star labels
js/vehicles.js     tank and plane models
js/camp.js         green camp
js/depot.js        blue tank depot
js/airport.js      red airfield

Edit the building in its js file. Reload the browser. Do not paste the
whole HTML back and forth.

Next likely splits: js/units.js (army men), js/wall.js, js/targets.js
(single-player dummies), js/board.js (match / gravity / fire).
