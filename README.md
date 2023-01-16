# Velocity Tracker

a system-agnostic module that allows players to track velocities for a number of characters/vehicles/etc for systems and settings in which velocity is an important factor

## Settings
![alt text](https://github.com/dmdorman/foundryvtt-velocity-tracker/blob/main/images/settings.PNG?raw=true)

"Allow GM to see all velocity trackers?" : On by default, this option allows GMs to see velocity trackers defined by the players. However, this is not a live feed to players' velocity trackers. To see updates on the players' velocity trackers close and re-open the velocity tracker.

"Distance Units" / "Time Units" : what are the units of the system your're using? Velocity will be shown as "Distnace Unit / Time Unit". Acceleration will be shown as "Distance Unit / Time Unit ^2)

"How long is one round?" : how long is a round in the system you're using? (ex: 6(s) in D&D, 1(s) in GURPS)

"Default acceleration": some systems have default acceleration defined in the rules. If the system you are using does not it is safe to leave this a 0

## Using Velocity Tracker
![alt text](https://github.com/dmdorman/foundryvtt-velocity-tracker/blob/main/images/how-to-open.PNG?raw=true) 

For both GMs and Players, to open Velocity Tracker click the 'Right Arrow' icon on the left hand side of the screen.

A windows should pop up like the image below. This is the Velocity Tracker List.
![alt text](https://github.com/dmdorman/foundryvtt-velocity-tracker/blob/main/images/velocity-tracker-gm-view.PNG?raw=true)

### Buttons
'+ Add Velocity Tracker' - adds a Velocity Tracker to the Velocity Tracker List, this will show up as a new row populated with Velocity Tracker defaults

'Trash Can' - this will delete the corresponding Velocity Tracker

'Right Arrow' - this progresses time and calculates velocity

### Fields
name - the name of whatever it is you want to track

max. vel. (maximum velocity) - how fast can your character/vehicle/etc go? Also useful for setting a terminal velocity for falling objects

accel. (acceleration) - how fast can your character/vehicle/etc get up to max velocity? This is heavily correlated with total time, so depending on what you're tracking you may want to set 'total time' to 0 whenever acceleration changes or start a new Velocity Tracker

total time - how much time has passed since movement began? This is heavily correlated with acceleration. Total time will increase by the amount set in 'timing' when the right arrow on the right hand side for the associated Velocity Tracker is clicked

timing
  - how long is a round? For example D&D has 6 second rounds so in this case put "6" for timing.
  OR 
  - how many actions does a character/vehicle/etc have in a timeframe? In some systems not all characters act at same time. In that case put (# of actions) / (# how       long is a full round). For example a character who acts 3 times in a 12 second round should put "3/12" for timing.

dist. moved (distance moved) - how far did the character/vehicle/etc move this turn/over the course of the time defined in 'timing'?

vel. (velocity) - velocity will be determined by all the other fields and will update once the 'Right Arrow' is clicked however it can be edited

### GM view

If "Allow GM to see all velocity trackers?" was enabled a GM will see something similar to the image below when they open up their Velocity Tracker List. The Velocity Tracker fields for another players' Velocity Tracker is not editable. However, the GM can delete other players' Velocity Trackers. 

![alt text](https://github.com/dmdorman/foundryvtt-velocity-tracker/blob/main/images/velocity-tracker.PNG?raw=true)
