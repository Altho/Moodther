const apiKey = "8a82d71c8b51b2ae22335955553b03ef"
const inputField = document.querySelector('.city-input')
const button = document.querySelector('button')
const header = document.querySelector('header')
const toggle = document.querySelector('.toggle');
const infobar = document.querySelector('.infobar')
const container = document.querySelector('.container');
let unit = "imperial";
let notation = "°F"
let city;

button.addEventListener('click', handleClick)

toggle.addEventListener('click', () => {
    if (unit === "imperial") {
        unit = "metric";
        notation = "°C"
        console.log(unit);
    } else {
        unit = "imperial"
        notation = "°F"

        console.log(unit);

    }
    if (city) {
        getWeather();

    }


})

function handleClick(e) {
    e.preventDefault();
    getWeather();

}


async function getWeather() {
    if (inputField.value) {
        city = inputField.value

    }
    try {
        loaderOn();
        const weather = await fetch(`https:/api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`, {
            mode: 'cors'
        });
        const weatherTreated = await weather.json();
        const id = weatherTreated.weather[0].id;
        const temp = weatherTreated.main.temp;
        const country = weatherTreated.sys.country;
        const icon = weatherTreated.weather[0].icon;
        const lat = weatherTreated.coord.lat;
        const lon = weatherTreated.coord.lon;
        const clouds = weatherTreated.clouds.all;
        const weatherMessage = weatherTreated.weather[0].description

        const extraInfos = [
            {
                name: 'Temperature Max',
                source: weatherTreated.main.temp_max + notation,
                image: './images/icons/max.png'
            },
            {
                name: 'Temperature Min',
                source: weatherTreated.main.temp_min + notation,
                image: './images/icons/min.png'
            },
            {
                name: 'Feels like',
                source: weatherTreated.main.feels_like + notation,
                image: './images/icons/feelslike.png'
            },
            {
                name: 'Humidity',
                source: weatherTreated.main.humidity + " %",
                image: './images/icons/humidity.png'
            },
            {
                name: 'Pressure',
                source: weatherTreated.main.pressure + ' hPa',
                image: './images/icons/barometer.png'
            },
            {
                name: 'Sunrise',
                source: new Date(weatherTreated.sys.sunrise * 1000).toLocaleTimeString("en-US"),
                image: './images/icons/sunrise.png'


            },
            {
                name: 'Sunset',
                source: new Date(weatherTreated.sys.sunset * 1000).toLocaleTimeString("en-US"),
                image: './images/icons/sunset.png'
            },

        ]


        drawMap(lat, lon);

        console.log(weatherTreated);
        setPageStyle(id, clouds);
        showBasicInfos(weatherTreated.name, temp, country)
        iconBar(weatherMessage, icon);
        additionalInfos(extraInfos)
        loaderOff();
        inputField.value = "";

    } catch (e) {
        alert(e)
    }

}

function showBasicInfos(city, temp, code) {
    while (infobar.firstChild) {
        infobar.removeChild(infobar.firstChild);
    }

    const infoContainer = document.createElement('div');
    infoContainer.classList.add('info-container')

    const showTemp = document.createElement('div');
    showTemp.classList.add('temperature');
    showTemp.innerHTML = temp + notation;

    const showCity = document.createElement('div');
    showCity.classList.add('city')
    showCity.innerText = city;


    const flag = new Image();
    flag.src = `https://www.countryflags.io/${code}/shiny/24.png`
    infoContainer.appendChild(showCity);
    infoContainer.appendChild(showTemp);
    showCity.appendChild(flag);
    infobar.appendChild(infoContainer)

}

function iconBar(msg, icon) {
    if (document.querySelector('.icon-bar')) {
        document.querySelector('.icon-bar').remove();
    }
    const bar = document.createElement('div');
    bar.classList.add('icon-bar');

    container.appendChild(bar);

    const Wicon = new Image();
    Wicon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    Wicon.classList.add('icon')
    Wicon.height = 50;

    const weatherMsg = document.createElement('div');
    weatherMsg.classList.add('weather-msg');
    weatherMsg.innerText = msg;
    bar.appendChild(Wicon);
    bar.appendChild(weatherMsg);


}

function drawMap(lat, lon) {
    const mapContainer = document.querySelector('.map-container')
    while (mapContainer.firstChild) {
        mapContainer.removeChild(mapContainer.firstChild);
    }
    const newMap = document.createElement('div');
    newMap.id = 'map';
    mapContainer.appendChild(newMap);

    const mymap = L.map('map').setView([lat, lon], 7);

    const marker = L.marker([lat, lon]).addTo(mymap);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 8,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYWx0aG8iLCJhIjoiY2t1cGZxNTJvMWQ1NjJvcGYycmRsNmcyNyJ9.GqOIWKdW913aksdkx_d5IA'
    }).addTo(mymap);

    L.tileLayer('https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 8,
        tileSize: 512,
        zoomOffset: -1,
        accessToken: '8a82d71c8b51b2ae22335955553b03ef'
    }).addTo(mymap);
    L.tileLayer('https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 8,
        tileSize: 512,
        zoomOffset: -1,
        accessToken: '8a82d71c8b51b2ae22335955553b03ef'
    }).addTo(mymap);
    L.tileLayer('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 8,
        tileSize: 512,
        zoomOffset: -1,
        accessToken: '8a82d71c8b51b2ae22335955553b03ef'
    }).addTo(mymap);

}


function additionalInfos(extraInfos) {
    if (document.querySelector('table')) {
        document.querySelector('table').remove();
    }
    const infos = document.createElement('table');

    for (let info of extraInfos) {
        console.log(info.name)
        console.log(info.source)
        const infoTr = document.createElement('tr');

        const name = document.createElement('td');
        const source = document.createElement('td');
        const image = new Image();
        image.src = info.image;
        name.innerText = info.name;
        source.innerText = info.source;
        infoTr.appendChild(image);
        infoTr.appendChild(name);
        infoTr.appendChild(source);
        infos.appendChild(infoTr)
        container.appendChild(infos);

    }
}


function setPageStyle(id, clouds) {
    document.body.className = "";
    header.className = "";


    if (id > 199 && id < 300) {
        document.body.classList.add('background-200')
        console.log('weather')
        header.className = 'header-200';


    } else if (id >= 300 && id < 399) {
        document.body.classList.add('background-300')
        checkClouds(clouds);


    } else if (id >= 500 && id < 599) {
        document.body.classList.add('background-500')
        checkClouds(clouds);


    } else if (id >= 600 && id < 699) {
        document.body.classList.add('background-600')
        header.classList.add('header-snow')


    } else if (id >= 700 && id < 799) {
        document.body.classList.add('background-700')
        checkClouds(clouds);


    } else if (id >= 800 && id < 899) {
        document.body.classList.add('background-800')
        checkClouds(clouds);


    }


}

function checkClouds(clouds) {
    if (clouds > 0) {
        header.className = 'header-clouds';

    }
}

function loaderOn() {
    const veil = document.createElement('div');
    veil.classList.add('veil');
    document.body.appendChild(veil);
    const spinner = document.createElement('div');
    spinner.classList.add('lds-ellipsis');
    spinner.innerHTML = '<div></div><div></div><div></div><div></div>';
    veil.appendChild(spinner);
}

function loaderOff() {
    const veil = document.querySelector('.veil');
    veil.remove();
}