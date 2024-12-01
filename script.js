// Add interactive JS features if needed in the future.
console.log("Portfolio loaded successfully!");

// Initialize EmailJS
emailjs.init("h9ZA1tIrtzGXLl1lK"); // Replace with your EmailJS Public Key

// Back to Top Button Functionality
document.addEventListener("DOMContentLoaded", () => {
    const backToTopButton = document.getElementById("back-to-top");

    if (backToTopButton) {
        // Show or hide the button based on scroll position
        window.addEventListener("scroll", () => {
            backToTopButton.style.display = window.scrollY > 300 ? "block" : "none";
        });

        // Scroll to top when the button is clicked
        backToTopButton.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        });
    } else {
        console.error("Back to Top button not found in the DOM!");
    }
});

// Initialize AOS (Animation on Scroll)
document.addEventListener("DOMContentLoaded", () => {
    AOS.init({
        duration: 1000, // Animation duration in milliseconds
        once: true, // Whether animation should happen only once
    });
});

// Smooth Navigation Scrolling
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").slice(1);
        const targetSection = document.getElementById(targetId);
        targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    });
});

// Fetch and Display Blogs with Latest Posts
document.addEventListener("DOMContentLoaded", () => {
    const blogsContainer = document.querySelector(".blogs-container");

    fetch("blogs.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(blog => {
                const blogCard = document.createElement("div");
                blogCard.classList.add("blog-card");

                // Basic blog details
                blogCard.innerHTML = `
                    <img src="${blog.image}" alt="${blog.title} Logo" class="blog-logo">
                    <h3>${blog.title}</h3>
                    <p>${blog.description}</p>
                    <div class="latest-posts">
                        <h4>Latest Posts</h4>
                        <ol id="${blog.title.toLowerCase()}-posts"></ol>
                    </div>
                    <a href="${blog.link}" target="_blank" class="btn">Visit ${blog.title}</a>
                `;

                blogsContainer.appendChild(blogCard);

                // Fetch latest posts for each blog
                fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(blog.rss)}`)
                    .then(response => response.json())
                    .then(feed => {
                        const postsContainer = document.getElementById(`${blog.title.toLowerCase()}-posts`);
                        feed.items.slice(0, 3).forEach(post => {
                            const postItem = document.createElement("li");
                            postItem.innerHTML = `<a href="${post.link}" target="_blank">${post.title}</a>`;
                            postsContainer.appendChild(postItem);
                        });
                    })
                    .catch(error => console.error(`Error fetching posts for ${blog.title}:`, error));
            });
        })
        .catch(error => console.error("Error fetching blogs:", error));
});


// Dark Mode Toggle Button
const darkModeToggle = document.getElementById("dark-mode-toggle");

if (localStorage.getItem("darkMode") === "enabled") {
    enableDarkMode();
}

// Toggle dark mode on button click
darkModeToggle.addEventListener("click", () => {
    document.body.classList.contains("dark-mode") ? disableDarkMode() : enableDarkMode();
});

function enableDarkMode() {
    document.body.classList.add("dark-mode");
    document.querySelectorAll("header, footer, .hero, .about-section, .blogs-section, .blog-card, .skills-section, .contact-section, .contact-section p, .contact-icon, .toast")
        .forEach(element => element.classList.add("dark-mode"));
    darkModeToggle.textContent = "☀️";
    localStorage.setItem("darkMode", "enabled");
}

function disableDarkMode() {
    document.body.classList.remove("dark-mode");
    document.querySelectorAll("header, footer, .hero, .about-section, .blogs-section, .blog-card, .skills-section, .contact-section, .contact-icon, .toast")
        .forEach(element => element.classList.remove("dark-mode"));
    darkModeToggle.textContent = "🌙";
    localStorage.setItem("darkMode", "disabled");
}

// Toast Notification
const showToast = (message) => {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000); // Hide toast after 3 seconds
};

// Handle Form Submission with EmailJS
document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();

    emailjs.sendForm("service_swubjt9", "template_ny7q2a4", this)
        .then(() => {
            showToast("Message Sent Successfully!");
            this.reset();
        })
        .catch(() => {
            showToast("Failed to Send Message. Please Try Again.");
        });
});

// interactive canvas in hero
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("interactive-bg");
    const ctx = canvas.getContext("2d");
    const particles = [];
    const numParticles = 100;
    const maxDistance = 100;

    // Resize Canvas to Fit Screen
    const resizeCanvas = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Particle Constructor
    class Particle {
        constructor(x, y) {
            this.x = x || Math.random() * canvas.width;
            this.y = y || Math.random() * canvas.height;
            this.vx = Math.random() * 2 - 1;
            this.vy = Math.random() * 2 - 1;
        }
        move() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = getParticleColor(); // Dynamic particle color
            ctx.fill();
        }
    }

    // Create Particles
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }

    // Draw Lines Between Close Particles
    const drawLines = () => {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = Math.hypot(
                    particles[i].x - particles[j].x,
                    particles[i].y - particles[j].y
                );
                if (dist < maxDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = getLineColor(dist); // Dynamic line color
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    };

    // Get Colors Based on Dark Mode
    const getParticleColor = () => {
        return document.body.classList.contains("dark-mode") ? "#ffffff" : "#007bff";
    };

    const getLineColor = (dist) => {
        const baseColor = document.body.classList.contains("dark-mode") ? "255, 255, 255" : "0, 123, 255";
        return `rgba(${baseColor}, ${1 - dist / maxDistance})`;
    };

    // Animate Particles
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p) => {
            p.move();
            p.draw();
        });

        drawLines();
        requestAnimationFrame(animate);
    };
    animate();

    // Listen for Dark Mode Changes
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    darkModeToggle.addEventListener("click", () => {
        setTimeout(() => {
            // Force canvas redraw on theme change
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 300); // Adjust delay to match transition time
    });
});

// Game
document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.getElementById("game-container");
    const scoreboard = document.getElementById("scoreboard");
    const startGameBtn = document.getElementById("start-game-btn");

    let score = 0;
    let gameInterval;
    let gameTimeout;

    const createStar = () => {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.top = `${Math.random() * (gameContainer.offsetHeight - 20)}px`;
        star.style.left = `${Math.random() * (gameContainer.offsetWidth - 20)}px`;

        // Remove star after 3 seconds
        setTimeout(() => {
            if (star.parentElement) {
                star.parentElement.removeChild(star);
            }
        }, 3000);

        // Increment score on click
        star.addEventListener("click", () => {
            score += 1;
            scoreboard.textContent = `Score: ${score}`;
            gameContainer.removeChild(star);
        });

        gameContainer.appendChild(star);
    };

    const startGame = () => {
        score = 0;
        scoreboard.textContent = "Score: 0";
        gameContainer.innerHTML = ""; // Clear the game area

        // Create stars every 500ms
        gameInterval = setInterval(createStar, 500);

        // Stop the game after 30 seconds
        gameTimeout = setTimeout(() => {
            clearInterval(gameInterval);
            alert(`Time's up! Your final score is ${score}.`);
        }, 30000);
    };

    startGameBtn.addEventListener("click", startGame);
});


//Header
document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");

    const handleHeaderBackground = () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };

    // Check on page load and during scroll
    handleHeaderBackground();
    window.addEventListener("scroll", handleHeaderBackground);
});


//Hamburger
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
});

//Adjust hero Height Dynamically
document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");
    const hero = document.querySelector(".hero");

    // Adjust hero section padding dynamically
    const adjustHeroPadding = () => {
        const headerHeight = header.offsetHeight;
        hero.style.paddingTop = `${headerHeight}px`;
    };

    // Run adjustments on page load and resize
    adjustHeroPadding();
    window.addEventListener("resize", adjustHeroPadding);
});


