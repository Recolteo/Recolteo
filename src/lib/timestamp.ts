import "server-only";
import crypto from "crypto";

function buildTSRequest(hash: Buffer): Buffer {
  const algoId = Buffer.from([
    0x30, 0x0d,
    0x06, 0x09, 0x60, 0x86, 0x48, 0x01, 0x65, 0x03, 0x04, 0x02, 0x01,
    0x05, 0x00,
  ]);
  const hashOctet = Buffer.concat([Buffer.from([0x04, 0x20]), hash]);
  const msgImprintBody = Buffer.concat([algoId, hashOctet]);
  const msgImprint = Buffer.concat([
    Buffer.from([0x30, msgImprintBody.length]),
    msgImprintBody,
  ]);
  const body = Buffer.concat([
    Buffer.from([0x02, 0x01, 0x01]),
    msgImprint,
    Buffer.from([0x01, 0x01, 0xff]),
  ]);
  return Buffer.concat([Buffer.from([0x30, body.length]), body]);
}

export function hashPdf(pdfBuffer: Buffer): string {
  return crypto.createHash("sha256").update(pdfBuffer).digest("hex");
}

export async function getTimestampToken(hashHex: string): Promise<string | null> {
  try {
    const hashBuffer = Buffer.from(hashHex, "hex");
    const tsRequest = buildTSRequest(hashBuffer);
    const res = await fetch("https://freetsa.org/tsr", {
      method: "POST",
      headers: { "Content-Type": "application/timestamp-query" },
      body: new Uint8Array(tsRequest),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    return Buffer.from(buf).toString("base64");
  } catch {
    return null;
  }
}
