document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram WebApp
    const tg = window.Telegram.WebApp;
    tg.expand(); // Раскрываем на всю высоту
    
    // Адаптация к цветовой теме Telegram
    applyTelegramTheme();
    
    // Обработка навигации по таб-бару
    setupTabNavigation();
    
    // Обработка вложенных табов в разделе "Сообщество"
    setupCommunityTabs();
    
    // Инициализация ИИ Юриста
    setupAILawyer();
    
    // Инициализация данных (в реальном приложении данные будут загружаться с сервера)
    initMockData();
    
    // Устанавливаем обработчики событий для элементов приложения
    setupEventListeners();
    
    // Уведомляем Telegram, что приложение готово
    tg.ready();
    
    // Добавляем эффект блюра при скролле
    window.addEventListener('scroll', handleScroll);
    
    // Добавляем инициализацию геймификации профиля при загрузке страницы
    initProfileGameElements();
    
    // Инициализация профиля, если мы на вкладке профиля
    initializeProfile();
});

/**
 * Применяет эффект блюра при скролле
 */
function handleScroll() {
    const scrollPosition = window.scrollY;
    const sections = document.querySelectorAll('section:not(.hidden)');
    
    if (sections.length > 0) {
        const header = sections[0].querySelector('.section-header');
        if (header) {
            if (scrollPosition > 10) {
                header.style.backdropFilter = 'blur(10px)';
                header.style.backgroundColor = 'rgba(12, 18, 33, 0.8)';
                header.style.position = 'sticky';
                header.style.top = '0';
                header.style.zIndex = '10';
            } else {
                header.style.backdropFilter = 'none';
                header.style.backgroundColor = 'transparent';
                header.style.position = 'relative';
            }
        }
    }
}

/**
 * Применяет цветовую схему из Telegram WebApp к приложению
 */
function applyTelegramTheme() {
    const tg = window.Telegram.WebApp;
    
    // Получаем цвета из Telegram и применяем их к CSS переменным
    document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#0c1221');
    document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#e6eaf2');
    document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#8b93a8');
    document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#4d9fff');
    document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#4d9fff');
    document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff');
    
    // Производные цвета
    document.documentElement.style.setProperty('--primary-color', tg.themeParams.button_color || '#4d9fff');
    document.documentElement.style.setProperty('--secondary-color', lightenDarkenColor(tg.themeParams.button_color || '#4d9fff', 20));
}

/**
 * Настраивает интерфейс ИИ Юриста
 */
