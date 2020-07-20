# spot.me

project using Spotify API for song and playlist recommendations
https://root2point0.github.io/spot.me/

### Intro and User Stories
My best friend Tommy has been drawing for years, and in the past few he's made an instagram account for his work, @spiritualcardboard which has been continuously gaining followers. He's constantly receiving DMs from people hoping to buy one of his prints, so he set up a basic shopify account. I love him to death but the site was a ruddy green which made its dark text hard to read, poorly aligned, and not optimized for the user experience (including a screenshot below). I decided to take a crack at remaking it, adding my code to the pre-existing shopify site.

<img src="/public/pics/old_site.png" width="350" />  ->  <img src="/public/pics/new_site.png" width="350"/>

### Approach
My two main goals in remaking Tommy's website were to keep the display light and minimal as well as focusing on having the site echo his instagram feed, since that's where the majority of users would be redirected from.

<img src="/public/pics/wireframe1.png" width="370" /> <img src="/public/pics/wireframe2.png" width="370"/>

### Implemented Using
Node.js, Express, Mongoose/MongoDB, EJS, Bootstrap

### Next Steps
I would love to migrate this site over to react for client-side rendering, but initially built it using the above technologies to practice with a full-CRUD app on mongoose and express. 
One issue that I'd love to find a workaround for is that, in the mongoose database, multiple copies for the same print are delete when you try to remove just one from the cart. I am not worried about this from a technical standpoint because I was just implementing cart functionality on my heroku site to mimick the UX on a working print store, but the real shopify site has its own code in place for the cart, which I won't mess with when we make it live. As an exercise I'd also love for the addition of a second print to update the quantity in the cart instead of relisting the entire print (- 2 +). I am also having some interesting formatting issues based on varying display sizes with the Cardboard Captions widget that I would love to tackle.

As of now, I'm able to query three musical artists from the user and grab data including genres and pictures, from the Spotify API. Those artist ids and any common genres are used as seeds, along with a few questions the user answers, that are fed into a second endpoint to generate a personalized playlist. Each time the page is page is refreshed, a new token is checkout out through an ajax call, gauranteeing that it will never expire during a session. Local storage has been implemented to keep track of and display the last three playlists the user has generated along with the artists the songs are seeded from. 
Potential next steps would be to look into adding a spotify web player that would have the most recently generated playlist pre-loaded for easy in-browser listening.
