document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  const views = document.querySelectorAll('.view-container');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetViewId = item.getAttribute('data-view');
      if (!targetViewId) return;

      // Update active nav item
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // Update active view
      views.forEach(view => {
        if (view.id === `view-${targetViewId}`) {
          view.classList.add('active');
        } else {
          view.classList.remove('active');
        }
      });
    });
  });
  
  // Initialize slider interactions (just for visuals)
  const rangeInputs = document.querySelectorAll('input[type="range"]');
  rangeInputs.forEach(input => {
    input.addEventListener('input', (e) => {
       // Could update labels here if needed
    });
  });
  
  // Scenario type selection
  const scenarioOptions = document.querySelectorAll('.scenario-type-option');
  scenarioOptions.forEach(option => {
     option.addEventListener('click', () => {
        scenarioOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        const radio = option.querySelector('input[type="radio"]');
        if (radio) {
           radio.checked = true;
        }
     });
  });
});