function setupAILawyer() {
    const siriOrb = document.querySelector('.siri-orb');
    const siriStatus = document.querySelector('.siri-status');
    const siriConversation = document.querySelector('.siri-conversation');
    const siriInput = document.querySelector('.siri-text-input');
    const siriSendBtn = document.querySelector('.siri-send-btn');
    const questionChips = document.querySelectorAll('.question-chip');
    
    if (siriOrb && siriStatus) {
        let isListening = false;
        
        // Обработчик нажатия на шар Siri
        siriOrb.addEventListener('click', function() {
            if (!isListening) {
                isListening = true;
                siriOrb.classList.add('listening');
                siriStatus.textContent = 'Слушаю вас...';
                
                // Имитация распознавания голоса (в реальном приложении здесь будет запись аудио)
                setTimeout(() => {
                    isListening = false;
                    siriOrb.classList.remove('listening');
                    siriStatus.textContent = 'Нажмите, чтобы активировать ИИ Юриста';
                    
                    // Имитируем вопрос пользователя
                    addMessageToConversation('Расскажи о требованиях к участникам тендера по 44-ФЗ', 'user');
                    
                    // Имитируем ответ системы (с эффектом печати)
                    simulateTypingResponse(`Согласно 44-ФЗ, к участникам закупки предъявляются следующие единые требования:

1. Соответствие требованиям законодательства РФ к лицам, осуществляющим поставку товара или оказание услуги;
2. Непроведение ликвидации и отсутствие банкротства;
3. Неприостановление деятельности;
4. Отсутствие недоимки по налогам и сборам;
5. Отсутствие судимости за экономические преступления у руководителя или главного бухгалтера;
6. Отсутствие в реестре недобросовестных поставщиков.

Заказчик вправе установить дополнительные требования, если это предусмотрено Правительством РФ.`);
                }, 2000);
            }
        });
        
        // Обработчик отправки сообщения через текстовое поле
        if (siriSendBtn && siriInput) {
            siriSendBtn.addEventListener('click', function() {
                sendMessage();
            });
            
            siriInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
            
            function sendMessage() {
                const message = siriInput.value.trim();
                if (message) {
                    addMessageToConversation(message, 'user');
                    siriInput.value = '';
                    
                    // Имитируем ответ системы с задержкой
                    simulateTypingResponse(generateAIResponse(message));
                }
            }
        }
        
        // Обработчики для чипов с вопросами
        if (questionChips) {
            questionChips.forEach(chip => {
                chip.addEventListener('click', function() {
                    const question = this.textContent;
                    addMessageToConversation(question, 'user');
                    simulateTypingResponse(generateAIResponse(question));
                    
                    // Прокручиваем к сообщению
                    const conversationContainer = document.querySelector('.siri-conversation-container');
                    if (conversationContainer) {
                        setTimeout(() => {
                            conversationContainer.scrollTop = conversationContainer.scrollHeight;
                        }, 100);
                    }
                });
            });
        }
    }
    
    // Добавляет сообщение в чат
    function addMessageToConversation(text, type) {
        if (siriConversation) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `siri-message ${type}`;
            messageDiv.innerHTML = `<p>${text}</p>`;
            siriConversation.appendChild(messageDiv);
            
            // Прокручиваем к новому сообщению
            const conversationContainer = document.querySelector('.siri-conversation-container');
            if (conversationContainer) {
                conversationContainer.scrollTop = conversationContainer.scrollHeight;
            }
        }
    }
    
    // Имитирует эффект печати ответа
    function simulateTypingResponse(text) {
        // Показываем индикатор печати
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'siri-message system typing';
        typingIndicator.innerHTML = `<p><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span></p>`;
        siriConversation.appendChild(typingIndicator);
        
        // Прокручиваем к индикатору печати
        const conversationContainer = document.querySelector('.siri-conversation-container');
        if (conversationContainer) {
            conversationContainer.scrollTop = conversationContainer.scrollHeight;
        }
        
        // Через случайную задержку заменяем индикатор на ответ
        setTimeout(() => {
            siriConversation.removeChild(typingIndicator);
            addMessageToConversation(text, 'system');
        }, 1500 + Math.random() * 1000);
    }
    
    // Генерирует ответ ИИ на основе вопроса (упрощенно для демо)
    function generateAIResponse(question) {
        const questionLower = question.toLowerCase();
        
        if (questionLower.includes('документы') && questionLower.includes('тендер')) {
            return `Для участия в тендере по 44-ФЗ необходимы следующие документы:

1. Заявка на участие в установленной форме
2. Копии учредительных документов
3. Выписка из ЕГРЮЛ/ЕГРИП (не старше 6 месяцев)
4. Документ, подтверждающий полномочия лица на осуществление действий от имени участника
5. Решение об одобрении сделки (при необходимости)
6. Документы, подтверждающие соответствие требованиям заказчика
7. Документы, подтверждающие квалификацию (при необходимости)

В каждом конкретном случае список может отличаться в зависимости от типа закупки.`;
        } else if (questionLower.includes('оспорить') && (questionLower.includes('результат') || questionLower.includes('аукцион'))) {
            return `Для оспаривания результатов аукциона следуйте такому алгоритму:

1. Подать жалобу в ФАС в течение 5 дней с момента размещения протокола рассмотрения заявок или подведения итогов
2. Указать в жалобе конкретные нарушения со ссылками на нормы закона
3. Приложить доказательства нарушений
4. Дождаться рассмотрения жалобы (в течение 5 рабочих дней)

Если решение ФАС вас не устроит, можно обратиться в арбитражный суд в течение 3 месяцев.`;
        } else if (questionLower.includes('срок') && questionLower.includes('44-фз')) {
            return `Основные сроки подачи заявок по 44-ФЗ:

• Электронный аукцион: не менее 7 дней (НМЦ ≤ 300 млн руб.) или 15 дней (НМЦ > 300 млн руб.)
• Конкурс: не менее 15 рабочих дней
• Запрос котировок: не менее 4 рабочих дней
• Запрос предложений: не менее 5 рабочих дней

Сроки исчисляются с момента размещения извещения в ЕИС.`;
        } else if (questionLower.includes('иностранн') && (questionLower.includes('поставщик') || questionLower.includes('ограничени'))) {
            return `Ограничения для иностранных поставщиков:

1. Запрет на закупку иностранной продукции для нужд обороны и безопасности (Постановление №9)
2. Запрет на закупку иностранного ПО для государственных и муниципальных нужд (Постановление №1236)
3. Правило "третий лишний" - отклонение заявок на поставку иностранных товаров при наличии двух заявок с товарами из ЕАЭС
4. Условия допуска - предоставление ценовой преференции в 15% товарам из ЕАЭС

Перечни товаров, попадающих под ограничения, регулярно обновляются.`;
        } else {
            return `По вашему вопросу о "${question}" я могу сказать следующее:

Каждая закупка по 44-ФЗ или 223-ФЗ имеет свои особенности. Для получения точной информации рекомендую ознакомиться с актуальной редакцией соответствующего закона и постановлениями Правительства РФ.

Если у вас есть конкретный вопрос о требованиях, сроках или процедурах, пожалуйста, уточните детали.`;
        }
    }
}

