'use strict';


import { models }  from './modelFactory';
export const engine =require('./mongoEngine');
export const $models = models;

const seed_path = process.env.MONGO_SEED_PATH || "";
let seeds ;

if(seed_path){
    seeds =  require(seed_path).seeds;
    Object.keys(seeds)
        .forEach((collection) => {
            let  collectionArray = seeds[collection];
            collectionArray.forEach((obj) => {
                engine.insert( collection ,  obj);
            });
            engine.show(collection).then((result) => {
                console.log(result)
            });
        });
}

