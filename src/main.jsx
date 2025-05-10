import { createRoot } from 'react-dom/client'
import './assets/sass/main.scss'
import App from './App.jsx'
import Nav from './Nav.jsx'

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Nav />
  </>,
)
