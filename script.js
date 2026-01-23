// NavBar JavaScript Code
let hamburgur = document.querySelector(".hamburgur");
let header = document.querySelector("header");
let bars = document.querySelector("#bars");
let cross = document.querySelector("#cross");

hamburgur.addEventListener("click", function () {
  header.classList.toggle("active");

  if (header.classList.contains("active")) {
    bars.style.display = "none";
    cross.style.display = "block";
  } else {
    bars.style.display = "block";
    cross.style.display = "none";
  }
});

// Skills JavaScript Code
let skillsUrl = "./skillsData.json";
let allSkills = [];
let currentFilter = "all";

fetch(skillsUrl)
  .then((res) => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  })
  .then((data) => {
    if (data && data.skills) {
      allSkills = data.skills;
      renderSkills(allSkills);
      animateSkillBars();
    }
  })
  .catch((error) => {
    console.error("There was a problem loading skills:", error);
    const container = document.getElementById("skillsContainer");
    if (container) {
      container.innerHTML = '<p style="text-align: center; color: var(--text-normal);">Unable to load skills. Please refresh the page.</p>';
    }
  });


function renderSkills(skills) {
  const container = document.getElementById("skillsContainer");
  if (!container) return;

  container.innerHTML = skills.map((skill, index) => `
    <div class="skill-item" data-category="${skill.category}" data-name="${skill.name.toLowerCase()}" data-aos="zoom-in" data-aos-duration="1500" data-aos-delay="${index * 50}">
      <div class="skill-icon-name">
        <img src="${skill.icon}" alt="${skill.name}" height="24px">
        <span>${skill.name}</span>
      </div>
      <div class="skill-progress">
        <div class="skill-progress-bar" data-proficiency="${skill.proficiency}"></div>
      </div>
      <div class="skill-tooltip">
        Experience: ${skill.experience}<br>
        Proficiency: ${skill.proficiency}%
      </div>
    </div>
  `).join("");

  // Re-initialize AOS for new elements
  if (typeof AOS !== "undefined") {
    AOS.refresh();
  }
  
  // Initialize filter buttons if not already done
  initializeSkillFilters();
  initializeSkillSearch();
  
  // Apply current filter after rendering
  filterSkills();
}
function animateSkillBars() {
  const progressBars = document.querySelectorAll(".skill-progress-bar");
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const proficiency = bar.getAttribute("data-proficiency");
        setTimeout(() => {
          bar.style.width = proficiency + "%";
        }, 100);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  progressBars.forEach(bar => observer.observe(bar));
}

// Skill Filtering - Initialize after DOM is ready
let filtersInitialized = false;
function initializeSkillFilters() {
  if (filtersInitialized) return; // Prevent duplicate initialization
  
  const filterButtons = document.querySelectorAll(".filter-btn");
  if (filterButtons.length === 0) {
    console.warn("Filter buttons not found");
    return;
  }
  
  filterButtons.forEach(btn => {
    btn.addEventListener("click", function() {
      filterButtons.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      currentFilter = this.getAttribute("data-filter");
      filterSkills();
    });
  });
  
  filtersInitialized = true;
}

// Skill Search
function initializeSkillSearch() {
  const skillSearch = document.getElementById("skillSearch");
  if (skillSearch) {
    skillSearch.addEventListener("input", function() {
      filterSkills();
    });
  }
}

function filterSkills() {
  const skillSearch = document.getElementById("skillSearch");
  const searchTerm = skillSearch ? skillSearch.value.toLowerCase() : "";
  const skillItems = document.querySelectorAll(".skill-item");

  if (skillItems.length === 0) {
    return; // Skills not loaded yet
  }

  skillItems.forEach(item => {
    const category = item.getAttribute("data-category");
    const name = item.getAttribute("data-name");
    
    const matchesFilter = currentFilter === "all" || category === currentFilter;
    const matchesSearch = name.includes(searchTerm) || 
                         item.textContent.toLowerCase().includes(searchTerm);
    
    if (matchesFilter && matchesSearch) {
      item.classList.remove("hidden");
    } else {
      item.classList.add("hidden");
    }
  });
}