/**
 * Настраивает навигацию по таб-бару
 */
function setupTabNavigation() {
    const tabItems = document.querySelectorAll('.tab-item');
    
    tabItems.forEach(tab => {
        tab.addEventListener('click', function() {
            // Удаляем активный класс со всех табов
            tabItems.forEach(t => t.classList.remove('active'));
            
            // Добавляем активный класс текущему табу
            this.classList.add('active');
            
            // Получаем целевую секцию
            const targetId = this.getAttribute('data-target');
            
            // Скрываем все секции и показываем целевую
            document.querySelectorAll('section').forEach(section => {
                section.classList.add('hidden');
                section.classList.remove('active');
            });
            
            document.getElementById(targetId).classList.remove('hidden');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

/**
 * Настраивает вложенные табы в разделе "Сообщество"
 */
function setupCommunityTabs() {
    const tabs = document.querySelectorAll('.community-container .tab');
    const tabContents = document.querySelectorAll('.community-container .tab-content');
    
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', function() {
            // Удаляем активный класс со всех табов
            tabs.forEach(t => t.classList.remove('active'));
            
            // Добавляем активный класс текущему табу
            this.classList.add('active');
            
            // Скрываем все содержимое табов и показываем текущее
            tabContents.forEach(content => {
                content.classList.add('hidden');
                content.classList.remove('active');
            });
            
            if (index < tabContents.length) {
                tabContents[index].classList.remove('hidden');
                tabContents[index].classList.add('active');
            }
        });
    });
}

/**
 * Инициализирует обработчики событий для элементов приложения
 */
function setupEventListeners() {
    // Обработчик для кнопки поиска
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const searchInput = document.querySelector('.search-box input');
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                // В реальном приложении здесь будет запрос к API
                console.log('Поиск по запросу:', searchTerm);
                searchInput.value = '';
                
                // Показываем уведомление
                showNotification('Выполняется поиск тендеров...');
            }
        });
    }
    
    // Обработчик для кнопок фильтров
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // В реальном приложении здесь будет фильтрация результатов
        });
    });
    
    // Обработчик для кнопки проверки тендера в разделе "Антикор"
    const checkRiskButton = document.querySelector('.risk-analysis .btn-primary');
    if (checkRiskButton) {
        checkRiskButton.addEventListener('click', function() {
            const tenderInput = document.querySelector('.risk-analysis input');
            const tenderId = tenderInput.value.trim();
            
            if (tenderId) {
                // В реальном приложении здесь будет запрос к API
                console.log('Проверка тендера:', tenderId);
                
                // Анимация заполнения шкалы риска
                const meterValue = document.querySelector('.meter-value');
                meterValue.style.width = '0%';
                
                setTimeout(() => {
                    // Генерируем случайное значение для демо
                    const riskLevel = Math.floor(Math.random() * 100);
                    meterValue.style.width = `${riskLevel}%`;
                    
                    // Изменяем цвет в зависимости от значения
                    if (riskLevel < 30) {
                        meterValue.style.backgroundColor = 'var(--success-color)';
                    } else if (riskLevel < 70) {
                        meterValue.style.backgroundColor = 'var(--warning-color)';
                    } else {
                        meterValue.style.backgroundColor = 'var(--danger-color)';
                    }
                    
                    showNotification(`Риск манипуляции: ${riskLevel}%`);
                }, 500);
            }
        });
    }
    
    // Обработчик для кнопки "Создать заявку" в разделе совместных закупок
    const createCollabButton = document.querySelector('.collab-header .btn-primary');
    if (createCollabButton) {
        createCollabButton.addEventListener('click', function() {
            // В реальном приложении здесь будет форма создания заявки
            showNotification('Функция создания заявки будет доступна в ближайшее время');
        });
    }
    
    // Обработчики для кнопок взаимодействия в карточках тендеров
    document.querySelectorAll('.tender-footer .btn-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            const tenderCard = this.closest('.tender-card');
            const tenderTitle = tenderCard.querySelector('h3').textContent;
            
            // В реальном приложении здесь будет запрос к API
            showNotification(`Открываем подробную информацию по тендеру: ${tenderTitle}`);
        });
    });
    
    document.querySelectorAll('.tender-footer .btn-secondary').forEach(btn => {
        btn.addEventListener('click', function() {
            const tenderCard = this.closest('.tender-card');
            const tenderTitle = tenderCard.querySelector('h3').textContent;
            
            // В реальном приложении здесь будет запрос к API
            showNotification(`Анализируем тендер: ${tenderTitle}`);
        });
    });
    
    // Обработчики для кнопок лайков в разделе "Сообщество"
    document.querySelectorAll('.collab-actions .btn-like').forEach(btn => {
        btn.addEventListener('click', function() {
            const isRightButton = Array.from(this.closest('.collab-actions').children).indexOf(this) === 1;
            
            if (isRightButton) {
                // Показываем уведомление о совпадении
                showMatchAnimation();
            } else {
                // В реальном приложении здесь будет обработка отказа
                this.closest('.collab-card').style.opacity = '0.6';
                setTimeout(() => {
                    this.closest('.collab-card').style.display = 'none';
                }, 300);
            }
        });
    });
}

