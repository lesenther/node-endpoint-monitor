const axios = require('axios');

// System config
const defaults = {
  interval : 10,    // Seconds between each check
  timeout  : 2,     // Maximum number of seconds a check can take before failing
  verbose  : false, // Show log messages
  endpoint : null,  // Endpoint to watch
  compare  : (a, b) => JSON.stringify(a) !== JSON.stringify(b),
  action   : response => console.notice(response),
  persist  : false, // Persist on errors
};

let previousResult = false;

/**
 * Initialize monitor
 * 
 * @param {*} config 
 */
function init(config = {}) {
  // Print info
  console.log(`Monitoring endpoint...${config.verbose ? ' (verbose)' : ''}`);

  // Import user config replacing system params
  config = { ...defaults, ...config };

  // Start listening to endpoint
  listen(config);
}

/**
* Continuously monitor the internet connection and reset the device when offline.
* 
*/
async function listen(config = {}) { 
  // Immediately check state
  const status = await checkEndpoint(config);

  if (!status && !config.persist) {
    return console.error('Check failed.  Not set to persist, aborting...');
  }

  // Schedule next check
  setTimeout(_ => listen(config), config.interval * 1000);
}

/**
* Check endpoint, 
* 
* @param {object} config 
*/
async function checkEndpoint(config) {
  try {
    if (config.verbose) {
      console.log(`Checking endpoint... [${new Date().toLocaleString()}]`);
    }
    
    const result = await axios.get(config.endpoint, { timeout: config.timeout * 1000 });
    
    if (config.verbose) {
      console.log(`Result: `, JSON.stringify(result.data));
    }
  
    if (config.compare(result.data, previousResult)) {
      config.action(result.data);
    }
  
    previousResult = result.data;
  
    return true;
  } catch (err) {
    console.error(`Fail:  ${err.message}`);

    return false;
  }
}

module.exports = init;