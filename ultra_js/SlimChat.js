/* 
 Created on : 25 ott 2020, 12:08:05
 Author     : artsakenos
 */
/* global jec_user, jec_password, jec_host, ujs_url_params, chat_mapping, chat_sender, chat_receiver, chat_secret */

window.onload = function () {

    $('#conf_url').val(getCookie("jec_host"));
    $('#conf_user').val(getCookie("jec_user"));
    $('#conf_password').val(getCookie("jec_password"));

    $('#conf_sender').val(getCookie("chat_sender"));
    $('#conf_receiver').val(getCookie("chat_receiver"));
    $('#conf_mapping').val(getCookie("chat_mapping"));
    $('#conf_secret').val(getCookie("chat_secret"));

    if (Object.keys(ujs_url_params).length >= 4) {
        // Get values from query params and save them! This allow QR Code setups.
        jec_host = ujs_url_params["host"];
        jec_user = ujs_url_params["user"];
        jec_password = ujs_url_params["password"];

        chat_sender = ujs_url_params["sender"];
        chat_receiver = ujs_url_params["receiver"];
        chat_secret = ujs_url_params["secret"];
        chat_mapping = ujs_url_params["mapping"];

        $('#conf_url').val(jec_host);
        $('#conf_user').val(jec_user);
        $('#conf_password').val(jec_password);

        $('#conf_sender').val(chat_sender);
        $('#conf_receiver').val(chat_receiver);
        $('#conf_mapping').val(chat_mapping);
        $('#conf_secret').val(chat_secret);
    }

    if (typeof jec_host === 'undefined') {
        showMessage("In order to start go through the <b>Setup Credentials</b> Tab.", "info");
        return;
    }

    $('#conf_url_current').html('<small>Currently: <i>' + jec_host + '</i></small>');
    $('#conf_user_current').html('<small>Currently: <i>' + jec_user + '</i></small>');

    $('#conf_sender_current').html('<small>Currently: <i>' + chat_sender + '</i></small>');
    $('#conf_receiver_current').html('<small>Currently: <i>' + chat_receiver + '</i></small>');
    $('#conf_mapping_current').html('<small>Currently: <i>' + chat_mapping + '</i></small>');

    if (chat_sender && chat_receiver && chat_secret) {
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
                                            {"match": {"receivers.id": chat_receiver}},
                                            {"match": {"sender.id": chat_sender}}
                                        ]
                                    }
                                },
                                {
                                    "bool": {
                                        "must": [
                                            {"match": {"receivers.id": chat_sender}},
                                            {"match": {"sender.id": chat_receiver}}
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

    http_post(jec_host + "/_search", JSON.stringify(body), jec_user, jec_password, showChatDiscussion);
}

/**
 * Prints the results to the div: ...
 * @param {*} response 
 */
function showChatDiscussion(response) {
    var html_output = '';
    for (var i = response.hits.hits.length - 1; i >= 0; i--) {
        var hit = response.hits.hits[i]._source;

        var msg_content = hit.content;
        var msg_sender = hit.sender.id;
        var msg_receiver = hit.receivers[0].id;
        var msg_date = hit.created_iso8601;
        var msg_encrypted = hit.encrypted;
        if (msg_encrypted) {
            msg_content = aes_decrypt(msg_content, chat_secret);
        }

        var color = chat_sender === msg_sender ? "sender" : "receiver";
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
    if (!chat_sender || !chat_receiver || !chat_secret) {
        showMessage("The Chat Sender, Receiver, and Secret must be defined. Please <b>Setup Credentials</b>.", "warning");
        return;
    }

    var date = new Date();
    var encrypted = false;
    if (chat_secret) {
        encrypted = true;
        content = aes_encrypt(content, chat_secret);
    }

    var body = {
        "encrypted": encrypted,
        "sender": {
            "id": chat_sender
        },
        "receivers": [
            {
                "id": chat_receiver
            }
        ],
        "received": false,
        "created_iso8601": date.toISOString(),
        "type": "MESSAGE",
        "content": content,
        "created_epoch": date.getTime()
    };

    http_post(jec_host + chat_mapping, JSON.stringify(body), jec_user, jec_password, null);
}

function saveCredentials(url, user, password, sender, receiver, secret, mapping) {
    jec_host = url;
    jec_user = user;
    jec_password = password;
    setCookie("jec_host", jec_host, 30);
    setCookie("jec_user", jec_user, 30);
    setCookie("jec_password", jec_password, 30);

    chat_sender = sender;
    chat_receiver = receiver;
    chat_secret = secret;
    chat_mapping = mapping;
    setCookie("chat_sender", chat_sender, 30);
    setCookie("chat_receiver", chat_receiver, 30);
    setCookie("chat_secret", chat_secret, 30);
    setCookie("chat_mapping", chat_mapping, 30);

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


