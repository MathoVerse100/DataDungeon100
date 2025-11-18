from api.auth.login import generator as login
from api.auth.logout import generator as logout
from api.auth.register import generator as register
from api.auth.verify_registration import generator as verify_registration


paths = [
    login,
    logout,
    register,
    verify_registration,
]