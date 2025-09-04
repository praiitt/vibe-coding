# Vibe Coding Lifestyle - React Web App

A modern React web application for the Vibe Coding Lifestyle movement. This app showcases creative programming as a lifestyle choice with beautiful animations, interactive components, and a local database that can be easily connected to Firebase.

## 🚀 Features

- **Modern React Architecture** with functional components and hooks
- **Responsive Design** that works on all devices
- **Interactive Animations** using Framer Motion and CSS
- **Form Validation** with React Hook Form
- **Local Database** with localStorage (easily migratable to Firebase)
- **Analytics Tracking** for user interactions
- **Smooth Scrolling** navigation
- **Mobile-First** design approach
- **Lifestyle-Focused** content and branding

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Framer Motion** - Animation library
- **React Intersection Observer** - Scroll-based animations
- **Firebase** - Ready for backend integration
- **CSS3** - Modern styling with animations
- **Font Awesome** - Icons
- **Inter Font** - Typography

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vibe-coding-lifestyle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Navbar.js       # Navigation component
│   ├── Hero.js         # Hero section
│   ├── Features.js     # Features section
│   ├── Curriculum.js   # Curriculum section
│   ├── Pricing.js      # Pricing section
│   ├── Contact.js      # Contact form
│   ├── Footer.js       # Footer component
│   └── Notification.js # Notification component
├── hooks/              # Custom React hooks
│   └── useNotification.js
├── services/           # Database and API services
│   └── database.js     # Local database service
├── App.js              # Main app component
├── index.js            # React entry point
└── index.css           # Global styles
```

## 🗄️ Database Integration

### Local Database (Current)
The app currently uses a local database service that stores data in localStorage. This includes:
- Contact form submissions
- User registrations
- Subscription data
- Analytics tracking

### Firebase Integration (Ready)
The app is prepared for Firebase integration. To connect to Firebase:

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com/)

2. **Get your Firebase config** and create a `.env` file:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

3. **Switch to Firebase** by updating the database service:
   ```javascript
   // In components/Contact.js
   import { firebaseService } from '../services/database';
   
   // Replace localDatabase with firebaseService
   ```

## 🎨 Customization

### Styling
- All styles are in `src/index.css`
- Uses CSS custom properties for easy theming
- Responsive design with mobile-first approach

### Content
- Update content in individual component files
- Hero section: `src/components/Hero.js`
- Features: `src/components/Features.js`
- Curriculum: `src/components/Curriculum.js`
- Pricing: `src/components/Pricing.js`

### Animations
- CSS animations for floating shapes and gradients
- React Intersection Observer for scroll-triggered animations
- Framer Motion ready for advanced animations

## 📱 Responsive Design

The app is fully responsive with breakpoints:
- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: > 768px

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`

## 📊 Analytics

The app tracks various user interactions:
- Page views
- Form submissions
- Button clicks
- Custom events

Data is stored locally and can be easily migrated to Firebase Analytics.

## 🔮 Future Enhancements

- [ ] Firebase Authentication
- [ ] Real-time chat functionality
- [ ] User dashboard
- [ ] Course content management
- [ ] Payment integration (Stripe)
- [ ] Email marketing integration
- [ ] Advanced analytics dashboard
- [ ] PWA capabilities
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: hello@vibe-coding.lifestyle
- Website: vibe-coding.lifestyle

---

**Join the Vibe Coding Lifestyle movement!** 🎵✨ 

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
# Firebase
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Razorpay
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

## 🎤 Webinar Feature

- Pages: `/webinar` (landing), `/webinar/register` (payment + registration), `/webinar/success` (confirmation)
- Price: ₹99 via Razorpay Checkout
- Data stored in Firestore collection: `webinar_registrations`
- Event Date: 22 September, 7:00 PM IST

### How It Works
1. User fills the form on `/webinar/register`
2. Firestore doc created with status `initiated`
3. Razorpay popup collects payment
4. On success, Firestore doc updated to `paid` with Razorpay refs; user redirected to success page

### Testing
- Use Razorpay test key in `.env`
- In Razorpay dashboard, enable test mode

### Going Live
- Replace `REACT_APP_RAZORPAY_KEY_ID` with live key
- Ensure Firebase security rules restrict writes appropriately

## 🧭 Routes Overview
- `/` Home
- `/webinar` Webinar Landing
- `/webinar/register` Register + Pay
- `/webinar/success` Success confirmation
- `/dashboard` Course dashboard
- `/subscription` Subscription manager # vibe-coding
