import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ChevronDown,
  Home,
  LogOut,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  TrendingDown,
  TrendingUp,
  UserRound,
  X,
} from 'lucide-react';

import api from '../utils/api';
import iconImg from '../assets/icon.png';

const THEME_STORAGE_KEY = 'theme';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const drawerVariants = {
  closed: { x: '-100%' },
  open: {
    x: 0,
    transition: { type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.3 },
  },
};

const menuGroups = [
  {
    id: 'overview',
    label: 'Workspace',
    defaultOpen: true,
    items: [
      {
        label: 'Dashboard',
        path: '/',
        icon: Home,
      },
    ],
  },
  {
    id: 'money',
    label: 'Finance',
    defaultOpen: true,
    items: [
      {
        label: 'Income',
        path: '/income',
        icon: TrendingUp,
      },
      {
        label: 'Expenses',
        path: '/expense',
        icon: TrendingDown,
      },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    defaultOpen: true,
    items: [
      {
        label: 'Profile',
        path: '/profile',
        icon: UserRound,
      },
      {
        label: 'Password',
        path: '/change-password',
        icon: ShieldCheck,
      },
    ],
  },
];

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';

  return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
}

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function SidebarItem({ item, isActive, onNavigate }) {
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      className={cx(
        'relative flex h-12 items-center gap-3 overflow-hidden rounded-2xl px-3 text-sm font-medium outline-none transition-all duration-200',
        isActive
          ? 'border border-primary/20 bg-primary/10 text-primary shadow-sm'
          : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
      )}
    >
      {isActive && (
        <motion.div
          layoutId="active-sidebar-item"
          className="absolute inset-0 rounded-2xl bg-primary/10"
          transition={{ type: 'spring', stiffness: 360, damping: 34 }}
        />
      )}

      {isActive && (
        <motion.div
          className="absolute left-2 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}

      <span
        className={cx(
          'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'bg-base-100 text-base-content/70'
        )}
      >
        <Icon size={19} strokeWidth={2.2} />
      </span>

      <span className="relative z-10 min-w-0 flex-1 truncate">
        {item.label}
      </span>
    </Link>
  );
}

function SidebarGroup({ group, query, location, onNavigate }) {
  const [open, setOpen] = useState(group.defaultOpen);

  const filteredItems = group.items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  if (!filteredItems.length) return null;

  return (
    <div className="space-y-2">
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-xl px-2 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-base-content/40 transition-colors hover:text-base-content/70"
        onClick={() => setOpen((current) => !current)}
      >
        <span>{group.label}</span>

        <motion.span animate={{ rotate: open ? 0 : -90 }}>
          <ChevronDown size={14} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="space-y-1 overflow-hidden"
          >
            {filteredItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/' &&
                  location.pathname.startsWith(item.path));

              return (
                <SidebarItem
                  key={item.label}
                  item={item}
                  isActive={isActive}
                  onNavigate={onNavigate}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarContent({
  mobile,
  onClose,
  theme,
  toggleTheme,
  profile,
  handleLogout,
}) {
  const location = useLocation();
  const [query, setQuery] = useState('');

  const visibleGroups = useMemo(() => menuGroups, []);

  return (
    <div className="relative flex h-full w-72 flex-col overflow-hidden border-r border-base-300 bg-base-100 text-base-content shadow-xl">
      {/* HEADER */}
      <div className="flex items-center gap-3 border-b border-base-300/70 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-base-300 bg-base-100 shadow-sm">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl">
            <img
              src={iconImg}
              alt="Expense Tracker"
              className="h-8 w-8 object-contain"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-black tracking-tight">
            Expense Tracker
          </h2>

          <p className="truncate text-xs text-base-content/50">
            Finance workspace
          </p>
        </div>

        {mobile && (
          <button
            type="button"
            className="btn btn-ghost btn-circle btn-sm"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* SEARCH */}
      <div className="border-b border-base-300/70 p-4">
        <label className="input input-bordered input-sm flex h-11 items-center gap-2 rounded-2xl bg-base-200/70">
          <Search size={16} className="text-base-content/40" />

          <input
            type="search"
            className="grow"
            placeholder="Search navigation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {visibleGroups.map((group) => (
          <SidebarGroup
            key={group.id}
            group={group}
            query={query}
            location={location}
            onNavigate={onClose}
          />
        ))}
      </nav>

      {/* FOOTER */}
      <div className="border-t border-base-300/70 p-3">
        <div className="mb-3 rounded-2xl border border-base-300 bg-base-200/70 p-3">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-base-300 bg-base-100">
                <UserRound size={20} />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">
                {profile.name || 'Finance User'}
              </p>

              <p className="truncate text-xs text-base-content/50">
                {profile.email || 'Protected account'}
              </p>
            </div>
          </div>
        </div>

        <div className={mobile ? "flex flex-col gap-2" : "grid grid-cols-2 gap-2"}>
          {!mobile && (
            <button
              type="button"
              className="btn btn-outline min-h-11 rounded-2xl border-base-300 justify-start gap-2"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          )}

          <button
            type="button"
            className={cx(
              "btn btn-error min-h-11 rounded-2xl justify-start gap-2",
              mobile ? "w-full" : ""
            )}
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    let isMounted = true;

    api
      .get('/user/me')
      .then((response) => {
        if (!isMounted) return;

        const user = response.data?.user;

        if (user) {
          setProfile({
            name: user.name || '',
            email: user.email || '',
          });
        }
      })
      .catch(() => {
        if (isMounted) {
          setProfile({
            name: '',
            email: '',
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTheme = () => {
    setTheme((current) => {
      const nextTheme = current === 'dark' ? 'light' : 'dark';

      toast.success(
        `${nextTheme === 'dark' ? 'Dark' : 'Light'} mode activated`
      );

      return nextTheme;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');

    toast.success('Logged out successfully');

    setMobileOpen(false);

    setTimeout(() => navigate('/auth'), 350);
  };

  return (
    <>
      {/* MOBILE NAVBAR */}
      <div className="navbar fixed top-0 left-0 right-0 z-40 border-b border-base-300 bg-base-100/90 shadow-lg backdrop-blur-xl lg:hidden">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="btn btn-ghost btn-circle shrink-0"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} />
            </button>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-base-300 bg-base-100 shadow-sm">
              <img
                src={iconImg}
                alt="Expense Tracker"
                className="h-6 w-6"
              />
            </div>

            <div className="leading-tight min-w-0">
              <p className="truncate text-sm font-black">
                Expense Tracker
              </p>

              <p className="truncate text-xs text-base-content/50">
                Finance workspace
              </p>
            </div>
          </div>
        </div>

        <div className="flex-none">
          <button
            type="button"
            className="btn btn-ghost btn-circle"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-50 bg-neutral/60 lg:hidden"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.aside
              className="fixed inset-y-0 left-0 z-50 lg:hidden will-change-transform"
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <SidebarContent
                mobile
                onClose={() => setMobileOpen(false)}
                theme={theme}
                toggleTheme={toggleTheme}
                profile={profile}
                handleLogout={handleLogout}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <aside className="sticky top-0 hidden h-screen shrink-0 lg:block">
        <SidebarContent
          mobile={false}
          onClose={() => {}}
          theme={theme}
          toggleTheme={toggleTheme}
          profile={profile}
          handleLogout={handleLogout}
        />
      </aside>
    </>
  );
}