/**
 * Инициализирует демо-данные (в реальном приложении будут API запросы)
 */
function initMockData() {
    // Здесь могла бы быть инициализация данных с сервера
    // Для демо версии используем статические данные из HTML
}

/**
 * Показывает всплывающее уведомление
 * @param {string} message - Текст уведомления
 */
function showNotification(message) {
    // Проверяем, нет ли уже уведомления
    let notification = document.querySelector('.notification');
    if (notification) {
        notification.remove();
    }
    
    // Создаем новое уведомление
    notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Добавляем стили через JavaScript, если их нет в CSS
    if (!document.querySelector('style#notification-style')) {
        const style = document.createElement('style');
        style.id = 'notification-style';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 90px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(10, 15, 30, 0.9);
                color: white;
                padding: 12px 24px;
                border-radius: 50px;
                font-size: 14px;
                z-index: 1000;
                animation: fadeInOut 3s forwards;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, 20px); }
                10% { opacity: 1; transform: translate(-50%, 0); }
                80% { opacity: 1; transform: translate(-50%, 0); }
                100% { opacity: 0; transform: translate(-50%, -20px); }
            }
            
            .match-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(10, 15, 30, 0.95);
                backdrop-filter: blur(10px);
                z-index: 2000;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                animation: fadeIn 0.5s forwards;
                padding: 24px;
            }
            
            .match-text {
                font-size: 36px;
                font-weight: bold;
                margin-bottom: 20px;
                background: var(--gradient-accent);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-fill-color: transparent;
            }
            
            .match-description {
                font-size: 16px;
                margin-bottom: 30px;
                text-align: center;
                max-width: 80%;
                line-height: 1.6;
            }
            
            .match-buttons {
                display: flex;
                gap: 16px;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .typing-dots span {
                animation: typingDots 1.4s infinite both;
            }
            
            .typing-dots span:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            .typing-dots span:nth-child(3) {
                animation-delay: 0.4s;
            }
            
            @keyframes typingDots {
                0% { opacity: 0.3; }
                50% { opacity: 1; }
                100% { opacity: 0.3; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Показывает анимацию совпадения (как в Tinder)
 */
function showMatchAnimation() {
    // Создаем оверлей для анимации совпадения
    const matchOverlay = document.createElement('div');
    matchOverlay.className = 'match-overlay';
    
    matchOverlay.innerHTML = `
        <div class="match-text">Совпадение!</div>
        <div class="match-description">Представитель ООО "СервисТех" также заинтересован в совместном участии в закупке серверного оборудования</div>
        <div class="match-buttons">
            <button class="btn-primary">Написать</button>
            <button class="btn-secondary">Закрыть</button>
        </div>
    `;
    
    document.body.appendChild(matchOverlay);
    
    // Обработчики для кнопок
    const primaryButton = matchOverlay.querySelector('.btn-primary');
    const secondaryButton = matchOverlay.querySelector('.btn-secondary');
    
    primaryButton.addEventListener('click', function() {
        matchOverlay.remove();
        showNotification('Открываем чат...');
    });
    
    secondaryButton.addEventListener('click', function() {
        matchOverlay.remove();
    });
}

/**
 * Вспомогательная функция для осветления/затемнения цвета
 * @param {string} col - Цвет в формате HEX
 * @param {number} amt - Значение изменения (положительное - осветление, отрицательное - затемнение)
 * @returns {string} - Новый цвет в формате HEX
 */
function lightenDarkenColor(col, amt) {
    let usePound = false;
    
    if (col[0] === "#") {
        col = col.slice(1);
        usePound = true;
    }
    
    const num = parseInt(col, 16);
    
    let r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
}

// Функции для геймификации профиля
function initProfileGameElements() {
    updateExperienceBar();
    updateSocialRating();
    setupAchievements();
    updateGoalProgress();

    // Добавляем обработчики для профильных кнопок
    document.querySelectorAll('.profile-action').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleProfileAction(action);
        });
    });
}

