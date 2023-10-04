// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hmr: false,
  appName:'Coinpes',
  apiUrl: 'http://localhost:4000',
  endpoint:'https://api.coinpes.com/api/coin/v1',
  upload_endpoint:'https://api.coinlif.com/api/coin/v1',
  firebase: {
    apiKey: "AIzaSyAnpvBPEoonlhyLu6g-pNnNlfyGdnzjOpI",
    authDomain: "chatapp-3b35b.firebaseapp.com",
    projectId: "chatapp-3b35b",
    storageBucket: "chatapp-3b35b.appspot.com",
    messagingSenderId: "194667117409",
    appId: "1:194667117409:web:adfb6485c28202dfb8a320",
    measurementId: "G-1PJXY4Z7CR"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
