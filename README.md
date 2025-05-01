# Animal Activity: Proof of Technology
- Presenting Animal Health Data Through a Web-Based Dashboard
- A Sheffield Hallam University group project by Group 14-EXT for Elanco
## What this software does
This is a web-based dashboard for visualising and analysing animal health data. This is intended to help users make better and more informed decisions with insights such as those made with scikit learn as well as through graphs and attention brought to unusual data. Additional features such as exporting data are also supported.

---
## How to run locally
### Prerequisites
- Local development computer with a web server installed
- Local development computer with [PHP](https://www.php.net/downloads.php) installed - additional installation instructions are provided later
  - For the above two points it should be noted that we have tried to make this software web-server agnositic so that it can run on wherever it is need, there are lots of options, for example [PHP itself](https://www.php.net/downloads.php) includes a development server, [XAMPP](https://www.apachefriends.org/) bundles [Apache](https://httpd.apache.org/) and PHP together, but these are just a small number of suggestions
- [Python](https://www.python.org/downloads/) installed on the same computer - additional installation instructions are provided later
- Web browser for using the dashboard
- An internet connection to for some JavaScript Libraries (such as Chart.js) to be used via jsdelivr

### Setting PHP and Python as environment variables
#### PHP
If you have already installed and configured PHP, either manually or with something like XAMPP, you can skip the following step.

To manually add PHP on Windows after installing:
  1. Type 'Environment Variables' into the start and click on 'Edit the system environment varaibles' when the option appears
  2. Click 'Environment Variables...'
  3. From 'System Varaibles', click 'PATH', then 'Edit', then 'New'
  4. Type the installation path of your PHP install, typically this is `C:\php` when installed for all users
  5. Click OK, then OK again

To verify your PHP installation, open your terminal and run `php -i`

#### Python
This process is often completed automatically when installing Python (on Windows, usually this can be done in the installation when selected "select the Add Python x.x to PATH"), skip this if you already have Python added as an envronment variable and to your path, regardless of your OS.
To manually add Python as an environment variable and to your path on Windows:
  1. This can be done by referencing the directory of your python installation, commonly these 2 paths by default (replace `[NAME]` with your name as seen in your windows file explorer): 
     - `C:\Users\[NAME]\AppData\Local\Programs\Python\Python313`
     - `C:\Users\[NAME]\AppData\Local\Programs\Python\Python313\Scripts`
  2. Search environment variables in windows search select "Edit the system environment variables" and go within the advanced tab, select "Environment Variables".
  3. Within the system variables, select "Path" and "Edit" then "New", referencing your python and python scripts directories.

### Configure Python
1. Check your python is correctly installed by pasting this into your terminal: `python --version`
2. To install the necessary Python libraries, open your termninal (command prompt, bash, etc.) and run `pip install pandas numpy scikit-learn`

### Running locally
Assuming all of the the prerequisites are fulfilled, follow the following steps to run the software locally
1. Download or clone the contents of the repository, unzip if necessary
   - Ensure the directory structure of the repository is preserved.
2. Make sure the files are in an appropriate location for being deployed with your choice of webserver.
   - For Apache this is typically the 'htdocs' folder, though it can be renamed. It is the default when using XAMPP.
   - To use the PHP Development server, the contents don't have to be in a specific localtion but PHP needs to be installed and configured as an environment varaible.
3. Start your web server
   - XAMPP provides a GUI control panel when you can start Apache to do this
   - For the PHP Developement server, naviagte to the directory containing the index.php file using your terminal (command prompt, bash, etc.) and run `php -S localhost:8000` - adjust the port number if that is necessary for you
4. Open your web browser and type or paste [localhost](http://localhost) as the URL or 'localhost:<port_number>' (e.g. `localhost:8000`) if your server requires it (PHP's development server does)
---
## Features and how to use
### Dashboard Page
The dashboard is the entry point to the website. It showcases a handful of graphs, split into 3 different categories which include Health, Vitals, and Behvaiour. These graphs are situated within sliding carousels which optionally and by default, auto rotate. The graphs can be filtered by specific chart categories, for plotting and showcasing different date ranges as seen in the csv, filter by specific dog IDs, including showcasing ALL dogs. Each chart group features a drop down for viewing different types of graphs. Because of the differing categorical nature of the Behavioural chart group, there are different chart viewing options. Additionally, the dashboard features dynamic metric cards which showcases averages across the board, with indicators to movement from previous day. These stats are taken from the latest date entry to behave dynamically.

### Analytics Page
This page allows a user to generate any type of chart with data they select from the page (dog, datapoints, dates). You can hover over the chart for more details and you can export the chart as a PDF or a PNG - you can also export the data used to generate the chart in JSON or CSV format.

### Records Page
This page allows a user to generate tables from the data tables with the data they select (dog, timeframe). The tables are rendered in browser and they can be exported as tables in a PDF or a PNG. The data from the tables can also be exported in JSON or CSV format.

### Health Trends Page
This page is dedicated to machine learning forecasting using sci-kit learn machine learning models. The page features a chart generator with optional drop downs for various machine learning hyperparameter tweaking and data visualisation. Filters on this graph include training date range (this is 30 by default as seen in the Python), drop down for model selection (linear regression, polynomial, support vector regression, and random forest), training start date (limited to dynamic csv date ranges) and days to predict. Training day range will largely dictate the predictive data. The graph shows the predicted data, alongside training data as may be informative for users.

### Notifications
These bring attention to data outside of normal ranges such as high and low temperatures.