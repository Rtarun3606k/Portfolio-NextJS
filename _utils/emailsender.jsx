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
 * @returns {Promise<Object>} - Result of the email sending operation
 */
async function sendEmail({
  to,
  from,
  subject,
  htmlContent,
  htmlFilePath,
  replacements = {},
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

    // Use embedded template instead of loading from file
    let html = htmlContent;

    // If no HTML content is provided but htmlFilePath is (indicating template usage intent),
    // use the built-in template
    if (!html && htmlFilePath) {
      // Built-in email template (copied from your HTML)
      html = `
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
              <!-- <p><strong>Category:</strong> {{type}}</p> -->
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
          </div>
          <div class="footer">
            <p>© {{year}} Tarun Nayaka R. All rights reserved.</p>
            <p>{{address}}</p>
          </div>
        </body>
      </html>
      `;
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

    // Send email
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    console.log(`Email sent successfully: ${info.messageId}`);

    return {
      success: true,
      messageId: info.messageId,
      emailInfo: info,
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

    // Send the email - pass null for htmlFilePath to trigger use of built-in template
    const emailResult = await sendEmail({
      to: formData.email,
      from: "r.tarunnayaka25042005@gmail.com",
      subject: "Thank You for Contacting Me",
      htmlFilePath: "built-in-template", // This will trigger using the built-in template
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
      },
    });

    if (emailResult.success) {
      console.log("Confirmation email sent successfully");
      return {
        success: true,
        messageId: emailResult.messageId,
        emailInfo: emailResult.emailInfo,
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
      return {
        success: true,
        message: "Email sent successfully",
        result: result,
      };
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
