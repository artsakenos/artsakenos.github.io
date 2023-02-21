
SlimSuite
=========
A suite of light JS scripts for ElasticSearch Connection.

You can play with some proof of concept tools: 
* The [SlimJEC](https://artsakenos.github.io/slim_suite/SlimJEC.html) - A basic ES client over JS
* The [SlimChat](https://artsakenos.github.io/slim_suite/SlimChat.html) - A simple chat
* The [SlimIRC](https://artsakenos.github.io/slim_suite/SlimIRC.html) - A portable IRC Style messenger E2E encrypted. See [Help](#slimirc-a-sportable-irc-style-messenger). See also the [Netlify Instance](https://slimirc.netlify.app/).

This are experiments, I didn't perform any extensive tests, feel free to open issues or pull requests.
Note that until the new TLS, some secrets could be sent within query parameters. I try to avoid it in most of the cases.

Examples are public client side app:
Of course you can play with XHR, of course you can read the console, 
of course you can hack the ES repository.
Please use it just for good, educational purposes. Have fun.


SlimJEC, a Slim Javascript Elasticsearch Client
===============================================
Pure Javascript Client for really basic access to ES instances.
No fancy framework, No Node.js, No Python. Just your browser.
You can make a *static page become a blog*.

SlimJec included in its first version, together with UltraJS scripts:
* A Javascript (SlimJEC.js, optionally SlimJEC_Config.js to set up the credentials): the code to make the client work
* A HTML page (SlimJEC.html, SlimJEC.css): A static HTML wrapper for the client
All can be easily wrapped in one single html file.

It lets you:
* perform a full text search in *match mode* or *fuzzy mode*
* perform a *match key:value* search on the field you want
* post documents to your index
* check index information


SlimChat, a Slim JS/ES Based Chat
=================================
Example of a simple cyphered end to end messenger exploiting SlimJEC.


SlimIRC, a Portable IRC Style Messenger
=======================================
SlimIRC is just another experiment.
* It is a completely standalone HTML page. It means you can copy it in your PC and it works.
    Note that Chrome does not allow local cookies, credentials will not be persisted in local.
* Communication is encrypted by your browser before being sent and stored
* You can share the communication channel through a link or QR Code
* Yes, you can inject HTML code. It is funny and you can't destroy anything. Just don't be annoying.

## Commands
* */help*: Will open this page.
* */nick {nickname}*: Changes your nickname to "nickname";
* */join {room_name}*: Joins the channel "room_name";
* */secret {secret}*: changes the secret key of the communication. You are allowed to see messages that match with your secret;
* */msg {nickname} {msg}*: Send a private message to "nickname". Private Messages are shown in bold style;
* */call {room_name}*: Open a videocall with the name "room_name" (Right now exploiting [AppRTC](https://appr.tc/)).


TODO
====
* Add some [Push Notifications](https://medium.com/izettle-engineering/beginners-guide-to-web-push-notifications-using-service-workers-cb3474a17679)
* Add [WebRTC Calls](https://webrtc.org/getting-started/peer-connections), without [Signaling Server](https://github.com/lesmana/webrtc-without-signaling-server), or with [Scalendrone](https://github.com/ScaleDrone/webrtc).
