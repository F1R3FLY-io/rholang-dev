// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  // Mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      this.classList.toggle('active');
    });
  }
  
  // Dropdown functionality
  const dropdownItems = document.querySelectorAll('.nav-item');
  
  dropdownItems.forEach(function(item) {
    const dropdown = item.querySelector('.dropdown-menu');
    const link = item.querySelector('.nav-link');
    let timeoutId;
    
    if (dropdown) {
      // Desktop hover behavior
      item.addEventListener('mouseenter', function() {
        if (window.innerWidth > 768) {
          clearTimeout(timeoutId);
          dropdown.style.display = 'block';
        }
      });
      
      item.addEventListener('mouseleave', function(e) {
        if (window.innerWidth > 768) {
          // Add a small delay before hiding to allow cursor movement
          timeoutId = setTimeout(function() {
            dropdown.style.display = 'none';
          }, 100);
        }
      });
      
      // Keep dropdown visible when hovering over it
      dropdown.addEventListener('mouseenter', function() {
        clearTimeout(timeoutId);
      });
      
      dropdown.addEventListener('mouseleave', function() {
        if (window.innerWidth > 768) {
          dropdown.style.display = 'none';
        }
      });
    }
    
    // Mobile click behavior
    if (link) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          item.classList.toggle('show');
        }
      });
    }
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-item.has-dropdown')) {
      dropdownItems.forEach(function(item) {
        item.classList.remove('show');
      });
    }
  });
  
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        if (navToggle) {
          navToggle.classList.remove('active');
        }
      }
    }, 250);
  });
});