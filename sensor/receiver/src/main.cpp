#include <Arduino.h>
#include <Ethernet.h>
#include <RF24.h>
#include <SPI.h>
#include <main.h>
#include <secrets.h>

#define NODE_ID 10
#define DEBUG true

RF24 radio(7, 8);
const byte address[6] = "00001";

byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED};
EthernetClient client;

char server[] = "api.plant.kataldi.com";
char apiAccessKey[] = API_ACCESS_KEY;

char data[sizeof(payload)];
char postData[140];

void setup() {
    Serial.begin(SERIAL_BAUD);
    while (!Serial) {
        ;  // wait for serial port to connect.
    }

    Serial.println("Setting up RF24");
    radio.begin();
    radio.setChannel(110);
    radio.setAutoAck(1);
    radio.enableAckPayload();
    radio.setRetries(15, 25);
    radio.setPALevel(RF24_PA_MAX);
    radio.setDataRate(RF24_250KBPS);
    radio.openReadingPipe(0, address);
    radio.maskIRQ(1, 1, 0);
    radio.startListening();
    attachInterrupt(0, receiveData, FALLING);

    Serial.println("Setting up ethernet");
    // give the ethernet module time to boot up
    delay(1000);
    Ethernet.begin(mac);
    Serial.print("My IP address: ");
    Serial.println(Ethernet.localIP());

    Serial.println("End of setup");
}

void receiveData() {
    while (radio.available()) {
        memset(&payload, 0, sizeof(payload));
        memset(&data, 0, sizeof(data));
        memset(&postData, 0, sizeof(postData));

        bool goodSignal = radio.testRPD();

        radio.read(&data, sizeof(payload));
        memcpy(&payload, data, sizeof(payload));
        radio.writeAckPayload(0, &payload.nodeId, sizeof(&payload.nodeId));

#if DEBUG == true
        printBytes();
        printPayload();
#endif

        formatData(goodSignal ? 1 : 0);
        sendHttpRequestWithData();
        Serial.println("-----------------------------");
    }
}

void loop() {
    // TODO: Support encryption
    // TODO: Persist readings that can be replayed when there's network
    // TODO: Entering pairing mode
    // TODO: Factory resetting device
}

void formatData(uint8_t signal) {
    // Convert to char* due to Arduino not supporting %f in sprintf
    char moisture[7];
    char temperature[7];
    char batteryVoltage[5];
    char firmware[5];
    dtostrf(payload.moisture / (double)100, 4, 2, moisture);
    dtostrf(payload.temperature / (double)100, 4, 2, temperature);
    dtostrf(payload.batteryVoltage / (double)100, 1, 2, batteryVoltage);
    dtostrf(payload.firmware / (double)10, 3, 1, firmware);

    sprintf(postData, "%u;%u;%s;%u;%u;%s;%lu;%s;%d;%u;%s", payload.nodeId, payload.moistureRaw, moisture,
            payload.moistureMin, payload.moistureMax, temperature, payload.light, batteryVoltage, signal,
            payload.readingId, firmware);
}

void sendHttpRequestWithData() {
    // close any connection before send a new request.
    client.stop();

    if (client.connect(server, 80)) {
        Serial.println("Sending request");
        Serial.println(postData);

        client.println("POST /reading HTTP/1.1");
        client.println("Host: api.plant.kataldi.com");
        client.println("User-Agent: arduino-ethernet");
        client.print("access-key: ");
        client.println(apiAccessKey);
        client.println("Content-Type: text/plain");
        client.println("Connection: close");
        client.print("Content-Length: ");
        client.println(strlen(postData));
        client.println();
        client.println(postData);

    } else {
        Serial.println("Connection failed");
    }
}

void printBytes() {
    for (unsigned int i = 0; i < sizeof(payload); i++) {
        Serial.print((int)data[i]);
        Serial.print(", ");
    }
    Serial.println("");
}

void printPayload() {
    Serial.println("Received:");
    Serial.print("device_id: ");
    Serial.println(payload.nodeId);
    Serial.print("moisture: ");
    Serial.println(payload.moisture);
    Serial.print("moistureRaw: ");
    Serial.println(payload.moistureRaw);
    Serial.print("moistureMin: ");
    Serial.println(payload.moistureMin);
    Serial.print("moistureMax: ");
    Serial.println(payload.moistureMax);
    Serial.print("temperature: ");
    Serial.println(payload.temperature);
    Serial.print("light: ");
    Serial.println(payload.light);
    Serial.print("batteryVoltage: ");
    Serial.println(payload.batteryVoltage);
    Serial.print("firmware: ");
    Serial.println(payload.firmware);
}
