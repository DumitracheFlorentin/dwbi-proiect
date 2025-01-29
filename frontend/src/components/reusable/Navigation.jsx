import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export default function Navigation() {
  const location = useLocation()

  return (
    <div className="grid grid-cols-3 gap-3">
      <Link to="/">
        <Button
          className={
            location.pathname === '/'
              ? 'bg-blue-500 text-white w-full'
              : 'w-full'
          }
        >
          📈 Q4 - Transporturi
        </Button>
      </Link>

      <Link to="/second">
        <Button
          className={
            location.pathname === '/second'
              ? 'bg-blue-500 text-white w-full'
              : 'w-full'
          }
        >
          📊 Q4 - Transporturi - Produse alimentare si bauturi
        </Button>
      </Link>

      <Link to="/third">
        <Button
          className={
            location.pathname === '/third'
              ? 'bg-blue-500 text-white w-full'
              : 'w-full'
          }
        >
          📈 Top 3 Localități per Unitate de Măsură
        </Button>
      </Link>

      <Link to="/fourth">
        <Button
          className={
            location.pathname === '/fourth'
              ? 'bg-blue-500 text-white w-full'
              : 'w-full'
          }
        >
          📊 Top 3 Produse per Șofer
        </Button>
      </Link>

      <Link to="/fifth">
        <Button
          className={
            location.pathname === '/fifth'
              ? 'bg-blue-500 text-white w-full'
              : 'w-full'
          }
        >
          📈 Comparare Cantități Octombrie
        </Button>
      </Link>
    </div>
  )
}