// Initialize filters when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initializeSkillFilters();
    initializeSkillSearch();
  });
} else {
  // DOM is already ready
  initializeSkillFilters();
  initializeSkillSearch();
}

// Project JavaScript Code
let url = "./projectData.json";
fetch(url)
  .then((res) => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  })
  .then((data) => {
    if (data && data.projects) {
      printdata(data);
    }
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
    const projectBody = document.querySelector(".project-body");
    if (projectBody) {
      projectBody.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--text-normal);">Unable to load projects. Please refresh the page.</p>';
    }
  });

  let allProjects = [];
  let currentProjectFilter = "all";

  function printdata(data) {
    allProjects = data.projects;
    
    function generateProjectData() {
      var projectData = "";
      
      allProjects.forEach(function (elem, ind) {
        const technologies = elem.technologies || [];
        const techBadges = technologies.slice(0, 3).map(tech => 
          `<span class="tech-badge">${tech}</span>`
        ).join("");
        const description = elem.description || "";
  
        // Normalize category - ensure lowercase (handles arrays for backward compatibility)
        let normalizedCategory = 'mobile';
        if (Array.isArray(elem.category)) {
          normalizedCategory = elem.category.map(c => c.toLowerCase()).join(', ');
        } else if (elem.category) {
          normalizedCategory = elem.category.toLowerCase();
        }
        
        const projectContent = `
        <a href="${elem.code || elem.link}" target="_blank" rel="noopener noreferrer" class="project-div" data-category="${normalizedCategory}" data-name="${elem.name.toLowerCase()}" data-aos="fade-up" data-aos-duration="1100" data-aos-easing="ease-in-sine" data-project-index="${ind}">
          <div class="project-img">
            <img class="project-image" src="./img/projectIMG/${elem.img}" alt="${elem.name}" loading="lazy" />
            <div class="project-tech-badges">${techBadges}</div>
          </div>
          <div class="project-text">
            <div>
              <h1>${elem.name}</h1>
              <div class="project-description">${description}</div>
            </div>
            <div class="project-footer">
              <span style="font-size: 0.85rem; color: var(--text-normal);">View on GitHub</span>
              <i class="fa-brands fa-github"></i>
            </div>
          </div>
        </a>
      `;

      projectData += projectContent;
    });
  
      // Clear any old content first
      const projectBody = document.querySelector(".project-body");
      if (projectBody) {
        projectBody.innerHTML = ""; // Clear first
        projectBody.innerHTML = projectData; // Then add new content
      }
      
      // Initialize filter buttons if not already done
      initializeProjectFilters();
      initializeProjectSearch();
      
      // Small delay to ensure DOM is updated, then apply filter
      setTimeout(() => {
        filterProjects();
      }, 100);
      
      // Re-initialize AOS
      if (typeof AOS !== "undefined") {
        AOS.refresh();
      }
    }
 
    generateProjectData();
  }

  // Project Filtering - Initialize after DOM is ready
  let projectFiltersInitialized = false;
  function initializeProjectFilters() {
    if (projectFiltersInitialized) return; // Prevent duplicate initialization
    
    const projectFilterButtons = document.querySelectorAll(".project-filter-btn");
    if (projectFilterButtons.length === 0) {
      console.warn("Project filter buttons not found");
      return;
    }
    
    projectFilterButtons.forEach(btn => {
      btn.addEventListener("click", function() {
        projectFilterButtons.forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        currentProjectFilter = this.getAttribute("data-filter");
        filterProjects();
      });
    });
    
    projectFiltersInitialized = true;
  }

  // Project Search
  function initializeProjectSearch() {
    const projectSearch = document.getElementById("projectSearch");
    if (projectSearch) {
      projectSearch.addEventListener("input", function() {
        filterProjects();
      });
    }
  }

  function filterProjects() {
    const projectSearch = document.getElementById("projectSearch");
    const searchTerm = projectSearch ? projectSearch.value.toLowerCase() : "";
    const projectDivs = document.querySelectorAll(".project-div, a.project-div");

    if (projectDivs.length === 0) {
      return; // Projects not loaded yet
    }

    const normalizedFilter = currentProjectFilter.toLowerCase().trim();
    
    projectDivs.forEach(div => {
      const category = div.getAttribute("data-category");
      const name = div.getAttribute("data-name");
      
      // Normalize category for comparison
      const normalizedCategory = category ? category.toLowerCase().trim() : "";
      
      // Check if category matches filter
      let categoryMatches = false;
      
      if (currentProjectFilter === "all") {
        categoryMatches = true;
      } else {
        // Remove all spaces for comparison to handle "full stack" vs "fullstack"
        const categoryNoSpaces = normalizedCategory.replace(/\s+/g, '');
        const filterNoSpaces = normalizedFilter.replace(/\s+/g, '');
        
        // Exact match (with or without spaces)
        if (normalizedCategory === normalizedFilter || categoryNoSpaces === filterNoSpaces) {
          categoryMatches = true;
        } 
        // Handle comma-separated categories (check if filter is in the list)
        else if (normalizedCategory.includes(',')) {
          const categories = normalizedCategory.split(',').map(c => {
            const trimmed = c.trim().toLowerCase();
            return trimmed.replace(/\s+/g, '');
          });
          categoryMatches = categories.includes(filterNoSpaces);
        }
      }
      
      const matchesSearch = searchTerm === "" || 
                           name.includes(searchTerm) || 
                           div.textContent.toLowerCase().includes(searchTerm);
      
      if (categoryMatches && matchesSearch) {
        div.classList.remove("hidden");
      } else {
        div.classList.add("hidden");
      }
    });
  }

  // Initialize project filters when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initializeProjectFilters();
      initializeProjectSearch();
    });
  } else {
    // DOM is already ready
    initializeProjectFilters();
    initializeProjectSearch();
  }

  // Project Modal
  function openProjectModal(index) {
    if (index < 0 || index >= allProjects.length) {
      console.error("Invalid project index:", index);
      return;
    }
    
    const project = allProjects[index];
    if (!project) {
      console.error("Project not found at index:", index);
      return;
    }

    const modal = document.getElementById("projectModal");
    const modalBody = document.getElementById("modalBody");
    
    if (!modal || !modalBody) {
      console.error("Modal elements not found");
      return;
    }
    
    const technologies = project.technologies || [];
    const techTags = technologies.map(tech => 
      `<span class="tech-tag">${tech}</span>`
    ).join("");

    modalBody.innerHTML = `
      <img class="modal-image" src="./img/projectIMG/${project.img}" alt="${project.name}" />
      <h2 class="modal-title">${project.name}</h2>
      <p class="modal-description">${project.fullDescription || project.description}</p>
      <div class="modal-tech">
        <div class="tech-title">Technologies Used:</div>
        <div class="tech-tags">${techTags}</div>
      </div>
      <div class="modal-links">
        <a href="${project.code}" target="_blank" class="github-link" aria-label="View code on GitHub">
          <i class="fa-brands fa-github"></i> View Code
        </a>
        ${project.demo ? `
        <a href="${project.demo}" target="_blank" class="demo-link" aria-label="View live demo">
          <i class="fa-solid fa-external-link"></i> Live Demo
        </a>
        ` : ''}
      </div>
    `;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeProjectModal() {
    const modal = document.getElementById("projectModal");
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Make functions globally available
  window.openProjectModal = openProjectModal;
  window.closeProjectModal = closeProjectModal;

  // Modal close handlers
  const modalOverlay = document.getElementById("modalOverlay");
  const modalClose = document.getElementById("modalClose");

  if (modalOverlay) {
    modalOverlay.addEventListener("click", closeProjectModal);
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeProjectModal);
  }

  // Close modal on Escape key
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      closeProjectModal();
    }
  });

  // Animated Statistics Counters
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
      start += increment;
      if (start < target) {
        element.textContent = Math.floor(start);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    }
    
    updateCounter();
  }

  function initStatistics() {
    const statNumbers = document.querySelectorAll(".stat-number");
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains("counted")) {
          const target = parseInt(entry.target.getAttribute("data-target"));
          entry.target.classList.add("counted");
          animateCounter(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
  }

  // Initialize statistics on load
  window.addEventListener("load", initStatistics);

  // Experience Timeline
  fetch("./experienceData.json")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      if (data && data.experiences) {
        renderTimeline(data.experiences);
      }
    })
    .catch((error) => {
      console.error("There was a problem loading experience data:", error);
      const timelineContainer = document.getElementById("timelineContainer");
      if (timelineContainer) {
        timelineContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--text-normal);">Unable to load experience data. Please refresh the page.</p>';
      }
    });

  function renderTimeline(experiences) {
    const container = document.getElementById("timelineContainer");
    if (!container) return;
    if (!experiences || !Array.isArray(experiences) || experiences.length === 0) {
      container.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--text-normal);">No experience data available.</p>';
      return;
    }

    container.innerHTML = experiences.map((exp, index) => {
      // Render points as bullets if they exist, otherwise use description
      const descriptionHTML = exp.points && Array.isArray(exp.points) && exp.points.length > 0
        ? `<ul class="timeline-points">${exp.points.map(point => `<li>${point}</li>`).join("")}</ul>`
        : `<div class="timeline-description">${exp.description}</div>`;

      return `
        <div class="timeline-item" data-aos="fade-up" data-aos-duration="1100" data-aos-delay="${index * 100}">
          <div class="timeline-icon">
            <i class="fa-solid ${exp.icon}"></i>
          </div>
          <div class="timeline-content">
            <div class="timeline-title">${exp.title}</div>
            <div class="timeline-org">${exp.organization}${exp.location ? ` • ${exp.location}` : ''}</div>
            <div class="timeline-period">${exp.period}</div>
            ${descriptionHTML}
          </div>
        </div>
      `;
    }).join("");

    // Re-initialize AOS
    if (typeof AOS !== "undefined") {
      AOS.refresh();
    }
  }
  
  

