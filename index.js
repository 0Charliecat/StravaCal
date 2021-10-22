const express = require('express');
const request = require('teeny-request').teenyRequest;
const parseString = require('xml2js').parseString;
const { encode } = require('single-byte');
const ics = require('ics')
const keychain = require('./keychain.json')
const { writeFile } = require('fs')
const decoder = new TextDecoder('iso-8859-2');

// http://localhost:7890/cal/9977

const app = express();

app.get('/', (req, res) => {
    res.end("im alive")
});

app.get('/cal/:jidelna', (req, res) => {
  let jidelna;

  if (!req.params.hasOwnProperty('jidelna')) {
    jidelna = "0000"
  } else {
    jidelna = req.params.jidelna
  }
  let tobereturned;
  res.setHeader('Content-Type', 'text/calendar');
  request({uri: `http://www.strava.cz/foxisapi/foxisapi.dll/istravne.istravne.process?xmljidelnickyA&zarizeni=${jidelna}&jazy%20k=SK&httphlavicka=A`}, function (error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      //body = windows1250.encode(body, { mode: 'replacement' });
      let buf = Buffer.from(body, "ascii");
      //console.log(decoder.decode(buf))
      parseString(decoder.decode(buf), function (err, result) {
        res.end(makeCal(result.VFPData.pomjidelnic_xmljidelnic, jidelna))
        console.log(result.VFPData.pomjidelnic_xmljidelnic)
      });
  });
    
    console.log(jidelna)
    
});

/*function getStrava(jidelna) {
  if (jidelna === undefined) {
    jidelna = "0000"
  }
  let tobereturned;
    request({uri: `http://www.strava.cz/foxisapi/foxisapi.dll/istravne.istravne.process?xmljidelnickyA&zarizeni=${jidelna}&jazy%20k=SK&httphlavicka=A`}, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //body = windows1250.encode(body, { mode: 'replacement' });
        let buf = Buffer.from(body, "ascii");
        console.log(decoder.decode(buf))
        parseString(decoder.decode(buf), function (err, result) {
          tobereturned = makeCal(result.VFPData.pomjidelnic_xmljidelnic, jidelna);
        });
    });
    return tobereturned;
}*/
function makeCal(body, jidelna) {
    let events = []
    body.forEach((obed) => {
        let date = String(obed.datum[0])
        date = date.split('-')
        //console.log(date)
        let event = {
            calName: `Strava.cz Jídelna ${jidelna} • StravaCal`,
            productId: "charliecat/stravaCal",
            start: [Number(date[0]), Number(date[1]), Number(date[2]), Number(keychain.time[0]), Number(keychain.time[1])],
            duration: { hours: 0, minutes: 30 },
            title: obed.nazev.join(),
            description: `${obed.popis.join()}\n${obed.popis_al.join()}`,
            location: "Jedáleň",
            url: `https://www.strava.cz/strava/stravnik/jidelnicky?zarizeni=${jidelna}`,
            status: 'CONFIRMED',
            busyStatus: 'BUSY',
            organizer: { name: 'StravaCal • stravacal.charliecat.space', email: 'stravacal@charliecat.space'}
          }
          events.push(event)
    })
    let { error, value } = ics.createEvents(events)
      
      if (error) {
        console.log(error)
        return
      }
      console.log(value)
      
      return value
}

app.listen(7890, () => {
  console.log(`Server started on port 7890`);
});