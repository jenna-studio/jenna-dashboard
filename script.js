/* ========================================
   PIXEL DASHBOARD - Main JavaScript
   ======================================== */

// ========================================
// GLOBAL STATE
// ========================================

let state = {
    tasks: [],
    notes: [],
    shortcuts: [],
    aiTools: [],
    devTools: [],
    universityLinks: [],
    calendarEvents: [],
    lastSync: null,
    stats: {
        weeklyTasks: [3, 5, 2, 8, 6, 4, 7], // Mon-Sun
        streak: 0,
        level: 1,
        xp: 0,
        maxXP: 100
    },
    timer: {
        minutes: 30,
        seconds: 0,
        isRunning: false,
        interval: null
    },
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear()
};

// ========================================
// INITIALIZE
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    initializePixelStars();
    initializeClock();
    initializeTasks();
    initializeCalendar();
    initializeShortcuts();
    initializeAITools();
    initializeDevTools();
    initializeUniversity();
    initializeStats();
    initializeNotes();
    initializeHSK();
    initializeLevel();
    initializeTimer();
    initializeWidgetControls();

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// ========================================
// LOCAL STORAGE
// ========================================

function saveToLocalStorage() {
    localStorage.setItem('pixelDashboard', JSON.stringify(state));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('pixelDashboard');
    if (saved) {
        const loaded = JSON.parse(saved);
        state = { ...state, ...loaded };
        // Reset timer state to default 30:00
        state.timer.minutes = 30;
        state.timer.seconds = 0;
        state.timer.isRunning = false;
        state.timer.interval = null;
        // Always reset calendar to current month
        state.currentMonth = new Date().getMonth();
        state.currentYear = new Date().getFullYear();
    }
}

// ========================================
// PIXEL STARS BACKGROUND
// ========================================

function initializePixelStars() {
    const container = document.getElementById('starsContainer');
    const starCount = 50;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'pixel-star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(star);
    }
}

// ========================================
// CLOCK
// ========================================

function initializeClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const hoursStr = String(hours).padStart(2, '0');

    document.getElementById('pixelClock').textContent = `${hoursStr}:${minutes}:${seconds} ${ampm}`;
}

// ========================================
// TASKS
// ========================================

function initializeTasks() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    renderTasks();
}

function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();

    if (text === '') {
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    state.tasks.push(task);
    input.value = '';

    // Play sound effect
    playSound('taskAdd');

    // Add XP for creating a task
    addXP(5);

    // Update weekly stats
    const today = new Date().getDay();
    state.stats.weeklyTasks[today === 0 ? 6 : today - 1]++;

    saveToLocalStorage();
    renderTasks();
    updateStats();
}

function toggleTask(id) {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;

        // Add XP for completing a task
        if (task.completed) {
            playSound('taskComplete');
            addXP(10);
            showCompletionEffect();
        }

        saveToLocalStorage();
        renderTasks();
    }
}

function deleteTask(id) {
    state.tasks = state.tasks.filter(t => t.id !== id);
    saveToLocalStorage();
    renderTasks();
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    const totalTasks = document.getElementById('totalTasks');
    const completedTasks = document.getElementById('completedTasks');

    taskList.innerHTML = '';

    state.tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${escapeHtml(task.text)}</span>
            <button class="task-delete">×</button>
        `;

        li.querySelector('.task-checkbox').addEventListener('change', () => toggleTask(task.id));
        li.querySelector('.task-delete').addEventListener('click', () => deleteTask(task.id));

        taskList.appendChild(li);
    });

    totalTasks.textContent = state.tasks.length;
    completedTasks.textContent = state.tasks.filter(t => t.completed).length;
}

function showCompletionEffect() {
    // Create a floating "✓" animation
    const effect = document.createElement('div');
    effect.textContent = '✓';
    effect.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 80px;
        color: var(--pixel-green);
        pointer-events: none;
        z-index: 9999;
        animation: floatUp 1s ease-out forwards;
    `;

    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 1000);
}

// Add floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0);
        }
        50% {
            transform: translate(-50%, -80%) scale(1.5);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -120%) scale(1);
        }
    }