// Dark-Mode JavaScript Code and Save it Theme in local Storage
let sun = document.querySelector("#sun");
let icon = document.querySelector(".icon");
let body = document.querySelector("body");
let moon = document.querySelector("#moon");

// Make icon keyboard accessible
icon.addEventListener("click", function () {
  // Add smooth transition class
  body.style.transition = "background-color 0.3s ease, color 0.3s ease";
  
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    sun.style.display = "none";
    moon.style.display = "block";
    console.log("Switch to Dark Mode theme");
  } else {
    sun.style.display = "block";
    moon.style.display = "none";
    console.log("Switch to Light Mode theme");
  }
  let isNightMode = body.classList.contains("dark-mode");
  localStorage.setItem("dark-mode", isNightMode);

  if (isNightMode) {
    console.log("dark mode preference saved to your local storage");
  } else {
    console.log("light mode preference saved to your local storage");
  }
  
  // Remove transition class after animation completes
  setTimeout(() => {
    body.style.transition = "";
  }, 300);
});

function setInitialTheme() {
  const saveMode = localStorage.getItem("dark-mode");
  
  // Check system preference if no saved preference
  if (saveMode === null) {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      body.classList.add("dark-mode");
      localStorage.setItem("dark-mode", "true");
      sun.style.display = "none";
      moon.style.display = "block";
    }
  } else if (saveMode == "true") {
    body.classList.add("dark-mode");
    sun.style.display = "none";
    moon.style.display = "block";
  }
  
  // Listen for system theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    // Only auto-switch if user hasn't manually set a preference
    if (localStorage.getItem("dark-mode") === null) {
      if (e.matches) {
        body.classList.add("dark-mode");
        sun.style.display = "none";
        moon.style.display = "block";
      } else {
        body.classList.remove("dark-mode");
        sun.style.display = "block";
        moon.style.display = "none";
      }
    }
  });
}
setInitialTheme();

