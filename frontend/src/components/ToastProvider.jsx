import { useEffect } from 'react';
import { Toaster, useToasterStore, toast } from 'react-hot-toast';

export default function ToastProvider({ children }) {
  const { toasts } = useToasterStore();

  useEffect(() => {
    const visibleToasts = toasts.filter((t) => t.visible);
    if (visibleToasts.length > 2) {
      const numberToDismiss = visibleToasts.length - 2;
      for (let i = 0; i < numberToDismiss; i++) {
        toast.dismiss(visibleToasts[i].id);
      }
    }
  }, [toasts]);

  return (
    <>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={12}
        containerStyle={{
          top: 20,
          right: 20,
        }}
        toastOptions={{
          duration: 4000,
          className: 'toast-premium',
          style: {
            background: 'hsl(var(--b1) / 0.92)',
            color: 'hsl(var(--bc))',
            border: '1px solid hsl(var(--b3) / 0.8)',
            borderRadius: '1rem',
            boxShadow:
              '0 20px 45px -18px rgb(0 0 0 / 0.35), 0 8px 18px -12px rgb(0 0 0 / 0.22)',
            padding: '14px 16px',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: 1.35,

            width: 'calc(100vw - 32px)',
            maxWidth: '210px',

            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          },

          success: {
            duration: 3000,
            iconTheme: {
              primary: 'hsl(var(--su))',
              secondary: 'hsl(var(--suc))',
            },
            style: {
              border: '1px solid hsl(var(--su) / 0.35)',
              background:
                'linear-gradient(135deg, hsl(var(--b1) / 0.96), hsl(var(--su) / 0.08))',
              color: 'hsl(var(--bc))',
            },
          },

          error: {
            duration: 4000,
            iconTheme: {
              primary: 'hsl(var(--er))',
              secondary: 'hsl(var(--erc))',
            },
            style: {
              border: '1px solid hsl(var(--er) / 0.38)',
              background:
                'linear-gradient(135deg, hsl(var(--b1) / 0.96), hsl(var(--er) / 0.08))',
              color: 'hsl(var(--bc))',
            },
          },

          loading: {
            iconTheme: {
              primary: 'hsl(var(--p))',
              secondary: 'hsl(var(--pc))',
            },
            style: {
              border: '1px solid hsl(var(--p) / 0.28)',
              background:
                'linear-gradient(135deg, hsl(var(--b1) / 0.96), hsl(var(--p) / 0.07))',
            },
          },
        }}
      />
      {children}
    </>
  );
}