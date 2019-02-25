/****
 * PIN DEFINITIONS
 */
//First motor
#define IN11 5
#define IN12 6
#define IN13 7
#define IN14 8
//Second motor
#define IN21 9
#define IN22 10
#define IN23 11
#define IN24 12
//input from phone
#define P_SIG 0

//Signal length definitions, from phone (should ideally be 90, 180, 270, 360, 450 but, you know..., noise)
#define SIG_LEFT 100
#define SIG_RIGHT 190
#define SIG_FORWARD 280
#define SIG_BACKWARD 370
#define SIG_SERVO 460

//Servo motor
#include <Servo.h>
 
Servo servo1;  // create servo object to control a servo

//Stepper motor phases, table magic
const int phases1[] = {0, 0, 0, 0, 0, 1, 1, 1};
const int phases2[] = {0, 0, 0, 1, 1, 1, 0, 0};
const int phases3[] = {0, 1, 1, 1, 0, 0, 0, 0};
const int phases4[] = {1, 1, 0, 0, 0, 0, 0, 1};

//A convenient way to switch between motors
const int outputs[][4] = {{IN11, IN12, IN13, IN14}, //first motor, index 0
                          {IN21, IN22, IN23, IN24} //second motor, index 1
                         };

//The servos used are not configured properly for some reason.
//It is possible to get around that by offsetting
const int sketchyServoOffset = 8;

int inputSignal = 0;
//Initialize the phase of both motors as 0
int Phase[] = {0, 0};
int Speed = 100; //MUST BE 1 - 100
unsigned long startTime = 0;
int counter = 0;
// servo position
int servoPos = 90;

void setup() {
  //First motor
  pinMode(IN11, OUTPUT);
  pinMode(IN12, OUTPUT);
  pinMode(IN13, OUTPUT);
  pinMode(IN14, OUTPUT);
  //Second motor
  pinMode(IN21, OUTPUT);
  pinMode(IN22, OUTPUT);
  pinMode(IN23, OUTPUT);
  pinMode(IN24, OUTPUT);
  pinMode(P_SIG, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);

  servo1.attach(2);  // attaches the servo on pin 2 to the servo object
  
  Serial.begin(57600);
  Serial.println("intitalized");
}

void loop() {
  startTime = millis();
  counter = 0;
  inputSignal = analogRead(P_SIG);   // read the input pin
  if (inputSignal > 10) {
    counter = 1;
    while(millis() < startTime + 200) {
      if (analogRead(P_SIG) > 10) {
        counter += 1;
      }
    }
  }
  if (counter > 50) {
    if (counter < SIG_LEFT) {
      drive_left();
    }
    else if (counter < SIG_RIGHT) {
     drive_right(); 
    }
    else if (counter < SIG_FORWARD) {
      drive_forward();
    }
    else if (counter < SIG_BACKWARD) {
      drive_backward();
    }
    else if (counter < SIG_SERVO) {
      // goes from 0 degrees to 180 degrees in steps of 1 degree
      for(servoPos = 90; servoPos < 180; servoPos += 1) {
        servo1.write(servoPos + sketchyServoOffset);  // tell servo to go to position in variable 'pos'
        delay(15);               // waits 15ms for the servo to reach the position
      }
      // goes back, from 180 degrees to 0
      for(servoPos = 180; servoPos > 0; servoPos -= 1) {
        servo1.write(servoPos + sketchyServoOffset);  // tell servo to go to position in variable 'pos'
        delay(15);
      }
      // then back to starting position
      for(servoPos = 0; servoPos < 90; servoPos += 1) {
        servo1.write(servoPos + sketchyServoOffset);  // tell servo to go to position in variable 'pos'
        delay(15);
      }
    }
  }
}

void drive_left() {
  for (int i = 0; i < 1024; i += 1) {
    stepper(1, 0);
    stepper(-1, 1);
  }
  Serial.println("left");
}

void drive_right() {
  for (int i = 0; i < 1024; i += 1) {
    stepper(-1, 0);
    stepper(1, 1);
  }
  Serial.println("right");
}

void drive_forward() {
  for (int i = 0; i < 1024; i += 1) {
    stepper(1, 0);
    stepper(1, 1);
  }
  Serial.println("forward");
}

void drive_backward() {
  for (int i = 0; i < 1024; i += 1) {
    stepper(-1, 0);
    stepper(-1, 1);
  }
  Serial.println("backward");
}

void stepper(int count, int motor) {
  int rotationDirection = count < 1 ? -1 : 1;
  count *= rotationDirection;
  for (int x = 0; x < count; x++) {
    digitalWrite(outputs[motor][0], phases1[Phase[motor]]);
    digitalWrite(outputs[motor][1], phases2[Phase[motor]]);
    digitalWrite(outputs[motor][2], phases3[Phase[motor]]);
    digitalWrite(outputs[motor][3], phases4[Phase[motor]]);
    IncrementPhase(rotationDirection, motor);
    delay(100/Speed);
  }
}

void IncrementPhase(int rotationDirection, int motor) {
  Phase[motor] += 8;
  Phase[motor] += rotationDirection;
  Phase[motor] %= 8;
}
