// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,

  server: 'https://admin.mata.vc/api/v1', // Saffron vc
  rocketchat_api: 'http://52.32.181.2:3000', // Saffron vc
  webSocketURL: 'wss://admin.mata.vc/ws',
  rocketChatWebSocket: 'wss://admin.mata.vc/rocket-chat-ws/',

  web3_block_chain: 'http://10.0.2.16:8501', // block chain IP with port.

  oauth_redirect_uri: 'http://localhost:4200/',
  firebaseConfig: {
    apiKey: 'AIzaSyAwzjfwQLztOlUSf26PZL3LMwcnV91kAOU',
    authDomain: 'dab-v0.firebaseapp.com',
    databaseURL: 'https://dab-v0.firebaseio.com',
    projectId: 'dab-v0',
    storageBucket: 'dab-v0.appspot.com',
    messagingSenderId: '732794368272',
  },
  intervalToCheckWebRtcCall: 5000,
  // chromeExtensionId:"idjefhgemfckdblmpgjllnfijhmhbnmm",  //my local
  chromeExtensionId: 'pjpkemphaljgijeipolgclhjgakjjmfb',  // chrome screen sharing extension id
  googleProviderKey: '397757319264-o1i5osovkirdqe75tmepg3nueeibn3bv.apps.googleusercontent.com',  // Saffron's account key
  googleDriveApiKey: 'AIzaSyDtTicBZxz-riolXGebZgFyIcUZx3gcC20',
  // facebookProviderKey:"246307489291551",  //Saffron's account key
  facebookProviderKey: '246307489291551',
  linkedinProviderKey: '86bfnphdtp9zmz',
  paypalClientKey: 'AWn3JaZcJw1sEuIOzjVnv31TBJeTi2eUhVzeEAfJGJkSLvPH-1lq2Y0yEr8hI5puLDsBrZSgJPQpff9o', // Saffron's account key
  paypalRedirectUri: '/paypal/paypalcallback',
  paypalSignInUri: 'https://www.paypal.com/signin/authorize',
  paypalScope: 'profile+email+address+phone+https%3A%2F%2Furi.paypal.com%2Fservices%2Fpaypalattributes',
  plaidPublicKey: '0bc3fdd156a3fb284bcf5d2cf78bd7',
  // authorizeNetUrl:"https://test.authorize.net/payment/payment", // for sandbox
  authorizeNetUrl: 'https://accept.authorize.net/payment/payment',  // for production
  cloudconvertURL: 'https://api.cloudconvert.com/v1/convert',
  cloudconvertKey: '9sfDcEGguYJnGz91dTkssxrdFmDZuZmfC32yMtWZx1IRZeobIkIwKFkBFqRPTrOk',
};
