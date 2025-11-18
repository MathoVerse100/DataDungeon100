from api.auth.login import generator as login
from api.auth.login import generator as logout
from api.auth.login import generator as register
from api.auth.login import generator as verify_registration


paths = [
    login,
    logout,
    register,
    verify_registration,
]