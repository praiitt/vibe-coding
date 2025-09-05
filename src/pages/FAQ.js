import React, { useState, useEffect } from 'react';

const FAQ = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqData = [
    {
      category: "General",
      questions: [
        {
          question: "What is Vibe Coding?",
          answer: "Vibe Coding is a revolutionary approach to software development that combines creative programming with AI-native tools. It's about coding with rhythm, flow, and purpose, using platforms like Cursor, Lovable, and Emergent.sh to build MVPs faster and more collaboratively."
        },
        {
          question: "Who is this webinar for?",
          answer: "This webinar is perfect for anyone interested in the future of software development - from complete beginners with no tech background to experienced developers looking to learn new methodologies. Whether you're a creative professional, business owner, student, or developer, you'll find value in understanding how vibe coding will change how software is built."
        },
        {
          question: "Do I need any technical background?",
          answer: "Not at all! This webinar is designed to be accessible to everyone. We'll explain everything from the ground up, and you'll learn how to use AI-powered tools that make coding accessible to anyone with creativity and vision."
        }
      ]
    },
    {
      category: "Webinar Details",
      questions: [
        {
          question: "When is the webinar?",
          answer: "The webinar is scheduled for September 21st at 1:00 PM IST. You'll receive the webinar link 1 hour before the event starts."
        },
        {
          question: "How long is the webinar?",
          answer: "The webinar will run for approximately 2 hours, during which we'll build a complete MVP live. We'll cover everything from planning to deployment in real-time."
        },
        {
          question: "Will the webinar be recorded?",
          answer: "Yes! The webinar will be recorded and you'll receive access to the recording after the event, so you can review the content at your own pace."
        },
        {
          question: "What platforms will we use?",
          answer: "We'll be using Cursor (AI-first IDE), Lovable (full-stack app generation), and Emergent.sh (agentic workflows). Don't worry if you're not familiar with these - we'll guide you through everything."
        }
      ]
    },
    {
      category: "Registration & Payment",
      questions: [
        {
          question: "How much does the webinar cost?",
          answer: "The webinar costs ₹99, which includes the live session, recording access, community access, and all materials. This is a special launch price for early adopters."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, debit cards, UPI, net banking, and digital wallets through our secure Razorpay payment gateway."
        },
        {
          question: "Can I get a refund?",
          answer: "We don't offer refunds for missed sessions, but you'll receive the recording and can join our community for ongoing support. If we cancel the webinar, you'll receive a full refund."
        },
        {
          question: "What if I can't attend live?",
          answer: "No problem! You'll receive the recording and can participate in our community discussions. The recording will be available within 24 hours of the live session."
        }
      ]
    },
    {
      category: "Technical Requirements",
      questions: [
        {
          question: "What do I need to participate?",
          answer: "You just need a stable internet connection and a modern web browser. We'll provide all the tools and platforms we'll be using during the session."
        },
        {
          question: "Do I need to install any software?",
          answer: "No installations required! We'll be using web-based platforms that work directly in your browser. We'll guide you through setting up accounts for the tools we'll use."
        },
        {
          question: "What if I have technical issues?",
          answer: "We'll have technical support available during the webinar, and you can reach out to us beforehand if you have any concerns. We'll also provide a troubleshooting guide before the event."
        }
      ]
    },
    {
      category: "Community & Support",
      questions: [
        {
          question: "What happens after the webinar?",
          answer: "You'll join our exclusive Vibe Coding community where you can continue learning, share projects, get feedback, and connect with other vibe coders. We'll also provide ongoing resources and updates."
        },
        {
          question: "Will there be follow-up sessions?",
          answer: "Yes! We're planning regular follow-up sessions, advanced workshops, and community challenges. As a webinar participant, you'll get priority access to these events."
        },
        {
          question: "How can I stay updated?",
          answer: "Join our community, follow us on social media, and subscribe to our newsletter. We'll keep you informed about new developments in vibe coding and upcoming events."
        }
      ]
    }
  ];

  return (
    <section className="faq">
      <div className="container">
        <div className="faq-header">
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about Vibe Coding and our webinar. Can't find what you're looking for? <a href="/contact">Contact us</a> and we'll be happy to help!</p>
        </div>

        <div className="faq-content">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="faq-category">
              <h2 className="category-title">{category.category}</h2>
              <div className="faq-items">
                {category.questions.map((item, itemIndex) => {
                  const globalIndex = `${categoryIndex}-${itemIndex}`;
                  const isOpen = openItems.has(globalIndex);
                  
                  return (
                    <div key={itemIndex} className="faq-item">
                      <button
                        className={`faq-question ${isOpen ? 'active' : ''}`}
                        onClick={() => toggleItem(globalIndex)}
                      >
                        <span>{item.question}</span>
                        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
                      </button>
                      <div className={`faq-answer ${isOpen ? 'active' : ''}`}>
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="faq-cta">
          <h2>Still have questions?</h2>
          <p>We're here to help! Reach out to us and we'll get back to you within 24 hours.</p>
          <a href="/contact" className="btn btn-primary">
            <i className="fas fa-envelope" style={{ marginRight: '8px' }}></i>
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
