$(document).ready(() => {
  const messageList = $('.message-list');
  const messageForm = $('.message-form');

  messageForm.submit((event) => {
    event.preventDefault();
    const messageInput = $('input[name="message"]');
    const message = messageInput.val().trim();
    if (!message) {
      return;
    }
    messageInput.val('');
    addMessage('user', message);
    sendMessage(message);
  });

  function addMessage(sender, message) {
    const li = $('<li></li>');
    li.addClass(`${sender}-message`);
    li.text(message);
    messageList.append(li);
    messageList.scrollTop(messageList.prop('scrollHeight'));
  }

  async function sendMessage(message) {
    try {
      const response = await axios.post('/chat', { message });
      const { message: reply } = response.data;
      addMessage('bot', reply);
    } catch (error) {
      console.error(error);
      addMessage('bot', 'Sorry, I am not able to process your request.');
    }
  }
  
});
