
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

SlimChat, a Slim Javascript Elasticsearch Based Chat
====================================================
Example of a simple cyphered end to end messenger exploiting SlimJEC.
See https://artsakenos.github.io/SlimJEC/SlimChat.html as an example.


ISSUES
======
* This was a quick experiment, I didn't perform any extensive tests, feel free to open issues or pull requests.
* Trailing '/' should be automatically removed
* If you want to perform *Cross-origin resource sharing* you have to set up your browser (avoidable?)
* Same if you want to be served by an HTTP ES instance on a HTTP website
* Until the new version of TLS, secret is sent during the query: to save it in session.