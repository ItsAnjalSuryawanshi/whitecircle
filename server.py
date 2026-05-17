"from dotenv import load_dotenv
from pathlib import Path
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / \".env\")

import os
import uuid
import logging
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Literal

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr

# --- Setup -------------------------------------------------------------------
mongo_url = os.environ[\"MONGO_URL\"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ[\"DB_NAME\"]]

JWT_SECRET = os.environ[\"JWT_SECRET\"]
JWT_ALG = \"HS256\"

app = FastAPI(title=\"WhiteCircle Group API\")
api = APIRouter(prefix=\"/api\")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(\"whitecircle\")


# --- Helpers -----------------------------------------------------------------
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False

def create_token(user_id: str, role: str, minutes: int = 60 * 24 * 7) -> str:
    payload = {
        \"sub\": user_id,
        \"role\": role,
        \"exp\": datetime.now(timezone.utc) + timedelta(minutes=minutes),
        \"iat\": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get(\"access_token\")
    if not token:
        auth = request.headers.get(\"Authorization\", \"\")
        if auth.startswith(\"Bearer \"):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail=\"Not authenticated\")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail=\"Token expired\")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail=\"Invalid token\")
    user = await db.users.find_one({\"id\": payload[\"sub\"]}, {\"_id\": 0, \"password_hash\": 0})
    if not user:
        raise HTTPException(status_code=401, detail=\"User not found\")
    return user

def require_roles(*roles: str):
    async def dep(user: dict = Depends(get_current_user)) -> dict:
        if user[\"role\"] not in roles:
            raise HTTPException(status_code=403, detail=\"Insufficient permissions\")
        return user
    return dep


# --- Models ------------------------------------------------------------------
class RegisterIn(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str
    business_name: Optional[str] = None

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    role: str
    business_name: Optional[str] = None
    gstin: Optional[str] = None
    pan: Optional[str] = None
    created_at: str

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    business_name: Optional[str] = None
    gstin: Optional[str] = None
    pan: Optional[str] = None

class DocumentIn(BaseModel):
    category: Literal[\"GST\", \"ITR\", \"TDS\", \"Bank\", \"Sales\", \"Purchase\", \"Other\"]
    month: str
    year: int
    notes: Optional[str] = \"\"
    filename: str
    file_data: str  # base64
    file_type: str = \"application/pdf\"

class FilingIn(BaseModel):
    client_id: Optional[str] = None  # admin can supply, else self
    type: Literal[\"GSTR-1\", \"GSTR-3B\", \"CMP-08\", \"ITR\", \"TDS\", \"Annual\"]
    period: str  # e.g. \"Jan 2026\" or \"Q4 FY25\"
    notes: Optional[str] = \"\"

class FilingUpdate(BaseModel):
    status: Optional[Literal[\"Pending\", \"In Process\", \"Filed\"]] = None
    acknowledgement_no: Optional[str] = None
    proof_filename: Optional[str] = None
    proof_data: Optional[str] = None
    assigned_to: Optional[str] = None
    notes: Optional[str] = None

class InvoiceIn(BaseModel):
    client_id: str
    description: str
    amount: float
    due_date: str

class InvoiceUpdate(BaseModel):
    status: Literal[\"Unpaid\", \"Paid\"]

class MessageIn(BaseModel):
    to_user_id: Optional[str] = None  # client sends to admin if None
    body: str

class ConsultationIn(BaseModel):
    name: str
    email: EmailStr
    phone: str
    service: str
    message: Optional[str] = \"\"
    preferred_date: Optional[str] = None

class CareerIn(BaseModel):
    name: str
    email: EmailStr
    phone: str
    role: str
    experience: str
    cover_letter: Optional[str] = \"\"

class ContactIn(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


# --- Cookie helper -----------------------------------------------------------
def set_auth_cookie(resp: Response, token: str):
    resp.set_cookie(
        key=\"access_token\", value=token, httponly=True, secure=True,
        samesite=\"none\", max_age=60 * 60 * 24 * 7, path=\"/\",
    )


# --- Auth Routes -------------------------------------------------------------
@api.post(\"/auth/register\")
async def register(payload: RegisterIn, response: Response):
    email = payload.email.lower()
    if await db.users.find_one({\"email\": email}):
        raise HTTPException(status_code=400, detail=\"Email already registered\")
    uid = str(uuid.uuid4())
    user_doc = {
        \"id\": uid,
        \"name\": payload.name,
        \"email\": email,
        \"phone\": payload.phone,
        \"business_name\": payload.business_name,
        \"gstin\": None,
        \"pan\": None,
        \"password_hash\": hash_password(payload.password),
        \"role\": \"client\",
        \"created_at\": now_iso(),
    }
    await db.users.insert_one(user_doc)
    token = create_token(uid, \"client\")
    set_auth_cookie(response, token)
    user_doc.pop(\"password_hash\")
    user_doc.pop(\"_id\", None)
    return {\"user\": user_doc, \"token\": token}


@api.post(\"/auth/login\")
async def login(payload: LoginIn, response: Response):
    email = payload.email.lower()
    user = await db.users.find_one({\"email\": email})
    if not user or not verify_password(payload.password, user[\"password_hash\"]):
        raise HTTPException(status_code=401, detail=\"Invalid credentials\")
    token = create_token(user[\"id\"], user[\"role\"])
    set_auth_cookie(response, token)
    user.pop(\"password_hash\", None)
    user.pop(\"_id\", None)
    return {\"user\": user, \"token\": token}


@api.post(\"/auth/logout\")
async def logout(response: Response):
    response.delete_cookie(\"access_token\", path=\"/\")
    return {\"ok\": True}


@api.get(\"/auth/me\")
async def me(user: dict = Depends(get_current_user)):
    return user


# --- Profile -----------------------------------------------------------------
@api.put(\"/profile\")
async def update_profile(payload: ProfileUpdate, user: dict = Depends(get_current_user)):
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    if update:
        await db.users.update_one({\"id\": user[\"id\"]}, {\"$set\": update})
    fresh = await db.users.find_one({\"id\": user[\"id\"]}, {\"_id\": 0, \"password_hash\": 0})
    return fresh


# --- Documents ---------------------------------------------------------------
@api.post(\"/documents\")
async def upload_document(payload: DocumentIn, user: dict = Depends(get_current_user)):
    doc = {
        \"id\": str(uuid.uuid4()),
        \"client_id\": user[\"id\"],
        \"client_name\": user[\"name\"],
        \"category\": payload.category,
        \"month\": payload.month,
        \"year\": payload.year,
        \"notes\": payload.notes,
        \"filename\": payload.filename,
        \"file_data\": payload.file_data,
        \"file_type\": payload.file_type,
        \"uploaded_at\": now_iso(),
    }
    await db.documents.insert_one(doc)
    return {\"id\": doc[\"id\"], \"filename\": doc[\"filename\"], \"uploaded_at\": doc[\"uploaded_at\"]}


@api.get(\"/documents\")
async def list_documents(user: dict = Depends(get_current_user), client_id: Optional[str] = None):
    query = {}
    if user[\"role\"] == \"client\":
        query[\"client_id\"] = user[\"id\"]
    elif client_id:
        query[\"client_id\"] = client_id
    docs = await db.documents.find(query, {\"_id\": 0, \"file_data\": 0}).sort(\"uploaded_at\", -1).to_list(500)
    return docs


@api.get(\"/documents/{doc_id}\")
async def download_document(doc_id: str, user: dict = Depends(get_current_user)):
    doc = await db.documents.find_one({\"id\": doc_id}, {\"_id\": 0})
    if not doc:
        raise HTTPException(404, \"Not found\")
    if user[\"role\"] == \"client\" and doc[\"client_id\"] != user[\"id\"]:
        raise HTTPException(403, \"Forbidden\")
    return doc


# --- Filings -----------------------------------------------------------------
@api.post(\"/filings\")
async def create_filing(payload: FilingIn, user: dict = Depends(get_current_user)):
    client_id = payload.client_id if user[\"role\"] != \"client\" else user[\"id\"]
    if not client_id:
        raise HTTPException(400, \"client_id required\")
    client = await db.users.find_one({\"id\": client_id})
    if not client:
        raise HTTPException(404, \"Client not found\")
    filing = {
        \"id\": str(uuid.uuid4()),
        \"client_id\": client_id,
        \"client_name\": client[\"name\"],
        \"type\": payload.type,
        \"period\": payload.period,
        \"status\": \"Pending\",
        \"notes\": payload.notes,
        \"assigned_to\": None,
        \"assigned_name\": None,
        \"acknowledgement_no\": None,
        \"proof_filename\": None,
        \"proof_data\": None,
        \"created_at\": now_iso(),
        \"updated_at\": now_iso(),
    }
    await db.filings.insert_one(filing)
    filing.pop(\"proof_data\", None)
    filing.pop(\"_id\", None)
    return filing


@api.get(\"/filings\")
async def list_filings(user: dict = Depends(get_current_user), status: Optional[str] = None, client_id: Optional[str] = None):
    query = {}
    if user[\"role\"] == \"client\":
        query[\"client_id\"] = user[\"id\"]
    elif user[\"role\"] == \"accountant\":
        query[\"assigned_to\"] = user[\"id\"]
    if status:
        query[\"status\"] = status
    if client_id and user[\"role\"] in (\"admin\", \"accountant\"):
        query[\"client_id\"] = client_id
    rows = await db.filings.find(query, {\"_id\": 0, \"proof_data\": 0}).sort(\"created_at\", -1).to_list(500)
    return rows


@api.patch(\"/filings/{filing_id}\")
async def update_filing(filing_id: str, payload: FilingUpdate, user: dict = Depends(require_roles(\"admin\", \"accountant\"))):
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    if \"assigned_to\" in update and update[\"assigned_to\"]:
        acc = await db.users.find_one({\"id\": update[\"assigned_to\"]})
        if acc:
            update[\"assigned_name\"] = acc[\"name\"]
    update[\"updated_at\"] = now_iso()
    res = await db.filings.update_one({\"id\": filing_id}, {\"$set\": update})
    if res.matched_count == 0:
        raise HTTPException(404, \"Filing not found\")
    fresh = await db.filings.find_one({\"id\": filing_id}, {\"_id\": 0, \"proof_data\": 0})
    return fresh


@api.get(\"/filings/{filing_id}/proof\")
async def get_filing_proof(filing_id: str, user: dict = Depends(get_current_user)):
    filing = await db.filings.find_one({\"id\": filing_id}, {\"_id\": 0})
    if not filing:
        raise HTTPException(404, \"Not found\")
    if user[\"role\"] == \"client\" and filing[\"client_id\"] != user[\"id\"]:
        raise HTTPException(403, \"Forbidden\")
    return {\"filename\": filing.get(\"proof_filename\"), \"file_data\": filing.get(\"proof_data\")}


# --- Invoices ----------------------------------------------------------------
@api.post(\"/invoices\")
async def create_invoice(payload: InvoiceIn, user: dict = Depends(require_roles(\"admin\"))):
    client = await db.users.find_one({\"id\": payload.client_id})
    if not client:
        raise HTTPException(404, \"Client not found\")
    inv = {
        \"id\": str(uuid.uuid4()),
        \"invoice_no\": f\"WC-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:6].upper()}\",
        \"client_id\": payload.client_id,
        \"client_name\": client[\"name\"],
        \"description\": payload.description,
        \"amount\": payload.amount,
        \"due_date\": payload.due_date,
        \"status\": \"Unpaid\",
        \"created_at\": now_iso(),
    }
    await db.invoices.insert_one(inv)
    inv.pop(\"_id\", None)
    return inv


@api.get(\"/invoices\")
async def list_invoices(user: dict = Depends(get_current_user)):
    query = {}
    if user[\"role\"] == \"client\":
        query[\"client_id\"] = user[\"id\"]
    rows = await db.invoices.find(query, {\"_id\": 0}).sort(\"created_at\", -1).to_list(500)
    return rows


@api.patch(\"/invoices/{invoice_id}\")
async def update_invoice(invoice_id: str, payload: InvoiceUpdate, user: dict = Depends(get_current_user)):
    # Clients can mark their own invoices paid (mock payment)
    inv = await db.invoices.find_one({\"id\": invoice_id})
    if not inv:
        raise HTTPException(404, \"Not found\")
    if user[\"role\"] == \"client\" and inv[\"client_id\"] != user[\"id\"]:
        raise HTTPException(403, \"Forbidden\")
    await db.invoices.update_one({\"id\": invoice_id}, {\"$set\": {\"status\": payload.status, \"paid_at\": now_iso() if payload.status == \"Paid\" else None}})
    fresh = await db.invoices.find_one({\"id\": invoice_id}, {\"_id\": 0})
    return fresh


# --- Messages / Chat ---------------------------------------------------------
@api.post(\"/messages\")
async def send_message(payload: MessageIn, user: dict = Depends(get_current_user)):
    # Client -> admin team (broadcast to all admins). Admin -> specific client.
    if user[\"role\"] == \"client\":
        thread_id = user[\"id\"]
        to_user_id = None
    else:
        if not payload.to_user_id:
            raise HTTPException(400, \"to_user_id required for staff\")
        thread_id = payload.to_user_id
        to_user_id = payload.to_user_id
    msg = {
        \"id\": str(uuid.uuid4()),
        \"thread_id\": thread_id,
        \"from_user_id\": user[\"id\"],
        \"from_name\": user[\"name\"],
        \"from_role\": user[\"role\"],
        \"to_user_id\": to_user_id,
        \"body\": payload.body,
        \"created_at\": now_iso(),
    }
    await db.messages.insert_one(msg)
    msg.pop(\"_id\", None)
    return msg


@api.get(\"/messages\")
async def list_messages(user: dict = Depends(get_current_user), thread_id: Optional[str] = None):
    if user[\"role\"] == \"client\":
        tid = user[\"id\"]
    else:
        if not thread_id:
            # return all threads grouped
            pipeline = [
                {\"$sort\": {\"created_at\": -1}},
                {\"$group\": {\"_id\": \"$thread_id\", \"last_message\": {\"$first\": \"$$ROOT\"}}},
            ]
            threads = []
            async for t in db.messages.aggregate(pipeline):
                lm = t[\"last_message\"]
                lm.pop(\"_id\", None)
                threads.append({\"thread_id\": t[\"_id\"], \"last_message\": lm})
            return {\"threads\": threads}
        tid = thread_id
    rows = await db.messages.find({\"thread_id\": tid}, {\"_id\": 0}).sort(\"created_at\", 1).to_list(500)
    return {\"messages\": rows}


# --- Consultations / Career / Contact ---------------------------------------
@api.post(\"/consultations\")
async def book_consultation(payload: ConsultationIn):
    doc = payload.model_dump() | {\"id\": str(uuid.uuid4()), \"status\": \"New\", \"created_at\": now_iso()}
    await db.consultations.insert_one(doc)
    doc.pop(\"_id\", None)
    return doc

@api.get(\"/consultations\")
async def list_consultations(user: dict = Depends(require_roles(\"admin\"))):
    return await db.consultations.find({}, {\"_id\": 0}).sort(\"created_at\", -1).to_list(500)


@api.post(\"/careers\")
async def apply_career(payload: CareerIn):
    doc = payload.model_dump() | {\"id\": str(uuid.uuid4()), \"status\": \"New\", \"created_at\": now_iso()}
    await db.careers.insert_one(doc)
    doc.pop(\"_id\", None)
    return doc

@api.get(\"/careers\")
async def list_careers(user: dict = Depends(require_roles(\"admin\"))):
    return await db.careers.find({}, {\"_id\": 0}).sort(\"created_at\", -1).to_list(500)


@api.post(\"/contact\")
async def contact(payload: ContactIn):
    doc = payload.model_dump() | {\"id\": str(uuid.uuid4()), \"created_at\": now_iso()}
    await db.contacts.insert_one(doc)
    doc.pop(\"_id\", None)
    return doc


# --- Admin: clients & staff --------------------------------------------------
@api.get(\"/admin/clients\")
async def list_clients(user: dict = Depends(require_roles(\"admin\", \"accountant\"))):
    rows = await db.users.find({\"role\": \"client\"}, {\"_id\": 0, \"password_hash\": 0}).sort(\"created_at\", -1).to_list(500)
    return rows


@api.get(\"/admin/staff\")
async def list_staff(user: dict = Depends(require_roles(\"admin\"))):
    rows = await db.users.find({\"role\": {\"$in\": [\"accountant\", \"admin\"]}}, {\"_id\": 0, \"password_hash\": 0}).to_list(200)
    return rows


@api.post(\"/admin/staff\")
async def create_staff(payload: RegisterIn, user: dict = Depends(require_roles(\"admin\"))):
    role = \"accountant\"  # admin creates accountant accounts; admin must be seeded
    email = payload.email.lower()
    if await db.users.find_one({\"email\": email}):
        raise HTTPException(400, \"Email already exists\")
    uid = str(uuid.uuid4())
    doc = {
        \"id\": uid, \"name\": payload.name, \"email\": email, \"phone\": payload.phone,
        \"business_name\": None, \"gstin\": None, \"pan\": None,
        \"password_hash\": hash_password(payload.password), \"role\": role, \"created_at\": now_iso(),
    }
    await db.users.insert_one(doc)
    doc.pop(\"password_hash\"); doc.pop(\"_id\", None)
    return doc


# --- Analytics ---------------------------------------------------------------
@api.get(\"/analytics/admin\")
async def admin_analytics(user: dict = Depends(require_roles(\"admin\"))):
    total_clients = await db.users.count_documents({\"role\": \"client\"})
    total_filings = await db.filings.count_documents({})
    pending = await db.filings.count_documents({\"status\": \"Pending\"})
    in_process = await db.filings.count_documents({\"status\": \"In Process\"})
    filed = await db.filings.count_documents({\"status\": \"Filed\"})
    unpaid_invoices = await db.invoices.count_documents({\"status\": \"Unpaid\"})
    total_revenue_paid = 0.0
    async for inv in db.invoices.find({\"status\": \"Paid\"}, {\"amount\": 1, \"_id\": 0}):
        total_revenue_paid += float(inv.get(\"amount\", 0))
    # clients without uploads in last 30 days
    cutoff = (datetime.now(timezone.utc) - timedelta(days=30)).isoformat()
    active_uploader_ids = await db.documents.distinct(\"client_id\", {\"uploaded_at\": {\"$gte\": cutoff}})
    inactive = await db.users.count_documents({\"role\": \"client\", \"id\": {\"$nin\": active_uploader_ids}})
    return {
        \"total_clients\": total_clients,
        \"total_filings\": total_filings,
        \"pending\": pending,
        \"in_process\": in_process,
        \"filed\": filed,
        \"unpaid_invoices\": unpaid_invoices,
        \"total_revenue_paid\": total_revenue_paid,
        \"inactive_clients\": inactive,
    }


@api.get(\"/analytics/client\")
async def client_analytics(user: dict = Depends(require_roles(\"client\"))):
    total = await db.filings.count_documents({\"client_id\": user[\"id\"]})
    filed = await db.filings.count_documents({\"client_id\": user[\"id\"], \"status\": \"Filed\"})
    pending = await db.filings.count_documents({\"client_id\": user[\"id\"], \"status\": {\"$in\": [\"Pending\", \"In Process\"]}})
    docs = await db.documents.count_documents({\"client_id\": user[\"id\"]})
    unpaid = await db.invoices.count_documents({\"client_id\": user[\"id\"], \"status\": \"Unpaid\"})
    # compliance score: filed / total, default 100 if no filings
    score = 100 if total == 0 else round((filed / total) * 100)
    return {
        \"total_filings\": total, \"filed\": filed, \"pending\": pending,
        \"documents_uploaded\": docs, \"unpaid_invoices\": unpaid,
        \"compliance_score\": score,
    }


# --- Reminders (due-date calendar) ------------------------------------------
@api.get(\"/reminders\")
async def reminders(user: dict = Depends(get_current_user)):
    \"\"\"Return upcoming statutory due dates for current and next month.\"\"\"
    today = datetime.now(timezone.utc).date()
    items = []
    for month_offset in range(0, 2):
        ref = today.replace(day=1) + timedelta(days=32 * month_offset)
        y, m = ref.year, ref.month
        for day, label in [(11, \"GSTR-1 Filing\"), (20, \"GSTR-3B Filing\"), (7, \"TDS Payment\")]:
            try:
                due = datetime(y, m, day).date()
            except ValueError:
                continue
            items.append({
                \"title\": label,
                \"due_date\": due.isoformat(),
                \"category\": \"GST\" if \"GSTR\" in label else \"TDS\",
                \"days_left\": (due - today).days,
            })
    items.append({\"title\": \"ITR Filing (Individual)\", \"due_date\": f\"{today.year}-07-31\", \"category\": \"ITR\", \"days_left\": (datetime(today.year, 7, 31).date() - today).days})
    items.append({\"title\": \"ITR Filing (Audit)\", \"due_date\": f\"{today.year}-09-30\", \"category\": \"ITR\", \"days_left\": (datetime(today.year, 9, 30).date() - today).days})
    items.sort(key=lambda x: x[\"due_date\"])
    return items


# --- Health & root -----------------------------------------------------------
@api.get(\"/\")
async def root():
    return {\"service\": \"WhiteCircle Group API\", \"status\": \"ok\"}


# --- Mount, CORS, Startup ----------------------------------------------------
app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[\"*\"],
    allow_origin_regex=r\"https?://.*\",
    allow_methods=[\"*\"],
    allow_headers=[\"*\"],
)


@app.on_event(\"startup\")
async def on_startup():
    await db.users.create_index(\"email\", unique=True)
    await db.users.create_index(\"id\", unique=True)
    await db.documents.create_index(\"client_id\")
    await db.filings.create_index(\"client_id\")
    await db.invoices.create_index(\"client_id\")
    await db.messages.create_index(\"thread_id\")
    # Seed admin
    admin_email = os.environ.get(\"ADMIN_EMAIL\", \"admin@whitecircle.in\").lower()
    admin_password = os.environ.get(\"ADMIN_PASSWORD\", \"Admin@123\")
    existing = await db.users.find_one({\"email\": admin_email})
    if not existing:
        await db.users.insert_one({
            \"id\": str(uuid.uuid4()),
            \"name\": \"WhiteCircle Admin\",
            \"email\": admin_email,
            \"phone\": None,
            \"business_name\": \"WhiteCircle Group\",
            \"gstin\": None, \"pan\": None,
            \"password_hash\": hash_password(admin_password),
            \"role\": \"admin\",
            \"created_at\": now_iso(),
        })
        logger.info(\"Seeded admin: %s\", admin_email)
    elif not verify_password(admin_password, existing[\"password_hash\"]):
        await db.users.update_one({\"email\": admin_email}, {\"$set\": {\"password_hash\": hash_password(admin_password)}})

    # Seed demo accountant
    acc_email = \"accountant@whitecircle.in\"
    if not await db.users.find_one({\"email\": acc_email}):
        await db.users.insert_one({
            \"id\": str(uuid.uuid4()),
            \"name\": \"Priya Sharma\",
            \"email\": acc_email,
            \"phone\": None,
            \"business_name\": None,
            \"gstin\": None, \"pan\": None,
            \"password_hash\": hash_password(\"Account@123\"),
            \"role\": \"accountant\",
            \"created_at\": now_iso(),
        })
        logger.info(\"Seeded accountant: %s\", acc_email)


@app.on_event(\"shutdown\")
async def on_shutdown():
    client.close()
"