function updateExperienceBar() {
    const xpFill = document.querySelector('.xp-fill');
    const xpText = document.querySelector('.xp-text');
    
    if (xpFill && xpText) {
        // Эмуляция прогресса уровня (в реальном приложении данные будут с сервера)
        const currentXP = 1250;
        const nextLevelXP = 2000;
        const percentage = (currentXP / nextLevelXP) * 100;
        
        xpFill.style.width = `${percentage}%`;
        xpText.textContent = `${currentXP} / ${nextLevelXP} XP`;
    }
}

function updateSocialRating() {
    const ratingFill = document.querySelector('.rating-fill');
    
    if (ratingFill) {
        // Эмуляция социального рейтинга
        const rating = 75; // от 0 до 100
        ratingFill.style.width = `${rating}%`;
    }
}

function setupAchievements() {
    // Анимация разблокированных достижений
    document.querySelectorAll('.achievement-item.unlocked').forEach(achievement => {
        achievement.addEventListener('mouseenter', function() {
            this.querySelector('.achievement-icon').style.boxShadow = '0 0 15px rgba(77, 159, 255, 0.7)';
        });
        
        achievement.addEventListener('mouseleave', function() {
            this.querySelector('.achievement-icon').style.boxShadow = 'none';
        });
    });
}

function updateGoalProgress() {
    const goalElements = document.querySelectorAll('.goal-item');
    
    goalElements.forEach(goalItem => {
        const progressBar = goalItem.querySelector('.goal-fill');
        if (progressBar) {
            // Эмуляция различного прогресса для разных целей
            const randomProgress = Math.floor(Math.random() * 100);
            progressBar.style.width = `${randomProgress}%`;
        }
    });
}

function handleProfileAction(action) {
    switch (action) {
        case 'settings':
            showNotification('Настройки профиля скоро будут доступны');
            break;
        case 'stats':
            showDetailedStats();
            break;
        default:
            break;
    }
}

