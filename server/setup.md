# Local Server Setup

## 1. Create Environment File

Create a `.env` file in the `server` directory with your Razorpay credentials:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here

# Server Configuration
PORT=5000
```

## 2. Start the Server

```bash
cd server
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

## 3. Test the Server

Visit: http://localhost:5000/health

You should see:
```json
{
  "status": "OK",
  "message": "Vibe Coding Server is running!"
}
```

## 4. Available Endpoints

- `GET /health` - Health check
- `POST /createOrder` - Create Razorpay order
- `POST /verifyPayment` - Verify payment signature
- `POST /createSubscriptionOrder` - Create subscription order
- `POST /createWebinarOrder` - Create webinar order
- `GET /razorpay-key` - Get Razorpay key for frontend

## 5. Frontend Configuration

Add to your React app's `.env` file:
```env
REACT_APP_SERVER_URL=http://localhost:5000
```
