const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const siteSchema = new mongoose.Schema({
    name: String,
    description: String,
    state: String,
    floors: [
                [
                    {
                        stores: [
                                    {   
                                        store: String, 
                                        category: String, 
                                    }
                                ],
                        conf: String,
                        nodes: [
                            {
                                _id: String,
                                name: String,
                                category: String,
                                x: Number,
                                y: Number,
                            }
                        ],
                        adjacency: [
                            {
                                _id: String,
                                to: String,
                                from: String,
                                distance: Number,
                                x1: Number,
                                x2: Number,
                                y1: Number,
                                y2: Number
                            }
                        ]
                    }
                ]
            ],
    
})

const User = new mongoose.model("User", userSchema)
const Site = new mongoose.model("Site", siteSchema)

module.exports = {User, Site};