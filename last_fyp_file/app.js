const express = require("express");
const bodyParser = require("body-parser");
const { google } = require('googleapis');
const path = require('path');
require("dotenv").config();
const db = require('./utils/database');
const url = require('url');
const morgan = require("morgan");
const cors = require('cors');

const app = express();
const port = 5005;
app.use(morgan("dev"))
app.use(cors());

app.use(bodyParser.json());
app.use(express.static("uploads"));

// Corrected require paths and variable names
const dashboardRoute = require("./routes/dashboarddatabase");

// Using the appropriate variables for each route
app.use("/dashboarddatabase", dashboardRoute);

// Serving static files
app.use(express.static("public"));

// Provide the required configuration
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;

// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({ version: "v3" });

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

// Function to insert event to Google Calendar
const insertEvent = async (event, orderId) => {
  try {
      let response = await calendar.events.insert({
          auth: auth,
          calendarId: calendarId,
          resource: event
      });

      if (response.status == 200 && response.statusText === 'OK') {
          const eventId = response.data.id;
          console.log(eventId);

          
          
           // Insert eventId into the database
           const query = `UPDATE ordertable SET event_id = '${eventId}' WHERE order_id = ${orderId}`;
           

           db.query(query, (err, results) => {
               if (err) {
                   console.error('Error inserting event ID into database:', err);
                   return;
               }
               console.log('Event ID inserted into database:', results.insertId);
           });

          return eventId;
      } else {
          return 0;
      }
  } catch (error) {
      console.log(`Error at insertEvent --> ${error}`);
      return 0; 
  }
};


// Function to delete event from Google Calendar
const deleteEvent = async (eventId) => {
    try {
        let response = await calendar.events.delete({
            auth: auth,
            calendarId: calendarId,
            eventId: eventId
        });

        if (response.status == 204) {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error at deleteEvent --> ${error}`);
        return 0;
    }
};


// Route to handle form submission
app.post('/submit-eta', async (req, res) => {
  const { eta, arrivalTimeStart, arrivalTimeEnd, summary, description ,orderId} = req.body;

  const event = {
      summary: summary || 'No Summary',
      description: description || 'No Description',
      start: {
          dateTime: `${eta}T${arrivalTimeStart}:00`,
          timeZone: 'Asia/Kuala_Lumpur'
      },
      end: {
          dateTime: `${eta}T${arrivalTimeEnd}:00`,
          timeZone: 'Asia/Kuala_Lumpur'
      }
  };

  
  console.log('URL: ', orderId);
  const result = await insertEvent(event, orderId);

  if (result) {
      res.send('Event successfully added to Google Calendar!');
  } else {
      res.send('There was an error adding the event to Google Calendar.');
  }
});

// Route to handle delete request
app.post('/delete-event', async (req, res) => {
    const { eventId } = req.body;
    console.log('Testing for event id: ', eventId);

    const result = await deleteEvent(eventId);

    if (result) {
        res.send('Event successfully deleted from Google Calendar!');
    } else {
        res.send('There was an error deleting the event from Google Calendar.');
    }
});


// Starting the server
app.listen(port, () => {
  console.log(`Server successful, listening on port ${port}`);
});
