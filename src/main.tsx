import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import './index.css'
import i18n from './i18n/config'
import App from './App.tsx'

document.documentElement.lang = i18n.language
document.title = i18n.t('app.name')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster richColors position="top-center" containerAriaLabel={i18n.t('accessibility.notifications')} />
    </BrowserRouter>
  </StrictMode>,
)
