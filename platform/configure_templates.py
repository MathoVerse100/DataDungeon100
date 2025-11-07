from fastapi.templating import Jinja2Templates
from template_functions import template_functions

def configure_templates(templates: Jinja2Templates):

    templates.env.globals.update(template_functions)