function showDetailedStats() {
    // Создаем модальное окно с детальной статистикой
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Подробная статистика</h3>
                <button class="close-modal">×</button>
            </div>
            <div class="modal-body">
                <div class="stats-detail">
                    <h4>Активность в тендерах</h4>
                    <div class="stats-chart">
                        <div class="chart-bar" style="height: 80%"><span>80%</span></div>
                        <div class="chart-bar" style="height: 60%"><span>60%</span></div>
                        <div class="chart-bar" style="height: 90%"><span>90%</span></div>
                        <div class="chart-bar" style="height: 70%"><span>70%</span></div>
                        <div class="chart-bar" style="height: 50%"><span>50%</span></div>
                    </div>
                    <div class="chart-labels">
                        <span>Янв</span>
                        <span>Фев</span>
                        <span>Мар</span>
                        <span>Апр</span>
                        <span>Май</span>
                    </div>
                </div>
                <div class="stats-badges">
                    <h4>Ваши награды</h4>
                    <div class="badges-grid">
                        <div class="badge premium">Премиум</div>
                        <div class="badge verified">Проверен</div>
                        <div class="badge expert">Эксперт</div>
                        <div class="badge mentor">Наставник</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Добавляем обработчик для закрытия модального окна
    modal.querySelector('.close-modal').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Закрытие при клике вне содержимого
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Добавляем функции для геймификации
function updateExperiencePoints(points) {
    const xpFill = document.querySelector('.xp-fill');
    const xpText = document.querySelector('.xp-text');
    
    if (xpFill && xpText) {
        // Получаем текущие значения XP
        const currentXP = parseInt(xpText.textContent.split('/')[0].trim());
        const maxXP = parseInt(xpText.textContent.split('/')[1].trim());
        
        // Обновляем XP
        const newXP = Math.min(currentXP + points, maxXP);
        const percentage = (newXP / maxXP) * 100;
        
        // Анимируем заполнение
        xpFill.style.width = percentage + '%';
        xpText.textContent = `${newXP}/${maxXP} XP`;
        
        // Показываем уведомление
        showNotification(`+${points} XP получено!`, 'success');
        
        // Если достигнут максимум, можно выполнить повышение уровня
        if (newXP >= maxXP) {
            setTimeout(() => {
                levelUp();
            }, 1000);
        }
    }
}

function levelUp() {
    const levelBadge = document.querySelector('.level-badge');
    const xpText = document.querySelector('.xp-text');
    
    if (levelBadge && xpText) {
        // Увеличиваем уровень
        const currentLevel = parseInt(levelBadge.textContent);
        levelBadge.textContent = currentLevel + 1;
        
        // Сбрасываем XP
        const maxXP = parseInt(xpText.textContent.split('/')[1].trim());
        const newMaxXP = maxXP + 500; // Увеличиваем требуемый XP для следующего уровня
        
        xpText.textContent = `0/${newMaxXP} XP`;
        document.querySelector('.xp-fill').style.width = '0%';
        
        // Показываем уведомление о повышении уровня
        showMatchOverlay(`Поздравляем! Вы достигли уровня ${currentLevel + 1}!`, 'Новые возможности разблокированы!');
    }
}

function unlockAchievement(achievementId) {
    const achievement = document.getElementById(achievementId);
    
    if (achievement && !achievement.classList.contains('unlocked')) {
        achievement.classList.add('unlocked');
        achievement.querySelector('.achievement-icon').classList.remove('locked');
        
        // Показываем уведомление
        const title = achievement.querySelector('.achievement-title').textContent;
        showNotification(`Достижение разблокировано: ${title}`, 'achievement');
        
        // Даем XP за достижение
        updateExperiencePoints(100);
    }
}

function updateSocialRating(change) {
    const ratingValue = document.querySelector('.rating-value');
    const ratingFill = document.querySelector('.rating-fill');
    
    if (ratingValue && ratingFill) {
        const currentRating = parseInt(ratingValue.textContent);
        const newRating = Math.max(0, Math.min(100, currentRating + change));
        
        ratingValue.textContent = newRating;
        ratingFill.style.width = newRating + '%';
        
        // Обновляем описание в зависимости от рейтинга
        const ratingDesc = document.querySelector('.rating-description');
        if (ratingDesc) {
            if (newRating < 30) {
                ratingDesc.textContent = 'Начинающий';
            } else if (newRating < 60) {
                ratingDesc.textContent = 'Активный пользователь';
            } else if (newRating < 85) {
                ratingDesc.textContent = 'Эксперт';
            } else {
                ratingDesc.textContent = 'Лидер сообщества';
            }
        }
        
        // Показываем уведомление при значительном изменении
        if (Math.abs(change) >= 5) {
            const message = change > 0 ? 
                `Социальный рейтинг увеличен (+${change})` : 
                `Социальный рейтинг снижен (${change})`;
            showNotification(message, change > 0 ? 'success' : 'warning');
        }
    }
}

function updateGoalProgress(goalId, progress) {
    const goal = document.getElementById(goalId);
    
    if (goal) {
        const progressElement = goal.querySelector('.goal-progress');
        const fillElement = goal.querySelector('.goal-fill');
        
        if (progressElement && fillElement) {
            // Получаем текущий прогресс
            const current = parseInt(progressElement.textContent.split('/')[0].trim());
            const max = parseInt(progressElement.textContent.split('/')[1].trim());
            
            // Обновляем прогресс
            const newProgress = Math.min(current + progress, max);
            const percentage = (newProgress / max) * 100;
            
            progressElement.textContent = `${newProgress}/${max}`;
            fillElement.style.width = percentage + '%';
            
            // Если цель достигнута
            if (newProgress >= max && current < max) {
                showNotification('Цель выполнена!', 'success');
                updateExperiencePoints(50);
            }
        }
    }
}

// Инициализация модального окна статистики
function initStatsModal() {
    const statsButton = document.querySelector('.stats-button');
    const statsModal = document.querySelector('.stats-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (statsButton && statsModal && closeModal) {
        statsButton.addEventListener('click', () => {
            statsModal.classList.add('active');
        });
        
        closeModal.addEventListener('click', () => {
            statsModal.classList.remove('active');
        });
        
        // Закрытие модального окна при клике вне содержимого
        statsModal.addEventListener('click', (e) => {
            if (e.target === statsModal) {
                statsModal.classList.remove('active');
            }
        });
    }
}

// Функция инициализации профиля для Telegram Mini App
function initializeProfile() {
    // Установка данных профиля только если находимся на вкладке профиля
    const profileSection = document.getElementById('profile');
    if (!profileSection || profileSection.classList.contains('hidden')) {
        return; // Выходим, если не на странице профиля
    }
    
    // Инициализация прогресс-баров
    updateXPProgress();
    updateSocialRating();
    updateGoalProgress();
    
    // Привязка обработчиков к кнопкам действий
    const profileButtons = document.querySelectorAll('.profile-button');
    profileButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleProfileAction(action);
        });
    });
    
    // Привязка обработчиков к достижениям
    const achievementItems = document.querySelectorAll('.achievement-item');
    achievementItems.forEach(item => {
        item.addEventListener('click', function() {
            const name = this.querySelector('.achievement-name').textContent;
            showNotification(`Достижение: ${name}`);
        });
    });
}

