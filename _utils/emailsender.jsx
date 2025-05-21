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
  try {
    console.log("Starting email sending process...");

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "r.tarunnayaka25042005@gmail.com",
        pass: process.env.SMTP_PASSWORD || null,
      },
    });

    // Get HTML content from file if path is provided
    let html = htmlContent;
    if (htmlFilePath && !htmlContent) {
      try {
        console.log(`Reading HTML template from: ${htmlFilePath}`);
        // Use path.resolve to handle relative paths
        const resolvedPath = path.resolve(process.cwd(), htmlFilePath);
        html = await fs.readFile(resolvedPath, "utf8");
        console.log("HTML template loaded successfully");
      } catch (fileError) {
        console.error("Error reading HTML file:", fileError);
        throw new Error(`Failed to read HTML template: ${fileError.message}`);
      }
    }

    // If no HTML content is available, use a simple fallback
    if (!html) {
      console.log("No HTML content provided, using fallback");
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

    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

const getservices = async (serviceId, formData) => {
  try {
    console.log(`Fetching service details for ID: ${serviceId}`);
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/services/${serviceId}`,
      {
        method: "GET",
      }
    );

    if (!request.ok) {
      throw new Error(`Network response was not ok: ${request.status}`);
    }

    const data = await request.json();
    console.log("Service data retrieved:", data);

    // Update formData with service information
    formData.title = data.title;
    formData.serviceDesc = data.description;
    formData.price = data.price;
    formData.timeframe = data.timeframe;

    return data;
  } catch (error) {
    console.error("Error fetching service:", error);
    throw error;
  }
};

const responseTemplate = "_emailTemplates/template1.html";

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

    // Send the email
    await sendEmail({
      to: formData.email,
      from: "r.tarunnayaka25042005@gmail.com",
      subject: "Thank You for Contacting Me",
      htmlFilePath: responseTemplate,
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

    console.log("Confirmation email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return false;
  }
}

// Main execution function
export async function sendEmailTO(formData) {
  try {
    console.log("Starting email confirmation process");
    const result = await sendConfirmationEmail(formData);

    if (result) {
      console.log("Email confirmation process completed successfully");
      return { success: true };
    } else {
      console.log("Email confirmation process failed");
      return { success: false, message: "Failed to send confirmation email" };
    }
  } catch (error) {
    console.error("Unhandled error in main process:", error);
    return { success: false, message: error.message };
  }
}
