import AppRouter from './router/AppRouter'
import { Toaster } from 'react-hot-toast'
import './App.css'

function App() {
  return (
    <div className="App">
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#4caf50',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#f44336',
            },
          },
        }}
      />
    </div>
  )
}

export default App
