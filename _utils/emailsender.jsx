import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";

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
  // Initialize logs array at the start of the function
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

    // Get HTML content from file if path is provided
    let html = htmlContent;
    if (htmlFilePath && !htmlContent) {
      try {
        const logMsg = `Reading HTML template from: ${htmlFilePath}`;
        console.log(logMsg);
        logs.push(logMsg);

        // Use path.resolve to handle relative paths
        const resolvedPath = path.resolve(process.cwd(), htmlFilePath);
        logs.push(`Resolved template path: ${resolvedPath}`);

        // Check if file exists
        try {
          const fileExists = await fs
            .access(resolvedPath)
            .then(() => true)
            .catch(() => false);
          logs.push(`File exists check: ${fileExists}`);

          if (!fileExists) {
            // List files in directory to help diagnose the issue
            try {
              const dir = path.dirname(resolvedPath);
              const files = await fs.readdir(dir);
              logs.push(`Files in directory ${dir}: ${files.join(", ")}`);
            } catch (dirErr) {
              logs.push(`Could not read directory: ${dirErr.message}`);
            }
          }
        } catch (accessErr) {
          logs.push(`File access error: ${accessErr.message}`);
        }

        html = await fs.readFile(resolvedPath, "utf8");
        logs.push("HTML template loaded successfully");
        console.log("HTML template loaded successfully");
      } catch (fileError) {
        const errorMsg = `Error reading HTML file: ${fileError.message}`;
        console.error(errorMsg);
        logs.push(errorMsg);
        logs.push(`Stack: ${fileError.stack}`);
        throw new Error(`Failed to read HTML template: ${fileError.message}`);
      }
    }

    // If no HTML content is available, use a simple fallback
    if (!html) {
      const logMsg = "No HTML content provided, using fallback";
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
        logs, // Return logs array
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
      logs, // Return logs array even in error case
    };
  }
}

const getservices = async (serviceId, formData) => {
  // Initialize logs array at the start of the function
  const logs = [`Fetching service details for ID: ${serviceId}`];

  try {
    console.log(`Fetching service details for ID: ${serviceId}`);

    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/services/${serviceId}`;
    logs.push(`API URL: ${apiUrl}`);

    const request = await fetch(apiUrl, {
      method: "GET",
    });

    logs.push(`API response status: ${request.status}`);

    if (!request.ok) {
      const errorText = await request
        .text()
        .catch(() => "Could not read response text");
      logs.push(`Error response body: ${errorText}`);
      throw new Error(`Network response was not ok: ${request.status}`);
    }

    const data = await request.json();
    logs.push("Service data retrieved successfully");
    logs.push(`Service data: ${JSON.stringify(data)}`);

    // Update formData with service information
    formData.title = data.title;
    formData.serviceDesc = data.description;
    formData.price = data.price;
    formData.timeframe = data.timeframe;

    return {
      data,
      logs,
    };
  } catch (error) {
    console.error("Error fetching service:", error);
    logs.push(`Error fetching service: ${error.message}`);
    logs.push(`Error stack: ${error.stack}`);

    return {
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code || null,
        name: error.name,
      },
      logs,
    };
  }
};

const responseTemplate = "_emailTemplates/template1.html";

// Example code for sending email with this template
async function sendConfirmationEmail(formData) {
  // Initialize logs array at the start of the function
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

    // Template path
    const templatePath = responseTemplate;
    logs.push(`Email template path: ${templatePath}`);

    // Send the email
    const emailResult = await sendEmail({
      to: formData.email,
      from: "r.tarunnayaka25042005@gmail.com",
      subject: "Thank You for Contacting Me",
      htmlFilePath: templatePath,
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
        address: "Sampangi Rama Nagara Bangalore 560027, India",
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
  // Initialize logs array at the start of the function
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
