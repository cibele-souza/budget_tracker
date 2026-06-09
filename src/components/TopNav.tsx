import { NavLink } from 'react-router-dom';

const links = [
   { to: '/upload', label: 'Upload' },
   { to: '/transactions', label: 'Transactions' },
   { to: '/budget', label: 'Budget' },
   { to: '/', label: 'Dashboard' },
];

export default function TopNav() {
   return (
      <nav className="bg-white border-b border-gray-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-2 flex gap-12 justify-end">
            {links.map(({ to, label }) => (
               <NavLink
                  key={to}
                  to={to}
                  end
                  className={({ isActive }) =>
                     isActive
                        ? 'font-semibold text-indigo-700 border-b-2 border-indigo-700 pb-1'
                        : 'text-gray-600 hover:text-gray-900 pb-1'
                  }
               >
                  {label}
               </NavLink>
            ))}
         </div>
      </nav>
   );
}
