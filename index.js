const fetch = require('node-fetch');
const config = require('./config.json');
const mqtt = require('mqtt');
const api = require('./weatherapi.json');

const client = mqtt.connect('mqtts://mqtt.ably.io');

client.on('connect', (options) => {
  client.subscribe(`${config.token}/weather`, (err) => {
    if (err) {
      console.error(err);
    }
  });

  console.log('Connected successfully');
});

client.on('message', async (city) => {
  const weather = await getWeather(city);
  console.log(weather);
});

async function getWeather(city) {
  const url = `${api.url}?q=${city || api.city}&appid=${api.apiKey}&units=${
    api.units
  }`;

  const response = await (await fetch(url)).json();
  return response;
}

client.emit('message', 'Dnipro')