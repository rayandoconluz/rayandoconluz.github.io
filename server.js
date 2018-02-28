const express = require("express"),
	app = express(),
	fs = require('fs'),
	https = require('https'),
	React = require('react'),
	ReactDOMServer = require('react-dom/server'),
	bodyParser = require('body-parser'),
	webpush = require('web-push'),
	path = require('path'),
	request = require('request');	
	require('es6-promise').polyfill()
	require('isomorphic-fetch')


/*------ dot cmsrc ------------------------------------*/
		let dotenvPath = path.resolve(process.cwd(), '.cmsrc')
		let encoding = 'utf8'
    // specifying an encoding returns a string instead of a buffer
    const parsed = JSON.parse(fs.readFileSync(dotenvPath, { encoding }))

    Object.keys(parsed).forEach(function (key) {
      if (!process.env.hasOwnProperty(key)) {
        process.env[key] = parsed[key]
      }
		})
		console.log(parsed)
/* ------------------------------------------------------- */ 		
	// push notifications 
	const vapidKeys = {
		publicKey:'BMYgIYpw8jtC_61DQFh9k0rJP-5XUrWIwsUAOOnJmJQOfdS94jSlk0C2q86F1ebI2Yln5yz6v-cTJ2h10GM-vd4',
		privateKey:'z6scVphnKP7WPgjVeJZFgvGdMlrFT8V2hVEg08mnoms'
	};
	
	webpush.setVapidDetails(
		'mailto:rutasdelosandes@gmail.com',
		vapidKeys.publicKey,
		vapidKeys.privateKey
	);
	
//server side fetch polifyll
import routes from './_javascript/routes'
import { match, RouterContext } from 'react-router'
import { write ,read ,push, sendToDevice} from './chatbot/db'
import { Promise } from "firebase";
// set this var for react inner components
global.__documents__ = JSON.parse(fs.readFileSync('./_site/documents.json','utf8'))

app.use(bodyParser.json())
// ensure secure middleware
function ensureSecure(req,res,next){
  if(req.secure){
    next()
  }
  else{
    res.redirect(301,`https://${req.hostname}${req.url}`)
  }
}

 /* not secure yet */
if (process.env.environment != 'development') { 
	console.log("wnsuring secure",process.env.environment)
	app.all('*', ensureSecure)
}

if (process.env.plugins.chatbot) { 
	const bot = require('./chatbot/bot.js')
	app.use(bot)
}
function getSubscriptionsFromDatabase() {
	return new Promise((resolve,reject) => {
		read('endpoints').then(function (snapshot) {
			let subscriptions = []
			snapshot.forEach(function (childSnapshot) {
				var childData = childSnapshot.val();
				subscriptions.push(childData)
			})
			resolve(subscriptions)
		})	
		.catch(reject)
	 })
}
app.post('/api/trigger-push-msg/', function (req, res) { 
	let dataToSend = req.body
	getSubscriptionsFromDatabase()
  .then(function(subscriptions) {
    let promiseChain = Promise.resolve();

    for (let i = 0; i < subscriptions.length; i++) {
      const subscription = subscriptions[i];
      promiseChain = promiseChain.then(() => {
        return triggerPushMsg(subscription, dataToSend.title);
      });
    }
    return promiseChain;
		}).then(function (){ 
			res.sendStatus(200).send("ok");
		})	
})

