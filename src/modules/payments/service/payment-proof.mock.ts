import type { PaymentProof } from "@/modules/payments/model/payment.types";

const MAX_MOCK_PROOF_SIZE = 1_000_000;

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Không đọc được file."));

        return;
      }

      resolve(reader.result);
    };

    reader.onerror = () => reject(new Error("Không đọc được file."));

    reader.readAsDataURL(file);
  });
}

export async function createMockPaymentProof(
  file: File
): Promise<PaymentProof> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Minh chứng hiện chỉ nhận file ảnh.");
  }

  /*
   * Chỉ là giới hạn cho localStorage mock.
   * GĐ21 dùng Blob thật sẽ bỏ giới hạn này.
   */
  if (file.size > MAX_MOCK_PROOF_SIZE) {
    throw new Error("Ảnh mock nên nhỏ hơn 1 MB.");
  }

  const url = await readFileAsDataUrl(file);

  return {
    id: `proof-${crypto.randomUUID()}`,

    fileName: file.name,

    mimeType: file.type,

    url,

    uploadedAt: new Date().toISOString(),
  };
}