// Keyboard support for theme toggle
icon.addEventListener("keydown", function(e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    icon.click();
  }
});

// Preloader JavaScript Code with Progress
let loader = document.querySelector("#preloader");
let preloaderProgress = document.getElementById("preloaderProgress");
let preloaderPercentage = document.getElementById("preloaderPercentage");

function updatePreloaderProgress() {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 90) progress = 90;
    
    if (preloaderProgress) {
      preloaderProgress.style.width = progress + "%";
    }
    if (preloaderPercentage) {
      preloaderPercentage.textContent = Math.floor(progress) + "%";
    }
    
    if (progress >= 90) {
      clearInterval(interval);
    }
  }, 200);
}

// Start progress animation
updatePreloaderProgress();

window.addEventListener("load", function () {
  // Complete progress
  if (preloaderProgress) {
    preloaderProgress.style.width = "100%";
  }
  if (preloaderPercentage) {
    preloaderPercentage.textContent = "100%";
  }
  
  // Fade out preloader after a short delay
  setTimeout(() => {
    if (loader) {
      loader.style.opacity = "0";
      loader.style.transition = "opacity 0.5s ease";
      setTimeout(() => {
        loader.style.display = "none";
      }, 500);
    }
  }, 300);
});

// Performance: Intersection Observer for AOS animations
if (typeof AOS !== "undefined") {
  // Initialize AOS with Intersection Observer
  AOS.init({
    once: true, // Animation only happens once
    offset: 100,
    duration: 1000,
    easing: 'ease-in-out',
    useClassNames: false
  });
}

