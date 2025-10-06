# backend/app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import binascii

# ------------------------------------------------------------------
# serial is optional while you’re still wiring things together
# ------------------------------------------------------------------
try:
    import serial              # sudo pip install pyserial
except ModuleNotFoundError:
    serial = None              # will be checked later

# ------------------------------------------------------------------
app = FastAPI(title="RFID API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------
class ReadTagRequest(BaseModel):
    epc: str
    bank: int
    address: int
    words: int
    password: str | None = None

class ReadTagResponse(BaseModel):
    data: str

# ------------------------------------------------------------------
def open_reader() -> "serial.Serial":  # type: ignore # quoted type hint avoids NameError
    if serial is None:
        raise HTTPException(
            status_code=500,
            detail="pyserial is not installed – run `pip install pyserial`.",
        )

    try:
        return serial.Serial("/dev/ttyUSB0", baudrate=115200, timeout=1)
    except serial.SerialException as err:
        raise HTTPException(status_code=500, detail=f"Serial error: {err}")

def build_command(req: ReadTagRequest) -> bytes:
    pwd_hex = req.password or "00000000"
    cmd = f"READ {req.epc} {req.bank} {req.address} {req.words} {pwd_hex}\n"
    return cmd.encode()

# ------------------------------------------------------------------
@app.get("/", tags=["health"])
def root():
    return {"message": "Backend is alive 🚀"}

@app.post("/rfid/read", response_model=ReadTagResponse, tags=["rfid"])
def read_tag(req: ReadTagRequest):
    # If you don’t have the reader yet, short-circuit here:
    # return {"data": "DEADBEEF"}      # <-- uncomment for stub testing

    ser = open_reader()
    try:
        ser.write(build_command(req))
        raw = ser.readline().strip()
    finally:
        ser.close()

    if not raw:
        raise HTTPException(status_code=504, detail="No response from RFID reader")

    try:
        text = raw.decode()
    except UnicodeDecodeError:
        text = binascii.hexlify(raw).decode()

    return {"data": text}