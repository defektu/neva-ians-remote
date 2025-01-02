// MQTT Configuration
const broker = "iomust.cloud.shiftr.io"; // Replace with your broker address
const port = 443; // Use 8883 for secure MQTT or 443 for websockets
const username = "iomust"; // Replace with your Shiftr.io username
const password = "eqdhdYeiwHmfZl7o"; // Replace with your Shiftr.io password

// Create an MQTT client
const client = new Paho.MQTT.Client(broker, port, "webClient-" + Math.random());

// Connect to the broker
client.connect({
  onSuccess: onConnect,
  userName: username,
  password: password,
  useSSL: true,
});

client.onConnectionLost = (response) => {
  console.error("Connection lost: " + response.errorMessage);
};

function onConnect() {
  console.log("Connected to MQTT broker");
}

function updateSlider(sliderId, topic, value) {
  // Update the displayed value
  //   document.getElementById(`value${sliderId.slice(-1)}`).textContent = value;

  // Publish the value to the MQTT topic
  const message = new Paho.MQTT.Message(value.toString());
  message.destinationName = topic;
  console.log(topic, value.toString());
  client.send(message);
}
