/*
we are given a file of items with "old" prices to compare to another file of items with "new" prices.
where "item number" is blank, we want to use model number instead
we want the total difference between old and new costs (newCost-oldCost)
we want the % difference between old and new costs (newCost-oldCost)/newCost
*/

/* File "old" setup
Vendor Item number  Vendor Price
A1234 10.55
2345 11.99
*/

/* File "new" setup
Vendor Item number  Vendor Model number Vendor Price
A1234 1234  11.00
  2345  12.50
*/

var PriceComparison = {



  products : {},

  LoadFiles : function() {
    PriceComparison.products = {};
    PriceComparison.ImportOldPriceFile();
    PriceComparison.ImportNewPriceFile();
  },

  ExportReport : function() {
    let report_content = 'Item Code' + '\t' + 'Old Cost' + '\t' + 'New Cost' + '\t' + 'Difference' + '\t' + 'Difference (%)';

    for(let key in PriceComparison.products) {
      let product = PriceComparison.products[key];
      let oldCost = product['Old Price'];
      let newCost = product['New Price'];
      let difference = product['Difference'];
      let percentage = product['Difference (%)'];
      report_content += '\n' + key + '\t' + oldCost + '\t' + newCost + '\t' + difference + '\t' + percentage;
    }

    console.group('Report');
    console.log(report_content);
    console.groupEnd();

    const a = document.createElement('a');
    const file = new Blob([report_content], {type: 'text/plain'});
    a.href= URL.createObjectURL(file);
    a.download = 'Price Comparison Report.txt';
    a.click();
    a.remove();
  },

/*

  CalculateComparisons : function(products) {
    console.log('Calculating difference and difference %');

    console.group(`PriceComparison.products before CalculateComparisons`)
    console.log(PriceComparison.products);
    console.groupEnd();

    console.log('entering for loop');

    for(let key of Object.keys(products)) {
      console.group(key);
      let oldCost = parseFloat(PriceComparison.products[key]['Old Price']);
      console.log(`oldCost: ${oldCost}`);
      let newCost = parseFloat(PriceComparison.products[key]['New Price']);
      console.log(`newCost: ${newCost}`);
      let difference = parseFloat(oldCost - newCost);
      console.log(`difference: ${difference}`);
      let percentage = parseFloat((newCost - oldCost) / oldCost);
      console.log(`percentage: ${percentage}`);
      PriceComparison.products[key]['Difference'] = difference;
      PriceComparison.products[key]['Difference (%)'] = percentage;
      console.groupEnd();
    }

    console.log('exiting for loop');

    console.group(`PriceComparison.products after CalculateComparisons`)
    console.log(PriceComparison.products);
    console.groupEnd();
  },
*/


  ImportNewPriceFile : function() {
    let e = document.getElementById('NewPriceFileInput');
    var fr=new FileReader();
    fr.onload=function() {
      let lines = fr.result.split('\n');
      PriceComparison.ParseNewPriceFile(lines);
    }
    fr.readAsText(e.files[0]);
  },



  ParseNewPriceFile : function(lines) {
    for(let i=1; i<lines.length; i++) {
      if(lines[i].trim().length > 0) {
        let line = lines[i].split('\t');
        let itemcode = '';
        let modelnumber = '';
        let newprice = null;

        if(line.length > 0) {
          itemcode = line[0].trim();
        }

        if(line.length > 1) {
          modelnumber = line[1].trim();
        }

        if(line.length > 2) {
          newprice = parseFloat(line[2]);
        }

        if(itemcode.length==0) {
          itemcode = modelnumber;
        }

        if(itemcode.length>0) {
          if(!PriceComparison.products.hasOwnProperty(itemcode)) {
            PriceComparison.products[itemcode] = {};
          }
          PriceComparison.products[itemcode]['New Price'] = newprice;

          if(PriceComparison.products[itemcode]['Old Price'] != 0
          && PriceComparison.products[itemcode]['New Price'] != 0) {
            oldprice = PriceComparison.products[itemcode]['Old Price'];
            newprice = PriceComparison.products[itemcode]['New Price'];
            difference = parseFloat(newprice - oldprice);
            percentage = parseFloat(difference/oldprice);

            PriceComparison.products[itemcode]['Difference'] = difference;
            PriceComparison.products[itemcode]['Difference (%)'] = percentage;
          } else {
            PriceComparison.products[itemcode]['Difference'] = '';
            PriceComparison.products[itemcode]['Difference (%)'] = '';
          }
        }
      }
    }
  },



  ImportOldPriceFile : function() {
    let e = document.getElementById('OldPriceFileInput');

    var fr=new FileReader();
    fr.onload=function() {
      let lines = fr.result.split('\n');
      PriceComparison.ParseOldPriceFile(lines);
    }
    fr.readAsText(e.files[0]);
  },



  ParseOldPriceFile : function(lines) {
    for(let i=1; i<lines.length; i++) {
      if(lines[i].trim().length > 0) {
        let line = lines[i].split('\t');
        let itemcode;
        let currentprice;

        if(line.length > 0) {
          itemcode = line[0].trim();
        }

        if(line.length > 1) {
          currentprice = parseFloat(line[1].trim());
        }

        if(itemcode.length > 0) {
          if(!PriceComparison.products.hasOwnProperty(itemcode)) {
            PriceComparison.products[itemcode] = {};
          }
          PriceComparison.products[itemcode]['Old Price'] = currentprice;

          if(PriceComparison.products[itemcode]['Old Price'] != 0
          && PriceComparison.products[itemcode]['New Price'] != 0) {
            oldprice = PriceComparison.products[itemcode]['Old Price'];
            newprice = PriceComparison.products[itemcode]['New Price'];
            difference = parseFloat(newprice - oldprice);
            percentage = parseFloat(difference/oldprice);

            PriceComparison.products[itemcode]['Difference'] = difference;
            PriceComparison.products[itemcode]['Difference (%)'] = percentage;
          } else {
            PriceComparison.products[itemcode]['Difference'] = '';
            PriceComparison.products[itemcode]['Difference (%)'] = '';
          }
        }
      }
    }
  }
};
