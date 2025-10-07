import serial

PORT = "COM4"        # ⚠️ change to your port
BAUD = 9600          # typical for cheap RFID readers

ser = serial.Serial(PORT, BAUD, timeout=1)

print("Waiting for tags... Ctrl-C to quit.")
while True:
    raw = ser.readline().decode(errors="ignore").strip()
    if raw:
        print("Tag read:", raw)