# pentreviewsystem

## An app to submit feedback 

Pent is a hypothetical platform where users can sign up with their basic information and post reviews about apartments they have previously lived in. These reviews can include optional video, audio and/or image. The users can give reviews about the landlords, the environment the apartment is situated, and the quality of amenities in the apartment. These reviews can be uniquely marked as helpful by random visitors of the platform. Visitors can also sort these reviews based on the most helpful(by count) or most recent

## Getting Started

This application uses Node.js and MongoDB. You can follow the instruction to get a copy of the project up and running on your local machine.

### Prerequisites

You should install Node.js and MongoDB.

### Installation

Firstly, you should install the dependecies using the following command.

````
npm install
````

The next thing is to set up the environment variables. See the .env.example file for the needed environment variable for this application.

### How to run the application?

Simply use either of the following command.

````
npm start
````

OR 

````
npm run dev
````

Bingo! This application is accessible at the desired port.

### Available Routes

```
/api/user/register - Register a user on the platform
/api/user/login - User login
/api/user/getall - Gets all user available on the platform
/api/user/getone - Gets a single user
/api/review/create - User can create review
/api/review/all - Users/viewers can get all reviews
/api/review/:id - USers/viewers can get single review
/api/review/getreviews?limit=2 - Users/viewers can get latest reviews
/api/review/viewersremark - Viewers can mark a review as helpful
/api/review/getreviews?helpful=true&limit=1 - Users/Viewers can get reviews based on'Marked as Helpful'
```



Live link: https://pentreviewsystem.herokuapp.com/
Go to : 
https://documenter.getpostman.com/view/17832863/VUqpudL9

To see how the different application endpoints are implemented.

Danke.
