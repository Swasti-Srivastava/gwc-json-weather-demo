Weather Dashboard ☀️

This is the finished version of the weather dashboard we’re building for our Girls Who Code JSON workshop!

The website lets you search for a city and state in the US and see what the weather is like there using real weather data.

What it does

* Lets you search for different cities and states
* Shows the temperature, humidity, and wind speed
* Gives you a quick description of the weather
* Gets real weather data using the Open-Meteo API

What’s in here?

* index.html — Everything you see on the webpage
* style.css — Makes the website look nice
* script.js — Gets the weather data and puts it on the page
* weather.json — An example of what JSON looks like

How to run it

1. Download the files and open the folder in VS Code.
2. Open index.html in your browser.
3. Search for a city, choose a state, and see what the weather is like!

How does it work?

When you search for a city, the website first finds its coordinates (latitude and longitude).

It then sends those coordinates to the Open-Meteo weather API, which sends back weather information in JSON format.

Our JavaScript reads that JSON and picks out the information we want to show on the website.

That’s pretty much it!

We’re using Open-Meteo for the weather data, and no API key is needed.
