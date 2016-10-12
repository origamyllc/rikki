/**
 * Created by prashun on 9/22/16.
 */

const objectID = require('mongodb').ObjectID;
const mongoose = require('bluebird').promisifyAll(require('mongoose'));
const db = mongoose.connection;
import Promise from 'bluebird';
import { models }  from './modelFactory';

const url = process.env.MONGO_DB_URL ||  'mongodb://localhost/security-50';

connect(url);

/**
 * connect to mongo url
 * @param url
 */
export function connect(url) {
    mongoose.connect(url);
    db.on('error', console.error);
    db.once('open',  () => {
        console.log('connected to :' + url);
    });
}

/**
 * get all collections
 */
export function get_collections() {
    var collections = mongoose.connections[0].collections;
    Object.keys(collections).forEach(function(k) {
        console.log(k)
    });
}

/**
 * insert document into collection
 * @param model_name
 * @param docArray
 * @returns {Promise}
 */
export function insert(model_name, docArray) {
    return new Promise((resolve) => {
            if( models[model_name]){
                models[model_name].createAsync(docArray)
                    .then( (docArray) =>  {
                    resolve(docArray)
                })
                .catch((err) => {
                  resolve(err);
                });
            } else {
                let error = new Error("model does not exist");
                resolve(error)
            }
    });
}


/**
 * find document using query
 * @param model_name
 * @param query
 * @returns {Promise}
 */
export function find(model_name, query) {
    return new Promise((resolve) => {
        if( models[model_name]) {
            models[model_name].findAsync(JSON.parse(query))
                .then((docArray) => {
                    resolve(docArray)
                })
                .catch((err) => {
                    console.log(err);
                    resolve(err)
                });
        } else {
            let error = new Error("model does not exist");
            resolve(error)
        }
    });
}

/**
 * Find All Documents
 * @param model_name
 * @returns {Promise}
 */
export function show(model_name) {
    return new Promise((resolve) => {
        if( models[model_name]) {
            models[model_name].findAsync({})
                .then((docArray) => {
                    resolve(docArray)
                })
                .catch((err) => {
                    console.log(err);
                    resolve(err)
                });
        }else {
            let error = new Error("model does not exist");
            resolve(error)
        }
    });
}

/**
 * get document by id
 * @param model_name
 * @param id
 * @returns {Promise}
 */
export function getById(model_name,id){
    return new Promise((resolve) => {
        models[model_name].find({ _id : id },  (err, document) => {
            resolve(document);
        });
    })
}

/**
 * update document by id
 * @param model_name
 * @param id
 * @param data
 * @returns {Promise}
 */
export function updateById(model_name ,id ,data ) {
    return new Promise((resolve) => {
        models[model_name].findByIdAndUpdate( id, { $set: data }, (error, doc) => {
            resolve( doc );
        });
    });
}

/**
 * update document by query
 * @param model_name
 * @param key
 * @param value
 * @param data
 * @returns {Promise}
 */
export function updateByField(model_name,key,value,data ) {
    return new Promise((resolve) => {
        // TODO: refactor this to use  string templates
        const query = JSON.parse('{"'+key+'":"'+value+'"}');
        models[model_name].update(query, data , null, (error ,docs) => {
            resolve(docs);
        });
    });
}


/**
 * delete document by id
 * @param model_name
 * @param id
 * @returns {Promise}
 */
export function delById(model_name, id) {
    return new Promise((resolve) => {
        models[model_name].findByIdAndRemove(id, (error, docs) => {
            resolve(docs);
        });
    });
}

/**
 * delete document by query
 * @param model_name
 * @param key
 * @param value
 * @returns {Promise}
 */
export function delByField (model_name,key,value) {
    return new Promise((resolve) => {
        const query = JSON.parse(`{ " ${key} ":" ${value} "}`);
        models[model_name].remove(query, (error) => {
            resolve(error);
        });
    });
}

/**
 * get document count by collection name
 * @param model_name
 * @returns {Promise}
 */
export function count(model_name){
    return new Promise((resolve) => {
        models[model_name].count({}, (err, count) => {
            resolve(count);
        });
    });
}

/**
 * get document count by query
 * @param model_name
 * @param key
 * @param value
 * @returns {Promise}
 */
export function countFiltered(model_name,key,value){
    return new Promise((resolve) => {
        const query = JSON.parse(`{ " ${key} ":" ${value} "}`);
        models[model_name].count(query,  (err, count) => {
            resolve(count);
        });
    });
}

/**
 *
 * @param model_name
 * @param key
 * @param value
 * @param numberOfItemsPerPage
 * @param currentPage
 * @returns {Promise}
 */
export function filteredPagination(model_name,key,value,numberOfItemsPerPage,currentPage){
    const query = JSON.parse(`{ " ${key} ":" ${value} "}`);
    const  itemsPerPage = parseInt(numberOfItemsPerPage.toString());
    const itemsToSkip =  parseInt(itemsPerPage) * parseInt(currentPage.toString());
    return new Promise((resolve) => {
        let query = models[model_name].find(condition);
        query
            .skip(itemsToSkip)
            .limit(parseInt("'"+itemsPerPage+"'")) // TODO: refactor this to use  string templates
            .exec((err, results) => {
                resolve(results);
            });

    });
}

/**
 *
 * @param model_name
 * @param itemsPerPage
 * @param currentPage
 * @param sortByField
 * @param Criteria
 * @returns {Promise}
 */
export function sortedPagination(model_name,itemsPerPage,currentPage,sortByField,Criteria){
    return new Promise((resolve) => {
        const itemsToSkip =  parseInt(itemsPerPage) * parseInt(currentPage.toString());
        // TODO: refactor this to use  string templates

        const sortCriteria = JSON.parse('{"'+sortByField+'":"'+Criteria+'"}');
        models[model_name].
            find({})
            .limit(parseInt("'"+itemsPerPage+"'"))
            .skip( itemsToSkip )
            .sort(sortCriteria)
            .exec((err, docs) => {
                resolve(docs);
            });
    });
}
