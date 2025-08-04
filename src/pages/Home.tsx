import React from 'react';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import TaglineBanner from '../components/TaglineBanner';
import FeatureBlocks from '../components/FeatureBlocks';
import CodeExample from '../components/CodeExample';

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <TaglineBanner />
      <FeatureBlocks />
      <CodeExample />
    </>
  );
}