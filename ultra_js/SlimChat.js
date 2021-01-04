/* 
 Created on : 25 ott 2020, 12:08:05
 Author     : artsakenos
 */
/* global jec_user, jec_password, jec_host, urlParams */
var sender;
var receiver;
var secret;

window.onload = function () {

    $('#conf_url').val(getCookie("jec_host"));
    $('#conf_user').val(getCookie("jec_user"));
    $('#conf_password').val(getCookie("jec_password"));

    if (jec_host)
        $('#conf_url_current').html('<small>Currently: <i>' + jec_host + '</i></small>');
    if (jec_user)
        $('#conf_user_current').html('<small>Currently: <i>' + jec_user + '</i></small>');

    sender = urlParams["sender"];
    receiver = urlParams["receiver"];
    secret = urlParams["secret"];
    if (sender && receiver && secret) {
        // getMessages(10);
        function get10Messages() {
            getMessages(10);
        }
        window.setInterval(get10Messages, 5000);
    }

};

// -----------------------------------------------------------------------------
// ---------    Message Handlers
// -----------------------------------------------------------------------------

/**
 * Prende i messaggi e invia la response alla callback showChatDiscussion(...).
 * 
 * @param {number} limit 
 */
function getMessages(limit) {
    var body = {
        "_source": [
            "id", "sender", "receivers", "received", "encrypted", "content",
            "created_epoch", "created_iso8601", "type", "location"],
        "size": limit,
        "sort": [
            {"created_epoch": {"order": "desc"}}
        ],
        "query": {
            "bool": {
                "must": [
                    {
                        "bool": {
                            "should": [
                                {"match": {"type": "MESSAGE"}}
                            ]
                        }
                    },
                    {
                        "bool": {
                            "should": [
                                {
                                    "bool": {
                                        "must": [
                                            {"match": {"receivers.id": receiver}},
                                            {"match": {"sender.id": sender}}
                                        ]
                                    }
                                },
                                {
                                    "bool": {
                                        "must": [
                                            {"match": {"receivers.id": sender}},
                                            {"match": {"sender.id": receiver}}
                                        ]
                                    }
                                }

                            ]
                        }
                    },
                    {"exists": {"field": "type"}}
                ]
            }
        }
    };

    var xmlHttp = new XMLHttpRequest();
    if (jec_user) {
        // xmlHttp.withCredentials = true;  // Per esplicitare la richiesta di credenziali?
        var credentials = window.btoa(jec_user + ':' + jec_password); // Senza questo chiede le credential esplicitamente.
        xmlHttp.open('POST', jec_host + "/_search", [true, jec_user, jec_password]);
        xmlHttp.setRequestHeader("Authorization", "Basic " + credentials);
    } else {
        xmlHttp.open('POST', jec_host + "/_search", false); // Senza credenziali
    }
    xmlHttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xmlHttp.onload = function (event) {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {
                var response = JSON.parse(xmlHttp.responseText);
                showChatDiscussion(sender, receiver, secret, response);
            } else {
                showMessage('Connection Error (' + xmlHttp.statusText + '), check the URL ' + jec_host, 'warning');
            }
        }
    };
    xmlHttp.onerror = function (event) {
        showMessage('Connection Error (' + xmlHttp.statusText + '), check the URL ' + jec_host, 'warning');
    };

    try {
        // console.log(JSON.stringify(body));
        xmlHttp.send(JSON.stringify(body));
    } catch (domexception) {
        showMessage("Attenzione: disattivare il CORS, utilizzare un repository con credentials, o alloware mixed content (se da https).", 'warning');
    }


}

/**
 * Prints the results to the div: ...
 * @param {*} sender 
 * @param {*} receiver 
 * @param {*} secret 
 * @param {*} response 
 */
function showChatDiscussion(sender, receiver, secret, response) {
    var html_output = '';
    for (var i = 0; i < response.hits.hits.length; i++) {
        var hit = response.hits.hits[i]._source;

        var msg_content = hit.content;
        var msg_sender = hit.sender.id;
        var msg_receiver = hit.receivers[0].id;
        var msg_date = hit.created_iso8601;
        var msg_encrypted = hit.encrypted;
        if (msg_encrypted) {
            msg_content = aes_decrypt(msg_content, secret);
        }

        var color = sender === msg_sender ? "sender" : "receiver";
        html_output += "<div class='chat_item " + color + "'>" +
                "[" + msg_date + "] " + msg_sender + "->" + msg_receiver + ": " + msg_content + "</div>\n";
    }
    // var html_total = `<h2>Showing ${response.hits.hits.length} of ${response.hits.total} results.</h2>`;
    // showMessage(html_total, 'success');
    document.getElementById('hits').innerHTML = html_output;
}

/**
 * Posts the message content to the ES repository.
 * 
 * @param {type} content The content
 */
function sendMessage(content) {

    if (!content || content === '')
        return;
    if (!sender || !receiver || !secret) {
        showMessage("The Chat Sender, Receiver, and Secret must be defined. Please <b>Setup Credentials</b>.", "warning");
        return;
    }

    var date = new Date();
    var encrypted = false;
    if (secret) {
        encrypted = true;
        content = aes_encrypt(content, secret);
    }

    var body = {
        "encrypted": encrypted,
        "sender": {
            "id": sender
        },
        "receivers": [
            {
                "id": receiver
            }
        ],
        "received": false,
        "created_iso8601": date.toISOString(),
        "type": "MESSAGE",
        "content": content,
        "created_epoch": date.getTime()
    };

    postData("/delgado/delgado", JSON.stringify(body));
}

function saveCredentials_Chat(url, user, password, sender, receiver, secret, mapping) {
    jec_host = url;
    jec_user = user;
    jec_password = password;
    setCookie("jec_host", jec_host, 30);
    setCookie("jec_user", jec_user, 30);
    setCookie("jec_password", jec_password, 30);
    showMessage('Credentials correctly saved.', 'success');
}

jQuery(document).ready(function () {
    var input_id = "#chat_input";
    jQuery(input_id).keypress(function (e) {
        if (e.which === 13) {
            // $('form#login').submit();
            e.preventDefault();
            var hear = jQuery(input_id).val();
            sendMessage(hear);
            jQuery(input_id).val('');
            return false;
        }
    });

});


