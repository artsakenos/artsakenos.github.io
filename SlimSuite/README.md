
SlimSuite
=========
A suite of light JS scripts for ElasticSearch Connection.

You can play with some proof of concept tools: 
* The [SlimJEC](https://artsakenos.github.io/SlimSuite/SlimJEC.html) - A basic ES client over JS
* The [SlimChat](https://artsakenos.github.io/SlimSuite/SlimChat.html) - A simple chat
* The [SlimIRC](https://artsakenos.github.io/SlimSuite/SlimIRC.html) - A portable IRC Style messenger E2E encrypted. See [Help](#slimirc-a-sportable-irc-style-messenger).


SlimJEC, a Slim Javascript Elasticsearch Client
===============================================
Pure Javascript Client for really basic access to ES instances.
No fancy framework, No Node.js, No Python. Just your browser.

SlimJec included in its first version, together with UltraJS scripts:
* A Javascript (SlimJEC.js, optionally SlimJEC_Config.js to set up the credentials): the code to make the client work
* A HTML page (SlimJEC.html, SlimJEC.css): A static HTML wrapper for the client
All can be easily wrapped in one single html file.

It lets you:
* perform a fulltext search in *match mode* or *fuzzy mode*
* perform a *match key:value* search on the field you want
* post documents to your index
* check index information

You can make a *static page become a blog*, combining SlimJEC with a ElasticSearch instance.
See https://artsakenos.github.io/SlimJEC/SlimJEC.html as an example.

SlimChat, a Slim JS/ES Based Chat
=================================
Example of a simple cyphered end to end messenger exploiting SlimJEC.
See https://artsakenos.github.io/SlimJEC/SlimChat.html as an example.

SlimIRC, a Portable IRC Style Messenger
=======================================
Can be improved. Right now:
* It is a completely standalone app. It means you can copy the HTML in your PC and it works.
    Note that Chrome doesn't allow local cookies. So credentials will not be persisted.
* Communication is encrypted by your browser before being sent and stored
* You can share the communication channel through a link or QR Code
* You can inject HTML code. It is funny and you can't destroy anything. Just don't use it to be annoying.

In fact, I put there a free repository and this is a client side app: 
Of course you can play with XHR, of course you can read the console, 
of course you can hack the ES repository. You can also inject HTML code.
Please use it just for good, educational, or amusing purposes.

## Commands
* /help: Will open this page. Commands fields are separated by spaces, don't use them as characters for nicknames, etc.
* /nick <nickname>: Changes your nickname to "nickname"
* /join <room_name>: Joins the channel "room_name"
* /secret <secret>: changes the secret key of the communication
* /msg <nickname> <msg>: Send a private message to nickname.
    Message is encrypted with the secret of the room.
    Private Messages are shown in bold style.

TODO
====
* This was a quick experiment, I didn't perform any extensive tests, feel free to open issues or pull requests.
* Until the new version of TLS, some secrets could be sent within query parameters. I try to avoid that in most of the cases.
