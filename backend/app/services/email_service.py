import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

async def send_interview_report_email(email_to: str, candidate_name: str, role: str, score: int, feedback: str):
    """Sends a summary email to the candidate when their interview is completed."""
    subject = f"Flowzint - Your {role} Mock Interview Report"
    
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px; color: #0f172a;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          <h2 style="color: #5b52ff; margin-bottom: 20px;">Flowzint AI Interview Coach</h2>
          <p>Hi {candidate_name},</p>
          <p>Congratulations on completing your mock interview for the <strong>{role}</strong> position!</p>
          <div style="background-color: #5b52ff; color: #ffffff; border-radius: 12px; padding: 20px; text-align: center; margin: 25px 0;">
            <span style="font-size: 14px; text-transform: uppercase; tracking: 0.1em; opacity: 0.8;">Your Final Score</span>
            <h1 style="font-size: 48px; margin: 5px 0; font-weight: bold;">{score}%</h1>
          </div>
          <h3 style="color: #0f172a; margin-top: 25px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">AI Performance Feedback</h3>
          <div style="line-height: 1.6; color: #334155; font-size: 15px; white-space: pre-wrap;">{feedback}</div>
          <p style="margin-top: 35px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center;">
            This email was generated automatically by your Flowzint AI Interview Assistant.
          </p>
        </div>
      </body>
    </html>
    """
    
    logger.info(f"Preparing to email report to {email_to}")
    
    # Check if SMTP configuration is set.
    smtp_server = getattr(settings, "SMTP_SERVER", None)
    smtp_port = getattr(settings, "SMTP_PORT", 587)
    smtp_user = getattr(settings, "SMTP_USER", None)
    smtp_password = getattr(settings, "SMTP_PASSWORD", None)
    
    if not smtp_server or not smtp_user:
        # Mock Email Logging - prints to backend docker logs
        print(f"\n========================================\n[MOCK EMAIL SENT TO {email_to}]\nSubject: {subject}\n----------------------------------------\n{feedback}\n========================================\n", flush=True)
        logger.info("SMTP settings not configured. Logged mock report to backend logs.")
        return
        
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.EMAIL_SENDER
        msg["To"] = email_to
        msg.attach(MIMEText(html_content, "html"))
        
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(settings.EMAIL_SENDER, email_to, msg.as_string())
        logger.info(f"Email report successfully sent to {email_to}")
    except Exception as e:
        logger.error(f"Failed to send email to {email_to}: {e}")
