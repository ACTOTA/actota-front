import React from 'react';
import ClientOnly from "@/src/components/ClientOnly";
import Hero from "@/src/components/Hero";

import Head from 'next/head';
import { Providers } from '@/src/app/providers';
import Landing from "@/src/components/Landing";

export default async function Home() {


  return (
    <>
      <Head>
        <title>ACTOTA</title>
        <meta name="ACTOTA" content="Personalized Tours Made Easy" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&display=swap" rel="stylesheet" />
      </Head>
      <Hero />

      <ClientOnly>
        <Providers>
          <Landing />
        </Providers>
      </ClientOnly>
    </>
  );
}

