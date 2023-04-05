let map;
let directionsService;
let directionsRenderer;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 45.5, lng: 25 },
    zoom: 7,
  });
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    panel: document.getElementById("directions-panel"),
  });
}

function calculateRoute(event) {
    event.preventDefault();
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;
  
    const stops = document.querySelectorAll(".stop");
    const waypoints = [];
    let totalDuration = 0;
  
    stops.forEach((stop, index) => {
      const location = stop.querySelector("input[name^='stop']").value;
      if (location) {
        const duration = parseInt(stop.querySelector("input[name^='duration']").value) || 0;
        waypoints.push({
          location: location,
          stopover: true,
        });
        totalDuration += duration;
      }
    });
  
    const travelMode = document.getElementById("travelMode").value;
  
    let request = {
      origin: start,
      destination: end,
      waypoints: waypoints,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
    };
  
    if (travelMode === "TRANSIT") {
      request.travelMode = google.maps.TravelMode.TRANSIT;
    }
  
    directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
        
        const route = result.routes[0];
        const summaryPanel = document.getElementById("directions-panel");
        summaryPanel.innerHTML = "";
        const length = route.legs[0].distance.text;
        const duration = route.legs[0].duration.text;
        const totalDurationText = formatDuration(totalDuration);
        summaryPanel.innerHTML += "<strong>Route Length:</strong> " + length + "<br>";
        summaryPanel.innerHTML += "<strong>Estimated Time by Car:</strong> " + duration + "<br>";
        summaryPanel.innerHTML += "<strong>Estimated Time with Stops:</strong> " + totalDurationText + "<br>";
        const tableBody = document.querySelector("tbody");
        tableBody.innerHTML = "";
        for (let i = 0; i < route.legs.length; i++) {
        }
      } else {
        alert("Directions request failed: " + status);
      }
    });
}

  

function formatDuration(durationInMinutes) {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  let text = "";
  if (hours > 0) {
    text += hours + " hours ";
  }
  text += minutes + " minutes";
  return text;
}

const form = document.querySelector("form");
form.addEventListener("submit", calculateRoute);
