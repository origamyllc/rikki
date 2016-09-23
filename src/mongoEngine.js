/**
 * Created by prashun on 9/22/16.
 */

const objectID = require('mongodb').ObjectID;
const mongoose = require('bluebird').promisifyAll(require('mongoose'));
const db = mongoose.connection;
import Promise from 'bluebird';
import { models }  from './modelFactory';

const url = process.env.MONGO_DB_URL ||  'mongodb://localhost/security-35';

connect(url);

export function connect(url) {
    mongoose.connect(url);
    db.on('error', console.error);
    db.once('open',  () => {
        console.log('connected to :' + url);
    });
}

export function bulkInsert(model_name, docArray) {
    return new Promise((resolve) => {
        models[model_name].createAsync(docArray)
            .then( (docArray) =>  {
                resolve(docArray)
            })
            .catch((err) => {
                resolve(err)
            });
    });
}

export function find(model_name, query) {
    return new Promise((resolve) => {
        models[model_name].findAsync(JSON.parse(query))
            .then((docArray) =>  {
                resolve(docArray)
            })
            .catch((err) => {
                console.log(err);
                resolve(err)
            });
    });
}

export function show(model_name) {
    return new Promise((resolve) => {
        models[model_name].findAsync({})
            .then((docArray) =>  {
                resolve(docArray)
            })
            .catch((err) => {
                console.log(err);
                resolve(err)
            });;
    });
}

export function getById(model_name,id){
    return new Promise((resolve) => {
        models[model_name].find({ _id : id },  (err, document) => {
            resolve(document);
        });
    })
}

export function updateById(model_name ,id ,data ) {
    return new Promise((resolve) => {
        models[model_name].findByIdAndUpdate( id, { $set: data }, (error, doc) => {
            resolve( doc );
        });
    });
}

export function updateByField(model_name,key,value,data ) {
    return new Promise((resolve) => {
        // TODO: refactor this to use  string templates
        const query = JSON.parse('{"'+key+'":"'+value+'"}');
        models[model_name].update(query, data , null, (error ,docs) => {
            resolve(docs);
        });
    });
}

export function delById(model_name, id) {
    return new Promise((resolve) => {
        models[model_name].findByIdAndRemove(id, (error, docs) => {
            resolve(docs);
        });
    });
}

export function delByField (model_name,key,value) {
    return new Promise((resolve) => {
        // TODO: refactor this to use  string templates
        const query = JSON.parse('{"'+key+'":"'+value+'"}');
        models[model_name].remove(query, (error) => {
            resolve(error);
        });
    });
}

export function count(model_name){
    return new Promise((resolve) => {
        models[model_name].count({}, (err, count) => {
            resolve(count);
        });
    });
}

export function countFiltered(model_name,key,value){
    return new Promise((resolve) => {
        // TODO: refactor this to use  string templates
        const query = JSON.parse('{"'+key+'":"'+value+'"}');
        models[model_name].count(query,  (err, count) => {
            resolve(count);
        });
    });
}

export function filteredPagination(model_name,key,value,numberOfItemsPerPage,currentPage){
    // TODO: refactor this to use  string templates
    const condition = JSON.parse('{"'+key+'":"'+value+'"}');
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
