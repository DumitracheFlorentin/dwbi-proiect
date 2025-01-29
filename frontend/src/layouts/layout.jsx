import { Outlet } from 'react-router-dom'

import Navigation from '../components/reusable/Navigation'

function Layout() {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto flex flex-col w-full min-h-screen p-5">
        <main className="flex-grow flex flex-col my-5 h-full px-10">
          <Navigation />

          <Outlet />
        </main>
        <p className="px-10 text-center text-sm text-gray-500">
          Copyright &copy; 2025 Florentin Dumitrache. All rights reserved!
        </p>
      </div>
    </div>
  )
}

export default Layout
