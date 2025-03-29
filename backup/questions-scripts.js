document.addEventListener('DOMContentLoaded', function() {
  const markschemeToggles = document.querySelectorAll('.js-toggle-markscheme');
  const examinerReportToggles = document.querySelectorAll('.js-toggle-examiners_report');

  // Function to hide all bodies initially
  function hideAllBodies() {
    markschemeToggles.forEach(toggle => {
      const markschemeBody = toggle.querySelector('.card-body');
      if (markschemeBody) {
        markschemeBody.style.display = 'none';
      }
    });

    examinerReportToggles.forEach(toggle => {
      const examinerReportBody = toggle.querySelector('.card-body');
      if (examinerReportBody) {
        examinerReportBody.style.display = 'none';
      }
    });
  }

  // Call the function to hide all bodies on load
  hideAllBodies();

  // Add click event to markscheme toggles
  markschemeToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const markschemeBody = this.querySelector('.card-body');
      if (markschemeBody) {
        markschemeBody.style.display = markschemeBody.style.display === 'none' ? 'block' : 'none';
      }
    });
  });

  // Add click event to examiner report toggles
  examinerReportToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const examinerReportBody = this.querySelector('.card-body');
      if (examinerReportBody) {
        examinerReportBody.style.display = examinerReportBody.style.display === 'none' ? 'block' : 'none';
      }
    });
  });
});
