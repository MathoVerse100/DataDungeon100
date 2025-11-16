from spa.auth.login import generator as login
from spa.auth.logout import generator as logout
from spa.auth.register import generator as register
from spa.auth.verify_registration import generator as verify_registration


paths = [
    login,
    logout,
    register,
    verify_registration,
]