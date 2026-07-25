import type { SupabaseClient } from '@supabase/supabase-js'

function appError(message: string, code = 400) {
  const error = new Error(message) as Error & { code?: number }
  error.code = code
  return error
}

interface CreateTransactionParams {
  projectId: number
  userId: number
  amount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  serverKey: string
  isProduction: boolean
}

export async function createTransaction(
  supabase: SupabaseClient,
  params: CreateTransactionParams
) {
  const {
    projectId, userId, amount,
    customerName, customerEmail, customerPhone,
    serverKey, isProduction,
  } = params

  if (!amount || amount <= 0) throw appError('Amount tidak valid', 400)

  const orderId = `WEBKITA-${projectId}-${Date.now()}`

  const midtransUrl = isProduction
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions'

  const authKey = btoa(`${serverKey}:`)

  const payload = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    customer_details: {
      first_name: customerName,
      email: customerEmail,
      phone: customerPhone,
    },
    item_details: [
      {
        id: `project-${projectId}`,
        price: amount,
        quantity: 1,
        name: `Pembayaran Project #${projectId}`,
      },
    ],
  }

  const response = await fetch(midtransUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${authKey}`,
    },
    body: JSON.stringify(payload),
  })

  const midtransData = await response.json() as any

  if (!response.ok) {
    throw appError(midtransData?.error_messages?.[0] || 'Gagal membuat transaksi Midtrans', 500)
  }

  // Simpan ke tabel payments
  const { data, error } = await supabase
    .from('payments')
    .insert({
      project_id: projectId,
      user_id: userId,
      order_id: orderId,
      amount,
      status: 'pending',
      snap_token: midtransData.token,
      snap_url: midtransData.redirect_url,
    })
    .select('*')
    .single()

  if (error) throw appError(error.message, 500)

  return {
    ...data,
    snap_token: midtransData.token,
    snap_url: midtransData.redirect_url,
  }
}

async function sha512Hex(input: string) {
  const data = new TextEncoder().encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-512', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function handleNotification(
  supabase: SupabaseClient,
  notification: any,
  serverKey: string
) {
  const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } =
    notification

  if (!order_id) throw appError('Order ID tidak ditemukan', 400)

  // Verifikasi signature Midtrans supaya notifikasi tidak bisa dipalsukan
  // (tanpa ini, siapa pun bisa POST body palsu dan menandai transaksi apa
  // pun sebagai "paid" tanpa benar-benar membayar).
  const expectedSignature = await sha512Hex(
    `${order_id}${status_code}${gross_amount}${serverKey}`
  )
  if (!signature_key || signature_key !== expectedSignature) {
    throw appError('Signature tidak valid', 403)
  }

  let status = 'pending'

  if (transaction_status === 'capture') {
    status = fraud_status === 'challenge' ? 'challenge' : 'paid'
  } else if (transaction_status === 'settlement') {
    status = 'paid'
  } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
    status = 'failed'
  } else if (transaction_status === 'pending') {
    status = 'pending'
  }

  const { error } = await supabase
    .from('payments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('order_id', order_id)

  if (error) throw appError(error.message, 500)
}
