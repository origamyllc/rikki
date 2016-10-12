/**
 * Created by prashun on 9/22/16.
 */

import { Schema } from 'mongoose';
const mongoose = require('bluebird').promisifyAll(require('mongoose'));
const uniqueValidator = require('mongoose-unique-validator');

let $models = {};

const $internal_schemas = require('./schemas');

const external_schemas = process.env.MONGO_SCHEMA_LOCATION;

const $external_schemas = require(external_schemas);
let schemas;

function extend(destination, source) {
    for (var k in source) {
        if (source.hasOwnProperty(k)) {
            destination[k] = source[k];
        }
    }
    return destination;
}

if(process.env.MONGO_SCHEMA_LOCATION) {
    schemas = extend($external_schemas.models, $internal_schemas);
}
else {
    schemas = $internal_schemas;
}

// load the authentication schemas by default then load
// the user defined schemas from the configured path

Object.keys(schemas).forEach((key)=>{

    const schema =  new Schema(schemas[key]);

    /**
     * Plugins
     */
    schema.plugin(uniqueValidator, { message: 'Value is not unique.'});

    $models[key] = mongoose.model(key, schema ) ;
});


export const models = $models;