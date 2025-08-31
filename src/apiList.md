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
- POST /request/review/:status/:requestId
- 

- GET /user/connections
- GET /user/requests/received
- GET /user/feed = gets profile of other users
-pagination
/feed?page=1&limit=10 - skip(0) limit(10)
/feed?page=2&limit=10 - skip(10) limit(10)

- Status - ignore, interested, accepted, rejected

