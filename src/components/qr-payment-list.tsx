'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function QrPaymentList({ qrPayments }: { qrPayments: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Payments</CardTitle>
        <CardDescription>A list of all QR code payments.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>QR Payments list will be implemented here.</p>
      </CardContent>
    </Card>
  )
}
