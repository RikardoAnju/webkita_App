import { Hono } from 'hono'
import { createSupabase } from './lib/supabase'
import { authRoute } from './routes/auth.route'
import { corsMiddleware } from './middleware/cors.middleware'
import { loggerMiddleware } from './middleware/logger.middleware'
import { projectRoute } from './routes/project.route'
import { userRoute } from './routes/user.route'
import { pricingRoute } from './routes/pricing.route'
import { attachmentRoute } from './routes/attachment.route'
import { paymentRoute } from './routes/payment.route'

type Env = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  JWT_SECRET: string
  RESEND_API_KEY: string
  MAIL_FROM_EMAIL: string
  MAIL_FROM_NAME: string
  APP_URL: string
  MIDTRANS_SERVER_KEY: string
  MIDTRANS_IS_PRODUCTION: string
}

const app = new Hono<{ Bindings: Env }>()

app.use('*', corsMiddleware)
app.use('*', loggerMiddleware)

app.get('/', (c) => {
  return c.json({ app: 'WEBKITA API', status: 'running' })
})

app.get('/api/health', (c) => {
  return c.json({
    success: true,
    message: 'WEBKITA API berjalan',
    timestamp: new Date().toISOString(),
  })
})

app.get('/api/test-db', async (c) => {
  const supabase = createSupabase(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data, error } = await supabase
    .from('users')
    .select('id, username, first_name, last_name, email, phone, role, is_aktif, created_at')
    .limit(1)

  if (error) return c.json({ success: false, message: error.message }, 500)
  return c.json({ success: true, data })
})

app.route('/api/auth',        authRoute)
app.route('/api/project',     projectRoute)
app.route('/api/users',       userRoute)
app.route('/api/attachments', attachmentRoute)
app.route('/api/payment',     paymentRoute)
app.route('/api/pricing',     pricingRoute)   // ← ini yang kurang

export default app