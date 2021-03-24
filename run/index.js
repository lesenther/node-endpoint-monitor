require('../')({
  endpoint: `https://www.metaweather.com/api/location/2487956/`,
  compare: (a, b) => b.data.consolidated_weather[0].wind_direction !== a.data.consolidated_weather[0].wind_direction,
  action: result => console.log(`The wind has changed directions and is now heading ${result.data.consolidated_weather[0].wind_direction}`),
});