`;
document.head.appendChild(style);

// ========================================
// CALENDAR
// ========================================

function initializeCalendar() {
    // Update today's date display
    updateTodayDate();

    document.getElementById('prevMonth').addEventListener('click', () => {
        state.currentMonth--;
        if (state.currentMonth < 0) {
            state.currentMonth = 11;
            state.currentYear--;
        }
        renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        state.currentMonth++;
        if (state.currentMonth > 11) {
            state.currentMonth = 0;
            state.currentYear++;
        }
        renderCalendar();
    });

    // Today button
    document.getElementById('todayBtn').addEventListener('click', () => {
        const now = new Date();
        state.currentMonth = now.getMonth();
        state.currentYear = now.getFullYear();
        renderCalendar();
    });

    // Sync calendar button
    document.getElementById('syncCalendarBtn').addEventListener('click', syncCalendar);

    // Event modal close
    document.querySelector('.event-modal-close').addEventListener('click', closeEventModal);
    document.getElementById('eventModal').addEventListener('click', (e) => {
        if (e.target.id === 'eventModal') {
            closeEventModal();
        }
    });

    // Load events from file
    loadCalendarEvents();
    renderCalendar();

    // Auto-fetch calendar events every 5 minutes
    setInterval(() => {
        loadCalendarEvents();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
}

function syncCalendar() {
    // Run the sync script via shortcuts
    window.location.href = 'shortcuts://run-shortcut?name=Sync%20Calendar';

    // Wait 3 seconds then reload the events
    setTimeout(() => {
        loadCalendarEvents();
    }, 3000);
}

async function loadCalendarEvents() {
    try {
        const response = await fetch('calendar-events.json');
        if (response.ok) {
            state.calendarEvents = await response.json();
            state.lastSync = new Date().toISOString();

            // Update UI
            renderCalendar();

            console.log(`Loaded ${state.calendarEvents.length} calendar events`);
        }
    } catch (error) {
        console.log('Calendar events file not found. Run sync-calendar.sh to sync events.');
    }
}

function updateTodayDate() {
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2); // Get last 2 digits
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayDateEl = document.getElementById('todayDate');
    if (todayDateEl) {
        todayDateEl.textContent = `${year}.${month}.${day}`;
    }
}

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthLabel = document.getElementById('currentMonth');

    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    monthLabel.textContent = `${monthNames[state.currentMonth]} ${state.currentYear}`;

    grid.innerHTML = '';

    // Day headers (Monday first)
    const dayHeaders = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        grid.appendChild(header);
    });

    // Get first day and total days in month
    let firstDay = new Date(state.currentYear, state.currentMonth, 1).getDay();
    // Convert Sunday (0) to 7, then subtract 1 to make Monday = 0
    firstDay = firstDay === 0 ? 6 : firstDay - 1;

    const daysInMonth = new Date(state.currentYear, state.currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(state.currentYear, state.currentMonth, 0).getDate();

    const today = new Date();
    const isCurrentMonth = today.getMonth() === state.currentMonth && today.getFullYear() === state.currentYear;
    const currentDay = today.getDate();

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = prevMonthDays - i;
        grid.appendChild(day);
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        if (isCurrentMonth && i === currentDay) {
            day.classList.add('today');
        }

        // Check if day has calendar events (including multi-day events)
        const currentDate = new Date(state.currentYear, state.currentMonth, i);
        const eventsOnDay = state.calendarEvents.filter(event => {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);

            // Set to start of day for comparison
            const dayStart = new Date(currentDate);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(currentDate);
            dayEnd.setHours(23, 59, 59, 999);

            // Check if event overlaps with this day
            return eventStart <= dayEnd && eventEnd >= dayStart;
        });

        if (eventsOnDay.length > 0) {
            day.classList.add('has-event');

            // Add colored dots for each event
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'event-dots';
            eventsOnDay.slice(0, 3).forEach(event => {
                const dot = document.createElement('span');
                dot.className = 'event-color-dot';
                dot.style.backgroundColor = event.color || '#B3D9FF';
                dotsContainer.appendChild(dot);
            });
            day.appendChild(dotsContainer);

            day.style.cursor = 'pointer';
            day.addEventListener('click', () => showDayEvents(state.currentYear, state.currentMonth, i));
        }

        const dayNumber = document.createElement('span');
        dayNumber.className = 'day-number';
        dayNumber.textContent = i;
        day.insertBefore(dayNumber, day.firstChild);

        grid.appendChild(day);
    }

    // Next month days
    const totalCells = grid.children.length - 7; // Minus headers
    const remainingCells = 42 - totalCells - 7; // 6 weeks max minus headers
    for (let i = 1; i <= remainingCells; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = i;
        grid.appendChild(day);
    }
}

function showDayEvents(year, month, day) {
    const modal = document.getElementById('eventModal');
    const modalDate = document.getElementById('eventModalDate');
    const eventsList = document.getElementById('eventsList');
    const noEvents = document.getElementById('noEvents');

    // Format date for display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    modalDate.textContent = `${monthNames[month]} ${day}, ${year}`;

    // Get events for this day (including multi-day events)
    const currentDate = new Date(year, month, day);
    const dayEvents = state.calendarEvents.filter(event => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);

        // Set to start of day for comparison
        const dayStart = new Date(currentDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(currentDate);
        dayEnd.setHours(23, 59, 59, 999);

        // Check if event overlaps with this day
        return eventStart <= dayEnd && eventEnd >= dayStart;
    });

    // Clear and populate events list
    eventsList.innerHTML = '';

    if (dayEvents.length === 0) {
        noEvents.style.display = 'block';
        eventsList.style.display = 'none';
    } else {
        noEvents.style.display = 'none';
        eventsList.style.display = 'block';

        dayEvents.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            eventItem.style.borderLeft = `4px solid ${event.color || '#B3D9FF'}`;

            const startDate = new Date(event.start);
            const endDate = new Date(event.end);

            // Check if multi-day event
            const isMultiDay = (endDate - startDate) > (24 * 60 * 60 * 1000);

            let timeStr = '';
            if (event.allDay) {
                if (isMultiDay) {
                    const startDay = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    const endDay = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    timeStr = `${startDay} - ${endDay}`;
                } else {
                    timeStr = 'All Day';
                }
            } else {
                const startTime = startDate.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                const endTime = endDate.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                if (isMultiDay) {
                    const startDay = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    const endDay = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    timeStr = `${startDay} ${startTime} - ${endDay} ${endTime}`;
                } else {
                    timeStr = `${startTime} - ${endTime}`;
                }
            }

            eventItem.innerHTML = `
                <div class="event-time">${escapeHtml(timeStr)}</div>
                <div class="event-title">${escapeHtml(event.title)}</div>
                ${event.calendar ? `<div class="event-calendar">📆 ${escapeHtml(event.calendar)}</div>` : ''}
                ${event.location ? `<div class="event-location">📍 ${escapeHtml(event.location)}</div>` : ''}
            `;

            eventsList.appendChild(eventItem);
        });
    }

    modal.classList.add('active');
}

function closeEventModal() {
    document.getElementById('eventModal').classList.remove('active');
}

// ========================================
// SHORTCUTS
// ========================================

function initializeShortcuts() {
    // Default shortcuts - load only if empty
    if (state.shortcuts.length === 0) {
        state.shortcuts = [
            { id: 1, name: 'MAIL', url: 'mailto:', emoji: 'https://img.icons8.com/?size=100&id=7rhqrO588QcU&format=png&color=000000' },
            { id: 2, name: 'CALENDAR', url: 'https://calendar.google.com', emoji: '📅' },
            { id: 3, name: 'NOTES', url: 'shortcuts://run-shortcut?name=Open%20Notes', emoji: 'https://purepng.com/public/uploads/large/purepng.com-notes-iconsymbolsiconsapple-iosiosios-8-iconsios-8-721522596090jwgta.png' },
            { id: 4, name: 'DRIVE', url: 'https://drive.google.com', emoji: 'https://img.icons8.com/?size=100&id=ya4CrqO7PgnY&format=png&color=000000' },
            { id: 5, name: 'GITHUB', url: 'https://github.com', emoji: 'https://images.icon-icons.com/3685/PNG/512/github_logo_icon_229278.png' },
            { id: 6, name: 'CHROME', url: 'https://www.google.com/chrome/', emoji: 'https://img.icons8.com/?size=100&id=63785&format=png&color=000000' },
            { id: 7, name: 'OBSIDIAN', url: 'obsidian://', emoji: 'https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F59cec3b1-8ac3-4ca6-8a64-23ec20d95f23_512x512.png' },
            { id: 8, name: 'MUSIC', url: 'shortcuts://run-shortcut?name=play%20playlist', emoji: 'https://img.icons8.com/?size=100&id=81TSi6Gqk0tm&format=png&color=000000' },
            { id: 9, name: 'NOTION', url: 'notion://', emoji: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Notion-logo.svg/2048px-Notion-logo.svg.png' }
        ];
        saveToLocalStorage();
    }

    document.getElementById('addShortcutBtn').addEventListener('click', openShortcutModal);
    document.querySelector('.modal-close').addEventListener('click', closeShortcutModal);
    document.getElementById('saveShortcutBtn').addEventListener('click', saveShortcut);

    // Close modal on outside click
    document.getElementById('shortcutModal').addEventListener('click', (e) => {
        if (e.target.id === 'shortcutModal') {
            closeShortcutModal();
        }
    });

    renderShortcuts();
}

function openShortcutModal() {
    document.getElementById('shortcutModal').classList.add('active');
    document.getElementById('shortcutName').focus();
}

function closeShortcutModal() {
    document.getElementById('shortcutModal').classList.remove('active');
    document.getElementById('shortcutName').value = '';
    document.getElementById('shortcutUrl').value = '';
    document.getElementById('shortcutEmoji').value = '';
}

function saveShortcut() {
    const name = document.getElementById('shortcutName').value.trim().toUpperCase();
    const url = document.getElementById('shortcutUrl').value.trim();
    const emoji = document.getElementById('shortcutEmoji').value.trim() || '🌟';

    if (name === '' || url === '') {
        alert('Please fill in name and URL!');
        return;
    }

    const shortcut = {
        id: Date.now(),
        name,
        url,
        emoji
    };

    state.shortcuts.push(shortcut);
    saveToLocalStorage();
    renderShortcuts();
    closeShortcutModal();
}

function deleteShortcut(id) {
    state.shortcuts = state.shortcuts.filter(s => s.id !== id);
    saveToLocalStorage();
    renderShortcuts();
}

function renderShortcuts() {
    const grid = document.getElementById('shortcutsGrid');
    grid.innerHTML = '';

    state.shortcuts.forEach(shortcut => {
        const item = document.createElement('a');
        item.className = 'shortcut-item';
        item.href = shortcut.url;
        item.target = '_blank';

        // Check if emoji is a URL (image) or emoji
        const isImageUrl = shortcut.emoji.startsWith('http://') || shortcut.emoji.startsWith('https://');

        if (isImageUrl) {
            item.innerHTML = `
                <div class="shortcut-emoji"><img src="${escapeHtml(shortcut.emoji)}" alt="${escapeHtml(shortcut.name)}" class="ai-tool-logo"></div>
                <div class="shortcut-name">${escapeHtml(shortcut.name)}</div>
                <button class="shortcut-delete">×</button>
            `;
        } else {
            item.innerHTML = `
                <div class="shortcut-emoji">${shortcut.emoji}</div>
                <div class="shortcut-name">${escapeHtml(shortcut.name)}</div>
                <button class="shortcut-delete">×</button>
            `;
        }

        item.querySelector('.shortcut-delete').addEventListener('click', (e) => {
            e.preventDefault();
            deleteShortcut(shortcut.id);
        });

        grid.appendChild(item);
    });
}

// ========================================
// AI TOOLS
// ========================================

function initializeAITools() {
    // Default AI tools
    if (state.aiTools.length === 0) {
        state.aiTools = [
            { id: 1, name: 'CLAUDE', url: 'https://claude.ai', icon: 'https://img.icons8.com/?size=100&id=zQjzFjPpT2Ek&format=png&color=000000' },
            { id: 2, name: 'CHATGPT', url: 'https://chatgpt.com', icon: 'https://img.icons8.com/?size=100&id=FBO05Dys9QCg&format=png&color=000000' },
            { id: 3, name: 'GEMINI', url: 'https://gemini.google.com', icon: 'https://img.icons8.com/?size=100&id=rnK88i9FvAFO&format=png&color=000000' },
            { id: 4, name: 'NOTEBOOKLM', url: 'https://notebooklm.google.com', icon: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/notebooklm.png' },
            { id: 5, name: 'PERPLEXITY', url: 'https://perplexity.ai', icon: 'https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/logos/perplexity-kcjtmnt09fjb1qgfxcdbd.png/perplexity-e6a4e1t06hd6dhczot580o.png?_a=DATAg1AAZAA0' },
            { id: 6, name: 'COPILOT', url: 'https://copilot.microsoft.com', icon: 'https://img.icons8.com/?size=100&id=PxQoyT1s0uFh&format=png&color=000000' }
        ];
        saveToLocalStorage();
    }

    document.getElementById('addAIToolBtn').addEventListener('click', openAIToolModal);
    document.querySelector('.ai-modal-close').addEventListener('click', closeAIToolModal);
    document.getElementById('saveAIToolBtn').addEventListener('click', saveAITool);

    // Close modal on outside click
    document.getElementById('aiToolModal').addEventListener('click', (e) => {
        if (e.target.id === 'aiToolModal') {
            closeAIToolModal();
        }
    });

    renderAITools();
}

function openAIToolModal() {
    document.getElementById('aiToolModal').classList.add('active');
    document.getElementById('aiToolName').focus();
}

function closeAIToolModal() {
    document.getElementById('aiToolModal').classList.remove('active');
    document.getElementById('aiToolName').value = '';
    document.getElementById('aiToolUrl').value = '';
    document.getElementById('aiToolIcon').value = '';
}

function saveAITool() {
    const name = document.getElementById('aiToolName').value.trim().toUpperCase();
    const url = document.getElementById('aiToolUrl').value.trim();
    const icon = document.getElementById('aiToolIcon').value.trim() || '🤖';

    if (name === '' || url === '') {
        alert('Please fill in name and URL!');
        return;
    }

    const aiTool = {
        id: Date.now(),
        name,
        url,
        icon
    };

    state.aiTools.push(aiTool);
    saveToLocalStorage();
    renderAITools();
    closeAIToolModal();
}

function deleteAITool(id) {
    state.aiTools = state.aiTools.filter(t => t.id !== id);
    saveToLocalStorage();
    renderAITools();
}

function renderAITools() {
    const grid = document.getElementById('aiToolsGrid');
    grid.innerHTML = '';

    state.aiTools.forEach(tool => {
        const item = document.createElement('a');
        item.className = 'shortcut-item';
        item.href = tool.url;
        item.target = '_blank';

        // Check if icon is a URL (image) or emoji
        const isImageUrl = tool.icon.startsWith('http://') || tool.icon.startsWith('https://');

        if (isImageUrl) {
            item.innerHTML = `
                <div class="shortcut-emoji"><img src="${escapeHtml(tool.icon)}" alt="${escapeHtml(tool.name)}" class="ai-tool-logo"></div>
                <div class="shortcut-name">${escapeHtml(tool.name)}</div>
                <button class="shortcut-delete">×</button>
            `;
        } else {
            item.innerHTML = `
                <div class="shortcut-emoji">${tool.icon}</div>
                <div class="shortcut-name">${escapeHtml(tool.name)}</div>
                <button class="shortcut-delete">×</button>
            `;
        }

        item.querySelector('.shortcut-delete').addEventListener('click', (e) => {
            e.preventDefault();
            deleteAITool(tool.id);
        });

        grid.appendChild(item);
    });
}

// ========================================
// DEV TOOLS
// ========================================

function initializeDevTools() {
    // Default dev tools - always loaded
    if (state.devTools.length === 0) {
        state.devTools = [
            { id: 1, name: 'VS CODE', url: 'vscode://', icon: 'https://img.icons8.com/?size=100&id=9OGIyU8hrxW5&format=png&color=000000' },
            { id: 2, name: 'SCRIPT EDITOR', url: 'shortcuts://run-shortcut?name=Open%20Script%20Editor', icon: 'https://images.icon-icons.com/3053/PNG/512/script_editor_macos_bigsur_icon_189763.png' },
            { id: 3, name: 'MONACO', url: 'https://jenna-studio.github.io/monaco-editor-web/', icon: 'https://img.icons8.com/?size=100&id=QsO1qiXCL8H2&format=png&color=000000' },
            { id: 4, name: 'SUBLIME', url: 'shortcuts://run-shortcut?name=Open%20Sublime%20Text', icon: 'https://img.icons8.com/?size=100&id=6RHskkZGRABM&format=png&color=000000' },
            { id: 5, name: 'TERMINAL', url: 'shortcuts://run-shortcut?name=Open%20Terminal', icon: 'https://img.icons8.com/?size=100&id=19292&format=png&color=000000' },
            { id: 6, name: 'SOURCETREE', url: 'shortcuts://run-shortcut?name=Open%20Sourcetree', icon: 'https://img.icons8.com/?size=100&id=F8p20Vd88Bus&format=png&color=000000' }
        ];
        saveToLocalStorage();
    }

    // Event listeners
    document.getElementById('addDevToolBtn').addEventListener('click', openDevToolModal);
    document.querySelector('.dev-modal-close').addEventListener('click', closeDevToolModal);
    document.getElementById('saveDevToolBtn').addEventListener('click', saveDevTool);

    // Close modal on outside click
    document.getElementById('devToolModal').addEventListener('click', (e) => {
        if (e.target.id === 'devToolModal') {
            closeDevToolModal();
        }
    });

    renderDevTools();
}

function openDevToolModal() {
    document.getElementById('devToolModal').classList.add('active');
    document.getElementById('devToolName').focus();
}

function closeDevToolModal() {
    document.getElementById('devToolModal').classList.remove('active');
    document.getElementById('devToolName').value = '';
    document.getElementById('devToolUrl').value = '';
    document.getElementById('devToolIcon').value = '';
}

function saveDevTool() {
    const name = document.getElementById('devToolName').value.trim();
    const url = document.getElementById('devToolUrl').value.trim();
    const icon = document.getElementById('devToolIcon').value.trim();

    if (!name || !url) {
        alert('Please fill in name and URL');
        return;
    }

    const newTool = {
        id: Date.now(),
        name: name.toUpperCase(),
        url: url,
        icon: icon || '⚙️'
    };

    state.devTools.push(newTool);
    saveToLocalStorage();
    renderDevTools();
    closeDevToolModal();
}

function deleteDevTool(id) {
    state.devTools = state.devTools.filter(tool => tool.id !== id);
    saveToLocalStorage();
    renderDevTools();
}

function renderDevTools() {
    const grid = document.getElementById('devToolsGrid');
    grid.innerHTML = '';

    state.devTools.forEach(tool => {
        const item = document.createElement('a');
        item.className = 'shortcut-item';
        item.href = tool.url;
        item.target = '_blank';

        // Check if icon is a URL (image) or emoji
        const isImageUrl = tool.icon.startsWith('http://') || tool.icon.startsWith('https://');

        if (isImageUrl) {
            item.innerHTML = `
                <div class="shortcut-emoji"><img src="${escapeHtml(tool.icon)}" alt="${escapeHtml(tool.name)}" class="ai-tool-logo"></div>
                <div class="shortcut-name">${escapeHtml(tool.name)}</div>
                <button class="shortcut-delete">×</button>
            `;
        } else {
            item.innerHTML = `
                <div class="shortcut-emoji">${tool.icon}</div>
                <div class="shortcut-name">${escapeHtml(tool.name)}</div>
                <button class="shortcut-delete">×</button>
            `;
        }

        // Add delete button event listener
        item.querySelector('.shortcut-delete').addEventListener('click', (e) => {
            e.preventDefault();
            deleteDevTool(tool.id);
        });

        grid.appendChild(item);
    });
}

// ========================================
// UNIVERSITY
// ========================================

function initializeUniversity() {
    // Default university links
    if (state.universityLinks.length === 0) {
        state.universityLinks = [
            { id: 1, name: 'PORTAL', url: 'https://portal.kookmin.ac.kr', icon: '🎓' },
            { id: 2, name: 'E-CLASS', url: 'https://eclass.kookmin.ac.kr', icon: '📚' },
            { id: 3, name: 'LIBRARY', url: 'https://lib.kookmin.ac.kr', icon: '📖' }
        ];
        saveToLocalStorage();
    }

    // Event listeners
    document.getElementById('addUniversityBtn').addEventListener('click', openUniversityModal);
    document.querySelector('.university-modal-close').addEventListener('click', closeUniversityModal);
    document.getElementById('saveUniversityBtn').addEventListener('click', saveUniversity);

    // Close modal on outside click
    document.getElementById('universityModal').addEventListener('click', (e) => {
        if (e.target.id === 'universityModal') {
            closeUniversityModal();
        }
    });

    renderUniversity();
}

function openUniversityModal() {
    document.getElementById('universityModal').classList.add('active');
    document.getElementById('universityName').focus();
}

function closeUniversityModal() {
    document.getElementById('universityModal').classList.remove('active');
    document.getElementById('universityName').value = '';
    document.getElementById('universityUrl').value = '';
    document.getElementById('universityIcon').value = '';
}

function saveUniversity() {
    const name = document.getElementById('universityName').value.trim();
    const url = document.getElementById('universityUrl').value.trim();
    const icon = document.getElementById('universityIcon').value.trim();

    if (!name || !url) {
        alert('Please fill in name and URL');
        return;
    }

    const newLink = {
        id: Date.now(),
        name: name.toUpperCase(),
        url: url,
        icon: icon || '🎓'
    };

    state.universityLinks.push(newLink);
    saveToLocalStorage();
    renderUniversity();
    closeUniversityModal();
}

function deleteUniversity(id) {
    state.universityLinks = state.universityLinks.filter(link => link.id !== id);
    saveToLocalStorage();
    renderUniversity();
}

function renderUniversity() {
    const grid = document.getElementById('universityGrid');
    grid.innerHTML = '';

    state.universityLinks.forEach(link => {
        const item = document.createElement('a');
        item.className = 'shortcut-item';
        item.href = link.url;
        item.target = '_blank';

        // Check if icon is a URL (image) or emoji
        const isImageUrl = link.icon.startsWith('http://') || link.icon.startsWith('https://');

        if (isImageUrl) {
            item.innerHTML = `
                <div class="shortcut-emoji"><img src="${escapeHtml(link.icon)}" alt="${escapeHtml(link.name)}" class="ai-tool-logo"></div>
                <div class="shortcut-name">${escapeHtml(link.name)}</div>
                <button class="shortcut-delete">×</button>
            `;
        } else {
            item.innerHTML = `
                <div class="shortcut-emoji">${link.icon}</div>
                <div class="shortcut-name">${escapeHtml(link.name)}</div>
                <button class="shortcut-delete">×</button>
            `;
        }

        // Add delete button event listener
        item.querySelector('.shortcut-delete').addEventListener('click', (e) => {
            e.preventDefault();
            deleteUniversity(link.id);
        });

        grid.appendChild(item);
    });
}

// ========================================
// STATS & CHARTS
// ========================================

function initializeStats() {
    updateStats();
}

function updateStats() {
    renderWeeklyChart();
    updateStreakAndWeekly();
}

function renderWeeklyChart() {
    const chart = document.getElementById('weeklyChart');
    chart.innerHTML = '';

    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const maxValue = Math.max(...state.stats.weeklyTasks, 1);

    state.stats.weeklyTasks.forEach((value, index) => {
        const barItem = document.createElement('div');
        barItem.className = 'bar-item';

        const height = (value / maxValue) * 100;
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${height}%`;
        bar.style.animationDelay = `${index * 0.1}s`;
        bar.innerHTML = `<span class="bar-value">${value}</span>`;

        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = days[index];

        barItem.appendChild(bar);
        barItem.appendChild(label);
        chart.appendChild(barItem);
    });
}

