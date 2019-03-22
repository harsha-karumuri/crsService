'use strict';

var server = require('./server');
var ds = server.dataSources.CRS_DB;

function processError(err, dmodels) {
  if (err) {
    console.log('Error: ' + err);
  }
  if (dmodels) {
    var fs = require('fs');
    //onsole.log(JSON.parse(JSON.stringify(dmodels, null, 2)).options);
    var modelName = JSON.parse(JSON.stringify(dmodels, null, 2)).options.mssql.table.replace(/_/g, '-');
    modelName = modelName.toLowerCase();
    console.log(modelName);
    fs.writeFile(
      '../common/models/' + modelName.toLocaleLowerCase() + '.json',
      JSON.stringify(dmodels, null, 2),
      function(err) {
        if (err) {
          return console.log(err);
        }

        console.log('The file was saved!');
      }
    );
  }

  ds.disconnect();
}
// Discover and build models from INVENTORY table
ds.discoverSchema('STUDENT_PAST_DATA', { visited: {}, associations: true }, processError);