// Lazy load images with Intersection Observer
const lazyImages = document.querySelectorAll("img[loading='lazy']");
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
      }
      observer.unobserve(img);
    }
  });
}, {
  rootMargin: "50px"
});

lazyImages.forEach(img => {
  if (img.dataset.src) {
    imageObserver.observe(img);
  }
});

// Scroll Progress Indicator
const scrollProgress = document.getElementById("scrollProgress");

window.addEventListener("scroll", function () {
  const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (window.scrollY / windowHeight) * 100;
  scrollProgress.style.width = scrolled + "%";
});

// Back to Top Button
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", function () {
  if (window.scrollY > 300) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// Active Navigation Highlighting
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id], div[id]");

function highlightActiveSection() {
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("data-section") === sectionId) {
          link.classList.add("active");
        }
      });
    }
  });
}

window.addEventListener("scroll", highlightActiveSection);
window.addEventListener("load", highlightActiveSection);

// Typing Animation for Hero Section
function typeWriter(element, text, speed = 100, callback) {
  let i = 0;
  element.textContent = "";
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else if (callback) {
      setTimeout(callback, 500);
    }
  }
  
  type();
}

// Initialize typing animation when page loads
window.addEventListener("load", function() {
  const typingName = document.getElementById("typingName");
  const typingCursor = document.querySelector(".typing-cursor");
  const heroSubtitle = document.querySelector(".hero-subtitle");
  
  if (typingName) {
    const name = typingName.textContent;
    typingName.textContent = "";
    
    // Start typing after a short delay
    setTimeout(() => {
      typeWriter(typingName, name, 100, function() {
        // Hide cursor after typing completes
        if (typingCursor) {
          setTimeout(() => {
            typingCursor.style.display = "none";
          }, 1000);
        }
      });
    }, 500);
  }
  
  // Fade in social icons and button
  const linksIcon = document.querySelector(".links-icon");
  const hireButton = document.querySelector(".button");
  
  if (linksIcon) {
    linksIcon.style.opacity = "0";
    linksIcon.style.transform = "translateY(20px)";
    setTimeout(() => {
      linksIcon.style.transition = "all 0.8s ease";
      linksIcon.style.opacity = "1";
      linksIcon.style.transform = "translateY(0)";
    }, 2000);
  }
  
  if (hireButton) {
    hireButton.style.opacity = "0";
    hireButton.style.transform = "translateY(20px)";
    setTimeout(() => {
      hireButton.style.transition = "all 0.8s ease";
      hireButton.style.opacity = "1";
      hireButton.style.transform = "translateY(0)";
    }, 2500);
  }
});

