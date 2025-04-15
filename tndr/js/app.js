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
    
    // Инициализация профиля сразу при загрузке, если мы уже на вкладке профиля
    const profileTab = document.querySelector('.tab-item[data-target="profile"]');
    if (profileTab && profileTab.classList.contains('active')) {
        triggerProfileAnimations();
    }
    
    // Отладочное сообщение для подтверждения инициализации
    console.log('Приложение инициализировано');
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
            
            // Если это вкладка профиля, запускаем анимации
            if (targetId === 'profile') {
                // Таймаут даёт время DOM обновиться перед запуском анимаций
                setTimeout(() => {
                    triggerProfileAnimations();
                    // Отладочное сообщение
                    console.log('Анимации профиля запущены');
                }, 100);
            }
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
function showNotification(message, type = 'default') {
    // Проверяем, нет ли уже уведомления
    let notification = document.querySelector('.notification');
    if (notification) {
        notification.remove();
    }
    
    // Создаем новое уведомление
    notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Добавляем стили для разных типов уведомлений, если их нет в CSS
    if (!document.querySelector('style#notification-style-enhanced')) {
        const style = document.createElement('style');
        style.id = 'notification-style-enhanced';
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
                animation: fadeInOutEnhanced 3s forwards;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            .notification.achievement {
                background: linear-gradient(90deg, rgba(77, 159, 255, 0.9), rgba(117, 85, 255, 0.9));
                border: 1px solid rgba(77, 159, 255, 0.5);
                box-shadow: 0 5px 20px rgba(77, 159, 255, 0.3);
                animation: achievementNotify 3s forwards;
            }
            
            .notification.success {
                background: linear-gradient(90deg, rgba(9, 230, 130, 0.9), rgba(34, 229, 221, 0.9));
                border: 1px solid rgba(9, 230, 130, 0.5);
                box-shadow: 0 5px 20px rgba(9, 230, 130, 0.3);
            }
            
            @keyframes fadeInOutEnhanced {
                0% { opacity: 0; transform: translate(-50%, 20px); }
                10% { opacity: 1; transform: translate(-50%, 0); }
                80% { opacity: 1; transform: translate(-50%, 0); }
                100% { opacity: 0; transform: translate(-50%, -20px); }
            }
            
            @keyframes achievementNotify {
                0% { opacity: 0; transform: translate(-50%, 20px) scale(0.9); }
                10% { opacity: 1; transform: translate(-50%, 0) scale(1); }
                20% { transform: translate(-50%, 0) scale(1.05); }
                30% { transform: translate(-50%, 0) scale(1); }
                80% { opacity: 1; transform: translate(-50%, 0); }
                100% { opacity: 0; transform: translate(-50%, -20px); }
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
    const goalItems = document.querySelectorAll('.goal-item');
    
    goalItems.forEach(item => {
        const progressBar = item.querySelector('.goal-fill');
        if (progressBar) {
            // Эмуляция различного прогресса для разных целей
            const randomProgress = Math.floor(Math.random() * 100);
            progressBar.style.width = `${randomProgress}%`;
        }
    });
}

function handleProfileAction(action) {
    switch (action) {
        case 'share':
            // Анимация кнопки
            const shareButton = document.querySelector('.action-button[data-action="share"]');
            if (shareButton) {
                shareButton.classList.add('pulse-effect');
                setTimeout(() => shareButton.classList.remove('pulse-effect'), 500);
            }
            
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
                            showNotification('Профиль скопирован для отправки', 'success');
                            
                            // Добавляем XP с анимацией
                            const xpFill = document.querySelector('.xp-fill');
                            const xpText = document.querySelector('.xp-text');
                            
                            if (xpFill && xpText) {
                                const currentXP = parseInt(xpText.textContent.split('/')[0]);
                                const maxXP = parseInt(xpText.textContent.split('/')[1]);
                                const newXP = Math.min(currentXP + 10, maxXP);
                                const percentage = (newXP / maxXP) * 100;
                                
                                xpFill.style.transition = 'width 0.5s ease';
                                xpFill.style.width = `${percentage}%`;
                                xpText.textContent = `${newXP}/${maxXP} XP`;
                                
                                // Анимация +XP над кнопкой
                                const flyingXP = document.createElement('div');
                                flyingXP.textContent = '+10 XP';
                                flyingXP.style.position = 'absolute';
                                flyingXP.style.top = `${shareButton.offsetTop}px`;
                                flyingXP.style.left = `${shareButton.offsetLeft + shareButton.offsetWidth/2}px`;
                                flyingXP.style.color = '#22e5dd';
                                flyingXP.style.fontWeight = 'bold';
                                flyingXP.style.zIndex = '100';
                                flyingXP.style.transform = 'translateY(0)';
                                flyingXP.style.opacity = '1';
                                flyingXP.style.transition = 'all 1s ease';
                                
                                document.querySelector('.profile-container-minimal').appendChild(flyingXP);
                                
                                setTimeout(() => {
                                    flyingXP.style.transform = 'translateY(-30px)';
                                    flyingXP.style.opacity = '0';
                                    setTimeout(() => flyingXP.remove(), 1000);
                                }, 100);
                            }
                        }
                    });
                } catch (e) {
                    showNotification('Профиль скопирован для отправки', 'success');
                }
            } else {
                showNotification('Профиль скопирован для отправки', 'success');
            }
            break;
            
        case 'edit':
            showNotification('Редактирование профиля будет доступно в ближайшее время');
            
            // Эффект для аватара при клике на редактирование
            const avatar = document.querySelector('.profile-avatar');
            if (avatar) {
                avatar.style.transition = 'all 0.3s ease';
                avatar.style.boxShadow = '0 0 20px rgba(77, 159, 255, 0.8)';
                avatar.style.transform = 'scale(1.05)';
                
                setTimeout(() => {
                    avatar.style.boxShadow = '';
                    avatar.style.transform = '';
                }, 500);
            }
            break;
            
        default:
            break;
    }
}

