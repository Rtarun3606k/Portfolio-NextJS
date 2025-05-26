import nodemailer from "nodemailer";

/**
 * Sends an email with HTML content
 * @param {Object} options - Email sending options
 * @param {string} options.to - Recipient email address
 * @param {string} options.from - Sender email address
 * @param {string} options.subject - Email subject
 * @param {string} [options.htmlContent] - HTML content as string (use this OR htmlFilePath)
 * @param {string} [options.htmlFilePath] - Path to HTML template file (use this OR htmlContent)
 * @param {Object} [options.replacements] - Key-value pairs for replacing placeholders in the HTML
 * @param {boolean} [options.sendCopyToSender] - Whether to send a copy to the sender
 * @returns {Promise<Object>} - Result of the email sending operation
 */
async function sendEmail({
  to,
  from,
  subject,
  htmlContent,
  htmlFilePath,
  replacements = {},
  sendCopyToSender = false,
}) {
  try {
    console.log("Starting email sending process...");

    // Create transporter
    const transportConfig = {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "r.tarunnayaka25042005@gmail.com",
        pass: process.env.SMTP_PASSWORD || null,
      },
    };

    const transporter = nodemailer.createTransport(transportConfig);

    // Use embedded template based on template type
    let html = htmlContent;

    if (!html && htmlFilePath) {
      // Built-in email templates
      if (htmlFilePath === "newsletter-digest") {
        html = getNewsletterDigestTemplate();
      } else if (htmlFilePath === "welcome-email") {
        html = getWelcomeEmailTemplate();
      } else {
        // Default contact template
        html = getContactEmailTemplate();
      }
    }

    // If neither content nor path is provided, use a simple fallback
    if (!html) {
      console.log("No HTML content provided, using simple fallback");
      html = "<h1>Hello {{name}}</h1><p>This is a test email.</p>";
    }

    // Replace placeholders in HTML content
    if (html && Object.keys(replacements).length > 0) {
      console.log("Replacing placeholders in HTML content");

      for (const [key, value] of Object.entries(replacements)) {
        if (value !== undefined && value !== null) {
          const regex = new RegExp(`{{${key}}}`, "g");
          html = html.replace(regex, value);
        }
      }
    }

    // Replace any remaining template variables with empty strings
    html = html.replace(/{{[^{}]+}}/g, "");

    console.log(`Sending email to: ${to}`);
    console.log(`Email subject: ${subject}`);

    // Send primary email to recipient
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    console.log(`Email sent successfully to ${to}: ${info.messageId}`);

    let copyInfo = null;

    // Send copy to yourself if requested
    if (sendCopyToSender) {
      try {
        console.log("Sending copy to sender...");

        // Create modified content for the copy
        const copyHtml = html.replace(
          "{{copyNotice}}",
          `<div class="copy-notice">
            <p><strong>Note:</strong> This is a copy of the email sent to ${to}</p>
            <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
          </div>`
        );

        copyInfo = await transporter.sendMail({
          from,
          to: from, // Send to yourself
          subject: `[COPY] ${subject}`,
          html: copyHtml,
        });

        console.log(`Copy sent successfully to ${from}: ${copyInfo.messageId}`);
      } catch (copyError) {
        console.error("Error sending copy to sender:", copyError);
        // Don't fail the main operation if copy fails
      }
    }

    return {
      success: true,
      messageId: info.messageId,
      emailInfo: info,
      copyMessageId: copyInfo?.messageId || null,
      copyEmailInfo: copyInfo || null,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || null,
        name: error.name,
      },
    };
  }
}

