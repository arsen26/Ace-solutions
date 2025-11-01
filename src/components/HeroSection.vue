<template>
  <div class="hero-section">
    <div class="hero-background">
      <div class="animated-gradient"></div>
      <div class="grid-overlay"></div>
    </div>
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h1 class="hero-title">All-in-One Digital Tools</h1>
      <p class="hero-subtitle">
        Transform, convert, and optimize your digital content with our suite of powerful tools
      </p>
      <div class="button-group">
        <v-btn size="large" class="hero-button primary">
          Get Started
          <span class="button-arrow">→</span>
        </v-btn>
        <v-btn size="large" class="hero-button secondary" variant="outlined"> Learn More </v-btn>
      </div>
      <div class="features-preview">
        <div class="feature-pill">
          <span class="pill-icon">⚡</span>
          Fast Processing
        </div>
        <div class="feature-pill">
          <span class="pill-icon">🔒</span>
          Secure & Private
        </div>
        <div class="feature-pill">
          <span class="pill-icon">🎯</span>
          Easy to Use
        </div>
      </div>
    </div>
    <div class="scroll-indicator">
      <div class="scroll-arrow"></div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.hero-section {
  position: relative;
  min-height: 90vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding-top: 80px;
  margin: 0;
  background-image:
    linear-gradient(to bottom, rgba(0, 13, 43, 0.95), rgba(0, 8, 24, 0.95)),
    url('@/assets/HeroSectionImage.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.hero-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.animated-gradient {
  position: absolute;
  inset: -50%;
  background: radial-gradient(circle at 50% 50%, rgba(33, 150, 243, 0.15) 0%, transparent 50%);
  animation: rotateGradient 20s linear infinite;
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(33, 150, 243, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(33, 150, 243, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.5;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(29, 29, 29, 0.3) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 24px 80px;
  text-align: center;
  animation: fadeUp 1s ease-out;
}

.hero-title {
  font-size: clamp(2.5rem, 7vw, 5.5rem);
  font-weight: 800;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #667eea 0%, #2196f3 50%, #64b5f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.3;
  letter-spacing: -0.02em;
  animation: fadeIn 1s ease-out 0.4s both;
}

.hero-subtitle {
  font-size: clamp(1.125rem, 2vw, 1.375rem);
  color: #b0bec5;
  margin-bottom: 48px;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
  font-weight: 400;
  animation: fadeIn 1s ease-out 0.6s both;
}

.button-group {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 48px;
  animation: fadeIn 1s ease-out 0.8s both;
}

.hero-button {
  font-weight: 600;
  padding: 12px 32px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: none;
  letter-spacing: 0.3px;
}

.hero-button.primary {
  background: linear-gradient(135deg, #667eea 0%, #2196f3 100%);
  color: #ffffff;
  box-shadow: 0 4px 20px rgba(33, 150, 243, 0.3);
}

.hero-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(33, 150, 243, 0.4);
}

.hero-button.primary .button-arrow {
  display: inline-block;
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.hero-button.primary:hover .button-arrow {
  transform: translateX(4px);
}

.hero-button.secondary {
  border: 2px solid rgba(33, 150, 243, 0.5);
  color: #64b5f6;
  background: rgba(33, 150, 243, 0.05);
  backdrop-filter: blur(10px);
}

.hero-button.secondary:hover {
  background: rgba(33, 150, 243, 0.15);
  border-color: rgba(33, 150, 243, 0.8);
  transform: translateY(-2px);
}

.features-preview {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeIn 1s ease-out 1s both;
}

.feature-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  color: #e0e0e0;
  font-size: 0.875rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.feature-pill:hover {
  background: rgba(33, 150, 243, 0.1);
  border-color: rgba(33, 150, 243, 0.3);
  transform: translateY(-2px);
}

.pill-icon {
  font-size: 1.125rem;
}

.scroll-indicator {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  animation: fadeIn 1s ease-out 1.5s both;
}

.scroll-arrow {
  width: 24px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  position: relative;
}

.scroll-arrow::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 2px;
  animation: scrollDown 2s ease-in-out infinite;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes sparkle {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(180deg);
  }
}

@keyframes rotateGradient {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes scrollDown {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(0);
  }
  40% {
    opacity: 1;
  }
  80% {
    opacity: 0;
    transform: translateX(-50%) translateY(16px);
  }
  100% {
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding-top: 60px;
    min-height: 80vh;
    background-attachment: scroll;
  }

  .hero-content {
    padding: 80px 20px 60px;
  }

  .badge {
    font-size: 0.8125rem;
    padding: 6px 16px;
  }

  .button-group {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 0 20px;
  }

  .hero-button {
    width: 100%;
  }

  .features-preview {
    gap: 12px;
  }

  .feature-pill {
    font-size: 0.8125rem;
    padding: 10px 16px;
  }

  .scroll-indicator {
    bottom: 24px;
  }
}

@media (max-width: 480px) {
  .hero-subtitle {
    font-size: 1rem;
  }

  .features-preview {
    flex-direction: column;
    align-items: stretch;
    padding: 0 20px;
  }
}
</style>