// Обновление прогресс-бара опыта
function updateXPProgress() {
    const xpFill = document.querySelector('.xp-fill');
    const xpText = document.querySelector('.xp-text');
    
    if (xpFill && xpText) {
        // Получаем текущие значения из текста (например, "650/1000")
        const xpParts = xpText.textContent.split('/');
        if (xpParts.length === 2) {
            const currentXP = parseInt(xpParts[0]);
            const maxXP = parseInt(xpParts[1]);
            const percentage = Math.min(100, (currentXP / maxXP) * 100);
            
            // Устанавливаем ширину заполнения
            xpFill.style.width = `${percentage}%`;
        }
    }
}

// Обновление социального рейтинга
function updateSocialRating() {
    const ratingFill = document.querySelector('.rating-fill');
    const ratingValue = document.querySelector('.rating-value');
    
    if (ratingFill && ratingValue) {
        // Получаем текущее значение из текста (например, "78/100")
        const ratingParts = ratingValue.textContent.split('/');
        if (ratingParts.length === 2) {
            const currentRating = parseInt(ratingParts[0]);
            const maxRating = parseInt(ratingParts[1]);
            const percentage = Math.min(100, (currentRating / maxRating) * 100);
            
            // Устанавливаем ширину заполнения
            ratingFill.style.width = `${percentage}%`;
        }
    }
}

// Обновление прогресса целей
function updateGoalProgress() {
    const goalItems = document.querySelectorAll('.goal-item');
    
    goalItems.forEach(item => {
        const progressText = item.querySelector('.goal-progress');
        const progressFill = item.querySelector('.goal-fill');
        
        if (progressText && progressFill && progressText.textContent.includes('%')) {
            const percentage = parseInt(progressText.textContent);
            if (!isNaN(percentage)) {
                progressFill.style.width = `${percentage}%`;
            }
        }
    });
}

