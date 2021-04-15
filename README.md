### Smart Ticket Back-end Server

#### Initialization

> $ cd config
> $ cp default.js local.js

open local.js set up the environment to overide default.js
- DB - host, user, password, and database
- STATIC_SERVER_URL ( http://xxx.xxx.xxx.xxx:3001  <-  your ip address)
- TICKET_VERIFY_URL ( http://xxx.xxx.xxx.xxx:3002 )
- BLOCKCHAIN_BASE_URL ( http://xxx.xxx.xxx.xxx:4001/ )

> $ npm run init

#### Development

Start Server:

> $ npm run dev

Start AMS

#### AMS

> $ npm run dev:client

PORT may not = localhost:3002 , it depends on the AMS port
you can go to http://localhost:3002/admin/login
