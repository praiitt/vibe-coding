const puppeteer = require('puppeteer');

async function testForms() {
  console.log('🚀 Starting form testing...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  try {
    // Test 1: Home Page - Join the Vibe Movement Form
    console.log('\n📝 Testing: Join the Vibe Movement Form (Hero Section)');
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.hero-buttons .btn-primary');
    
    // Click Join the Vibe button
    await page.click('.hero-buttons .btn-primary');
    await page.waitForSelector('.join-modal', { timeout: 5000 });
    
    // Fill the form
    await page.type('input[name="name"]', 'Test User');
    await page.type('input[name="email"]', 'test@example.com');
    await page.type('input[name="phone"]', '1234567890');
    await page.select('select[name="interests"]', 'all');
    
    // Check if reCAPTCHA is present
    const recaptcha = await page.$('.g-recaptcha');
    if (recaptcha) {
      console.log('✅ reCAPTCHA widget found');
    } else {
      console.log('❌ reCAPTCHA widget not found');
    }
    
    // Try to submit (might fail due to reCAPTCHA)
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Check for success/error messages
    const notification = await page.$('.notification');
    if (notification) {
      const text = await page.evaluate(el => el.textContent, notification);
      console.log('📢 Notification:', text);
    }
    
    // Close modal
    await page.click('.modal-close');
    
    // Test 2: Contact Us Form
    console.log('\n📝 Testing: Contact Us Form');
    await page.goto('http://localhost:3000/contact');
    await page.waitForSelector('.contact-form');
    
    // Fill contact form
    await page.type('input[name="name"]', 'Contact Test User');
    await page.type('input[name="email"]', 'contact@example.com');
    await page.type('input[name="subject"]', 'Test Subject');
    await page.type('textarea[name="message"]', 'This is a test message for contact form validation.');
    
    // Submit contact form
    await page.click('.contact-form button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Check for success/error messages
    const contactNotification = await page.$('.notification, .alert');
    if (contactNotification) {
      const text = await page.evaluate(el => el.textContent, contactNotification);
      console.log('📢 Contact Notification:', text);
    }
    
    // Test 3: Webinar Registration Form
    console.log('\n📝 Testing: Webinar Registration Form');
    await page.goto('http://localhost:3000/webinar/register');
    await page.waitForSelector('.webinar-form');
    
    // Fill webinar form
    await page.type('input[name="name"]', 'Webinar Test User');
    await page.type('input[name="email"]', 'webinar@example.com');
    await page.type('input[name="phone"]', '9876543210');
    await page.select('select[name="experience"]', 'beginner');
    await page.type('textarea[name="goals"]', 'Learn vibe coding techniques and build an MVP.');
    
    // Submit webinar form
    await page.click('.webinar-form button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Check for success/error messages
    const webinarNotification = await page.$('.notification, .alert');
    if (webinarNotification) {
      const text = await page.evaluate(el => el.textContent, webinarNotification);
      console.log('📢 Webinar Notification:', text);
    }
    
    // Test 4: Login/Register Form
    console.log('\n📝 Testing: Login/Register Form');
    await page.goto('http://localhost:3000');
    
    // Try to find and click login button
    const loginButton = await page.$('.btn-primary');
    if (loginButton) {
      await loginButton.click();
      await page.waitForTimeout(1000);
      
      // Check if modal opened
      const loginModal = await page.$('.auth-modal');
      if (loginModal) {
        console.log('✅ Login modal opened');
        
        // Test register form
        await page.click('button[data-tab="register"]');
        await page.type('input[name="name"]', 'Register Test User');
        await page.type('input[name="email"]', 'register@example.com');
        await page.type('input[name="password"]', 'testpassword123');
        await page.type('input[name="confirmPassword"]', 'testpassword123');
        
        // Check for reCAPTCHA
        const loginRecaptcha = await page.$('.g-recaptcha');
        if (loginRecaptcha) {
          console.log('✅ reCAPTCHA found in login form');
        }
        
        // Close modal
        await page.click('.modal-close');
      }
    }
    
    console.log('\n✅ Form testing completed!');
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testForms().catch(console.error);
