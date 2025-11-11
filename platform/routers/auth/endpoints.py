from routers.auth.login import generator as login
from routers.auth.logout import generator as logout
from routers.auth.register import generator as register
from routers.auth.verify_registration import generator as verify_registration


paths = [
    login,
    logout,
    register,
    verify_registration,
]