import { Hono } from 'hono'

const app = new Hono()

// Root redirect to main page
app.get('/', (c) => {
  return c.redirect('/static/index.html')
})

// Health check endpoint
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', message: 'ЛогистикПро API работает' })
})

// Future API endpoints for form submissions can be added here
// Example: POST /api/request - для обработки заявок
// Example: POST /api/calculator - для расчёта стоимости доставки

export default app
