# APP

Collection
* Root Component
  * Sends open game event to router?
  * Prop = Full Game List
  * Manages displayed games
* Collection Controls (Rules, Sort)
  * TODO vue-portal?
  * Sends filter/sort events to collection
* Selection Controls
  * Sends Set Tag event to collection?
* GameList
  * Displays games
  * Sends selction events to collection
  * Sends open game event to collection
  * -- Game --
    * Different styles
    * Sends open game event to GameList
    * Sends selected to GameList? Maybe just select mode?

GameModal
* Slideshow
* Details