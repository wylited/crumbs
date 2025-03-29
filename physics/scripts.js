async function loadQuestions() {
  try {
    const response = await fetch('physics/qindex.json');
    if (!response.ok) {
      throw new Error('Failed to load questions');
    }
    console.log("okay!")
    return await response.json();
  } catch (error) {
    console.error('Error loading questions:', error);
    return [];
  }
}

async function init() {
  // Show loading indicator
  document.getElementById('questionContainer').innerHTML = `
        <div class="loading-indicator">
          <svg class="animate-spin h-8 w-8 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading questions...
        </div>
      `;

  const questions = await loadQuestions();

  function filterQuestions() {
    const marks = document.getElementById('marksFilter').value;
    const level = document.getElementById('levelFilter').value;
    const paper = document.getElementById('paperFilter').value;
    const command = document.getElementById('commandFilter').value.toLowerCase();
    const content = document.getElementById('contentSearch').value.toLowerCase();
    const mainTopics = [...document.getElementById('mainTopic').selectedOptions]
          .map(o => o.value)
          .filter(v => v !== 'all');

    const subTopics = [...document.getElementById('subTopic').selectedOptions]
          .map(o => o.value)
          .filter(v => v !== 'all');

    return questions.filter(q => {
      return (!marks || q.marks === marks) &&
        (!level || q.level === level) &&
        (!paper || q.paper === paper) &&
        (!command || q.command_term.toLowerCase().includes(command)) &&
        (!content || q.content.toLowerCase().includes(content)) &&
        (mainTopics.length === 0 || mainTopics.some(t => q.topics.join(' ').includes(t))) &&
        (subTopics.length === 0 || subTopics.some(st => q.topics.join(' ').includes(st)));
    });
  }

  function updateDisplay() {
    const filtered = filterQuestions();
    const container = document.getElementById('questionContainer');

    // Update result count
    document.getElementById('resultCount').textContent = filtered.length;

    if (filtered.length === 0) {
      container.innerHTML = `
            <div class="no-results">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No questions match your filters</p>
              <button id="resetFilters" class="btn btn-primary mt-4">Reset Filters</button>
            </div>
          `;

      document.getElementById('resetFilters').addEventListener('click', resetFilters);
      return;
    }

    container.innerHTML = filtered.map(q => `
          <div class="question-card" data-id="${q.id}">
            <div class="question-header">
              <div class="question-title">${q.reference_code}</div>
              <div class="question-marks badge badge-primary">${q.marks} marks</div>
            </div>
            <div class="question-content">
                ${q.content}
            </div>
            <div class="flex flex-wrap gap-2 mb-2">
              ${q.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
            </div>
            <div class="question-meta">
              <span class="badge badge-secondary">Paper ${q.paper}</span>
              <span class="badge badge-secondary">${q.level}</span>
              <span class="badge badge-secondary">${q.date}</span>
            </div>
          </div>
        `).join('');
  }

  function resetFilters() {
    document.getElementById('marksFilter').value = '';
    document.getElementById('levelFilter').value = '';
    document.getElementById('paperFilter').value = '';
    document.getElementById('commandFilter').value = '';
    document.getElementById('contentSearch').value = '';

    // Reset main topics
    const mainTopicOptions = document.getElementById('mainTopic').options;
    for (let i = 0; i < mainTopicOptions.length; i++) {
      mainTopicOptions[i].selected = mainTopicOptions[i].value === 'all';
    }

    // Reset sub topics
    const subTopicOptions = document.getElementById('subTopic').options;
    for (let i = 0; i < subTopicOptions.length; i++) {
      subTopicOptions[i].selected = subTopicOptions[i].value === 'all';
    }

    updateDisplay();
  }

  // Toggle filters on mobile
  document.getElementById('toggleFilters').addEventListener('click', function() {
    const filtersContainer = document.getElementById('filtersContainer');
    filtersContainer.classList.toggle('hidden');
  });

  // Toggle topic filters
  document.getElementById('topicFilterHeader').addEventListener('click', function() {
    const content = document.getElementById('topicFilterContent');
    content.classList.toggle('hidden');

    // Update arrow icon
    const arrow = this.querySelector('svg');
    if (content.classList.contains('hidden')) {
      arrow.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />';
    } else {
      arrow.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />';
    }
  });

  // Add event listeners to all filters
  document.querySelectorAll('input, select').forEach(element => {
    element.addEventListener('input', updateDisplay);
    element.addEventListener('change', updateDisplay);
  });

  // If all is selected, deselect the rest
  document.getElementById('mainTopic').addEventListener('change', function(e) {
    const options = [...this.options];
    const allOption = options.find(o => o.value === 'all');

    if (e.target.value === 'all') {
      options.forEach(o => o.selected = o.value === 'all');
    } else if (options.filter(o => o.selected && o.value !== 'all').length > 0) {
      allOption.selected = false;
    }
  });

  document.getElementById('subTopic').addEventListener('change', function(e) {
    const options = [...this.options];
    const allOption = options.find(o => o.value === 'all');

    if (e.target.value === 'all') {
      options.forEach(o => o.selected = o.value === 'all');
    } else if (options.filter(o => o.selected && o.value !== 'all').length > 0) {
      allOption.selected = false;
    }
  });

  // Hide filters on mobile by default
  if (window.innerWidth < 768) {
    document.getElementById('filtersContainer').classList.add('hidden');
  }

  updateDisplay();

  const modal = document.getElementById('questionModal');
  const questionFrame = document.getElementById('questionFrame');

  document.getElementById('questionContainer').addEventListener('click', (event) => {
    const card = event.target.closest('.question-card');
    if (card) {
      const questionId = card.dataset.id;
      modal.classList.remove('hidden');
      questionFrame.src = `physics/questions/${questionId}.html`;
    }
  });

  document.getElementById('closeModal').addEventListener('click', () => {
    modal.classList.add('hidden');
    questionFrame.src = '';
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.add('hidden');
      questionFrame.src = '';
    }
  });
}

init();
