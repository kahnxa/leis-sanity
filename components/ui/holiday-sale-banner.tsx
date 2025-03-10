import { getActiveSaleByCouponCode } from "@/sanity/lib/sales/getActiveSaleByCouponCode";

async function HolidaySaleBanner() {
  const sale = await getActiveSaleByCouponCode("LEISHOLIDAY");

  if (!sale?.isActive) {
    return null;
  }

  return <div>Holiday Sale Banner</div>;
}

export default HolidaySaleBanner;