// Обработка действий профиля
function handleProfileAction(action) {
    switch (action) {
        case 'share':
            // Для Telegram Mini App можно использовать Telegram API
            if (window.Telegram && window.Telegram.WebApp) {
                try {
                    window.Telegram.WebApp.showPopup({
                        title: 'Поделиться профилем',
                        message: 'Хотите поделиться своим профилем с друзьями?',
                        buttons: [
                            {id: 'share', type: 'default', text: 'Поделиться'},
                            {id: 'cancel', type: 'cancel', text: 'Отмена'}
                        ]
                    }, function(buttonId) {
                        if (buttonId === 'share') {
                            showNotification('Профиль скопирован для отправки');
                        }
                    });
                } catch (e) {
                    showNotification('Профиль скопирован для отправки');
                }
            } else {
                showNotification('Профиль скопирован для отправки');
            }
            break;
            
        case 'edit':
            showNotification('Редактирование профиля будет доступно в ближайшее время');
            break;
            
        case 'achievements':
            showNotification('Полный список достижений будет доступен скоро');
            break;
            
        default:
            break;
    }
}

// Добавление небольшой анимации при получении опыта
function addExperiencePoints(points) {
    const xpFill = document.querySelector('.xp-fill');
    const xpText = document.querySelector('.xp-text');
    
    if (xpFill && xpText) {
        // Получаем текущие значения
        const xpParts = xpText.textContent.split('/');
        if (xpParts.length === 2) {
            const currentXP = parseInt(xpParts[0]);
            const maxXP = parseInt(xpParts[1]);
            
            // Новый опыт с проверкой на превышение максимума
            const newXP = Math.min(currentXP + points, maxXP);
            const percentage = (newXP / maxXP) * 100;
            
            // Анимируем заполнение
            xpFill.style.transition = 'width 0.5s ease-in-out';
            xpFill.style.width = `${percentage}%`;
            
            // Обновляем текст
            xpText.textContent = `${newXP}/${maxXP} XP`;
            
            // Показываем уведомление
            showNotification(`+${points} XP получено!`);
            
            // Если достигнут максимум, можно выполнить повышение уровня
            if (newXP >= maxXP) {
                setTimeout(() => {
                    levelUp();
                }, 1000);
            }
        }
    }
}

// Повышение уровня
function levelUp() {
    const levelBadge = document.querySelector('.level-badge');
    const xpText = document.querySelector('.xp-text');
    const xpFill = document.querySelector('.xp-fill');
    
    if (levelBadge && xpText && xpFill) {
        // Получаем текущий уровень (например, из "Уровень 8")
        const levelText = levelBadge.textContent;
        const currentLevel = parseInt(levelText.replace(/\D/g, ''));
        
        if (!isNaN(currentLevel)) {
            // Увеличиваем уровень
            const newLevel = currentLevel + 1;
            levelBadge.textContent = `Уровень ${newLevel}`;
            
            // Сбрасываем XP
            xpFill.style.transition = 'width 0.3s ease-in-out';
            xpFill.style.width = '0%';
            xpText.textContent = `0/1000 XP`;
            
            // Показываем уведомление о повышении уровня
            showNotification(`Поздравляем! Вы достигли уровня ${newLevel}!`);
        }
    }
}

// Разблокировка достижения
function unlockAchievement(name, description, icon, color) {
    const achievementsList = document.querySelector('.achievements-list');
    
    if (achievementsList) {
        // Создаем новый элемент достижения
        const newAchievement = document.createElement('div');
        newAchievement.className = 'achievement-item';
        newAchievement.innerHTML = `
            <div class="achievement-icon" style="background-color: ${color};">${icon}</div>
            <div class="achievement-info">
                <span class="achievement-name">${name}</span>
                <span class="achievement-desc">${description}</span>
            </div>
        `;
        
        // Добавляем в список
        achievementsList.appendChild(newAchievement);
        
        // Показываем уведомление
        showNotification(`Новое достижение: ${name}`);
        
        // Даем XP за достижение
        addExperiencePoints(100);
    }
}

// Добавление вызова инициализации профиля при загрузке страницы и смене таба
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем инициализацию профиля к существующим обработчикам
    const tabItems = document.querySelectorAll('.tab-item');
    
    tabItems.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            if (targetId === 'profile') {
                // Вызываем инициализацию с небольшой задержкой,
                // чтобы профиль успел отобразиться
                setTimeout(initializeProfile, 100);
            }
        });
    });
    
    // Инициализируем профиль, если он открыт сразу
    initializeProfile();
}); 