#include <Wire.h>
#include <MPU6050.h>

MPU6050 mpu;
double mag;

void setup() 
{
  Serial.begin(9600);
  while(!mpu.begin(MPU6050_SCALE_2000DPS, MPU6050_RANGE_2G))
  {
    Serial.println("Could not find a valid MPU6050 sensor, check wiring!");
    delay(500);
  }
}

void loop()
{
  Vector rawAccel = mpu.readRawAccel();
  mag = sqrt( sq(rawAccel.XAxis/9.8) + sq(rawAccel.YAxis/9.8) + sq(rawAccel.ZAxis/9.8));
  Serial.print(mag);
  Serial.print(" ");
  delay(100);
}
