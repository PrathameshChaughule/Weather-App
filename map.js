let map;
let service;
let infowindow;

function initMap() {
    // Initialize the map centered at a default location (e.g., New York City)
    const defaultLocation = { lat: 40.7128, lng: -74.0060 };
    map = new google.maps.Map(document.getElementById("map"), {
        center: defaultLocation,
        zoom: 13,
    });

    infowindow = new google.maps.InfoWindow();
    const input = document.getElementById("userLocation");
    const searchButton = document.getElementById("search-button");

    searchButton.addEventListener("click", () => {
        const query = input.value;
        if (query) {
            searchLocation(query);
        }
    });
}

function searchLocation(query) {
    const request = {
        query: query,
        fields: ["name", "geometry"],
    };

    service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            for (let i = 0; i < results.length; i++) {
                const place = results[i];
                if (place.geometry && place.geometry.location) {
                    map.setCenter(place.geometry.location);
                    createMarker(place);
                }
            }
        } else {
            alert("Location not found.");
        }
    });
}

function createMarker(place) {
    if (!place.geometry || !place.geometry.location) return;

    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
    });

    google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent(place.name || "");
        infowindow.open(map, marker);
    });
}