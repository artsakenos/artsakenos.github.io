/* 
 UltraJS: a suite of general purpose function to augment JavaScript
 
 Created on : 25 ott 2019, 12:08:05
 Author     : artsakenos
 */

/* global CryptoJS */

/**
 * Load parameters in global urlParams. Access them with urlParams["key"];
 */
var urlParams;
(window.onpopstate = function () {
    var match,
            pl = /\+/g, // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) {
                return decodeURIComponent(s.replace(pl, " "));
            },
            query = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);
})();

function aes_encrypt(message = '', key = '') {
    var message = CryptoJS.AES.encrypt(message, key);
    return message.toString();
}

function aes_decrypt(message = '', key = '') {
    var code = CryptoJS.AES.decrypt(message, key);
    var decryptedMessage = code.toString(CryptoJS.enc.Utf8);
    return decryptedMessage;
}

/**
 * Show a notification.
 * 
 * @param {type} message
 * @param {type} type The bootstrap button type: success, warning, info, danger, ..., 
 * https://getbootstrap.com/docs/4.0/components/buttons/
 * 
 * @return {undefined}
 */
function showMessage(message, type) {
    $("#notifications").fadeIn();
    var html_message = '<div class="alert alert-' + type + '">' + message + '</div>';
    $('#notifications').html(html_message);
    setTimeout(function () {
        $("#notifications").fadeOut("slow");
    }, 10000);
}

function toJson(dataObject) {
    return '<pre id="json">' + JSON.stringify(dataObject, null, 2) + '</pre>';
}

/**
 * An HTTP Post request.
 * 
 * @param {type} url The URL
 * @param {type} json_body The body, e.g., JSON.stringify(body)
 * @param {type} user The user (null if no credentials)
 * @param {type} password the password if any
 * @param {type} post_callback A callback with a parameter to handle the response, e.g.,
 * <pre>
 *  inline: function (response) { console.log(response); } 
 *  out:    function handle_me(response) { console.log(response); }
 *  null:   null.
 * </pre>
 */
function post_data(url, json_body, user, password, post_callback) { // json_body è Stringifyed
    var xmlHttp = new XMLHttpRequest();
    if (user) {
        // xmlHttp.withCredentials = true;  // Per esplicitare la richiesta di credenziali?
        var credentials = window.btoa(user + ':' + password); // Senza questo chiede le credential esplicitamente.
        xmlHttp.open('POST', url, [true, user, password]);
        xmlHttp.setRequestHeader("Authorization", "Basic " + credentials);
    } else {
        xmlHttp.open('POST', url, false); // Senza credenziali
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
        showMessage("Attenzione: disattivare il CORS, utilizzare un repository con credentials, o alloware mixed content (se da https).", 'warning');
    }
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
