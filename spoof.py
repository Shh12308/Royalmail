import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_spoofed_email(sender_email, recipient_email, subject, body, smtp_server, smtp_port, smtp_user, smtp_pass):
    # Create the MIME object
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = subject

    # Attach the email body
    msg.attach(MIMEText(body, 'plain'))

    try:
        # Connect to the SMTP server and send the email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_pass)
        text = msg.as_string()
        server.sendmail(sender_email, recipient_email, text)
        server.quit()
        print(f"Email sent to {recipient_email}!")
    except Exception as e:
        print(f"Error sending email: {e}")

# Example usage:
# Ensure that the `smtp_user` and `smtp_pass` correspond to the account you're using responsibly
send_spoofed_email(
    sender_email="youremail@example.com", 
    recipient_email="targetemail@example.com", 
    subject="Test Email Spoofing", 
    body="This is a test email for educational purposes.", 
    smtp_server="smtp.gmail.com", 
    smtp_port=587, 
    smtp_user="youremail@example.com", 
    smtp_pass="yourpassword"
)
