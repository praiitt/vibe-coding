import React, { useEffect } from 'react';

const TermsAndConditions = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="legal-page">
      <div className="container">
        <div className="legal-header">
          <h1>Terms and Conditions</h1>
          <p>Last updated: September 4, 2024</p>
        </div>

        <div className="legal-content">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>Welcome to Vibe Coding Lifestyle, a product of Absolute Dimension Pvt Ltd ("Company," "we," "our," or "us"). These Terms and Conditions ("Terms") govern your use of our website, services, and educational content related to creative programming and AI-native development methodologies.</p>
            <p>By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access our services. These Terms apply to all visitors, users, and others who access or use our services.</p>
          </section>

          <section>
            <h2>2. Description of Services</h2>
            <p>Vibe Coding Lifestyle specializes in teaching innovative software development approaches that combine creative programming with AI-native tools. Our services include:</p>
            <ul>
              <li><strong>Live Webinars:</strong> Interactive sessions on building MVPs using platforms like Cursor, Lovable, and Emergent.sh</li>
              <li><strong>Educational Content:</strong> Comprehensive resources on vibe coding methodologies and creative programming</li>
              <li><strong>Community Access:</strong> Exclusive access to our developer community and ongoing support</li>
              <li><strong>Course Materials:</strong> Recordings, documentation, and hands-on exercises</li>
              <li><strong>Mentorship:</strong> Guidance on implementing vibe coding principles in real projects</li>
            </ul>
          </section>

          <section>
            <h2>3. User Accounts and Registration</h2>
            <p>To access premium features, you must create an account. When creating an account, you agree to:</p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Be at least 13 years old (or the minimum age in your jurisdiction)</li>
            </ul>
            <p>We reserve the right to refuse service, terminate accounts, or remove content at our sole discretion.</p>
          </section>

          <section>
            <h2>4. Payment Terms and Pricing</h2>
            <p>Our services are offered on a paid basis. Payment terms include:</p>
            <ul>
              <li><strong>Webinar Registration:</strong> ₹99 per session (special launch pricing)</li>
              <li><strong>Payment Methods:</strong> Credit cards, debit cards, UPI, net banking, and digital wallets via Razorpay</li>
              <li><strong>Currency:</strong> All prices are in Indian Rupees (INR)</li>
              <li><strong>Payment Processing:</strong> Secure processing through certified payment gateways</li>
              <li><strong>Taxes:</strong> Applicable taxes will be added to the final amount</li>
            </ul>
            <p>All payments are non-refundable except as specified in our Cancellation/Refund Policy.</p>
          </section>

          <section>
            <h2>5. Intellectual Property Rights</h2>
            <p>The service and its original content, features, and functionality are and will remain the exclusive property of Vibe Coding Lifestyle and its licensors. The service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.</p>
            <p>You may not:</p>
            <ul>
              <li>Copy, modify, or distribute our content without permission</li>
              <li>Use our trademarks or logos without authorization</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Create derivative works based on our content</li>
            </ul>
          </section>

          <section>
            <h2>6. User Conduct and Prohibited Activities</h2>
            <p>You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Transmit any harmful, threatening, abusive, or harassing content</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt our services or servers</li>
              <li>Use automated systems to access our services without permission</li>
              <li>Share your account credentials with others</li>
              <li>Use our services for commercial purposes without authorization</li>
            </ul>
          </section>

          <section>
            <h2>7. Privacy and Data Protection</h2>
            <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our services. By using our services, you agree to the collection and use of information in accordance with our Privacy Policy.</p>
          </section>

          <section>
            <h2>8. Disclaimers and Warranties</h2>
            <p>Our services are provided on an "as is" and "as available" basis. We make no representations or warranties of any kind, express or implied, including but not limited to:</p>
            <ul>
              <li>The accuracy, reliability, or completeness of our content</li>
              <li>The availability or uninterrupted access to our services</li>
              <li>The results that may be obtained from using our services</li>
              <li>The quality or suitability of our services for any particular purpose</li>
            </ul>
            <p>We disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.</p>
          </section>

          <section>
            <h2>9. Limitation of Liability</h2>
            <p>To the fullest extent permitted by applicable law, Vibe Coding Lifestyle shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation:</p>
            <ul>
              <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
              <li>Damages resulting from your use or inability to use our services</li>
              <li>Unauthorized access to or alteration of your data</li>
              <li>Any other matter relating to our services</li>
            </ul>
            <p>Our total liability to you for all damages shall not exceed the amount you paid us for the services in the 12 months preceding the claim.</p>
          </section>

          <section>
            <h2>10. Indemnification</h2>
            <p>You agree to defend, indemnify, and hold harmless Vibe Coding Lifestyle and its affiliates from and against any claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including attorney's fees) arising from:</p>
            <ul>
              <li>Your use of our services</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any content you submit or transmit through our services</li>
            </ul>
          </section>

          <section>
            <h2>11. Termination</h2>
            <p>We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.</p>
            <p>Upon termination, your right to use our services will cease immediately. All provisions of these Terms which by their nature should survive termination shall survive termination.</p>
          </section>

          <section>
            <h2>12. Governing Law and Dispute Resolution</h2>
            <p>These Terms shall be interpreted and governed by the laws of India, without regard to its conflict of law provisions. Any dispute arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra, India.</p>
            <p>Before filing any formal legal proceedings, we encourage you to contact us to resolve the dispute informally. We will make good faith efforts to resolve any dispute within 30 days.</p>
          </section>

          <section>
            <h2>13. Changes to Terms</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.</p>
            <p>By continuing to access or use our services after those revisions become effective, you agree to be bound by the revised terms.</p>
          </section>

          <section>
            <h2>14. Severability</h2>
            <p>If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.</p>
          </section>

          <section>
            <h2>15. Contact Information</h2>
            <p>If you have any questions about these Terms and Conditions, please contact us:</p>
            <ul>
              <li><strong>Email:</strong> legal@vibe-coding.lifestyle</li>
              <li><strong>Phone:</strong> +91 98765 43210</li>
              <li><strong>Address:</strong> Mumbai, Maharashtra, India</li>
              <li><strong>Website:</strong> https://vibe-coding.lifestyle</li>
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
};

export default TermsAndConditions;
