Battle Match
============

Play: open BattleMatch.html in a browser, or:

  npx --yes serve . -p 8080

Then go to http://localhost:8080/BattleMatch.html

Files
-----
BattleMatch.html     game (camera, boards, raids, environment)
three.min.js         Three.js r160
js/                  unit / camp / vehicle helpers
3d/militaryfence.glb converted fence used in-game
environment/*.glb    trees, rocks, bushes (off the playing field)
environment/grass.jpg, sky.jpg
environment/Grass, Sky, Trees   original source assets

Controls
--------
Hold a unit to drag, release to drop.
Double-click a unit to delete (confirm popup).
Right-click drag = look around. Scroll = zoom.
Left-click while looking = snap camera home.
Camps firing use a follow camera.
