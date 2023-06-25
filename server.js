const express = require('express');
const app = express();
const googleCalendarRouter = require('./googleCalendar');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/rest/v1/calendar', googleCalendarRouter);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
