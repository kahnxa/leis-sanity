export const COUPON_CODES = {
  LEISHOLIDAY: "LEISHOLIDAY",
} as const;

export type CouponCode = keyof typeof COUPON_CODES;
