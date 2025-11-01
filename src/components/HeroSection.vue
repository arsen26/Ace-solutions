<template>
  <div class="hero-section">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h1 class="hero-title">All-in-One Digital Tools</h1>
      <p class="hero-subtitle">
        Transform, convert, and optimize your digital content with our suite of powerful tools
      </p>
      <v-btn size="large" class="hero-button"> Get Started </v-btn>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.hero-section {
  position: relative;
  min-height: 70vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding-top: 80px;
  margin: 0;
  background-image:
    linear-gradient(to bottom, rgba(0, 13, 43, 0.9), rgba(0, 8, 24, 0.9)),
    url('@/assets/HeroSectionImage.jpg');
  background-size: cover;
  background-position: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent, rgba(29, 29, 29, 0.5), rgb(0, 0, 0));
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 16px;
  text-align: center;
  animation: fadeUp 1s ease-out;
}

.hero-title {
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: bold;
  margin-bottom: 24px;
  background: linear-gradient(135deg, rgb(67, 87, 177) 0%, #2196f3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  color: #d3d3d3;
  margin-bottom: 32px;
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.hero-button {
  color: #ffffff;
  font-weight: 600;
  background-color: #2196f3;
  padding: 10px 24px;
  border-radius: 12px;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glowPulse {
  0%,
  100% {
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  }
  50% {
    box-shadow: 0 4px 30px rgba(102, 126, 234, 0.6);
  }
}

/* Responsive styles */
@media (max-width: 768px) {
  .hero-section {
    padding-top: 60px;
    min-height: 60vh;
  }

  .hero-content {
    padding: 60px 16px;
  }
}
</style>
