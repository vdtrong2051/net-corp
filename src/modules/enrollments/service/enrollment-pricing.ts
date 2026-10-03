import type {
  ScholarshipSelection,
  VoucherSelection,
} from "@/modules/enrollments/model/enrollment.types";

export type ScholarshipOption = {
  id: string;

  label: string;

  percent: number;
};

export type VoucherOption = {
  code: string;

  label: string;

  amount: number;
};

/*
 * ============================================================
 * MOCK POLICY
 *
 * Đây chưa phải chính sách thương mại chính thức của NET CORP.
 *
 * GĐ6 hiện chỉ cần đủ dữ liệu để hoàn thiện UX.
 * Khi có rule học bổng / voucher thật thì chỉ thay service này,
 * không cần sửa Course Builder.
 * ============================================================
 */

export const scholarshipOptions: ScholarshipOption[] = [
  {
    id: "NONE",
    label: "Không học bổng",
    percent: 0,
  },

  {
    id: "HB60",
    label: "HB 60%",
    percent: 60,
  },

  {
    id: "HB70",
    label: "HB 70%",
    percent: 70,
  },
];

export const voucherOptions: VoucherOption[] = [
  {
    code: "NONE",
    label: "Không voucher",
    amount: 0,
  },

  {
    code: "VC-DEMO-300K",
    label: "Voucher demo 300.000đ",
    amount: 300000,
  },
];

export function buildScholarshipSelection(
  optionId: string,
  baseTuition: number
): ScholarshipSelection | undefined {
  const option = scholarshipOptions.find((item) => item.id === optionId);

  if (!option || option.id === "NONE") {
    return undefined;
  }

  return {
    id: option.id,

    label: option.label,

    valueType: "PERCENT",

    value: option.percent,

    discountAmount: Math.round(baseTuition * (option.percent / 100)),
  };
}

export function buildVoucherSelection(
  voucherCode: string
): VoucherSelection | undefined {
  const option = voucherOptions.find((item) => item.code === voucherCode);

  if (!option || option.code === "NONE") {
    return undefined;
  }

  return {
    code: option.code,

    label: option.label,

    valueType: "FIXED_AMOUNT",

    value: option.amount,

    discountAmount: option.amount,

    note: "Voucher mock phục vụ UI GĐ6. Thay bằng policy thật khi có quy định chính thức.",
  };
}

type CalculateFinalTuitionInput = {
  baseTuition: number;

  scholarship?: ScholarshipSelection;

  voucher?: VoucherSelection;
};

export function calculateFinalTuition({
  baseTuition,
  scholarship,
  voucher,
}: CalculateFinalTuitionInput) {
  const scholarshipDiscount = scholarship?.discountAmount ?? 0;

  const voucherDiscount = voucher?.discountAmount ?? 0;

  /*
   * MOCK RULE:
   *
   * Giá cuối
   * = Giá gốc
   * - tiền học bổng
   * - voucher.
   *
   * Không cho âm.
   *
   * Khi NET CORP chốt rule voucher áp trước/sau scholarship
   * thì sửa tại đây.
   */
  return Math.max(baseTuition - scholarshipDiscount - voucherDiscount, 0);
}
