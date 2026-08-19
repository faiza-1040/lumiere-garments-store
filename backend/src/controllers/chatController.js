const { chatWithAssistant } = require('../services/aiService');

const handleChat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'messages array is required' });
    }

    const { reply, products, actions } = await chatWithAssistant(messages);
    res.json({ reply, products, actions });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      message: "Sorry, I'm having trouble right now. Please try again shortly.",
    });
  }
};

module.exports = { handleChat };