/* 
 UltraJS: a suite of general purpose function to augment JavaScript.
 Minify it with https://codebeautify.org/minify-js
 
 Created on : 25 ott 2019, 12:08:05
 Author     : artsakenos
 */

/* global CryptoJS */

/**
 * Load parameters in global ujs_url_params. Access them with ujs_url_params["key"];
 */
var ujs_url_params;
(window.onpopstate = function () {
    var match,
            pl = /\+/g, // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) {
                return decodeURIComponent(s.replace(pl, " "));
            },
            query = window.location.search.substring(1);

    ujs_url_params = {};
    while (match = search.exec(query))
        ujs_url_params[decode(match[1])] = decode(match[2]);
})();

function aes_encrypt(message = '', key = '') {
    var message = CryptoJS.AES.encrypt(message, key);
    return message.toString();
}

/**
 * Decrypt a message.
 * 
 * @param {string} message The Message
 * @param {string} key The Key
 * @returns {string} The decrypted message
 */
function aes_decrypt(message = '', key = '') {
    var code = CryptoJS.AES.decrypt(message, key);
    try {
        var decryptedMessage = code.toString(CryptoJS.enc.Utf8);
        return decryptedMessage;
    } catch (err) {
        // console.log("aes_decrypt() Error: " + err.message);
        return "(<i>encrypted with another key</i>)";
}
}

/**
 * Show a notification.
 * 
 * @param {type} message
 * @param {type} type The bootstrap button type: success, warning, info, danger, ..., 
 * see https://getbootstrap.com/docs/4.0/components/buttons/
 */
function showMessage(message, type) {
    $("#notifications").fadeIn();
    var html_message = '<div class="alert alert-' + type + '">' + message + '</div>';
    $('#notifications').html(html_message);
    setTimeout(function () {
        $("#notifications").fadeOut("slow");
    }, 10000);
}

function toJsonPre(dataObject) {
    return '<pre id="json">' + JSON.stringify(dataObject, null, 2) + '</pre>';
}

/**
 * An HTTP POST request.
 * 
 * @param {string} url The URL
 * @param {string} json_body The body, e.g., JSON.stringify(body)
 * @param {string} user The user (null if no credentials)
 * @param {string} password the password if any
 * @param {function} post_callback A callback with a parameter to handle the response, e.g.,
 * <pre>
 *  inline: function (response) { console.log(response); } 
 *  out:    function handle_me(response) { console.log(response); }
 *  null:   null.
 * </pre>
 */
function http_post(url, json_body, user, password, post_callback) {
    http_query(url, json_body, user, password, post_callback, 'POST');
}

/**
 * An HTTP GET request.
 * 
 * @param {string} url The URL
 * @param {string} json_body The body, e.g., JSON.stringify(body)
 * @param {string} user The user (null if no credentials)
 * @param {string} password the password if any
 * @param {function} post_callback A callback with a parameter to handle the response, e.g.,
 * @param {string} method e.g., 'POST', 'GET', ...
 * <pre>
 *  inline: function (response) { console.log(response); } 
 *  out:    function handle_me(response) { console.log(response); }
 *  null:   null.
 * </pre>
 */
function http_query(url, json_body, user, password, post_callback, method) {
    var xmlHttp = new XMLHttpRequest();
    if (user) {
        var credentials = window.btoa(user + ':' + password); // Senza questo chiede le credential esplicitamente.
        xmlHttp.open(method, url, [true, user, password]);
        xmlHttp.setRequestHeader("Authorization", "Basic " + credentials);
    } else {
        xmlHttp.open(method, url, false); // Senza credenziali
    }
    xmlHttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xmlHttp.onload = function (event) {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200 || xmlHttp.status === 201) {
                var response = JSON.parse(xmlHttp.responseText);
                if (post_callback)
                    post_callback(response);
            } else {
                showMessage('Connection Error (' + xmlHttp.statusText + '), check the URL ' + url, 'warning');
            }
        }
    };
    xmlHttp.onerror = function (event) {
        showMessage('Connection Error (' + xmlHttp.statusText + '), check the URL ' + url, 'warning');
    };

    try {
        xmlHttp.send(json_body);
    } catch (domexception) {
        showMessage("Error sending POST request. CORS issues? Use credentials or allow mixed content from https.", 'warning');
    }
}

/**
 * Note that Ajax instead of XML HTTP request can lead to CORS error in some repositories.
 
 * @param {string} url The URL
 * @param {string} json_body The body, e.g., JSON.stringify(body)
 * @param {string} user The user (null if no credentials)
 * @param {string} password the password if any
 */
function post_data_ajax(url, json_body, user, password) {

    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(user + ':' + password));
        },
        success: function (data) {
            showMessage("Item has been succesfully posted.", "success");
            document.getElementById('hits').innerHTML = toJsonPre(data);
        },
        error: function (data) {
            showMessage("There was an error posting the item (" + url + ").", "danger");
            document.getElementById('hits').innerHTML = toJsonPre(data);
        },
        type: "POST",
        data: json_body,
        contentType: "application/json; charset=utf-8",
        url: url
    });

}



// -----------------------------------------------------------------------------
// ---------    Cookies
// -----------------------------------------------------------------------------

/**
 * Set a Cookie. Note: Cookies can be handled cross site not as local.
 * (see httponly  flag).
 * 
 * @param {type} cname The Cookie Name
 * @param {type} cvalue The Cookie Value
 * @param {type} exdays The Expire days
 */
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * Get the value of a Cookie.
 * 
 * @param {type} cname The Cookie Name
 * @returns {String} The value of the Cookie as a String.
 */
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ')
            c = c.substring(1);
        if (c.indexOf(name) === 0)
            return c.substring(name.length, c.length);
    }
    return "";
}

function eraseCookie(name) {
    setCookie(name, "", -1);
}

// -----------------------------------------------------------------------------
// ----------   Utilities
// -----------------------------------------------------------------------------

/**
 * Replaces a text on the whole document.
 * 
 * @param {type} placeholder e.g., {{placeholder}}
 * @param {type} replacement The replacement text
 */
function replaceholder(placeholder, replacement) {
    document.body.innerHTML = document.body.innerHTML.replaceAll(placeholder, replacement);
}

