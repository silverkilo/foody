## Foody: Yelp Meets Tinder

Foody is a progressive web app that is a cross between tinder and yelp, where nearby people with similar food preferences could meet up with each other to grab a bite. We have all been in that situation where it’s the middle of the day and you are craving a speific type of food. You text all of your friends and of course everyone is busy. Wouldn’t it be great if you could just connect with someone nearby that also wants the same food as you do, and you can make a new friend? 

This is the problem that our application Foody solves.

**Our mobile application Foody provides an easy way for users to select what food they are in the mood for and match them with users with similar food preferences.** 

We implemented tinder-style swiping using the react-spring animation library. Our matching algorithm matches two users have swiped right on each other. Once matched, both users will see a map of all possible food options. We focused a lot of our time making sure that users would have a seamless experience connecting with others. 

Here are the flow of our app:


### Logging In

Swiping for matches
* User A and User B see each other's geolocation.
<img src="/assets/images/IMG_1494_2.png" width="35%" height="35%">


### Preferences

Swiping for matches
* User A picks a 'food circle' - a circle on the map will appear with pins of all the restaurants in that region.
<img src="/assets/images/IMG_1495_2.PNG" width="35%" height="35%">


### Matching

Swiping for matches
* User B scrolls through the food options in the 'food circle' that User A defined.
<img src="/assets/images/IMG_1496_2.PNG" width="35%" height="35%">

### Restaurant Selection

This part of the app utilizes Mapbox API and FourSquare API.
* User B picks a food spot in that 'food circle'. User A is notified of the food spot chosen by User B.
<img src="/assets/images/IMG_1497_2.PNG" width="35%" height="35%">


## Getting Started
In order to run this app on your device, ....

### Install dependencies and start server
```npm install```
```expo start```

## Technology Used

### Language & Runtime Environment
* [JavaScript](https://www.javascript.com/)
* [Node.js](https://nodejs.org/en/)

### Library & Packages Used
* [Express](https://expressjs.com/)
* [React](https://reactjs.org/)
* [Redux](https://redux.js.org/)
* [React-map-gl](https://www.npmjs.com/package/react-map-gl)
* [Deck-gl](https://deck.gl/)
* [React-modal](https://www.npmjs.com/package/react-modal)
* [React-swipe](https://www.npmjs.com/package/react-swipe)
* [React-spring](https://www.react-spring.io/)
* [React-transition-group](https://reactcommunity.org/react-transition-group/)
* [React-use-gesture](https://www.npmjs.com/package/react-with-gesture)

### Other Technologies
* [Sequelize](https://www.npmjs.com/package/sequelize)
* [Progressive-web-app](https://developers.google.com/web/progressive-web-apps/)
* [Socket.io](https://socket.io/)
* [MapBox API](https://docs.mapbox.com/api/)
* [Foursquare API](https://developer.foursquare.com/)
* [PostGIS](https://postgis.net/)



