from api.auth_temp.login import generator as login
from api.auth_temp.logout import generator as logout
from api.auth_temp.register import generator as register
from api.auth_temp.verify_registration import generator as verify_registration
from api.auth_temp.verify_session_token import generator as verify_session_token


paths = [
    login,
    logout,
    register,
    verify_registration,
    verify_session_token,
]