function updateStreakAndWeekly() {
    // Calculate streak (simplified)
    const today = new Date();
    let streak = 0;
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const hasTask = state.tasks.some(task => task.createdAt.startsWith(dateStr) && task.completed);
        if (hasTask) {
            streak++;
        } else {
            break;
        }
    }

    state.stats.streak = streak;
    document.getElementById('streakDays').textContent = streak;

    // Calculate tasks this week
    const tasksThisWeek = state.stats.weeklyTasks.reduce((a, b) => a + b, 0);
    document.getElementById('tasksThisWeek').textContent = tasksThisWeek;

    saveToLocalStorage();
}

// ========================================
// NOTES
// ========================================

function initializeNotes() {
    const addNoteBtn = document.getElementById('addNoteBtn');
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');

    addNoteBtn.addEventListener('click', addNote);
    titleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            contentInput.focus();
        }
    });
    contentInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            addNote();
        }
    });

    renderNotes();
}

function addNote() {
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();

    if (title === '' && content === '') {
        return;
    }

    const note = {
        id: Date.now(),
        title: title || 'Untitled Note',
        content: content,
        createdAt: new Date().toISOString()
    };

    state.notes.unshift(note);
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';

    saveToLocalStorage();
    renderNotes();
}

function deleteNote(id) {
    state.notes = state.notes.filter(n => n.id !== id);
    saveToLocalStorage();
    renderNotes();
}

