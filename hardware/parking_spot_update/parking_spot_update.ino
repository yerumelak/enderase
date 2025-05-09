#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char* ssid = "Vamos";
const char* password = "987654321";

const String spotNames[4] = {"A1", "A2", "A3", "A4"};
const int sensorPins[4] = {4, 15, 12, 14}; // D2, D1, D6, D5
j
bool lastStatus[4] = {false, false, false, false}; // false = no object, true = object present

void setup() {
  Serial.begin(115200);
  for (int i = 0; i < 4; i++) {
    pinMode(sensorPins[i], INPUT);
  }

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
}

void loop() {
  for (int i = 0; i < 4; i++) {
    int sensorValue = digitalRead(sensorPins[i]);
    bool objectDetected = (sensorValue == LOW); // Adjust if logic inverted

    if (objectDetected != lastStatus[i]) {
      lastStatus[i] = objectDetected;

      WiFiClient client;
      HTTPClient http;

      String status = objectDetected ? "object_detected" : "no_object";
      String serverUrl = "http://192.168.6.203:8000/update/" + spotNames[i] + "/";

      http.begin(client, serverUrl);
      http.addHeader("Content-Type", "application/json");

      String jsonPayload = "{\"status\":\"" + status + "\"}";
      Serial.print("Sending to " + spotNames[i] + ": ");
      Serial.println(jsonPayload);

     const int maxRetries = 3;
      int attempt = 0;
      int httpCode = -1;

      while (attempt < maxRetries) { 
        httpCode = http.POST(jsonPayload);

        if (httpCode > 0) {
          String payload = http.getString();
          Serial.printf("POST success to %s: %d\n", spotNames[i].c_str(), httpCode);
          Serial.println(payload);
          break; // success, exit retry loop
        } else {
          Serial.printf("Attempt %d failed for %s: %s\n", attempt + 1, spotNames[i].c_str(), http.errorToString(httpCode).c_str());
          delay(1000); // wait 1 sec before retrying
        }

        attempt++;
      }

      http.end();
    }
  }

  delay(500); // Check all sensors every 0.5 seconds
}