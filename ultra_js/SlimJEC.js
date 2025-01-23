/* 
 Library for a slim Javascript ElasticSearch Connection.
 Needs: UltraJS.js
 
 Created on : 25 ott 2019, 12:08:05
 Author     : artsakenos
 */
/* global jec_user, jec_password, jec_host */

window.onload = function () {

    $('#conf_url').val(getCookie("jec_host"));
    $('#conf_user').val(getCookie("jec_user"));
    $('#conf_password').val(getCookie("jec_password"));

    if (typeof jec_host === 'undefined') {
        showMessage("In order to start go through the <b>Setup Credentials</b> Tab.", "info");
        return;
    }

    $('#conf_url_current').html('<small>Currently: <i>' + jec_host + '</i></small>');
    $('#conf_user_current').html('<small>Currently: <i>' + jec_user + '</i></small>');
};

/**
 * Performs a search request against an Elasticsearch server.
 * @param {string} search
 *   The string to search for.
 * @param {string} fieldsearch
 *   The field search in form of field:value
 * @param {string} limit
 *   A string to use to filter by type. For example: 'article';
 * @param {boolean} fuzzy
 *   Decide if the search is fuzzy or exact match;
 */
function doSearch(search, limit, fieldsearch, fuzzy) {

    if (!limit) {
        limit = 10;
    }

    var body = {
        'size': limit
    };

    // If empty does nothing.
    var query = {
        bool: {
            must: [
            ]
        }
    };
    body.query = query;

    if (search) {
        var search_fuzzy = {fuzzy: {_all: search}};
        var search_match = {match: {_all: search}};
        if (fuzzy)
            query.bool.must.push(search_fuzzy);
        else
            query.bool.must.push(search_match);
    }

    if (fieldsearch) {
        var fs_type = fieldsearch.split(':')[0];
        var fs_value = fieldsearch.split(':')[1];
        var fs_match = {match: {[fs_type]: fs_value}};
        query.bool.must.push(fs_match);
    }

    http_post(jec_host + "/_search", JSON.stringify(body), jec_user, jec_password, showHits);
}

function saveCredentials(url, user, password) {
    jec_host = url;
    jec_user = user;
    jec_password = password;
    setCookie("jec_host", jec_host, 30);
    setCookie("jec_user", jec_user, 30);
    setCookie("jec_password", jec_password, 30);
    showMessage('Credentials correctly saved.', 'success');
}

/**
 * Prints the results.
 * @param {type} response
 * @return {undefined}
 */
function showHits(response) {
    var html_output = '';
    for (var i = 0; i < response.hits.hits.length; i++) {
        var hit = response.hits.hits[i]._source;
        var keys = Object.keys(hit);

        // Search for a title
        if (hit.hasOwnProperty('title')) {
            html_output += '<h2>' + hit.title + '</h2>\n';
        }
        if (hit.hasOwnProperty('body')) {
            var body_cut = hit.body;
            if (body_cut.length > 200) {
                body_cut = body_cut.substring(0, 200) + "...";
            }
            html_output += '<div class="jec_field_body">' + body_cut + '</div>\n';
        }
        html_output += `<div class="jec_field_keys jec_field_wrapper">
                    <span class="jec_field_label"><i>Available Keys</i>:</span>
                    <span class="jec_field_content">${keys}</span></div>\n`;

        for (var field in hit) {
            if (field === 'title')
                continue;
            if (field === 'body')
                continue;
            if (Object.prototype.hasOwnProperty.call(hit, field)) {

                var html_value = hit[field];
                if (typeof html_value === "object") {
                    html_value = toJsonPre(html_value);
                }

                html_output += `<div class="jec_field_${field} jec_field_wrapper">
                    <span class="jec_field_label">${field}:</span>
                    <span class="jec_field_content">${html_value}</span></div>\n`;
            }
        }

        html_output += '<hr>';
    }
    var html_total = `<h2>Showing ${response.hits.hits.length} of ${response.hits.total} results.</h2>`;
    showMessage(html_total, 'success');
    document.getElementById('hits').innerHTML = html_output;
}

function showIndexes() {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(jec_user + ':' + jec_password));
        },
        success: function (data) {
            document.getElementById('hits').innerHTML = '<pre>' + data + '</pre>';
        },
        error: function (data) {
            document.getElementById('hits').innerHTML = 'ERROR:' + data;
        },
        type: "GET",
        data: '',
        contentType: "application/json; charset=utf-8",
        url: jec_host + '/_cat/indices?v'
    });
}
