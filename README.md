## Foody: Yelp Meets Tinder
Foody is a progressive web app that is a cross between tinder and yelp, where nearby people with similar food preferences could meet up with each other to grab a bite. We have all been in that situation where it’s the middle of the day and you are craving a specific type of food. You text all of your friends and of course everyone is busy. Wouldn’t it be great if you could just connect with someone nearby that also wants the same food as you do, and you can make a new friend? 

This is the problem that our application Foody solves.

**Our mobile application Foody provides an easy way for users to select what food they are in the mood for and match them with users with similar food preferences.** 

We implemented tinder-style swiping using the react-spring animation library. Our matching algorithm matches two users have swiped right on each other. Once matched, both users will see a map of all possible food options. We focused a lot of our time making sure that users would have a seamless experience connecting with others. 

Here is a demo of the flow of our app:

![Watch the video](https://imgur.com/UUeHubn.png)
![Watch the video](https://imgur.com/VnQC50X.png)
![Watch the video](https://imgur.com/sG3zemD.png)

&nbsp;
## Our App Step by Step

### Logging In
Login, OAuth, Navbar functionality

![Image of login](https://res.cloudinary.com/omarjuice/image/upload/w_250,h_500/v1558130311/foody_pics/login.png)
![Image of Navbar](https://res.cloudinary.com/dpdg4ooge/image/upload/w_250,h_500/v1558382132/navBar.png)

Sign-up Pages

![Image of createAccount](https://res.cloudinary.com/dpdg4ooge/image/upload/w_200,h_450/v1558382132/createAccount.png)
![Image of emailSignup](https://res.cloudinary.com/dpdg4ooge/image/upload/w_200,h_450/v1558382132/emailSignup.png)
![Image of addName](https://res.cloudinary.com/dpdg4ooge/image/upload/w_200,h_450/v1558382132/addName.png)
![Image of welcomePage](https://res.cloudinary.com/dpdg4ooge/image/upload/w_200,h_450/v1558382132/welcomePage.png)


&nbsp;
### Preferences

![Image of preference](https://res.cloudinary.com/omarjuice/image/upload/w_250,h_500/v1558130311/foody_pics/preference.png)

&nbsp;
### Matching
When the user gets to the matching page, Foody would suggest all the users that are nearby with similar food preferences. The swiping cards come in a stack of five, and we implemented our own location based, suggestive, matching algorithm that ranks the list of matchers based on:
  1. The match's geographic proximity to the user.
  2. The similarity of the match's food preferences compared to the user's.
  3. Whether the match has swiped on the user.
  
The user could decide to swipe left (reject) or swipe right (accept) on the matches shown. Once both parties swiped on each other, they are taken to the Restaurant Selection page when they would see a list of nearby restaurants that meet their common food interets.

**Challenges**
For each hungry spirit, we wanted to find others with similar preferences and prioritize them based on location. We originally used geographic coordinates in the database to calculate the distance between the requesting user and all of the other users with matching preferences. The problem with this was that we envisioned Foody to have both a high volume of concurrent users and have a smooth user experience. As you can imagine, repeatedly calculating the relative distance of thousands of users is not very performant, leading to quite a laggy UX and probably a database brought to its knees. 

We made the decision to implement location calculations using the PostGIS database extension, which allows for storage and indexing of spatial data, in this case, geographic coordinates. Because we want users find a buddy as quickly as possible, for a particular user we also prioritize those who have already chosen to match with them. Now our algorithm is very performant, it quickly finds the nearest users who share the same preferences.

![Image of swipe](https://res.cloudinary.com/omarjuice/image/upload/w_250,h_500/v1558130311/foody_pics/swipe.png)
![Image of matched](https://res.cloudinary.com/omarjuice/image/upload/w_250,h_500/v1558130311/foody_pics/matched.png)

&nbsp;
### Restaurant Selection
On this page, the user could swipe through the different restaurant options near the user that meet the user and the user's match's food preferences. Or the user can click on the pin of the venue that is geographically closer, and the correponding restaurant would show up at the center of the screen. 

The user can utilize the chatroom functionality to discuss restaurant choices with the user's match. The chatroom bubble will vibrate if the user get any new messages. The restaurants the user ends up picking would turn green, the user have the option to remove that particular restaurant from his or her chosen restaurant list. Once the user and the user's match pick the same restaurant, the user will be taken to the navigation page.

**Challenges**
- Getting mapbox to show! 
We heavily relied on the React-mapbox-gl and Deck-gl library to render the map, and the layers on top of the map. Since doumentation is limited, we had to go through a lot of trial and error to get the page to render the way we want them to. Our teammate Sasha actually wrote a simple guide for using React-mapbox-gl and Deck-gl on Medium, check it out: https://medium.com/@sashakayola/map-layering-using-mapbox-gl-js-deck-gl-react-ba0ece89aaef

- Managing Loading Sequence
We utilize five different technologies and libraries for the map component, which we use for both the Restaurant Selection and the Navigation page:
  1. Mapbox API for the map, Foursquare API for the venue details.
  2. React-mapbox-gl and Deck-gl libraries for the rendering layers on top of the map.
  3. React-swipe library for the venue display carousel.
  4. React-modal for the chat room and popup boxes.
  5. Socket.io for message communication and storage.
 
Since there are a lot of moving pieces on the same page, another technical issue we had to tackle is to get the app load up in the sequenze we intended it to. We edned up turning a lot of actions into Promises, and moving the location fetcher and match identifier into an earlier stage of the app. Now, when the user is at the preference page, the user's device should propmt a popup window asking for the location of his or her current location. This ensures a smoother user experience.

![Image of map](https://res.cloudinary.com/omarjuice/image/upload/w_200,h_450/v1558130311/foody_pics/map.png)
![Image of mapChat](https://res.cloudinary.com/omarjuice/image/upload/w_200,h_450/v1558130311/foody_pics/mapChat.png)
![Image of checkYes](https://res.cloudinary.com/omarjuice/image/upload/w_200,h_450/v1558130311/foody_pics/checkYes.png)
![Image of resSelected](https://res.cloudinary.com/omarjuice/image/upload/w_200,h_450/v1558130311/foody_pics/resSelected.png)

&nbsp;
### Navigation

The navigation page will navigate the user to his/her chosen restaurant, clicking on the ```HERE``` button would notify the other party that he/she has arrived.

![Image of navigation](https://res.cloudinary.com/omarjuice/image/upload/w_250,h_500/v1558130311/foody_pics/navigation.png)

&nbsp;
### Review

Once the user is done with his/her meal, the user can connect with the user's match on different social media, and leave a review for the other party.

![Image of review](https://res.cloudinary.com/omarjuice/image/upload/w_250,h_500/v1558130311/foody_pics/review.png)

&nbsp;
## Getting Started
In order to run this app on your device, ....

&nbsp;
### Install dependencies and start server
```npm install```
```npm run dev```

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
* [Typy](https://www.npmjs.com/package/typy)

### Other Technologies
* [Sequelize](https://www.npmjs.com/package/sequelize)
* [Progressive-web-app](https://developers.google.com/web/progressive-web-apps/)
* [Socket.io](https://socket.io/)
* [MapBox API](https://docs.mapbox.com/api/)
* [Foursquare API](https://developer.foursquare.com/)
* [PostGIS](https://postgis.net/)
* [OAuth](https://oauth.net/2/)
* [Cloudinary](https://cloudinary.com/)
* [PostgreSQL](https://www.postgresql.org/)

&nbsp;
## Our Team
### Jason Levine
https://github.com/jasonclevine

### Sasha Kayola
https://github.com/sashakayola

### Rhea Rao
https://github.com/rhearao

### Omar Jameer 
https://github.com/omarjuice





