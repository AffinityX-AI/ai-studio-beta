import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/', '/index'],
}

export function middleware(req: NextRequest) {
  // Getting the Pup IP from the request
  const { ip } = req
  // console.log("Middleware IP:", ip);
  const basicAuth = req.headers.get('authorization')
  const url = req.nextUrl

  // Bypass the basic auth on a certain env variable and Pub IP
  if (process.env.NODE_ENV === 'production') {
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1]
      const [user, pwd] = atob(authValue).split(':')

      const validUser = 'axguest'
      const validPassWord = 'axguest_2024'

      if (user === validUser && pwd === validPassWord) {
        return NextResponse.next()
      }
    }
    url.pathname = '/api/basicauth'

    return NextResponse.rewrite(url)
  }
}
