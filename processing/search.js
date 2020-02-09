/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */
'use strict';

const os = require("os");
const async = require('async');
const ImageSearchAPIClient = require('azure-cognitiveservices-imagesearch');
const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;

// Add your Bing Search V7 subscription key to your environment variables.
let subscriptionKey = process.env['BING_SEARCH_V7_SUBSCRIPTION_KEY']

if (subscriptionKey == null || subscriptionKey == "" || subscriptionKey == undefined) {
    throw new Error('please set/export the following environment variable: ' + subscriptionKey);
}

///////////////////////////////////////////
//     Entrypoint for sample script      //
///////////////////////////////////////////

let credentials = new CognitiveServicesCredentials(subscriptionKey);
let imageSearchApiClient = new ImageSearchAPIClient(credentials);

//a helper function to perform an async call to the Bing Image Search API
const sendQuery = async () => {
    return await imageSearchApiClient.imagesOperations.search("canadian rockies");
};
module.exports = {
    sendQuery: sendQuery
}