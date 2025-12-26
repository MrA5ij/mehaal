import './globals.css'
import { Inter, Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from '@repo/ui/theme-provider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading' })

export const metadata = {
  title: 'My AI SaaS',
  description: 'AI-powered Architecture',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-background text-foreground`}>
         {/* Tenant object would come from DB/Middleware in production */}
         <ThemeProvider tenant={{ primaryColor: '#7c3aed' }}>
            {children}
         </ThemeProvider>
      </body>
    </html>
  )
}
