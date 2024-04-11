# Project Name: Version 3

## Introduction

This project offers a platform for visualizing and managing historical symbol data. It features dynamic filtering, and easy data upload/download, catering to users who require detailed analysis and efficient data handling.

## File Structure

The project structure is organized as follows to encapsulate distinct functionalities and to promote a clean architecture:

```plaintext
/project_root
    /services
        __init__.py               # Makes Python treat the directories as containing packages
        excel_reader_svc.py   # Handles data retrieval and processing logic reading Excel files
        filter_svc.py    # Provides filtering capabilities for data
    /static
        /js
            modal_interaction.js  # Manages modal window interactions
            data_visualization.js # Handles the rendering of data visualizations
    /templates
        index.html                # The main HTML template for the application
    app.py                        # The Flask application setup and route definitions
```

## Project Overview

- **`/services`**: This directory contains all backend services that the application utilizes, including data processing, Excel file handling, and data filtering. The services are designed to be modular and reusable.
  
- **`/static/js`**: Contains JavaScript files that manage client-side logic, including modal interactions (`modal_interaction.js`) and data visualization (`data_visualization.js`). This separation allows for focused development on either UI interactions or data presentation logic.
  
- **`/templates`**: Stores HTML templates for the Flask application. Currently, it includes `index.html`, the main entry point for the application's user interface.
  
- **`app.py`**: The main Flask application file where routes are defined. This file acts as the entry point for the application, coordinating the web server and application setup.

## Getting Started

To get started with this project, ensure you have Python and Flask installed, then run `app.py` to start the server.

## License

[MIT](https://choosealicense.com/licenses/mit/)
