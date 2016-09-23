/**
 * Created by prashun on 9/22/16.
 */

import { Schema } from 'mongoose';
const mongoose = require('bluebird').promisifyAll(require('mongoose'));
const uniqueValidator = require('mongoose-unique-validator');

let _models = {};
const schema_config = process.env.MONGOOSE_SCHEMA_LOCATION || './schemas';

const schemas = require(schema_config);

Object.keys(schemas).forEach((key)=>{
    const schema =  new Schema(schemas[key]);

    /**
     * Plugins
     */
    schema.plugin(uniqueValidator, { message: 'Value is not unique.'});

    _models[key] = mongoose.model(key, schema ) ;
});


export const models = _models;