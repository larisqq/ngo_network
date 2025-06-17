import axios from "axios";
global.axios = axios; // Make axios globally available

export const sendVerificationEmail = async (to, token) => {
  const apiKey = process.env.BREVO_API_KEY;
  const verificationLink = `http://localhost:5173/verify?token=${token}`;

  console.log("📨 Sending email to:", to);
  console.log("🔑 BREVO_API_KEY is:", apiKey ? "LOADED ✅" : "MISSING ❌");

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "NGO Network", email: "larisateo2010@gmail.com" },
        to: [{ email: to }],
        subject: "Confirm your account on NGo Network",
        htmlContent: `
          <h2>Welcome to NGO Network!</h2>
          <p>Please confirm your email by clicking the link below:</p>
          <a href="${verificationLink}">Verify your account</a>
        `,
      },
      {
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Email sent via Brevo API:", response.data);
  } catch (error) {
    console.error(
      "❌ Failed to send email via Brevo API",
      error.response?.data || error.message
    );
    throw error;
  }
};