function showAchievementAnimation() {
    const achievementsList = document.querySelector('.achievements-list');
    const achievements = document.querySelectorAll('.achievement-item');
    
    // Анимируем каждое достижение по очереди
    achievements.forEach((achievement, index) => {
        setTimeout(() => {
            achievement.style.transform = 'scale(1.1)';
            
            // Добавляем свечение для иконки
            const icon = achievement.querySelector('.achievement-icon');
            if (icon) {
                icon.style.boxShadow = '0 0 20px rgba(77, 159, 255, 0.8)';
            }
            
            // Возвращаем в нормальное состояние
            setTimeout(() => {
                achievement.style.transform = '';
                if (icon) {
                    icon.style.boxShadow = '';
                }
            }, 300);
        }, index * 150);
    });
    
    showNotification('Просмотр всех достижений будет доступен скоро');
}

function addExperiencePoints(points, showAnimation = false) {
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
            
            // Если нужна анимация, создаем летящий текст с XP
            if (showAnimation) {
                const flyingXP = document.createElement('div');
                flyingXP.className = 'flying-xp';
                flyingXP.textContent = `+${points} XP`;
                document.body.appendChild(flyingXP);
                
                // Позиционируем летящий текст над иконкой профиля
                const profileTab = document.querySelector('.tab-item[data-target="profile"]');
                if (profileTab) {
                    const rect = profileTab.getBoundingClientRect();
                    flyingXP.style.left = `${rect.left + rect.width/2}px`;
                    flyingXP.style.top = `${rect.top}px`;
                    
                    // Анимируем движение текста
                    setTimeout(() => {
                        flyingXP.style.opacity = '0';
                        flyingXP.style.transform = 'translateY(-50px)';
                        
                        // Удаляем элемент после анимации
                        setTimeout(() => {
                            document.body.removeChild(flyingXP);
                        }, 500);
                    }, 100);
                }
            }
            
            // Добавляем стили для летящего XP, если их еще нет
            if (!document.querySelector('style#flying-xp-style')) {
                const style = document.createElement('style');
                style.id = 'flying-xp-style';
                style.textContent = `
                    .flying-xp {
                        position: fixed;
                        transform: translateY(0);
                        opacity: 1;
                        color: #22e5dd;
                        font-weight: bold;
                        font-size: 16px;
                        z-index: 9999;
                        transition: all 0.5s ease-out;
                        text-shadow: 0 0 5px rgba(34, 229, 221, 0.7);
                    }
                    
                    .pulse-effect {
                        animation: pulseButton 0.5s;
                    }
                    
                    @keyframes pulseButton {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                        100% { transform: scale(1); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Анимируем заполнение
            xpFill.style.transition = 'width 0.7s ease-in-out';
            xpFill.style.width = `${percentage}%`;
            
            // Обновляем текст
            xpText.textContent = `${newXP}/${maxXP} XP`;
            
            // Показываем уведомление
            if (!showAnimation) {
                showNotification(`+${points} XP получено!`);
            }
            
            // Если достигнут максимум, можно выполнить повышение уровня
            if (newXP >= maxXP) {
                setTimeout(() => {
                    levelUp();
                }, 1000);
            }
        }
    }
}

function levelUp() {
    const levelBadge = document.querySelector('.level-badge');
    const xpText = document.querySelector('.xp-text');
    const xpFill = document.querySelector('.xp-fill');
    
    if (levelBadge && xpText && xpFill) {
        // Получаем текущий уровень (например, из "Уровень 8")
        const levelText = levelBadge.textContent;
        const currentLevel = parseInt(levelText.replace(/\D/g, ''));
        
        if (!isNaN(currentLevel)) {
            // Создаем яркий эффект для профиля
            const profileContainer = document.querySelector('.profile-container');
            if (profileContainer) {
                profileContainer.style.boxShadow = '0 0 50px rgba(34, 229, 221, 0.5)';
                setTimeout(() => {
                    profileContainer.style.boxShadow = '';
                }, 2000);
            }
            
            // Увеличиваем уровень с эффектом
            levelBadge.style.transform = 'scale(1.3)';
            levelBadge.style.boxShadow = '0 0 30px rgba(77, 159, 255, 0.8)';
            
            setTimeout(() => {
                // Увеличиваем уровень
                const newLevel = currentLevel + 1;
                levelBadge.textContent = `Уровень ${newLevel}`;
                
                // Сбрасываем XP
                xpFill.style.transition = 'width 0.3s ease-in-out';
                xpFill.style.width = '0%';
                xpText.textContent = `0/1000 XP`;
                
                // Возвращаем стиль
                setTimeout(() => {
                    levelBadge.style.transform = '';
                    levelBadge.style.boxShadow = '';
                }, 300);
                
                // Показываем уведомление о повышении уровня
                showNotification(`Поздравляем! Вы достигли уровня ${newLevel}!`);
                
                // Разблокируем новые функции уровня через уведомление
                setTimeout(() => {
                    showNotification('Разблокированы новые функции!');
                }, 1500);
            }, 800);
        }
    }
}

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
        
        // Добавляем в список с эффектом появления
        newAchievement.style.opacity = '0';
        newAchievement.style.transform = 'translateY(20px)';
        achievementsList.appendChild(newAchievement);
        
        // Анимируем появление
        setTimeout(() => {
            newAchievement.style.transition = 'all 0.5s ease';
            newAchievement.style.opacity = '1';
            newAchievement.style.transform = '';
            
            // Добавляем пульсацию
            const icon = newAchievement.querySelector('.achievement-icon');
            if (icon) {
                icon.style.boxShadow = '0 0 30px rgba(77, 159, 255, 0.8)';
                setTimeout(() => {
                    icon.style.boxShadow = '';
                }, 1500);
            }
        }, 100);
        
        // Показываем уведомление
        showNotification(`Новое достижение: ${name}`, 'achievement');
        
        // Даем XP за достижение
        addExperiencePoints(100, true);
    }
}

// Устанавливает CSS-переменные для всех прогресс-баров
function setProgressBarVariables() {
    // Устанавливаем переменные для целей
    const goalItems = document.querySelectorAll('.goal-item');
    goalItems.forEach(item => {
        const progressText = item.querySelector('.goal-progress');
        const progressFill = item.querySelector('.goal-fill');
        
        if (progressText && progressFill && progressText.textContent.includes('%')) {
            const percentage = parseInt(progressText.textContent);
            if (!isNaN(percentage)) {
                progressFill.style.setProperty('--goal-progress', `${percentage}%`);
            }
        }
    });
}

// Анимация иконок достижений
function animateAchievementIcons() {
    const icons = document.querySelectorAll('.achievement-icon');
    
    // Устанавливаем разное время анимации для иконок
    icons.forEach((icon, index) => {
        const gradients = [
            'linear-gradient(135deg, #FFD700, #FFA500)',
            'linear-gradient(135deg, #C0C0C0, #A9A9A9)',
            'linear-gradient(135deg, #CD7F32, #8B4513)',
            'linear-gradient(135deg, #4d9fff, #7555ff)'
        ];
        
        if (index < gradients.length) {
            icon.style.backgroundImage = gradients[index];
            icon.style.animationDelay = `${index * 0.2}s`;
        }
    });
}

// Анимация для элементов статистики
function animateStatItems() {
    const statItems = document.querySelectorAll('.stat-item');
    
    statItems.forEach((item, index) => {
        // Добавляем задержку для последовательной анимации
        setTimeout(() => {
            item.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                item.style.transform = '';
            }, 300);
        }, index * 200);
    });
}

// Обновление прогресс-бара опыта с эффектами
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
            
            // Анимация заполнения
            xpFill.style.width = '0%';
            setTimeout(() => {
                xpFill.style.transition = 'width 1s ease-in-out';
                xpFill.style.width = `${percentage}%`;
            }, 200);
        }
    }
}

// Обновление социального рейтинга с анимацией
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
            
            // Анимация заполнения
            ratingFill.style.width = '0%';
            setTimeout(() => {
                ratingFill.style.transition = 'width 1.2s ease-in-out';
                ratingFill.style.width = `${percentage}%`;
            }, 400);
        }
    }
}

// Обновление прогресса целей с анимацией
function updateGoalProgress() {
    const goalItems = document.querySelectorAll('.goal-item');
    
    goalItems.forEach((item, index) => {
        const progressText = item.querySelector('.goal-progress');
        const progressFill = item.querySelector('.goal-fill');
        
        if (progressText && progressFill && progressText.textContent.includes('%')) {
            const percentage = parseInt(progressText.textContent);
            if (!isNaN(percentage)) {
                // Анимация заполнения с задержкой
                progressFill.style.width = '0%';
                setTimeout(() => {
                    progressFill.style.transition = 'width 1s ease-in-out';
                    progressFill.style.width = `${percentage}%`;
                    progressFill.style.setProperty('--goal-progress', `${percentage}%`);
                }, 600 + (index * 200));
            }
        }
    });
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
                setTimeout(triggerProfileAnimations, 100);
            }
        });
    });
    
    // Инициализируем профиль, если он открыт сразу
    const profileSection = document.getElementById('profile');
    if (profileSection && !profileSection.classList.contains('hidden')) {
        setTimeout(triggerProfileAnimations, 100);
    }
});

/**
 * Запускает все анимации профиля принудительно
 */
function triggerProfileAnimations() {
    console.log('Запуск анимаций профиля');
    
    // Принудительно установить прогресс баров в ноль перед анимацией
    const xpFill = document.querySelector('.xp-fill');
    const ratingFill = document.querySelector('.rating-fill');
    const goalFills = document.querySelectorAll('.goal-fill');
    
    if (xpFill) xpFill.style.width = '0%';
    if (ratingFill) ratingFill.style.width = '0%';
    goalFills.forEach(fill => fill.style.width = '0%');
    
    // Небольшая пауза для перерисовки DOM
    setTimeout(() => {
        // Анимация элементов профиля
        animateProfileElements();
        
        // Добавление слушателей событий для кнопок профиля
        setupProfileButtons();
    }, 100);
}

/**
 * Анимирует элементы профиля
 */
function animateProfileElements() {
    // Анимация шапки профиля
    const avatar = document.querySelector('.profile-avatar');
    const profileName = document.querySelector('.profile-name');
    const levelInfo = document.querySelector('.profile-level-info');
    
    if (avatar) {
        avatar.style.opacity = '0';
        avatar.style.transform = 'scale(0.8)';
        setTimeout(() => {
            avatar.style.transition = 'all 0.5s ease';
            avatar.style.opacity = '1';
            avatar.style.transform = 'scale(1)';
        }, 100);
    }
    
    if (profileName) {
        profileName.style.opacity = '0';
        profileName.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            profileName.style.transition = 'all 0.5s ease';
            profileName.style.opacity = '1';
            profileName.style.transform = 'translateY(0)';
        }, 200);
    }
    
    if (levelInfo) {
        levelInfo.style.opacity = '0';
        setTimeout(() => {
            levelInfo.style.transition = 'all 0.5s ease';
            levelInfo.style.opacity = '1';
        }, 300);
    }
    
    // Анимация XP бара
    const xpFill = document.querySelector('.xp-fill');
    if (xpFill) {
        setTimeout(() => {
            xpFill.style.transition = 'width 1s ease-out';
            xpFill.style.width = '65%';
        }, 500);
    }
    
    // Анимация блоков контента
    const statsCards = document.querySelectorAll('.profile-stats-card, .stat-card, .achievements-minimal');
    statsCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 400 + (index * 100));
    });
    
    // Анимация рейтинга
    const ratingFill = document.querySelector('.rating-fill');
    if (ratingFill) {
        setTimeout(() => {
            ratingFill.style.transition = 'width 1s ease-out';
            ratingFill.style.width = '78%';
        }, 600);
    }
    
    // Анимация целей
    const goalFills = document.querySelectorAll('.goal-fill');
    goalFills.forEach((fill, index) => {
        const width = fill.style.width || '0%';
        fill.style.width = '0%';
        setTimeout(() => {
            fill.style.transition = 'width 0.8s ease-out';
            fill.style.width = width;
        }, 700 + (index * 150));
    });
    
    // Анимация кнопок действий
    const actionButtons = document.querySelectorAll('.action-button');
    actionButtons.forEach((button, index) => {
        button.style.opacity = '0';
        button.style.transform = 'translateY(10px)';
        setTimeout(() => {
            button.style.transition = 'all 0.5s ease';
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, 900 + (index * 100));
    });
    
    // Анимация достижений (с задержкой)
    setTimeout(() => {
        const achievements = document.querySelectorAll('.achievements-minimal .achievement-item');
        achievements.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(15px)';
            setTimeout(() => {
                item.style.transition = 'all 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 800);
}

/**
 * Устанавливает обработчики событий для элементов профиля
 */
function setupProfileButtons() {
    // Очистка и добавление обработчиков для кнопок
    const actionButtons = document.querySelectorAll('.action-button');
    actionButtons.forEach(button => {
        // Удаляем существующие обработчики
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Добавляем новые обработчики
        newButton.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            console.log('Кнопка нажата:', action);
            
            // Эффект нажатия
            this.style.transform = 'scale(0.95)';
            setTimeout(() => this.style.transform = '', 150);
            
            // Запуск соответствующего действия
            handleProfileAction(action);
        });
    });
    
    // Обработчики для достижений
    const achievementItems = document.querySelectorAll('.achievements-minimal .achievement-item');
    achievementItems.forEach(item => {
        // Клонируем элемент для очистки обработчиков
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        // Добавляем новые обработчики
        newItem.addEventListener('click', function() {
            const achievementName = this.querySelector('span').textContent;
            
            // Эффект нажатия
            this.style.transform = 'scale(1.1)';
            setTimeout(() => this.style.transform = '', 300);
            
            // Показываем уведомление
            showNotification(`Достижение: ${achievementName}`, 'achievement');
        });
    });
} 