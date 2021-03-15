# Full-stack-multipurpose-app
Author: Tanner Hobbs
## Deployment
  - Deployed to heroku at <https://ths131.herokuapp.com/>
  - login: admin | password: admin

## Technologies
- Backend
  - Fully specified REST backend built with Node.js, Express.js, and MySQL
  
- Frontend
  - Multiple page application created using HTML, CSS, and JavaScript
  
## Features
  - User authentication (login) and logout
  - Events page
    - Table which contains information about events such as day, time, number, etc
    - Can insert events into the table through add events page
  - Add Event page
    - Insert new event into database. Changes reflect on the Events page.
  - Stock page
    - Uses alphavantage API to get stock data for companies available in the dropdown list. Uses AJAX to do a GET request ot the TIME_SERIES_DAILY endpoint of the alphavantage API.
  - Admin page
    - Add users
    - Delete users
    - Update user name/password
    
## Screenshots
Landing Page
![landing_page1](https://user-images.githubusercontent.com/60115853/111186822-62cfe800-8581-11eb-8d1e-c558122e8e97.png)
Login Page
![login_page](https://user-images.githubusercontent.com/60115853/111186906-78dda880-8581-11eb-870a-b2a51d5422fd.png)
Events Page
![events_page](https://user-images.githubusercontent.com/60115853/111186953-85fa9780-8581-11eb-97b4-ebe254bfee00.png)
Add Event Page
![add_event](https://user-images.githubusercontent.com/60115853/111186981-8eeb6900-8581-11eb-9e6d-b5e7084e7a17.png)
Stock Page
![stock_page](https://user-images.githubusercontent.com/60115853/111187023-990d6780-8581-11eb-8ae9-7162e99896ed.png)
Admin Page
![admin_page](https://user-images.githubusercontent.com/60115853/111187092-a9bddd80-8581-11eb-98e0-fe7dbc21be64.png)
