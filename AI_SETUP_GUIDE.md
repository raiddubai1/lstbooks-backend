# AI Study Assistant Setup Guide

## 🤖 OpenAI API Integration

The AI Study Assistant now uses **OpenAI's GPT-4o-mini** model to provide real, intelligent responses to student questions.

---

## 📋 Prerequisites

You need an **OpenAI API key** to enable the AI features.

---

## 🔑 How to Get Your OpenAI API Key

### Step 1: Create an OpenAI Account
1. Go to [https://platform.openai.com/signup](https://platform.openai.com/signup)
2. Sign up with your email or Google/Microsoft account
3. Verify your email address

### Step 2: Add Payment Method
1. Go to [https://platform.openai.com/account/billing](https://platform.openai.com/account/billing)
2. Click "Add payment method"
3. Add a credit/debit card
4. **Note**: OpenAI charges based on usage (pay-as-you-go)

### Step 3: Generate API Key
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Give it a name (e.g., "lstBooks AI Assistant")
4. **IMPORTANT**: Copy the key immediately - you won't be able to see it again!
5. Store it securely

### Step 4: Add API Key to Your Project
1. Open `backend/.env` file
2. Replace `your_openai_api_key_here` with your actual API key:
   ```
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. Save the file
4. Restart your backend server

---

## 💰 Pricing Information

**GPT-4o-mini** (Current model used):
- **Input**: $0.150 per 1M tokens (~750,000 words)
- **Output**: $0.600 per 1M tokens (~750,000 words)

**Estimated costs for typical usage**:
- 100 student questions/day ≈ $0.50 - $2.00/day
- 1,000 student questions/day ≈ $5.00 - $20.00/day

**Cost-saving tips**:
- Set usage limits in OpenAI dashboard
- Monitor usage regularly
- The system already limits responses to 1000 tokens max

---

## 🔧 Configuration Options

### Change AI Model

In `backend/services/aiService.js`, line 98, you can change the model:

```javascript
model: 'gpt-4o-mini', // Current: Fast and cheap
// model: 'gpt-4o',    // Better quality, higher cost
// model: 'gpt-3.5-turbo', // Cheaper, lower quality
```

### Adjust Response Quality

In `backend/services/aiService.js`, line 99-101:

```javascript
temperature: 0.7,    // 0.0 = focused, 1.0 = creative
max_tokens: 1000,    // Maximum response length
```

---

## ✅ Testing the Integration

### Method 1: Use the Health Check Endpoint

```bash
# Make sure you're logged in and have a valid token
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/ai-chat/health
```

**Expected response if working**:
```json
{
  "status": "healthy",
  "message": "AI service is working correctly"
}
```

**If API key is missing**:
```json
{
  "status": "not_configured",
  "message": "OpenAI API key is not configured"
}
```

### Method 2: Test in the Application

1. Go to the AI Study Assistant page
2. Create a new chat
3. Ask a question like: "What is dental caries?"
4. You should get a detailed, intelligent response

---

## 🛡️ Security Best Practices

1. **Never commit your API key to Git**
   - The `.env` file is already in `.gitignore`
   - Never share your API key publicly

2. **Set usage limits**
   - Go to OpenAI dashboard → Usage limits
   - Set monthly spending limits

3. **Monitor usage**
   - Check [https://platform.openai.com/usage](https://platform.openai.com/usage) regularly
   - Set up email alerts for high usage

4. **Rotate keys regularly**
   - Generate new API keys every few months
   - Delete old keys from OpenAI dashboard

---

## 🚨 Troubleshooting

### "AI service is currently unavailable"
- Check if `OPENAI_API_KEY` is set in `.env`
- Verify the API key is valid (not expired or deleted)
- Check if you have credits/payment method in OpenAI account

### "Rate limit exceeded"
- You've hit OpenAI's rate limits
- Wait a few minutes and try again
- Consider upgrading your OpenAI plan

### "Insufficient quota"
- Your OpenAI account has no credits
- Add a payment method or add credits

### API errors in logs
- Check backend console for detailed error messages
- Verify your API key starts with `sk-`
- Ensure you have internet connection

---

## 📊 Features Enabled

Once configured, students can:

✅ **Study Assistant**
- Ask questions about dental concepts
- Get detailed explanations
- Practice with examples
- Receive study tips

✅ **OSCE Coach** (Future)
- Practice clinical scenarios
- Get feedback on approach
- Improve communication skills

✅ **Case Generator** (Future)
- Generate realistic patient cases
- Practice diagnostic reasoning
- Discuss treatment options

---

## 🔄 Fallback Behavior

If the OpenAI API is not configured or fails:
- The system will return a friendly error message
- Students will be informed that AI is temporarily unavailable
- No crashes or errors - graceful degradation

---

## 📞 Support

If you need help:
1. Check OpenAI documentation: [https://platform.openai.com/docs](https://platform.openai.com/docs)
2. Review error logs in backend console
3. Test the health endpoint to diagnose issues

---

## 🎉 You're All Set!

Once you add your OpenAI API key and restart the server, your AI Study Assistant will be fully functional!

