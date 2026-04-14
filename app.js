// App State
const state = {
    currentPage: 'course-list',
    selectedCourse: null,
    enrolledCourses: JSON.parse(localStorage.getItem('enrolledCourses') || '{}'),
    progressData: JSON.parse(localStorage.getItem('progressData') || '{}'),
    isLoading: false
};

// Initialize app
function init() {
    setupEventListeners();
    showPage('course-list');
    loadCourseList();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            showPage(page);
        });
    });

    // Page links
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            showPage(page);
        });
    });

    // Back buttons
    document.querySelectorAll('[data-back]').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.back;
            showPage(page);
        });
    });

    // Modal close
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.querySelector('.modal-overlay').addEventListener('click', closeModal);

    // Modal start learning
    document.getElementById('modal-start-learning').addEventListener('click', () => {
        closeModal();
        if (state.selectedCourse) {
            showPage('my-learning');
        }
    });
}

// Show page
function showPage(page) {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });

    // Update pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(`${page}-page`).classList.add('active');

    state.currentPage = page;

    // Load page content
    if (page === 'course-list') {
        loadCourseList();
    } else if (page === 'my-learning') {
        loadMyLearning();
    }
}

// Load course list
function loadCourseList() {
    const container = document.getElementById('course-list');
    const loadingEl = document.getElementById('course-list-loading');
    const emptyEl = document.getElementById('course-list-empty');

    container.innerHTML = '';
    loadingEl.classList.remove('hidden');

    // Simulate loading
    setTimeout(() => {
        loadingEl.classList.add('hidden');

        if (coursesData.length === 0) {
            emptyEl.classList.remove('hidden');
            return;
        }

        emptyEl.classList.add('hidden');

        coursesData.forEach(course => {
            const isEnrolled = state.enrolledCourses[course.id];
            const card = createCourseCard(course, isEnrolled);
            container.appendChild(card);
        });
    }, 500);
}

// Create course card
function createCourseCard(course, isEnrolled = false) {
    const card = document.createElement('div');
    card.className = 'course-card';

    const categoryIcon = getCategoryIcon(course.category);
    const coverHtml = course.cover
        ? `<img src="${course.cover}" alt="${course.title}" class="course-cover">`
        : `<div class="course-cover-placeholder">${categoryIcon}</div>`;

    card.innerHTML = `
        ${coverHtml}
        <div class="course-content">
            <span class="course-category">${course.category}</span>
            <h3 class="course-title">${course.title}</h3>
            <p class="course-instructor">讲师：${course.instructor}</p>
            <p class="course-description">${course.description}</p>
            ${isEnrolled ? '<span class="course-enrolled-badge">已报名</span>' : ''}
        </div>
    `;

    card.addEventListener('click', () => {
        showCourseDetail(course.id);
    });

    return card;
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        '编程开发': '💻',
        '数据科学': '📊',
        '产品运营': '📱',
        '设计创意': '🎨',
        '人工智能': '🤖'
    };
    return icons[category] || '📚';
}

