#include "Adafruit_NeoPixel.h"
// IMPORTANT: Set pixel COUNT, PIN and TYPE
#define PIXEL_PIN D2
#define PIXEL_COUNT 10
#define PIXEL_TYPE WS2812B
#define ONE_DAY_MILLIS (24 * 60 * 60 * 1000)

Adafruit_NeoPixel strip = Adafruit_NeoPixel(PIXEL_COUNT, PIXEL_PIN, PIXEL_TYPE);
int counter;
unsigned long lastSync = millis();

String alarms[7];
String lastCommand = "";


int setAlarm(String command) {
           // 0123456789012345678901234567890123
  // format = 0700 0800 0700 1400 0400 0340 XXXX
  // format = S M T W T F S
  // where each day is formatted as HHMM or XXXX
  // IF XXXX THEN OFF
  lastCommand = command;
  String individualCommands[7];
  individualCommands[0] = command.substring(0,4);
  individualCommands[1] = command.substring(5,9);
  individualCommands[2] = command.substring(10,14);
  individualCommands[3] = command.substring(15,19);
  individualCommands[4] = command.substring(20,24);
  individualCommands[5] = command.substring(25,29);
  individualCommands[6] = command.substring(30, 34);

  for (int i = 0; i < 7; i++) {
    alarms[i] = individualCommands[i];
  }

  Particle.publish("updated", alarms[5]);
  return 1;
}

void setup()
{
  strip.begin();
  strip.show(); // Initialize all pixels to "off"
  counter = 0;
  Particle.variable("lastCommand", lastCommand);
  Particle.function("setAlarm", setAlarm);
  for (int i = 0 ; i < 7; i++) {
    alarms[i] = "XXXX";
  }
}
void loop()
{
  if (millis() - lastSync > ONE_DAY_MILLIS) {
  // Request time synchronization from the Particle Cloud
    Particle.syncTime();
    lastSync = millis();
  }

  //get current day
  int dayOfWeek = Time.weekday() - 1;
  //get alarm for current day
  String currentAlarm = alarms[dayOfWeek];
  //if it is a valid and set alarm

  if (counter == 5000) {
    String tVal = String(Time.hour()) + " " + String(Time.minute());
    counter = 0;
  }
  counter++;
  if (!currentAlarm.equalsIgnoreCase("XXXX")) {

    //check the time
    String hours_s = currentAlarm.substring(0,2);
    String minutes_s = currentAlarm.substring(2,4);
    int hours = hours_s.toInt();
    int minutes = minutes_s.toInt();
    //within hour range
    if (hours - Time.hour()-4 <= 1 && Time.hour()-4 - hours >= -1) {

      //get minutes away from alarm
      if (hours > Time.hour()) {
        //IE alarm at 2:10 and time now is 1:45
        int hourDiff = 60 - Time.minute();
        if (hourDiff + minutes <= 30) {
          //calculate difference
          int minutesBeforeAlarm = hourDiff + minutes;
          runAlarm(minutesBeforeAlarm);
          //call alarm function
        } else {
          resetToOff();
        }
      } else if (hours == Time.hour()-4) {
        //IE alarm at 2:15 and time now is 2:05
        if (minutes >= Time.minute()) {
          if (minutes - Time.minute() <= 30) {{
            //call alarm function
            int minutesBeforeAlarm = minutes - Time.minute();
            runAlarm(minutesBeforeAlarm);
          }}
        } else {
          resetToOff();
        }
      } else {
        //IE alarm at 1:45 and time now is 2:15
        //do nothing
        resetToOff();

      }
    } else {
      resetToOff();
    }
  }

  // rainbow(20);
}

void resetToOff() {
  for (int i = 0; i < strip.numPixels(); i++) {
    strip.setPixelColor(i, strip.Color(0,0,0));
    delay(50);
    strip.show();
  }
}

void runAlarm(int minutesBeforeAlarm) {
  //scale minutes / 30 to x / 100
  int interval = (30 - minutesBeforeAlarm) / 30.0 * 100.0;
  Particle.publish("interval", String(interval));
  setColor(interval);
}

//transition
//2000K = rgb(255, 137, 14)
                  //159, 70
//3000K - 4000K
// 3000K = rgb(255,177, 110)
// 3100K = rgb(255,180, 117)
// 3200K = rgb(255,184, 123)
// 3300K = rgb(255,187, 129)
// 3400K = rgb(255,190, 135)
// 3500K = rgb(255,193, 141)
// 3600K = rgb(255,195, 146)
// 3700K = rgb(255,198, 151)
// 3800K = rgb(255,201, 157)
// 3900K = rgb(255,203, 161)
// 4000K = rgb(255,206, 166)

// increment goes from 0 to 100
void setColor(int increment) {
  uint8_t r = 255;
  uint8_t g = 159 + (int) (3.13 * increment / 6.67);
  uint8_t b = 70 + (int) (6.4 * increment / 6.67);
  int brightness = 10 + (int) (2.45 * increment);
  strip.setBrightness(brightness);

  for (int i = 0; i < strip.numPixels(); i++) {
    strip.setPixelColor(i, strip.Color(r,g,b));
    delay(50);
    strip.show();
  }
}
