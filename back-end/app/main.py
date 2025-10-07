from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import binascii
import asyncio

try:
    import serial
except ModuleNotFoundError:
    serial = None  # type: ignore

# ------------------------------------------------------------------
# CONFIGURATION — adjust these if the reader settings change
# ------------------------------------------------------------------
PORT = "COM4"      # Windows example; use \"/dev/ttyUSB0\" on Linux
BAUD = 9600
TIMEOUT = 1  # seconds
# ------------------------------------------------------------------

app = FastAPI(title="RFID API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------
# Pydantic models
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
# Helper functions
# ------------------------------------------------------------------
def open_reader() -> "serial.Serial":  # type: ignore
    
    if serial is None:
        raise HTTPException(
            status_code=500,
            detail="pyserial is not installed – run `pip install pyserial`.",
        )
    try:
        return serial.Serial(PORT, BAUD, timeout=TIMEOUT)
    except serial.SerialException as err:
        raise HTTPException(status_code=500, detail=f"Serial error: {err}") from err


def build_command(req: ReadTagRequest) -> bytes:
    pwd_hex = (req.password or "00000000").upper()
    cmd = f"READ {req.epc} {req.bank} {req.address} {req.words} {pwd_hex}\\n"
    return cmd.encode()


# ------------------------------------------------------------------
# Routes
# ------------------------------------------------------------------
@app.get("/", tags=["health"])
def root():
    return {"message": "Backend is alive 🚀"}


@app.post("/rfid/read", response_model=ReadTagResponse, tags=["rfid"])
def read_tag(req: ReadTagRequest):
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


async def read_tag_from_serial() -> str:
   
    loop = asyncio.get_running_loop()

    def _read() -> bytes:
        with serial.Serial(PORT, BAUD, timeout=TIMEOUT) as s:  # type: ignore
            return s.readline()

    raw_bytes = await loop.run_in_executor(None, _read)
    return raw_bytes.decode(errors="ignore").strip()


@app.get("/tag")
async def get_tag():
    tag = await read_tag_from_serial()
    return {"tag": tag or None}