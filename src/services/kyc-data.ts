import { resalePrice } from "./pricing";

export type KycField = { name: string; label: string; example: string };
export type KycService = {
  id: string; title: string; desc: string; category: string;
  /** Upstream APITXT price in INR per call (from APITXT Verification Hub, Nov 2026). */
  upstreamInr: number;
  endpoint: string; fields: KycField[]; response: object;
};

export const kycCategories = [
  { id: "business", title: "Business & Corporate", desc: "Companies, tax entities, and MSME registrations." },
  { id: "identity", title: "Identity Documents", desc: "Individual identity — PAN, passport, driving licence, voter ID, DigiLocker." },
  { id: "banking", title: "Banking & Payments", desc: "Bank accounts, IFSC lookups, and UPI penny drops." },
  { id: "vehicle", title: "Vehicle", desc: "RTO / Parivahan vehicle registration certificate lookups." },
] as const;

const svc = (s: KycService) => s;

export const kycServices: KycService[] = [
  svc({ id: "gst", title: "GST Verify", category: "business", upstreamInr: 2, desc: "Live GSTIN lookup + download the authoritative Form REG-06 certificate PDF.", endpoint: "/v1/kyc/gst", fields: [{ name: "gstin", label: "GSTIN", example: "27AAPFU0939F1ZV" }], response: { gstin: "27AAPFU0939F1ZV", legal_name: "ACME TRADERS LLP", status: "Active", state: "Maharashtra", registered_on: "2019-04-01", certificate_url: "https://cdn.numora.io/gst/reg06.pdf" } }),
  svc({ id: "cin", title: "CIN Verify", category: "business", upstreamInr: 5, desc: "Verify a company by its Corporate Identification Number — returns company profile and current directors.", endpoint: "/v1/kyc/cin", fields: [{ name: "cin", label: "CIN", example: "U72200MH2015PTC123456" }], response: { cin: "U72200MH2015PTC123456", company_name: "ACME TECH PRIVATE LIMITED", status: "Active", incorporated: "2015-06-12", directors: [{ din: "07123456", name: "R. SHARMA" }] } }),
  svc({ id: "udyam", title: "Udyam (MSME)", category: "business", upstreamInr: 5, desc: "MSME / Udyam registration — enterprise details + certificate PDF.", endpoint: "/v1/kyc/udyam", fields: [{ name: "udyam_number", label: "Udyam number", example: "UDYAM-MH-19-0012345" }], response: { udyam_number: "UDYAM-MH-19-0012345", enterprise: "ACME TRADERS", type: "Micro", activity: "Services", certificate_url: "https://cdn.numora.io/udyam/cert.pdf" } }),
  svc({ id: "pan-udyam", title: "PAN → Udyam", category: "business", upstreamInr: 5, desc: "Reverse lookup — get the Udyam number linked to a PAN.", endpoint: "/v1/kyc/pan-udyam", fields: [{ name: "pan", label: "PAN", example: "AAPFU0939F" }], response: { pan: "AAPFU0939F", udyam_number: "UDYAM-MH-19-0012345" } }),
  svc({ id: "pan-gstin", title: "PAN → GSTIN", category: "business", upstreamInr: 5, desc: "Reverse lookup — get every GSTIN registered under a PAN (one per state).", endpoint: "/v1/kyc/pan-gstin", fields: [{ name: "pan", label: "PAN", example: "AAPFU0939F" }], response: { pan: "AAPFU0939F", gstins: [{ gstin: "27AAPFU0939F1ZV", state: "Maharashtra" }, { gstin: "29AAPFU0939F1ZR", state: "Karnataka" }] } }),
  svc({ id: "pan", title: "PAN Verify (basic)", category: "identity", upstreamInr: 5, desc: "Basic PAN verify with name + DOB match.", endpoint: "/v1/kyc/pan", fields: [{ name: "pan", label: "PAN", example: "ABCDE1234F" }, { name: "name", label: "Name", example: "Rahul Sharma" }, { name: "dob", label: "DOB", example: "1990-05-14" }], response: { pan: "ABCDE1234F", valid: true, name_match: true, dob_match: true } }),
  svc({ id: "pan360", title: "PAN 360 (Advance)", category: "identity", upstreamInr: 8, desc: "PAN 360 — enriched PAN with demographics, masked contact info, address.", endpoint: "/v1/kyc/pan-360", fields: [{ name: "pan", label: "PAN", example: "ABCDE1234F" }], response: { pan: "ABCDE1234F", full_name: "RAHUL SHARMA", gender: "M", dob: "1990-05-14", masked_mobile: "XXXXXX4321", masked_email: "r****@gmail.com", address: { city: "Pune", state: "Maharashtra", pincode: "411001" }, aadhaar_linked: true } }),
  svc({ id: "passport", title: "Passport", category: "identity", upstreamInr: 5, desc: "Indian passport verify by file number + DOB.", endpoint: "/v1/kyc/passport", fields: [{ name: "file_number", label: "File number", example: "PN1066123456789" }, { name: "dob", label: "DOB", example: "1990-05-14" }], response: { file_number: "PN1066123456789", name: "RAHUL SHARMA", passport_number: "Z1234567", status: "Issued", issued_on: "2021-02-10" } }),
  svc({ id: "dl", title: "Driving Licence", category: "identity", upstreamInr: 5, desc: "Indian DL verify — badge, validity, addresses, photo.", endpoint: "/v1/kyc/driving-licence", fields: [{ name: "dl_number", label: "DL number", example: "MH1220190012345" }, { name: "dob", label: "DOB", example: "1990-05-14" }], response: { dl_number: "MH1220190012345", name: "RAHUL SHARMA", valid_till: "2039-05-13", classes: ["LMV", "MCWG"], rto: "Pune" } }),
  svc({ id: "voter", title: "Voter ID (EPIC)", category: "identity", upstreamInr: 5, desc: "Voter ID (EPIC) verify — demographics + polling booth info.", endpoint: "/v1/kyc/voter-id", fields: [{ name: "epic_number", label: "EPIC number", example: "ABC1234567" }], response: { epic_number: "ABC1234567", name: "RAHUL SHARMA", age: 36, constituency: "Pune Cantonment", polling_station: "ZP School, Room 2" } }),
  svc({ id: "digilocker", title: "DigiLocker", category: "identity", upstreamInr: 5, desc: "Consent-based document retrieval — Aadhaar / PAN / DL via DigiLocker. DPDPA-2023 compliant.", endpoint: "/v1/kyc/digilocker", fields: [{ name: "redirect_url", label: "Redirect URL", example: "https://yourapp.com/kyc/done" }], response: { session_id: "dlk_7Hq2", consent_url: "https://digilocker.numora.io/c/dlk_7Hq2", status: "awaiting_consent" } }),
  svc({ id: "ifsc", title: "IFSC Verify", category: "banking", upstreamInr: 2, desc: "Look up bank branch + capabilities from an IFSC code.", endpoint: "/v1/kyc/ifsc", fields: [{ name: "ifsc", label: "IFSC", example: "HDFC0000123" }], response: { ifsc: "HDFC0000123", bank: "HDFC Bank", branch: "Pune Camp", imps: true, neft: true, rtgs: true, upi: true } }),
  svc({ id: "pennyless", title: "Penny-Less (no INR)", category: "banking", upstreamInr: 5, desc: "Verify account + name via banking network — no INR transferred.", endpoint: "/v1/kyc/bank-account", fields: [{ name: "account_number", label: "Account number", example: "50100123456789" }, { name: "ifsc", label: "IFSC", example: "HDFC0000123" }], response: { account_exists: true, name_at_bank: "RAHUL SHARMA", ifsc: "HDFC0000123" } }),
  svc({ id: "aadhaar-ekyc", title: "Aadhaar e-KYC (OTP)", category: "identity", upstreamInr: 3, desc: "OTP-based identity check via the UIDAI registry.", endpoint: "/v1/kyc/aadhaar-ekyc", fields: [{ name: "aadhaar_number", label: "Aadhaar number", example: "XXXX XXXX 1234" }, { name: "otp", label: "OTP", example: "123456" }], response: { reference_id: "AEK_91x2", name: "RAHUL SHARMA", gender: "M", dob: "1990-05-14", address: { state: "Maharashtra", pincode: "411001" } } }),
  svc({ id: "aadhaar", title: "Aadhaar Verification", category: "identity", upstreamInr: 2, desc: "Aadhaar number validation without OTP.", endpoint: "/v1/kyc/aadhaar", fields: [{ name: "aadhaar_number", label: "Aadhaar number", example: "XXXX XXXX 1234" }], response: { valid: true, age_band: "30-40", state: "Maharashtra", masked_mobile: "XXXXXX4321" } }),
  svc({ id: "gst-cert", title: "GST Certificate", category: "business", upstreamInr: 50, desc: "Download the official GST registration certificate PDF.", endpoint: "/v1/kyc/gst-certificate", fields: [{ name: "gstin", label: "GSTIN", example: "27AAPFU0939F1ZV" }], response: { gstin: "27AAPFU0939F1ZV", certificate_url: "https://cdn.numora.io/gst/reg06.pdf" } }),
  svc({ id: "udyam-cert", title: "Udyam Certificate", category: "business", upstreamInr: 10, desc: "Download the official Udyam certificate PDF. Charged separately from verify.", endpoint: "/v1/kyc/udyam-certificate", fields: [{ name: "udyam_number", label: "Udyam number", example: "UDYAM-MH-19-0012345" }], response: { udyam_number: "UDYAM-MH-19-0012345", certificate_url: "https://cdn.numora.io/udyam/cert.pdf" } }),
  svc({ id: "pennydrop", title: "Penny Drop Verification", category: "banking", upstreamInr: 5, desc: "Confirm account ownership by depositing ₹1.", endpoint: "/v1/kyc/penny-drop", fields: [{ name: "account_number", label: "Account number", example: "50100123456789" }, { name: "ifsc", label: "IFSC", example: "HDFC0000123" }], response: { account_exists: true, name_at_bank: "RAHUL SHARMA", utr: "412345678901", amount: 1 } }),
  svc({ id: "rc", title: "Vehicle RC", category: "vehicle", upstreamInr: 6, desc: "RTO / Parivahan RC lookup — owner, chassis, insurance, PUCC.", endpoint: "/v1/kyc/vehicle-rc", fields: [{ name: "rc_number", label: "RC number", example: "MH12AB1234" }], response: { rc_number: "MH12AB1234", owner: "R***L SHARMA", maker_model: "MARUTI SWIFT VXI", chassis: "MA3XXXXXXXX1234", insurance_upto: "2027-03-01", pucc_upto: "2026-12-20" } }),
];

