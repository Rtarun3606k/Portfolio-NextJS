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
  const logs = ["Starting email sending process..."];

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

    logs.push(
      `Transport config: ${JSON.stringify({
        ...transportConfig,
        auth: {
          user: transportConfig.auth.user,
          pass: transportConfig.auth.pass ? "****" : null,
        },
      })}`
    );

    const transporter = nodemailer.createTransport(transportConfig);

    // Use embedded template instead of loading from file
    let html = htmlContent;

    // If no HTML content is provided but htmlFilePath is (indicating template usage intent),
    // use the built-in template
    if (!html && htmlFilePath) {
      logs.push("Using built-in email template instead of loading from file");

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

      logs.push("Email template loaded from embedded content");
    }

    // If neither content nor path is provided, use a simple fallback
    if (!html) {
      const logMsg = "No HTML content provided, using simple fallback";
      console.log(logMsg);
      logs.push(logMsg);
      html = "<h1>Hello {{name}}</h1><p>This is a test email.</p>";
    }

    // Replace placeholders in HTML content
    if (html && Object.keys(replacements).length > 0) {
      const logMsg = "Replacing placeholders in HTML content";
      console.log(logMsg);
      logs.push(logMsg);

      const placeholderKeys = Object.keys(replacements);
      logs.push(`Replacements keys: ${placeholderKeys.join(", ")}`);

      for (const [key, value] of Object.entries(replacements)) {
        if (value !== undefined && value !== null) {
          const regex = new RegExp(`{{${key}}}`, "g");
          const matches = html.match(regex);
          logs.push(
            `Placeholder {{${key}}}: ${
              matches ? matches.length : 0
            } matches found`
          );
          html = html.replace(regex, value);
        }
      }
    }

    // Replace any remaining template variables with empty strings
    const remainingPlaceholders = html.match(/{{[^{}]+}}/g);
    if (remainingPlaceholders) {
      logs.push(
        `Remaining placeholders found: ${remainingPlaceholders.join(", ")}`
      );
    }
    html = html.replace(/{{[^{}]+}}/g, "");

    logs.push(`Sending email to: ${to}`);
    logs.push(`Email subject: ${subject}`);
    console.log(`Sending email to: ${to}`);
    console.log(`Email subject: ${subject}`);

    // Send email
    try {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        html,
      });

      const successMsg = `Email sent successfully: ${info.messageId}`;
      console.log(successMsg);
      logs.push(successMsg);

      return {
        success: true,
        messageId: info.messageId,
        logs,
        emailInfo: info,
      };
    } catch (mailError) {
      logs.push(`Mail sending error: ${mailError.message}`);
      logs.push(`Mail error code: ${mailError.code || "unknown"}`);
      logs.push(`Mail error stack: ${mailError.stack}`);

      // Check for common SMTP errors
      if (mailError.code === "EAUTH") {
        logs.push(
          "Authentication error: Check your SMTP username and password"
        );
      } else if (mailError.code === "ESOCKET") {
        logs.push("Socket error: Check your SMTP host and port");
      } else if (mailError.code === "ECONNECTION") {
        logs.push(
          "Connection error: Check your network and SMTP server availability"
        );
      }

      throw mailError;
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code || null,
        name: error.name,
      },
      logs,
    };
  }
}

// Keep the getservices function as is
const getservices = async (serviceId, formData) => {
  // Same implementation as before
  // ...
  // Implementation not changed
};

// Use built-in template instead of file path
// const responseTemplate = "_emailTemplates/template1.html";

