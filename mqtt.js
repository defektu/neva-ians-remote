// MQTT Configuration
const broker = "iomust.cloud.shiftr.io"; // Replace with your broker address
const port = 443; // Use 8883 for secure MQTT or 443 for websockets
const username = "iomust"; // Replace with your Shiftr.io username
const password = "eqdhdYeiwHmfZl7o"; // Replace with your Shiftr.io password

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const queryID = getQueryParam("id");
var topicName = "Neva_Unity_MQTT";
if (queryID != null) topicName += `_${queryID}`;

// Create an MQTT client
const client = new Paho.MQTT.Client(
  broker,
  port,
  "IansClient-" + Math.random()
);

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
  updateSlider("slider1", `Content_Scene`, 0);
  updateSlider("slider1", `Car_GearState`, 0);
  updateSlider("slider1", `Speed`, 0);
}

var localSpeed = 0;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function disableInputs() {
  const inputs = document.querySelectorAll("input"); // Select all input elements
  inputs.forEach((input) => (input.disabled = true)); // Disable each input
  console.log("All inputs disabled");
}

// Function to re-enable all inputs
function enableInputs() {
  const inputs = document.querySelectorAll("input"); // Select all input elements
  inputs.forEach((input) => (input.disabled = false)); // Enable each input
  console.log("All inputs enabled");
}
function setRangeValue(value) {
  // Get the range input and output elements
  const range = document.querySelector('input[name="range"]');
  const output = document.querySelector('output[name="output"]');

  const offset = document.querySelector(".rangeslider-thumb");
  const offset2 = document.querySelector(".rangeslider-fill-lower");

  offset.style.left = "0px";
  offset2.style.width = "12px";

  // Update the range value
  range.value = value;

  // Update the output value
  output.value = Math.round(range.valueAsNumber);

  // Optionally, call any additional functions like `updateSlider`
}

async function updateSlider(sliderId, topic, value) {
  if (topic == `Speed`) {
    localSpeed = value;
  }
  if (topic == `Car_GearState`) {
    if (value == 3) {
      document.getElementsByClassName("speedContainer")[0].style.visibility =
        "visible";
    } else {
      if (localSpeed != 0) {
        localSpeed = 0;
        document.getElementsByClassName("speedContainer")[0].style.visibility =
          "hidden";
        updateSlider("input2", `Speed`, 0);
        setRangeValue(0);
        disableInputs();
        await delay(2000);
        enableInputs();
      }
      document.getElementsByClassName("speedContainer")[0].style.visibility =
        "hidden";
    }
  }
  // Update the displayed value
  //   document.getElementById(`value${sliderId.slice(-1)}`).textContent = value;

  // Publish the value to the MQTT topic
  const message = new Paho.MQTT.Message(value.toString());
  message.destinationName = topicName + "/" + topic;
  console.log(message.destinationName, value.toString());
  client.send(message);
}
