/* ========================================
   PIXEL DASHBOARD - Main JavaScript
   ======================================== */

// ========================================
// GLOBAL STATE
// ========================================

let state = {
    tasks: [],
    emails: [],
    shortcuts: [],
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
        minutes: 25,
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
    initializeStats();
    initializeEmail();
    initializeQuote();
    initializeLevel();
    initializeTimer();
    initializeWidgetControls();
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
        // Reset timer state
        state.timer.isRunning = false;
        state.timer.interval = null;
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
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('pixelClock').textContent = `${hours}:${minutes}:${seconds}`;
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

    // Sync calendar button
    document.getElementById('syncCalendarBtn').addEventListener('click', loadCalendarEvents);

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
}

async function loadCalendarEvents() {
    try {
        const response = await fetch('calendar-events.json');
        if (response.ok) {
            state.calendarEvents = await response.json();
            state.lastSync = new Date().toISOString();

            // Update UI
            updateSyncStatus(true, state.calendarEvents.length);
            renderCalendar();

            console.log(`Loaded ${state.calendarEvents.length} calendar events`);
        } else {
            updateSyncStatus(false, 0);
        }
    } catch (error) {
        console.log('Calendar events file not found. Run sync-calendar.sh to sync events.');
        updateSyncStatus(false, 0);
    }
}

