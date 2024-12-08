import React from "react";
import Particles from "react-tsparticles";
import { tsParticles } from "tsparticles";

// Memo hóa component Particle để tránh re-render không cần thiết
const Particle = React.memo(() => {
  const particlesInit = async (main) => {
    // Initialize the tsParticles instance
    tsParticles.init();
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="z-10"
      options={{
        background: {
          color: {
            value: "#f0f0f0", 
          },
        },
        fpsLimit: 40,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: "#061025",
          },
          links: {
            color: "#0d47a1",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 1, 
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 5 },
          },
        },
        detectRetina: true,
      }}
    />
  );
});

export default Particle;
 