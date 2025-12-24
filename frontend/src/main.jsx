import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
import Root_Router_App from './Root_Router_App'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <Root_Router_App />
  </StrictMode>,
)
