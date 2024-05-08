import './style.css'

export default function BlogPostGeneratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
