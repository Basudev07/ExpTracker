import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  TrendingUp,
  User,
  WalletCards,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import api from '../utils/api';
import iconImg from '../assets/icon.png';

const emptyForm = { name: '', email: '', password: '' };
const getErrorMessage = (e) => e?.response?.data?.message || e?.message || 'Authentication failed';

const features = [
  { label: 'Track cashflow', sub: 'Income & expenses at a glance', Icon: TrendingUp },
  { label: 'Secure account', sub: 'Your data stays private', Icon: ShieldCheck },
  { label: 'Organized records', sub: 'Smart categories & history', Icon: WalletCards },
];

const THEME_STORAGE_KEY = 'theme';

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';
  return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(emptyForm);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState(null);
  const [theme, setTheme] = useState(getInitialTheme);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => {
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      toast.success(
        `${nextTheme === 'dark' ? 'Dark' : 'Light'} mode activated`
      );
      return nextTheme;
    });
  };

  useEffect(() => {
    if (!isLogin && nameRef.current) nameRef.current.focus();
    else if (isLogin && emailRef.current) emailRef.current.focus();
  }, [isLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((c) => ({ ...c, [name]: value }));
    setErrors((c) => ({ ...c, [name]: '' }));
  };

  const resetForm = () => { setFormData(emptyForm); setErrors({}); setShowPassword(false); };

  const validateForm = () => {
    const next = {};
    if (!isLogin && !formData.name.trim()) next.name = 'Name is required';
    if (!formData.email.trim()) next.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) next.email = 'Enter a valid email';
    if (!formData.password) next.password = 'Password is required';
    else if (formData.password.length < 8) next.password = 'Minimum 8 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setIsLoading(true);
      const endpoint = isLogin ? '/user/login' : '/user/register';
      const payload = isLogin ? { email: formData.email, password: formData.password } : formData;
      const { data } = await api.post(endpoint, payload);
      if (!data?.token) throw new Error(data?.message || 'Authentication failed');
      localStorage.setItem('token', data.token);
      toast.success(isLogin ? 'Welcome back.' : 'Account created.');
      navigate('/', { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (loginMode) => {
    if (animating || loginMode === isLogin) return;
    setDirection(loginMode ? 'toLogin' : 'toRegister');
    setAnimating(true);
    setTimeout(() => {
      setIsLogin(loginMode);
      resetForm();
      setTimeout(() => { setAnimating(false); setDirection(null); }, 50);
    }, 240);
  };

  const slideOut = direction === 'toRegister' ? 'a-out-left' : 'a-out-right';
  const slideIn = direction === 'toRegister' ? 'a-in-right' : 'a-in-left';
  const formCls = animating ? slideOut : (direction === null ? 'a-enter' : slideIn);

  return (
    <>
      <style>{`
        @keyframes outLeft  { from{opacity:1;transform:translateX(0) scale(1)}    to{opacity:0;transform:translateX(-24px) scale(0.97)} }
        @keyframes outRight { from{opacity:1;transform:translateX(0) scale(1)}    to{opacity:0;transform:translateX(24px) scale(0.97)} }
        @keyframes inRight  { from{opacity:0;transform:translateX(24px) scale(0.97)} to{opacity:1;transform:translateX(0) scale(1)} }
        @keyframes inLeft   { from{opacity:0;transform:translateX(-24px) scale(0.97)} to{opacity:1;transform:translateX(0) scale(1)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes nameDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes nameUp   { from{opacity:1;transform:translateY(0)}     to{opacity:0;transform:translateY(-10px)} }

        .a-out-left  { animation: outLeft  .24s cubic-bezier(.4,0,.2,1)   forwards; }
        .a-out-right { animation: outRight .24s cubic-bezier(.4,0,.2,1)   forwards; }
        .a-in-right  { animation: inRight  .32s cubic-bezier(.16,1,.3,1)  forwards; }
        .a-in-left   { animation: inLeft   .32s cubic-bezier(.16,1,.3,1)  forwards; }
        .a-enter     { animation: fadeUp   .34s cubic-bezier(.16,1,.3,1)  both; }
        .name-enter  { animation: nameDown .30s cubic-bezier(.16,1,.3,1)  both; }
        .name-exit   { animation: nameUp   .20s cubic-bezier(.4,0,.2,1)   both; }

        /* sliding tab pill */
        .tab-pill {
          position: absolute; inset: 3px;
          width: calc(50% - 3px);
          border-radius: .625rem;
          background: hsl(var(--b1));
          box-shadow: 0 1px 4px rgba(0,0,0,.10);
          transition: transform .32s cubic-bezier(.34,1.56,.64,1);
          pointer-events: none;
        }
        .tab-pill.reg { transform: translateX(100%); }

        /* name field slot — fixed height so nothing shifts */
        .name-slot {
          height: 0;
          overflow: visible;
          position: relative;
        }
        .name-slot-inner {
          position: absolute;
          top: 0; left: 0; right: 0;
          /* when hidden it still occupies 0px in flow */
        }

        /* The form wrapper has a fixed reserved top padding for the name field */
        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        /* Name field reserves space only in register mode */
        .name-reserved { padding-top: 5.5rem; transition: padding-top .28s cubic-bezier(.16,1,.3,1); }
        .name-gone     { padding-top: 0;       transition: padding-top .24s cubic-bezier(.4,0,.2,1); }

        /* input focus ring */
        .auth-field:focus-within {
          border-color: hsl(var(--p)) !important;
          box-shadow: 0 0 0 3px hsl(var(--p)/.13);
        }
        .auth-field { transition: border-color .15s, box-shadow .15s; }


        /* submit shimmer */
        .auth-btn { position:relative; overflow:hidden; }
        .auth-btn::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);
          transform:translateX(-100%);
        }
        .auth-btn:not(:disabled):hover::after { transform:translateX(100%); transition:transform .48s ease; }

        @media(max-width:639px){
          .rp { padding: 1.25rem !important; }
          .card-root { border-radius: 1.25rem !important; }
        }
      `}</style>

      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base-200 p-3 sm:p-4">
        {/* theme toggle */}
        <div className="absolute top-4 right-4 z-50">
          <button
            type="button"
            className="btn btn-ghost btn-circle border border-base-300 bg-base-100/80 shadow-md backdrop-blur-md hover:bg-base-200 text-base-content"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* ambient glow */}
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 15% 20%,hsl(var(--p)/.09) 0%,transparent 60%),radial-gradient(ellipse 50% 40% at 85% 80%,hsl(var(--s)/.07) 0%,transparent 60%)' }} />
        {/* subtle grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[.025]" style={{ backgroundImage: 'linear-gradient(hsl(var(--bc)) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--bc)) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

        <section className="card-root relative z-10 grid w-full max-w-5xl overflow-hidden rounded-3xl border border-base-300 bg-base-100/92 shadow-2xl backdrop-blur-xl lg:grid-cols-[1fr_28rem]">

          {/* ── Left panel ── */}
          <div className="hidden border-r border-base-300 bg-base-200/40 p-10 lg:flex lg:flex-col lg:justify-between" style={{ minHeight: '580px' }}>
            <div>
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-base-300 bg-base-100 shadow-sm">
                  <img src={iconImg} alt="Expense Tracker" className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight">Expense Tracker</h1>
                  <p className="text-sm text-base-content/50">Finance workspace</p>
                </div>
              </div>
              <h2 className="max-w-sm text-[2.1rem] font-black leading-[1.15] tracking-tight">
                Manage money with{' '}
                <span className="text-primary">clarity.</span>
              </h2>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-base-content/55">
                A focused dashboard for tracking income, expenses, categories, and monthly activity.
              </p>
            </div>

            <div className="grid gap-2.5">
              {features.map(({ label, sub, Icon }) => (
                <div key={label} className="feat-card flex items-center gap-3.5 rounded-2xl border border-base-300 bg-base-100 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight">{label}</p>
                    <p className="text-xs text-base-content/50">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-base-content/35">
              <Sparkles size={13} />
              <span>Developers: Aviraj & Basudev</span>
            </div>
          </div>

          {/* ── Right panel ── */}
          <div className="rp flex flex-col p-6 sm:p-8" style={{ minHeight: '580px' }}>

            {/* Mobile logo */}
            <div className="mb-5 text-center lg:hidden">
              <div className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-2xl border border-base-300 bg-base-100 shadow-sm">
                <img src={iconImg} alt="Expense Tracker" className="h-8 w-8" />
              </div>
              <h1 className="text-xl font-black tracking-tight">Expense Tracker</h1>
            </div>

            {/* Heading — slides on switch */}
            <div className={`mb-5 ${formCls}`} style={{ willChange: 'transform,opacity' }}>
              <h2 className="text-2xl font-bold sm:text-3xl">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="mt-1 text-sm text-base-content/55">
                {isLogin ? 'Sign in to continue.' : 'Start tracking your finances.'}
              </p>
            </div>

            {/* Tab switcher */}
            <div className="relative mb-6 flex rounded-[.75rem] bg-base-200 p-[3px]" role="tablist">
              <div className={`tab-pill ${isLogin ? '' : 'reg'}`} aria-hidden="true" />
              {[{ label: 'Login', login: true }, { label: 'Register', login: false }].map(({ label, login }) => (
                <button
                  key={label} type="button" role="tab"
                  aria-selected={isLogin === login}
                  className="relative z-10 flex-1 py-2 text-sm font-semibold transition-colors duration-200"
                  style={{ color: isLogin === login ? 'hsl(var(--bc))' : 'hsl(var(--bc)/0.45)' }}
                  onClick={() => switchMode(login)}
                >{label}</button>
              ))}
            </div>

            {/* Form — slides on switch */}
            <div className={`flex-1 ${formCls}`} style={{ willChange: 'transform,opacity' }}>
              <form onSubmit={handleSubmit} noValidate>

                {/*
                  Name field: always rendered but absolutely positioned.
                  The wrapper div's padding-top reserves/releases space
                  without shifting email/password/button widths.
                */}
                <div className={`form-fields ${isLogin ? 'name-gone' : 'name-reserved'}`}>

                  {/* Name slot — zero-height row, inner is absolute */}
                  <div className="name-slot" style={{ marginTop: isLogin ? 0 : undefined }}>
                    <div
                      className={`name-slot-inner ${isLogin ? 'name-exit' : 'name-enter'}`}
                      style={{ top: isLogin ? 0 : '-5.5rem' }}
                    >
                      <label className="label pb-1" htmlFor="name">
                        <span className="label-text text-xs font-semibold uppercase tracking-wide text-base-content/50">Full Name</span>
                      </label>
                      <label className={`auth-field input input-bordered flex w-full items-center gap-2.5 ${errors.name ? 'input-error' : ''}`}>
                        <User size={16} className="shrink-0 text-base-content/35" />
                        <input
                          ref={nameRef}
                          id="name" name="name"
                          className="grow text-sm"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={isLoading || isLogin}
                          tabIndex={isLogin ? -1 : 0}
                          autoComplete="name"
                        />
                      </label>
                      {errors.name && <p className="mt-1.5 text-xs font-medium text-error">{errors.name}</p>}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="label pb-1" htmlFor="email">
                      <span className="label-text text-xs font-semibold uppercase tracking-wide text-base-content/50">Email</span>
                    </label>
                    <label className={`auth-field input input-bordered flex w-full items-center gap-2.5 ${errors.email ? 'input-error' : ''}`}>
                      <Mail size={16} className="shrink-0 text-base-content/35" />
                      <input
                        ref={emailRef}
                        id="email" name="email" type="email"
                        className="grow text-sm"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                        autoComplete="email"
                      />
                    </label>
                    {errors.email && <p className="mt-1.5 text-xs font-medium text-error">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="label pb-1" htmlFor="password">
                      <span className="label-text text-xs font-semibold uppercase tracking-wide text-base-content/50">Password</span>
                    </label>
                    <label className={`auth-field input input-bordered flex w-full items-center gap-2.5 ${errors.password ? 'input-error' : ''}`}>
                      <Lock size={16} className="shrink-0 text-base-content/35" />
                      <input
                        id="password" name="password"
                        type={showPassword ? 'text' : 'password'}
                        className="grow text-sm"
                        placeholder="Min. 8 characters"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isLoading}
                        autoComplete={isLogin ? 'current-password' : 'new-password'}
                      />
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs btn-circle opacity-50 hover:opacity-100"
                        onClick={() => setShowPassword((c) => !c)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </label>
                    {errors.password && <p className="mt-1.5 text-xs font-medium text-error">{errors.password}</p>}
                  </div>

                  {/* Submit */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      className="auth-btn btn btn-primary w-full gap-2 text-sm font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <><span className="loading loading-spinner loading-sm" />Processing…</>
                      ) : (
                        <>{isLogin ? 'Sign In' : 'Create Account'}<ArrowRight size={16} /></>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer link */}
            <div className="mt-5 text-center">
              <p className="text-xs text-base-content/45">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  type="button"
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                  onClick={() => switchMode(!isLogin)}
                  disabled={isLoading}
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}