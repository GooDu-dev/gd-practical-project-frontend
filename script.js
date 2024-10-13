function startTracking() {
    if ("geolocation" in navigator) {
        console.log("start trakcing")
        navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            let lat = latitude.toFixed(7)
            let long = longitude.toFixed(7)
            console.log(`Latitude: ${lat}, Longitude: ${long}`);
            setLatLong(lat, long)
            // Here you can send the data to a server or display it on a map
        }, (error) => {
            console.error("Error getting position: ", error);
        }, {
            enableHighAccuracy: true,
            timeout: 5000
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function requestPermission(){
    if("geolocation" in navigator){
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            let lat = latitude.toFixed(7)
            let long = longitude.toFixed(7)
            console.log(`Latitude: ${lat}, Longitude: ${long}`);
            setLatLong(lat, long)
        }, error => {
            console.log(error)
        }, {
            enableHighAccuracy: true,
            timeout: 1000
        })
    }
}

size = 3
let lats = Array(size)
let longs = Array(size)
let last_index = 0

function setLatLong(lat, long){
    const LAT = document.querySelector('#lat')
    const LONG = document.querySelector('#long')
    addToArray(lats, lat)
    addToArray(longs, long)
    let lat_v = findAvgValue(lats)
    let long_v = findAvgValue(longs)
    last_index = (last_index + 1) % size 
    LAT.innerText = lat_v.toFixed(7)
    LONG.innerText = long_v.toFixed(7)
}

function findAvgValue(arr){
    count = 0
    total = 0
    console.log(arr[0], arr[1], arr[2])
    for(let a of arr){
        if(!a){
            break
        }
        total += Number(a)
        count++
    }
    console.log(total, count)
    return total / Math.min(count, size)
}

function addToArray(arr, value){
    arr[last_index] = value
}

startTracking();