function updateSyncStatus(synced, eventCount) {
    const statusEl = document.getElementById('syncStatus');
    const statusTextEl = document.getElementById('syncStatusText');

    if (synced) {
        statusEl.classList.add('synced');
        statusTextEl.textContent = `${eventCount} events synced`;
    } else {
        statusEl.classList.remove('synced');
        statusTextEl.textContent = 'No events synced';
    }
}

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthLabel = document.getElementById('currentMonth');

    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    monthLabel.textContent = `${monthNames[state.currentMonth]} ${state.currentYear}`;

    grid.innerHTML = '';

    // Day headers
    const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        grid.appendChild(header);
    });

    // Get first day and total days in month
    const firstDay = new Date(state.currentYear, state.currentMonth, 1).getDay();
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

        // Check if day has tasks
        const dateStr = `${state.currentYear}-${String(state.currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const hasTasks = state.tasks.some(task => task.createdAt.startsWith(dateStr));
        if (hasTasks) {
            day.classList.add('has-task');
        }

        // Check if day has calendar events
        const hasEvents = state.calendarEvents.some(event => {
            const eventDate = new Date(event.start);
            return eventDate.getFullYear() === state.currentYear &&
                   eventDate.getMonth() === state.currentMonth &&
                   eventDate.getDate() === i;
        });
        if (hasEvents) {
            day.classList.add('has-event');
        }

        // Add click handler to show events
        if (hasEvents || hasTasks) {
            day.style.cursor = 'pointer';
            day.addEventListener('click', () => showDayEvents(state.currentYear, state.currentMonth, i));
        }

        day.textContent = i;
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

    // Get events for this day
    const dayEvents = state.calendarEvents.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.getFullYear() === year &&
               eventDate.getMonth() === month &&
               eventDate.getDate() === day;
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

            const startDate = new Date(event.start);
            const endDate = new Date(event.end);

            let timeStr = '';
            if (event.allDay) {
                timeStr = 'All Day';
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
                timeStr = `${startTime} - ${endTime}`;
            }

            eventItem.innerHTML = `
                <div class="event-time">${escapeHtml(timeStr)}</div>
                <div class="event-title">${escapeHtml(event.title)}</div>
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
    // Default shortcuts
    if (state.shortcuts.length === 0) {
        state.shortcuts = [
            { id: 1, name: 'MAIL', url: 'https://mail.google.com', emoji: '📧' },
            { id: 2, name: 'CALENDAR', url: 'https://calendar.google.com', emoji: '📅' },
            { id: 3, name: 'NOTES', url: 'https://keep.google.com', emoji: '📝' },
            { id: 4, name: 'DRIVE', url: 'https://drive.google.com', emoji: '💾' },
            { id: 5, name: 'GITHUB', url: 'https://github.com', emoji: '🐙' },
            { id: 6, name: 'APPLE MUSIC', url: 'https://music.apple.com', emoji: '🎵' }
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
        item.innerHTML = `
            <div class="shortcut-emoji">${shortcut.emoji}</div>
            <div class="shortcut-name">${escapeHtml(shortcut.name)}</div>
            <button class="shortcut-delete">×</button>
        `;

        item.querySelector('.shortcut-delete').addEventListener('click', (e) => {
            e.preventDefault();
            deleteShortcut(shortcut.id);
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
// EMAIL
// ========================================

function initializeEmail() {
    const addEmailBtn = document.getElementById('addEmailBtn');
    const subjectInput = document.getElementById('emailSubject');

    addEmailBtn.addEventListener('click', addEmail);
    subjectInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addEmail();
    });

    // Add sample emails if none exist
    if (state.emails.length === 0) {
        state.emails = [
            { id: 1, subject: 'Welcome to Pixel Dashboard!', from: 'System', unread: true },
            { id: 2, subject: 'Your tasks are waiting', from: 'Reminder', unread: true }
        ];
        saveToLocalStorage();
    }

    renderEmails();
}

function addEmail() {
    const subject = document.getElementById('emailSubject').value.trim();
    const from = document.getElementById('emailFrom').value.trim();

    if (subject === '' || from === '') {
        return;
    }

    const email = {
        id: Date.now(),
        subject,
        from,
        unread: true
    };

    state.emails.unshift(email);
    document.getElementById('emailSubject').value = '';
    document.getElementById('emailFrom').value = '';

    saveToLocalStorage();
    renderEmails();
}

function toggleEmailRead(id) {
    const email = state.emails.find(e => e.id === id);
    if (email) {
        email.unread = !email.unread;
        saveToLocalStorage();
        renderEmails();
    }
}

function renderEmails() {
    const list = document.getElementById('emailList');
    list.innerHTML = '';

    if (state.emails.length === 0) {
        list.innerHTML = '<li style="text-align: center; padding: 20px; opacity: 0.5;">No messages yet!</li>';
        return;
    }

    state.emails.slice(0, 10).forEach(email => {
        const li = document.createElement('li');
        li.className = `email-item ${email.unread ? 'unread' : ''}`;
        li.innerHTML = `
            <div class="email-subject">${escapeHtml(email.subject)}</div>
            <div class="email-from">From: ${escapeHtml(email.from)}</div>
        `;

        li.addEventListener('click', () => toggleEmailRead(email.id));
        list.appendChild(li);
    });
}

// ========================================
// QUOTE
// ========================================

function initializeQuote() {
    document.getElementById('newQuoteBtn').addEventListener('click', updateQuote);
}

function updateQuote() {
    const quotes = [
        "Every pixel counts!",
        "You're doing great! ✨",
        "Keep pushing forward!",
        "Small steps, big progress!",
        "Believe in your pixels!",
        "Your potential is infinite!",
        "Make today amazing!",
        "Dream in pixels! 🌟",
        "Stay cute, stay productive!",
        "Level up your life!",
        "Pixel perfect vibes!",
        "You're a productivity star!",
        "Kawaii productivity! 💖",
        "Retro vibes, modern goals!",
        "8-bit dreams, HD results!"
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.querySelector('.pixel-quote').textContent = `"${randomQuote}"`;

    // Add bounce animation
    const quoteContainer = document.querySelector('.quote-container');
    quoteContainer.classList.add('bounce');
    setTimeout(() => quoteContainer.classList.remove('bounce'), 500);
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
    const minutes = activePreset ? parseInt(activePreset.dataset.minutes) : 25;
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
// CONSOLE MESSAGE
// ========================================

console.log('%c✨ PIXEL DASHBOARD ✨', 'font-size: 24px; font-weight: bold; color: #FFB3D9; text-shadow: 2px 2px 0 #D4B3FF;');
console.log('%cMade with 💖 and pixels!', 'font-size: 14px; color: #B3F5E8;');
console.log('%cTry the Konami Code for a surprise! ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA', 'font-size: 12px; color: #FFF5B3;');
