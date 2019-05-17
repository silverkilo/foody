## Foody: Yelp Meets Tinder

Foody is a progressive web app that is a cross between tinder and yelp, where nearby people with similar food preferences could meet up with each other to grab a bite. We have all been in that situation where it’s the middle of the day and you are craving a speific type of food. You text all of your friends and of course everyone is busy. Wouldn’t it be great if you could just connect with someone nearby that also wants the same food as you do, and you can make a new friend? This is the problem that our application Foody solves.
**Our mobile application Foody provides an easy way for users to select what food they are in the mood for and match them with users with similar food preferences.** We implemented tinder-style swiping using the react-spring animation library. Our matching algorithm matches two users have swiped right on each other. Once matched, both users will see a map of all possible food options. We focused a lot of our time making sure that users would have a seamless experience connecting with others. Here are the flow of our app:


### Logging In

Swiping for matches


### Preferences

Swiping for matches


### Matching

Swiping for matches


### Restaurant Selection

This part of the app utilizes Mapbox API and FourSquare API.


## How NoYouChoose Works
* User A and User B see each other's geolocation.
<img src="/assets/images/IMG_1494_2.png" width="35%" height="35%">
* User A picks a 'food circle' - a circle on the map will appear with pins of all the restaurants in that region.
<img src="/assets/images/IMG_1495_2.PNG" width="35%" height="35%">
* User B scrolls through the food options in the 'food circle' that User A defined.
<img src="/assets/images/IMG_1496_2.PNG" width="35%" height="35%">
* User B picks a food spot in that 'food circle'. User A is notified of the food spot chosen by User B.
<img src="/assets/images/IMG_1497_2.PNG" width="35%" height="35%">

## Getting Started
In order to run this app on your device, download [Expo Client](https://itunes.apple.com/us/app/expo-client/id982107779?mt=8).

### Install dependencies and start server
```npm install```
```expo start```

## Tech Used
* [React-Native](https://facebook.github.io/react-native/)
* [Expo.io](https://expo.io/)
* [Socket.io](https://socket.io/)
* [Node.js](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [Yelp Fusion API](https://www.yelp.com/fusion)

