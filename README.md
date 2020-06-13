# StudyBuddy-web

This repository contains the source code of the web client, available [here](https://studybuddy-e5f46.web.app).

## Native apps

For a native version of the application, see this [Github repo](https://github.com/EdricChan03/StudyBuddy-android) and its [Releases](https://github.com/EdricChan03/StudyBuddy-android/releases). Note that this is only available for Android for now.

---

## Running a local instance of the site

### Prerequisites

- An installation of the latest [NodeJS](https://nodejs.org/en/) (ideally the version needed for the Angular CLI)

### Get started

To build the source code, follow these steps:

1. Clone this repository locally.

   ```bash
   cd path/to/dir
   git clone https://github.com/EdricChan03/StudyBuddy-web
   ```

2. Install the modules.

   ```bash
   npm i
   ```

3. Run any one of the commands:

   - `npm start`
      Serves the app in production mode

   - `npm run serveDev`
     Serves the app in development mode

4. Navigate to `localhost:4200`.

Done!

---

## Angular CLI Documentation

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
