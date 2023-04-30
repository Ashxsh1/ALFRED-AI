$(document).ready(() => {
  const messageList = $('.message-list');
  const messageForm = $('.message-form');
  const messageHistory = [];

  messageForm.submit(async (event) => {
    event.preventDefault();
    const messageInput = $('input[name="message"]');
    const message = messageInput.val().trim();
    if (!message) {
      return;
    }
    messageInput.val('');
    addMessage('user', message);
    const newHistory = await sendMessage(message, messageHistory);
    messageHistory.push(...newHistory);
  });
  


function addMessage(sender, message) {
  const li = $('<li></li>');
  li.addClass(`${sender}-message`);
  li.text(message);
  messageList.append(li);
  messageList.scrollTop(messageList.prop('scrollHeight'));
  messageHistory.push({ sender, message });
}

  async function sendMessage(message, history) {
    try {
      const response = await axios.post('/chat', { message, history });
      const { message: reply, newHistory } = response.data;
      addMessage('bot', reply);
      return newHistory;
    } catch (error) {
      console.error(error);
      addMessage('bot', 'Sorry, I am not able to process your request.');
      return history;
    }
  }
  
  
});
