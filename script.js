const sendButton = document.getElementById('input-button');
const icon = document.getElementById('button-icon');
const userInput = document.getElementById('user-input');
const log = document.getElementById('chat-log');
const info = document.querySelector('.info');

const sendMessege = async () => {
    const messege = userInput.value.trim();
    if (messege === '') {
        return;
    } else if (messege.toLowerCase() === 'developer') {
        userInput.value = '';
        appendMessege('user', messege);
        setTimeout(() => {
            appendMessege('bot', 'This code is sourced to Abdulwasay');
            resetIcon();
        }, 2000);
        return;
    }
    
    appendMessege('user', messege);
    userInput.value = '';

    const apiKey = 'your api key';  // Replace with your OpenAI API key
    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: messege }]
        })
    };

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', option);
        if (!response.ok) {
            if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please try again later.');
            } else if (response.status === 401) {
                throw new Error('Unauthorized. Check your API key.');
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        const data = await response.json();
        appendMessege('bot', data.choices[0].message.content);
    } catch (err) {
        appendMessege('bot', 'Error: ' + err.message);
    } finally {
        resetIcon();
    }
}

const appendMessege = (sender, messege) => {
    info.style.display = 'none';
    updateIconToLoading();

    const messegeElement = document.createElement('div');
    const chatElement = document.createElement('div');
    const icon2Element = document.createElement('div');
    const icon2 = document.createElement('i');
    
    chatElement.classList.add('log');
    icon2Element.classList.add('icon2');
    messegeElement.classList.add(sender);
    messegeElement.innerText = messege;

    if (sender === 'user') {
        icon2.classList.add('fa-regular', 'fa-user');
        icon2Element.setAttribute('id', 'user-icon');
    } else {
        icon2.classList.add('fa-solid', 'fa-robot');
        icon2Element.setAttribute('id', 'bot-icon');
    }

    icon2Element.appendChild(icon2);
    chatElement.appendChild(icon2Element);
    chatElement.appendChild(messegeElement);
    log.appendChild(chatElement);
    log.scrollTop = log.scrollHeight;
}

const updateIconToLoading = () => {
    icon.classList.remove('fa-solid', 'fa-paper-plane');
    icon.classList.add('fas', 'fa-spinner', 'fa-pulse');
}

const resetIcon = () => {
    icon.classList.add('fa-solid', 'fa-paper-plane');
    icon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
}

sendButton.addEventListener('click', sendMessege);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessege();
    }
});