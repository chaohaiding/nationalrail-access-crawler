var http = require("http");
var cheerio = require("cheerio");
var Entities = require('html-entities').Html4Entities;
entities = new Entities();
var fs = require('fs');
var csv = require('csv');
var async=require('async');
// Utility function that downloads a URL and invokes
// callback with the data.


function crawler(url, callback) {
  http.get(url, function(res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on("end", function() {
      callback(data);
    });
  }).on("error", function() {
    callback(null);
  });
}


csv()
.from.path(__dirname+'/RailReferences.csv', { delimiter: ',', escape: '"' })
.to.array(function(data){
  var station_list=[];
  var i=0;
  async.eachSeries(data,function(row,callback){
  var url="http://www.nationalrail.co.uk/stations_destinations/"+row[2]+".aspx";
  crawl(url,function(obj)
  {
   if(row[3]=="StationName") 
    {
     i++;
    }
    else
    {
     station_list[i-1]='{"StationName":"'+row[3]+'", "AtcoCode":"'+row[0]+'", "tiplocCode":"'+row[1]+'", "CrsCode":"'+row[2]+'", "Easting":"'+row[6]+'", "Northing":"'+row[7]+'", "CreationDateTime":"'+row[8]+'", "ModificationDateTime":"'+row[9]+'", "RevisionNumber":"'+row[10]+'","Detail Information":'+JSON.stringify(obj)+'}';
     console.log("No:"+i+": StationName:"+row[3]+"is extracted!");
     i++;
    }
    callback();
   });

  }, function(err){ if(err) console.log(err);
  else
  {
    var myStream="["+station_list+"]";
    fs.writeFile('./railway.json',myStream, function (err) {
      if (err) console.log (err);
       console.log("Total stations:"+i);
       console.log('It\'s saved to railway.json');});
   }
   });
  
});

/* crawl mainly use the crawler to crwawling the requested url and parse the 
* html file using cheerio.
*
* reurn the json of station entity 
*/
function crawl(url, callback){
crawler(url, function(data) {
  if (data) {
    var $ = cheerio.load(data);
    var str_head=$(".head.clear h3");
    var station_heading={};
    for(var i=0;i<str_head.length;i++)
    {
     var str_head_text=str_head.eq(i).text();
     var str_dt=$(".acc-c dl.zebra").eq(i).find("dt");
     var str_dd=$(".acc-c dl.zebra").eq(i).find("dd");
     var m=str_dt.length;
     var station_element={};
     for(var j=0;j<m;j++)
     {
      var str_dd_next=str_dt.eq(j).next("dt").text();
      var str_dd_prev=str_dt.eq(j+1).prev("dt").text();
      var str_key=entities.decode(str_dt.eq(j).text());
      var str_value="";
      if(str_dd_next!=str_dd_prev)
      {
       str_value=entities.decode(str_dd_next)+". "+entities.decode(str_dd_prev);
      }
      else
      {
       str_value=entities.decode(str_dd_prev);
       
      }
     // console.log(str_key);
     // console.log(str_value);
      station_element[str_key.replace(/[\r\n]/g," ")]=str_value.replace(/[\r\n]/g," ");
     // console.log(JSON.stringify(station_element));
     }
     station_heading[str_head_text]=station_element;
  //   console.log(station_heading[i]);
    }
    callback(station_heading);
  }
  else console.log("error");
});
}