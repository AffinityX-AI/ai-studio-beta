import postgres from 'postgres'

const sql = postgres(process.env.ONE_TOUCH_DATABASE_URL ?? '', {
  connect_timeout: 300,
  idle_timeout: 30,
  max: 5,
})

export default sql
