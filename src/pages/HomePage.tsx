import React from 'react';
import { Section01Arrival } from '../components/sections/Section01Arrival';
import { Section02Reveal } from '../components/sections/Section02Reveal';
import { Section03Collections } from '../components/sections/Section03Collections';
import { ObjectsOfAffection } from '../components/sections/ObjectsOfAffection';
import { Section05Gifting } from '../components/sections/Section05Gifting';
import { ThePersonBehindCelestia } from '../components/sections/ThePersonBehindCelestia';
import { Section07Instagram } from '../components/sections/Section07Instagram';
import { Section08FinalMoment } from '../components/sections/Section08FinalMoment';

export const HomePage: React.FC = () => {
  return (
    <div className="w-full flex-1 relative">
      {/* 01: Cinematic Product-Led Immersive Opening */}
      <Section01Arrival />

      {/* 02: Fine Jewellery & Sculptural Reveal */}
      <Section02Reveal />

      {/* 03: The Five Realms Collection Index */}
      <Section03Collections />

      {/* 04: The Artisanal Edit — Objects of Affection (Craftsmanship & Bangles) */}
      <ObjectsOfAffection />

      {/* 05: The Gifting Atelier & Hamper Workshop */}
      <Section05Gifting />

      {/* 06: From The Atelier — Founder Story & Mumbai Origins */}
      <ThePersonBehindCelestia />

      {/* 07: Community Lookbook & Instagram Highlights */}
      <Section07Instagram />

      {/* 08: Final Brand Moment & Manifesto */}
      <Section08FinalMoment />
    </div>
  );
};

export default HomePage;
