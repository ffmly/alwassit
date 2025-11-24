const event = {
    id: "tx_" + Date.now(),
    amount: 120000, // Trigger limit
    location: "Moscow, RU", // Trigger location
    device: "Unknown Android",
    timestamp: Date.now()
};

console.log("--- SIMULATING SUSPICIOUS TX ---");
console.log("Payload:", event);
console.log("Run this inside your FraudContext or App logic to test the toast.");
console.log("If running the app, click 'Simulate Hack Attack' in the new Settings screen.");