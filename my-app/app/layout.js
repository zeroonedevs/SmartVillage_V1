import { Inter } from 'next/font/google'
import './globals.css'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Smart Village Revolution',
  description: 'Smart Village Revolution at K L Deemed to be University is a rural development programme broadly focusing upon the development in the villages which includes social development, cultural development and spread motivation among the people on social mobilization of the village community. The programme was launched by the President of KLEF, Hon\'ble Shri Koneru Lakshmaiah on the birth anniversary of Jayaprakash Narayan, on 11 October 2014.'
}

export default function RootLayout({ children }) {
  return (
      <html>
          <body className={inter.className}>
             {children}
          </body>
    </html>
  )
}
