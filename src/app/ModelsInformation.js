import moment from 'moment';
import axios from 'axios';

const { GoogleSpreadsheet } = require('google-spreadsheet');

/* eslint-disable no-alert, no-console */
export default {
  data: function() {
    return {
      tableData: [],
    };
  },
  methods: {
    createTable: async function(sheetRows, keywords) {
      for (let i = 0; i < sheetRows.length; i++) {
        let mappedData = {};
        for (let j = 0; j < keywords.length; j++) {
          let keyword = keywords[j];

          if (keyword === 'Last modified') {
              const dateStr = sheetRows[i][keyword];
              mappedData[keyword] = moment(dateStr, 'MMMM D, YYYY').format('MMM D, YYYY');
          } else {
              mappedData[keyword] = sheetRows[i][keyword];
          }
        }
        this.tableData.push(mappedData);
      }
    },
    getModelsInformation: async function() {
      const doc = new GoogleSpreadsheet(process.env.VUE_APP_GOOGLE_SPREADSHEET_ID);
      await doc.useServiceAccountAuth({
        private_key: process.env.VUE_APP_GOOGLE_PRIVATE_KEY,
        client_email: process.env.VUE_APP_GOOGLE_SERVICE_EMAIL
      });
      await doc.loadInfo(); // loads document properties and worksheets
      const sheet = doc.sheetsByIndex[0];
      const sheetRows = await sheet.getRows();
      const keys = ["Organ", "Species", "Note", "Location",
        "Last modified","Blackfynn dataset", "Published", "Discover"];
      this.createTable(sheetRows, keys);
    },
    // Define a function called 'getSortDate' that takes two arguments 'a' and 'b'
    getSortDate: function(a, b) {
        // Parse the 'Last modified' values from objects 'a' and 'b' as dates using the 'moment' library
        const dateA = moment(a['Last modified'], 'MMMM D, YYYY');
        const dateB = moment(b['Last modified'], 'MMMM D, YYYY');

        // Compare the parsed dates
        if (dateA < dateB) {
            // If dateA is earlier than dateB, return -1 to indicate it should come first in sorting
            return -1;
        } else if (dateA > dateB) {
            // If dateA is later than dateB, return 1 to indicate it should come after dateB in sorting
            return 1;
        } else {
            // If dateA and dateB are equal, return 0 to indicate they are the same in sorting
            return 0;
        }
    },
    // Define a function called 'getDateAsJson' that asynchronously prepares and downloads JSON data
    getDateAsJson: async function() {
        // Convert the 'tableData' to a JSON string with proper formatting (2 spaces for indentation)
        const json = JSON.stringify(this.tableData, null, 2);

        // Create a Blob object from the JSON data with the MIME type 'application/json'
        const blob = new Blob([json], { type: "application/json" });

        // Create a URL for the Blob data
        const url = window.URL.createObjectURL(blob);

        // Make an AJAX request using Axios to fetch the Blob data as a blob
        axios({
            url,                   // URL of the Blob data
            method: 'GET',         // HTTP GET request
            responseType: 'blob',  // Response type as 'blob'
        }).then((response) => {
            // Create a URL for the fetched Blob data
            const fileURL = window.URL.createObjectURL(new Blob([response.data]));

            // Create a link element to trigger the download
            const fileLink = document.createElement('a');

            // Set the link's href attribute to the file URL
            fileLink.href = fileURL;

            // Set the 'download' attribute to specify the downloaded file's name as 'data.json'
            fileLink.setAttribute('download', 'data.json');

            // Set the 'target' attribute to open the link in a new browser tab/window
            fileLink.setAttribute('target', '_blank');

            // Append the link to the document body
            document.body.appendChild(fileLink);

            // Simulate a click event on the link to trigger the download
            fileLink.click();
        });
    }
  }
}
