## Install


```bash
$ npm install # or pnpm install or yarn install
```

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


To connect to the backend, create a file named `.env.development` and specify the following variables:

```bash
VITE_API_URL=192.168.x.x
```

## Deployment

```bash
npm run build
```

Builds the app for production to the `../esp32/static` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!



## This project was created with the [Solid CLI](https://github.com/solidjs-community/solid-cli)