/** Customer price = upstream (₹) + platform markup. */
export const kycPrice = (s: KycService) => resalePrice(s.upstreamInr);

export type KycLog = { id: string; at: string; service: string; action: "Verify"; target: string; name: string; source: "API" | "Dashboard"; status: "completed" | "failed"; cost: number };

export const kycLogs: KycLog[] = [
  { id: "PANG-VER-2DF7771488F5", at: "30 Oct, 22:11", service: "PAN_GSTIN", action: "Verify", target: "AZIPTXXXXN", name: "2 GSTINs · 2325000430…", source: "Dashboard", status: "completed", cost: 10 },
  { id: "GST-VER-91AC22E01B7D", at: "30 Oct, 18:02", service: "GST", action: "Verify", target: "27AAPFUXXXXF1ZV", name: "ACME TRADERS LLP", source: "API", status: "completed", cost: 4 },
  { id: "PAN-VER-0B3E5F7A9C21", at: "29 Oct, 11:47", service: "PAN", action: "Verify", target: "ABCDEXXXXF", name: "RAHUL SHARMA", source: "API", status: "completed", cost: 10 },
  { id: "BANK-VER-7C1D9E3B44A0", at: "28 Oct, 16:20", service: "BANK", action: "Verify", target: "5010XXXX6789", name: "—", source: "Dashboard", status: "failed", cost: 0 },
  { id: "RC-VER-4E8F12A6D3B9", at: "27 Oct, 09:05", service: "RC", action: "Verify", target: "MH12XXXX34", name: "R***L SHARMA", source: "API", status: "completed", cost: 12 },
];
