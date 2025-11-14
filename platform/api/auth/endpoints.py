from api.auth.login import generator as login
from api.auth.logout import generator as logout
from api.auth.register import generator as register
from api.auth.verify_registration import generator as verify_registration
from api.auth.verify_session_token import generator as verify_session_token


paths = [
    login,
    logout,
    register,
    verify_registration,
    verify_session_token,
]