// Show course detail
function showCourseDetail(courseId) {
    state.selectedCourse = courseId;
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;

    const container = document.getElementById('course-detail');
    const loadingEl = document.getElementById('course-detail-loading');

    loadingEl.classList.remove('hidden');
    container.innerHTML = '';

    // Simulate loading
    setTimeout(() => {
        loadingEl.classList.add('hidden');

        const isEnrolled = state.enrolledCourses[course.id];
        const progress = state.progressData[course.id] || { completed: 0, total: course.sections.length };

        container.innerHTML = `
            <div class="course-detail-header">
                ${course.cover
                    ? `<img src="${course.cover}" alt="${course.title}" class="course-detail-cover">`
                    : `<div class="course-detail-cover-placeholder">${getCategoryIcon(course.category)}</div>`
                }
                <div class="course-detail-info">
                    <span class="course-detail-category">${course.category}</span>
                    <h1 class="course-detail-title">${course.title}</h1>
                    <p class="course-detail-instructor">讲师：${course.instructor}</p>
                    <p class="course-detail-description">${course.description}</p>
                    <div class="course-detail-actions">
                        ${isEnrolled ? `
                            <span class="course-enrolled-status">✓ 已报名</span>
                        ` : `
                            <button class="btn btn-primary btn-enroll" id="enroll-btn">立即报名</button>
                        `}
                    </div>
                </div>
            </div>

            ${isEnrolled ? `
                <div class="progress-section">
                    <h3>学习进度</h3>
                    <div class="progress-bar-container">
                        <div class="progress-label">
                            <span>已完成 ${progress.completed}/${progress.total} 个章节</span>
                            <span>${Math.round((progress.completed / progress.total) * 100)}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-bar-fill" style="width: ${(progress.completed / progress.total) * 100}%"></div>
                        </div>
                    </div>
                    <div class="progress-stats">
                        <span>学习中</span>
                        <span>连续学习 3 天</span>
                    </div>
                </div>
            ` : ''}

            <div class="course-sections">
                <h3>课程章节</h3>
                ${course.sections.map((section, index) => `
                    <div class="section-item">
                        <h4>${section.title}</h4>
                        <p>${section.description}</p>
                    </div>
                `).join('')}
            </div>

            <div class="course-instructor-section">
                <h3>讲师介绍</h3>
                <div class="instructor-card">
                    <div class="instructor-avatar">👨‍🏫</div>
                    <div class="instructor-info">
                        <h4>${course.instructor}</h4>
                        <p>资深讲师，拥有丰富的教学经验和行业实践经验。致力于帮助学员快速掌握实用技能。</p>
                    </div>
                </div>
            </div>

            <div class="course-audience">
                <h3>适合人群</h3>
                <ul>
                    ${course.targetAudience.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;

        // Add enroll button listener
        const enrollBtn = document.getElementById('enroll-btn');
        if (enrollBtn) {
            enrollBtn.addEventListener('click', () => enrollCourse(course.id));
        }

        showPage('course-detail');
    }, 500);
}

// Enroll course
function enrollCourse(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course || state.enrolledCourses[courseId]) return;

    state.enrolledCourses[courseId] = true;
    state.progressData[courseId] = { completed: 0, total: course.sections.length };

    localStorage.setItem('enrolledCourses', JSON.stringify(state.enrolledCourses));
    localStorage.setItem('progressData', JSON.stringify(state.progressData));

    showEnrollSuccessModal();
}

// Show enroll success modal
function showEnrollSuccessModal() {
    document.getElementById('enroll-modal').classList.remove('hidden');
}

// Close modal
function closeModal() {
    document.getElementById('enroll-modal').classList.add('hidden');
}

// Load my learning page
function loadMyLearning() {
    const container = document.getElementById('enrolled-courses');
    const loadingEl = document.getElementById('my-learning-loading');
    const emptyEl = document.getElementById('my-learning-empty');

    container.innerHTML = '';
    loadingEl.classList.remove('hidden');

    const enrolledIds = Object.keys(state.enrolledCourses);

    // Simulate loading
    setTimeout(() => {
        loadingEl.classList.add('hidden');

        if (enrolledIds.length === 0) {
            emptyEl.classList.remove('hidden');
            return;
        }

        emptyEl.classList.add('hidden');

        enrolledIds.forEach(id => {
            const course = coursesData.find(c => c.id === parseInt(id));
            if (course) {
                const card = createEnrolledCourseCard(course);
                container.appendChild(card);
            }
        });
    }, 500);
}

// Create enrolled course card
function createEnrolledCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'enrolled-course-card';

    const progress = state.progressData[course.id] || { completed: 0, total: course.sections.length };
    const percentage = Math.round((progress.completed / progress.total) * 100);

    card.innerHTML = `
        ${course.cover
            ? `<img src="${course.cover}" alt="${course.title}" class="enrolled-course-cover">`
            : `<div class="enrolled-course-cover-placeholder">${getCategoryIcon(course.category)}</div>`
        }
        <div class="enrolled-course-info">
            <h3 class="enrolled-course-title">${course.title}</h3>
            <p class="course-instructor">讲师：${course.instructor}</p>
            <div class="progress-bar-container" style="margin-top: 12px;">
                <div class="progress-label">
                    <span>${progress.completed}/${progress.total} 章节</span>
                    <span>${percentage}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        </div>
    `;

    card.addEventListener('click', () => {
        showCourseDetail(course.id);
    });

    return card;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);