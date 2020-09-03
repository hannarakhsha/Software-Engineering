# NUber RESTful API Project 2
    This is an implementation of a RESTful API in Node for Software Engineering Spring 2019. 
    The goal was to clone UBER API services using AGILE Methodology. 
    
## Project Information 
- Team members consisted of 7
  - Chance, Henry, Krista, Sam, Kyle, Hanna, Alex
- 2x 2 week sprints
- User stories created and maintained using [JIRA](https:/jira.com/)
- Communication in person and on [SLACK](https://slack.com/)
- Tests api call backs using [POSTMAN](https://www.getpostman.com/) 

### Technologies:
- Node.js
- Google Maps API
- MongoDB
- Slack
- Postman
- Webstorm
- Jira
- npm 

### Installation: 
Server can be locally hosted on port 3000 (localhost:3000) 
- ~/NUber/ in your cmd prompt or terminal run the following commands. 
  ```
   npm install
   node server.js 
  ```

### How to test API
#### Post requests
______
```
End Point /admin
Result: add admin with the following fields passed through the body

End Point /admin/driver
Result: add driver with the following fields passed through the body

End Point /admin/rider
Result: add rider with the following fields passed through the body
```

#### Get requests
___
```
End Point: /admin
Result: Returns all admins in the database with the following fields

End point: /admin?name=<Admin Name>
Result: returns information of admin with corresponding name

End point: /admin/driver
Result: Returns all drivers in the database with the following fields

End point: /admin/driver?name=<Driver Name>
Result: returns information of driver with corresponding name

End point: /admin/rider
Result: Returns all riders in the database with the following fields

End point: /admin/rider?name=<Rider Name>
Result: returns information of rider with corresponding name

End Point: /rider/driver?currentLocation=<Rider Location>
Result: returns all drivers within 10  miles

End Point: /rider/driver?currentlocation=<Rider Location>&carType=<Economy or Luxury>
Result: returns all drivers within 10  miles of the specific car type

End Point: /rider/myDriver=<Driver Name>
Result: return information of driver with corresponding name
```

#### Put Requests
____
````
End Point: /admin/<Admin ID>
Result: Update any or all of the following admin fields by passing through the body

End Point: /admin/driver/<Driver ID>
Result: Update any or all of the following driver fields by passing through the body

End Point: /admin/rider/<Rider ID>
Result: Update any or all of the following rider fields by passing through the body

End Point: /driver/<Driver ID>
Result: Update driver availability field by passing through the body

End Point: /driver/rider/<Rider ID>
Result: Cancel rider request field by passing through the body

End Point: /rider/driver/<Driver ID>
Result: Update driver rating field by passing through the body

````
#### Delete requests
_____
````
End Point: /admin
Result: delete admin with id by passing through the body

End Point: /admin/driver
Result: delete a driver with id by passing through the body

End Point: /admin/rider
Result: delete a rider with id by passing through the body
````
