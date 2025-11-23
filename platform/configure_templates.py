from fastapi import FastAPI
from fastapi.templating import Jinja2Templates
from template_functions import template_functions
# from routers.endpoints import paths as routes

def configure_templates(app: FastAPI, templates: Jinja2Templates):

    templates.env.globals.update(template_functions)
    
    # for route in routes:
    #     route(app, templates)
