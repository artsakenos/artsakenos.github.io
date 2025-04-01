# SlimSuite

A suite of lightweight JavaScripts for ElasticSearch connection powered by the *ultra_js* libraries.
No fancy framework, No Node.js, No Python. Just your browser.

You can explore these proof of concept experiments: 
* The [SlimJEC](https://artsakenos.github.io/slim_suite/SlimJEC.html) - 
    A basic ES client over JS 
    ([read more](#slimjec-a-slim-javascript-elasticsearch-client))
* The [SlimChat](https://artsakenos.github.io/slim_suite/SlimChat.html) - A simple chat
    ([read more](#slimchat-a-slim-jses-based-chat))
* The [SlimIRC](https://artsakenos.github.io/slim_suite/SlimIRC.html) - 
    A portable IRC-style messenger with E2E encryption 
    ([read more](#slimirc-a-portable-irc-style-messenger)). 
    See also the [Netlify Instance](https://slimirc.netlify.app/).

I haven't performed any extensive tests yet, so feel free to open issues or pull requests.

These are open client-side apps, and the data stores are hosted on public repositories.
You can inspect XHR requests, read the console, and access the ES repository.
Please use it only for educational purposes and responsible experimentation. Have fun!


# SlimJEC, a Slim JavaScript Elasticsearch Client
A Slim, Pure, JavaScript Client for basic access to ES instances.
You can make a *static page become a blog*.

SlimJEC lets you:
* perform a full text search in *match mode* or *fuzzy mode*
* perform a *match key:value* search on any field you want
* post documents to your index
* check index information


# SlimChat, a Slim JS/ES Based Chat
Example of a simple encrypted end-to-end messenger exploiting SlimJEC.


# SlimIRC, a Portable IRC Style Messenger
SlimIRC is an experimental messenger with these features:
* It is a completely standalone HTML page. You can download it to your PC and it works.
    Note that Chrome does not allow local cookies, so credentials will not be persisted locally.
* Communication is encrypted E2E, by your browser before being sent and stored
* You can share the communication channel through a link or QR Code

## Development

Note that the deployed standalone HTML page is based on *SlimIRC.js*; search for **Deploy Instructions** inside the code. 
It includes all the compressed JS needed to work, including Bootstrap and jQuery. This was done to enable usage in environments where internet access is restricted.

## Commands
* */help*: Opens this help page
* */nick {nickname}*: Changes your nickname to "nickname"
* */join {room_name}*: Joins the channel "room_name"
* */secret {secret}*: Changes the secret key of the communication. You can only see messages that match your secret
* */msg {nickname} {msg}*: Sends a private message to "nickname". Private Messages are shown in bold
* */call {room_name}*: Opens a video call with the name "room_name" (Currently using [AppRTC](https://appr.tc/))


# TODO
* Add [Push Notifications](https://medium.com/izettle-engineering/beginners-guide-to-web-push-notifications-using-service-workers-cb3474a17679)
* Add [WebRTC Calls](https://webrtc.org/getting-started/peer-connections), either without a [Signaling Server](https://github.com/lesmana/webrtc-without-signaling-server) or with [Scaledrone](https://github.com/ScaleDrone/webrtc)