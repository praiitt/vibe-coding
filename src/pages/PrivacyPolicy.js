import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="legal-page">
      <div className="container">
        <div className="legal-header">
          <h1>Privacy Policy</h1>
          <p>Last updated: September 4, 2024</p>
        </div>

        <div className="legal-content">
          <section>
            <h2>1. Introduction and Scope</h2>
            <p>Vibe Coding Lifestyle, a product of Absolute Dimension Pvt Ltd ("Company," "we," "our," or "us") is committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (https://vibe-coding.lifestyle), use our services, or participate in our webinars and educational programs.</p>
            <p>This policy applies to all users of our services, including visitors to our website, webinar participants, course students, and community members. By using our services, you consent to the data practices described in this policy.</p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information You Provide</h3>
            <p>We collect personal information that you voluntarily provide to us, including:</p>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, phone number, and password</li>
              <li><strong>Profile Data:</strong> Professional background, interests, and learning goals</li>
              <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely through Razorpay)</li>
              <li><strong>Communication Data:</strong> Messages, feedback, and support requests</li>
              <li><strong>Learning Data:</strong> Course progress, webinar attendance, and completion certificates</li>
              <li><strong>Community Data:</strong> Posts, comments, and interactions in our community forums</li>
            </ul>

            <h3>2.2 Information Collected Automatically</h3>
            <p>We automatically collect certain information about your device and usage patterns:</p>
            <ul>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent on our website, click patterns, and navigation paths</li>
              <li><strong>Location Data:</strong> General geographic location based on IP address</li>
              <li><strong>Technical Data:</strong> Screen resolution, language preferences, and time zone</li>
              <li><strong>Analytics Data:</strong> Performance metrics, error logs, and user behavior patterns</li>
            </ul>

            <h3>2.3 Cookies and Tracking Technologies</h3>
            <p>We use various tracking technologies to enhance your experience:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use your personal information for the following purposes:</p>
            
            <h3>3.1 Service Delivery</h3>
            <ul>
              <li>Provide access to webinars, courses, and educational content</li>
              <li>Process payments and manage subscriptions</li>
              <li>Deliver personalized learning experiences</li>
              <li>Maintain and improve our services</li>
            </ul>

            <h3>3.2 Communication</h3>
            <ul>
              <li>Send webinar reminders and course updates</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Share important service announcements</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>

            <h3>3.3 Analytics and Improvement</h3>
            <ul>
              <li>Analyze usage patterns to improve our services</li>
              <li>Conduct research and development</li>
              <li>Generate aggregated, anonymized reports</li>
              <li>Optimize website performance and user experience</li>
            </ul>

            <h3>3.4 Legal and Compliance</h3>
            <ul>
              <li>Comply with applicable laws and regulations</li>
              <li>Protect our rights and prevent fraud</li>
              <li>Respond to legal requests and court orders</li>
              <li>Maintain security and prevent abuse</li>
            </ul>
          </section>

          <section>
            <h2>4. Information Sharing and Disclosure</h2>
            <p>We do not sell, rent, or trade your personal information. We may share your information in the following circumstances:</p>

            <h3>4.1 Service Providers</h3>
            <p>We work with trusted third-party service providers who assist us in operating our business:</p>
            <ul>
              <li><strong>Payment Processing:</strong> Razorpay for secure payment processing</li>
              <li><strong>Email Services:</strong> For sending notifications and communications</li>
              <li><strong>Analytics:</strong> Google Analytics for website performance insights</li>
              <li><strong>Cloud Storage:</strong> MongoDB Atlas for secure data storage</li>
              <li><strong>Customer Support:</strong> Third-party support tools and platforms</li>
            </ul>

            <h3>4.2 Legal Requirements</h3>
            <p>We may disclose your information when required by law or to:</p>
            <ul>
              <li>Comply with legal processes or government requests</li>
              <li>Protect our rights, property, or safety</li>
              <li>Prevent fraud or security threats</li>
              <li>Enforce our Terms of Service</li>
            </ul>

            <h3>4.3 Business Transfers</h3>
            <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction. We will notify you of any such change in ownership or control.</p>
          </section>

          <section>
            <h2>5. Data Security and Protection</h2>
            <p>We implement comprehensive security measures to protect your personal information:</p>
            <ul>
              <li><strong>Encryption:</strong> All data is encrypted in transit and at rest using industry-standard protocols</li>
              <li><strong>Access Controls:</strong> Strict access controls and authentication mechanisms</li>
              <li><strong>Regular Audits:</strong> Periodic security assessments and vulnerability testing</li>
              <li><strong>Staff Training:</strong> Regular training on data protection and privacy practices</li>
              <li><strong>Incident Response:</strong> Procedures for handling security breaches and data incidents</li>
            </ul>
            <p>However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2>6. Data Retention</h2>
            <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy:</p>
            <ul>
              <li><strong>Account Data:</strong> Retained for the duration of your account plus 2 years</li>
              <li><strong>Payment Data:</strong> Retained for 7 years as required by law</li>
              <li><strong>Learning Data:</strong> Retained for 5 years for educational purposes</li>
              <li><strong>Communication Data:</strong> Retained for 3 years for support purposes</li>
              <li><strong>Analytics Data:</strong> Retained for 2 years in aggregated form</li>
            </ul>
            <p>We will delete or anonymize your personal information when it is no longer needed for the purposes described in this policy.</p>
          </section>

          <section>
            <h2>7. Your Rights and Choices</h2>
            <p>Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a structured, machine-readable format</li>
              <li><strong>Restriction:</strong> Request restriction of processing of your personal information</li>
              <li><strong>Objection:</strong> Object to processing of your personal information for certain purposes</li>
              <li><strong>Withdrawal:</strong> Withdraw consent for processing based on consent</li>
            </ul>
            <p>To exercise these rights, please contact us using the information provided in the Contact section. We will respond to your request within 30 days.</p>
          </section>

          <section>
            <h2>8. International Data Transfers</h2>
            <p>Your personal information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws by:</p>
            <ul>
              <li>Using standard contractual clauses approved by relevant authorities</li>
              <li>Implementing appropriate technical and organizational safeguards</li>
              <li>Ensuring the receiving country has adequate data protection laws</li>
              <li>Obtaining your explicit consent when required</li>
            </ul>
          </section>

          <section>
            <h2>9. Children's Privacy</h2>
            <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.</p>
            <p>If we discover that we have collected personal information from a child under 13, we will take steps to delete such information promptly.</p>
          </section>

          <section>
            <h2>10. Third-Party Links and Services</h2>
            <p>Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.</p>
            <p>Some third-party services we use include:</p>
            <ul>
              <li>Razorpay for payment processing</li>
              <li>Google Analytics for website analytics</li>
              <li>MongoDB Atlas for data storage</li>
              <li>Social media platforms for community features</li>
            </ul>
          </section>

          <section>
            <h2>11. Marketing Communications</h2>
            <p>We may send you marketing communications about our services, webinars, and educational content. You can opt out of these communications at any time by:</p>
            <ul>
              <li>Clicking the unsubscribe link in our emails</li>
              <li>Updating your preferences in your account settings</li>
              <li>Contacting us directly</li>
            </ul>
            <p>We will continue to send you essential service-related communications even if you opt out of marketing communications.</p>
          </section>

          <section>
            <h2>12. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by:</p>
            <ul>
              <li>Posting the updated policy on our website</li>
              <li>Sending you an email notification</li>
              <li>Displaying a prominent notice on our website</li>
            </ul>
            <p>Your continued use of our services after any changes constitutes acceptance of the updated Privacy Policy.</p>
          </section>

          <section>
            <h2>13. Contact Information</h2>
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
            <ul>
              <li><strong>Email:</strong> privacy@vibe-coding.lifestyle</li>
              <li><strong>Phone:</strong> +91 98765 43210</li>
              <li><strong>Address:</strong> Mumbai, Maharashtra, India</li>
              <li><strong>Website:</strong> https://vibe-coding.lifestyle/contact</li>
            </ul>
            <p>We will respond to your inquiry within 48 hours during business days.</p>
          </section>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
