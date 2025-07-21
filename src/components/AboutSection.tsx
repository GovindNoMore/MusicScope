// AboutSection.tsx
import React from "react";

const AboutSection: React.FC = () => (
  <section className="max-w-2xl mx-auto my-16 p-8 bg-white/10 rounded-3xl border border-white/20 text-white text-lg shadow-lg">
    <h2 className="text-3xl font-bold mb-4">About MusicScope</h2>
    <p className="mb-4">
      Hi, I’m Govind—a 16-year-old musician and music lover.
    </p>
    <p className="mb-4">
      I built MusicScope because music has always been a huge part of my life, and I wanted to create something that helps people discover more about their own musical tastes. As someone who spends hours exploring new sounds and artists, I know how powerful music can be in shaping our moods, memories, and even friendships.
    </p>
    <p className="mb-4">
      This project is my way of sharing that passion with you. Every feature here comes from my own curiosity and love for music. If you enjoy using MusicScope or have any feedback, I’d love to hear from you!
    </p>
    <p>
      Drop me a message or review at <a href="mailto:govindop69@gmail.com" className="underline text-pink-300">govindop69@gmail.com</a>—it would mean a lot.<br />
      Thanks for being here and letting me be a small part of your musical journey.
    </p>
  </section>
);

export default AboutSection;