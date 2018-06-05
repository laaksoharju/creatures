#define IN1 8
#define IN2 9
#define IN3 10
#define IN4 11
#define FULL_ROTATION 4076
#define TOP 1024

const int phases1[] = {0, 0, 0, 0, 0, 1, 1, 1};
const int phases2[] = {0, 0, 0, 1, 1, 1, 0, 0};
const int phases3[] = {0, 1, 1, 1, 0, 0, 0, 0};
const int phases4[] = {1, 1, 0, 0, 0, 0, 0, 1};

int Phase = 0;
int Speed = 50; //MUST BE 1 - 100
int stepCounter = 0;
int turnDirection = 1;
bool upFlag = true;

void setup() {
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  
  Serial.begin(115200);
  //Serial.println("intitalized");
}

void loop() {
  //while (1); //For pausing execution while thinking...  
  if (stepCounter >= TOP) {
    if (upFlag) {
        turnDirection = -1;
        wiggle();
    }
    else {
        turnDirection = 1;
        Speed = 1;
        stepper(1);
        delay(1000);
    }
    upFlag = !upFlag;
    stepCounter = 0;
  }
  stepCounter += 1;
  Speed = 50;
  stepper(turnDirection);
}

void wiggle() {
  Speed = 30;
  for (int j = 0; j < 4; j++) {
    stepper(100);
    stepper(-100);
  }
  delay(4000);
  Speed = 10;
  for (int j = 0; j < 5; j++) {
    stepper(100);
    stepper(-100);
  }
  delay(3000);
}

void stepper(int count) {
  int rotationDirection = count < 1 ? -1 : 1;
  count *= rotationDirection;
  for (int x = 0; x < count; x++) {
    digitalWrite(IN1, phases1[Phase]);
    digitalWrite(IN2, phases2[Phase]);
    digitalWrite(IN3, phases3[Phase]);
    digitalWrite(IN4, phases4[Phase]);
    IncrementPhase(rotationDirection);
    delay(100/Speed);
  }

}

void IncrementPhase(int rotationDirection) {
  Phase += 8;
  Phase += rotationDirection;
  Phase %= 8;
}
