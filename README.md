# Animal Activity: Proof of Technology
Presenting Animal Health Data Through a Web-Based Dashboard
A Sheffield Hallam University group project by Group 14-EXT for Elanco
## What this software does

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
4. Open your web browser and type or paste [localhost](localhost) as the URL or 'localhost:<port_number>' (e.g. `localhost:8000`) if your server requires it (PHP's development server does)
---
## Features and how to use
### Dashboard Page


### Analytics Page


### Records Page


### Health Data Page


### Trends Page


### Notifications