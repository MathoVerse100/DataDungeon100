from email_validator import validate_email, EmailNotValidError
import smtplib
import os
from email.mime.text import MIMEText


def is_email(string):
    try:
        validate_email(string, check_deliverability=False)

        return True
    except EmailNotValidError:
        return False

def normalize_email(email):
    if is_email(email):
        return validate_email(email, check_deliverability=False).normalized

    raise EmailNotValidError("Invalid email")

def send_email(
    title: str,
    receivers: list,
    content: str,
    sender_email: str = os.getenv('app_email'),
    sender_password: str = os.getenv('app_password'),
):
    message['Subject'] = title
    message = MIMEText(content, _subtype='html')

    mail = smtplib.SMTP('smtp.gmail.com', 587)
    mail.starttls()
    mail.login(sender_email, sender_password)
    mail.sendmail(sender_email, receivers, message.as_string())
    mail.quit()