app.get('/product/availability*', function (req, res) {
	var state =  {
		"selectedColor": "white",
		"selectedSize": "M",
		"selectedQuantity":"1",
		"whiteSlide": 0,
		"blackSlide": 0,
		"moreItemsPageIndex": 0,
		"hasMorePages": true,
		"white": {
			"sizes": {
				"S": "unavailable", 
				"M": "60000",
				"L": "65000"
			},
			"quantity": {
				"1": "1",
				"2": "1.8",
				"3": "2.6"
			},
			"defaultSize": "S"
		},
		"black": {
			"sizes": {
				"S": "55000",
				"M": "unavailable",
				"L": "65000"
			},
			"quantity": {
				"1": "1",
				"2": "1.8",
				"3": "unavailable"
			},
			"defaultSize": "L"
		},
		"gray": {
			"sizes": {
				"S": "799",
				"M": "799",
				"L": "799"
			},
			"defaultSize": "M"
		}
	}
	res.setHeader('Content-Type', 'application/json');
	res.status(200).send(JSON.stringify(state))
})
// TODO change this to be a post request we don't wnat to send finantials info through get
app.get('/pay', function (req, res) {  
	let query = 	{
		"language": "es",
		"command": "GET_BANKS_LIST",
		"merchant": {
			 "apiLogin": "pRRXKOl8ikMmt9u",
			 "apiKey": "4Vj8eK4rloUd272L48hsrarnUA"
		},
		"test": false,
		"bankListInformation": {
			 "paymentMethod": "PSE",
			 "paymentCountry": "CO"
		}
	}
	request({
		method: 'POST',
    uri: 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi',
		json: true,
		body: query
	},(err, res, body) => {
		if (err) { return console.log("error",err); }
		console.log(body.code);
		console.log(body.error);
		console.log(body.banks);
	});
})
app.get('/product/structure*', function (req, res) { 
	var structure = {
		items: [
			{
				colors: [{ "text": "white","default":"selected"}, {"text" : "black"}],
				size: [{ "text": "S" }, { "text": "M", "default":"selected"}, {"text": "L"}],
				quantity: [{ "text": "1","default":"selected"}, { "text": "2" }, {"text":"3"}]
			}
		]
	}
	res.setHeader('Content-Type', 'application/json');
	res.status(200).send(JSON.stringify(structure))
})

app.get('/checkout', function (req, res, next) { 
	// look for the right price and redirect to the react checkout 
	if (req.query.color) {
		// match the routes to the url
		match({ routes: routes, location: "/checkout" }, (err, redirect, props) => {
		const content = ReactDOMServer.renderToString(<RouterContext {...props} />)
		res.send(renderFullPage(content, global.__documents__))
		})
	}
	else { 
		next()
	}
})



const triggerPushMsg = function(subscription, dataToSend) {
  return webpush.sendNotification(subscription, dataToSend)
  .catch((err) => {
    if (err.statusCode === 410) {
      return deleteSubscriptionFromDatabase(subscription._id);
    } else {
      console.log('Subscription is no longer valid: ', err);
    }
  });
};

app.get('/api/trigger-push-msg', function (req, res) { 
	res.status(200).send(`
	<!doctype html>
	<html>
	<head>
		<title> notify in fb </title>
	</head>
	<body>
	<form action="/api/trigger-push-msg/" method="post">
		title<br>
		<input type="text" name="title"><br>
		<input type="submit" value="Submit">
	</form>
	</body>
	</html>
	`);
})
app.post('/api/save-subscription/', function (req, res) { 
	var data = req.body;
	console.log("body of the subscribe ajax call", data)
	push(`endpoints`, data)	
	res.status(200).send("ok");
})
app.get('/',(req,res)=>{
  // match the routes to the url
  match({ routes: routes, location: req.url }, (err, redirect, props) => {
	const content = ReactDOMServer.renderToString(<RouterContext {...props} />)
	  
	res.send(renderFullPage(content, global.__documents__))
  })
})

