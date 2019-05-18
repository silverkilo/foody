## Foody: Yelp Meets Tinder
Foody is a progressive web app that is a cross between tinder and yelp, where nearby people with similar food preferences could meet up with each other to grab a bite. We have all been in that situation where it’s the middle of the day and you are craving a speific type of food. You text all of your friends and of course everyone is busy. Wouldn’t it be great if you could just connect with someone nearby that also wants the same food as you do, and you can make a new friend? 

This is the problem that our application Foody solves.

**Our mobile application Foody provides an easy way for users to select what food they are in the mood for and match them with users with similar food preferences.** 

We implemented tinder-style swiping using the react-spring animation library. Our matching algorithm matches two users have swiped right on each other. Once matched, both users will see a map of all possible food options. We focused a lot of our time making sure that users would have a seamless experience connecting with others. 

Here are the flow of our app:

&nbsp;

### Logging In
Login, OAuth, Signup functionality

![Image of login](https://res.cloudinary.com/omarjuice/image/upload/w_250,h_500/v1558130311/foody_pics/login.png)

&nbsp;
### Preferences

![Image of preference](https://res.cloudinary.com/omarjuice/image/upload/w_250,h_500/v1558130311/foody_pics/preference.png)

&nbsp;
### Matching
We wanted a location based, suggestive, matching algorithm. For each hungry spirit, we wanted to find others with similar preferences and prioritize them based on location. We originally used geographic coordinates in the database to calculate the distance between the requesting user and all of the other users with matching preferences. The problem with this was that we envisioned Foody to have both a high volume of concurrent users and have a smooth user experience. As you can imagine, repeatedly calculating the relative distance of thousands of users is not very performant, leading to quite a laggy UX and probably a database brought to its knees. We made the decision to implement location calculations using the PostGIS database extension, which allows for storage and indexing of spatial data, in this case, geographic coordinates. Because we want users find a buddy as quickly as possible, for a particular user we also prioritize those who have already chosen to match with them. Now our algorithm is very performant, it quickly finds the nearest users who share the same preferences.

![Image of swipe](https://res.cloudinary.com/omarjuice/image/upload/w_250,h_500/v1558130311/foody_pics/swipe.png)
![Image of matched](https://res.cloudinary.com/omarjuice/image/upload/w_250,h_500/v1558130311/foody_pics/matched.png)

&nbsp;
### Restaurant Selection
This part of the app utilizes Mapbox API and FourSquare API.

![Image of map](https://res.cloudinary.com/omarjuice/image/upload/w_250,h_500/v1558130311/foody_pics/map.png)
![Image of mapChat](https://res.cloudinary.com/omarjuice/image/upload/w_250,h_500/v1558130311/foody_pics/mapChat.png)


![Image of checkYes](https://res.cloudinary.com/omarjuice/image/upload/w_250,h_500/v1558130311/foody_pics/checkYes.png)
![Image of resSelected](https://res.cloudinary.com/omarjuice/image/upload/w_250,h_500/v1558130311/foody_pics/resSelected.png)

&nbsp;
### Navigation

![Image of navigation](https://res.cloudinary.com/omarjuice/image/upload/w_250,h_500/v1558130311/foody_pics/navigation.png)

&nbsp;
### Review
![Image of review](https://res.cloudinary.com/omarjuice/image/upload/w_250,h_500/v1558130311/foody_pics/review.png)

&nbsp;
## Getting Started
In order to run this app on your device, ....

&nbsp;
### Install dependencies and start server
```npm install```
```expo start```

&nbsp;
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



