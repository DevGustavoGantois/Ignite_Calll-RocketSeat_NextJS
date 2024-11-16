import '../lib/dayjs'
import { SessionProvider } from 'next-auth/react'
import { Hero } from "./Home";
import { AppProps } from 'next/app';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { DefaultSeo } from 'next-seo'

export default function Home({pageProps: {session, ...PageProps},}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
    <SessionProvider session={session}>
    <DefaultSeo
          openGraph={{
            type: 'website',
            locale: 'pt_BR',
            url: 'https://www.ignite-call.rocketseat.com.br',
            siteName: 'Ignite Call',
          }}
        />
    <main>
        <Hero />
    </main>
    </SessionProvider>
    </QueryClientProvider>
  );
}
