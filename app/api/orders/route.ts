export const runtime = "edge";

import { NextResponse } from "next/server";
import { createOrder, getProductById } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, wilaya, city, address, deliveryType, items, total, shippingFee, utm } = body;

    if (!name || !phone || !wilaya || !city || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const digits = String(phone).replace(/\D/g, "");
    if (digits.length !== 10 || !/^0[567]/.test(digits)) {
      return NextResponse.json({ success: false, error: "Invalid Algerian phone number" }, { status: 400 });
    }

    const orderId = Math.floor(1000 + Math.random() * 9000).toString();

    const orderItems = [];
    let calculatedTotal = 0;
    for (const item of items) {
      const product = await getProductById(item.productId);
      const price = product ? product.price : Number(item.price || 0);
      const qty = Math.max(1, Number(item.qty || 1));
      orderItems.push({
        product_id: item.productId || null,
        product_slug: item.slug || null,
        product_name: item.name || (product ? product.name : "منتج"),
        qty,
        price,
      });
      calculatedTotal += price * qty;
    }

    const finalShippingFee = Number(shippingFee || 0);
    const finalTotal = Number(total || calculatedTotal + finalShippingFee);

    await createOrder(
      {
        id: orderId,
        customer_name: name,
        phone: digits,
        wilaya,
        city,
        address: address || "",
        delivery_type: deliveryType === "stopdesk" ? "stopdesk" : "home",
        shipping_fee: finalShippingFee,
        total: finalTotal,
        status: "pending",
        source_utm: utm || "",
      },
      orderItems
    );

    return NextResponse.json({
      success: true,
      orderId,
      message: "Order received successfully",
      total: finalTotal,
    });
  } catch (error: any) {
    console.error("Order error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
