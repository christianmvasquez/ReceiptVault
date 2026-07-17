import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Receipt = {
  id: string;
  vendor: string;
  amount: number;
  category: string;
  notes?: string | null;
  image_url?: string | null;
  created_at?: string | null;
};

type ZipFile = {
  name: string;
  data: Buffer;
};

const textEncoder = new TextEncoder();

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index;

  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }

  return value >>> 0;
});

function crc32(data: Buffer) {
  let crc = 0xffffffff;

  for (const byte of data) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date = new Date()) {
  const year = Math.max(date.getFullYear(), 1980);
  const dosTime =
    (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1);
  const dosDate =
    ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();

  return { dosTime, dosDate };
}

function writeString(value: string) {
  return Buffer.from(textEncoder.encode(value));
}

function createZip(files: ZipFile[]) {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;
  const { dosTime, dosDate } = dosDateTime();

  files.forEach((file) => {
    const fileName = writeString(file.name);
    const checksum = crc32(file.data);

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0x0800, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt16LE(dosTime, 10);
    localHeader.writeUInt16LE(dosDate, 12);
    localHeader.writeUInt32LE(checksum, 14);
    localHeader.writeUInt32LE(file.data.length, 18);
    localHeader.writeUInt32LE(file.data.length, 22);
    localHeader.writeUInt16LE(fileName.length, 26);
    localHeader.writeUInt16LE(0, 28);

    localParts.push(localHeader, fileName, file.data);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0x0800, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt16LE(dosTime, 12);
    centralHeader.writeUInt16LE(dosDate, 14);
    centralHeader.writeUInt32LE(checksum, 16);
    centralHeader.writeUInt32LE(file.data.length, 20);
    centralHeader.writeUInt32LE(file.data.length, 24);
    centralHeader.writeUInt16LE(fileName.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);

    centralParts.push(centralHeader, fileName);
    offset += localHeader.length + fileName.length + file.data.length;
  });

  const centralDirectory = Buffer.concat(centralParts);
  const endHeader = Buffer.alloc(22);
  endHeader.writeUInt32LE(0x06054b50, 0);
  endHeader.writeUInt16LE(0, 4);
  endHeader.writeUInt16LE(0, 6);
  endHeader.writeUInt16LE(files.length, 8);
  endHeader.writeUInt16LE(files.length, 10);
  endHeader.writeUInt32LE(centralDirectory.length, 12);
  endHeader.writeUInt32LE(offset, 16);
  endHeader.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralDirectory, endHeader]);
}

function csvEscape(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function toCsv(rows: unknown[][]) {
  return `${rows.map((row) => row.map(csvEscape).join(",")).join("\n")}\n`;
}

function safePathPart(value: string) {
  return (
    value
      .trim()
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "uncategorized"
  );
}

function imageExtension(url: string, contentType: string | null) {
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("webp")) return "webp";
  if (contentType?.includes("gif")) return "gif";

  const pathname = new URL(url).pathname;
  const extension = pathname.split(".").pop()?.toLowerCase();

  if (extension && /^[a-z0-9]{2,5}$/.test(extension)) {
    return extension;
  }

  return "jpg";
}

async function fetchImage(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    return null;
  }

  const arrayBuffer = await response.arrayBuffer();

  return {
    data: Buffer.from(arrayBuffer),
    contentType: response.headers.get("content-type"),
  };
}

export async function POST(request: Request) {
  const { receiptIds } = (await request.json().catch(() => ({}))) as {
    receiptIds?: string[];
  };

  if (!receiptIds?.length) {
    return NextResponse.json(
      { error: "No receipts selected for export." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in to export receipts." },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("receipts")
    .select("*")
    .eq("user_id", user.id)
    .in("id", receiptIds);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const receipts = ((data || []) as Receipt[]).sort((a, b) =>
    a.category.localeCompare(b.category) || a.vendor.localeCompare(b.vendor)
  );

  const files: ZipFile[] = [];
  const imagePaths = new Map<string, string>();

  for (const receipt of receipts) {
    if (!receipt.image_url) continue;

    try {
      const image = await fetchImage(receipt.image_url);
      if (!image) continue;

      const extension = imageExtension(receipt.image_url, image.contentType);
      const category = safePathPart(receipt.category);
      const vendor = safePathPart(receipt.vendor);
      const fileName = `${vendor}-${Number(receipt.amount).toFixed(2)}-${
        receipt.id
      }.${extension}`;
      const imagePath = `receipt-images/${category}/${fileName}`;

      files.push({ name: imagePath, data: image.data });
      imagePaths.set(receipt.id, imagePath);
    } catch {
      imagePaths.set(receipt.id, "Image could not be downloaded");
    }
  }

  const receiptRows = [
    [
      "Category",
      "Vendor",
      "Amount",
      "Notes",
      "Receipt Image File",
      "Receipt Image URL",
      "Created At",
    ],
    ...receipts.map((receipt) => [
      receipt.category,
      receipt.vendor,
      Number(receipt.amount).toFixed(2),
      receipt.notes || "",
      imagePaths.get(receipt.id) || "",
      receipt.image_url || "",
      receipt.created_at || "",
    ]),
  ];

  const summary = receipts.reduce<Record<string, { count: number; total: number }>>(
    (totals, receipt) => {
      const category = receipt.category || "Other";
      totals[category] ||= { count: 0, total: 0 };
      totals[category].count += 1;
      totals[category].total += Number(receipt.amount);
      return totals;
    },
    {}
  );

  const summaryRows = [
    ["Category", "Receipt Count", "Total Amount"],
    ...Object.entries(summary)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, value]) => [
        category,
        String(value.count),
        value.total.toFixed(2),
      ]),
  ];

  files.unshift(
    { name: "receipts.csv", data: writeString(toCsv(receiptRows)) },
    { name: "summary-by-category.csv", data: writeString(toCsv(summaryRows)) }
  );

  const zip = createZip(files);

  return new Response(zip, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="receiptr-export-${new Date()
        .toISOString()
        .slice(0, 10)}.zip"`,
    },
  });
}