function renderNotes() {
    const list = document.getElementById('notesList');
    list.innerHTML = '';

    if (state.notes.length === 0) {
        list.innerHTML = '<li style="text-align: center; padding: 20px; opacity: 0.5;">No notes yet!</li>';
        return;
    }

    state.notes.slice(0, 10).forEach(note => {
        const li = document.createElement('li');
        li.className = 'note-item';

        const noteDate = new Date(note.createdAt);
        const timeStr = noteDate.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        li.innerHTML = `
            <div class="note-header">
                <div class="note-title">${escapeHtml(note.title)}</div>
                <button class="note-delete">×</button>
            </div>
            ${note.content ? `<div class="note-content">${escapeHtml(note.content)}</div>` : ''}
            <div class="note-time">${timeStr}</div>
        `;

        li.querySelector('.note-delete').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteNote(note.id);
        });

        list.appendChild(li);
    });
}

// ========================================
// HSK5 VOCABULARY
// ========================================

const hsk5Words = [
    { character: "哎", pinyin: "āi", korean: "이런, 어" },
    { character: "爱护", pinyin: "ài hù", korean: "아끼다, 소중히 하다" },
    { character: "安装", pinyin: "ān zhuāng", korean: "설치하다" },
    { character: "岸", pinyin: "àn", korean: "해안, 강가" },
    { character: "把握", pinyin: "bǎ wò", korean: "파악하다, 장악하다" },
    { character: "摆", pinyin: "bǎi", korean: "놓다, 배치하다" },
    { character: "败", pinyin: "bài", korean: "패배하다" },
    { character: "报告", pinyin: "bào gào", korean: "보고하다, 보고서" },
    { character: "背景", pinyin: "bèi jǐng", korean: "배경" },
    { character: "本质", pinyin: "běn zhì", korean: "본질" },
    { character: "比例", pinyin: "bǐ lì", korean: "비율" },
    { character: "必然", pinyin: "bì rán", korean: "필연적인" },
    { character: "编辑", pinyin: "biān jí", korean: "편집하다" },
    { character: "标志", pinyin: "biāo zhì", korean: "표지, 상징" },
    { character: "表达", pinyin: "biǎo dá", korean: "표현하다" },
    { character: "采取", pinyin: "cǎi qǔ", korean: "취하다, 채택하다" },
    { character: "产生", pinyin: "chǎn shēng", korean: "발생하다, 생기다" },
    { character: "常识", pinyin: "cháng shí", korean: "상식" },
    { character: "成就", pinyin: "chéng jiù", korean: "성취, 업적" },
    { character: "承认", pinyin: "chéng rèn", korean: "인정하다" },
    { character: "诚恳", pinyin: "chéng kěn", korean: "성실한, 진지한" },
    { character: "承担", pinyin: "chéng dān", korean: "담당하다, 책임지다" },
    { character: "传播", pinyin: "chuán bō", korean: "전파하다, 퍼뜨리다" },
    { character: "创造", pinyin: "chuàng zào", korean: "창조하다" },
    { character: "此外", pinyin: "cǐ wài", korean: "이외에" },
    { character: "达到", pinyin: "dá dào", korean: "도달하다, 달성하다" },
    { character: "代表", pinyin: "dài biǎo", korean: "대표하다, 대표" },
    { character: "代替", pinyin: "dài tì", korean: "대신하다" },
    { character: "单纯", pinyin: "dān chún", korean: "단순한" },
    { character: "道德", pinyin: "dào dé", korean: "도덕" },
    { character: "导致", pinyin: "dǎo zhì", korean: "초래하다" },
    { character: "得意", pinyin: "dé yì", korean: "득의하다" },
    { character: "灯", pinyin: "dēng", korean: "등, 램프" },
    { character: "登记", pinyin: "dēng jì", korean: "등록하다" },
    { character: "地区", pinyin: "dì qū", korean: "지역, 지구" },
    { character: "地震", pinyin: "dì zhèn", korean: "지진" },
    { character: "动", pinyin: "dòng", korean: "움직이다" },
    { character: "独立", pinyin: "dú lì", korean: "독립적인" },
    { character: "度过", pinyin: "dù guò", korean: "보내다, 지내다" },
    { character: "短信", pinyin: "duǎn xìn", korean: "문자 메시지" },
    { character: "对待", pinyin: "duì dài", korean: "대하다, 대우하다" },
    { character: "发表", pinyin: "fā biǎo", korean: "발표하다" },
    { character: "发达", pinyin: "fā dá", korean: "발달하다" },
    { character: "发明", pinyin: "fā míng", korean: "발명하다" },
    { character: "法院", pinyin: "fǎ yuàn", korean: "법원" },
    { character: "烦", pinyin: "fán", korean: "번거롭다, 귀찮다" },
    { character: "反应", pinyin: "fǎn yìng", korean: "반응" },
    { character: "范围", pinyin: "fàn wéi", korean: "범위" },
    { character: "方案", pinyin: "fāng àn", korean: "방안, 계획" },
    { character: "放弃", pinyin: "fàng qì", korean: "포기하다" },
    { character: "分析", pinyin: "fēn xī", korean: "분석하다" },
    { character: "奋斗", pinyin: "fèn dòu", korean: "분투하다, 노력하다" },
    { character: "丰富", pinyin: "fēng fù", korean: "풍부한" },
    { character: "否定", pinyin: "fǒu dìng", korean: "부정하다" },
    { character: "妇女", pinyin: "fù nǚ", korean: "부녀, 여성" },
    { character: "改革", pinyin: "gǎi gé", korean: "개혁하다" },
    { character: "概括", pinyin: "gài kuò", korean: "개괄하다, 요약하다" },
    { character: "概念", pinyin: "gài niàn", korean: "개념" },
    { character: "干脆", pinyin: "gān cuì", korean: "차라리, 아예" },
    { character: "感激", pinyin: "gǎn jī", korean: "감격하다, 감사하다" },
    { character: "钢铁", pinyin: "gāng tiě", korean: "강철" },
    { character: "高速", pinyin: "gāo sù", korean: "고속" },
    { character: "根本", pinyin: "gēn běn", korean: "근본적인" },
    { character: "公开", pinyin: "gōng kāi", korean: "공개하다, 공개적인" },
    { character: "工程", pinyin: "gōng chéng", korean: "공정, 프로젝트" },
    { character: "功能", pinyin: "gōng néng", korean: "기능" },
    { character: "共鸣", pinyin: "gòng míng", korean: "공명, 공감" },
    { character: "贡献", pinyin: "gòng xiàn", korean: "공헌하다" },
    { character: "观察", pinyin: "guān chá", korean: "관찰하다" },
    { character: "海关", pinyin: "hǎi guān", korean: "세관" },
    { character: "合作", pinyin: "hé zuò", korean: "협력하다, 협동" },
    { character: "核心", pinyin: "hé xīn", korean: "핵심" },
    { character: "机器", pinyin: "jī qì", korean: "기계" },
    { character: "激烈", pinyin: "jī liè", korean: "격렬한, 치열한" },
    { character: "控制", pinyin: "kòng zhì", korean: "제어하다, 통제하다" },
    { character: "理论", pinyin: "lǐ lùn", korean: "이론" },
    { character: "利用", pinyin: "lì yòng", korean: "이용하다" },
    { character: "领导", pinyin: "lǐng dǎo", korean: "영도하다, 지도자" },
    { character: "媒体", pinyin: "méi tǐ", korean: "매체, 미디어" },
    { character: "目标", pinyin: "mù biāo", korean: "목표" },
    { character: "能干", pinyin: "néng gàn", korean: "유능한" },
    { character: "评价", pinyin: "píng jià", korean: "평가하다" },
    { character: "企业", pinyin: "qǐ yè", korean: "기업" },
    { character: "权利", pinyin: "quán lì", korean: "권리" },
    { character: "热爱", pinyin: "rè ài", korean: "열애하다, 열렬히 사랑하다" },
    { character: "人才", pinyin: "rén cái", korean: "인재" },
    { character: "生产", pinyin: "shēng chǎn", korean: "생산하다" },
    { character: "时代", pinyin: "shí dài", korean: "시대" },
    { character: "实现", pinyin: "shí xiàn", korean: "실현하다" },
    { character: "体现", pinyin: "tǐ xiàn", korean: "구현하다, 나타내다" },
    { character: "统一", pinyin: "tǒng yī", korean: "통일하다" },
    { character: "透明", pinyin: "tòu míng", korean: "투명한" },
    { character: "网络", pinyin: "wǎng luò", korean: "네트워크" },
    { character: "未来", pinyin: "wèi lái", korean: "미래" },
    { character: "现实", pinyin: "xiàn shí", korean: "현실" },
    { character: "项目", pinyin: "xiàng mù", korean: "프로젝트, 항목" },
    { character: "效率", pinyin: "xiào lǜ", korean: "효율" },
    { character: "中心", pinyin: "zhōng xīn", korean: "중심" },
    { character: "制度", pinyin: "zhì dù", korean: "제도" }
];

