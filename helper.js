const sdata=require('./stores.json');
const fs=require('fs');
const array=[];

fs.readFile('./stores.json', 'utf8', function (err, data) {
   if (err) {
       console.log(err)
   } else {
       const file = JSON.parse(data);
    //    file.events.push({"id": title1, "year": 2018, "month": 1, "day": 3});
    //    file.events.push({"id": title2, "year": 2018, "month": 2, "day": 4});

       
       Object.keys(file.stores).forEach(key => array.push({
        id: key,
        type:file.stores[key].type,
        name:file.stores[key].name,
        route:file.stores[key].route,
        address:file.stores[key].address,
        area:file.stores[key].area,
        images:[]
     }));

     const json = JSON.stringify(array);
       fs.writeFile('./new.json', json, 'utf8', function(err){
            if(err){ 
                  console.log(err); 
            } else {
                  //Everything went OK!
            }});
   }

});