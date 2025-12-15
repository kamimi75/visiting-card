// авторское сообщение в консоли
console.log('%c🚀 САЙТ РАЗМЕЩЕН НА GITHUB PAGES', 'color: #3498db; font-size: 16px; font-weight: bold;');
console.log('%c👨‍💻 Автор: [Камиль]', 'color: #2c3e50; font-size: 14px;');
console.log('%c📅 Дата создания: [14.12.2025]', 'color: #2c3e50; font-size: 14px;');
console.log('%c🔗 Репозиторий: https://github.com/[kamimi75]/[название-репозитория]', 'color: #2c3e50; font-size: 14px;');
console.log('%c🌐 Сайт: https://[ваш-логин].github.io/[название-репозитория]/', 'color: #3498db; font-size: 14px;');
console.log('%cℹ️ Это учебный проект с поддержкой HTTPS', 'color: #7f8c8d; font-size: 12px;');

const registrationForm = document.getElementById('registrationForm');
const usersTableBody = document.getElementById('usersTableBody');
const clearFormBtn = document.getElementById('clearForm');
const clearAllBtn = document.getElementById('clearAll');
const successModal = document.getElementById('successModal');
const closeModalBtn = document.getElementById('closeModal');
const closeModalX = document.querySelector('.close-modal');
const modalUserInfo = document.getElementById('modalUserInfo');
const emptyTableMessage = document.getElementById('emptyTableMessage');

const STORAGE_KEY = 'registeredUsers';

function loadUsers() {
    const usersJSON = localStorage.getItem(STORAGE_KEY);
    return usersJSON ? JSON.parse(usersJSON) : [];
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function renderUsers() {
    const users = loadUsers();
    usersTableBody.innerHTML = '';
    
    if (users.length === 0) {
        emptyTableMessage.style.display = 'flex';
        return;
    }
    
    emptyTableMessage.style.display = 'none';
    
    users.forEach((user, index) => {
        const row = document.createElement('tr');
        
        const protocolIcon = user.protocol === 'https' 
            ? '<i class="fas fa-lock" style="color: #27ae60;" title="Защищенное соединение (HTTPS)"></i>' 
            : '<i class="fas fa-unlock" style="color: #e74c3c;" title="Обычное соединение (HTTP)"></i>';
        
        const websiteCell = user.website 
            ? `<a href="${user.website}" target="_blank" style="color: #3498db; text-decoration: none;">${user.website}</a>`
            : '—';
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${protocolIcon} ${user.protocol.toUpperCase()}</td>
            <td>${user.mailProtocol.toUpperCase()}</td>
            <td>${websiteCell}</td>
            <td>${new Date(user.registrationDate).toLocaleDateString('ru-RU')}</td>
            <td>
                <button class="action-btn" onclick="deleteUser(${index})" title="Удалить">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        
        usersTableBody.appendChild(row);
    });
}

function addUser(user) {
    const users = loadUsers();
    users.push(user);
    saveUsers(users);
    renderUsers();
}

function deleteUser(index) {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
        const users = loadUsers();
        users.splice(index, 1);
        saveUsers(users);
        renderUsers();
    }
}

function validateForm(formData) {
    const errors = [];
    
    if (!formData.fullName.trim() || formData.fullName.trim().split(' ').length < 2) {
        errors.push('ФИО должно содержать хотя бы имя и фамилию');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        errors.push('Введите корректный email адрес');
    }
    
    const phoneRegex = /^(\+7|8)[\s(]?\d{3}[)\s]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        errors.push('Введите корректный номер телефона (формат: +7 XXX XXX XX XX)');
    }
    
    if (!formData.mailProtocol) {
        errors.push('Выберите протокол почтового сервера');
    }
    
    if (formData.website) {
        try {
            new URL(formData.website);
        } catch (e) {
            errors.push('Введите корректный URL веб-сайта');
        }
    }
    
    return errors;
}

registrationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const protocol = document.getElementById('protocolSelect').value;
    const websiteInput = document.getElementById('website').value.trim();
    const fullWebsite = websiteInput ? protocol + websiteInput : '';
    
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        website: fullWebsite,
        protocol: protocol.replace('://', ''), // сохраняем только http или https
        mailProtocol: document.getElementById('mailProtocol').value,
        registrationDate: new Date().toISOString()
    };
    
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        alert('Пожалуйста, исправьте ошибки:\n' + errors.join('\n'));
        return;
    }
    
    addUser(formData);
    
    modalUserInfo.innerHTML = `
        <strong>ФИО:</strong> ${formData.fullName}<br>
        <strong>Email:</strong> ${formData.email}<br>
        <strong>Телефон:</strong> ${formData.phone}<br>
        <strong>Веб-сайт:</strong> ${formData.website || 'не указан'}<br>
        <strong>Веб-протокол:</strong> ${formData.protocol.toUpperCase()}<br>
        <strong>Почтовый протокол:</strong> ${formData.mailProtocol.toUpperCase()}
    `;
    
    successModal.style.display = 'flex';
    
    registrationForm.reset();
    document.getElementById('protocolSelect').value = 'https://';
});

clearFormBtn.addEventListener('click', function() {
    if (confirm('