from email_validator import validate_email, EmailNotValidError

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
