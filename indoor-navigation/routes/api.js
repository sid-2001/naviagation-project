const express = require('express');
const router = express.Router();
const  ObjectID = require('mongodb').ObjectId;

const {User, Site} = require('../models/schema');

var bcrypt = require('bcrypt');
const saltRounds = 10;

router.post("/Login",(req,res)=>{
    const {email,password} =req.body;
    User.findOne({email:email},(err,user)=>{
        if(user){
            bcrypt.compare(password, user.password, function (err, result){
                if(result === true){
                   res.send({message:"login sucess",user:user})
                }else{
                   res.status(400).send({message:"wrong credentials"})
                }
            })
        }
        else{
            res.status(400).send("not registered")
        }
    })
});

router.post("/Register",(req,res)=>{
    const {name,email,password} = req.body;
    User.findOne({email:email},(err,user)=>{
        if(user){
            res.send({message:"user already exist"})
        }else {
            bcrypt.hash(password, saltRounds, function (err,   hash) {
                console.log(hash)
                const user = new User({name,email,password: hash})
                user.save(err=>{
                    if(err){
                        res.send(err)
                    }else{
                        res.send({message:"sucessfull"})
                    }
                })
            })
            
        }
    })


}) 

router.post("/AddSite", (req, res) => {
    const {name, description, floors} = req.body;
    Site.findOne({name:name},(err,site)=>{
        if(site){
            res.send({message:"Site already exists"})
        }else {
            const site = new Site({name, description, floors, state: "incomplete"})
            site.save(err=>{
                if(err){
                    res.send(err)
                }else{
                    res.send({message:"sucessfull"})
                }
            })
        }
    })
})

router.get("/GetSites", (req, res) => {
    ret_arr = []

    Site.find().then((sites) => {
        console.log(sites.length)
        sites.forEach((siteItem) => {
            console.log(siteItem.name)
            ret_arr.push({"name": siteItem.name, "status": siteItem.state})
        });
      }).then(() => {
        console.log(ret_arr)
        res.send(ret_arr)
      });

    
})

router.post("/GetFloor", (req, res) => {
    const {name, floor} = req.body
    Site.findOne({name:name},(err,site)=>{
        if(site){
            res.send({"floor": site.floors[floor]})
        }else {
            res.send({message:"Site does not exist"})
            
        }
    })
})

router.post("/GetSiteFloors", (req, res) => {
    const {name} = req.body
    Site.findOne({name:name},(err,site)=>{
        if(site){
            res.send({"floors": site.floors})
        }else {
            res.send({message:"Site does not exist"})
            
        }
    })
})

router.post("/AddNode", (req, res) => {
    const {name, floor, floorId, category, nodeName, x, y} = req.body

    Site.findOne({name:name},(err,site)=>{
        if(site){
            site.floors[floor][0]["nodes"].push({"_id": ObjectID(), "name": nodeName, "category": category, "x": x, "y": y})
            site.save(err=>{
                if(err){
                    res.send(err)
                }else{
                    res.send({message:"sucessfull"})
                }
            })
        }else {
            res.send({message:"Site does not exist"})
            
        }
    })
})

router.post("/AddNodePair", (req, res) => {
    const {name, floor, nodeA, nodeB, distance, x1, x2, y1, y2} = req.body

    Site.findOne({name:name},(err,site)=>{
        if(site){
            site.floors[floor][0]["adjacency"].push({"to": nodeA, "from": nodeB, "distance": distance, "x1": x1, "x2": x2, "y1": y1, "y2": y2})
            site.save(err=>{
                if(err){
                    res.send(err)
                }else{
                    res.send({message:"sucessfull"})
                }
            })
        }else {
            res.send({message:"Site does not exist"})
            
        }
    })
})

router.post("/GetStoresAndCategories", (req, res) => {
    const {name, floor} = req.body

    Site.findOne({name: name}, (err, site)=>{
        if(site){
            const categories = new Set();

            const storeDets = []
            for (var i = 0; i < site.floors[floor][0].stores.length; i++) {
                categories.add(site.floors[floor][0].stores[i]["category"])
                storeDets.push(site.floors[floor][0].stores[i]["store"])
            }

            console.log(site.floors[floor][0].stores, categories)
            res.send({"categories": Array.from(categories), "stores": storeDets})
        }
        else{
            res.send({message:"Site does not exists"})
        }
    })
})

module.exports = router;