app.use(express.static("./_site"))
// jekyll urls doesn't contain the .html extension we need to proxy those request and render the correct file
app.get('/[a-zA-Z0-9_/]+/', (req, res, next) => {
	var options = {
		root: __dirname + '/_site/',
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};
	let fileName
	fileName = `${req.baseUrl+req.path}.html`
	console.log(fileName)
	res.sendFile(fileName, options, (err) => { 
		if (err) {
			next(err);
		}
		else { 
			console.log('Sent:', fileName);
		}
	})
})
function renderFullPage(html, preloadedState) {
	return `
	  <!doctype html>
	  <html>
		<head>
			<title>Rutas de los andes</title>
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<meta http-equiv="X-UA-Compatible" content="ie=edge">
			<meta name="description" content="Rutas de montaña en los andes colombianos, publicamos rutas de senderismo poco conocidas escritas por locales de los andes colombianos">
			<link rel="manifest" href="/manifest.json">
			<link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
			<link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
			<!-- Global site tag (gtag.js) - Google Analytics -->
			<script async src="https://www.googletagmanager.com/gtag/js?id=UA-100391485-2"></script>
			<script>
				window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag('js', new Date());
				gtag('config', 'UA-100391485-2');
			</script>
			<style>
			${fs.readFileSync('./_includes/styles.html','utf8')}
			</style>
			<!-- Asynchronously load the AMP-with-Shadow-DOM runtime library. -->
			<script async src="https://cdn.ampproject.org/shadow-v0.js"></script>
		</head>
		<body>
		  <div id="root">${html}</div>
		  <script>
			window.__documents__ = ${JSON.stringify(preloadedState)}		   
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('/service-worker.js');
			}   		
		  </script>
		  <script src="/javascript/index.bundle.js"></script>
		</body>
	  </html>
	  `}
app.use('/todo', express.static('./learning-react/dist'))


// http server
app.listen(8080)
// secure server
https.createServer({
	key: fs.readFileSync('./ssl-rutas/server.key'),
	cert: fs.readFileSync('./ssl-rutas/rutasdelosandes_com.crt'),
	ca: fs.readFileSync('./ssl-rutas/rutasdelosandes_com.ca-bundle'),
	passphrase: 'asdfasdf'},app).listen(8443)
// other code
/*

var schedule = require('node-schedule'),
webpush = require('web-push'),
firebase = require("firebase");
webpush.setVapidDetails('mailto:tuxgabo@gmail.com',
		'BNVFaEer_S5bnKoFlwJjf5wzW7EUCIWzYtu6wVw_mnwWVCukMNdwyC1grHaQSfVEeDIFohbgw47tncBHaNa9AZE',
		'9QnoyYGtzPY4rkffWOpeKjTS2mceh1O6yvK0azRghyE'
		)
var pushSubscription = {}
var pushMessage = {
	"notification": {
		"title": "Example Title",
		"body": "this  will be the body text of the notification.",
		"icon": "/images/images/icons/icon-128x128.png"
	}
}
var config ={
	apiKey:"AIzaSyCu89x-gpISBOPWhLPu1nTeuWv6Nt0xdak",
	authDomain:"smart-todo-5664c.firebaseapp.com",
	databaseURL:"https://smart-todo-5664c.firebaseio.com",
	projectId:"smart-todo-5664c",
	storageBucket:"smart-todo-5664c.appspot.com",
	messagingSenderId:"839763178074"
}
firebase.initializeApp(config)
function triggerPushMsg(subscription,msg){
	return webpush.sendNotification(subscription, msg)
		.catch((err)=>{
			console.log("something went wrong",err)
		})
}
function sendPushNotification(msg){
	let promiseChain = Promise.resolve();
	for (let key in pushSubscription) {
		const subscription = pushSubscription[key];
		console.log(`sending to ${subscription}`)
		promiseChain = promiseChain.then(() => {
			return triggerPushMsg(subscription,msg);
		});
	}
	return promiseChain;
}


// Webhook validation
app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }
});

app.post('/api/save-subscription',function(req,res){
	pushSubscription[req.body.endpoint] = req.body
	console.log(`subscription storage looks like this ${pushSubscription}`)
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify({ data: { success: true } }))
})
app.get('/trigger-push',function(req,res){
	sendPushNotification("test notification triggered").then(()=>{
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({ data: { success: true } }))
	}).catch((err)=>{
		console.log(err)
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({ data: { error: err } }))
	})
})
const dayReminderJob  = schedule.scheduleJob('32 8,12 * * *',(e)=>{
	console.log('day reminder job running')
	sendPushNotification("you have some task for today go for them").then(()=>{
		console.log(`send push notification job executed`)
	})
})
const nightReminderJob  = schedule.scheduleJob('30 22 * * *',(e)=>{
	console.log("job running")
	sendPushNotification("tomorrow can be a productive day plan the task you'll tackle").then(()=>{
		console.log(`send push notification job executed`)
	})
})
*/
