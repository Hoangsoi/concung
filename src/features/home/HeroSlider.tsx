"use client";
import { useEffect, useRef, useState } from "react";
import banners from "@/data/hero-banners.json";
import styles from "./HeroSlider.module.css";

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStart = useRef<number | null>(null);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => setCurrentIndex(index => (index + 1) % banners.length), 5000);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, currentIndex]);
  const move = (direction: number) => setCurrentIndex(index => (index + direction + banners.length) % banners.length);
  return <section className={styles.hero} aria-label="Chương trình khuyến mãi" aria-roledescription="carousel"
    onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
    onFocus={() => setPaused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
    onKeyDown={event => { if (event.key === "ArrowRight") { event.preventDefault(); move(1); } else if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); } }}
    onTouchStart={event => { touchStart.current = event.touches[0].clientX; }}
    onTouchEnd={event => { if (touchStart.current !== null) { const distance = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(distance) > 40) move(distance < 0 ? 1 : -1); touchStart.current = null; } }}>
    {banners.map((banner, index) => <a key={banner.id} href={banner.href} className={`${styles.slide} ${index === currentIndex ? styles.active : ""}`} aria-hidden={index !== currentIndex} tabIndex={index === currentIndex ? 0 : -1}>
      <img src={banner.image} alt={banner.title} width={980} height={320} loading={index === 0 ? "eager" : "lazy"} draggable={false} />
    </a>)}
    <div className={styles.dots} aria-label="Chọn banner">
      {banners.map((banner, index) => <button key={banner.id} type="button" aria-label={`Banner ${index + 1}: ${banner.title}`} aria-current={index === currentIndex ? "true" : undefined} className={index === currentIndex ? styles.selected : ""} onClick={() => setCurrentIndex(index)} />)}
    </div>
  </section>;
}
