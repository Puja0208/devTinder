# Dev tinder apis

authRouter
- POST /signup
- POST /login
- POST /logout

profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password - forgot password api

connectRequestRouter
POST  /request/send/:status/:userId - made status dynamic to ocver all status requests
- POST /request/send/interested/:userId
- POST /request/send/ignore/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

- GET /user/connections
- GET /user/requests/received
- GET /user/feed = gets profile of other users

- Status - ignore, interested, accepted, rejected