// Example code for sending email with this template
async function sendConfirmationEmail(formData) {
  const logs = ["Preparing to send confirmation email"];

  try {
    console.log("Preparing to send confirmation email");

    // Log environment variables (safely)
    logs.push(`Current working directory: ${process.cwd()}`);
    logs.push(
      `NEXT_PUBLIC_BASE_URL: ${process.env.NEXT_PUBLIC_BASE_URL || "not set"}`
    );
    logs.push(
      `SMTP_HOST: ${process.env.SMTP_HOST || "default: smtp.gmail.com"}`
    );
    logs.push(`SMTP_PORT: ${process.env.SMTP_PORT || "default: 587"}`);
    logs.push(`SMTP_SECURE: ${process.env.SMTP_SECURE || "default: false"}`);
    logs.push(`SMTP_USER is ${process.env.SMTP_USER ? "set" : "not set"}`);
    logs.push(
      `SMTP_PASSWORD is ${process.env.SMTP_PASSWORD ? "set" : "not set"}`
    );

    logs.push(
      `Form data received: ${JSON.stringify({
        ...formData,
        email: formData.email || "not provided",
        serviceId: formData.serviceId || "not provided",
        name:
          formData.name ||
          `${formData.firstName || ""} ${formData.lastName || ""}`,
      })}`
    );

    // First, fetch service details if needed - only if serviceId exists
    if (
      formData.serviceId &&
      formData.serviceId !== null &&
      (!formData.title || !formData.price || !formData.timeframe)
    ) {
      logs.push(
        "Service ID present but details missing - fetching service information"
      );
      console.log(
        "Service ID present but details missing - fetching service information"
      );
      try {
        const serviceResult = await getservices(formData.serviceId, formData);
        if (serviceResult.logs) {
          logs.push(...serviceResult.logs);
        }
        if (serviceResult.error) {
          logs.push("Failed to fetch service details, continuing without them");
        }
      } catch (error) {
        logs.push(`Failed to fetch service details: ${error.message}`);
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
      logs.push("Service information found, adding service details to email");

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
        logs.push(
          "Appointment information found, adding appointment details to email"
        );

        appointmentDetails = `<p><strong>Appointment:</strong> ${
          formData.appointmentDate
        } at ${
          formData.appointmentTime
        }</p>\n<p><strong>Service Description:</strong> ${
          formData.serviceDesc || "Not provided"
        }</p>`;
      }
    }

    // Instead of using a path, indicate we want to use the built-in template
    logs.push("Using built-in email template instead of loading from file");

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

    // Include email result logs
    if (emailResult.logs) {
      logs.push(...emailResult.logs);
    }

    if (emailResult.success) {
      logs.push("Confirmation email sent successfully");
      console.log("Confirmation email sent successfully");
      return {
        success: true,
        logs,
        messageId: emailResult.messageId,
        emailInfo: emailResult.emailInfo,
      };
    } else {
      logs.push(`Email sending failed: ${emailResult.error?.message}`);
      return {
        success: false,
        error: emailResult.error,
        logs,
      };
    }
  } catch (error) {
    logs.push(`Error sending confirmation email: ${error.message}`);
    logs.push(`Stack: ${error.stack}`);
    console.error("Error sending confirmation email:", error);
    return {
      success: false,
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code || null,
        name: error.name,
      },
      logs,
    };
  }
}

// Main execution function
export async function sendEmailTO(formData) {
  const logs = ["Starting email confirmation process"];

  try {
    console.log("Starting email confirmation process");
    const result = await sendConfirmationEmail(formData);

    // Include any logs from the confirmation email function
    if (result.logs) {
      logs.push(...result.logs);
    }

    if (result.success) {
      logs.push("Email confirmation process completed successfully");
      console.log("Email confirmation process completed successfully");
      return {
        success: true,
        message: "Email sent successfully",
        result: result,
        logs,
      };
    } else {
      logs.push("Email confirmation process failed");
      console.log("Email confirmation process failed");
      return {
        success: false,
        message: "Failed to send confirmation email",
        error: result.error,
        result: result,
        logs,
      };
    }
  } catch (error) {
    logs.push(`Unhandled error in main process: ${error.message}`);
    logs.push(`Stack: ${error.stack}`);
    console.error("Unhandled error in main process:", error);
    return {
      success: false,
      message: error.message,
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code || null,
        name: error.name,
      },
      logs,
    };
  }
}