function initializeHSK() {
    document.getElementById('newWordBtn').addEventListener('click', updateWord);
    updateWord(); // Show initial word
}

function updateWord() {
    const randomWord = hsk5Words[Math.floor(Math.random() * hsk5Words.length)];

    document.getElementById('hskCharacter').textContent = randomWord.character;
    document.getElementById('hskPinyin').textContent = randomWord.pinyin;
    document.getElementById('hskMeaning').textContent = randomWord.korean;

    // Add animation
    const hskContainer = document.querySelector('.hsk-container');
    hskContainer.classList.add('bounce');
    setTimeout(() => hskContainer.classList.remove('bounce'), 500);
}

// ========================================
// LEVEL & XP
// ========================================

function initializeLevel() {
    updateLevelDisplay();
}

function addXP(amount) {
    state.stats.xp += amount;

    // Level up check
    while (state.stats.xp >= state.stats.maxXP) {
        state.stats.xp -= state.stats.maxXP;
        state.stats.level++;
        state.stats.maxXP = Math.floor(state.stats.maxXP * 1.5);
        showLevelUpEffect();
    }

    saveToLocalStorage();
    updateLevelDisplay();
}

function updateLevelDisplay() {
    document.getElementById('userLevel').textContent = state.stats.level;
    document.getElementById('currentXP').textContent = state.stats.xp;
    document.getElementById('maxXP').textContent = state.stats.maxXP;

    const percentage = (state.stats.xp / state.stats.maxXP) * 100;
    document.getElementById('xpFill').style.width = `${percentage}%`;
}