// Newsletter Digest Email Template
function getNewsletterDigestTemplate() {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Newsletter Digest | Tarun Nayaka R</title>
      <style>
        body {
          font-family: 'Arial', 'Helvetica', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f7;
        }
        .header {
          background: linear-gradient(135deg, #6a0dad, #7c3aed);
          color: white;
          padding: 30px 25px;
          text-align: center;
          border-radius: 12px 12px 0 0;
          box-shadow: 0 4px 15px rgba(106, 13, 173, 0.2);
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 28px;
          font-weight: bold;
        }
        .header p {
          margin: 0;
          opacity: 0.9;
          font-size: 16px;
        }
        .content {
          padding: 0;
          background: white;
          border: 1px solid #eee;
          border-top: none;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .section {
          padding: 25px;
          border-bottom: 1px solid #f0f0f0;
        }
        .section:last-child {
          border-bottom: none;
        }
        .section h2 {
          color: #6a0dad;
          margin: 0 0 20px 0;
          font-size: 22px;
          font-weight: bold;
          display: flex;
          align-items: center;
        }
        .section-icon {
          width: 24px;
          height: 24px;
          margin-right: 10px;
          background: linear-gradient(135deg, #6a0dad, #7c3aed);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: bold;
        }
        .item {
          margin-bottom: 20px;
          padding: 20px;
          border-left: 4px solid #6a0dad;
          background: #f8f5ff;
          border-radius: 0 8px 8px 0;
          transition: all 0.3s ease;
        }
        .item:hover {
          background: #f0ebff;
          transform: translateX(5px);
        }
        .item h3 {
          margin: 0 0 8px 0;
          color: #1f1f1f;
          font-size: 18px;
          font-weight: 600;
        }
        .item p {
          margin: 0 0 10px 0;
          color: #6b7280;
          font-size: 14px;
        }
        .item-meta {
          font-size: 12px;
          color: #9ca3af;
          margin-bottom: 12px;
        }
        .read-more {
          display: inline-block;
          padding: 8px 16px;
          background: linear-gradient(135deg, #6a0dad, #7c3aed);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .read-more:hover {
          background: linear-gradient(135deg, #5a0a9d, #6c2aed);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(106, 13, 173, 0.3);
        }
        .see-more {
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-top: 20px;
        }
        .see-more a {
          display: inline-block;
          padding: 12px 24px;
          background: linear-gradient(135deg, #6a0dad, #7c3aed);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .see-more a:hover {
          background: linear-gradient(135deg, #5a0a9d, #6c2aed);
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(106, 13, 173, 0.3);
        }
        .footer {
          text-align: center;
          padding: 25px;
          font-size: 12px;
          color: #666;
          background-color: #f9f9f9;
          border-radius: 0 0 12px 12px;
          border: 1px solid #eee;
          border-top: none;
        }
        .unsubscribe {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
        }
        .unsubscribe a {
          color: #6a0dad;
          text-decoration: none;
        }
        .unsubscribe a:hover {
          text-decoration: underline;
        }
        .categories {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 8px 0;
        }
        .category-tag {
          background: #e0f7fa;
          color: #0277bd;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🚀 Newsletter Digest</h1>
        <p>Latest insights and updates from Tarun Nayaka R</p>
      </div>
      
      <div class="content">
        <div class="section">
          <h2>
            <span class="section-icon">📚</span>
            Latest Blog Posts
          </h2>
          {{blogPosts}}
          {{blogsSeeMore}}
        </div>

        <div class="section">
          <h2>
            <span class="section-icon">🎯</span>
            Upcoming Events
          </h2>
          {{events}}
          {{eventsSeeMore}}
        </div>
      </div>

      <div class="footer">
        <p>© {{year}} Tarun Nayaka R. All rights reserved.</p>
        <p>Sampangi Rama Nagara Bangalore 560027, Karnataka, India</p>
        
        <div class="unsubscribe">
          <p>
            Don't want to receive these emails? 
            <a href="{{unsubscribeLink}}">Unsubscribe here</a>
          </p>
        </div>
      </div>
    </body>
  </html>
  `;
}

// Welcome Email Template
function getWelcomeEmailTemplate() {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Welcome to Newsletter | Tarun Nayaka R</title>
      <style>
        body {
          font-family: 'Arial', 'Helvetica', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f7;
        }
        .header {
          background: linear-gradient(135deg, #6a0dad, #7c3aed);
          color: white;
          padding: 40px 25px;
          text-align: center;
          border-radius: 12px 12px 0 0;
          box-shadow: 0 4px 15px rgba(106, 13, 173, 0.2);
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 20%, transparent 20%);
          background-size: 30px 30px;
          animation: move 20s linear infinite;
        }
        @keyframes move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(30px, 30px); }
        }
        .header-content {
          position: relative;
          z-index: 1;
        }
        .header h1 {
          margin: 0 0 15px 0;
          font-size: 32px;
          font-weight: bold;
        }
        .header p {
          margin: 0;
          opacity: 0.9;
          font-size: 18px;
        }
        .welcome-emoji {
          font-size: 48px;
          margin-bottom: 15px;
          display: block;
        }
        .content {
          padding: 30px;
          background: white;
          border: 1px solid #eee;
          border-top: none;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .intro {
          text-align: center;
          margin-bottom: 30px;
          padding: 25px;
          background: linear-gradient(135deg, #f8f5ff, #e8f4fd);
          border-radius: 12px;
          border-left: 4px solid #6a0dad;
        }
        .intro h2 {
          color: #6a0dad;
          margin: 0 0 15px 0;
          font-size: 24px;
        }
        .benefits {
          margin: 30px 0;
        }
        .benefit-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f5ff;
          border-radius: 8px;
          border-left: 3px solid #6a0dad;
        }
        .benefit-icon {
          font-size: 24px;
          margin-right: 15px;
          flex-shrink: 0;
        }
        .benefit-text h3 {
          margin: 0 0 8px 0;
          color: #1f1f1f;
          font-size: 16px;
          font-weight: 600;
        }
        .benefit-text p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }
        .cta-section {
          text-align: center;
          margin: 30px 0;
          padding: 25px;
          background: linear-gradient(135deg, #e8f4fd, #f0ebff);
          border-radius: 12px;
        }
        .cta-button {
          display: inline-block;
          padding: 15px 30px;
          background: linear-gradient(135deg, #6a0dad, #7c3aed);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          margin: 10px;
        }
        .cta-button:hover {
          background: linear-gradient(135deg, #5a0a9d, #6c2aed);
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(106, 13, 173, 0.3);
        }
        .social-links {
          text-align: center;
          margin: 25px 0;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        .social-links h3 {
          margin: 0 0 15px 0;
          color: #6a0dad;
          font-size: 18px;
        }
        .social-links a {
          display: inline-block;
          margin: 0 10px;
          padding: 8px 16px;
          background: #6a0dad;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        .social-links a:hover {
          background: #5a0a9d;
          transform: translateY(-1px);
        }
        .footer {
          text-align: center;
          padding: 25px;
          font-size: 12px;
          color: #666;
          background-color: #f9f9f9;
          border-radius: 0 0 12px 12px;
          border: 1px solid #eee;
          border-top: none;
        }
        .unsubscribe {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
        }
        .unsubscribe a {
          color: #6a0dad;
          text-decoration: none;
        }
        .unsubscribe a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-content">
          <span class="welcome-emoji">🎉</span>
          <h1>Welcome to the Newsletter!</h1>
          <p>Thank you for joining our community, {{name}}!</p>
        </div>
      </div>
      
      <div class="content">
        <div class="intro">
          <h2>You're All Set! 🚀</h2>
          <p>Welcome to the insider's circle! You'll now receive regular updates featuring my latest blog posts, upcoming events, tech insights, and exclusive content.</p>
        </div>

        <div class="benefits">
          <h3 style="color: #6a0dad; margin-bottom: 20px; font-size: 20px;">What You Can Expect:</h3>
          
          <div class="benefit-item">
            <span class="benefit-icon">📚</span>
            <div class="benefit-text">
              <h3>Latest Blog Posts</h3>
              <p>Fresh insights on web development, machine learning, cloud technologies, and industry trends</p>
            </div>
          </div>

          <div class="benefit-item">
            <span class="benefit-icon">🎯</span>
            <div class="benefit-text">
              <h3>Upcoming Events</h3>
              <p>Be the first to know about conferences, workshops, and tech meetups I'm hosting or attending</p>
            </div>
          </div>

          <div class="benefit-item">
            <span class="benefit-icon">💡</span>
            <div class="benefit-text">
              <h3>Tech Tips & Tutorials</h3>
              <p>Practical coding tips, best practices, and step-by-step guides to level up your skills</p>
            </div>
          </div>

          <div class="benefit-item">
            <span class="benefit-icon">🎁</span>
            <div class="benefit-text">
              <h3>Exclusive Content</h3>
              <p>Subscriber-only resources, early access to projects, and behind-the-scenes insights</p>
            </div>
          </div>
        </div>

        <div class="cta-section">
          <h3 style="color: #6a0dad; margin-bottom: 15px;">Get Started</h3>
          <p style="margin-bottom: 20px; color: #666;">While you're here, check out some of my latest work:</p>
          
          <a href="{{portfolioLink}}" class="cta-button">
            🌟 Explore My Portfolio
          </a>
          <a href="{{blogLink}}" class="cta-button">
            📖 Read Latest Blogs
          </a>
        </div>

        <div class="social-links">
          <h3>Let's Connect!</h3>
          <a href="{{linkedinLink}}">LinkedIn</a>
          <a href="{{githubLink}}">GitHub</a>
          <a href="{{twitterLink}}">Twitter</a>
        </div>

        <div style="text-align: center; margin-top: 25px; padding: 20px; background: #e8f4fd; border-radius: 8px;">
          <p style="margin: 0; color: #0277bd; font-weight: 500;">
            💌 Expect your first newsletter digest within the next few days!
          </p>
        </div>
      </div>

      <div class="footer">
        <p>© {{year}} Tarun Nayaka R. All rights reserved.</p>
        <p>Sampangi Rama Nagara Bangalore 560027, Karnataka, India</p>
        
        <div class="unsubscribe">
          <p>
            Change your mind? You can 
            <a href="{{unsubscribeLink}}">unsubscribe here</a>
          </p>
        </div>
      </div>
    </body>
  </html>
  `;
}

// Contact Email Template (existing)
function getContactEmailTemplate() {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Thank You for Contacting Me</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f7;
        }
        .header {
          background: linear-gradient(to right, #6a0dad, #7c3aed);
          color: white;
          padding: 25px;
          text-align: center;
          border-radius: 8px 8px 0 0;
          box-shadow: 0 4px 6px rgba(106, 13, 173, 0.1);
        }
        .content {
          padding: 25px;
          background: white;
          border: 1px solid #eee;
          border-top: none;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #666;
          background-color: #f9f9f9;
          border-radius: 0 0 8px 8px;
          border: 1px solid #eee;
          border-top: none;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background: linear-gradient(to right, #6a0dad, #7c3aed);
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(106, 13, 173, 0.2);
          transition: all 0.3s ease;
        }
        .button:hover {
          box-shadow: 0 4px 8px rgba(106, 13, 173, 0.3);
          transform: translateY(-2px);
        }
        .details {
          background-color: #f8f5ff;
          border-left: 4px solid #6a0dad;
          padding: 15px;
          margin: 20px 0;
          border-radius: 0 5px 5px 0;
        }
        .social-links {
          margin-top: 15px;
        }
        .social-links a {
          display: inline-block;
          margin: 0 10px;
          color: #6a0dad;
          text-decoration: none;
          font-weight: bold;
        }
        .copy-notice {
          background-color: #e8f4fd;
          border-left: 4px solid #0ea5e9;
          padding: 15px;
          margin: 20px 0;
          border-radius: 0 5px 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>{{title}}</h1>
        <p>{{subtitle}}</p>
      </div>
      <div class="content">
        <p>Hello {{name}},</p>
        <p>{{message}}</p>

        <div class="details">
          <p><strong>Request Details:</strong></p>
          {{serviceDetails}} {{appointmentDetails}}
          <p><strong>Your message:</strong> {{description}}</p>
        </div>

        <p>
          I'll review your request and get back to you as soon as possible. Please
          feel free to reach out if you have any other questions in the meantime.
        </p>

        <center>
          <p>
            <a href="{{portfolioLink}}" class="button" style="color: white"
              >{{buttonText}}</a
            >
          </p>

          <div class="social-links">
            <p>Connect with me:</p>
            <a href="{{linkedinLink}}">LinkedIn</a>
            <a href="{{githubLink}}">GitHub</a>
            <a href="{{twitterLink}}">Twitter</a>
          </div>
        </center>
        
        {{copyNotice}}
      </div>
      <div class="footer">
        <p>© {{year}} Tarun Nayaka R. All rights reserved.</p>
        <p>{{address}}</p>
      </div>
    </body>
  </html>
  `;
}

// Function to fetch recent blogs for newsletter
async function fetchRecentBlogs(limit = 3) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/blogs`);

    if (!response.ok) {
      throw new Error(`Failed to fetch blogs: ${response.status}`);
    }

    const data = await response.json();
    return data.blogs?.slice(0, limit) || [];
  } catch (error) {
    console.error("Error fetching recent blogs:", error);
    return [];
  }
}

// Function to fetch upcoming events for newsletter
async function fetchUpcomingEvents(limit = 3) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/events`);

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status}`);
    }

    const data = await response.json();

    // Filter for upcoming events and limit
    const upcomingEvents =
      data.events
        ?.filter((event) => {
          if (event.category === "upcoming") return true;

          // If no category, check if date is in the future
          try {
            const eventDate = new Date(event.date);
            return eventDate > new Date();
          } catch {
            return false;
          }
        })
        ?.slice(0, limit) || [];

    return upcomingEvents;
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
}

// Function to generate blog posts HTML for newsletter
function generateBlogPostsHTML(blogs) {
  if (!blogs || blogs.length === 0) {
    return `
      <div class="item">
        <h3>No Recent Posts</h3>
        <p>Check back soon for new content!</p>
      </div>
    `;
  }

  return blogs
    .map((blog) => {
      const plainTextContent = blog.content
        ? blog.content
            .replace(/[#_*`~>\-\[\]\(\)!\n]/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 120) + "..."
        : "Click to read the full article.";

      const categories =
        blog.categories && blog.categories.length > 0
          ? `<div class="categories">
          ${blog.categories
            .map((cat) => `<span class="category-tag">${cat}</span>`)
            .join("")}
        </div>`
          : "";

      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const blogUrl = `${baseUrl}/Blog/${blog._id}`;

      return `
      <div class="item">
        <div class="item-meta">
          ${blog.author || "Tarun Nayaka R"} • ${
        blog.createdAt
          ? new Date(blog.createdAt).toLocaleDateString()
          : "Recently"
      } • ${blog.views || 0} views
        </div>
        <h3>${blog.title}</h3>
        <p>${plainTextContent}</p>
        ${categories}
        <a href="https://tarunnayaka.me/Blog/${
          blog._id
        }" class="read-more">Read Full Article →</a>
      </div>
    `;
    })
    .join("");
}

// Function to generate events HTML for newsletter
function generateEventsHTML(events) {
  if (!events || events.length === 0) {
    return `
      <div class="item">
        <h3>No Upcoming Events</h3>
        <p>Stay tuned for exciting events and workshops!</p>
      </div>
    `;
  }

  return events
    .map((event) => {
      const description = event.description
        ? event.description
            .replace(/[#_*`~>\-\[\]\(\)!\n]/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 100) + "..."
        : "Join us for this exciting event!";

      const skills =
        event.skills && event.skills.length > 0
          ? `<div class="categories">
          ${event.skills
            .map((skill) => `<span class="category-tag">${skill}</span>`)
            .join("")}
        </div>`
          : "";

      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const eventUrl = `${baseUrl}/Events/${event._id}`;

      return `
      <div class="item">
        <div class="item-meta">
          ${event.host || "Tarun Nayaka R"} • ${event.date} • ${event.location}
        </div>
        <h3>${event.name}</h3>
        <p>${description}</p>
        ${skills}
        <a href="${eventUrl}" class="read-more">Learn More →</a>
      </div>
    `;
    })
    .join("");
}

// Function to send newsletter digest
async function sendNewsletterDigest(email, name = "Subscriber") {
  try {
    console.log("Preparing newsletter digest for:", email);

    // Fetch recent content
    const [recentBlogs, upcomingEvents] = await Promise.all([
      fetchRecentBlogs(3),
      fetchUpcomingEvents(3),
    ]);

    // Generate HTML content
    const blogPostsHTML = generateBlogPostsHTML(recentBlogs);
    const eventsHTML = generateEventsHTML(upcomingEvents);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const blogsSeeMore =
      recentBlogs.length > 0
        ? `<div class="see-more">
          <a href="${baseUrl}/Blog">See All Blog Posts →</a>
        </div>`
        : "";

    const eventsSeeMore =
      upcomingEvents.length > 0
        ? `<div class="see-more">
          <a href="${baseUrl}/Events">View All Events →</a>
        </div>`
        : "";

    // Send newsletter digest email
    const emailResult = await sendEmail({
      to: email,
      from: process.env.SMTP_USER || "r.tarunnayaka25042005@gmail.com",
      subject: "🚀 Your Weekly Tech Digest from Tarun Nayaka R",
      htmlFilePath: "newsletter-digest",
      sendCopyToSender: true,
      replacements: {
        name,
        blogPosts: blogPostsHTML,
        events: eventsHTML,
        blogsSeeMore,
        eventsSeeMore,
        year: new Date().getFullYear().toString(),
        unsubscribeLink: `${baseUrl}/unsubscribe?email=${encodeURIComponent(
          email
        )}`,
      },
    });

    return emailResult;
  } catch (error) {
    console.error("Error sending newsletter digest:", error);
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || null,
        name: error.name,
      },
    };
  }
}

// Function to send welcome email
async function sendWelcomeEmail(email, name = "New Subscriber") {
  try {
    console.log("Sending welcome email to:", email);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const emailResult = await sendEmail({
      to: email,
      from: process.env.SMTP_USER || "r.tarunnayaka25042005@gmail.com",
      subject: "🎉 Welcome to the Newsletter! Your Tech Journey Starts Here",
      htmlFilePath: "welcome-email",
      sendCopyToSender: true,
      replacements: {
        name,
        portfolioLink: baseUrl,
        blogLink: `${baseUrl}/Blog`,
        linkedinLink: "https://www.linkedin.com/in/tarun-nayaka-r-28612a27a/",
        githubLink: "https://github.com/Rtarun3606k",
        twitterLink: "https://x.com/Rtarun3606k",
        year: new Date().getFullYear().toString(),
        unsubscribeLink: `${baseUrl}/unsubscribe?email=${encodeURIComponent(
          email
        )}`,
      },
    });

    return emailResult;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || null,
        name: error.name,
      },
    };
  }
}

const getservices = async (serviceId, formData) => {
  try {
    console.log(`Fetching service details for ID: ${serviceId}`);

    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/services/${serviceId}`;
    const request = await fetch(apiUrl, { method: "GET" });

    if (!request.ok) {
      throw new Error(`Network response was not ok: ${request.status}`);
    }

    const data = await request.json();

    // Update formData with service information
    formData.title = data.title;
    formData.serviceDesc = data.description;
    formData.price = data.price;
    formData.timeframe = data.timeframe;

    return { data };
  } catch (error) {
    console.error("Error fetching service:", error);
    return {
      error: {
        message: error.message,
        code: error.code || null,
        name: error.name,
      },
    };
  }
};

// Example code for sending email with this template
async function sendConfirmationEmail(formData) {
  try {
    console.log("Preparing to send confirmation email");

    // First, fetch service details if needed - only if serviceId exists
    if (
      formData.serviceId &&
      formData.serviceId !== null &&
      (!formData.title || !formData.price || !formData.timeframe)
    ) {
      console.log(
        "Service ID present but details missing - fetching service information"
      );
      try {
        await getservices(formData.serviceId, formData);
      } catch (error) {
        console.error(
          "Failed to fetch service details, continuing without them:",
          error
        );
      }
    }

    // Initialize service details and appointment details as empty strings
    let serviceDetails = "";
    let appointmentDetails = "";

    // Only add service details if we have a title (which indicates service info is available)
    if (formData.serviceId && formData.title) {
      serviceDetails = `
        <p><strong>Selected Service:</strong> ${
          formData.title || "Not specified"
        }</p>
        <p><strong>Service Details:</strong> ${formData.timeframe || "N/A"} | ${
        formData.price || "N/A"
      }</p>
      `;

      // Only add appointment details if we have appointment info
      if (formData.appointmentDate && formData.appointmentTime) {
        appointmentDetails = `<p><strong>Appointment:</strong> ${
          formData.appointmentDate
        } at ${
          formData.appointmentTime
        }</p>\n<p><strong>Service Description:</strong> ${
          formData.serviceDesc || "Not provided"
        }</p>`;
      }
    }

    // Send the email with copy to yourself enabled
    const emailResult = await sendEmail({
      to: formData.email,
      from: "r.tarunnayaka25042005@gmail.com",
      subject: "Thank You for Contacting Me",
      htmlFilePath: "built-in-template", // This will trigger using the built-in template
      sendCopyToSender: true, // Enable sending copy to yourself
      replacements: {
        title: "Thank You for Your Message",
        subtitle: formData.serviceId
          ? "I've received your appointment request"
          : "I've received your inquiry",
        name: formData.name || `${formData.firstName} ${formData.lastName}`,
        message: formData.serviceId
          ? "Thank you for requesting my services. I'll review your appointment request and get back to you shortly."
          : "Thank you for reaching out to me. I appreciate your interest and will address your inquiry promptly.",
        type: formData.type || "Not specified",
        serviceDetails: serviceDetails,
        appointmentDetails: appointmentDetails,
        description: formData.description || "Not provided",
        buttonText: "Visit My Portfolio",
        portfolioLink: "https://tarunnayaka.me",
        linkedinLink: "https://www.linkedin.com/in/tarun-nayaka-r-28612a27a/",
        githubLink: "https://github.com/Rtarun3606k",
        twitterLink: "https://x.com/Rtarun3606k",
        year: new Date().getFullYear().toString(),
        address: "Sampangi Rama Nagara Bangalore 560027, Karnataka, India",
        copyNotice: "", // Will be replaced in copy email
      },
    });

    if (emailResult.success) {
      console.log("Confirmation email sent successfully");
      if (emailResult.copyMessageId) {
        console.log("Copy sent to sender successfully");
      }
      return {
        success: true,
        messageId: emailResult.messageId,
        emailInfo: emailResult.emailInfo,
        copyMessageId: emailResult.copyMessageId,
        copyEmailInfo: emailResult.copyEmailInfo,
      };
    } else {
      return {
        success: false,
        error: emailResult.error,
      };
    }
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || null,
        name: error.name,
      },
    };
  }
}

// Main execution function
export async function sendEmailTO(formData) {
  try {
    console.log("Starting email confirmation process");
    const result = await sendConfirmationEmail(formData);

    if (result.success) {
      console.log("Email confirmation process completed successfully");
      const response = {
        success: true,
        message: "Email sent successfully",
        result: result,
      };

      if (result.copyMessageId) {
        response.message += " (copy sent to sender)";
      }

      return response;
    } else {
      console.log("Email confirmation process failed");
      return {
        success: false,
        message: "Failed to send confirmation email",
        error: result.error,
        result: result,
      };
    }
  } catch (error) {
    console.error("Unhandled error in main process:", error);
    return {
      success: false,
      message: error.message,
      error: {
        message: error.message,
        code: error.code || null,
        name: error.name,
      },
    };
  }
}

// Export the new newsletter functions for easy access
export {
  sendNewsletterDigest,
  sendWelcomeEmail,
  fetchRecentBlogs,
  fetchUpcomingEvents,
};
