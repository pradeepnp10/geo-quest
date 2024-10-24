// app.js

// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13); // Default view

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Add zoom control
L.control.zoom({
    position: 'topright' // You can change the position as needed (e.g., 'topleft', 'bottomright', etc.)
}).addTo(map);

// Add scale control
L.control.scale().addTo(map);

// Define markers with questions
const markers = [
    { position: [51.505, -0.09], question: "What is 2 + 2?", answer: "4" },
    { position: [51.51, -0.1], question: "What is the capital of France?", answer: "Paris" },
];

// Add markers to the map
markers.forEach(marker => {
    L.marker(marker.position).addTo(map);
});

// Start game button
document.getElementById('startGameButton').addEventListener('click', startGame);

function startGame() {
    alert("Game Started! Move around to find questions.");
    // Get user's current position
    navigator.geolocation.getCurrentPosition(position => {
        const userPosition = [position.coords.latitude, position.coords.longitude];
        map.setView(userPosition, 13); // Center the map on the user's location
        L.marker(userPosition).addTo(map).bindPopup("You are here!").openPopup();

        // Check proximity to markers every 5 seconds
        setInterval(() => {
            checkProximity(userPosition);
        }, 5000);
    });
}

function checkProximity(userPosition) {
    markers.forEach(marker => {
        const distance = getDistance(userPosition, marker.position);
        if (distance < 10) { // 10 meters
            showPopupQuestion(marker.question, marker.answer);
        }
    });
}

function getDistance(pos1, pos2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = pos1[0] * Math.PI / 180; // φ, λ in radians
    const φ2 = pos2[0] * Math.PI / 180;
    const Δφ = (pos2[0] - pos1[0]) * Math.PI / 180;
    const Δλ = (pos2[1] - pos1[1]) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in meters
}

function showPopupQuestion(question, correctAnswer) {
    const userAnswer = prompt(question);
    const messageElement = document.getElementById('message'); // Get the message element
    messageElement.style.display = 'none'; // Hide the message initially

    if (userAnswer === correctAnswer) {
        alert("Correct!");
        messageElement.style.display = 'none'; // Hide message if correct
    } else {
        messageElement.textContent = "You lost"; // Set the message
        messageElement.style.display = 'block'; // Show the message
    }
}

function updateScore(newScore) {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = newScore;
}

// Example usage: updateScore(10); // Call this function to update the score