function showLevelUpEffect() {
    // Play triumphant sound
    playSound('levelUp');

    const effect = document.createElement('div');
    effect.textContent = '⭐ LEVEL UP! ⭐';
    effect.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: var(--font-pixel);
        font-size: 40px;
        color: var(--pixel-yellow);
        text-shadow: 3px 3px 0 var(--pixel-pink), 6px 6px 0 var(--pixel-purple);
        pointer-events: none;
        z-index: 9999;
        animation: levelUpAnim 2s ease-out forwards;
    `;

    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 2000);
}

// Add level up animation
const levelUpStyle = document.createElement('style');
levelUpStyle.textContent = `
    @keyframes levelUpAnim {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0) rotate(-180deg);
        }
        50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2) rotate(10deg);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -100%) scale(0.8) rotate(0deg);
        }
    }
`;
document.head.appendChild(levelUpStyle);

// ========================================
// TIMER (Pomodoro)
// ========================================

function initializeTimer() {
    document.getElementById('startTimer').addEventListener('click', startTimer);
    document.getElementById('pauseTimer').addEventListener('click', pauseTimer);
    document.getElementById('resetTimer').addEventListener('click', resetTimer);

    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const minutes = parseInt(e.target.dataset.minutes);
            setTimerMinutes(minutes);

            // Update active state
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    updateTimerDisplay();
}

function setTimerMinutes(minutes) {
    if (!state.timer.isRunning) {
        state.timer.minutes = minutes;
        state.timer.seconds = 0;
        updateTimerDisplay();
    }
}

function startTimer() {
    if (!state.timer.isRunning) {
        state.timer.isRunning = true;
        state.timer.interval = setInterval(() => {
            if (state.timer.seconds === 0) {
                if (state.timer.minutes === 0) {
                    // Timer finished
                    pauseTimer();
                    playSound('timerComplete');
                    showTimerCompleteEffect();
                    addXP(25);
                    return;
                }
                state.timer.minutes--;
                state.timer.seconds = 59;
            } else {
                state.timer.seconds--;
            }
            updateTimerDisplay();
        }, 1000);
    }
}

function pauseTimer() {
    state.timer.isRunning = false;
    if (state.timer.interval) {
        clearInterval(state.timer.interval);
        state.timer.interval = null;
    }
}

function resetTimer() {
    pauseTimer();
    const activePreset = document.querySelector('.preset-btn.active');
    const minutes = activePreset ? parseInt(activePreset.dataset.minutes) : 30;
    state.timer.minutes = minutes;
    state.timer.seconds = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = String(state.timer.minutes).padStart(2, '0');
    const seconds = String(state.timer.seconds).padStart(2, '0');
    document.getElementById('timerDisplay').textContent = `${minutes}:${seconds}`;
}

function showTimerCompleteEffect() {
    const effect = document.createElement('div');
    effect.textContent = '⏰ TIME\'S UP! ⏰';
    effect.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: var(--font-pixel);
        font-size: 40px;
        color: var(--pixel-purple);
        text-shadow: 3px 3px 0 var(--pixel-pink);
        pointer-events: none;
        z-index: 9999;
        animation: timerComplete 2s ease-out forwards;
    `;

    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 2000);
}

