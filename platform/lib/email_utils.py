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
    sender_email: str = os.getenv('APP_EMAIL'),
    sender_password: str = os.getenv('APP_PASSWORD'),
):
    message = MIMEText(content, _subtype='html')
    message['Subject'] = title

    mail = smtplib.SMTP('smtp.gmail.com', 587)
    mail.starttls()
    mail.login(sender_email, sender_password)
    mail.sendmail(sender_email, receivers, message.as_string())
    mail.quit()


def email_verification_html_body(name: str, link: str):
    html_content = f"""
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Verify Account</title>
            </head>
            <body style="margin: 0; padding: 0;">
                <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                        max-width: 400px;
                        margin: 0 auto;
                        border-radius: 1rem;
                        padding: 1em;
                        background: #f5f5f5;
                    "
                >
                    <tr>
                        <td align="center">
                            <h1 style="
                                color: blue;
                                font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                                font-weight: 1000;
                                margin: 0;
                                padding: 0;
                            ">
                                Verify Account
                            </h1>
                            <p style="
                                font-size: 0.75rem;
                                color: gray;
                                margin: 0;
                                padding: 0;
                                font-weight: bold;
                                font-family: Arial, Helvetica, sans-serif;
                                margin-top: 0.25em;
                            ">
                                This token will expire in 15 minutes!
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding-top:1em; font-family:sans-serif; font-size:0.75rem;">
                            <h2 style="font-weight: bold; font-family: sans-serif;">Hello {name}!</h2>
                            <p style="
                                overflow-wrap: break-word;
                                word-wrap: break-word;
                                font-family: sans-serif;
                                font-size: 0.75rem;
                            ">
                                Welcome to DataDungeon100, where learning and entertainment combine to provide
                                the best social media experience!<br><br>

                                Just one more step to become a fellow dweller... click the button below to verify your account.
                                Once you do, then all that's left is to login, and DONE!<br><br>

                                Welcome to the club, {name}!
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding-top:1em;">
                            <a
                                href="{link}" target="_blank" rel="noopener noreferrer"
                                style="
                                    background-color: blue;
                                    color:white;
                                    font-family:monospace, sans-serif;
                                    font-weight: bold;
                                    padding: 1em 2em;
                                    border-radius: 1rem; 
                                    text-decoration:none;
                                    display: inline-block;
                                    box-shadow: 0 4px 6px darkblue;
                                "
                            >
                                Verify Account
                            </a>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    """

    return html_content
