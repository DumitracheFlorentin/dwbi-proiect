import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Layout from './layouts/layout'

import Home from './pages/Home'
import Second from './pages/Second'
import Third from './pages/Third'
import Fourth from './pages/Fourth'
import Fifth from './pages/Fifth'

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/second" element={<Second />} />
            <Route path="/third" element={<Third />} />
            <Route path="/fourth" element={<Fourth />} />
            <Route path="/fifth" element={<Fifth />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}