// Add timer complete animation
const timerCompleteStyle = document.createElement('style');
timerCompleteStyle.textContent = `
    @keyframes timerComplete {
        0%, 100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        10%, 30%, 50%, 70%, 90% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
        }
        20%, 40%, 60%, 80% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;
document.head.appendChild(timerCompleteStyle);

// ========================================
// WIDGET CONTROLS
// ========================================

function initializeWidgetControls() {
    document.querySelectorAll('.widget-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const widget = e.target.closest('.widget');
            if (widget) {
                widget.style.animation = 'widgetPop 0.3s ease-in reverse';
                setTimeout(() => {
                    widget.style.display = 'none';
                }, 300);
            }
        });
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// AUTO-SAVE
// ========================================

// Save state every 30 seconds
setInterval(() => {
    saveToLocalStorage();
}, 30000);

// Save before page unload
window.addEventListener('beforeunload', () => {
    saveToLocalStorage();
});

// ========================================
// EASTER EGG: Konami Code
// ========================================

let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateRainbowMode();
    }
});

function activateRainbowMode() {
    document.body.style.animation = 'rainbow 2s linear infinite';

    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(rainbowStyle);

    setTimeout(() => {
        document.body.style.animation = '';
    }, 10000);
}

// ========================================
// SOUND EFFECTS
// ========================================

// Audio Context for sound effects
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const now = audioContext.currentTime;

    switch(type) {
        case 'levelUp':
            // Triumphant ascending arpeggio
            [261.63, 329.63, 392.00, 523.25].forEach((freq, i) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.value = freq;
                osc.type = 'square';
                gain.gain.setValueAtTime(0.3, now + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
                osc.start(now + i * 0.1);
                osc.stop(now + i * 0.1 + 0.3);
            });
            return;

        case 'taskComplete':
            // Pleasant "ding" sound
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            oscillator.start(now);
            oscillator.stop(now + 0.3);
            break;

        case 'timerComplete':
            // Victory chime - two-tone
            oscillator.frequency.value = 523.25; // C
            oscillator.type = 'triangle';
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            oscillator.start(now);
            oscillator.stop(now + 0.4);

            // Second tone
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 659.25; // E
                osc2.type = 'triangle';
                gain2.gain.setValueAtTime(0.2, audioContext.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
                osc2.start();
                osc2.stop(audioContext.currentTime + 0.6);
            }, 200);
            break;

        case 'taskAdd':
            // Soft click sound
            oscillator.frequency.value = 400;
            oscillator.type = 'square';
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            oscillator.start(now);
            oscillator.stop(now + 0.1);
            break;
    }
}

// ========================================
// CONSOLE MESSAGE
// ========================================

console.log('%c✨ PIXEL DASHBOARD ✨', 'font-size: 24px; font-weight: bold; color: #FFB3D9; text-shadow: 2px 2px 0 #D4B3FF;');
console.log('%cMade with 💖 and pixels!', 'font-size: 14px; color: #B3F5E8;');
console.log('%cTry the Konami Code for a surprise! ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA', 'font-size: 12px; color: #FFF5B3;');
