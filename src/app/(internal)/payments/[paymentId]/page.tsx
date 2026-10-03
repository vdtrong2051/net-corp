import { PaymentDetailScreen } from "@/modules/payments/ui/payment-detail-screen";

type PaymentDetailPageProps = {
  params: Promise<{
    paymentId: string;
  }>;
};

export default async function PaymentDetailPage({
  params,
}: PaymentDetailPageProps) {
  const { paymentId } = await params;

  return <PaymentDetailScreen paymentId={paymentId} />;
}
