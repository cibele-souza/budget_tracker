import { NavLink } from 'react-router-dom';

const links = [
   { to: '/upload', label: 'Upload' },
   { to: '/transactions', label: 'Transactions' },
   { to: '/budget', label: 'Budget' },
   { to: '/', label: 'Dashboard' },
];

export default function TopNav() {
   return (
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
         <div className="max-w-7xl mx-auto px-6 py-2 flex gap-6 sm:gap-12 justify-end">
            {links.map(({ to, label }) => (
               <NavLink
                  key={to}
                  to={to}
                  end
                  className={({ isActive }) =>
                     isActive
                        ? 'relative text-sm text-indigo-700 pb-1 border-b-2 border-indigo-700'
                        : 'relative text-sm text-gray-600 hover:text-gray-900 pb-1'
                  }
               >
                  {({ isActive }) => (
                     <span className="relative inline-block">
                        <span className="invisible font-semibold">{label}</span>
                        <span
                           className={`absolute inset-0 ${isActive ? 'font-semibold' : 'font-normal'}`}
                        >
                           {label}
                        </span>
                     </span>
                  )}
               </NavLink>
            ))}
         </div>
      </nav>
   );
}
