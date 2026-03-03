import type { Metadata } from 'next'
import { Pirata_One, Special_Elite, Noto_Sans_SC, Uncial_Antiqua } from 'next/font/google'
import './globals.css'

const pirataOne = Pirata_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pirata',
  display: 'swap',
})

const specialElite = Special_Elite({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-special',
  display: 'swap',
})

const notoSansSC = Noto_Sans_SC({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-noto',
  display: 'swap',
  preload: false,
})

const uncialAntiqua = Uncial_Antiqua({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-uncial',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Death Note — How To Use It',
  description: 'Death Note: How To Use It — Page I',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body
        className={`${pirataOne.variable} ${specialElite.variable} ${notoSansSC.variable} ${uncialAntiqua.variable} bg-black`}
      >
        {children}
      </body>
    </html>
  )
}