// Contact Form Validation and Submission
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const submitBtn = document.getElementById("submitBtn");
const btnLoader = document.getElementById("btnLoader");

// Validation functions
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateName(name) {
  return name.trim().length >= 2;
}

function validateSubject(subject) {
  return subject.trim().length >= 3;
}

function validateMessage(message) {
  return message.trim().length >= 10;
}

function showError(input, errorElement, message) {
  input.classList.add("error");
  input.classList.remove("valid");
  errorElement.textContent = message;
  errorElement.classList.add("show");
}

function showSuccess(input, errorElement) {
  input.classList.remove("error");
  input.classList.add("valid");
  errorElement.classList.remove("show");
  errorElement.textContent = "";
}

function clearFormMessage() {
  formMessage.classList.remove("success", "error");
  formMessage.style.display = "none";
}

// Real-time validation
const emailInput = document.getElementById("email");
const nameInput = document.getElementById("name");
const subjectInput = document.getElementById("subject");
const messageInput = document.getElementById("message");

const emailError = document.getElementById("emailError");
const nameError = document.getElementById("nameError");
const subjectError = document.getElementById("subjectError");
const messageError = document.getElementById("messageError");

emailInput.addEventListener("blur", function() {
  if (emailInput.value.trim() === "") {
    showError(emailInput, emailError, "Email is required");
  } else if (!validateEmail(emailInput.value)) {
    showError(emailInput, emailError, "Please enter a valid email address");
  } else {
    showSuccess(emailInput, emailError);
  }
});

emailInput.addEventListener("input", function() {
  if (emailInput.value.trim() !== "" && validateEmail(emailInput.value)) {
    showSuccess(emailInput, emailError);
  }
});

nameInput.addEventListener("blur", function() {
  if (nameInput.value.trim() === "") {
    showError(nameInput, nameError, "Name is required");
  } else if (!validateName(nameInput.value)) {
    showError(nameInput, nameError, "Name must be at least 2 characters");
  } else {
    showSuccess(nameInput, nameError);
  }
});

nameInput.addEventListener("input", function() {
  if (nameInput.value.trim() !== "" && validateName(nameInput.value)) {
    showSuccess(nameInput, nameError);
  }
});

subjectInput.addEventListener("blur", function() {
  if (subjectInput.value.trim() === "") {
    showError(subjectInput, subjectError, "Subject is required");
  } else if (!validateSubject(subjectInput.value)) {
    showError(subjectInput, subjectError, "Subject must be at least 3 characters");
  } else {
    showSuccess(subjectInput, subjectError);
  }
});

subjectInput.addEventListener("input", function() {
  if (subjectInput.value.trim() !== "" && validateSubject(subjectInput.value)) {
    showSuccess(subjectInput, subjectError);
  }
});

messageInput.addEventListener("blur", function() {
  if (messageInput.value.trim() === "") {
    showError(messageInput, messageError, "Message is required");
  } else if (!validateMessage(messageInput.value)) {
    showError(messageInput, messageError, "Message must be at least 10 characters");
  } else {
    showSuccess(messageInput, messageError);
  }
});

messageInput.addEventListener("input", function() {
  if (messageInput.value.trim() !== "" && validateMessage(messageInput.value)) {
    showSuccess(messageInput, messageError);
  }
});

// Form submission
contactForm.addEventListener("submit", async function(e) {
  e.preventDefault();
  clearFormMessage();

  // Validate all fields
  let isValid = true;

  if (!validateEmail(emailInput.value)) {
    showError(emailInput, emailError, "Please enter a valid email address");
    isValid = false;
  }

  if (!validateName(nameInput.value)) {
    showError(nameInput, nameError, "Name must be at least 2 characters");
    isValid = false;
  }

  if (!validateSubject(subjectInput.value)) {
    showError(subjectInput, subjectError, "Subject must be at least 3 characters");
    isValid = false;
  }

  if (!validateMessage(messageInput.value)) {
    showError(messageInput, messageError, "Message must be at least 10 characters");
    isValid = false;
  }

  if (!isValid) {
    formMessage.textContent = "Please fix the errors above";
    formMessage.classList.add("error");
    formMessage.style.display = "block";
    return;
  }

  // Show loading state
  submitBtn.classList.add("loading");
  submitBtn.disabled = true;

  try {
    const formData = new FormData(contactForm);
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    });

    if (response.ok) {
      formMessage.textContent = "Message sent successfully! I'll get back to you soon.";
      formMessage.classList.add("success");
      formMessage.style.display = "block";
      contactForm.reset();
      
      // Clear validation states
      [emailInput, nameInput, subjectInput, messageInput].forEach(input => {
        input.classList.remove("error", "valid");
      });
      [emailError, nameError, subjectError, messageError].forEach(error => {
        error.classList.remove("show");
        error.textContent = "";
      });
    } else {
      throw new Error("Form submission failed");
    }
  } catch (error) {
    formMessage.textContent = "Oops! Something went wrong. Please try again later.";
    formMessage.classList.add("error");
    formMessage.style.display = "block";
  } finally {
    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;
  }
});

// Quick Contact - Copy Email
const copyEmailBtn = document.getElementById("copyEmailBtn");
const emailAddress = "sharma.rishabh@northeastern.edu"; // Update with your actual email

if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", async function() {
    try {
      await navigator.clipboard.writeText(emailAddress);
      copyEmailBtn.classList.add("copied");
      
      setTimeout(() => {
        copyEmailBtn.classList.remove("copied");
      }, 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = emailAddress;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      
      copyEmailBtn.classList.add("copied");
      setTimeout(() => {
        copyEmailBtn.classList.remove("copied");
      }, 2000);
    }
  });
}

// Social Sharing Functionality
const shareButtons = document.querySelectorAll(".share-btn");
const copyFeedbackShare = document.getElementById("copyFeedbackShare");

shareButtons.forEach(btn => {
  btn.addEventListener("click", function() {
    const platform = this.getAttribute("data-platform");
    const url = window.location.href;
    const shareTitle = "Check out Rishabh Sharma's Portfolio";
    const shareText = "Amazing portfolio showcasing full-stack and mobile development skills!";

    if (platform === "copy") {
      // Copy URL to clipboard
      navigator.clipboard.writeText(url).then(() => {
        copyFeedbackShare.classList.add("show");
        setTimeout(() => {
          copyFeedbackShare.classList.remove("show");
        }, 2000);
      }).catch(() => {
        // Fallback
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        copyFeedbackShare.classList.add("show");
        setTimeout(() => {
          copyFeedbackShare.classList.remove("show");
        }, 2000);
      });
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`, "_blank");
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
    }
  });
});

// Web Share API (if available)
if (navigator.share) {
  const shareBtn = document.createElement("button");
  shareBtn.className = "share-btn";
  shareBtn.setAttribute("data-platform", "native");
  shareBtn.setAttribute("aria-label", "Share portfolio");
  shareBtn.innerHTML = '<i class="fa-solid fa-share-nodes"></i>';
  
  shareBtn.addEventListener("click", async function() {
    try {
      const shareTitle = "Check out Rishabh Sharma's Portfolio";
      const shareText = "Amazing portfolio showcasing full-stack and mobile development skills!";
      const shareUrl = window.location.href;
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl
      });
    } catch (err) {
      console.log("Error sharing:", err);
    }
  });
  
  const shareButtonsContainer = document.querySelector(".share-buttons");
  if (shareButtonsContainer) {
    shareButtonsContainer.appendChild(shareBtn);
  }
}